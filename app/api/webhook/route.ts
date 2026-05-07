import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const MONEYBIRD_ADMIN_ID = '222382394444874819'

async function maakMoneybirdFactuur(klant: {
  naam: string
  vereniging: string
  email: string
  adres: string
  postcode: string
  plaats: string
  boekjaar: string
}) {
  const apiKey = process.env.MONEYBIRD_API_KEY
  if (!apiKey) return

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  // Stap 1: Zoek of maak contactpersoon aan
  let contactId: string | null = null

  const zoekRes = await fetch(
    `https://moneybird.com/api/v2/${MONEYBIRD_ADMIN_ID}/contacts?query=${encodeURIComponent(klant.email)}`,
    { headers }
  )
  const contacten = await zoekRes.json()

  if (contacten.length > 0) {
    contactId = contacten[0].id
  } else {
    // Nieuw contact aanmaken
    const nieuwContact = await fetch(
      `https://moneybird.com/api/v2/${MONEYBIRD_ADMIN_ID}/contacts`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contact: {
            company_name: klant.vereniging || klant.naam,
            firstname: klant.naam.split(' ')[0] || '',
            lastname: klant.naam.split(' ').slice(1).join(' ') || '',
            email: klant.email,
            address1: klant.adres,
            zipcode: klant.postcode,
            city: klant.plaats,
            country: 'NL',
            send_invoices_to_email: true,
          }
        })
      }
    )
    const contactData = await nieuwContact.json()
    contactId = contactData.id
  }

  if (!contactId) return

  // Stap 2: Maak factuur aan
  // €59 incl. 21% BTW = €48,76 excl. BTW
  const exclBTW = (5900 / 121).toFixed(2)
  const vandaag = new Date().toISOString().split('T')[0]

  const factuurRes = await fetch(
    `https://moneybird.com/api/v2/${MONEYBIRD_ADMIN_ID}/sales_invoices`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sales_invoice: {
          contact_id: contactId,
          invoice_date: vandaag,
          due_date: vandaag, // Al betaald via iDEAL
          currency: 'EUR',
          prices_are_incl_tax: false,
          details_attributes: [
            {
              description: `Kascontrole boekjaar ${klant.boekjaar} — Slimme Kascontrole`,
              price: exclBTW,
              amount: '1',
              tax_rate_id: null,
              ledger_account_id: null,
            }
          ],
          send_invoice: true,
        }
      })
    }
  )

  const factuurData = await factuurRes.json()
  const factuurId = factuurData.id

  // Stap 3: Verstuur de factuur
  if (factuurId) {
    await fetch(
      `https://moneybird.com/api/v2/${MONEYBIRD_ADMIN_ID}/sales_invoices/${factuurId}/send_invoice`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          sales_invoice_sending: {
            delivery_method: 'Email',
            email_address: klant.email,
            email_message: `Beste ${klant.naam || 'klant'},\n\nBedankt voor uw betaling. Bijgaand de factuur voor de kascontrole boekjaar ${klant.boekjaar}.\n\nMet vriendelijke groet,\nSlimme Kascontrole`,
          }
        })
      }
    )

    // Stap 4: Markeer als betaald (iDEAL betaling al ontvangen)
    await fetch(
      `https://moneybird.com/api/v2/${MONEYBIRD_ADMIN_ID}/sales_invoices/${factuurId}/payments`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          payment: {
            payment_date: vandaag,
            price: '59.00',
            price_base: '59.00',
            financial_account_id: null,
            financial_mutation_id: null,
          }
        })
      }
    )
  }

  return factuurData
}

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
      const boekjaar = session.metadata?.boekjaar
      const user_id = session.metadata?.user_id
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.slimmekascontrole.nl'

      let klantInfo = {
        naam: '',
        vereniging: '',
        email: email || '',
        adres: '',
        postcode: '',
        plaats: '',
        boekjaar: boekjaar || '',
      }

      if (user_id && boekjaar) {
        // Bestaande gebruiker — sla betaling op
        await supabase.from('rapporten').upsert({
          user_id,
          boekjaar,
          betaald: true,
          stripe_session_id: session.id,
        }, { onConflict: 'user_id,boekjaar' })

        // Haal klantgegevens op voor factuur
        const { data: klantData } = await supabase
          .from('klanten')
          .select('naam, vereniging, adres, postcode, plaats')
          .eq('user_id', user_id)
          .single()

        if (klantData) {
          klantInfo = {
            naam: klantData.naam || '',
            vereniging: klantData.vereniging || '',
            email: email || '',
            adres: klantData.adres || '',
            postcode: klantData.postcode || '',
            plaats: klantData.plaats || '',
            boekjaar: boekjaar,
          }
        }
      } else if (email) {
        // Nieuwe gebruiker — maak account aan
        const crypto = await import('crypto')
        const tempPassword = crypto.randomBytes(16).toString('hex')
        const { data: authData } = await supabase.auth.admin.createUser({
          email, password: tempPassword, email_confirm: true,
        })
        if (authData.user) {
          await supabase.from('klanten').upsert({
            user_id: authData.user.id, email,
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
          klantInfo.email = email
          klantInfo.boekjaar = boekjaar || ''
        }
      }

      // Moneybird factuur aanmaken en versturen
      try {
        await maakMoneybirdFactuur(klantInfo)
      } catch (e) {
        console.error('Moneybird factuur mislukt:', e)
        // Niet fataal — betaling is wel verwerkt
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
            <p>Uw factuur ontvangt u apart per e-mail van Moneybird.</p>
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
