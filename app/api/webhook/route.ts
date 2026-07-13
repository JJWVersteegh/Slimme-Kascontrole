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
  amountTotal: number  // werkelijk betaald bedrag in centen incl. BTW
  kortingscode?: string
}) {
  const apiKey = process.env.MONEYBIRD_API_KEY
  if (!apiKey) return

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  let contactId: string | null = null
  const zoekRes = await fetch(
    `https://moneybird.com/api/v2/${MONEYBIRD_ADMIN_ID}/contacts?query=${encodeURIComponent(klant.email)}`,
    { headers }
  )
  const contacten = await zoekRes.json()

  if (contacten.length > 0) {
    contactId = contacten[0].id
  } else {
    const naamDelen = (klant.naam || '').trim().split(/\s+/).filter(Boolean)
    const nieuwContact = await fetch(
      `https://moneybird.com/api/v2/${MONEYBIRD_ADMIN_ID}/contacts`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contact: {
            company_name: klant.vereniging || klant.naam || klant.email,
            firstname: naamDelen[0] || 'Klant',
            lastname: naamDelen.slice(1).join(' ') || '',
            email: klant.email,
            address1: klant.adres || '',
            zipcode: klant.postcode || '',
            city: klant.plaats || '',
            country: 'NL',
            send_invoices_to_email: klant.email,
          }
        })
      }
    )

    if (!nieuwContact.ok) {
      console.error('Moneybird contact aanmaken mislukt:', await nieuwContact.text())
      return
    }

    const contactData = await nieuwContact.json()
    contactId = contactData.id
  }

  if (!contactId) {
    console.error('Moneybird contactId ontbreekt voor:', klant.email)
    return
  }

  // Prijzen incl. BTW — zo vermijden we afrondingsfouten bij de BTW-berekening.
  // Stripe geeft altijd een exact centbedrag terug; door incl. BTW te werken
  // klopt het factuurtotaal altijd precies met het betaalde bedrag.
  const volPrijsInclBTW = '59.00'                                    // €59,00 vaste prijs
  const betaaldInclBTW = (klant.amountTotal / 100).toFixed(2)        // werkelijk betaald
  const kortingInclBTW = ((5900 - klant.amountTotal) / 100).toFixed(2)  // verschil = korting
  const vandaag = new Date().toISOString().split('T')[0]
  const heeftKorting = klant.amountTotal < 5900  // ook bij 0 (100% korting)
  if (process.env.NODE_ENV === 'development') {
    console.log('Moneybird factuur — amountTotal:', klant.amountTotal, 'heeftKorting:', heeftKorting, 'kortingscode:', klant.kortingscode, 'kortingInclBTW:', kortingInclBTW)
  }

  const omschrijving = `Kascontrole boekjaar ${klant.boekjaar} — Slimme Kascontrole`
  const kortingOmschrijving = klant.kortingscode
    ? `Korting — kortingscode: ${klant.kortingscode}`
    : `Korting — promotieactie`

  // Bouw details: altijd volle prijs incl. BTW, en indien korting een negatieve kortingsregel
  // Belangrijk: tax_rate_id en ledger_account_id NIET meesturen als null — Moneybird verwerpt die dan
  const details: any[] = [{
    description: omschrijving,
    price: volPrijsInclBTW,
    amount: '1',
  }]

  if (heeftKorting) {
    details.push({
      description: kortingOmschrijving,
      price: `-${kortingInclBTW}`,
      amount: '1',
    })
  }

  const factuurRes = await fetch(
    `https://moneybird.com/api/v2/${MONEYBIRD_ADMIN_ID}/sales_invoices`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        sales_invoice: {
          contact_id: contactId,
          invoice_date: vandaag,
          due_date: vandaag,
          currency: 'EUR',
          prices_are_incl_tax: true,
          details_attributes: details,
          send_invoice: true,
        }
      })
    }
  )

  if (!factuurRes.ok) {
    console.error('Moneybird factuur aanmaken mislukt:', await factuurRes.text())
    return
  }

  const factuurData = await factuurRes.json()
  const factuurId = factuurData.id

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

    // Alleen betaling registreren als het bedrag groter dan €0 is
    if (klant.amountTotal > 0) {
      await fetch(
        `https://moneybird.com/api/v2/${MONEYBIRD_ADMIN_ID}/sales_invoices/${factuurId}/payments`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            payment: {
              payment_date: vandaag,
              price: betaaldInclBTW,
              price_base: betaaldInclBTW,
            }
          })
        }
      )
    }
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
    const sig = req.headers.get('stripe-signature')
    if (!sig) return NextResponse.json({ error: 'stripe-signature header ontbreekt' }, { status: 400 })
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
      const vereniging_id = session.metadata?.vereniging_id || null
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.slimmekascontrole.nl'

      let klantInfo = {
        naam: session.metadata?.naam || '',
        vereniging: session.metadata?.vereniging || '',
        email: email || session.metadata?.email || '',
        adres: session.metadata?.adres || '',
        postcode: session.metadata?.postcode || '',
        plaats: session.metadata?.plaats || '',
        boekjaar: boekjaar || new Date().getFullYear().toString(),
      }

      if (user_id && boekjaar) {
        // Sla betaling op met vereniging_id
        await supabase.from('rapporten').upsert({
          user_id,
          boekjaar,
          betaald: true,
          stripe_session_id: session.id,
          ...(vereniging_id ? { vereniging_id } : {}),
        }, { onConflict: 'user_id,boekjaar,vereniging_id' })

        // Haal klantgegevens op
        const { data: klantData } = await supabase
          .from('klanten')
          .select('naam, telefoon')
          .eq('user_id', user_id)
          .single()

        // Haal verenigingsgegevens op
        let verenigingNaam = ''
        let adres = ''
        let postcode = ''
        let plaats = ''

        if (vereniging_id) {
          const { data: vData } = await supabase
            .from('verenigingen')
            .select('naam, adres, postcode, plaats')
            .eq('id', vereniging_id)
            .single()
          if (vData) {
            verenigingNaam = vData.naam || ''
            adres = vData.adres || ''
            postcode = vData.postcode || ''
            plaats = vData.plaats || ''
          }
        } else {
          // Fallback naar klanten tabel
          const { data: klantAdres } = await supabase
            .from('klanten')
            .select('vereniging, adres, postcode, plaats')
            .eq('user_id', user_id)
            .single()
          if (klantAdres) {
            verenigingNaam = klantAdres.vereniging || ''
            adres = klantAdres.adres || ''
            postcode = klantAdres.postcode || ''
            plaats = klantAdres.plaats || ''
          }
        }

        klantInfo = {
          naam: klantData?.naam || '',
          vereniging: verenigingNaam,
          email: email || '',
          adres,
          postcode,
          plaats,
          boekjaar,
        }
      } else if (email) {
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
              ...(vereniging_id ? { vereniging_id } : {}),
            }, { onConflict: 'user_id,boekjaar,vereniging_id' })
          }
          await supabase.from('klanten').update({
            naam: klantInfo.naam || null,
            vereniging: klantInfo.vereniging || null,
            adres: klantInfo.adres || null,
            postcode: klantInfo.postcode || null,
            plaats: klantInfo.plaats || null,
          }).eq('user_id', authData.user.id)

          klantInfo.email = email || klantInfo.email
          klantInfo.boekjaar = boekjaar || klantInfo.boekjaar
        }
      }

      // Haal kortingscode en werkelijk betaald bedrag op via expanded session
      let kortingscode: string | undefined
      let amountTotal = session.amount_total ?? 5900  // tijdelijk, wordt overschreven door expanded
      try {
        const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['total_details.breakdown.discounts.discount.promotion_code'],
        })
        // Gebruik het bedrag uit de expanded session (betrouwbaarder dan webhook)
        amountTotal = expandedSession.amount_total ?? amountTotal
        const discounts = expandedSession.total_details?.breakdown?.discounts
        if (discounts && discounts.length > 0) {
          const discount = discounts[0]?.discount as any
          // Probeer kortingscode op meerdere manieren op te halen
          if (typeof discount?.promotion_code === 'object' && discount.promotion_code?.code) {
            kortingscode = discount.promotion_code.code
          } else if (typeof discount?.promotion_code === 'string') {
            // Als het een string is (ID), haal dan de volledige promotiecode op
            try {
              const promoCode = await stripe.promotionCodes.retrieve(discount.promotion_code)
              kortingscode = promoCode.code
            } catch {}
          }
        }
        if (process.env.NODE_ENV === 'development') {
          console.log('Stripe expanded — amountTotal:', amountTotal, 'kortingscode:', kortingscode, 'discounts:', JSON.stringify(discounts?.[0]))
        }
      } catch (e) {
        console.error('Kortingscode ophalen mislukt:', e)
      }

      // Moneybird factuur
      try {
        await maakMoneybirdFactuur({
          ...klantInfo,
          amountTotal,
          kortingscode,
        })
      } catch (e: any) {
        console.error('Moneybird factuur mislukt:', e?.message || e)
      }

      // Bevestigingsmail
      const bevestigingEmail = email || klantInfo.email
      if (!bevestigingEmail) return NextResponse.json({ received: true })
      await resend.emails.send({
        from: 'Slimme Kascontrole <noreply@vertras.nl>',
        to: bevestigingEmail,
        subject: `✓ Betaling ontvangen – Kascontrole boekjaar ${boekjaar}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#1e3a8a;padding:32px;text-align:center">
            <h1 style="color:white;margin:0">✓ Betaling ontvangen!</h1>
          </div>
          <div style="padding:40px 32px">
            <p>Bedankt voor uw betaling voor <strong>${klantInfo.vereniging ? klantInfo.vereniging + ' — ' : ''}kascontrole boekjaar ${boekjaar}</strong>.</p>
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
