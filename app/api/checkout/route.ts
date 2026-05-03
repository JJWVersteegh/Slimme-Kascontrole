import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', { apiVersion: '2025-01-27.acacia' as any })

    const { plan, email, user_id, boekjaar } = await req.json()
    const amount = plan === 'koepel' ? 14900 : 5900
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.slimmekascontrole.nl'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['ideal', 'card'],
      mode: 'payment',
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Slimme Kascontrole – Kascontrole boekjaar ${boekjaar}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      success_url: `${baseUrl}/betaald?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/mijn-omgeving`,
      metadata: { plan, email, user_id, boekjaar },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}