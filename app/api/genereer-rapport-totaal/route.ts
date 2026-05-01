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

    const { user_id } = await req.json()

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

    const boekjaren = uploads.map(u => u.boekjaar).sort()
    const huidigJaar = boekjaren[boekjaren.length - 1]
    const vorigeJaren = boekjaren.slice(0, -1)

    const prompt = `Je bent een professionele kascontroleur voor Nederlandse verenigingen, VvE's en coöperaties met jarenlange ervaring.

OPDRACHTGEVER:
- Naam: ${naam}
- Vereniging/VvE: ${vereniging || 'Niet opgegeven'}
- KvK: ${kvk || 'Niet opgegeven'}
- E-mail: ${email}
- Primair boekjaar: ${huidigJaar}
${vorigeJaren.length > 0 ? `- Vergelijkingsjaren: ${vorigeJaren.join(', ')}` : ''}

GEÜPLOADE FINANCIËLE GEGEVENS (${uploads.length} upload(s)):
${uploadsContent.join('\n\n')}

Stel een volledig professioneel kascontrolerapport op in het Nederlands. Gebruik exact deze structuur:

# KASCOMMISSIE RAPPORT
## ${vereniging || 'Vereniging'} | Boekjaar ${boekjaren.join(' & ')} | Peildatum ${new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
*Opgesteld ten behoeve van de Algemene Ledenvergadering*

---

## INHOUDSOPGAVE
1. Opdracht en werkzaamheden
2. Samenvatting bevindingen
3. Bevindingen${boekjaren.map((j, i) => `\n   ${i + 3}. Boekjaar ${j}`).join('')}
${boekjaren.length > 1 ? `${boekjaren.length + 3}. Meerjarenoverzicht en trendanalyse` : ''}
${boekjaren.length + 4}. Advies aan de Algemene Ledenvergadering

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

${boekjaren.map((jaar, idx) => `
## ${idx + 3}. BEVINDINGEN BOEKJAAR ${jaar}

### ${idx + 3}.1 Balans en aansluiting banksaldi
Maak een tabel:
| Rekening | Beginsaldo | Eindsaldo |
| --- | --- | --- |
| [rekening] | €... | €... |
| **Totaal** | **€...** | **€...** |
| Verschil | | **€0,00 ✓** |

### ${idx + 3}.2 Inkoopfacturen
Analyse van facturen.

### ${idx + 3}.3 Exploitatieresultaat
| Post | Werkelijk ${jaar} | Begroting ${jaar} | Afwijking |
| --- | --- | --- | --- |
| Inkomsten | €... | €... | ... |
| Uitgaven | €... | €... | ... |
| **Exploitatieresultaat** | **€...** | **€...** | **...** |

### ${idx + 3}.4 Bijzonderheden
[AANDACHTSPUNT: beschrijving van elk aandachtspunt]
`).join('')}

${boekjaren.length > 1 ? `
## ${boekjaren.length + 3}. MEERJARENOVERZICHT EN TRENDANALYSE

Maak een vergelijkingstabel voor alle jaren:
| Post | ${boekjaren.join(' | ')} |
| --- | ${boekjaren.map(() => '---').join(' | ')} |
| Inkomsten | ... |
| Uitgaven | ... |
| Exploitatieresultaat | ... |

Analyseer trends en bijzonderheden over de jaren.
` : ''}

## ${boekjaren.length + 4}. ADVIES AAN DE ALGEMENE LEDENVERGADERING

Geef een duidelijk advies: GOEDKEURING, VOORWAARDELIJKE GOEDKEURING of AANHOUDING.
Beschrijf eventuele voorwaarden concreet.

*De kascommissie*
*${vereniging || 'Uw vereniging'}, ${new Date().toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}*

---
*Vertrouwelijk — uitsluitend bestemd voor leden · Opgesteld door slimmekascontrole.nl, een dienst van Vertras B.V.*

BELANGRIJK:
- Als bestanden binair zijn (PDF/Excel), werk dan met beschikbare informatie en geef aan wat nog aangeleverd moet worden
- Gebruik tabellen voor alle cijfers
- Wees specifiek en professioneel
- Bij meerdere jaren: analyseer trends expliciet`

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
