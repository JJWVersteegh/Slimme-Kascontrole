import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const authHeader = req.headers.get('Authorization') || ''
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user: sessionUser } } = await anonClient.auth.getUser()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-27.acacia' as any })

    const { email, user_id, boekjaar, vereniging_id, naam, vereniging, adres, postcode, plaats, kortingscode } = await req.json()

    // Verifieer dat user_id overeenkomt met ingelogde gebruiker
    if (user_id && user_id !== sessionUser.id) {
      return NextResponse.json({ error: 'Niet toegestaan' }, { status: 403 })
    }
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.slimmekascontrole.nl'

    // Kortingscode opzoeken indien opgegeven
    let discounts: { promotion_code: string }[] | undefined = undefined
    if (kortingscode) {
      const promoCodes = await stripe.promotionCodes.list({ code: kortingscode, active: true, limit: 1 })
      if (promoCodes.data.length === 0) {
        return NextResponse.json({ kortingscodeError: 'Kortingscode ongeldig of verlopen.' })
      }
      discounts = [{ promotion_code: promoCodes.data[0].id }]
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['ideal', 'card'],
      mode: 'payment',
      customer_email: email,
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Slimme Kascontrole – Kascontrole boekjaar ${boekjaar || new Date().getFullYear()}`,
          },
          unit_amount: 5900,
        },
        quantity: 1,
      }],
      success_url: `${baseUrl}/betaald?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/mijn-omgeving`,
      metadata: {
        email: email || '',
        user_id: user_id || '',
        boekjaar: boekjaar || '',
        ...(vereniging_id ? { vereniging_id } : {}),
        ...(naam ? { naam } : {}),
        ...(vereniging ? { vereniging } : {}),
        ...(adres ? { adres } : {}),
        ...(postcode ? { postcode } : {}),
        ...(plaats ? { plaats } : {}),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
