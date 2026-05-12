import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(req: NextRequest) {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { rapport_boekjaar, vereniging_id } = await req.json()

    // Haal user_id uit de Authorization header
    const authHeader = req.headers.get("Authorization") || ""
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user: sessionUser } } = await anonClient.auth.getUser()
    if (!sessionUser) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 })
    }
    const user_id = sessionUser.id

    // Controleer of betaald voor dit boekjaar + vereniging
    const rapportQuery = supabase
      .from('rapporten')
      .select('betaald')
      .eq('user_id', user_id)
      .eq('boekjaar', rapport_boekjaar)

    if (vereniging_id) rapportQuery.eq('vereniging_id', vereniging_id)

    const { data: rapportRecord } = await rapportQuery.single()

    if (!rapportRecord?.betaald) {
      return NextResponse.json({ error: 'Niet betaald voor dit boekjaar' }, { status: 403 })
    }

    // Haal uploads op gefilterd op vereniging
    const uploadsQuery = supabase
      .from('uploads')
      .select('*')
      .eq('user_id', user_id)
      .order('boekjaar', { ascending: true })

    if (vereniging_id) uploadsQuery.eq('vereniging_id', vereniging_id)

    const { data: uploads } = await uploadsQuery

    if (!uploads || uploads.length === 0) {
      return NextResponse.json({ error: 'Geen uploads gevonden' }, { status: 404 })
    }

    // Klantgegevens
    const { data: userData } = await supabase.auth.admin.getUserById(user_id)
    const email = userData?.user?.email || ''

    const { data: klantData } = await supabase
      .from('klanten')
      .select('naam')
      .eq('user_id', user_id)
      .single()

    const naam = klantData?.naam || ''

    // Verenigingsgegevens ophalen
    let verenigingNaam = ''
    let kvk = ''
    let adres = ''
    let postcode = ''
    let plaats = ''

    if (vereniging_id) {
      const { data: vData } = await supabase
        .from('verenigingen')
        .select('*')
        .eq('id', vereniging_id)
        .single()
      if (vData) {
        verenigingNaam = vData.naam || ''
        kvk = vData.kvk || ''
        adres = vData.adres || ''
        postcode = vData.postcode || ''
        plaats = vData.plaats || ''
      }
    } else {
      // Fallback naar klanten tabel voor bestaande gebruikers
      const { data: klantAdres } = await supabase
        .from('klanten')
        .select('vereniging, kvk, adres, postcode, plaats')
        .eq('user_id', user_id)
        .single()
      if (klantAdres) {
        verenigingNaam = klantAdres.vereniging || ''
        kvk = klantAdres.kvk || ''
        adres = klantAdres.adres || ''
        postcode = klantAdres.postcode || ''
        plaats = klantAdres.plaats || ''
      }
    }

    // Bestanden inlezen
    const uploadsContent: string[] = []
    for (const upload of uploads) {
      const bestandenVanUpload: string[] = []
      for (const bestandspad of (upload.bestanden || [])) {
        const { data, error } = await supabase.storage
          .from('kascontrole-bestanden')
          .download(bestandspad)
        if (error || !data) continue
        const bestandsnaam = bestandspad.split('/').pop() || ''
        const extensie = bestandsnaam.split('.').pop()?.toLowerCase() || ''
        try {
          if (['csv', 'txt'].includes(extensie)) {
            const tekst = await data.text()
            bestandenVanUpload.push(`  [${bestandsnaam}]\n${tekst.substring(0, 8000)}`)
          } else if (['xlsx', 'xls', 'xlsm', 'ods'].includes(extensie)) {
            // Excel bestanden uitlezen en omzetten naar tekst voor de AI
            const XLSX = await import('xlsx')
            const buffer = await data.arrayBuffer()
            const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
            const sheetsText: string[] = []
            for (const sheetName of workbook.SheetNames) {
              const ws = workbook.Sheets[sheetName]
              // Zet sheet om naar array van rijen
              const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
              // Filter lege rijen eruit
              const gevuldeRijen = rows.filter((r: any[]) => r.some((cel: any) => cel !== '' && cel !== null && cel !== undefined))
              if (gevuldeRijen.length === 0) continue
              // Formatteer als leesbare tekst (max 300 rijen per sheet)
              const rijen = gevuldeRijen.slice(0, 300).map((rij: any[]) =>
                rij.map((cel: any) => {
                  if (cel === '' || cel === null || cel === undefined) return ''
                  if (typeof cel === 'number') return Number.isInteger(cel) ? cel.toString() : cel.toFixed(2)
                  if (cel instanceof Date) return cel.toLocaleDateString('nl-NL')
                  return String(cel).trim()
                }).join('\t')
              ).join('\n')
              sheetsText.push(`  --- Tabblad: ${sheetName} ---\n${rijen}`)
            }
            bestandenVanUpload.push(`  [${bestandsnaam} — Excel]\n${sheetsText.join('\n\n').substring(0, 12000)}`)
          } else {
            const buffer = await data.arrayBuffer()
            bestandenVanUpload.push(`  [${bestandsnaam} — ${extensie.toUpperCase()}, ${Math.round(buffer.byteLength / 1024)}KB — formaat niet ondersteund]`)
          }
        } catch (e: any) {
          bestandenVanUpload.push(`  [${bestandsnaam} — kon niet worden uitgelezen: ${e.message}]`)
        }
      }
      uploadsContent.push(
        `=== BOEKJAAR ${upload.boekjaar} ===\n` +
        `Toelichting: ${upload.toelichting || 'Geen'}\n` +
        `Bestanden:\n${bestandenVanUpload.join('\n')}`
      )
    }

    const alleBoekjaren = uploads.map(u => u.boekjaar).sort()
    const huidigJaar = rapport_boekjaar || alleBoekjaren[alleBoekjaren.length - 1]
    const vorigeJaren = alleBoekjaren.filter(j => j < huidigJaar)
    const volgendeJaren = alleBoekjaren.filter(j => j > huidigJaar)
    const boekjaren = alleBoekjaren.filter(j => j <= huidigJaar)

    const prompt = `Je bent een kascontroleur voor Nederlandse verenigingen, VvE's en stichtingen. Je schrijft rapporten in begrijpelijke, gewone taal — alsof je het uitlegt aan een vrijwilliger zonder financiële achtergrond. Geen vakjargon, geen ingewikkelde zinnen. Wel volledig en professioneel.

TAAL: Het gehele rapport is in het Nederlands. Alle kolomnamen in tabellen zijn Nederlands. Gebruik nooit Engelse woorden. Gebruik "Mutatie" of "Verschil" (niet "Change" of "Verchange"), "Rekening" (niet "Account"), "Begroting" (niet "Budget"), enzovoort.

⚠️ TWEE SOORTEN INHOUD — LEES DIT GOED:

1. CIJFERS & FEITEN → Nooit verzinnen. Gebruik alleen bedragen, namen, datums en rekeningen die letterlijk in de uploads staan. Als een cijfer niet beschikbaar is, laat het veld leeg of schrijf "–". Maak geen tabel aan als je geen enkele rij kunt invullen met echte data.

2. ANALYSE & UITLEG → Schrijf altijd volledig. Op basis van de beschikbare data schrijf je een uitgebreide, professionele analyse per sectie. Beschrijf wat je ziet, wat opvalt, wat goed gaat en wat aandacht verdient. Zelfs als een sectie weinig cijfers heeft, schrijf je een goede inhoudelijke toelichting. Een sectie mag nooit leeg blijven als er data is om over te schrijven.

Kort gezegd: verzin geen cijfers, maar schrijf wél altijd een volledige analyse.

⚠️ KOLOMMEN IN EXCEL — BELANGRIJK:
Bestanden kunnen meerdere kolommen bevatten zoals "begroting", "werkelijk" en "begroting volgend jaar".
Gebruik voor de kascontrole ALTIJD de kolom met werkelijke gerealiseerde cijfers — dit is de kolom met een naam zoals "werkelijk", "werkelijk t/m [datum]", "realisatie", of "gerealiseerd".
Gebruik begrotingskolommen alleen ter vergelijking (om afwijkingen te benoemen), nooit als primaire cijfers.
Als een bestand alleen begrotingscijfers bevat zonder werkelijke kolom, benoem dat dan expliciet in het rapport.

OPDRACHTGEVER:
- Kascommissielid: ${naam || 'Niet opgegeven'}
- Adres kascommissielid: ${adres ? `${adres}, ${postcode} ${plaats}` : 'Niet opgegeven'}
- Vereniging / VvE: ${verenigingNaam || 'Niet opgegeven'}
- KvK vereniging: ${kvk || 'Niet opgegeven'}
- E-mail: ${email}
- RAPPORT BOEKJAAR (waar het rapport over gaat): ${huidigJaar}
${vorigeJaren.length > 0 ? `- Voorgaande jaren (voor trendanalyse): ${vorigeJaren.join(', ')}` : ''}
${volgendeJaren.length > 0 ? `- Volgend jaar beschikbaar (ALLEEN voor controle openstaande posten): ${volgendeJaren.join(', ')}` : ''}

ROL VAN ELK JAAR:
- Boekjaar ${huidigJaar}: DIT is het hoofdonderwerp. Schrijf hier een volledige analyse over.
${vorigeJaren.length > 0 ? `- Jaren ${vorigeJaren.join(', ')}: Alleen gebruiken voor trendvergelijking.` : ''}
${volgendeJaren.length > 0 ? `- Jaar ${volgendeJaren.join(', ')}: NIET analyseren. Alleen voor controle openstaande posten.` : ''}

GEÜPLOADE FINANCIËLE GEGEVENS (${uploads.length} upload(s)):
${uploadsContent.join('\n\n')}

Stel een volledig professioneel kascontrolerapport op in het Nederlands. Het rapport gaat over boekjaar ${huidigJaar}. Gebruik exact deze structuur:

# KASCOMMISSIE RAPPORT
## ${verenigingNaam || 'Vereniging'} | Boekjaar ${huidigJaar} | Peildatum ${new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
*Kascommissielid: ${naam || 'Onbekend'}${adres ? ` · ${adres}, ${postcode} ${plaats}` : ''}*
*Opgesteld ten behoeve van de Algemene Ledenvergadering*

---

## INHOUDSOPGAVE
1. Opdracht en werkzaamheden
2. Samenvatting bevindingen
3. Bevindingen boekjaar ${huidigJaar} (hoofdanalyse)
   - 3.1 Balans en aansluiting banksaldi
   - 3.2 Inkoopfacturen en uitgaven
   - 3.3 Exploitatieresultaat
   - 3.4 Openstaande posten
   - 3.5 Contracten en abonnementen
   - 3.6 Bijzonderheden
${boekjaren.length > 1 ? `4. Trendanalyse ${boekjaren.join(' – ')}\n5. Advies aan de Algemene Ledenvergadering` : '4. Advies aan de Algemene Ledenvergadering'}

---

## 1. OPDRACHT EN WERKZAAMHEDEN
Beschrijf welke documenten zijn beoordeeld en welke werkzaamheden zijn verricht.

## 2. SAMENVATTING BEVINDINGEN

| KRITISCH — vereist actie vóór goedkeuring |
| --- |
| beschrijving |

| AANDACHT — ter bespreking in de vergadering |
| --- |
| beschrijving |

| AKKOORD — geen actie vereist |
| --- |
| beschrijving |

## 3. BEVINDINGEN BOEKJAAR ${huidigJaar} — HOOFDANALYSE

### 3.1 Balans en aansluiting banksaldi
Schrijf een volledige analyse van de balans en banksaldi. Als er saldi beschikbaar zijn in de uploads, maak dan een tabel:
| Rekening | Beginsaldo | Eindsaldo |
| --- | --- | --- |
Vul alleen echte bedragen in. Laat cellen leeg (–) als het bedrag niet in de data staat. Voeg altijd een tekstuele toelichting toe over wat je ziet in de banksaldi.

### 3.2 Inkoopfacturen en uitgaven
Schrijf een volledige analyse van alle facturen en uitgaven in ${huidigJaar}. Beschrijf de uitgavenpatronen, grootste kostenposten, en eventuele bijzonderheden. Gebruik alleen namen en bedragen die in de uploads staan. Als er transacties zijn, maak dan een overzichtstabel van de grootste posten.

### 3.3 Exploitatieresultaat
Schrijf een volledige analyse van het financiële resultaat. Als inkomsten en uitgaven beschikbaar zijn, maak dan een tabel:
| Post | Werkelijk ${huidigJaar} | Begroting ${huidigJaar} | Afwijking |
| --- | --- | --- | --- |
Vul alleen echte bedragen in. Laat cellen leeg (–) als het bedrag niet beschikbaar is. Voeg altijd een tekstuele toelichting toe over het resultaat.

### 3.4 Openstaande posten
Schrijf een analyse van openstaande debiteuren en crediteuren. Als er openstaande posten in de uploads staan, maak dan een tabel met de posten. Als er geen openstaande posten zijn, benoem dat expliciet als positief bevinding.

### 3.5 Contracten en abonnementen
Schrijf een analyse van de contracten en abonnementen. Als contracten vermeld worden in de uploads, maak dan een tabel:
| Contract | Leverancier | Jaarlijkse kosten | Vervaldatum | Beoordeling |
| --- | --- | --- | --- | --- |
Vul alleen echte gegevens in uit de uploads. Als er geen contractinformatie beschikbaar is, schrijf dat dan kort.

### 3.6 Bijzonderheden boekjaar ${huidigJaar}

${boekjaren.length > 1 ? `## 4. TRENDANALYSE ${boekjaren.join(' – ')}
Maak een trendtabel ALLEEN met bedragen die daadwerkelijk in de uploads staan voor de jaren ${boekjaren.join(', ')}. Vul geen lege vakken in met schattingen of fictieve bedragen.` : ''}

## ${boekjaren.length > 1 ? '5' : '4'}. ADVIES AAN DE ALGEMENE LEDENVERGADERING

*De kascommissie*
*${verenigingNaam || 'Uw vereniging'}, ${new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}*

---
*Vertrouwelijk · Opgesteld door slimmekascontrole.nl, een dienst van Vertras B.V.*

BELANGRIJK:
- Schrijf altijd een volledige, uitgebreide analyse — een kort rapport is NIET goed genoeg.
- Gebruik tabellen voor cijfers waar de data beschikbaar is; laat cellen leeg (–) als een specifiek getal ontbreekt.
- Verzin nooit bedragen, namen of datums die niet in de uploads staan.
- Schrijf wél altijd een volledige tekstuele analyse en toelichting, ook als er weinig cijfers zijn.
- Elke sectie moet inhoudelijk zijn — "Geen gegevens beschikbaar" is alleen acceptabel als er echt niets over die sectie in de uploads staat.`

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'API key niet geconfigureerd' }, { status: 500 })

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      return NextResponse.json({ error: `API fout: ${response.status}` }, { status: 500 })
    }

    const aiData = await response.json()
    const rapportTekst = aiData.content?.[0]?.text || ''
    if (!rapportTekst) return NextResponse.json({ error: 'Geen rapport ontvangen' }, { status: 500 })

    // Sla rapport op met vereniging_id
    await supabase.from('rapporten').upsert({
      user_id,
      boekjaar: huidigJaar,
      rapport_tekst: rapportTekst,
      betaald: true,
      gegenereerd_op: new Date().toISOString(),
      ...(vereniging_id ? { vereniging_id } : {}),
    }, { onConflict: 'user_id,boekjaar,vereniging_id' })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
