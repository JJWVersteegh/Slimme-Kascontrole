import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const Stripe = (await import('stripe')).default
    const { createClient } = await import('@supabase/supabase-js')
    const { Resend } = await import('resend')
    const crypto = await import('crypto')

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-27.acacia' as any })
    const resend = new Resend(process.env.RESEND_API_KEY!)
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const body = await req.text()
    const sig = req.headers.get('stripe-signature')!
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

    let event: any
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const email = session.customer_email
      const plan = session.metadata?.plan || 'vereniging'
      const uploadToken = crypto.randomBytes(32).toString('hex')
      const tempPassword = crypto.randomBytes(16).toString('hex')
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://slimme-kascontrole.vercel.app'

      // Zoek bestaande gebruiker op
      const { data: existingUsers } = await supabase.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find((u: any) => u.email === email)

      let userId: string

      if (existingUser) {
        // Bestaande gebruiker — zet rapport_beschikbaar op true
        userId = existingUser.id
        await supabase.from('klanten').update({
          rapport_beschikbaar: true,
          plan,
          stripe_session_id: session.id,
        }).eq('user_id', userId)
      } else {
        // Nieuwe gebruiker aanmaken
        const { data: authData } = await supabase.auth.admin.createUser({
          email, password: tempPassword, email_confirm: true,
        })
        if (!authData.user) return NextResponse.json({ received: true })
        userId = authData.user.id
        await supabase.from('klanten').upsert({
          user_id: userId, email, plan,
          rapport_beschikbaar: true,
          upload_token: uploadToken,
          token_expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          stripe_session_id: session.id,
        })
      }

      // Stuur bevestigingsmail
      await resend.emails.send({
        from: 'Slimme Kascontrole <noreply@slimmekascontrole.nl>',
        to: email,
        subject: '✓ Betaling ontvangen – Uw rapport staat klaar',
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1e3a8a;padding:32px;text-align:center">
            <h1 style="color:white;margin:0">✓ Betaling ontvangen!</h1>
          </div>
          <div style="padding:40px 32px">
            <p>Bedankt voor uw bestelling van <strong>Slimme Kascontrole – ${plan}</strong>.</p>
            <p>Uw betaling is verwerkt. U kunt nu direct uw rapport genereren in uw omgeving.</p>
            <div style="text-align:center;margin:32px 0">
              <a href="${baseUrl}/mijn-omgeving" style="background:#2563EB;color:white;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:bold">Ga naar mijn omgeving →</a>
            </div>
          </div>
        </div>`,
      })
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}