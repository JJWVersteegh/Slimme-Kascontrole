import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ALLOWED_EXT = ['pdf', 'xlsx', 'xls', 'csv', 'txt', 'ods', 'docx', 'doc', 'png', 'jpg', 'jpeg', 'heic']
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(req: NextRequest) {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const formData = await req.formData()
    const token = formData.get('token') as string
    const boekjaar = formData.get('boekjaar') as string
    const toelichting = formData.get('toelichting') as string
    const files = formData.getAll('files') as File[]

    const { data: klant } = await supabase.from('klanten').select('*').eq('upload_token', token).single()
    if (!klant) return NextResponse.json({ error: 'Ongeldige upload link' }, { status: 401 })

    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      if (!ALLOWED_EXT.includes(ext)) {
        return NextResponse.json({ error: `Bestandstype .${ext} is niet toegestaan. Gebruik PDF, Excel, CSV, Word, PNG, JPG of HEIC.` }, { status: 400 })
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `Bestand ${file.name} is te groot (max 10MB per bestand).` }, { status: 400 })
      }
    }

    const uploadedFiles: string[] = []
    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${klant.user_id}/${boekjaar}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('kascontrole-bestanden').upload(fileName, buffer, { contentType: file.type })
      if (!error) uploadedFiles.push(fileName)
    }

    await supabase.from('uploads').insert({
      user_id: klant.user_id, boekjaar, toelichting,
      bestanden: uploadedFiles, status: 'ontvangen',
      upload_datum: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, count: uploadedFiles.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
