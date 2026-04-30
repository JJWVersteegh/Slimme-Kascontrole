import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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

    const uploadedFiles: string[] = []
    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${userId}/${boekjaar}/${Date.now()}-${file.name}`
      const { error } = await supabase.storage
        .from('kascontrole-bestanden')
        .upload(fileName, buffer, { contentType: file.type })
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
