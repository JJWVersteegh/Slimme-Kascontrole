'use client'
import React from 'react'

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}

function formatCell(text: string): string {
  const formatted = formatInline(text.trim())
  if (text.includes('✓') && !text.includes('✗')) return `<span style="color:#16a34a;font-weight:600">${formatted}</span>`
  if (text.includes('✗')) return `<span style="color:#dc2626;font-weight:600">${formatted}</span>`
  if (/^[−-]€/.test(text.trim())) return `<span style="color:#dc2626">${formatted}</span>`
  if (/^\+€/.test(text.trim())) return `<span style="color:#16a34a">${formatted}</span>`
  return formatted
}

function parseTableRow(line: string): string[] {
  return line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
}

function isSeparatorRow(line: string): boolean {
  return /^\s*\|[-\s:|]+\|\s*$/.test(line)
}

export function RapportRenderer({ tekst }: { tekst: string }) {
  const lines = tekst.split('\n')
  const elements: React.ReactNode[] = []
  let tableRows: string[][] = []
  let inTable = false
  let keyCounter = 0
  const k = () => keyCounter++

  function flushTable() {
    if (tableRows.length < 1) { tableRows = []; inTable = false; return }
    const headers = tableRows[0]
    const dataRows = tableRows.slice(1)
    elements.push(
      <div key={k()} style={{ overflowX: 'auto', margin: '16px 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: '#1e3a8a' }}>
              {headers.map((h, j) => (
                <th key={j} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '600', color: 'white', whiteSpace: 'nowrap', fontFamily: 'Outfit, sans-serif' }}
                  dangerouslySetInnerHTML={{ __html: formatInline(h.trim()) }} />
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri} style={{ background: ri % 2 === 0 ? 'white' : '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{ padding: '9px 14px', color: '#0f172a', verticalAlign: 'top' }}
                    dangerouslySetInnerHTML={{ __html: formatCell(cell.trim()) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
    tableRows = []
    inTable = false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Table
    if (trimmed.startsWith('|')) {
      inTable = true
      if (!isSeparatorRow(trimmed)) {
        tableRows.push(parseTableRow(trimmed))
      }
      continue
    } else if (inTable) {
      flushTable()
    }

    // Kritisch box
    if (trimmed.includes('[KRITISCH]') || (trimmed.toUpperCase().startsWith('KRITISCH') && trimmed.includes('—'))) {
      elements.push(
        <div key={k()} style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderLeft: '4px solid #dc2626', borderRadius: '0 8px 8px 0', padding: '16px 20px', margin: '16px 0' }}>
          <div style={{ fontWeight: '700', color: '#dc2626', marginBottom: '6px', fontSize: '0.9rem' }}>🚨 Kritisch — vereist actie vóór goedkeuring</div>
          <div style={{ fontSize: '0.88rem', color: '#0f172a' }} dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace(/\[KRITISCH\]/gi, '').trim()) }} />
        </div>
      )
      continue
    }

    // Aandachtspunt box
    if (trimmed.startsWith('[AANDACHTSPUNT:') || trimmed.includes('[AANDACHT]')) {
      const text = trimmed.replace(/\[AANDACHTSPUNT:/gi, '').replace(/\[AANDACHT\]/gi, '').replace(/\]/, '').trim()
      elements.push(
        <div key={k()} style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderLeft: '4px solid #f59e0b', borderRadius: '0 8px 8px 0', padding: '16px 20px', margin: '12px 0' }}>
          <div style={{ fontWeight: '700', color: '#92400e', marginBottom: '6px', fontSize: '0.9rem' }}>⚠️ Aandachtspunt</div>
          <div style={{ fontSize: '0.88rem', color: '#0f172a' }} dangerouslySetInnerHTML={{ __html: formatInline(text) }} />
        </div>
      )
      continue
    }

    // Akkoord box
    if (trimmed.includes('[AKKOORD]')) {
      elements.push(
        <div key={k()} style={{ background: '#f0fdf4', border: '1px solid #86efac', borderLeft: '4px solid #16a34a', borderRadius: '0 8px 8px 0', padding: '14px 18px', margin: '10px 0' }}>
          <div style={{ fontWeight: '700', color: '#166534', fontSize: '0.9rem' }}>✓ Akkoord</div>
          <div style={{ fontSize: '0.88rem', color: '#0f172a', marginTop: '4px' }} dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace(/\[AKKOORD\]/gi, '').trim()) }} />
        </div>
      )
      continue
    }

    // Advies/voorwaardelijk box
    if (trimmed.toUpperCase().includes('VOORWAARDELIJK') || trimmed.toUpperCase().includes('GOEDKEURING')) {
      elements.push(
        <div key={k()} style={{ background: '#eff6ff', border: '2px solid #2563EB', borderRadius: '8px', padding: '18px 22px', margin: '20px 0' }}>
          <div style={{ fontWeight: '700', color: '#1D4ED8', fontSize: '0.95rem', marginBottom: '8px' }}>📋 Advies kascommissie</div>
          <div style={{ fontSize: '0.9rem', color: '#0f172a', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        </div>
      )
      continue
    }

    // H1
    if (trimmed.startsWith('# ')) {
      elements.push(<h1 key={k()} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.25rem', fontWeight: '800', color: '#1e3a8a', marginTop: '32px', marginBottom: '12px', borderBottom: '2px solid #2563EB', paddingBottom: '8px' }}>{trimmed.slice(2)}</h1>)
      continue
    }

    // H2
    if (trimmed.startsWith('## ')) {
      elements.push(<h2 key={k()} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.05rem', fontWeight: '700', color: '#1e3a8a', marginTop: '28px', marginBottom: '8px' }}>{trimmed.slice(3)}</h2>)
      continue
    }

    // H3
    if (trimmed.startsWith('### ')) {
      elements.push(<h3 key={k()} style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', fontWeight: '700', color: '#0f172a', marginTop: '20px', marginBottom: '6px' }}>{trimmed.slice(4)}</h3>)
      continue
    }

    // HR
    if (trimmed === '---') {
      elements.push(<hr key={k()} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }} />)
      continue
    }

    // Bullet list
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={k()} style={{ display: 'flex', gap: '8px', margin: '3px 0', paddingLeft: '8px' }}>
          <span style={{ color: '#2563EB', flexShrink: 0, fontWeight: '700' }}>•</span>
          <span dangerouslySetInnerHTML={{ __html: formatInline(trimmed.slice(2)) }} />
        </div>
      )
      continue
    }

    // Numbered list
    if (/^\d+\./.test(trimmed)) {
      const num = trimmed.match(/^\d+/)?.[0]
      elements.push(
        <div key={k()} style={{ display: 'flex', gap: '8px', margin: '3px 0', paddingLeft: '8px' }}>
          <span style={{ color: '#2563EB', fontWeight: '700', flexShrink: 0, minWidth: '20px' }}>{num}.</span>
          <span dangerouslySetInnerHTML={{ __html: formatInline(trimmed.replace(/^\d+\.\s/, '')) }} />
        </div>
      )
      continue
    }

    // Empty line
    if (trimmed === '') {
      elements.push(<div key={k()} style={{ height: '6px' }} />)
      continue
    }

    // Italic line
    if (trimmed.startsWith('*') && trimmed.endsWith('*') && !trimmed.startsWith('**')) {
      elements.push(<p key={k()} style={{ fontStyle: 'italic', color: '#475569', fontSize: '0.85rem', margin: '4px 0' }}>{trimmed.replace(/\*/g, '')}</p>)
      continue
    }

    // Normal paragraph
    elements.push(<p key={k()} style={{ margin: '4px 0', color: '#0f172a', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />)
  }

  if (inTable) flushTable()

  return <>{elements}</>
}
