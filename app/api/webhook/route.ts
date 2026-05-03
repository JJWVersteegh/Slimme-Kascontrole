import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const Stripe = (await import('stripe')).default
    const { createClient } = await import('@supabase/supabase-js')
    const { Resend } = await import('resend')

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
      const boekjaar = session.metadata?.boekjaar
      const user_id = session.metadata?.user_id
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.slimmekascontrole.nl'

      if (user_id && boekjaar) {
        // Bestaande gebruiker — sla betaling op per boekjaar in rapporten tabel
        await supabase.from('rapporten').upsert({
          user_id,
          boekjaar,
          betaald: true,
          stripe_session_id: session.id,
        }, { onConflict: 'user_id,boekjaar' })
      } else if (email) {
        // Nieuwe gebruiker — maak account aan
        const crypto = await import('crypto')
        const tempPassword = crypto.randomBytes(16).toString('hex')
        const { data: authData } = await supabase.auth.admin.createUser({
          email, password: tempPassword, email_confirm: true,
        })
        if (authData.user) {
          await supabase.from('klanten').upsert({
            user_id: authData.user.id, email, plan,
            stripe_session_id: session.id,
          })
          if (boekjaar) {
            await supabase.from('rapporten').upsert({
              user_id: authData.user.id,
              boekjaar,
              betaald: true,
              stripe_session_id: session.id,
            }, { onConflict: 'user_id,boekjaar' })
          }
        }
      }

      // Bevestigingsmail
      await resend.emails.send({
        from: 'Slimme Kascontrole <noreply@slimmekascontrole.nl>',
        to: email,
        subject: `✓ Betaling ontvangen – Kascontrole boekjaar ${boekjaar}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1e3a8a;padding:32px;text-align:center">
            <h1 style="color:white;margin:0">✓ Betaling ontvangen!</h1>
          </div>
          <div style="padding:40px 32px">
            <p>Bedankt voor uw betaling voor <strong>kascontrole boekjaar ${boekjaar}</strong>.</p>
            <p>Uw geüploade bestanden staan klaar. Klik hieronder om uw rapport te genereren.</p>
            <div style="text-align:center;margin:32px 0">
              <a href="${baseUrl}/mijn-omgeving" style="background:#2563EB;color:white;padding:16px 32px;border-radius:8px;text-decoration:none;font-weight:bold">Genereer mijn rapport →</a>
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