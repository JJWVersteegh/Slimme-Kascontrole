'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { RapportRenderer } from '@/components/RapportRenderer'

interface Upload {
  id: string
  boekjaar: string
  status: string
  upload_datum: string
  toelichting: string
  bestanden: string[]
}

interface Klant {
  id: string
  email: string
  naam?: string
  vereniging?: string
  adres?: string
  kvk?: string
  postcode?: string
  plaats?: string
  plan: string
  rapport_beschikbaar: boolean
  rapport_tekst?: string
  rapport_gegenereerd_op?: string
}

export default function MijnOmgeving() {
  const [user, setUser] = useState<any>(null)
  const [klant, setKlant] = useState<Klant | null>(null)
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [betaalLoading, setBetaalLoading] = useState(false)
  const [rapportLoading, setRapportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const [boekjaar, setBoekjaar] = useState(new Date().getFullYear().toString())
  // Sync upload boekjaar met rapport boekjaar
  const [toelichting, setToelichting] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState('')
  const [toonRapport, setToonRapport] = useState(false)
  const [bevestigDelete, setBevestigDelete] = useState<string | null>(null)
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())
  // Punt 9: profiel bewerken
  const [toonProfiel, setToonProfiel] = useState(false)
  const [profielForm, setProfielForm] = useState({ naam: '', vereniging: '', kvk: '', adres: '', postcode: '', plaats: '' })
  const [profielSaving, setProfielSaving] = useState(false)
  const [profielSuccess, setProfielSuccess] = useState(false)
  const router = useRouter()

  const currentYear = new Date().getFullYear()
  // Punt 10: boekjaar selectie — rapport boekjaar apart bijhouden
  const [rapportBoekjaar, setRapportBoekjaar] = useState(currentYear.toString())
  const jaren = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2, currentYear - 3]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/registreer'); return }
      setUser(session.user)
      loadData(session.user.id, session.user.email!)
    })
  }, [])

  async function loadData(userId: string, email: string) {
    let { data: klantData } = await supabase
      .from('klanten')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!klantData) {
      const { data: newKlant } = await supabase
        .from('klanten')
        .insert({ user_id: userId, email, rapport_beschikbaar: false })
        .select()
        .single()
      klantData = newKlant
    }

    setKlant(klantData)
    setProfielForm({
      naam: klantData?.naam || '',
      vereniging: klantData?.vereniging || '',
      adres: klantData?.adres || '',
      kvk: klantData?.kvk || '',
      postcode: klantData?.postcode || '',
      plaats: klantData?.plaats || '',
    })

    // Punt 11: alleen uploads ophalen die NIET verwijderd zijn (permanent delete via handleDelete)
    const { data: uploadsData } = await supabase
      .from('uploads')
      .select('*')
      .eq('user_id', userId)
      .order('boekjaar', { ascending: false })

    setUploads(prev => {
      const filtered = (uploadsData || []).filter((u: Upload) => !deletedIds.has(u.id))
      return filtered
    })
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
        // Reset file input
        const fileInput = document.getElementById('fileInput') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        // Alleen klant herladen (voor betaalstatus), uploads zelf ophalen en toevoegen
        const { data: newUploads } = await supabase
          .from('uploads')
          .select('*')
          .eq('user_id', user.id)
          .order('boekjaar', { ascending: false })
        // Filter verwijderde uploads eruit
        const filtered = (newUploads || []).filter((u: Upload) => !deletedIds.has(u.id))
        setUploads(filtered)
        setTimeout(() => setUploadSuccess(false), 4000)
      } else { setError(data.error || 'Er ging iets mis') }
    } catch { setError('Er ging iets mis') }
    setUploading(false)
  }

  async function handleBetaal() {
    setBetaalLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'vereniging', email: user.email, user_id: user.id, boekjaar: rapportBoekjaar }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch { }
    setBetaalLoading(false)
  }

  async function handleGenereerRapport() {
    setRapportLoading(true)
    setError('')
    try {
      const res = await fetch('/api/genereer-rapport-totaal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, rapport_boekjaar: rapportBoekjaar }),
      })
      const data = await res.json()
      if (data.success) {
        loadData(user.id, user.email)
        setToonRapport(true)
      } else { setError('Rapport genereren mislukt: ' + data.error) }
    } catch { setError('Er ging iets mis') }
    setRapportLoading(false)
  }

  // Punt 11: permanent verwijderen — ook uit storage
  async function handleDelete(uploadId: string) {
    setDeleteLoading(uploadId)
    try {
      const upload = uploads.find(u => u.id === uploadId)
      if (upload?.bestanden?.length) {
        // Verwijder alle bestanden permanent uit storage
        await supabase.storage.from('kascontrole-bestanden').remove(upload.bestanden)
      }
      // Verwijder uit database — permanent, geen soft delete
      const { error: delError } = await supabase.from('uploads').delete().eq('id', uploadId)
      if (delError) throw delError
      // Voeg toe aan deletedIds zodat dit record nooit meer verschijnt, ook niet na herladen
      setDeletedIds(prev => new Set([...prev, uploadId]))
      // Update lokale state direct
      setUploads(prev => prev.filter(u => u.id !== uploadId))
      setBevestigDelete(null)
    } catch { setError('Verwijderen mislukt') }
    setDeleteLoading(null)
  }

  // Punt 9: profiel opslaan
  async function handleProfielSave(e: React.FormEvent) {
    e.preventDefault()
    setProfielSaving(true)
    try {
      await supabase.from('klanten').update({
        naam: profielForm.naam,
        vereniging: profielForm.vereniging,
        kvk: profielForm.kvk,
        adres: profielForm.adres,
        postcode: profielForm.postcode,
        plaats: profielForm.plaats,
      }).eq('user_id', user.id)
      setKlant(prev => prev ? { ...prev, ...profielForm } : prev)
      setProfielSuccess(true)
      setTimeout(() => { setProfielSuccess(false); setToonProfiel(false) }, 2000)
    } catch { setError('Opslaan mislukt') }
    setProfielSaving(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/registreer')
  }

  const inp: any = { width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #bfdbfe', fontSize: '0.95rem', background: 'white', outline: 'none', fontFamily: 'Outfit, sans-serif' }
  const boekjaren = [...new Set(uploads.map(u => u.boekjaar))].sort().reverse()

  // Punt 10: uploads gefilterd op rapport boekjaar en omliggende jaren
  const rapportJaarNum = parseInt(rapportBoekjaar)
  const relevanteUploads = uploads.filter(u => {
    const j = parseInt(u.boekjaar)
    return j >= rapportJaarNum - 2 && j <= rapportJaarNum + 1
  })

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
      <p style={{ color: '#475569' }}>Laden...</p>
    </main>
  )

  // Rapport weergave
  if (toonRapport && klant?.rapport_tekst) return (
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
          <button onClick={() => setToonRapport(false)} style={{ background: 'white', color: '#1e3a8a', padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #bfdbfe', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif' }}>← Terug</button>
        </div>
      </nav>
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '56px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', borderBottom: '3px solid #2563EB', paddingBottom: '28px', marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#2563EB', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{ fontWeight: '700', color: '#1D4ED8', fontSize: '1.1rem', fontFamily: 'Outfit, sans-serif' }}>slimmekascontrole.nl</span>
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>Een dienst van Vertras B.V.</div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>KASCOMMISSIE RAPPORT</h1>
            <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem' }}>Boekjaar {rapportBoekjaar} · {relevanteUploads.length} upload{relevanteUploads.length !== 1 ? 's' : ''} verwerkt</p>
            {klant?.rapport_gegenereerd_op && <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '0.82rem' }}>Gegenereerd op {new Date(klant.rapport_gegenereerd_op).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>}
          </div>
          <RapportRenderer tekst={klant.rapport_tekst} />
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
      {/* Delete modal */}
      {bevestigDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Upload permanent verwijderen?</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6 }}>De bestanden worden <strong>permanent</strong> verwijderd en kunnen niet worden hersteld.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setBevestigDelete(null)} style={{ flex: 1, padding: '12px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>Annuleren</button>
              <button onClick={() => handleDelete(bevestigDelete)} disabled={deleteLoading !== null} style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
                {deleteLoading ? 'Bezig...' : 'Permanent verwijderen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profiel modal (punt 9) */}
      {toonProfiel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '480px', width: '100%' }}>
            <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '20px', fontSize: '1.1rem' }}>✏️ Gegevens bewerken</h3>
            <form onSubmit={handleProfielSave}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.85rem' }}>Naam</label>
                  <input value={profielForm.naam} onChange={e => setProfielForm(p => ({ ...p, naam: e.target.value }))} placeholder="Uw naam" style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.85rem' }}>Naam vereniging</label>
                  <input value={profielForm.vereniging} onChange={e => setProfielForm(p => ({ ...p, vereniging: e.target.value }))} placeholder="Naam van uw vereniging" style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.85rem' }}>KvK-nummer <span style={{ fontWeight: '400', color: '#94a3b8', fontSize: '0.8rem' }}>(optioneel)</span></label>
                  <input value={profielForm.kvk} onChange={e => setProfielForm(p => ({ ...p, kvk: e.target.value }))} placeholder="bijv. 12345678" style={inp} />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.85rem' }}>Adres</label>
                  <input value={profielForm.adres} onChange={e => setProfielForm(p => ({ ...p, adres: e.target.value }))} placeholder="Straat en huisnummer" style={inp} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.85rem' }}>Postcode</label>
                    <input value={profielForm.postcode} onChange={e => setProfielForm(p => ({ ...p, postcode: e.target.value }))} placeholder="1234 AB" style={inp} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.85rem' }}>Plaats</label>
                    <input value={profielForm.plaats} onChange={e => setProfielForm(p => ({ ...p, plaats: e.target.value }))} placeholder="Uw woonplaats" style={inp} />
                  </div>
                </div>
              </div>
              {profielSuccess && <p style={{ color: '#16a34a', fontSize: '0.85rem', marginTop: '12px' }}>✓ Opgeslagen!</p>}
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setToonProfiel(false)} style={{ flex: 1, padding: '12px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>Annuleren</button>
                <button type="submit" disabled={profielSaving} style={{ flex: 1, padding: '12px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontFamily: 'Outfit, sans-serif' }}>
                  {profielSaving ? 'Opslaan...' : 'Opslaan'}
                </button>
              </div>
            </form>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: '#475569' }}>{klant?.naam || user?.email}</span>
          <button onClick={() => setToonProfiel(true)} style={{ background: 'none', border: '1.5px solid #bfdbfe', color: '#1e3a8a', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontFamily: 'Outfit, sans-serif', fontWeight: '500' }}>✏️ Gegevens</button>
          <button onClick={handleLogout} style={{ background: 'none', border: '1.5px solid #bfdbfe', color: '#1e3a8a', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', fontWeight: '500' }}>Uitloggen</button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Mijn omgeving</h1>
          <p style={{ color: '#475569' }}>Upload uw financiële bestanden en ontvang een professioneel kascontrolerapport.</p>
        </div>

        {/* Punt 10: Rapport boekjaar kiezen */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px 28px', border: '2px solid #bfdbfe', marginBottom: '24px' }}>
          <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '6px' }}>📅 Voor welk boekjaar wilt u het rapport?</h2>
          <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '14px' }}>Kies het boekjaar waarvoor u het rapport wilt. Hieronder kunt u dan de bestanden van dat jaar uploaden.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <select value={rapportBoekjaar} onChange={e => { setRapportBoekjaar(e.target.value); setBoekjaar(e.target.value) }} style={{ ...inp, width: 'auto', minWidth: '120px' }}>
              {jaren.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Verplicht: <strong>{rapportJaarNum}</strong> &nbsp;·&nbsp; Optioneel voor trendanalyse: {rapportJaarNum - 2}, {rapportJaarNum - 1} (en {rapportJaarNum + 1})
            </span>
          </div>
        </div>

        {/* Punt 12: Upload sectie eerst, daarna betaalknop */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>📁 Bestanden uploaden</h2>
          <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.83rem', color: '#1e3a8a', lineHeight: 1.6 }}>
            <strong>Stap 1:</strong> Upload de bestanden van boekjaar <strong>{rapportBoekjaar}</strong> — dit is verplicht.<br/>
            <strong>Optioneel:</strong> Upload ook bestanden van {parseInt(rapportBoekjaar) - 2}, {parseInt(rapportBoekjaar) - 1} of {parseInt(rapportBoekjaar) + 1} voor een trendanalyse. Verander dan het boekjaar in de dropdown hieronder.
          </div>
          <form onSubmit={handleUpload}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '6px', fontSize: '0.88rem' }}>Boekjaar van deze bestanden <span style={{ fontWeight: '400', color: '#2563EB', fontSize: '0.8rem' }}>— standaard het gekozen rapportjaar</span></label>
                <select value={boekjaar} onChange={e => setBoekjaar(e.target.value)} style={inp}>
                  {jaren.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '6px', fontSize: '0.88rem' }}>Bestanden</label>
                <div onClick={() => document.getElementById('fileInput')?.click()} style={{ border: '2px dashed #93c5fd', borderRadius: '8px', padding: '12px 16px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', fontSize: '0.88rem', color: '#475569' }}>
                  {files ? `${files.length} bestand(en) ✓` : '📎 Klik om te selecteren'}
                </div>
                <input id="fileInput" type="file" multiple accept=".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg" style={{ display: 'none' }} onChange={e => setFiles(e.target.files)} />
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '3px' }}>PDF, Excel, CSV, afbeeldingen</p>
              </div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '6px', fontSize: '0.88rem' }}>Toelichting <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
              <textarea value={toelichting} onChange={e => setToelichting(e.target.value)} placeholder="Bijzonderheden voor dit boekjaar..." rows={2} style={{ ...inp, resize: 'vertical' }} />
            </div>
            {uploadSuccess && <p style={{ color: '#16a34a', fontSize: '0.85rem', marginBottom: '10px' }}>✓ Bestanden geüpload!</p>}
            <button type="submit" disabled={uploading} style={{ background: '#0f172a', color: 'white', padding: '11px 24px', borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: '600', cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              {uploading ? 'Uploaden...' : '📤 Upload bestanden'}
            </button>
          </form>
        </div>

        {/* Uploads overzicht */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Geüploade bestanden</h2>
            {boekjaren.length > 0 && <span style={{ fontSize: '0.82rem', color: '#475569' }}>{uploads.length} upload(s) · {boekjaren.join(', ')}</span>}
          </div>
          {uploads.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📂</div>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>Nog geen uploads. Upload uw eerste bestanden hierboven!</p>
            </div>
          ) : (
            <div>
              {uploads.map(upload => (
                <div key={upload.id} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                      <span style={{ fontWeight: '700', color: '#0f172a' }}>Boekjaar {upload.boekjaar}</span>
                      <span style={{ background: '#eff6ff', color: '#2563EB', padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600' }}>
                        {upload.bestanden?.length || 0} bestand(en)
                      </span>
                      {parseInt(upload.boekjaar) >= rapportJaarNum - 2 && parseInt(upload.boekjaar) <= rapportJaarNum + 1 && (
                        <span style={{ background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600' }}>
                          ✓ gebruikt voor rapport {rapportBoekjaar}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                      {new Date(upload.upload_datum).toLocaleDateString('nl-NL')}
                      {upload.toelichting && ` · ${upload.toelichting.substring(0, 50)}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setBevestigDelete(upload.id)}
                    title="Verwijder upload"
                    style={{ background: 'none', border: '1.5px solid #fecaca', color: '#ef4444', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Punt 12: Betaalknop ONDER de uploads */}
        {!klant?.rapport_beschikbaar ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px 28px', border: '2px solid #bfdbfe', marginBottom: '24px' }}>
            <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '6px' }}>💳 Stap 2: Betalen en rapport ontvangen</h2>
            <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '16px' }}>
              Upload eerst uw bestanden (stap 1), betaal daarna éénmalig €59 via iDEAL. Onze kascontroleurs stellen dan uw rapport op voor boekjaar <strong>{rapportBoekjaar}</strong>.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button onClick={handleBetaal} disabled={betaalLoading || uploads.length === 0} style={{ background: uploads.length === 0 ? '#94a3b8' : '#2563EB', color: 'white', padding: '14px 32px', borderRadius: '8px', border: 'none', fontSize: '1rem', fontWeight: '700', cursor: uploads.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {betaalLoading ? 'Laden...' : uploads.length === 0 ? '⬆️ Upload eerst bestanden' : '🔒 Betaal €59 via iDEAL'}
              </button>
              {uploads.length === 0 && <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Upload minimaal één bestand om te betalen</span>}
            </div>
          </div>
        ) : (
          <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '24px 28px', border: '2px solid #2563EB', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontWeight: '700', color: '#1D4ED8', fontSize: '1rem', marginBottom: '4px' }}>✅ Betaald — rapport beschikbaar</h2>
              <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>U kunt nu uw rapport genereren voor boekjaar <strong>{rapportBoekjaar}</strong>.</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {klant?.rapport_tekst && (
                <button onClick={() => setToonRapport(true)} style={{ background: 'white', color: '#1D4ED8', padding: '12px 20px', borderRadius: '8px', border: '1.5px solid #2563EB', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                  📄 Bekijk rapport
                </button>
              )}
              <button onClick={handleGenereerRapport} disabled={rapportLoading} style={{ background: '#2563EB', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: '700', cursor: rapportLoading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                {rapportLoading ? '⏳ Genereren...' : klant?.rapport_tekst ? '🔄 Rapport vernieuwen' : '📊 Genereer rapport'}
              </button>
            </div>
          </div>
        )}

        {error && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}
        {rapportLoading && (
          <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <p style={{ color: '#1D4ED8', margin: 0, fontSize: '0.9rem' }}>⏳ Onze kascontroleurs analyseren uw uploads voor boekjaar {rapportBoekjaar} en schrijven uw rapport... Dit duurt 20-40 seconden.</p>
          </div>
        )}
      </div>
    </main>
  )
}
