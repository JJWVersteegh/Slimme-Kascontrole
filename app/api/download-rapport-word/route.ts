import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function stripInline(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').trim()
}

function parseTableRow(line: string): string[] {
  return line.split('|').filter((_, i, a) => i > 0 && i < a.length - 1).map(c => stripInline(c.trim()))
}

function isSeparatorRow(line: string): boolean {
  return /^\s*\|[-\s:|]+\|\s*$/.test(line)
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const boekjaar = searchParams.get('boekjaar')
    const verenigingId = searchParams.get('vereniging_id') || null

    // Auth
    const authHeader = req.headers.get('Authorization') || ''
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user } } = await anonClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Haal rapport op
    let query = supabase.from('rapporten').select('rapport_tekst, boekjaar').eq('user_id', user.id).eq('boekjaar', boekjaar)
    if (verenigingId) query = query.eq('vereniging_id', verenigingId)
    else query = query.is('vereniging_id', null)
    const { data: rapport } = await query.single()

    if (!rapport?.rapport_tekst) {
      return NextResponse.json({ error: 'Rapport niet gevonden' }, { status: 404 })
    }

    // Genereer Word-document
    const {
      Document, Packer, Paragraph, TextRun, HeadingLevel,
      Table, TableRow, TableCell, WidthType, BorderStyle,
      AlignmentType, ShadingType
    } = await import('docx')

    const lines = rapport.rapport_tekst.split('\n')
    const children: any[] = []
    let tableRows: string[][] = []
    let inTable = false

    function makeRuns(text: string): TextRun[] {
      const runs: TextRun[] = []
      const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
      for (const part of parts) {
        if (part.startsWith('**') && part.endsWith('**')) {
          runs.push(new TextRun({ text: part.slice(2, -2), bold: true }))
        } else if (part.startsWith('*') && part.endsWith('*')) {
          runs.push(new TextRun({ text: part.slice(1, -1), italics: true }))
        } else if (part) {
          runs.push(new TextRun({ text: part }))
        }
      }
      return runs.length ? runs : [new TextRun({ text: '' })]
    }

    function flushTable() {
      if (tableRows.length < 2) { tableRows = []; inTable = false; return }
      const headers = tableRows[0]
      const dataRows = tableRows.slice(1)
      const colCount = headers.length
      const colWidth = Math.floor(9000 / colCount)

      const headerRow = new TableRow({
        children: headers.map(h => new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 18 })],
          })],
          shading: { fill: '1e3a8a', type: ShadingType.SOLID },
          width: { size: colWidth, type: WidthType.DXA },
        })),
        tableHeader: true,
      })

      const bodyRows = dataRows.map((row, ri) => new TableRow({
        children: row.map((cell, _ci) => new TableCell({
          children: [new Paragraph({
            children: [new TextRun({ text: cell, size: 18 })],
          })],
          shading: ri % 2 === 1 ? { fill: 'f8fafc', type: ShadingType.SOLID } : undefined,
          width: { size: colWidth, type: WidthType.DXA },
        })),
      }))

      children.push(new Table({
        rows: [headerRow, ...bodyRows],
        width: { size: 9000, type: WidthType.DXA },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
          left: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
          right: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
          insideH: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
          insideV: { style: BorderStyle.SINGLE, size: 1, color: 'e2e8f0' },
        },
      }))
      children.push(new Paragraph({ text: '' }))
      tableRows = []; inTable = false
    }

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed.startsWith('|')) {
        inTable = true
        if (!isSeparatorRow(trimmed)) tableRows.push(parseTableRow(trimmed))
        continue
      } else if (inTable) {
        flushTable()
      }

      if (trimmed === '' || trimmed === '---') {
        children.push(new Paragraph({ text: '' }))
        continue
      }

      if (trimmed.startsWith('# ')) {
        children.push(new Paragraph({ text: stripInline(trimmed.slice(2)), heading: HeadingLevel.HEADING_1 }))
        continue
      }
      if (trimmed.startsWith('## ')) {
        children.push(new Paragraph({ text: stripInline(trimmed.slice(3)), heading: HeadingLevel.HEADING_2 }))
        continue
      }
      if (trimmed.startsWith('### ')) {
        children.push(new Paragraph({ text: stripInline(trimmed.slice(4)), heading: HeadingLevel.HEADING_3 }))
        continue
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        children.push(new Paragraph({
          children: makeRuns(trimmed.slice(2)),
          bullet: { level: 0 },
        }))
        continue
      }

      if (/^\d+\./.test(trimmed)) {
        children.push(new Paragraph({
          children: makeRuns(trimmed.replace(/^\d+\.\s*/, '')),
          numbering: { reference: 'default-numbering', level: 0 },
        }))
        continue
      }

      // Italic line
      if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**')) {
        children.push(new Paragraph({
          children: [new TextRun({ text: trimmed.replace(/\*/g, ''), italics: true, color: '475569' })],
        }))
        continue
      }

      // Normale paragraaf
      children.push(new Paragraph({ children: makeRuns(trimmed) }))
    }

    if (inTable) flushTable()

    const doc = new Document({
      numbering: {
        config: [{
          reference: 'default-numbering',
          levels: [{ level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.START }],
        }],
      },
      styles: {
        default: {
          document: { run: { font: 'Calibri', size: 22 } },
        },
        paragraphStyles: [
          {
            id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal',
            run: { bold: true, size: 28, color: '1e3a8a', font: 'Calibri' },
            paragraph: { spacing: { before: 240, after: 120 } },
          },
          {
            id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal',
            run: { bold: true, size: 24, color: '1e3a8a', font: 'Calibri' },
            paragraph: { spacing: { before: 200, after: 80 } },
          },
          {
            id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal',
            run: { bold: true, size: 22, color: '0f172a', font: 'Calibri' },
            paragraph: { spacing: { before: 160, after: 60 } },
          },
        ],
      },
      sections: [{ children }],
    })

    const buffer = await Packer.toBuffer(doc)
    const veiligBoekjaar = boekjaar?.replace(/[^0-9]/g, '') || 'rapport'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="Kascontrolerapport-${veiligBoekjaar}.docx"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
