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
  vereniging_id?: string
}

interface Klant {
  id: string
  email: string
  naam?: string
  telefoon?: string
}

interface Vereniging {
  id: string
  user_id: string
  naam: string
  kvk?: string
  adres?: string
  postcode?: string
  plaats?: string
  telefoon?: string
}

interface Rapport {
  boekjaar: string
  betaald: boolean
  rapport_tekst?: string
  gegenereerd_op?: string
  vereniging_id?: string
}

export default function MijnOmgeving() {
  const [user, setUser] = useState<any>(null)
  const [klant, setKlant] = useState<Klant | null>(null)
  const [verenigingen, setVerenigingen] = useState<Vereniging[]>([])
  const [geselecteerdeVereniging, setGeselecteerdeVereniging] = useState<Vereniging | null>(null)
  const [uploads, setUploads] = useState<Upload[]>([])
  const [rapporten, setRapporten] = useState<Rapport[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [betaalLoading, setBetaalLoading] = useState(false)
  const [rapportLoading, setRapportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const [boekjaar, setBoekjaar] = useState(new Date().getFullYear().toString())
  const [toelichting, setToelichting] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [rapportError, setRapportError] = useState('')
  const [toonRapport, setToonRapport] = useState(false)
  const [bevestigDelete, setBevestigDelete] = useState<string | null>(null)
  const [bevestigDeleteRapport, setBevestigDeleteRapport] = useState<string | null>(null)
  const [deleteRapportLoading, setDeleteRapportLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Profiel bewerken (persoonlijk)
  const [toonProfiel, setToonProfiel] = useState(false)
  const [profielForm, setProfielForm] = useState({ naam: '', telefoon: '', adres: '', postcode: '', plaats: '' })
  const [profielSaving, setProfielSaving] = useState(false)
  const [profielSuccess, setProfielSuccess] = useState(false)
  const [profielAdresLaden, setProfielAdresLaden] = useState(false)
  const [profielHuisnummer, setProfielHuisnummer] = useState('')

  // Vereniging bewerken/toevoegen
  const [toonVerenigingForm, setToonVerenigingForm] = useState(false)
  const [bewerkVereniging, setBewerkVereniging] = useState<Vereniging | null>(null)
  const [verenigingForm, setVerenigingForm] = useState({ naam: '', kvk: '', adres: '', postcode: '', plaats: '', telefoon: '' })
  const [verenigingSaving, setVerenigingSaving] = useState(false)
  const [adresLaden, setAdresLaden] = useState(false)

  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const [rapportBoekjaar, setRapportBoekjaar] = useState(currentYear.toString())
  const jaren = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2, currentYear - 3]
  const ADMIN_EMAIL = 'info@slimmekascontrole.nl'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/registreer'); return }
      if (session.user.email === ADMIN_EMAIL) { router.push('/admin'); return }
      setUser(session.user)
      loadData(session.user.id, session.user.email!)
    })
  }, [])

  async function loadData(userId: string, email: string) {
    // Klant ophalen
    let { data: klantData } = await supabase.from('klanten').select('*').eq('user_id', userId).single()
    if (!klantData) {
      const { data: newKlant, error: insertError } = await supabase.from('klanten').insert({ user_id: userId, email, rapport_beschikbaar: false }).select().single()
      if (insertError) { setError('Fout bij laden account'); setLoading(false); return }
      klantData = newKlant
    }
    setKlant(klantData)
    setProfielForm({ naam: klantData?.naam || '', telefoon: klantData?.telefoon || '', adres: klantData?.adres || '', postcode: klantData?.postcode || '', plaats: klantData?.plaats || '' })

    // Verenigingen ophalen
    const { data: verenigingenData } = await supabase.from('verenigingen').select('*').eq('user_id', userId).order('naam')
    const vList = verenigingenData || []
    setVerenigingen(vList)

    if (vList.length > 0) {
      setGeselecteerdeVereniging(vList[0])
      await loadUploadsEnRapporten(userId, vList[0].id)
    }

    setLoading(false)
  }

  async function loadUploadsEnRapporten(userId: string, verenigingId: string) {
    const { data: uploadsData } = await supabase.from('uploads').select('*').eq('user_id', userId).eq('vereniging_id', verenigingId).order('boekjaar', { ascending: false })
    const { data: rapportenData } = await supabase.from('rapporten').select('*').eq('user_id', userId).eq('vereniging_id', verenigingId).order('boekjaar', { ascending: false })

    setUploads(uploadsData || [])
    const rapportenLijst = rapportenData || []
    setRapporten(rapportenLijst)

    const betaaldeZonderRapport = rapportenLijst.filter(r => r.betaald && !r.rapport_tekst).sort((a, b) => b.boekjaar.localeCompare(a.boekjaar))
    const betaaldeMetRapport = rapportenLijst.filter(r => r.betaald && r.rapport_tekst).sort((a, b) => b.boekjaar.localeCompare(a.boekjaar))
    if (betaaldeZonderRapport.length > 0) { setRapportBoekjaar(betaaldeZonderRapport[0].boekjaar); setBoekjaar(betaaldeZonderRapport[0].boekjaar) }
    else if (betaaldeMetRapport.length > 0) { setRapportBoekjaar(betaaldeMetRapport[0].boekjaar); setBoekjaar(betaaldeMetRapport[0].boekjaar) }
  }

  async function handleWisselVereniging(v: Vereniging) {
    setGeselecteerdeVereniging(v)
    setUploads([])
    setRapporten([])
    setRapportBoekjaar(currentYear.toString())
    setBoekjaar(currentYear.toString())
    await loadUploadsEnRapporten(user.id, v.id)
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!files || files.length === 0) { setUploadError('Selecteer minimaal één bestand'); return }
    if (!geselecteerdeVereniging) { setUploadError('Selecteer eerst een vereniging'); return }
    setUploading(true); setUploadError('')
    const formData = new FormData()
    formData.append('user_id', user.id)
    formData.append('boekjaar', boekjaar)
    formData.append('toelichting', toelichting)
    formData.append('vereniging_id', geselecteerdeVereniging.id)
    Array.from(files).forEach(f => formData.append('files', f))
    try {
      const res = await fetch('/api/upload-direct', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setUploadSuccess(true)
        setFiles(null)
        setToelichting('')
        const fileInput = document.getElementById('fileInput') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        await loadUploadsEnRapporten(user.id, geselecteerdeVereniging.id)
        setTimeout(() => setUploadSuccess(false), 4000)
      } else { setUploadError(data.error || 'Er ging iets mis') }
    } catch { setUploadError('Er ging iets mis') }
    setUploading(false)
  }

  async function handleBetaal() {
    if (!geselecteerdeVereniging) return
    setBetaalLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, user_id: user.id, boekjaar: rapportBoekjaar, vereniging_id: geselecteerdeVereniging.id }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch { }
    setBetaalLoading(false)
  }

  async function handleGenereerRapport() {
    if (!geselecteerdeVereniging) return
    setRapportLoading(true)
    setRapportError('')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token || ''
      const res = await fetch('/api/genereer-rapport-totaal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rapport_boekjaar: rapportBoekjaar, vereniging_id: geselecteerdeVereniging.id }),
      })
      const data = await res.json()
      if (data.success) {
        await loadUploadsEnRapporten(user.id, geselecteerdeVereniging.id)
        setToonRapport(true)
      } else { setRapportError('Rapport genereren mislukt: ' + data.error) }
    } catch { setRapportError('Er ging iets mis') }
    setRapportLoading(false)
  }

  async function handleDelete(uploadId: string) {
    setDeleteLoading(uploadId)
    try {
      const upload = uploads.find(u => u.id === uploadId)
      if (upload?.bestanden?.length) await supabase.storage.from('kascontrole-bestanden').remove(upload.bestanden)
      const { error: delError } = await supabase.from('uploads').delete().eq('id', uploadId)
      if (delError) throw delError
      setUploads(prev => prev.filter(u => u.id !== uploadId))
      setBevestigDelete(null)
    } catch { setError('Verwijderen mislukt') }
    setDeleteLoading(null)
  }

  async function handleDeleteRapport(bj: string) {
    setDeleteRapportLoading(true)
    try {
      const { error } = await supabase.from('rapporten').update({ rapport_tekst: null, gegenereerd_op: null }).eq('user_id', user.id).eq('boekjaar', bj).eq('vereniging_id', geselecteerdeVereniging!.id)
      if (error) throw error
      setRapporten(prev => prev.map(r => r.boekjaar === bj ? { ...r, rapport_tekst: undefined, gegenereerd_op: undefined } : r))
      setBevestigDeleteRapport(null)
    } catch { setError('Verwijderen mislukt') }
    setDeleteRapportLoading(false)
  }

  async function zoekAdres(pc: string, hn: string) {
    if (pc.replace(' ', '').length < 6 || !hn) return
    setAdresLaden(true)
    try {
      const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ', '')}+${hn}&fq=type:adres&rows=1`)
      const data = await res.json()
      if (data.response?.docs?.[0]) {
        const doc = data.response.docs[0]
        setVerenigingForm(p => ({ ...p, adres: `${doc.straatnaam || ''} ${hn}`, plaats: doc.woonplaatsnaam || '' }))
      }
    } catch { }
    setAdresLaden(false)
  }

  async function zoekAdresProfiel(pc: string, hn: string) {
    if (pc.replace(' ', '').length < 6 || !hn) return
    setProfielAdresLaden(true)
    try {
      const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ', '')}+${hn}&fq=type:adres&rows=1`)
      const data = await res.json()
      if (data.response?.docs?.[0]) {
        const doc = data.response.docs[0]
        setProfielForm(p => ({ ...p, adres: `${doc.straatnaam || ''} ${hn}`, plaats: doc.woonplaatsnaam || '' }))
      }
    } catch {}
    setProfielAdresLaden(false)
  }

  async function handleProfielSave(e: React.FormEvent) {
    e.preventDefault()
    setProfielSaving(true)
    try {
      await supabase.from('klanten').update({ naam: profielForm.naam, telefoon: profielForm.telefoon }).eq('user_id', user.id)
      setKlant(prev => prev ? { ...prev, ...profielForm } : prev)
      setProfielSuccess(true)
      setTimeout(() => { setProfielSuccess(false); setToonProfiel(false) }, 1500)
    } catch { setError('Opslaan mislukt') }
    setProfielSaving(false)
  }

  function openVerenigingForm(v?: Vereniging) {
    if (v) {
      setBewerkVereniging(v)
      setVerenigingForm({ naam: v.naam, kvk: v.kvk || '', adres: v.adres || '', postcode: v.postcode || '', plaats: v.plaats || '', telefoon: v.telefoon || '' })
    } else {
      setBewerkVereniging(null)
      setVerenigingForm({ naam: '', kvk: '', adres: '', postcode: '', plaats: '', telefoon: '' })
    }
    setToonVerenigingForm(true)
  }

  async function handleVerenigingSave(e: React.FormEvent) {
    e.preventDefault()
    if (!verenigingForm.naam) return
    setVerenigingSaving(true)
    try {
      if (bewerkVereniging) {
        const { data } = await supabase.from('verenigingen').update(verenigingForm).eq('id', bewerkVereniging.id).select().single()
        if (data) {
          setVerenigingen(prev => prev.map(v => v.id === data.id ? data : v))
          if (geselecteerdeVereniging?.id === data.id) setGeselecteerdeVereniging(data)
        }
      } else {
        if (verenigingen.length >= 10) { setError('Maximum van 10 verenigingen bereikt'); setVerenigingSaving(false); return }
        const { data } = await supabase.from('verenigingen').insert({ ...verenigingForm, user_id: user.id }).select().single()
        if (data) {
          setVerenigingen(prev => [...prev, data])
          setGeselecteerdeVereniging(data)
          await loadUploadsEnRapporten(user.id, data.id)
        }
      }
      setToonVerenigingForm(false)
    } catch { setError('Opslaan mislukt') }
    setVerenigingSaving(false)
  }

  async function handleDeleteVereniging(v: Vereniging) {
    if (!confirm(`Vereniging "${v.naam}" verwijderen? Alle uploads en rapporten van deze vereniging blijven bewaard maar zijn niet meer gekoppeld.`)) return
    await supabase.from('verenigingen').delete().eq('id', v.id)
    const newList = verenigingen.filter(x => x.id !== v.id)
    setVerenigingen(newList)
    if (newList.length > 0) {
      setGeselecteerdeVereniging(newList[0])
      await loadUploadsEnRapporten(user.id, newList[0].id)
    } else {
      setGeselecteerdeVereniging(null)
      setUploads([])
      setRapporten([])
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/registreer')
  }

  const inp: any = { width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #bfdbfe', fontSize: '0.95rem', background: 'white', outline: 'none', fontFamily: 'Outfit, sans-serif' }
  const boekjaren = [...new Set(uploads.map(u => u.boekjaar))].sort().reverse()
  const rapportJaarNum = parseInt(rapportBoekjaar)
  const huidigRapport = rapporten.find(r => r.boekjaar === rapportBoekjaar)
  const huidigJaarBetaald = huidigRapport?.betaald || false
  const huidigJaarGegenereerd = !!huidigRapport?.rapport_tekst
  const rapportTekstVoorWeergave = huidigRapport?.rapport_tekst

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
      <p style={{ color: '#475569' }}>Laden...</p>
    </main>
  )

  if (toonRapport && rapportTekstVoorWeergave) return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`@media print { .no-print { display: none !important; } @page { size: A4 portrait; margin: 12mm 14mm; } body { background: white !important; } .rapport-wrapper { box-shadow: none !important; border: none !important; border-radius: 0 !important; padding: 8mm !important; margin: 0 !important; max-width: 100% !important; } .rapport-table { font-size: 8pt !important; width: 100% !important; } .rapport-table th, .rapport-table td { padding: 4px 6px !important; font-size: 8pt !important; } h1 { font-size: 12pt !important; } h2 { font-size: 10pt !important; } h3 { font-size: 9.5pt !important; } p, div, span { font-size: 9.5pt !important; } }`}</style>
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
        <div className="rapport-wrapper" style={{ background: 'white', borderRadius: '16px', padding: '56px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', borderBottom: '3px solid #2563EB', paddingBottom: '28px', marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#2563EB', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{ fontWeight: '700', color: '#1D4ED8', fontSize: '1.1rem', fontFamily: 'Outfit, sans-serif' }}>slimmekascontrole.nl</span>
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>KASCOMMISSIE RAPPORT</h1>
            <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem' }}>{geselecteerdeVereniging?.naam} · Boekjaar {rapportBoekjaar}</p>
          </div>
          <RapportRenderer tekst={rapportTekstVoorWeergave!} />
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>

      {/* Delete rapport modal */}
      {bevestigDeleteRapport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Rapport verwijderen?</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6 }}>Het rapport voor boekjaar {bevestigDeleteRapport} wordt permanent verwijderd.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setBevestigDeleteRapport(null)} style={{ flex: 1, padding: '12px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>Annuleren</button>
              <button onClick={() => handleDeleteRapport(bevestigDeleteRapport)} disabled={deleteRapportLoading} style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
                {deleteRapportLoading ? 'Bezig...' : 'Ja, verwijder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete upload modal */}
      {bevestigDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Upload permanent verwijderen?</h3>
            <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.6 }}>De bestanden worden <strong>permanent</strong> verwijderd en kunnen niet worden hersteld.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setBevestigDelete(null)} style={{ flex: 1, padding: '12px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>Annuleren</button>
              <button onClick={() => handleDelete(bevestigDelete)} disabled={!!deleteLoading} style={{ flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
                {deleteLoading ? 'Bezig...' : 'Ja, verwijder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profiel modal */}
      {toonProfiel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '480px', width: '100%', margin: 'auto' }}>
            <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>✏️ Persoonlijke gegevens</h3>
            <form onSubmit={handleProfielSave}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.88rem' }}>Uw naam <span style={{ fontWeight: '400', color: '#94a3b8', fontSize: '0.78rem' }}>(kascommissielid)</span></label>
                <input value={profielForm.naam} onChange={e => setProfielForm(p => ({ ...p, naam: e.target.value }))} placeholder="Volledige naam" style={inp} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.88rem' }}>Postcode + huisnummer <span style={{ fontWeight: '400', color: '#94a3b8', fontSize: '0.78rem' }}>(adres wordt automatisch ingevuld)</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', marginBottom: '6px' }}>
                  <input value={profielForm.postcode} onChange={e => setProfielForm(p => ({ ...p, postcode: e.target.value }))} placeholder="1234 AB" style={inp} />
                  <input value={profielHuisnummer} onChange={e => setProfielHuisnummer(e.target.value)} onBlur={e => zoekAdresProfiel(profielForm.postcode, e.target.value)} placeholder="Nr" style={inp} />
                </div>
                {profielAdresLaden && <p style={{ fontSize: '0.78rem', color: '#2563EB', margin: '0 0 6px' }}>🔍 Adres opzoeken...</p>}
                {profielForm.adres && profielForm.plaats && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '8px 12px', fontSize: '0.83rem', color: '#166534', marginBottom: '6px' }}>
                    ✓ {profielForm.adres}, {profielForm.postcode} {profielForm.plaats}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input value={profielForm.adres} onChange={e => setProfielForm(p => ({ ...p, adres: e.target.value }))} placeholder="Straat + huisnummer" style={{ ...inp, fontSize: '0.85rem' }} />
                  <input value={profielForm.plaats} onChange={e => setProfielForm(p => ({ ...p, plaats: e.target.value }))} placeholder="Plaats" style={{ ...inp, fontSize: '0.85rem' }} />
                </div>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.88rem' }}>Telefoonnummer <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
                <input value={profielForm.telefoon} onChange={e => setProfielForm(p => ({ ...p, telefoon: e.target.value }))} placeholder="06-12345678" style={inp} />
              </div>
              {profielSuccess && <p style={{ color: '#16a34a', fontSize: '0.85rem', marginBottom: '12px' }}>✓ Opgeslagen!</p>}
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

      {/* Vereniging toevoegen/bewerken modal */}
      {toonVerenigingForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '480px', width: '100%', margin: 'auto' }}>
            <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '20px' }}>
              {bewerkVereniging ? '✏️ Vereniging bewerken' : '➕ Nieuwe vereniging toevoegen'}
            </h3>
            <form onSubmit={handleVerenigingSave}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.88rem' }}>Naam vereniging / VvE *</label>
                <input value={verenigingForm.naam} onChange={e => setVerenigingForm(p => ({ ...p, naam: e.target.value }))} placeholder="bijv. VvE Bergschenhoek" required style={inp} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.88rem' }}>KvK-nummer <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
                <input value={verenigingForm.kvk} onChange={e => setVerenigingForm(p => ({ ...p, kvk: e.target.value }))} placeholder="12345678" style={inp} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.88rem' }}>Postcode + huisnummer <span style={{ fontWeight: '400', color: '#94a3b8', fontSize: '0.78rem' }}>(adres wordt automatisch ingevuld)</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', marginBottom: '6px' }}>
                  <input value={verenigingForm.postcode} onChange={e => setVerenigingForm(p => ({ ...p, postcode: e.target.value }))} placeholder="1234 AB" style={inp} />
                  <input placeholder="Nr" onBlur={e => zoekAdres(verenigingForm.postcode, e.target.value)} style={inp} />
                </div>
                {adresLaden && <p style={{ fontSize: '0.78rem', color: '#2563EB', margin: '0 0 6px' }}>🔍 Adres opzoeken...</p>}
                {verenigingForm.adres && verenigingForm.plaats && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '8px 12px', fontSize: '0.83rem', color: '#166534', marginBottom: '6px' }}>
                    ✓ {verenigingForm.adres}, {verenigingForm.postcode} {verenigingForm.plaats}
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input value={verenigingForm.adres} onChange={e => setVerenigingForm(p => ({ ...p, adres: e.target.value }))} placeholder="Straat + huisnummer" style={{ ...inp, fontSize: '0.85rem' }} />
                  <input value={verenigingForm.plaats} onChange={e => setVerenigingForm(p => ({ ...p, plaats: e.target.value }))} placeholder="Plaats" style={{ ...inp, fontSize: '0.85rem' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setToonVerenigingForm(false)} style={{ flex: 1, padding: '12px', background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>Annuleren</button>
                <button type="submit" disabled={verenigingSaving} style={{ flex: 1, padding: '12px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontFamily: 'Outfit, sans-serif' }}>
                  {verenigingSaving ? 'Opslaan...' : 'Opslaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-padding { padding: 0 20px !important; }
        }
        .nav-mobile-menu a { display: block; padding: 12px 16px; color: #0f172a; text-decoration: none; font-weight: 500; border-radius: 8px; font-size: 0.95rem; }
        .nav-mobile-menu a:hover { background: #f8fafc; }
        .ver-tab { padding: 8px 16px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: white; cursor: pointer; font-family: Outfit, sans-serif; font-size: 0.85rem; font-weight: 500; color: #475569; transition: all 0.15s; white-space: nowrap; }
        .ver-tab.actief { background: #2563EB; border-color: #2563EB; color: white; }
      `}</style>

      <nav className="nav-padding" style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 200, width: '100%', boxSizing: 'border-box' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: '#2563EB', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1D4ED8' }}>slimme</div>
            <div style={{ fontWeight: '500', fontSize: '1.05rem', color: '#3b82f6' }}>kascontrole</div>
          </div>
        </a>
        <ul className="nav-links-desktop" style={{ display: 'flex', gap: '28px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
          <li><a href="/#waarom" style={{ fontSize: '0.88rem', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Waarom</a></li>
          <li><a href="/#hoe-het-werkt" style={{ fontSize: '0.88rem', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Hoe het werkt</a></li>
          <li><a href="/#contact" style={{ fontSize: '0.88rem', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Contact</a></li>
          <li><a href="/mijn-omgeving" style={{ fontSize: '0.88rem', fontWeight: '500', color: '#2563EB', textDecoration: 'none' }}>Mijn omgeving</a></li>
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.3 }}>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>{klant?.naam || ''}</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user?.email}</span>
            </span>
            <button onClick={() => setToonProfiel(true)} style={{ background: 'none', border: '1.5px solid #bfdbfe', color: '#1e3a8a', padding: '7px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', fontWeight: '500' }}>✏️ Gegevens</button>
            <button onClick={handleLogout} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '9px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', fontWeight: '600' }}>Uitloggen</button>
          </li>
        </ul>
        <button className="nav-hamburger" onClick={() => setMobileMenuOpen(o => !o)} style={{ display: 'none', background: 'none', border: '1.5px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', padding: '7px', flexDirection: 'column', gap: '4px', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ display: 'block', width: '20px', height: '2px', background: '#0f172a', borderRadius: '2px' }} />
          <span style={{ display: 'block', width: '20px', height: '2px', background: '#0f172a', borderRadius: '2px' }} />
          <span style={{ display: 'block', width: '20px', height: '2px', background: '#0f172a', borderRadius: '2px' }} />
        </button>
      </nav>
      {mobileMenuOpen && (
        <div className="nav-mobile-menu" style={{ position: 'fixed', top: '72px', left: 0, right: 0, background: 'white', borderBottom: '1px solid #e2e8f0', zIndex: 199, padding: '12px 20px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <a href="/#waarom" onClick={() => setMobileMenuOpen(false)}>Waarom</a>
          <a href="/#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <a href="/mijn-omgeving" onClick={() => setMobileMenuOpen(false)} style={{ color: '#2563EB' }}>Mijn omgeving</a>
          <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '8px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: '#475569', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>{klant?.naam || ''}</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user?.email}</span>
            </span>
            <button onClick={() => { setMobileMenuOpen(false); setToonProfiel(true) }} style={{ background: 'none', border: '1.5px solid #bfdbfe', color: '#1e3a8a', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', textAlign: 'left', fontFamily: 'Outfit, sans-serif' }}>✏️ Gegevens bewerken</button>
            <button onClick={handleLogout} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>Uitloggen</button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Mijn omgeving</h1>
          <p style={{ color: '#475569' }}>Upload uw financiële bestanden en ontvang een professioneel kascontrolerapport.</p>
        </div>

        {/* Verenigingen tabs */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px 24px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', margin: 0 }}>🏢 Mijn verenigingen</h2>
            {verenigingen.length < 10 && (
              <button onClick={() => openVerenigingForm()} style={{ background: '#eff6ff', color: '#2563EB', border: '1px solid #bfdbfe', padding: '7px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
                + Vereniging toevoegen
              </button>
            )}
          </div>
          {verenigingen.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '0.9rem' }}>
              <p>Nog geen verenigingen. Voeg uw eerste vereniging toe.</p>
              <button onClick={() => openVerenigingForm()} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontFamily: 'Outfit, sans-serif', marginTop: '8px' }}>
                + Eerste vereniging toevoegen
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {verenigingen.map(v => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button className={`ver-tab${geselecteerdeVereniging?.id === v.id ? ' actief' : ''}`} onClick={() => handleWisselVereniging(v)}>
                    {v.naam}
                  </button>
                  {geselecteerdeVereniging?.id === v.id && (
                    <>
                      <button onClick={() => openVerenigingForm(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '0.8rem', padding: '4px' }} title="Bewerken">✏️</button>
                      {verenigingen.length > 1 && (
                        <button onClick={() => handleDeleteVereniging(v)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fca5a5', fontSize: '0.8rem', padding: '4px' }} title="Verwijderen">🗑️</button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
          {geselecteerdeVereniging && (
            <div style={{ marginTop: '12px', padding: '10px 14px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.82rem', color: '#475569', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {geselecteerdeVereniging.kvk && <span>KvK: {geselecteerdeVereniging.kvk}</span>}
              {geselecteerdeVereniging.adres && <span>📍 {geselecteerdeVereniging.adres}, {geselecteerdeVereniging.postcode} {geselecteerdeVereniging.plaats}</span>}
            </div>
          )}
        </div>

        {geselecteerdeVereniging && (
          <>
            {/* Boekjaar kiezen */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px 28px', border: '2px solid #bfdbfe', marginBottom: '24px' }}>
              <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '6px' }}>📅 Voor welk boekjaar wilt u het rapport?</h2>
              <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '14px' }}>Kies het boekjaar voor <strong>{geselecteerdeVereniging.naam}</strong>.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <select value={rapportBoekjaar} onChange={e => { setRapportBoekjaar(e.target.value); setBoekjaar(e.target.value) }} style={{ ...inp, width: 'auto', minWidth: '120px' }}>
                  {jaren.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  Verplicht: <strong>{rapportJaarNum}</strong> · Optioneel voor trendanalyse: {rapportJaarNum - 2}, {rapportJaarNum - 1}
                </span>
              </div>
            </div>

            {/* Upload sectie */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>📁 Bestanden uploaden voor {geselecteerdeVereniging.naam}</h2>
              <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.83rem', color: '#1e3a8a', lineHeight: 1.6 }}>
                <strong>Stap 1:</strong> Selecteer uw bestanden van boekjaar <strong>{rapportBoekjaar}</strong> en klik op <strong>Upload bestanden</strong> — dit is verplicht.<br />
                <strong>Optioneel:</strong> Voor trendanalyse upload ook bestanden van {parseInt(rapportBoekjaar) - 2} en {parseInt(rapportBoekjaar) - 1}.<br />
                <span style={{ color: '#64748b', fontSize: '0.85em' }}>Ondersteunde typen: PDF, Excel, CSV, Word, PNG, JPG, HEIC · Max 10MB per bestand</span>
              </div>
              <form onSubmit={handleUpload}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px', alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '6px', fontSize: '0.88rem' }}>Boekjaar van deze bestanden</label>
                    <select value={boekjaar} onChange={e => setBoekjaar(e.target.value)} style={inp}>
                      {jaren.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '6px', fontSize: '0.88rem' }}>Bestanden</label>
                    <div onClick={() => document.getElementById('fileInput')?.click()} style={{ border: '2px dashed #93c5fd', borderRadius: '8px', padding: '12px 16px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', fontSize: '0.88rem', color: '#475569' }}>
                      {files ? `${files.length} bestand(en) ✓` : '📎 Klik om te selecteren'}
                    </div>
                    <input id="fileInput" type="file" multiple accept=".pdf,.xlsx,.xls,.csv,.txt,.ods,.docx,.doc,.png,.jpg,.jpeg,.heic" style={{ display: 'none' }} onChange={e => setFiles(e.target.files)} />
                  </div>
                </div>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '6px', fontSize: '0.88rem' }}>Toelichting <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
                  <textarea value={toelichting} onChange={e => setToelichting(e.target.value)} placeholder="Bijzonderheden voor dit boekjaar..." rows={2} style={{ ...inp, resize: 'vertical' }} />
                </div>
                {uploadSuccess && <p style={{ color: '#16a34a', fontSize: '0.85rem', marginBottom: '10px' }}>✓ Bestanden geüpload!</p>}
                {uploadError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '10px' }}>{uploadError}</p>}
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
                  <p style={{ color: '#475569', fontSize: '0.9rem' }}>Nog geen uploads voor {geselecteerdeVereniging.naam}.</p>
                </div>
              ) : (
                <div>
                  {uploads.map(upload => (
                    <div key={upload.id} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                          <span style={{ fontWeight: '700', color: '#0f172a' }}>Boekjaar {upload.boekjaar}</span>
                          <span style={{ background: '#eff6ff', color: '#2563EB', padding: '2px 8px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '600' }}>{upload.bestanden?.length || 0} bestand(en)</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                          {new Date(upload.upload_datum).toLocaleDateString('nl-NL')}
                          {upload.toelichting && ` · ${upload.toelichting.substring(0, 50)}`}
                        </p>
                      </div>
                      <button onClick={() => setBevestigDelete(upload.id)} style={{ background: 'none', border: '1.5px solid #fecaca', color: '#ef4444', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Eerdere rapporten */}
            {rapporten.filter(r => r.rapport_tekst && r.boekjaar !== rapportBoekjaar).length > 0 && (
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '24px' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>📋 Eerdere rapporten</h2>
                </div>
                {rapporten.filter(r => r.rapport_tekst && r.boekjaar !== rapportBoekjaar).map(r => (
                  <div key={r.boekjaar} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontWeight: '700', color: '#0f172a' }}>Boekjaar {r.boekjaar}</span>
                      {r.gegenereerd_op && <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '12px' }}>Gegenereerd op {new Date(r.gegenereerd_op).toLocaleDateString('nl-NL')}</span>}
                    </div>
                    <button onClick={() => { setRapportBoekjaar(r.boekjaar); setToonRapport(true) }} style={{ background: 'white', color: '#2563EB', padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #2563EB', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                      📄 Bekijk
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Betaal / Rapport sectie */}
            {!huidigJaarBetaald ? (
              <div style={{ background: 'white', borderRadius: '16px', padding: '24px 28px', border: '2px solid #bfdbfe', marginBottom: '24px' }}>
                <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '6px' }}>💳 Stap 2: Betalen en rapport ontvangen</h2>
                <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '16px' }}>
                  Upload eerst uw bestanden (stap 1), betaal daarna éénmalig €59 via iDEAL voor <strong>{geselecteerdeVereniging.naam}</strong> boekjaar <strong>{rapportBoekjaar}</strong>.
                </p>
                <button onClick={handleBetaal} disabled={betaalLoading || uploads.length === 0} style={{ background: uploads.length === 0 ? '#94a3b8' : '#2563EB', color: 'white', padding: '14px 32px', borderRadius: '8px', border: 'none', fontSize: '1rem', fontWeight: '700', cursor: uploads.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                  {betaalLoading ? 'Laden...' : uploads.length === 0 ? '⬆️ Upload eerst bestanden' : '🔒 Betaal €59 via iDEAL'}
                </button>
              </div>
            ) : (
              <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '24px 28px', border: '2px solid #2563EB', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h2 style={{ fontWeight: '700', color: '#1D4ED8', fontSize: '1rem', marginBottom: '4px' }}>✅ Betaald — rapport beschikbaar</h2>
                  <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>{huidigJaarGegenereerd ? `Rapport gegenereerd op ${new Date(huidigRapport!.gegenereerd_op!).toLocaleDateString('nl-NL')}` : `U kunt nu uw rapport genereren voor ${geselecteerdeVereniging.naam} boekjaar ${rapportBoekjaar}.`}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {huidigJaarGegenereerd && (
                    <>
                      <button onClick={() => setToonRapport(true)} style={{ background: 'white', color: '#1D4ED8', padding: '12px 20px', borderRadius: '8px', border: '1.5px solid #2563EB', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>📄 Bekijk rapport</button>
                      <button onClick={() => setBevestigDeleteRapport(rapportBoekjaar)} style={{ background: 'none', border: '1.5px solid #fecaca', color: '#ef4444', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
                    </>
                  )}
                  <button onClick={handleGenereerRapport} disabled={rapportLoading} style={{ background: '#2563EB', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: '700', cursor: rapportLoading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                    {rapportLoading ? '⏳ Genereren...' : huidigJaarGegenereerd ? '🔄 Rapport vernieuwen' : '📊 Genereer rapport'}
                  </button>
                </div>
              </div>
            )}

            {rapportError && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.9rem' }}>{rapportError}</p>}
            {error && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</p>}

            {/* Disclaimer */}
            <div style={{ background: '#fffbeb', borderRadius: '12px', padding: '16px 20px', border: '1px solid #fde68a', marginTop: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#92400e', lineHeight: 1.6 }}>
                <strong>⚠️ Disclaimer:</strong> Het kascontrolerapport is een hulpmiddel voor de kascommissie en wordt opgesteld op basis van de door u aangeleverde documenten. Wij adviseren de kascontroleur om het rapport te gebruiken als ondersteuning bij zijn of haar eigen controle en de bevindingen zelf te verifiëren. Slimme Kascontrole is niet aansprakelijk voor eventuele fouten of beslissingen op basis van het rapport. De verantwoordelijkheid voor de kascontrole blijft bij de kascommissie. Zie ook onze <a href="/voorwaarden" style={{ color: '#92400e' }}>algemene voorwaarden</a>.
              </p>
            </div>
            {rapportLoading && (
              <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                <p style={{ color: '#1D4ED8', margin: 0, fontSize: '0.9rem' }}>⏳ Uw uploads worden geanalyseerd voor {geselecteerdeVereniging.naam} boekjaar {rapportBoekjaar}... Dit duurt circa 2 minuten.</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
