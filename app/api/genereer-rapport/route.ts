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

    // Get upload info
    const { data: upload } = await supabase
      .from('uploads')
      .select('*')
      .eq('id', upload_id)
      .single()

    if (!upload) return NextResponse.json({ error: 'Upload niet gevonden' }, { status: 404 })

    // Get user info
    const { data: userData } = await supabase.auth.admin.getUserById(upload.user_id)
    const email = userData?.user?.email || ''
    const naam = userData?.user?.user_metadata?.naam || ''

    // Read all files from storage
    const bestandsinhoud: string[] = []

    for (const bestandspad of (upload.bestanden || [])) {
      const { data, error } = await supabase.storage
        .from('kascontrole-bestanden')
        .download(bestandspad)

      if (error || !data) continue

      const bestandsnaam = bestandspad.split('/').pop() || ''
      const extensie = bestandsnaam.split('.').pop()?.toLowerCase() || ''

      try {
        if (extensie === 'csv') {
          const tekst = await data.text()
          bestandsinhoud.push(`=== BESTAND: ${bestandsnaam} (CSV) ===\n${tekst.substring(0, 8000)}`)
        } else if (extensie === 'txt') {
          const tekst = await data.text()
          bestandsinhoud.push(`=== BESTAND: ${bestandsnaam} (TXT) ===\n${tekst.substring(0, 8000)}`)
        } else if (['xlsx', 'xls'].includes(extensie)) {
          // For Excel, we send as base64 to Claude
          const buffer = await data.arrayBuffer()
          const base64 = Buffer.from(buffer).toString('base64')
          bestandsinhoud.push(`=== BESTAND: ${bestandsnaam} (Excel - base64) ===\n[Excel bestand ontvangen, ${Math.round(buffer.byteLength / 1024)}KB]`)
        } else if (extensie === 'pdf') {
          bestandsinhoud.push(`=== BESTAND: ${bestandsnaam} (PDF) ===\n[PDF bestand ontvangen - zie bijlage]`)
        }
      } catch {
        bestandsinhoud.push(`=== BESTAND: ${bestandsnaam} ===\n[Kon bestand niet uitlezen]`)
      }
    }

    const bestandenTekst = bestandsinhoud.join('\n\n')

    // Generate rapport with Claude API
    const prompt = `Je bent een professionele kascontroleur voor Nederlandse verenigingen.

Je hebt de volgende financiële bestanden ontvangen van een vereniging:

KLANTGEGEVENS:
- Naam: ${naam}
- E-mail: ${email}
- Boekjaar: ${upload.boekjaar}
- Toelichting van klant: ${upload.toelichting || 'Geen toelichting'}

GEÜPLOADE BESTANDEN:
${bestandenTekst || 'Geen leesbare bestanden beschikbaar'}

INSTRUCTIES:
Analyseer de beschikbare financiële gegevens en schrijf een volledig, professioneel kascontrolerapport in het Nederlands. Het rapport moet de volgende secties bevatten:

1. **Opdracht** - Welke stukken zijn beoordeeld
2. **Bevindingen**:
   - 2.1 Balans en banksaldi (controleer begin- en eindsaldo)
   - 2.2 Inkomsten en uitgaven (analyseer de posten)
   - 2.3 Exploitatieresultaat (bereken en beoordeel)
   - 2.4 Bijzonderheden en aandachtspunten
3. **Advies aan de Algemene Ledenvergadering** (goedkeuring of voorwaardelijke goedkeuring)
4. **Ondertekening**

Als de bestanden niet volledig leesbaar zijn, geef dan aan welke informatie ontbreekt en wat de kascommissie nog moet aanleveren.
Markeer aandachtspunten met [AANDACHTSPUNT: beschrijving].
Het rapport wordt opgesteld door slimmekascontrole.nl.
Gebruik een formele, professionele toon.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const aiData = await response.json()
    const rapportTekst = aiData.content?.[0]?.text || ''

    if (!rapportTekst) {
      return NextResponse.json({ error: 'AI kon geen rapport genereren' }, { status: 500 })
    }

    // Save rapport to database
    await supabase.from('uploads').update({
      rapport_tekst: rapportTekst,
      rapport_gegenereerd_op: new Date().toISOString(),
    }).eq('id', upload_id)

    return NextResponse.json({ success: true, rapport: rapportTekst })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
