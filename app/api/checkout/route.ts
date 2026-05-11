import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-27.acacia' as any })

    const { email, user_id, boekjaar, vereniging_id, naam, vereniging, adres, postcode, plaats } = await req.json()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.slimmekascontrole.nl'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['ideal', 'card'],
      mode: 'payment',
      customer_email: email,
      allow_promotion_codes: true,
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
