'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Upload {
  id: string
  boekjaar: string
  status: string
  upload_datum: string
  toelichting: string
  bestanden: string[]
  rapport_beschikbaar: boolean
}

export default function MijnOmgeving() {
  const [user, setUser] = useState<any>(null)
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [betaalLoading, setBetaalLoading] = useState<string | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const [boekjaar, setBoekjaar] = useState(new Date().getFullYear().toString())
  const [toelichting, setToelichting] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const currentYear = new Date().getFullYear()
  const jaren = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/registreer'); return }
      setUser(session.user)
      loadUploads(session.user.id)
    })
  }, [])

  async function loadUploads(userId: string) {
    const { data } = await supabase
      .from('uploads')
      .select('*')
      .eq('user_id', userId)
      .order('upload_datum', { ascending: false })
    setUploads(data || [])
    setLoading(false)
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!files || files.length === 0) { setError('Selecteer minimaal één bestand'); return }
    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('user_id', user.id)
    formData.append('boekjaar', boekjaar)
    formData.append('toelichting', toelichting)
    Array.from(files).forEach(f => formData.append('files', f))

    try {
      const res = await fetch('/api/upload-direct', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setUploadSuccess(true)
        setFiles(null)
        setToelichting('')
        loadUploads(user.id)
        setTimeout(() => setUploadSuccess(false), 4000)
      } else {
        setError(data.error || 'Er ging iets mis')
      }
    } catch { setError('Er ging iets mis') }
    setUploading(false)
  }

  async function handleBetaal(uploadId: string) {
    setBetaalLoading(uploadId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'vereniging', email: user.email, upload_id: uploadId }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch { }
    setBetaalLoading(null)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/registreer')
  }

  const statusColor: Record<string, string> = {
    ontvangen: '#c9a84c', 'in behandeling': '#1e7a55', gereed: '#0d3d2e',
  }
  const statusLabel: Record<string, string> = {
    ontvangen: '📥 Ontvangen', 'in behandeling': '⚙️ In behandeling', gereed: '✓ Gereed',
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#faf8f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <p style={{ color: '#4a4a45' }}>Laden...</p>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#faf8f3', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #e0ede6', padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: '#3a6b1e', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#2d5a0e', lineHeight: 1.1 }}>slimme</div>
            <div style={{ fontWeight: '500', fontSize: '1rem', color: '#6aaa2a', lineHeight: 1.1 }}>kascontrole</div>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: '#4a4a45' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #c8e0d4', color: '#0d3d2e', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Uitloggen</button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0d3d2e', marginBottom: '4px' }}>Mijn omgeving</h1>
        <p style={{ color: '#4a4a45', marginBottom: '40px' }}>Upload uw financiële bestanden en ontvang een professioneel kascontrolerapport.</p>

        {/* Upload sectie */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #e0ede6', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0d3d2e', marginBottom: '20px' }}>📁 Bestanden uploaden</h2>
          <form onSubmit={handleUpload}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#0d3d2e', marginBottom: '6px', fontSize: '0.9rem' }}>Boekjaar</label>
                <select
                  value={boekjaar} onChange={e => setBoekjaar(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #c8e0d4', fontSize: '0.95rem', background: 'white', outline: 'none' }}
                >
                  {jaren.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#0d3d2e', marginBottom: '6px', fontSize: '0.9rem' }}>Bestanden</label>
                <div
                  onClick={() => document.getElementById('fileInput')?.click()}
                  style={{ border: '2px dashed #a8d5bc', borderRadius: '8px', padding: '12px 16px', textAlign: 'center', cursor: 'pointer', background: '#f8faf9', fontSize: '0.9rem', color: '#4a4a45' }}
                >
                  {files ? `${files.length} bestand(en) geselecteerd ✓` : '📎 Klik om te selecteren'}
                </div>
                <input id="fileInput" type="file" multiple accept=".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg" style={{ display: 'none' }} onChange={e => setFiles(e.target.files)} />
                <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>PDF, Excel, CSV, afbeeldingen</p>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#0d3d2e', marginBottom: '6px', fontSize: '0.9rem' }}>Toelichting <span style={{ fontWeight: '400', color: '#999' }}>(optioneel)</span></label>
              <textarea
                value={toelichting} onChange={e => setToelichting(e.target.value)}
                placeholder="Bijzonderheden, vragen of extra informatie..."
                rows={2}
                style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #c8e0d4', fontSize: '0.9rem', background: 'white', outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            {error && <p style={{ color: '#d44', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
            {uploadSuccess && <p style={{ color: '#1e7a55', fontSize: '0.85rem', marginBottom: '12px' }}>✓ Bestanden succesvol geüpload!</p>}
            <button type="submit" disabled={uploading} style={{ background: '#0d3d2e', color: 'white', padding: '12px 28px', borderRadius: '8px', border: 'none', fontSize: '0.95rem', fontWeight: '700', cursor: uploading ? 'not-allowed' : 'pointer' }}>
              {uploading ? 'Uploaden...' : '📤 Upload bestanden'}
            </button>
          </form>
        </div>

        {/* Uploads overzicht */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e0ede6', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e0ede6' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0d3d2e', margin: 0 }}>Mijn uploads & rapporten</h2>
          </div>

          {uploads.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📂</div>
              <p style={{ color: '#4a4a45' }}>Nog geen uploads. Upload uw eerste bestanden hierboven!</p>
            </div>
          ) : (
            <div>
              {uploads.map(upload => (
                <div key={upload.id} style={{ padding: '20px 24px', borderBottom: '1px solid #f0f4f2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: '#0d3d2e', fontSize: '1rem' }}>Boekjaar {upload.boekjaar}</span>
                      <span style={{ background: (statusColor[upload.status] || '#4a4a45') + '20', color: statusColor[upload.status] || '#4a4a45', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                        {statusLabel[upload.status] || upload.status}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#4a4a45', margin: 0 }}>
                      {upload.bestanden?.length || 0} bestand(en) · {new Date(upload.upload_datum).toLocaleDateString('nl-NL')}
                      {upload.toelichting && ` · "${upload.toelichting.substring(0, 50)}..."`}
                    </p>
                  </div>
                  <div>
                    {upload.rapport_beschikbaar ? (
                      <a
                        href={`/rapport/${upload.id}`}
                        style={{ background: '#0d3d2e', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600' }}
                      >
                        📄 Bekijk rapport
                      </a>
                    ) : (
                      <button
                        onClick={() => handleBetaal(upload.id)}
                        disabled={betaalLoading === upload.id}
                        style={{ background: '#c9a84c', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
                      >
                        {betaalLoading === upload.id ? 'Laden...' : '🔒 Rapport ophalen – €59'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
