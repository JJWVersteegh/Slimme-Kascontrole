import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ALLOWED_EXT = ['pdf', 'xlsx', 'xls', 'csv', 'txt', 'ods', 'docx', 'doc', 'png', 'jpg', 'jpeg', 'heic']
const EXT_TO_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
  csv: 'text/csv',
  txt: 'text/plain',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  heic: 'image/heic',
}
const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_TOTAL_SIZE = 30 * 1024 * 1024

export async function POST(req: NextRequest) {
  // AUTH_FIX_UPLOAD_DIRECT: vertrouw nooit user_id uit FormData; gebruik de ingelogde Supabase user.
  const authSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: req.headers.get('Authorization') || req.headers.get('authorization') || '' } } }
  )
  const { data: { user }, error: authError } = await authSupabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
  }

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const formData = await req.formData()
    const userId = user.id
    const boekjaar = formData.get('boekjaar') as string
    const toelichting = formData.get('toelichting') as string
    const verenigingId = formData.get('vereniging_id') as string | null
    const files = formData.getAll('files') as File[]

    

    let totalSize = 0
    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase() || ''
      if (!ALLOWED_EXT.includes(ext)) {
        return NextResponse.json({ error: `Bestandstype .${ext} is niet toegestaan. Gebruik PDF, Excel, CSV, Word, PNG, JPG of HEIC.` }, { status: 400 })
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
    const waarschuwingen: { bestand: string; melding: string }[] = []

    for (const file of files) {
      const bytes = await file.arrayBuffer()
      const ext = file.name.split('.').pop()?.toLowerCase() || ''

      // Valideer leesbare bestandstypen
      if (['xlsx', 'xls', 'xlsm', 'ods'].includes(ext)) {
        try {
          const XLSX = await import('xlsx')
          const workbook = XLSX.read(bytes, { type: 'array' })
          let totaalRijen = 0
          for (const sheetName of workbook.SheetNames) {
            const ws = workbook.Sheets[sheetName]
            const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as any[][]
            totaalRijen += rows.filter(r => r.some((c: any) => c !== '' && c !== null && c !== undefined)).length
          }
          if (totaalRijen === 0) {
            waarschuwingen.push({ bestand: file.name, melding: 'Dit bestand lijkt leeg te zijn — geen data gevonden.' })
          } else if (totaalRijen < 3) {
            waarschuwingen.push({ bestand: file.name, melding: `Slechts ${totaalRijen} rij(en) gevonden — controleer of dit het juiste bestand is.` })
          }
        } catch {
          waarschuwingen.push({ bestand: file.name, melding: 'Dit bestand kon niet worden uitgelezen — mogelijk beschadigd of beveiligd met een wachtwoord.' })
        }
      } else if (['csv', 'txt'].includes(ext)) {
        try {
          const tekst = new TextDecoder().decode(bytes)
          const regels = tekst.split('\n').filter(r => r.trim().length > 0)
          if (regels.length < 2) {
            waarschuwingen.push({ bestand: file.name, melding: 'Dit bestand bevat nauwelijks data — controleer of dit het juiste bestand is.' })
          }
        } catch {
          waarschuwingen.push({ bestand: file.name, melding: 'Dit bestand kon niet worden uitgelezen.' })
        }
      } else if (ext === 'pdf') {
        const header = new Uint8Array(bytes.slice(0, 5))
        const isPdf = String.fromCharCode(...header) === '%PDF-'
        if (!isPdf) {
          waarschuwingen.push({ bestand: file.name, melding: 'Dit bestand lijkt geen geldig PDF-bestand te zijn.' })
        } else if (bytes.byteLength < 500) {
          waarschuwingen.push({ bestand: file.name, melding: 'Dit PDF-bestand lijkt leeg of corrupt.' })
        } else {
          // Controleer of de PDF leesbare tekst bevat (niet alleen scan/afbeeldingen)
          try {
            const pdfModule = await import('pdf-parse')
            const pdfParse = pdfModule.default || pdfModule
            const pdfData = await (pdfParse as any)(Buffer.from(bytes))
            const tekst = pdfData.text?.trim() || ''
            if (tekst.length < 50) {
              waarschuwingen.push({
                bestand: file.name,
                melding: `ℹ️ Dit lijkt een gescande PDF te zijn (afbeeldingen). De AI leest dit visueel uit — dit werkt het best bij een duidelijke scan. Een digitale PDF of Excel geeft de meest nauwkeurige resultaten.`
              })
            }
          } catch { /* niet kritisch — upload gewoon door */ }
        }
      } else if (['png', 'jpg', 'jpeg'].includes(ext)) {
        const header = new Uint8Array(bytes.slice(0, 4))
        const isPng = header[0] === 0x89 && header[1] === 0x50
        const isJpg = header[0] === 0xFF && header[1] === 0xD8
        if (!isPng && !isJpg) {
          waarschuwingen.push({ bestand: file.name, melding: 'Dit afbeeldingsbestand lijkt beschadigd of heeft een onverwacht formaat.' })
        }
      } else if (['docx', 'doc'].includes(ext)) {
        try {
          const mammoth = await import('mammoth')
          const result = await mammoth.extractRawText({ arrayBuffer: bytes })
          if (!result.value.trim()) {
            waarschuwingen.push({ bestand: file.name, melding: 'Dit Word-document bevat geen uitleesbare tekst — controleer of het juiste bestand is.' })
          }
        } catch {
          waarschuwingen.push({ bestand: file.name, melding: 'Dit Word-document kon niet worden uitgelezen — mogelijk beschadigd.' })
        }
      } else if (ext === 'heic') {
        waarschuwingen.push({ bestand: file.name, melding: 'HEIC-afbeeldingen worden niet ondersteund door de AI. Converteer naar JPG of PNG voor gebruik in de analyse.' })
      }

      const buffer = Buffer.from(bytes)
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const fileName = `${userId}/${boekjaar}/${Date.now()}-${safeFileName}`
      const contentType = EXT_TO_MIME[ext] || 'application/octet-stream'
      const { error } = await supabase.storage
        .from('kascontrole-bestanden')
        .upload(fileName, buffer, { contentType })
      if (!error) uploadedFiles.push(fileName)
    }

    // Kijk of er al een upload bestaat voor dit boekjaar + vereniging
    let bestaandeQuery = supabase.from('uploads').select('id, bestanden').eq('user_id', userId).eq('boekjaar', boekjaar)
    if (verenigingId) bestaandeQuery = bestaandeQuery.eq('vereniging_id', verenigingId)
    else bestaandeQuery = bestaandeQuery.is('vereniging_id', null)
    const { data: bestaande } = await bestaandeQuery

    let bestandenLijst: string[] = uploadedFiles

    if (bestaande && bestaande.length > 0) {
      // Altijd vervangen: verwijder alle oude bestanden en records
      const oudeBestanden = bestaande.flatMap((u: any) => u.bestanden || [])
      if (oudeBestanden.length > 0) {
        await supabase.storage.from('kascontrole-bestanden').remove(oudeBestanden)
      }
      const oudeIds = bestaande.map((u: any) => u.id)
      await supabase.from('uploads').delete().in('id', oudeIds)
    }

    await supabase.from('uploads').insert({
      user_id: userId,
      boekjaar,
      toelichting: toelichting || (bestaande?.[0] as any)?.toelichting || '',
      bestanden: bestandenLijst,
      status: 'ontvangen',
      rapport_beschikbaar: false,
      upload_datum: new Date().toISOString(),
      ...(verenigingId ? { vereniging_id: verenigingId } : {}),
    })

    return NextResponse.json({ success: true, count: uploadedFiles.length, waarschuwingen })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
