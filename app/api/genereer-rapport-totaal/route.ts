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
    // Max 2.5MB aan originele binaire data voor reguliere bestanden
    const MAX_BINARY_BYTES = 2.5 * 1024 * 1024
    let totalBinaryBytes = 0
    // MJOP krijgt eigen binary budget (los van reguliere bestanden)
    const MAX_MJOP_BINARY_BYTES = 4 * 1024 * 1024
    let mjopBinaryBytes = 0
    let mjopContent = ''

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
            bestandenVanUpload.push(`  [${bestandsnaam} — Excel]\n${sheetsText.join('\n\n').substring(0, 8000)}`)
          } else if (extensie === 'pdf') {
            const buffer = await data.arrayBuffer()
            // Probeer eerst tekst te extraheren (veel efficiënter in tokens dan binary)
            let pdfTekstGeladen = false
            try {
              const pdfModule = await import('pdf-parse')
              const pdfParse = pdfModule.default || pdfModule
              const pdfData = await (pdfParse as any)(Buffer.from(buffer))
              const tekst = pdfData.text?.trim()
              if (tekst && tekst.length > 50) {
                // PDF bevat leesbare tekst — stuur als tekst (max 12000 tekens)
                bestandenVanUpload.push(`  [${bestandsnaam} — PDF, ${pdfData.numpages} pagina's, tekst geëxtraheerd]\n${tekst.substring(0, 12000)}`)
                pdfTekstGeladen = true
              }
            } catch { /* pdf-parse mislukt → fallback naar binary */ }

            if (!pdfTekstGeladen) {
              // Gescande PDF of extractie mislukt → stuur als binary als het past
              if (totalBinaryBytes + buffer.byteLength <= MAX_BINARY_BYTES) {
                const base64 = Buffer.from(buffer).toString('base64')
                binaryBlocks.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } })
                totalBinaryBytes += buffer.byteLength
                bestandenVanUpload.push(`  [${bestandsnaam} — PDF (gescand), bijgevoegd als afbeelding]`)
              } else {
                bestandenVanUpload.push(`  [${bestandsnaam} — PDF (gescand), ${Math.round(buffer.byteLength / 1024)}KB — te groot om bij te voegen, overgeslagen]`)
              }
            }
          } else if (['png', 'jpg', 'jpeg'].includes(extensie)) {
            const buffer = await data.arrayBuffer()
            if (totalBinaryBytes + buffer.byteLength <= MAX_BINARY_BYTES) {
              const base64 = Buffer.from(buffer).toString('base64')
              const mimeType = extensie === 'png' ? 'image/png' : 'image/jpeg'
              binaryBlocks.push({ type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } })
              totalBinaryBytes += buffer.byteLength
              bestandenVanUpload.push(`  [${bestandsnaam} — afbeelding, bijgevoegd]`)
            } else {
              bestandenVanUpload.push(`  [${bestandsnaam} — afbeelding, ${Math.round(buffer.byteLength / 1024)}KB — te groot om bij te voegen, overgeslagen]`)
            }
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

      // Verwerk MJOP-bestanden apart
      for (const mjopPad of (upload.mjop_bestanden || [])) {
        const { data: mjopData, error: mjopError } = await supabase.storage
          .from('kascontrole-bestanden')
          .download(mjopPad)
        if (mjopError || !mjopData) continue
        const mjopNaam = mjopPad.split('/').pop() || ''
        try {
          const mjopBuffer = await mjopData.arrayBuffer()
          let tekst = ''
          try {
            const pdfModule = await import('pdf-parse')
            const pdfParse = pdfModule.default || pdfModule
            const pdfData = await (pdfParse as any)(Buffer.from(mjopBuffer))
            tekst = pdfData.text?.trim() || ''
          } catch { /* tekst extractie mislukt, probeer binary */ }

          if (tekst && tekst.length > 50) {
            mjopContent += `[${mjopNaam} — ${Math.round(mjopBuffer.byteLength / 1024)}KB, tekst geëxtraheerd]\n${tekst.substring(0, 20000)}\n\n`
          } else if (mjopBinaryBytes + mjopBuffer.byteLength <= MAX_MJOP_BINARY_BYTES) {
            // MJOP gebruikt eigen binary budget (los van reguliere bestanden)
            const base64 = Buffer.from(mjopBuffer).toString('base64')
            binaryBlocks.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } })
            mjopBinaryBytes += mjopBuffer.byteLength
            mjopContent += `[${mjopNaam} — PDF bijgevoegd als document voor AI-analyse]\n\n`
          } else {
            mjopContent += `[${mjopNaam} — ${Math.round(mjopBuffer.byteLength / 1024)}KB — bestand te groot (max 4MB). Comprimeer het PDF-bestand en upload opnieuw.]\n\n`
          }
        } catch (e: any) {
          mjopContent += `[${mjopNaam} — kon niet worden uitgelezen: ${e.message}]\n\n`
        }
      }
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
ABSOLUTE REGEL: GEEN VERZONNEN DATA
═══════════════════════════════════════════
Dit is de belangrijkste regel van dit rapport. Overtreedt hem nooit:

VERBODEN — doe dit NOOIT:
- Bedragen, namen, datums of rekeningen invullen die NIET letterlijk in de uploads staan
- Tabellen vullen met nul-waarden, schattingen, gemiddelden of "typische" bedragen
- Voorbeeldcijfers gebruiken zoals "bijv. € 1.000,00" of "circa € X"
- Een sectie schrijven alsof er data is, terwijl die er niet is
- Ontbrekende kolommen aanvullen op basis van wat "logisch lijkt"

GETALLEN EN ADRESSEN — EXTRA STRENG:
- Kopieer huisnummers, appartementnummers, rekeningnummers en elk ander getal ALTIJD teken voor teken exact zoals ze in de bron staan. Nooit afronden, nooit omzetten, nooit "corrigeren".
- Controleer elk getal dat je overneemt: lees het opnieuw terug in de brontekst vóór je het schrijft. Als je twijfelt of een cijfer 6, 8 of 0 is → schrijf "–" en vermeld dat het onleesbaar is.
- Adressen (straatnaam + huisnummer) letterlijk overnemen zoals in de brontekst. Nooit zelf een huisnummer aanvullen of afleiden uit context.
- Als hetzelfde adres op meerdere plekken in de documenten staat maar de huisnummers verschillen → benoem de tegenstrijdigheid expliciet: "In [bestand A] staat huisnummer X, in [bestand B] staat Y. Nader te controleren door de kascommissie."

VERPLICHT bij ontbrekende data:
- Cijfer ontbreekt in een tabel → schrijf "–"
- Hele sectie heeft geen onderliggende data → schrijf: "Geen [type] aangeleverd in de stukken. Deze sectie kan niet worden ingevuld." en sla de tabel over
- Onduidelijke kolomnaam of interpretatie nodig → label ALTIJD expliciet: ⚠️ Aanname: [wat je aanneemt en waarom]
- Bestand niet uitgelezen of overgeslagen → benoem dit in sectie 1

═══════════════════════════════════════════
TWEE SOORTEN INHOUD
═══════════════════════════════════════════
1. CIJFERS & FEITEN → Gebruik UITSLUITEND bedragen, namen, datums en rekeningen die letterlijk in de uploads staan. Geen enkele uitzondering. Liever een lege tabel of "–" dan een verzonnen getal.

2. ANALYSE & UITLEG → Bondig en scherp. Alleen conclusies trekken die direct volgen uit de aangeleverde data. Geen oordelen over zaken waarvoor geen data beschikbaar is.

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
WETTELIJKE VERPLICHTINGEN VvE — KENNISBASIS
═══════════════════════════════════════════
Als kascontroleur voor een VvE moet je weten welke verplichtingen er gelden. Controleer in de aangeleverde stukken of de VvE hieraan voldoet en of er voorzieningen/reserveringen voor zijn opgenomen.

FINANCIEEL & ORGANISATORISCH (wettelijk verplicht):
- Reservefonds: minimaal 0,5% herbouwwaarde/jaar storten ÓF conform goedgekeurd MJOP (art. 5:126 BW, verplicht per jan 2021). Reservefonds moet op aparte bankrekening op naam VvE staan.
- MJOP (Meerjarenonderhoudsplan): verplicht, minimaal 10 jaar vooruit, maximaal 5 jaar oud (art. 5:126 BW)
- Opstalverzekering: verplicht op basis van modelreglement; herbouwwaarde periodiek controleren
- WA-verzekering: verplicht voor aansprakelijkheid VvE
- KvK-inschrijving: verplicht voor actieve VvE
- Jaarlijkse ALV: verplicht voor vaststelling begroting en jaarrekening
- VvE-bijdragen: alle leden verplicht te betalen (art. 5:113 BW); achterstanden inbaar

TECHNISCHE VERPLICHTINGEN (met kosten in begroting/MJOP verwacht):
- CENTRALE ROOKGASAFVOER (CLV): De VvE is verantwoordelijk voor beheer, onderhoud en keuring van gemeenschappelijke rookgasafvoerkanalen. Verplicht gecertificeerd (Gasketelwet, 1 april 2023). Bij vervanging (levensduur >15 jaar) zijn dit VvE-kosten. Moet in MJOP staan.
- LIFTEN: Periodieke keuring elke 18 maanden verplicht (Warenwetbesluit Liften). Keuringskosten zijn VvE-kosten. Lift-onderhoud/vervanging in MJOP opnemen.
- BRANDVEILIGHEID: Rookmelders verplicht in alle gemeenschappelijke ruimten én woningen (sinds 1 juli 2022). Brandblussers keuren (kwartaalcontrole + herbeproeving elke 5 jaar). Vluchtwegen vrij houden. Dit zijn terugkerende VvE-kosten.
- ASBESTINVENTARISATIE: Verplicht voor gebouwen van vóór 1994 bij bouw-/sloopwerkzaamheden. Rapport max. 3 jaar geldig. Dit zijn kosten bij elk groot onderhoudsproject.
- ENERGIELABEL: Verplicht bij verkoop/verhuur. Nieuw labelformaat verplicht per 29 mei 2026.
- LEGIONELLAPREVENTIE: Zorgplicht bij collectieve warm-watersystemen. Boiler minimaal op 60°C. Risicobeheersplan aanbevolen.
- DAK, GEVEL, FUNDERING, TRAPPENHUIZEN: gemeenschappelijke delen, volledig VvE-verantwoordelijkheid, opnemen in MJOP.

WAT DE KASCOMMISSIE CONTROLEERT:
1. Is het reservefonds aanwezig en voldoende gevuld (0,5% herbouwwaarde of conform MJOP)?
2. Is het MJOP aanwezig, actueel (max 5 jaar oud) en goedgekeurd door ALV?
3. Is de opstalverzekering actueel en op juiste herbouwwaarde?
4. Zijn er specifieke voorzieningen/reserveringen voor CLV, lift, brandveiligheid?
5. Zijn keuringskosten (lift, brandblussers) in de begroting opgenomen?
6. Zijn er achterstanden in VvE-bijdragen?

═══════════════════════════════════════════
MJOP — MEERJARENONDERHOUDSPLAN
═══════════════════════════════════════════
MJOP staat voor Meerjarenonderhoudsplan. Dit is een standaard en gebruikelijk onderdeel van een VvE-administratie.

VERPLICHTE KENNIS OVER MJOP:
- MJOP-kosten zijn GEEN bankkosten of financiële kosten — het zijn onderhoudskosten/reserveringskosten voor toekomstig onderhoud
- Een post als "Winter MJOP" of vergelijkbare MJOP-posten betreffen het OPSTELLEN of ACTUALISEREN van het MJOP-rapport (een extern adviesbureau rekent hiervoor)
- MJOP-reserveringen zijn bijdragen aan de reserves voor toekomstig groot onderhoud (dak, gevel, lift, etc.)
- MJOP-kosten zijn NORMAAL en VERWACHT voor een VvE — geen reden voor kritische bevindingen tenzij de kosten sterk afwijken van begroting
- Categoriseer MJOP altijd als "Onderhoud / MJOP" — nooit als "Bankkosten" of "Administratiekosten"

MJOP IN HET RAPPORT:
- Neem een apart hoofdstuk 3.X op: "MJOP — Meerjarenonderhoudsplan"
- Beschrijf de MJOP-kosten dit boekjaar (wat is er uitgegeven en waarvoor)
- Benoem de MJOP-reserveringen op de balans als die beschikbaar zijn
- Geef een doorkijk: welke grote onderhoudsposten staan de komende jaren gepland (alleen als MJOP-rapport beschikbaar is in de uploads)
- Als er geen MJOP beschikbaar is: adviseer de VvE een MJOP op te stellen

BREUKDELEN EN KOSTENVERDELING PER APPARTEMENT:
Voor de MJOP-analyse wil je weten hoeveel elke eigenaar extra moet bijdragen. Gebruik de volgende volgorde om de verdeling te bepalen:

STAP 1 — Zoek expliciete breukdelen in de stukken:
Kijk in de aangeleverde documenten naar termen als "breukdeel", "aandeel", "quote", "splitsingsakte", of tabellen met appartementen en bijbehorende fracties (bijv. "85/1000", "0,085", "8,5%").
→ Als gevonden: gebruik deze breukdelen voor de kostenverdeling.

STAP 2 — Leid breukdelen af uit de bijdragen per appartement:
Als er geen expliciete breukdelen zijn, zoek dan naar de maandelijkse of jaarlijkse bijdragen per appartement/eigenaar in de stukken (bijv. deelnemersoverzicht, incassolijst, contributieoverzicht).
→ Bereken de verhouding: bijdrage appartement X / totale bijdragen alle appartementen = effectief aandeel van X.
→ Vermeld in het rapport: "Breukdelen afgeleid uit de bijdragen per appartement (niet ontleend aan splitsingsakte)."

STAP 3 — Gelijke verdeling als fallback:
Als er geen bijdragen per appartement beschikbaar zijn, deel dan de MJOP-kosten gelijk over het aantal appartementen.
→ Vermeld: "Exacte bedragen per appartement afhankelijk van breukdelen uit de splitsingsakte."

PRESENTATIE IN SECTIE 3.6:
Als breukdelen of bijdragenverhoudingen beschikbaar zijn → maak een tabel:
| Appartement | Aandeel | Huidige bijdrage/jaar | Benodigde bijdrage/jaar | Verschil |
Anders → geef alleen het totaalbedrag per jaar met de noot over breukdelen.

═══════════════════════════════════════════
NIET-FINANCIËLE DOCUMENTEN — ACTIEF GEBRUIKEN
═══════════════════════════════════════════
Naast de financiële exports kunnen gebruikers ook niet-financiële documenten uploaden. Lees deze actief en destilleer er relevante signalen uit voor het rapport. Gebruik ze als context bij de financiële bevindingen — niet als apart hoofdstuk, maar verweven door het rapport.

JAARVERSLAG:
- Benoem bestuursmededelingen over grote uitgaven of investeringen die terugkomen in de cijfers
- Signaleer als het jaarverslag melding maakt van problemen (lekkages, juridische kwesties, conflicten) die financiële gevolgen kunnen hebben
- Controleer of de toelichting in het jaarverslag consistent is met de werkelijke cijfers

ALV-NOTULEN / VERGADERNOTULEN:
- Zoek naar bestuursbesluiten over uitgaven, contracten of bijdrageverhogingen — controleer of deze terugkomen in de boekhouding
- Signaleer toezeggingen die nog niet zijn uitgevoerd of geboekt (bijv. "bestuur heeft toegezegd renovatie in 2025 te starten")
- Let op goedkeuringsbesluiten voor begroting of jaarrekening — zijn deze conform de aangeleverde stukken?

CORRESPONDENTIE (e-mail, brieven):
- Zoek naar afspraken met leveranciers of beheerder over tarieven, betalingstermijnen of kortingen — controleer of deze overeenkomen met de geboekte bedragen
- Signaleer klachten of geschillen met financiële impact (bijv. aannemer die meerwerk claimt, verzekeraar die uitkering weigert)
- Let op aankondigingen van prijsverhogingen of contractwijzigingen die de komende begroting beïnvloeden

FACTUREN (PDF):
- Controleer leveranciersnaam, bedrag en datum op overeenkomst met de geboekte posten
- Signaleer facturen die ontbreken in de boekhouding of waarvan het bedrag afwijkt
- Let op ongebruikelijke betalingsontvangers of bedragen die niet passen bij de omschrijving

ALGEMENE REGEL voor niet-financiële documenten:
- Citeer NOOIT lange tekstfragmenten — geef alleen de zakelijke kern
- Gebruik bevindingen uit deze documenten als onderbouwing bij de relevante sectie (bijv. een ALV-besluit over een renovatie hoort bij sectie 3.2 of 3.6)
- Als een document niets relevants bevat: noem het kort in sectie 1 en ga verder

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
MJOP-DOCUMENT (apart geüpload)
═══════════════════════════════════════════
${mjopContent ? `Het volgende MJOP-document is beschikbaar en moet worden verwerkt in sectie 3.6:

${mjopContent}

MJOP-ANALYSE — doe dit in sectie 3.6:
1. Welke onderdelen worden in het MJOP behandeld (dak, lift, gevel, etc.)?
2. Welke werkzaamheden staan gepland en in welke jaren?
3. Wat zijn de geraamde kosten per onderdeel / per jaar?
4. Wat is de totale benodigde jaarlijkse reservering conform het MJOP?
5. Vergelijk de huidige jaarlijkse dotaties (uit de financiële administratie) met de MJOP-vereisten:
   - Zijn de huidige dotaties toereikend?
   - Is er een jaarlijks tekort of overschot per onderdeel?
6. Geef een concreet advies: moet de VvE-bijdrage omhoog? Zo ja, met hoeveel per jaar en/of per lid?
Maak een overzichtelijke tabel met de geplande kosten per jaar.` : 'Geen MJOP-document geüpload. Adviseer de VvE het MJOP beschikbaar te stellen.'}

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
   - 3.6 MJOP — Meerjarenonderhoudsplan
   - 3.7 Wettelijke verplichtingen en voorzieningen
${boekjaren.length > 1 ? `   - 3.8 Trendanalyse ${boekjaren.join(' – ')}` : ''}
4. Advies aan de Algemene Ledenvergadering

---

## 1. OPDRACHT EN WERKZAAMHEDEN
Noem ALLEEN de bestandsnamen die daadwerkelijk zijn aangeleverd en uitgelezen. Geen generieke omschrijvingen. Als een bestand niet uitgelezen kon worden, vermeld dat expliciet. Maximaal 3-4 zinnen.

## 2. SAMENVATTING BEVINDINGEN
*(Opgesteld NA de volledige detailanalyse in sectie 3 — nooit andersom.)*

Gebruik alleen bevindingen die direct uit de data blijken. Geen oordelen over zaken zonder onderliggende data.
[KRITISCH] of [AKKOORD] of [AANDACHTSPUNT: ...] — met concrete bedragen uit de uploads. Maximaal 5-8 bullet points.

## 3. BEVINDINGEN BOEKJAAR ${huidigJaar} — HOOFDANALYSE

### 3.1 Balans en aansluiting banksaldi
Alleen invullen als er bankgegevens, balans of saldi in de uploads staan. Zijn die er niet → schrijf: "Geen balans- of bankgegevens aangeleverd."

| Bankrekening | Type | Beginsaldo 1 jan ${huidigJaar} | Eindsaldo 31 dec ${huidigJaar} | Mutatie |
| --- | --- | --- | --- | --- |
[Uitsluitend rijen invullen met gegevens die letterlijk in de uploads staan. Geen rij invullen als het saldo niet beschikbaar is.]

### 3.2 Inkoopfacturen en uitgaven
Alleen invullen als er factuur- of uitgavendata in de uploads staat. Zijn die er niet → schrijf: "Geen factuurgegevens aangeleverd."
Bespreek ALLEEN opvallende posten (afwijkingen >30%, ongebruikelijke betalingen). Geen beschrijving per leverancier als er niets bijzonders is.

| Leverancier | Totaalbedrag | Categorie |
| --- | --- | --- |
[Uitsluitend rijen met leveranciers en bedragen die letterlijk in de uploads staan.]

### 3.3 Exploitatieresultaat
Alleen invullen als er inkomsten/uitgaven of exploitatiedata in de uploads staat. Zijn die er niet → schrijf: "Geen exploitatiegegevens aangeleverd."
Bespreek alle posten met afwijking >30% — altijd met richting (hoger/lager) en concreet bedrag.

| Post | Werkelijk ${huidigJaar} | Begroting ${huidigJaar} | Afwijking | ${vorigeJaren.length > 0 ? `Werkelijk ${vorigeJaren[vorigeJaren.length - 1]} | Verschil` : ''} |
| --- | --- | --- | --- | ${vorigeJaren.length > 0 ? '--- | --- |' : ''} |
[Uitsluitend posten en bedragen die letterlijk in de uploads staan. Gebruik "–" als begroting of vorig jaar ontbreekt.]

### 3.4 Openstaande posten en bijzonderheden
Alleen vermelden als er concrete aanwijzingen voor zijn in de uploads. Niets te melden → laat deze sectie weg of schrijf: "Geen openstaande posten geconstateerd op basis van de aangeleverde stukken."

### 3.5 Contracten en abonnementen
Alleen invullen als er contractgegevens in de uploads staan. Zijn die er niet → laat deze sectie weg.
Zoek actief naar ALLE soorten abonnementen en terugkerende kosten in de uploads: verzekeringen (opstal, aansprakelijkheid, rechtsbijstand — ook als deze centraal via een beheerder worden betaald), beheercontracten, schoonmaak, liften, tuinonderhoud, kranten- en tijdschriftabonnementen, software, alarmsystemen, etc.
Let op: verzekeringen worden bij VvE's soms betaald via of doorgefactureerd door de vastgoedbeheerder/administrateur ("centraal beheer") — zoek ook in doorbelaste kosten of facturen van de beheerder naar verzekeringscomponenten. Vermeld elk abonnement en elke verzekering die je tegenkomt.

| Contract/Abonnement | Leverancier | Jaarlijkse kosten | Beoordeling |
| --- | --- | --- | --- |
[Uitsluitend contracten en abonnementen die letterlijk in de uploads staan.]

### 3.6 MJOP — Meerjarenonderhoudsplan
Altijd opnemen. MJOP-kosten zijn normale VvE-kosten voor toekomstig onderhoud.

**MJOP-kosten dit boekjaar:**
[Noem alle MJOP-gerelateerde uitgaven dit boekjaar: opstellen/actualiseren MJOP-rapport, MJOP-reserveringen/dotaties, etc. met bedragen uit de financiële administratie.]

**MJOP-reserves per 31-12-${huidigJaar}:**
[Benoem de stand per voorziening op de balans als beschikbaar. Tabel met voorziening | stand | dotatie dit jaar.]

${mjopContent ? `**Geplande werkzaamheden en meerjarenbegroting (uit MJOP-document):**
Maak een tabel op basis van het MJOP-document:

| Jaar | Onderdeel | Geraamde kosten |
| --- | --- | --- |
[Vul in op basis van het MJOP-document — alleen bedragen die daadwerkelijk in het MJOP staan]

**Toereikendheid reserveringen:**
[Vergelijk de huidige jaarlijkse dotaties met de MJOP-vereisten. Bereken het jaarlijkse tekort of overschot. Geef een concreet advies: is de huidige VvE-bijdrage voldoende of moet deze verhoogd worden, en zo ja met hoeveel per jaar?]` : `**Geplande onderhoudswerkzaamheden:**
Het MJOP-document is niet afzonderlijk geüpload. Op basis van de financiële administratie zijn de volgende reserveringen zichtbaar. Adviseer het bestuur het volledige MJOP bij de vergaderstukken te voegen zodat de ALV de toereikendheid kan beoordelen.`}

### 3.7 Wettelijke verplichtingen en voorzieningen
Beoordeel per onderstaand onderwerp of de VvE aantoonbaar voldoet op basis van de aangeleverde stukken. Gebruik drie statussen: ✅ Aantoonbaar geregeld | ⚠️ Onduidelijk / niet aangeleverd | ❌ Ontbreekt of onvoldoende

| Verplichting | Status | Toelichting |
| --- | --- | --- |
| Reservefonds (0,5% herbouwwaarde of MJOP-conform) | | |
| MJOP aanwezig en actueel (max. 5 jaar oud) | | |
| Opstalverzekering (herbouwwaarde) | | |
| WA-verzekering VvE | | |
| Centrale rookgasafvoer (CLV) — keuring/certificering | | |
| Liftkeuring (max. 18 maanden) | | |
| Brandveiligheid (rookmelders, brandblussers) | | |
| Asbestinventarisatie (bij gebouw vóór 1994) | | |

Vul alleen de rijen in waarvoor je aanwijzingen hebt in de uploads. Gebruik "⚠️ Niet aangeleverd" als er geen informatie over beschikbaar is — schrijf dan NIET dat het ontbreekt, maar dat de kascommissie dit nader moet opvragen bij het bestuur.

${boekjaren.length > 1 ? `### 3.8 Trendanalyse ${boekjaren.join(' – ')}
Alleen invullen met bedragen die voor elk jaar daadwerkelijk beschikbaar zijn. Gebruik "–" voor jaren zonder data. Geen schattingen of extrapolaties.

| Post | ${boekjaren.join(' | ')} | Trend |
| --- | ${boekjaren.map(() => '---').join(' | ')} | --- |
[Uitsluitend posten en bedragen die letterlijk in de uploads staan — geen schattingen.]` : ''}

## 4. ADVIES AAN DE ALGEMENE LEDENVERGADERING
Alleen adviseren op basis van wat daadwerkelijk geconstateerd is. Geen aanbevelingen doen over zaken waarvoor geen data beschikbaar was. Maximaal 3-5 zinnen: goedkeuring ja/nee/voorwaardelijk, concrete aanbevelingen, formele verklaring.

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
      const errBody = await response.json().catch(() => ({}))
      console.error('Claude API fout:', response.status, JSON.stringify(errBody))
      return NextResponse.json({ error: `API fout: ${response.status} — ${errBody?.error?.message || 'onbekend'}` }, { status: 500 })
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
