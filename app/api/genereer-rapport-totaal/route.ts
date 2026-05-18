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
    let rapportQuery = supabase
      .from('rapporten')
      .select('betaald')
      .eq('user_id', user_id)
      .eq('boekjaar', rapport_boekjaar)

    if (vereniging_id) rapportQuery = rapportQuery.eq('vereniging_id', vereniging_id)

    const { data: rapportRecord } = await rapportQuery.single()

    if (!rapportRecord?.betaald) {
      return NextResponse.json({ error: 'Niet betaald voor dit boekjaar' }, { status: 403 })
    }

    // Haal uploads op gefilterd op vereniging
    let uploadsQuery = supabase
      .from('uploads')
      .select('*')
      .eq('user_id', user_id)
      .order('boekjaar', { ascending: true })

    if (vereniging_id) uploadsQuery = uploadsQuery.eq('vereniging_id', vereniging_id)

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
    const binaryBlocks: any[] = []  // PDF- en afbeeldingsblokken voor de Claude API

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
            const XLSX = await import('xlsx')
            const buffer = await data.arrayBuffer()
            const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })
            const sheetsText: string[] = []
            for (const sheetName of workbook.SheetNames) {
              const ws = workbook.Sheets[sheetName]
              const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
              const gevuldeRijen = rows.filter((r: any[]) => r.some((cel: any) => cel !== '' && cel !== null && cel !== undefined))
              if (gevuldeRijen.length === 0) continue
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
          } else if (extensie === 'pdf') {
            const buffer = await data.arrayBuffer()
            const base64 = Buffer.from(buffer).toString('base64')
            binaryBlocks.push({
              type: 'document',
              source: { type: 'base64', media_type: 'application/pdf', data: base64 },
              title: `${bestandsnaam} (boekjaar ${upload.boekjaar})`
            })
            bestandenVanUpload.push(`  [${bestandsnaam} — PDF, bijgevoegd als document]`)
          } else if (['png', 'jpg', 'jpeg'].includes(extensie)) {
            const buffer = await data.arrayBuffer()
            const base64 = Buffer.from(buffer).toString('base64')
            const mimeType = extensie === 'png' ? 'image/png' : 'image/jpeg'
            binaryBlocks.push({
              type: 'image',
              source: { type: 'base64', media_type: mimeType, data: base64 }
            })
            bestandenVanUpload.push(`  [${bestandsnaam} — afbeelding, bijgevoegd]`)
          } else if (['docx', 'doc'].includes(extensie)) {
            const mammoth = await import('mammoth')
            const buffer = await data.arrayBuffer()
            const result = await mammoth.extractRawText({ arrayBuffer: buffer })
            const tekst = result.value.trim().substring(0, 8000)
            if (tekst) {
              bestandenVanUpload.push(`  [${bestandsnaam} — Word document]\n${tekst}`)
            } else {
              bestandenVanUpload.push(`  [${bestandsnaam} — Word document, geen tekst uitgelezen]`)
            }
          } else if (extensie === 'heic') {
            bestandenVanUpload.push(`  [${bestandsnaam} — HEIC afbeelding, niet ondersteund — converteer naar JPG of PNG]`)
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

    const prompt = `Je bent een ervaren kascontroleur voor Nederlandse verenigingen, VvE's en stichtingen. Je schrijft rapporten in begrijpelijke, gewone taal — geen vakjargon, geen overbodige uitleg. Bondig, scherp en professioneel.

═══════════════════════════════════════════
LENGTE — STRIKT MAXIMUM
═══════════════════════════════════════════
Het volledige rapport beslaat MAXIMAAL 6 tot 8 A4-pagina's. Dit is een kascommissie rapport, geen jaarverslag.
- Schrijf per subsectie maximaal 1 alinea toelichting, tenzij er echt bijzonderheden zijn.
- Geen lange inleidingen of herhalingen van wat al in een tabel staat.
- Facturen: GEEN analyse per individuele leverancier. Alleen opvallende posten benoemen.
- Als een sectie niets bijzonders toevoegt: maak hem kort of laat hem weg.

═══════════════════════════════════════════
WERKWIJZE — VOLG DEZE VOLGORDE STRIKT
═══════════════════════════════════════════
1. Lees ALLE geüploade gegevens volledig door.
2. Schrijf EERST de volledige detailanalyse (secties 3.1 t/m 3.6).
3. Schrijf DAARNA pas de Samenvatting bevindingen (sectie 2) — GEBASEERD OP WAT JE IN DE DETAILANALYSE HEBT GEVONDEN.
4. De samenvatting moet 100% consistent zijn met de detailanalyse. Nooit tegenstrijdige conclusies.

═══════════════════════════════════════════
TAAL EN OPMAAK
═══════════════════════════════════════════
- Het gehele rapport is in het Nederlands. Nooit Engelse woorden.
- Gebruik "Mutatie/Verschil" (niet "Change"), "Rekening" (niet "Account"), "Begroting" (niet "Budget").
- Alle geldbedragen met exact 2 decimalen en komma als decimaalteken: € 1.350,00.
- Gebruik een punt als duizendtalscheidingsteken: € 10.000,00.

═══════════════════════════════════════════
AANNAMES — STRIKT VERBOD, TENZIJ EXPLICIET VERMELD
═══════════════════════════════════════════
Maak GEEN aannames. Als gegevens ontbreken of onduidelijk zijn:
- Schrijf "–" of "Niet beschikbaar uit de aangeleverde stukken" in tabellen.
- Als je onvermijdelijk een interpretatie moet maken (bijv. onduidelijke kolomnaam of onvolledige data): benoem dit ALTIJD expliciet met het label ⚠️ Aanname: gevolgd door wat je aanneemt en waarom.
- Interpreteer kolommen nooit anders dan hoe ze gelabeld zijn.
- Vul nooit ontbrekende cijfers in op basis van wat "logisch lijkt".

═══════════════════════════════════════════
TWEE SOORTEN INHOUD
═══════════════════════════════════════════
1. CIJFERS & FEITEN → Nooit verzinnen. Gebruik ALLEEN bedragen, namen, datums en rekeningen die letterlijk in de uploads staan. Als een cijfer niet beschikbaar is: schrijf "–". Maak geen tabel als je geen enkele rij kunt invullen met echte data.

2. ANALYSE & UITLEG → Bondig en scherp. Beschrijf wat opvalt, wat goed gaat en wat aandacht verdient. Geen overbodige opsommingen van wat al in de tabel staat.

═══════════════════════════════════════════
AFWIJKINGEN — ALTIJD SIGNALEREN
═══════════════════════════════════════════
Analyseer voor ELKE kostenpost en inkomstenpost:
A) Afwijking t.o.v. BEGROTING: Als werkelijk meer dan 30% afwijkt van begroot → benoem dit expliciet met de juiste richting:
   - "Lager dan begroot: werkelijk € X, begroot € Y (besparing € Z)"
   - "Hoger dan begroot: werkelijk € X, begroot € Y (overschrijding € Z)"

B) Afwijking t.o.v. VORIG JAAR: Als werkelijk meer dan 30% afwijkt van vorig jaar → benoem dit expliciet:
   - "Sterke daling t.o.v. ${vorigeJaren.length > 0 ? vorigeJaren[vorigeJaren.length - 1] : 'vorig jaar'}: van € X naar € Y (daling € Z, -XX%)"
   - "Sterke stijging t.o.v. ${vorigeJaren.length > 0 ? vorigeJaren[vorigeJaren.length - 1] : 'vorig jaar'}: van € X naar € Y (stijging € Z, +XX%)"

C) Elke afwijking >30% die je in de detailanalyse benoemt, MOET ook in de Samenvatting bevindingen (sectie 2) terugkomen als AANDACHT-punt — met de juiste richting (hoger/lager) en het concrete bedrag.

═══════════════════════════════════════════
KOLOMMEN IN EXCEL
═══════════════════════════════════════════
Gebruik ALTIJD de kolom met werkelijke gerealiseerde cijfers: "werkelijk", "realisatie", "gerealiseerd", "werkelijk t/m [datum]".
Gebruik begrotingskolommen ALLEEN ter vergelijking. Als een bestand alleen begrotingscijfers heeft: benoem dat expliciet.

═══════════════════════════════════════════
OPDRACHTGEVER
═══════════════════════════════════════════
- Kascommissielid: ${naam || 'Niet opgegeven'}
- Adres kascommissielid: ${adres ? `${adres}, ${postcode} ${plaats}` : 'Niet opgegeven'}
- Vereniging / VvE: ${verenigingNaam || 'Niet opgegeven'}
- KvK vereniging: ${kvk || 'Niet opgegeven'}
- E-mail: ${email}
- RAPPORT BOEKJAAR: ${huidigJaar}
${vorigeJaren.length > 0 ? `- Voorgaande jaren (voor trendanalyse): ${vorigeJaren.join(', ')}` : ''}
${volgendeJaren.length > 0 ? `- Volgend jaar (ALLEEN voor controle openstaande posten): ${volgendeJaren.join(', ')}` : ''}

ROL VAN ELK JAAR:
- Boekjaar ${huidigJaar}: DIT is het hoofdonderwerp. Volledige analyse.
${vorigeJaren.length > 0 ? `- Jaren ${vorigeJaren.join(', ')}: Alleen voor trendvergelijking en als referentie bij afwijkingen.` : ''}
${volgendeJaren.length > 0 ? `- Jaar ${volgendeJaren.join(', ')}: NIET analyseren. Alleen voor controle openstaande posten.` : ''}

═══════════════════════════════════════════
GEÜPLOADE FINANCIËLE GEGEVENS (${uploads.length} upload(s))
═══════════════════════════════════════════
${uploadsContent.join('\n\n')}

═══════════════════════════════════════════
RAPPORTSTRUCTUUR — GEBRUIK EXACT DEZE OPBOUW
═══════════════════════════════════════════

## INHOUDSOPGAVE
1. Opdracht en werkzaamheden
2. Samenvatting bevindingen
3. Bevindingen boekjaar ${huidigJaar} (hoofdanalyse)
   - 3.1 Balans en aansluiting banksaldi
   - 3.2 Inkoopfacturen en uitgaven
   - 3.3 Exploitatieresultaat
   - 3.4 Openstaande posten en bijzonderheden
   - 3.5 Contracten en abonnementen
${boekjaren.length > 1 ? `   - 3.6 Trendanalyse ${boekjaren.join(' – ')}` : ''}
4. Advies aan de Algemene Ledenvergadering

---

## 1. OPDRACHT EN WERKZAAMHEDEN
Maximaal 3-4 zinnen: welke documenten zijn beoordeeld en wat is onderzocht.

## 2. SAMENVATTING BEVINDINGEN
*(Opgesteld na de volledige detailanalyse in sectie 3.)*

[KRITISCH] of [AKKOORD] of [AANDACHTSPUNT: ...] — gebruik de juiste tags op basis van bevindingen. Gebruik concrete bedragen. Maximaal 5-8 bullet points totaal.

## 3. BEVINDINGEN BOEKJAAR ${huidigJaar} — HOOFDANALYSE

### 3.1 Balans en aansluiting banksaldi
Tabel van bankrekeningen met begin- en eindsaldo en mutatie. Daarna maximaal 1 alinea analyse.

| Bankrekening | Type | Beginsaldo 1 jan ${huidigJaar} | Eindsaldo 31 dec ${huidigJaar} | Mutatie |
| --- | --- | --- | --- | --- |
[Vul alleen echte bedragen in]

### 3.2 Inkoopfacturen en uitgaven
Overzichtstabel leveranciers (naam, totaalbedrag, categorie). Daarna: bespreek ALLEEN de opvallende posten (afwijkingen >30%, ongebruikelijke betalingen, ontbrekende facturen). Geen beschrijving per individuele leverancier als er niets bijzonders is.

| Leverancier | Totaalbedrag | Categorie |
| --- | --- | --- |
[Vul alleen echte bedragen in]

### 3.3 Exploitatieresultaat
Tabel inkomsten en uitgaven (werkelijk, begroot, afwijking). Bespreek het resultaat en alle posten met afwijking >30% — altijd met de juiste richting (hoger/lager).

| Post | Werkelijk ${huidigJaar} | Begroting ${huidigJaar} | Afwijking | ${vorigeJaren.length > 0 ? `Werkelijk ${vorigeJaren[vorigeJaren.length - 1]} | Verschil` : ''} |
| --- | --- | --- | --- | ${vorigeJaren.length > 0 ? '--- | --- |' : ''} |
[Vul alleen echte bedragen in]

### 3.4 Openstaande posten en bijzonderheden
Openstaande debiteuren/crediteuren én overige bijzonderheden (geannuleerde facturen, ontbrekende stukken, etc.). Maximaal 1 alinea per punt. Laat weg als er niets is.

### 3.5 Contracten en abonnementen
Overzicht van lopende contracten met leverancier, jaarlijkse kosten en beoordeling. Alleen opnemen als er contractgegevens in de uploads staan. Maximaal 1 alinea toelichting.

| Contract | Leverancier | Jaarlijkse kosten | Beoordeling |
| --- | --- | --- | --- |
[Vul alleen echte gegevens in]

${boekjaren.length > 1 ? `### 3.6 Trendanalyse ${boekjaren.join(' – ')}
Tabel met de belangrijkste posten over de beschikbare jaren. Maximaal 1 alinea conclusie.

| Post | ${boekjaren.join(' | ')} | Trend |
| --- | ${boekjaren.map(() => '---').join(' | ')} | --- |
[Vul alleen echte bedragen in — geen schattingen]` : ''}

## 4. ADVIES AAN DE ALGEMENE LEDENVERGADERING
Maximaal 3-5 zinnen: goedkeuring ja/nee/voorwaardelijk, concrete aanbevelingen, formele verklaring.

*De kascommissie*
*${verenigingNaam || 'Uw vereniging'}, ${new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}*

---
*Vertrouwelijk · Opgesteld door slimmekascontrole.nl, een dienst van Vertras B.V.*`

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
        model: 'claude-sonnet-4-6',
        max_tokens: 10000,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            ...binaryBlocks
          ]
        }],
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
