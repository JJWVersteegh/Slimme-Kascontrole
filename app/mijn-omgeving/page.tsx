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
  rapport_tekst?: string
}

export default function MijnOmgeving() {
  const [user, setUser] = useState<any>(null)
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [betaalLoading, setBetaalLoading] = useState<string | null>(null)
  const [rapportLoading, setRapportLoading] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const [boekjaar, setBoekjaar] = useState(new Date().getFullYear().toString())
  const [toelichting, setToelichting] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState('')
  const [geselecteerdRapport, setGeselecteerdRapport] = useState<Upload | null>(null)
  const [bevestigDelete, setBevestigDelete] = useState<string | null>(null)
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
    setUploading(true); setError('')
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
      } else { setError(data.error || 'Er ging iets mis') }
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

  async function handleGenereerRapport(uploadId: string) {
    setRapportLoading(uploadId)
    try {
      const res = await fetch('/api/genereer-rapport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ upload_id: uploadId }),
      })
      const data = await res.json()
      if (data.success) { loadUploads(user.id) }
      else { setError('Rapport genereren mislukt: ' + data.error) }
    } catch { setError('Er ging iets mis') }
    setRapportLoading(null)
  }

  async function handleDelete(uploadId: string) {
    setDeleteLoading(uploadId)
    try {
      // Delete files from storage
      const upload = uploads.find(u => u.id === uploadId)
      if (upload?.bestanden?.length) {
        await supabase.storage.from('kascontrole-bestanden').remove(upload.bestanden)
      }
      // Delete record
      await supabase.from('uploads').delete().eq('id', uploadId)
      setUploads(prev => prev.filter(u => u.id !== uploadId))
      setBevestigDelete(null)
    } catch { setError('Verwijderen mislukt') }
    setDeleteLoading(null)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/registreer')
  }

  const inp = { width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #bfdbfe', fontSize: '0.95rem', background: 'white', outline: 'none' }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
      <p style={{ color: '#475569' }}>Laden...</p>
    </main>
  )

  // Rapport weergave
  if (geselecteerdRapport) return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`@media print { .no-print { display: none !important; } body { background: white !important; } }`}</style>
      <nav className="no-print" style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: '#2563EB', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1D4ED8' }}>slimme</div>
            <div style={{ fontWeight: '500', fontSize: '1.05rem', color: '#3b82f6' }}>kascontrole</div>
          </div>
        </a>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => window.print()} style={{ background: '#2563EB', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif' }}>🖨️ Afdrukken / PDF</button>
          <button onClick={() => setGeselecteerdRapport(null)} style={{ background: 'white', color: '#1e3a8a', padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #bfdbfe', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif' }}>← Terug</button>
        </div>
      </nav>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '48px', border: '1px solid #e2e8f0', lineHeight: '1.8' }}>
          <div style={{ textAlign: 'center', borderBottom: '2px solid #2563EB', paddingBottom: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ background: '#2563EB', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{ fontWeight: '700', color: '#1D4ED8', fontSize: '1rem' }}>slimmekascontrole.nl</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', margin: '0 0 4px', fontFamily: 'Outfit, sans-serif' }}>KASCOMMISSIE RAPPORT</h2>
            <p style={{ color: '#475569', margin: 0 }}>Boekjaar {geselecteerdRapport.boekjaar}</p>
          </div>
          <div style={{ fontSize: '0.95rem', color: '#0f172a' }}>
            {geselecteerdRapport.rapport_tekst?.split('\n').map((line, i) => {
              if (line.startsWith('[AANDACHTSPUNT:')) return <div key={i} style={{ background: '#fffbeb', borderLeft: '4px solid #f59e0b', padding: '12px 16px', margin: '12px 0', borderRadius: '0 8px 8px 0' }}><strong>⚠️ Aandachtspunt</strong><br />{line.replace('[AANDACHTSPUNT:', '').replace(']', '')}</div>
              if (line.startsWith('# ') || line.startsWith('## ')) return <h3 key={i} style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e3a8a', marginTop: '24px', marginBottom: '8px', fontFamily: 'Outfit, sans-serif' }}>{line.replace(/^#+\s/, '')}</h3>
              return <p key={i} style={{ margin: '4px 0' }}>{line}</p>
            })}
          </div>
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
      {/* Delete bevestiging modal */}
      {bevestigDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🗑️</div>
            <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px', fontSize: '1.1rem' }}>Upload verwijderen?</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6 }}>Dit verwijdert alle geüploade bestanden én het rapport (indien aanwezig). Dit kan niet ongedaan worden gemaakt.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setBevestigDelete(null)} style={{ flex: 1, padding: '12px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit, sans-serif', color: '#475569' }}>Annuleren</button>
              <button onClick={() => handleDelete(bevestigDelete)} disabled={deleteLoading !== null} style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
                {deleteLoading ? 'Verwijderen...' : 'Ja, verwijder'}
              </button>
            </div>
          </div>
        </div>
      )}

      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: '#2563EB', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1D4ED8' }}>slimme</div>
            <div style={{ fontWeight: '500', fontSize: '1.05rem', color: '#3b82f6' }}>kascontrole</div>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: '#475569' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ background: 'none', border: '1.5px solid #bfdbfe', color: '#1e3a8a', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', fontWeight: '500' }}>Uitloggen</button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Mijn omgeving</h1>
        <p style={{ color: '#475569', marginBottom: '40px' }}>Upload uw financiële bestanden en ontvang een professioneel kascontrolerapport.</p>

        {/* Upload */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>📁 Bestanden uploaden</h2>
          <form onSubmit={handleUpload}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '6px', fontSize: '0.9rem' }}>Boekjaar</label>
                <select value={boekjaar} onChange={e => setBoekjaar(e.target.value)} style={inp as any}>
                  {jaren.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '6px', fontSize: '0.9rem' }}>Bestanden</label>
                <div onClick={() => document.getElementById('fileInput')?.click()} style={{ border: '2px dashed #93c5fd', borderRadius: '8px', padding: '12px 16px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', fontSize: '0.9rem', color: '#475569' }}>
                  {files ? `${files.length} bestand(en) ✓` : '📎 Klik om te selecteren'}
                </div>
                <input id="fileInput" type="file" multiple accept=".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg" style={{ display: 'none' }} onChange={e => setFiles(e.target.files)} />
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>PDF, Excel, CSV, afbeeldingen</p>
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '6px', fontSize: '0.9rem' }}>Toelichting <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
              <textarea value={toelichting} onChange={e => setToelichting(e.target.value)} placeholder="Bijzonderheden, vragen of extra informatie..." rows={2} style={{ ...inp, resize: 'vertical' } as any} />
            </div>
            {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
            {uploadSuccess && <p style={{ color: '#2563EB', fontSize: '0.85rem', marginBottom: '12px' }}>✓ Bestanden succesvol geüpload!</p>}
            <button type="submit" disabled={uploading} style={{ background: '#2563EB', color: 'white', padding: '12px 28px', borderRadius: '8px', border: 'none', fontSize: '0.95rem', fontWeight: '600', cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              {uploading ? 'Uploaden...' : '📤 Upload bestanden'}
            </button>
          </form>
        </div>

        {/* Uploads overzicht */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Mijn uploads & rapporten</h2>
          </div>
          {uploads.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📂</div>
              <p style={{ color: '#475569' }}>Nog geen uploads. Upload uw eerste bestanden hierboven!</p>
            </div>
          ) : (
            <div>
              {uploads.map(upload => (
                <div key={upload.id} style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>Boekjaar {upload.boekjaar}</span>
                      <span style={{ background: '#eff6ff', color: '#2563EB', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>
                        {upload.rapport_tekst ? '✓ Rapport klaar' : upload.rapport_beschikbaar ? '⚙️ Betaald' : '📥 Ontvangen'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                      {upload.bestanden?.length || 0} bestand(en) · {new Date(upload.upload_datum).toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {upload.rapport_beschikbaar ? (
                      upload.rapport_tekst ? (
                        <button onClick={() => setGeselecteerdRapport(upload)} style={{ background: '#2563EB', color: 'white', padding: '10px 18px', borderRadius: '8px', border: 'none', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                          📄 Bekijk rapport
                        </button>
                      ) : (
                        <button onClick={() => handleGenereerRapport(upload.id)} disabled={rapportLoading === upload.id} style={{ background: '#1D4ED8', color: 'white', padding: '10px 18px', borderRadius: '8px', border: 'none', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                          {rapportLoading === upload.id ? '⏳ Genereren...' : '🤖 Genereer rapport'}
                        </button>
                      )
                    ) : (
                      <button onClick={() => handleBetaal(upload.id)} disabled={betaalLoading === upload.id} style={{ background: '#f59e0b', color: 'white', padding: '10px 18px', borderRadius: '8px', border: 'none', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                        {betaalLoading === upload.id ? 'Laden...' : '🔒 Rapport ophalen – €59'}
                      </button>
                    )}
                    {/* Delete knop */}
                    <button
                      onClick={() => setBevestigDelete(upload.id)}
                      title="Verwijder upload"
                      style={{ background: 'none', border: '1.5px solid #fecaca', color: '#ef4444', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', transition: 'background 0.2s' }}
                      onMouseOver={e => (e.currentTarget.style.background = '#fef2f2')}
                      onMouseOut={e => (e.currentTarget.style.background = 'none')}
                    >
                      🗑️
                    </button>
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
