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

    const { user_id, rapport_boekjaar } = await req.json()

    // Get all uploads for this user
    const { data: uploads } = await supabase
      .from('uploads')
      .select('*')
      .eq('user_id', user_id)
      .order('boekjaar', { ascending: true })

    if (!uploads || uploads.length === 0) {
      return NextResponse.json({ error: 'Geen uploads gevonden' }, { status: 404 })
    }

    // Get user info
    const { data: userData } = await supabase.auth.admin.getUserById(user_id)
    const email = userData?.user?.email || ''
    const naam = userData?.user?.user_metadata?.naam || ''
    const vereniging = userData?.user?.user_metadata?.vereniging || ''
    const kvk = userData?.user?.user_metadata?.kvk || ''

    // Read all files from all uploads
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
            bestandenVanUpload.push(`  [${bestandsnaam}]\n${tekst.substring(0, 5000)}`)
          } else {
            const buffer = await data.arrayBuffer()
            bestandenVanUpload.push(`  [${bestandsnaam} — ${extensie.toUpperCase()}, ${Math.round(buffer.byteLength / 1024)}KB]`)
          }
        } catch {
          bestandenVanUpload.push(`  [${bestandsnaam} — kon niet worden uitgelezen]`)
        }
      }

      uploadsContent.push(
        `=== BOEKJAAR ${upload.boekjaar} ===\n` +
        `Toelichting: ${upload.toelichting || 'Geen'}\n` +
        `Bestanden:\n${bestandenVanUpload.join('\n')}`
      )
    }

    const alleBoekjaren = uploads.map(u => u.boekjaar).sort()
    // Gebruik het door de gebruiker gekozen rapportboekjaar
    const huidigJaar = rapport_boekjaar || alleBoekjaren[alleBoekjaren.length - 1]
    // Vorige jaren = alles strikt vóór het rapportboekjaar
    const vorigeJaren = alleBoekjaren.filter(j => j < huidigJaar)
    // Volgend jaar = alles strikt ná het rapportboekjaar (voor openstaande posten)
    const volgendeJaren = alleBoekjaren.filter(j => j > huidigJaar)
    // Alle boekjaren voor trendanalyse (excl. toekomstige jaren)
    const boekjaren = alleBoekjaren.filter(j => j <= huidigJaar)

    const prompt = `Je bent een kascontroleur voor Nederlandse verenigingen, VvE's en stichtingen. Je schrijft rapporten in begrijpelijke, gewone taal — alsof je het uitlegt aan een vrijwilliger zonder financiële achtergrond. Geen vakjargon, geen ingewikkelde zinnen. Wel volledig en professioneel.

OPDRACHTGEVER:
- Naam: ${naam}
- Vereniging/VvE: ${vereniging || 'Niet opgegeven'}
- KvK: ${kvk || 'Niet opgegeven'}
- E-mail: ${email}
- RAPPORT BOEKJAAR (waar het rapport over gaat): ${huidigJaar}
${vorigeJaren.length > 0 ? `- Voorgaande jaren (voor trendanalyse): ${vorigeJaren.join(', ')}` : ''}
${volgendeJaren.length > 0 ? `- Volgend jaar beschikbaar (ALLEEN voor controle openstaande posten): ${volgendeJaren.join(', ')}` : ''}

ROL VAN ELK JAAR:
- Boekjaar ${huidigJaar}: DIT is het hoofdonderwerp. Schrijf hier een volledige analyse over.
${vorigeJaren.length > 0 ? `- Jaren ${vorigeJaren.join(', ')}: Alleen gebruiken voor trendvergelijking en om patronen over meerdere jaren te signaleren (bijv. iemand die al 3 jaar niet betaalt).` : ''}
${volgendeJaren.length > 0 ? `- Jaar ${volgendeJaren.join(', ')}: NIET analyseren. Alleen gebruiken om te kijken of openstaande bedragen uit ${huidigJaar} inmiddels zijn betaald.` : ''}

GEÜPLOADE FINANCIËLE GEGEVENS (${uploads.length} upload(s)):
${uploadsContent.join('\n\n')}

Stel een volledig professioneel kascontrolerapport op in het Nederlands. Het rapport gaat over boekjaar ${huidigJaar}. Gebruik exact deze structuur:

# KASCOMMISSIE RAPPORT
## ${vereniging || 'Vereniging'} | Boekjaar ${huidigJaar} | Peildatum ${new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
*Opgesteld ten behoeve van de Algemene Ledenvergadering*

---

## INHOUDSOPGAVE
1. Opdracht en werkzaamheden
2. Samenvatting bevindingen
3. Bevindingen boekjaar ${huidigJaar} (hoofdanalyse)
${boekjaren.length > 1 ? `4. Trendanalyse ${boekjaren.join(' – ')}\n5. Advies aan de Algemene Ledenvergadering` : '4. Advies aan de Algemene Ledenvergadering'}

---

## 1. OPDRACHT EN WERKZAAMHEDEN
Beschrijf welke documenten zijn beoordeeld en welke werkzaamheden zijn verricht.

## 2. SAMENVATTING BEVINDINGEN

Gebruik drie blokken:
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
Maak een tabel:
| Rekening | Beginsaldo | Eindsaldo |
| --- | --- | --- |
| [rekening] | €... | €... |
| **Totaal** | **€...** | **€...** |
| Verschil | | **€0,00 ✓** |

### 3.2 Inkoopfacturen en uitgaven
Volledige analyse van alle facturen en uitgaven in ${huidigJaar}.

### 3.3 Exploitatieresultaat
| Post | Werkelijk ${huidigJaar} | Begroting ${huidigJaar} | Afwijking |
| --- | --- | --- | --- |
| Inkomsten | €... | €... | ... |
| Uitgaven | €... | €... | ... |
| **Exploitatieresultaat** | **€...** | **€...** | **...** |

### 3.4 Openstaande posten
Controleer debiteuren en crediteuren per einde ${huidigJaar}. Gebruik gegevens uit het volgende jaar (indien aangeleverd) om te controleren of openstaande posten inmiddels zijn vereffend.

| Post | Bedrag | Status (op basis van volgend jaar) |
| --- | --- | --- |
| [debiteur/crediteur] | €... | Vereffend ✓ / Nog open ⚠️ |

### 3.5 Bijzonderheden boekjaar ${huidigJaar}
Beschrijf alle aandachtspunten specifiek voor dit boekjaar.

${boekjaren.length > 1 ? `
## 4. TRENDANALYSE ${boekjaren.join(' – ')}

Vergelijk alleen de hoofdlijnen over de jaren. Focus op opvallende patronen.

| Post | ${boekjaren.join(' | ')} | Trend |
| --- | ${boekjaren.map(() => '---').join(' | ')} | --- |
| Inkomsten | ... | ... |
| Uitgaven | ... | ... |
| Exploitatieresultaat | ... | ... |

Benoem expliciet meerjarige aandachtspunten, zoals een debiteur die meerdere jaren achtereen niet betaalt, of structureel stijgende kosten.
` : ''}

## ${boekjaren.length > 1 ? '5' : '4'}. ADVIES AAN DE ALGEMENE LEDENVERGADERING

Geef een duidelijk advies: GOEDKEURING, VOORWAARDELIJKE GOEDKEURING of AANHOUDING.
Beschrijf eventuele voorwaarden concreet.

*De kascommissie*
*${vereniging || 'Uw vereniging'}, ${new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}*

---
*Vertrouwelijk — uitsluitend bestemd voor leden · Opgesteld door slimmekascontrole.nl, een dienst van Vertras B.V.*

BELANGRIJK:
- Schrijf in begrijpelijke, gewone taal. Geen vakjargon. Schrijf alsof je het uitlegt aan een betrokken vrijwilliger.
- Noem het rapportjaar ALTIJD als ${huidigJaar}, niet als een ander jaar.
- Als bestanden binair zijn (PDF/Excel), werk dan met beschikbare informatie en geef aan wat nog aangeleverd moet worden.
- Gebruik tabellen voor alle cijfers.
- Bij meerdere jaren: analyseer trends in gewone taal (bijv. "De kosten zijn de afgelopen 3 jaar elk jaar gestegen met gemiddeld €500").
- Wees concreet: noem bedragen, datums en namen waar mogelijk.
- Houd zinnen kort en vermijd lange alinea's.`

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
      const errText = await response.text()
      return NextResponse.json({ error: `API fout: ${response.status}` }, { status: 500 })
    }

    const aiData = await response.json()
    const rapportTekst = aiData.content?.[0]?.text || ''

    if (!rapportTekst) return NextResponse.json({ error: 'Geen rapport ontvangen' }, { status: 500 })

    // Save to klanten table
    await supabase.from('klanten').update({
      rapport_tekst: rapportTekst,
      rapport_gegenereerd_op: new Date().toISOString(),
    }).eq('user_id', user_id)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}