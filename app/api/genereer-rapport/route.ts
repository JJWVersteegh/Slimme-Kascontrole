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
          bestandsinhoud.push(`=== BESTAND: ${bestandsnaam} ===\n${tekst.substring(0, 6000)}`)
        } else {
          const buffer = await data.arrayBuffer()
          bestandsinhoud.push(`=== BESTAND: ${bestandsnaam} (${extensie.toUpperCase()}, ${Math.round(buffer.byteLength / 1024)}KB) ===`)
        }
      } catch {
        bestandsinhoud.push(`=== BESTAND: ${bestandsnaam} - kon niet worden uitgelezen ===`)
      }
    }

    const bestandenTekst = bestandsinhoud.join('\n\n')

    const prompt = `Je bent een professionele kascontroleur voor Nederlandse verenigingen.

KLANTGEGEVENS:
- Naam: ${naam}
- E-mail: ${email}
- Boekjaar: ${upload.boekjaar}
- Toelichting: ${upload.toelichting || 'Geen toelichting'}
- Aantal bestanden: ${upload.bestanden?.length || 0}

BESTANDSINHOUD:
${bestandenTekst || 'Geen leesbare tekstbestanden beschikbaar. Bestanden zijn wel ontvangen maar zijn in binair formaat (PDF/Excel).'}

Schrijf een volledig professioneel kascontrolerapport in het Nederlands met:
1. Opdracht
2. Bevindingen (balans, inkomsten/uitgaven, exploitatieresultaat, bijzonderheden)
3. Advies aan de ALV
4. Ondertekening

Als bestanden niet leesbaar zijn, geef aan welke informatie nog nodig is.
Markeer aandachtspunten met [AANDACHTSPUNT: tekst].
Opgesteld door slimmekascontrole.nl.`

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
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic error:', response.status, errText)
      return NextResponse.json({ error: `API fout: ${response.status}` }, { status: 500 })
    }

    const aiData = await response.json()
    const rapportTekst = aiData.content?.[0]?.text || ''

    if (!rapportTekst) {
      return NextResponse.json({ error: 'Geen rapport ontvangen van AI' }, { status: 500 })
    }

    await supabase.from('uploads').update({
      rapport_tekst: rapportTekst,
      rapport_gegenereerd_op: new Date().toISOString(),
    }).eq('id', upload_id)

    return NextResponse.json({ success: true, rapport: rapportTekst })
  } catch (err: any) {
    console.error('Rapport genereren fout:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}