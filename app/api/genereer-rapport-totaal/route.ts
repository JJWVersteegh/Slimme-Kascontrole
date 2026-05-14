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

    const prompt = `Je bent een ervaren kascontroleur voor Nederlandse verenigingen, VvE's en stichtingen. Je schrijft rapporten in begrijpelijke, gewone taal — alsof je het uitlegt aan een vrijwilliger zonder financiële achtergrond. Geen vakjargon, geen ingewikkelde zinnen. Wel volledig, scherp en professioneel.

═══════════════════════════════════════════
WERKWIJZE — VOLG DEZE VOLGORDE STRIKT
═══════════════════════════════════════════
1. Lees ALLE geüploade gegevens volledig door.
2. Schrijf EERST de volledige detailanalyse (secties 3.1 t/m 3.6).
3. Schrijf DAARNA pas de Samenvatting bevindingen (sectie 2) — GEBASEERD OP WAT JE IN DE DETAILANALYSE HEBT GEVONDEN.
4. De samenvatting moet 100% consistent zijn met de detailanalyse. Wat in de samenvatting staat, moet kloppen met de cijfers in de detailsecties. Nooit tegenstrijdige conclusies.

═══════════════════════════════════════════
TAAL EN OPMAAK
═══════════════════════════════════════════
- Het gehele rapport is in het Nederlands. Nooit Engelse woorden.
- Gebruik "Mutatie/Verschil" (niet "Change"), "Rekening" (niet "Account"), "Begroting" (niet "Budget").
- Alle geldbedragen met exact 2 decimalen en komma als decimaalteken: € 1.350,00. Nooit € 1350 of € 1.350.
- Gebruik een punt als duizendtalscheidingsteken: € 10.000,00.

═══════════════════════════════════════════
TWEE SOORTEN INHOUD
═══════════════════════════════════════════
1. CIJFERS & FEITEN → Nooit verzinnen. Gebruik ALLEEN bedragen, namen, datums en rekeningen die letterlijk in de uploads staan. Als een cijfer niet beschikbaar is: schrijf "–". Maak geen tabel als je geen enkele rij kunt invullen met echte data.

2. ANALYSE & UITLEG → Schrijf altijd volledig en scherp. Beschrijf wat je ziet, wat opvalt, wat goed gaat en wat aandacht verdient. Elke sectie verdient een inhoudelijke toelichting. "Geen gegevens beschikbaar" is ALLEEN acceptabel als er echt niets over die sectie in de uploads staat.

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
Beschrijf welke documenten zijn beoordeeld (met namen van bestanden en boekjaren) en welke werkzaamheden zijn verricht. Benoem expliciet dat de kascommissie heeft onderzocht of: banksaldi aansluiten, inkomsten en uitgaven correct zijn verantwoord, exploitatieresultaat juist is berekend, en openstaande posten verantwoord zijn.

## 2. SAMENVATTING BEVINDINGEN
⚠️ SCHRIJF DEZE SECTIE PAS NA DE VOLLEDIGE DETAILANALYSE. Elke punt hier moet overeenkomen met wat je in secties 3.1–3.6 hebt gevonden. Gebruik concrete bedragen.

**KRITISCH — vereist actie vóór goedkeuring**
[Beschrijf alleen echte kritische bevindingen met concrete bedragen. Als er geen zijn: "Geen kritieke bevindingen aangetroffen. De financiële administratie is in orde."]

**AANDACHT — ter bespreking in de vergadering**
[Beschrijf hier ALLE posten die meer dan 30% afwijken van begroting of vorig jaar, met de juiste richting (hoger/lager) en concrete bedragen. Voorbeeld: "Schoonmaakkosten sterk gedaald: werkelijk € 387,20 vs. € 5.840,67 in vorig jaar (daling 93%) — vraagt om verklaring." Nooit een onjuiste richting aangeven.]

**AKKOORD — geen actie vereist**
[Beschrijf wat er goed gaat, met concrete cijfers waar relevant.]

## 3. BEVINDINGEN BOEKJAAR ${huidigJaar} — HOOFDANALYSE

### 3.1 Balans en aansluiting banksaldi
Maak een tabel van alle bankrekeningen met begin- en eindsaldo en mutatie. Analyseer de toe- of afname van de kasstand en verklaar dit in relatie tot het exploitatieresultaat. Benoem of de saldi aansluiten met het grootboek.

| Bankrekening | Beginsaldo 1 jan ${huidigJaar} | Eindsaldo 31 dec ${huidigJaar} | Mutatie |
| --- | --- | --- | --- |
[Vul alleen echte bedragen in]

### 3.2 Inkoopfacturen en uitgaven
Maak een overzichtstabel van alle leveranciers met aantal facturen, totaalbedrag en categorie. Schrijf daarna een gedetailleerde analyse per leverancier. Vergelijk elke post met de begroting én met vorig jaar. Benoem alle afwijkingen >30% expliciet met richting en bedrag.

| Leverancier | Aantal facturen | Totaalbedrag | Categorie |
| --- | --- | --- | --- |
[Vul alleen echte bedragen in]

### 3.3 Exploitatieresultaat
Maak een tabel van alle inkomsten en uitgaven met werkelijk, begroot en afwijking. Analyseer het resultaat. Bespreek ELKE post met een afwijking >30% t.o.v. begroting of vorig jaar — altijd met de juiste richting (hoger/lager).

| Post | Werkelijk ${huidigJaar} | Begroting ${huidigJaar} | Afwijking | ${vorigeJaren.length > 0 ? `Werkelijk ${vorigeJaren[vorigeJaren.length - 1]} | Verschil vorig jaar` : ''} |
| --- | --- | --- | --- | ${vorigeJaren.length > 0 ? '--- | --- |' : ''} |
[Vul alleen echte bedragen in]

### 3.4 Openstaande posten
Analyseer alle debiteuren (wat eigenaren/leden schuldig zijn) en crediteuren (wat de vereniging schuldig is aan leveranciers). Maak tabellen van openstaande posten. Benoem betalingsachterstanden en beoordeel het incassobeleid. Als alles betaald is: benoem dit als positieve bevinding.

### 3.5 Contracten en abonnementen
Geef een overzicht van alle lopende contracten met leverancier, jaarlijkse kosten, looptijd en beoordeling. Beoordeel of contracten doelmatig zijn en of er besparingsmogelijkheden zijn.

| Contract | Leverancier | Jaarlijkse kosten | Vervaldatum | Beoordeling |
| --- | --- | --- | --- | --- |
[Vul alleen echte gegevens in]

### 3.6 Bijzonderheden boekjaar ${huidigJaar}
Beschrijf alle overige bijzonderheden die niet in de vorige secties zijn besproken maar wel relevant zijn voor de ALV.

${boekjaren.length > 1 ? `## 4. TRENDANALYSE ${boekjaren.join(' – ')}
Vergelijk de belangrijkste financiële posten over de beschikbare jaren. Maak een trendtabel ALLEEN met bedragen die daadwerkelijk in de uploads staan. Benoem trends: stijgend, dalend, stabiel. Geef een oordeel over de financiële ontwikkeling.

| Post | ${boekjaren.join(' | ')} | Trend |
| --- | ${boekjaren.map(() => '---').join(' | ')} | --- |
[Vul alleen echte bedragen in — geen schattingen]` : ''}

## ${boekjaren.length > 1 ? '5' : '4'}. ADVIES AAN DE ALGEMENE LEDENVERGADERING
Geef een concreet, onderbouwd advies. Beschrijf of de kascommissie de jaarrekening goedkeurt, met eventuele voorbehouden. Geef specifieke aanbevelingen op basis van de bevindingen. Sluit af met een formele verklaring.

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
        max_tokens: 16000,
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
