'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'

export default function UploadPage() {
  const params = useParams()
  const token = params.token as string

  const [boekjaar, setBoekjaar] = useState(new Date().getFullYear().toString())
  const [toelichting, setToelichting] = useState('')
  const [files, setFiles] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const currentYear = new Date().getFullYear()
  const jaren = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!files || files.length === 0) {
      setError('Selecteer minimaal één bestand')
      return
    }
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('token', token)
    formData.append('boekjaar', boekjaar)
    formData.append('toelichting', toelichting)
    Array.from(files).forEach(f => formData.append('files', f))

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || 'Er ging iets mis')
      }
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.')
    }
    setLoading(false)
  }

  if (success) {
    return (
      <main style={{ minHeight: '100vh', background: '#faf8f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ width: '72px', height: '72px', background: '#e8f4ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.8rem' }}>✓</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0d3d2e', marginBottom: '12px' }}>Bestanden ontvangen!</h1>
          <p style={{ color: '#4a4a45', marginBottom: '24px' }}>Wij gaan aan de slag met uw kascontrole. U ontvangt het rapport per e-mail zodra het klaar is.</p>
          <a href="/mijn-omgeving" style={{ background: '#0d3d2e', color: 'white', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>Naar mijn omgeving</a>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#faf8f3', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e0ede6', padding: '16px 48px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: '#3a6b1e', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <span style={{ fontWeight: '700', color: '#0d3d2e' }}>Slimme Kascontrole</span>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0d3d2e', marginBottom: '8px' }}>Upload uw gegevens</h1>
        <p style={{ color: '#4a4a45', marginBottom: '40px' }}>Upload uw bankafschriften, Excel-bestanden of andere financiële documenten. Wij zorgen voor de rest.</p>

        <form onSubmit={handleUpload}>
          {/* Boekjaar */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#0d3d2e', marginBottom: '8px' }}>Boekjaar</label>
            <select
              value={boekjaar}
              onChange={e => setBoekjaar(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #c8e0d4', fontSize: '1rem', background: 'white', outline: 'none' }}
            >
              {jaren.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>

          {/* Bestanden */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#0d3d2e', marginBottom: '8px' }}>Bestanden</label>
            <div style={{ border: '2px dashed #a8d5bc', borderRadius: '12px', padding: '40px', textAlign: 'center', background: 'white', cursor: 'pointer' }}
              onClick={() => document.getElementById('fileInput')?.click()}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📁</div>
              <p style={{ color: '#4a4a45', marginBottom: '4px' }}>Klik om bestanden te selecteren</p>
              <p style={{ fontSize: '0.8rem', color: '#999' }}>PDF, Excel, CSV, afbeeldingen – max 50MB per bestand</p>
              {files && <p style={{ marginTop: '12px', color: '#1e7a55', fontWeight: '600' }}>{files.length} bestand(en) geselecteerd</p>}
            </div>
            <input
              id="fileInput"
              type="file"
              multiple
              accept=".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg"
              style={{ display: 'none' }}
              onChange={e => setFiles(e.target.files)}
            />
          </div>

          {/* Toelichting */}
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontWeight: '600', color: '#0d3d2e', marginBottom: '8px' }}>Toelichting <span style={{ fontWeight: '400', color: '#999' }}>(optioneel)</span></label>
            <textarea
              value={toelichting}
              onChange={e => setToelichting(e.target.value)}
              placeholder="Bijzonderheden, vragen of extra informatie voor de kascontroleur..."
              rows={4}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #c8e0d4', fontSize: '0.95rem', background: 'white', outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          {error && <p style={{ color: '#d44', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '16px', background: '#0d3d2e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Uploaden...' : '📤 Bestanden uploaden'}
          </button>
        </form>
      </div>
    </main>
  )
}
