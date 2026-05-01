import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { upload_id } = await req.json()

    const { data: upload } = await supabase
      .from('uploads')
      .select('*')
      .eq('id', upload_id)
      .single()

    if (!upload) return NextResponse.json({ error: 'Upload niet gevonden' }, { status: 404 })

    const { data: userData } = await supabase.auth.admin.getUserById(upload.user_id)
    const email = userData?.user?.email || ''
    const naam = userData?.user?.user_metadata?.naam || ''
    const vereniging = userData?.user?.user_metadata?.vereniging || ''
    const kvk = userData?.user?.user_metadata?.kvk || ''

    const bestandsinhoud: string[] = []

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
          bestandsinhoud.push(`=== BESTAND: ${bestandsnaam} ===\n${tekst.substring(0, 8000)}`)
        } else {
          const buffer = await data.arrayBuffer()
          bestandsinhoud.push(`=== BESTAND: ${bestandsnaam} (${extensie.toUpperCase()}, ${Math.round(buffer.byteLength / 1024)}KB) ===`)
        }
      } catch {
        bestandsinhoud.push(`=== BESTAND: ${bestandsnaam} — kon niet worden uitgelezen ===`)
      }
    }

    const bestandenTekst = bestandsinhoud.join('\n\n')

    const prompt = `Je bent een professionele kascontroleur voor Nederlandse verenigingen, VvE's en coöperaties. Je hebt jarenlange ervaring met het opstellen van kascontrolerapporten voor de Algemene Ledenvergadering (ALV).

GEGEVENS VAN DE OPDRACHTGEVER:
- Naam contactpersoon: ${naam}
- Vereniging/VvE: ${vereniging || 'Niet opgegeven'}
- KvK-nummer: ${kvk || 'Niet opgegeven'}
- E-mail: ${email}
- Boekjaar: ${upload.boekjaar}
- Toelichting: ${upload.toelichting || 'Geen toelichting'}
- Aantal geüploade bestanden: ${upload.bestanden?.length || 0}

GEÜPLOADE FINANCIËLE BESTANDEN:
${bestandenTekst || 'Bestanden zijn ontvangen maar konden niet als tekst worden uitgelezen (binaire bestanden zoals PDF/Excel).'}

INSTRUCTIES VOOR HET RAPPORT:

Stel een volledig, professioneel kascontrolerapport op in het Nederlands. Gebruik de volgende structuur en opmaak:

# KASCOMMISSIE RAPPORT
## [Naam vereniging] | Boekjaar [jaar] | Peildatum [huidige datum]
*Opgesteld ten behoeve van de Algemene Ledenvergadering*

---

## INHOUDSOPGAVE
1. Opdracht en werkzaamheden
2. Samenvatting bevindingen
3. Bevindingen (balans, facturen, exploitatieresultaat, bijzonderheden)
4. Meerjarenoverzicht (indien meerdere jaren)
5. Openstaande debiteuren (indien van toepassing)
6. Advies aan de Algemene Ledenvergadering

---

## 1. OPDRACHT EN WERKZAAMHEDEN

Beschrijf:
- Welke documenten zijn beoordeeld
- Welke werkzaamheden zijn verricht
- Wie de administratie voert

## 2. SAMENVATTING BEVINDINGEN

Gebruik drie categorieën:
- [KRITISCH] Bevindingen die vóór goedkeuring opgehelderd moeten worden
- [AANDACHT] Punten ter bespreking in de vergadering  
- [AKKOORD] Wat correct is bevonden

## 3. BEVINDINGEN

### 3.1 Balans en aansluiting banksaldi
Maak een tabel met:
| Rekening | Beginsaldo | Eindsaldo |
Controleer of totalen aansluiten en noteer: Verschil: €0,00 ✓ of ✗

### 3.2 Inkoopfacturen
Aantal facturen, volledigheid nummering, dubbele boekingen

### 3.3 Exploitatieresultaat
Maak een tabel met werkelijk vs begroting vs afwijking per post

### 3.4 Bijzonderheden en aandachtspunten
Gebruik [AANDACHTSPUNT: beschrijving] voor elk aandachtspunt

## 4. ADVIES AAN DE ALGEMENE LEDENVERGADERING

Kies één van:
- GOEDKEURING: alle bevindingen zijn akkoord
- VOORWAARDELIJKE GOEDKEURING: goedkeuring onder voorwaarden (beschrijf welke)
- AANHOUDING: te veel onduidelijkheden voor goedkeuring

Sluit af met ondertekening door "De kascommissie" met datum en plaatsnaam.

BELANGRIJK:
- Als bestanden niet leesbaar zijn, maak toch een professioneel rapport op basis van de beschikbare informatie en geef duidelijk aan welke informatie nog aangeleverd moet worden
- Gebruik tabellen waar mogelijk voor overzichtelijkheid
- Wees specifiek met bedragen als die beschikbaar zijn
- Het rapport wordt opgesteld door slimmekascontrole.nl, een dienst van Vertras B.V.
- Gebruik Markdown opmaak: ## voor secties, | voor tabellen, **bold** voor belangrijke bedragen`

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key niet geconfigureerd' }, { status: 500 })
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 6000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json({ error: `API fout: ${response.status}` }, { status: 500 })
    }

    const aiData = await response.json()
    const rapportTekst = aiData.content?.[0]?.text || ''

    if (!rapportTekst) {
      return NextResponse.json({ error: 'Geen rapport ontvangen' }, { status: 500 })
    }

    await supabase.from('uploads').update({
      rapport_tekst: rapportTekst,
      rapport_gegenereerd_op: new Date().toISOString(),
    }).eq('id', upload_id)

    return NextResponse.json({ success: true, rapport: rapportTekst })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
