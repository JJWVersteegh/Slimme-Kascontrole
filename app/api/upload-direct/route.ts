import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv', 'text/plain']
const ALLOWED_EXT = ['pdf', 'xlsx', 'xls', 'csv', 'txt']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB per bestand
const MAX_TOTAL_SIZE = 30 * 1024 * 1024 // 30MB totaal

export async function POST(req: NextRequest) {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const formData = await req.formData()
    const userId = formData.get('user_id') as string
    const boekjaar = formData.get('boekjaar') as string
    const toelichting = formData.get('toelichting') as string
    const files = formData.getAll('files') as File[]

    if (!userId) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

    // Valideer bestanden
    let totalSize = 0
    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      if (!ALLOWED_EXT.includes(ext)) {
        return NextResponse.json({ error: `Bestandstype .${ext} is niet toegestaan. Gebruik PDF, Excel of CSV.` }, { status: 400 })
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `Bestand ${file.name} is te groot (max 10MB per bestand).` }, { status: 400 })
      }
      totalSize += file.size
    }
    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json({ error: 'Totale bestandsgrootte te groot (max 30MB).' }, { status: 400 })
    }

    const uploadedFiles: string[] = []
    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const fileName = `${userId}/${boekjaar}/${Date.now()}-${safeFileName}`
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      const contentType = ALLOWED_TYPES.find(t => t.includes(ext)) || 'application/octet-stream'
      const { error } = await supabase.storage
        .from('kascontrole-bestanden')
        .upload(fileName, buffer, { contentType })
      if (!error) uploadedFiles.push(fileName)
    }

    await supabase.from('uploads').insert({
      user_id: userId,
      boekjaar,
      toelichting,
      bestanden: uploadedFiles,
      status: 'ontvangen',
      rapport_beschikbaar: false,
      upload_datum: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, count: uploadedFiles.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
