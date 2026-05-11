'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { RapportRenderer } from '@/components/RapportRenderer'
import Navbar from '@/components/Navbar'

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
  adres?: string
  postcode?: string
  plaats?: string
}

interface Vereniging {
  id: string
  user_id: string
  naam: string
  kvk?: string
  adres?: string
  postcode?: string
  plaats?: string
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
  const standaardBoekjaar = (new Date().getFullYear() - 1).toString()
  const [boekjaar, setBoekjaar] = useState(standaardBoekjaar)
  const [toelichting, setToelichting] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [rapportError, setRapportError] = useState('')
  const [toonRapport, setToonRapport] = useState(false)
  const [verborgenRapportJaren, setVerborgenRapportJaren] = useState<Set<string>>(new Set())
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
  const [verenigingForm, setVerenigingForm] = useState({ naam: '', kvk: '', adres: '', postcode: '', plaats: '' })
  const [verenigingHuisnummer, setVerenigingHuisnummer] = useState('')
  const [verenigingSaving, setVerenigingSaving] = useState(false)
  const [adresLaden, setAdresLaden] = useState(false)

  const router = useRouter()
  const currentYear = new Date().getFullYear()

  function haalHuisnummerUitAdres(adres?: string) {
    const match = (adres || '').match(/\b(\d+[A-Za-z0-9\-]*)\b\s*$/)
    return match ? match[1] : ''
  }
  const [rapportBoekjaar, setRapportBoekjaar] = useState(standaardBoekjaar)
  const jaren = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4, currentYear - 5]
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
    setRapportBoekjaar(standaardBoekjaar)
    setBoekjaar(standaardBoekjaar)
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
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch('/api/upload-direct', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token || ''}`
        },
        body: formData
      })
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

  async function handleDeleteRapport(userId: string, boekjaar: string) {
    if (!confirm(`Rapport voor boekjaar ${boekjaar} verwijderen?`)) return

    setVerborgenRapportJaren(prev => new Set(prev).add(rapportJaarKey(userId, boekjaar)))

    try {
      const { error: rapportError } = await supabase
        .from('rapporten')
        .delete()
        .eq('user_id', userId)
        .eq('boekjaar', boekjaar)

      if (rapportError) {
        console.error(rapportError)

        setVerborgenRapportJaren(prev => {
          const next = new Set(prev)
          next.delete(rapportJaarKey(userId, boekjaar))
          return next
        })

        alert('Verwijderen mislukt')
        return
      }

      await supabase
        .from('uploads')
        .delete()
        .eq('user_id', userId)
        .eq('boekjaar', boekjaar)

      setRapporten(prev =>
        prev.filter(r => !(r.user_id === userId && r.boekjaar === boekjaar))
      )

      setUploads(prev =>
        prev.filter(u => !(u.user_id === userId && u.boekjaar === boekjaar))
      )

      await loadData()
    } catch (err) {
      console.error(err)

      setVerborgenRapportJaren(prev => {
        const next = new Set(prev)
        next.delete(rapportJaarKey(userId, boekjaar))
        return next
      })

      alert('Verwijderen mislukt')
    }
  }

async function zoekAdres(pc: string, hn: string) {
    if (pc.replace(' ', '').length < 6 || !hn) return
    setVerenigingHuisnummer(hn)
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
    setProfielHuisnummer(hn)
    setProfielAdresLaden(true)
    try {
      const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ', '')}+${hn}&fq=type:adres&rows=1`)
      const data = await res.json()
      if (data.response?.docs?.[0]) {
        const doc = data.response.docs[0]
        setProfielForm(p => ({ ...p, postcode: pc, adres: `${doc.straatnaam || ''} ${hn}`, plaats: doc.woonplaatsnaam || '' }))
      }
    } catch {}
    setProfielAdresLaden(false)
  }

  async function handleProfielSave(e: React.FormEvent) {
    e.preventDefault()
    setProfielSaving(true)

    try {
      let updateData = {
        naam: profielForm.naam,
        telefoon: profielForm.telefoon,
        adres: profielForm.adres,
        postcode: profielForm.postcode,
        plaats: profielForm.plaats,
      }

      // Als de gebruiker direct na postcode/huisnummer op Opslaan klikt,
      // kan de onBlur-adrescheck nog bezig zijn. Daarom checken we hier nogmaals.
      if (profielForm.postcode && profielHuisnummer) {
        try {
          const pc = profielForm.postcode
          const hn = profielHuisnummer
          const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ', '')}+${hn}&fq=type:adres&rows=1`)
          const data = await res.json()

          if (data.response?.docs?.[0]) {
            const doc = data.response.docs[0]
            updateData = {
              ...updateData,
              postcode: pc,
              adres: `${doc.straatnaam || ''} ${hn}`,
              plaats: doc.woonplaatsnaam || '',
            }
          }
        } catch {
          // Als lookup faalt, slaan we de handmatig ingevulde velden alsnog op.
        }
      }

      const { data, error } = await supabase
        .from('klanten')
        .update(updateData)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        setError('Opslaan mislukt: ' + error.message)
        setProfielSaving(false)
        return
      }

      const opgeslagenKlant = data || { ...klant, ...updateData }

      setKlant(opgeslagenKlant)
      setProfielForm({
        naam: opgeslagenKlant?.naam || '',
        telefoon: opgeslagenKlant?.telefoon || '',
        adres: opgeslagenKlant?.adres || '',
        postcode: opgeslagenKlant?.postcode || '',
        plaats: opgeslagenKlant?.plaats || '',
      })
      setProfielHuisnummer('')
      setProfielSuccess(true)
      setTimeout(() => { setProfielSuccess(false); setToonProfiel(false) }, 1500)
    } catch {
      setError('Opslaan mislukt')
    }

    setProfielSaving(false)
  }

  function openVerenigingForm(v?: Vereniging) {
    if (v) {
      setBewerkVereniging(v)
      setVerenigingForm({ naam: v.naam, kvk: v.kvk || '', adres: v.adres || '', postcode: v.postcode || '', plaats: v.plaats || '' })
      setVerenigingHuisnummer(haalHuisnummerUitAdres(v.adres))
    } else {
      setBewerkVereniging(null)
      setVerenigingForm({ naam: '', kvk: '', adres: '', postcode: '', plaats: '' })
      setVerenigingHuisnummer('')
    }
    setToonVerenigingForm(true)
  }

  async function handleVerenigingSave(e: React.FormEvent) {
    e.preventDefault()
    if (!verenigingForm.naam) return
    setVerenigingSaving(true)
    try {
      let saveData = { ...verenigingForm }

      // Ook bij direct opslaan na postcode/huisnummer nogmaals ophalen,
      // zodat het echte adresveld inclusief huisnummer wordt opgeslagen.
      if (verenigingForm.postcode && verenigingHuisnummer) {
        try {
          const pc = verenigingForm.postcode
          const hn = verenigingHuisnummer
          const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ', '')}+${hn}&fq=type:adres&rows=1`)
          const data = await res.json()
          if (data.response?.docs?.[0]) {
            const doc = data.response.docs[0]
            saveData = {
              ...saveData,
              postcode: pc,
              adres: `${doc.straatnaam || ''} ${hn}`,
              plaats: doc.woonplaatsnaam || '',
            }
            setVerenigingForm(saveData)
          }
        } catch {
          // Als lookup faalt, slaan we handmatig ingevulde velden alsnog op.
        }
      }

      if (bewerkVereniging) {
        const { data } = await supabase.from('verenigingen').update(saveData).eq('id', bewerkVereniging.id).select().single()
        if (data) {
          setVerenigingen(prev => prev.map(v => v.id === data.id ? data : v))
          if (geselecteerdeVereniging?.id === data.id) setGeselecteerdeVereniging(data)
        }
      } else {
        if (verenigingen.length >= 10) { setError('Maximum van 10 verenigingen bereikt'); setVerenigingSaving(false); return }
        const { data } = await supabase.from('verenigingen').insert({ ...saveData, user_id: user.id }).select().single()
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
    if (!user) return
    if (!confirm(`Vereniging "${v.naam}" verwijderen? Uploads en rapporten blijven bewaard, maar worden losgekoppeld van deze vereniging.`)) return

    setError('')

    try {
      const { error: uploadsError } = await supabase
        .from('uploads')
        .update({ vereniging_id: null })
        .eq('user_id', user.id)
        .eq('vereniging_id', v.id)

      if (uploadsError) {
        setError(`Vereniging verwijderen mislukt: uploads konden niet worden losgekoppeld. ${uploadsError.message}`)
        return
      }

      const { error: rapportenError } = await supabase
        .from('rapporten')
        .update({ vereniging_id: null })
        .eq('user_id', user.id)
        .eq('vereniging_id', v.id)

      if (rapportenError) {
        setError(`Vereniging verwijderen mislukt: rapporten konden niet worden losgekoppeld. ${rapportenError.message}`)
        return
      }

      const { data: verwijderd, error: deleteError } = await supabase
        .from('verenigingen')
        .delete()
        .eq('id', v.id)
        .eq('user_id', user.id)
        .select('id')

      if (deleteError) {
        setError(`Vereniging verwijderen mislukt. ${deleteError.message}`)
        return
      }

      if (!verwijderd || verwijderd.length === 0) {
        setError('Vereniging verwijderen mislukt. Controleer of de delete-policy in Supabase goed staat ingesteld.')
        return
      }

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Vereniging verwijderen mislukt')
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/registreer')
  }

  const inp: any = { width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #bfdbfe', fontSize: '0.84rem', background: 'white', outline: 'none', fontFamily: 'Outfit, sans-serif' }
  const boekjaren = [...new Set(uploads.map(u => u.boekjaar))].sort().reverse()
  const rapportJaarNum = parseInt(rapportBoekjaar)
  const trendJaren = rapportBoekjaar
    ? [rapportJaarNum - 2, rapportJaarNum - 1, rapportJaarNum + 1].join(', ')
    : ''
  const huidigRapport = rapporten.find(r => r.boekjaar === rapportBoekjaar)
  const huidigJaarBetaald = huidigRapport?.betaald || false
  const huidigJaarGegenereerd = !!huidigRapport?.rapport_tekst
  const rapportTekstVoorWeergave = huidigRapport?.rapport_tekst
  const uploadsVoorRapportjaar = uploads.filter(u => u.boekjaar === rapportBoekjaar)
  const heeftUploadsVoorRapportjaar = uploadsVoorRapportjaar.length > 0
  const huidigeStap = !geselecteerdeVereniging
    ? 1
    : !rapportBoekjaar
      ? 2
      : !heeftUploadsVoorRapportjaar
        ? 3
        : huidigJaarBetaald
          ? 4
          : 3
  const workflowStappen = [
    { nr: 1, titel: 'Kies VvE', tekst: geselecteerdeVereniging?.naam || 'Selecteer vereniging' },
    { nr: 2, titel: 'Kies boekjaar', tekst: `Boekjaar ${rapportBoekjaar}` },
    { nr: 3, titel: 'Upload bestanden', tekst: heeftUploadsVoorRapportjaar ? `${uploadsVoorRapportjaar.length} upload(s)` : 'Nog te uploaden' },
    { nr: 4, titel: huidigJaarGegenereerd ? 'Rapport beschikbaar' : huidigJaarBetaald ? 'Rapport wordt gegenereerd' : 'Rapport ontvangen', tekst: huidigJaarGegenereerd ? 'Download gereed' : huidigJaarBetaald ? 'Analyse bezig — circa 2 minuten' : 'Na betaling' },
  ]

  if (loading) return (
    <main style={{ minHeight: '100vh', paddingTop: '72px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
      <p style={{ color: '#475569' }}>Laden...</p>
    </main>
  )

  if (toonRapport && rapportTekstVoorWeergave) return (
    <main style={{ minHeight: '100vh', paddingTop: '72px', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`@media print { .no-print { display: none !important; } @page { size: A4 portrait; margin: 12mm 14mm; } body { background: white !important; } .rapport-wrapper { box-shadow: none !important; border: none !important; border-radius: 0 !important; padding: 8mm !important; margin: 0 !important; max-width: 100% !important; } .rapport-table { font-size: 8pt !important; width: 100% !important; } .rapport-table th, .rapport-table td { padding: 4px 6px !important; font-size: 8pt !important; } h1 { font-size: 12pt !important; } h2 { font-size: 10pt !important; } h3 { font-size: 9.5pt !important; } p, div, span { font-size: 9.5pt !important; } }`}</style>
      <Navbar
        className="no-print"
        links={[{ href: '/', label: '← Terug naar home' }]}
        rightContent={(
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => window.print()} style={{ background: '#2563EB', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '0.84rem', fontFamily: 'Outfit, sans-serif' }}>🖨️ Afdrukken / PDF</button>
            <button onClick={() => setToonRapport(false)} style={{ background: 'white', color: '#1e3a8a', padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #bfdbfe', cursor: 'pointer', fontWeight: '600', fontSize: '0.84rem', fontFamily: 'Outfit, sans-serif' }}>← Terug</button>
          </div>
        )}
        mobileExtra={(
          <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '8px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => window.print()} style={{ background: '#2563EB', color: 'white', padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.84rem', fontFamily: 'Outfit, sans-serif' }}>🖨️ Afdrukken / PDF</button>
            <button onClick={() => setToonRapport(false)} style={{ background: 'white', color: '#1e3a8a', padding: '12px 16px', borderRadius: '8px', border: '1.5px solid #bfdbfe', cursor: 'pointer', fontWeight: '600', fontSize: '0.84rem', fontFamily: 'Outfit, sans-serif' }}>← Terug</button>
          </div>
        )}
      />
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
        <div className="rapport-wrapper" style={{ background: 'white', borderRadius: '16px', padding: '56px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', borderBottom: '3px solid #2563EB', paddingBottom: '28px', marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#2563EB', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <span style={{ fontWeight: '700', color: '#1D4ED8', fontSize: '1.1rem', fontFamily: 'Outfit, sans-serif' }}>slimmekascontrole.nl</span>
            </div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: '600', color: '#0f172a', margin: '0 0 8px' }}>KASCOMMISSIE RAPPORT</h1>
            <p style={{ color: '#475569', margin: 0, fontSize: '0.84rem' }}>{geselecteerdeVereniging?.naam} · Boekjaar {rapportBoekjaar}</p>
          </div>
          <RapportRenderer tekst={rapportTekstVoorWeergave!} />
        </div>
      </div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', paddingTop: '72px', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>

      {/* Delete rapport modal */}
      {bevestigDeleteRapport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🗑️</div>
            <h3 style={{ fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Boekjaar verwijderen?</h3>
            <p style={{ color: '#475569', fontSize: '0.84rem', marginBottom: '24px', lineHeight: 1.6 }}>De rapport-/betaalregel voor boekjaar {bevestigDeleteRapport} wordt permanent verwijderd. Eventuele uploads kunt u apart verwijderen bij de uploads.</p>
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
            <h3 style={{ fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Upload permanent verwijderen?</h3>
            <p style={{ color: '#475569', fontSize: '0.84rem', marginBottom: '24px', lineHeight: 1.6 }}>De bestanden worden <strong>permanent</strong> verwijderd en kunnen niet worden hersteld.</p>
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
            <h3 style={{ fontWeight: '600', color: '#0f172a', marginBottom: '20px' }}>✏️ Persoonlijke gegevens</h3>
            <form onSubmit={handleProfielSave}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.84rem' }}>Uw naam <span style={{ fontWeight: '400', color: '#94a3b8', fontSize: '0.78rem' }}>(kascommissielid)</span></label>
                <input value={profielForm.naam} onChange={e => setProfielForm(p => ({ ...p, naam: e.target.value }))} placeholder="Volledige naam" style={inp} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.84rem' }}>Postcode + huisnummer <span style={{ fontWeight: '400', color: '#94a3b8', fontSize: '0.78rem' }}>(adres wordt automatisch ingevuld)</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(90px, 1fr)', gap: '8px', marginBottom: '6px', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                  <input value={profielForm.postcode} onChange={e => setProfielForm(p => ({ ...p, postcode: e.target.value }))} onKeyDown={e => e.key === 'Enter' && e.preventDefault()} placeholder="1234 AB" style={inp} />
                  <input value={profielHuisnummer} onChange={e => setProfielHuisnummer(e.target.value)} onBlur={e => zoekAdresProfiel(profielForm.postcode, e.target.value)} onKeyDown={e => e.key === 'Enter' && e.preventDefault()} placeholder="Nr" style={inp} />
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
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.84rem' }}>Telefoonnummer <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
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
            <h3 style={{ fontWeight: '600', color: '#0f172a', marginBottom: '20px' }}>
              {bewerkVereniging ? '✏️ Vereniging bewerken' : '➕ Nieuwe vereniging toevoegen'}
            </h3>
            <form onSubmit={handleVerenigingSave}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.84rem' }}>Naam vereniging / VvE *</label>
                <input value={verenigingForm.naam} onChange={e => setVerenigingForm(p => ({ ...p, naam: e.target.value }))} placeholder="bijv. VvE Bergschenhoek" required style={inp} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.84rem' }}>KvK-nummer <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
                <input value={verenigingForm.kvk} onChange={e => setVerenigingForm(p => ({ ...p, kvk: e.target.value }))} placeholder="12345678" style={inp} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '5px', fontSize: '0.84rem' }}>Postcode + huisnummer <span style={{ fontWeight: '400', color: '#94a3b8', fontSize: '0.78rem' }}>(adres wordt automatisch ingevuld)</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(90px, 1fr)', gap: '8px', marginBottom: '6px', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                  <input value={verenigingForm.postcode} onChange={e => setVerenigingForm(p => ({ ...p, postcode: e.target.value }))} onKeyDown={e => e.key === 'Enter' && e.preventDefault()} placeholder="1234 AB" style={inp} />
                  <input value={verenigingHuisnummer} onChange={e => setVerenigingHuisnummer(e.target.value)} onBlur={e => zoekAdres(verenigingForm.postcode, e.target.value)} onKeyDown={e => e.key === 'Enter' && e.preventDefault()} placeholder="Nr" style={inp} />
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
        @media (max-width: 768px) {
          .workflow-grid { grid-template-columns: 1fr !important; }
          .step-grid { grid-template-columns: 1fr !important; }
          .upload-grid { grid-template-columns: 1fr !important; }
          .card-actions { flex-direction: column !important; align-items: stretch !important; }
        }
      `}</style>

      <Navbar
        links={[
          { href: '/#waarom', label: 'Waarom' },
          { href: '/#hoe-het-werkt', label: 'Hoe het werkt' },
          { href: '/#handleidingen', label: 'Handleidingen' },
          { href: '/#over-ons', label: 'Over ons' },
          { href: '/#tarieven', label: 'Tarieven' },
          { href: '/#contact', label: 'Contact' },
          { href: '/mijn-omgeving', label: 'Mijn omgeving', active: true },
        ]}
        rightContent={(
          <>
            <ul className="skc-nav-links" style={{ display: 'flex', gap: '22px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
              <li><a href="/#waarom">Waarom</a></li>
              <li><a href="/#hoe-het-werkt">Hoe het werkt</a></li>
              <li><a href="/#handleidingen">Handleidingen</a></li>
              <li><a href="/#over-ons">Over ons</a></li>
              <li><a href="/#tarieven">Tarieven</a></li>
              <li><a href="/#contact">Contact</a></li>
              <li><a href="/mijn-omgeving" style={{ color: '#2563EB' }}>Mijn omgeving</a></li>
            </ul>
            <span style={{ fontSize: '0.78rem', color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.3 }}>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>{klant?.naam || ''}</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user?.email}</span>
            </span>
            <button onClick={() => { setProfielHuisnummer(haalHuisnummerUitAdres(profielForm.adres)); setToonProfiel(true) }} style={{ background: 'none', border: '1.5px solid #bfdbfe', color: '#1e3a8a', padding: '7px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', fontWeight: '500' }}>✏️ Gegevens</button>
            <button onClick={handleLogout} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '9px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.84rem', fontFamily: 'Outfit, sans-serif', fontWeight: '600' }}>Uitloggen</button>
          </>
        )}
        mobileExtra={(
          <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '8px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#475569', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>{klant?.naam || ''}</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user?.email}</span>
            </span>
            <button onClick={() => { setProfielHuisnummer(haalHuisnummerUitAdres(profielForm.adres)); setToonProfiel(true) }} style={{ background: 'none', border: '1.5px solid #bfdbfe', color: '#1e3a8a', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: '600', textAlign: 'left', fontFamily: 'Outfit, sans-serif' }}>✏️ Gegevens bewerken</button>
            <button onClick={handleLogout} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: '700', textAlign: 'center', fontFamily: 'Outfit, sans-serif' }}>Uitloggen</button>
          </div>
        )}
      />

      <div style={{ maxWidth: '1040px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '26px', display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#dbeafe', color: '#1D4ED8', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '600', marginBottom: '12px' }}>
              Mijn kascontrole
            </span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: '600', color: '#0f172a', marginBottom: '6px', letterSpacing: '-0.03em' }}>Mijn omgeving</h1>
            <p style={{ color: '#475569', fontSize: '0.92rem', margin: 0 }}>Volg de stappen en ontvang een professioneel kascontrolerapport.</p>
          </div>
          {geselecteerdeVereniging && (
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '14px 16px', minWidth: '220px', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Geselecteerd</div>
              <div style={{ color: '#0f172a', fontWeight: '700' }}>{geselecteerdeVereniging.naam}</div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>Boekjaar {rapportBoekjaar}</div>
            </div>
          )}
        </div>

        <div className="workflow-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {workflowStappen.map((stap, index) => {
            const klaar = stap.nr === 4 ? huidigJaarGegenereerd : huidigeStap > stap.nr
            const bezig = stap.nr === 4 && huidigJaarBetaald && !huidigJaarGegenereerd
            const actief = !klaar && huidigeStap === stap.nr && !bezig
            return (
              <div key={stap.nr} style={{ background: klaar ? '#f0fdf4' : (actief || bezig) ? '#eff6ff' : 'white', border: `1px solid ${klaar ? '#bbf7d0' : (actief || bezig) ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: '14px', padding: '14px', boxShadow: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: klaar ? '#dcfce7' : (actief || bezig) ? '#2563EB' : '#f1f5f9', color: klaar ? '#166534' : (actief || bezig) ? 'white' : '#94a3b8', fontWeight: '700', fontSize: '0.84rem' }}>
                    {klaar ? '✓' : stap.nr}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: (actief || bezig) ? '#2563EB' : '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Stap {index + 1}
                  </div>
                </div>
                <div style={{ color: '#0f172a', fontWeight: '600', marginBottom: '4px' }}>{stap.titel}</div>
                <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{stap.tekst}</div>
              </div>
            )
          })}
        </div>

        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '22px', marginBottom: '22px', boxShadow: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Stap 1</div>
              <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>Kies de VvE</h2>
              <p style={{ color: '#475569', margin: '6px 0 0', fontSize: '0.84rem' }}>Selecteer voor welke vereniging u wilt uploaden of rapporteren.</p>
            </div>
            {verenigingen.length < 10 && (
              <button onClick={() => openVerenigingForm()} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '11px 18px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.84rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif', boxShadow: 'none' }}>
                + Vereniging toevoegen
              </button>
            )}
          </div>

          {verenigingen.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '34px', color: '#64748b', background: 'white', border: '1px dashed #bfdbfe', borderRadius: '18px' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🏢</div>
              <p style={{ marginTop: 0 }}>Nog geen verenigingen. Voeg uw eerste vereniging toe.</p>
              <button onClick={() => openVerenigingForm()} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '12px 22px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontFamily: 'Outfit, sans-serif', marginTop: '8px' }}>
                + Eerste vereniging toevoegen
              </button>
            </div>
          ) : (
            <div className="step-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
              {verenigingen.map(v => {
                const actief = geselecteerdeVereniging?.id === v.id
                return (
                  <div key={v.id} style={{ background: actief ? '#eff6ff' : 'white', border: `1px solid ${actief ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: '14px', padding: '14px', boxShadow: 'none' }}>
                    <button onClick={() => handleWisselVereniging(v)} style={{ width: '100%', background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: '600', color: '#0f172a', marginBottom: '5px' }}>{v.naam}</div>
                          {v.kvk && <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '4px' }}>KvK: {v.kvk}</div>}
                          {v.adres && <div style={{ fontSize: '0.78rem', color: '#64748b' }}>📍 {v.adres}, {v.postcode} {v.plaats}</div>}
                        </div>
                        <span style={{ background: actief ? '#2563EB' : '#f1f5f9', color: actief ? 'white' : '#64748b', borderRadius: '999px', padding: '6px 10px', fontSize: '0.72rem', fontWeight: '700', whiteSpace: 'nowrap' }}>
                          {actief ? 'Geselecteerd' : 'Kies'}
                        </span>
                      </div>
                    </button>
                    {actief && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                        <button onClick={() => openVerenigingForm(v)} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563EB', cursor: 'pointer', fontSize: '0.78rem', padding: '7px 10px', borderRadius: '10px', fontWeight: '700' }}>✏️ Bewerken</button>
                        {verenigingen.length > 1 && (
                          <button onClick={() => handleDeleteVereniging(v)} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', fontSize: '0.78rem', padding: '7px 10px', borderRadius: '10px', fontWeight: '700' }}>🗑️ Verwijderen</button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {geselecteerdeVereniging && (
          <>
            <div style={{ background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', marginBottom: '26px', boxShadow: 'none' }}>
              <div style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Stap 2</div>
              <h2 style={{ fontWeight: '600', color: '#0f172a', fontSize: '1.12rem', marginBottom: '6px' }}>Kies het boekjaar</h2>
              <p style={{ color: '#475569', fontSize: '0.84rem', marginBottom: '18px' }}>Voor welk boekjaar wilt u een kascontrolerapport maken voor <strong>{geselecteerdeVereniging.naam}</strong>?</p>
              <div className="upload-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 260px) 1fr', gap: '16px', alignItems: 'stretch' }}>
                <select value={rapportBoekjaar} onChange={e => { setRapportBoekjaar(e.target.value); setBoekjaar(e.target.value) }} style={{ ...inp, minHeight: '54px', fontSize: '0.84rem', fontWeight: '700', borderRadius: '14px', borderColor: '#93c5fd' }}>
                  {jaren.map(j => <option key={j} value={j}>Boekjaar {j}</option>)}
                </select>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '14px 16px', color: '#475569', fontSize: '0.84rem', lineHeight: 1.6 }}>
                  <strong style={{ color: '#0f172a' }}>Verplicht:</strong> upload bestanden van {rapportJaarNum}.<br />
                  <strong style={{ color: '#0f172a' }}>Optioneel voor trendanalyse:</strong> upload ook {rapportJaarNum - 2} en {rapportJaarNum - 1}.
                </div>
              </div>
            </div>

            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', marginBottom: '26px', boxShadow: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '18px' }}>
                <div>
                  <div style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Stap 3</div>
                  <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>Upload uw bestanden</h2>
                  <p style={{ color: '#475569', margin: '6px 0 0', fontSize: '0.84rem' }}>Voeg de financiële documenten toe voor {geselecteerdeVereniging.naam}.</p>
                </div>
                <div style={{ background: heeftUploadsVoorRapportjaar ? '#f0fdf4' : '#fffbeb', border: `1px solid ${heeftUploadsVoorRapportjaar ? '#bbf7d0' : '#fde68a'}`, color: heeftUploadsVoorRapportjaar ? '#166534' : '#92400e', padding: '9px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '700' }}>
                  {heeftUploadsVoorRapportjaar ? `✓ ${uploadsVoorRapportjaar.length} upload(s) voor ${rapportBoekjaar}` : `Nog geen uploads voor ${rapportBoekjaar}`}
                </div>
              </div>

              <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '14px 16px', marginBottom: '18px', fontSize: '0.84rem', color: '#1e3a8a', lineHeight: 1.65 }}>
                Upload in ieder geval de bestanden van boekjaar <strong>{rapportBoekjaar}</strong>. Voor trendanalyse kunt u daarna extra jaren uploaden via het veld “Boekjaar van deze bestanden”.<br />
                <span style={{ color: '#64748b', fontSize: '0.88em' }}>Ondersteunde typen: PDF, Excel, CSV, Word, PNG, JPG, HEIC · Max 10MB per bestand</span>
              </div>

              <form onSubmit={handleUpload}>
                <div className="upload-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px', marginBottom: '16px', alignItems: 'stretch' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '7px', fontSize: '0.84rem' }}>Boekjaar van deze bestanden</label>
                    <select value={boekjaar} onChange={e => setBoekjaar(e.target.value)} style={{ ...inp, minHeight: '52px', borderRadius: '14px' }}>
                      {jaren.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '7px', fontSize: '0.84rem' }}>Bestanden</label>
                    <div onClick={() => document.getElementById('fileInput')?.click()} style={{ border: '2px dashed #60a5fa', borderRadius: '16px', padding: '18px 20px', minHeight: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: files ? '#f0fdf4' : '#f8fafc', fontSize: '0.84rem', color: files ? '#166534' : '#475569', fontWeight: '700' }}>
                      {files ? `✓ ${files.length} bestand(en) geselecteerd` : '📎 Klik om bestanden te selecteren'}
                    </div>
                    <input id="fileInput" type="file" multiple accept=".pdf,.xlsx,.xls,.csv,.txt,.ods,.docx,.doc,.png,.jpg,.jpeg,.heic" style={{ display: 'none' }} onChange={e => setFiles(e.target.files)} />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '7px', fontSize: '0.84rem' }}>Toelichting <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
                  <textarea value={toelichting} onChange={e => setToelichting(e.target.value)} placeholder="Bijzonderheden voor dit boekjaar..." rows={2} style={{ ...inp, resize: 'vertical', borderRadius: '14px' }} />
                </div>
                {uploadSuccess && <p style={{ color: '#16a34a', fontSize: '0.84rem', marginBottom: '12px', fontWeight: '700' }}>✓ Bestanden geüpload!</p>}
                {uploadError && <p style={{ color: '#ef4444', fontSize: '0.84rem', marginBottom: '12px', fontWeight: '700' }}>{uploadError}</p>}
                <button type="submit" disabled={uploading} style={{ background: '#0f172a', color: 'white', padding: '14px 26px', borderRadius: '14px', border: 'none', fontSize: '0.84rem', fontWeight: '700', cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', boxShadow: '0 12px 24px rgba(15,23,42,0.18)' }}>
                  {uploading ? 'Uploaden...' : '📤 Upload bestanden'}
                </button>
              </form>
            </div>

            <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '26px', boxShadow: '0 12px 32px rgba(15,23,42,0.04)' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontSize: '0.84rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>Geüploade jaren</h2>
                  <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '4px 0 0' }}>Controleer welke boekjaren al zijn aangeleverd.</p>
                </div>
                {boekjaren.length > 0 && <span style={{ fontSize: '0.78rem', color: '#475569', background: '#f8fafc', padding: '7px 10px', borderRadius: '999px', fontWeight: '700' }}>{uploads.length} upload(s) · {boekjaren.join(', ')}</span>}
              </div>
              {uploads.length === 0 ? (
                <div style={{ padding: '34px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📂</div>
                  <p style={{ color: '#475569', fontSize: '0.84rem' }}>Nog geen uploads voor {geselecteerdeVereniging.naam}.</p>
                </div>
              ) : (
                <div>
                  {uploads.map(upload => (
                    <div key={upload.id} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: '600', color: '#0f172a' }}>Boekjaar {upload.boekjaar}</span>
                          <span style={{ background: upload.boekjaar === rapportBoekjaar ? '#dbeafe' : '#f1f5f9', color: upload.boekjaar === rapportBoekjaar ? '#2563EB' : '#64748b', padding: '3px 9px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700' }}>{upload.bestanden?.length || 0} bestand(en)</span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                          {new Date(upload.upload_datum).toLocaleDateString('nl-NL')}
                          {upload.toelichting && ` · ${upload.toelichting.substring(0, 50)}`}
                        </p>
                      </div>
                      <button onClick={() => setBevestigDelete(upload.id)} style={{ background: 'none', border: '1.5px solid #fecaca', color: '#ef4444', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {rapporten.filter(r => r.rapport_tekst && r.boekjaar !== rapportBoekjaar).length > 0 && (
              <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '26px', boxShadow: '0 12px 32px rgba(15,23,42,0.04)' }}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0' }}>
                  <h2 style={{ fontSize: '0.84rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>📋 Eerdere rapporten</h2>
                </div>
                {rapporten.filter(r => r.rapport_tekst && r.boekjaar !== rapportBoekjaar).map(r => (
                  <div key={r.boekjaar} style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <span style={{ fontWeight: '600', color: '#0f172a' }}>Boekjaar {r.boekjaar}</span>
                      {r.gegenereerd_op && <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: '12px' }}>Gegenereerd op {new Date(r.gegenereerd_op).toLocaleDateString('nl-NL')}</span>}
                    </div>
                    <button onClick={() => { setRapportBoekjaar(r.boekjaar); setToonRapport(true) }} style={{ background: 'white', color: '#2563EB', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #2563EB', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                      📄 Bekijk
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!huidigJaarBetaald ? (
              <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)', borderRadius: '24px', padding: '26px 28px', border: '2px solid #bfdbfe', marginBottom: '26px', boxShadow: '0 18px 46px rgba(37,99,235,0.1)' }}>
                <div style={{ color: '#2563EB', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Stap 4</div>
                <h2 style={{ fontWeight: '600', color: '#0f172a', fontSize: '1.12rem', marginBottom: '8px' }}>Betaal en ontvang het rapport</h2>
                <p style={{ color: '#475569', fontSize: '0.84rem', marginBottom: '18px', lineHeight: 1.6 }}>
                  Betaal éénmalig €59 via iDEAL voor <strong>{geselecteerdeVereniging.naam}</strong> boekjaar <strong>{rapportBoekjaar}</strong>. Daarna kunt u het rapport genereren.
                </p>
                <button onClick={handleBetaal} disabled={betaalLoading || !heeftUploadsVoorRapportjaar} style={{ background: !heeftUploadsVoorRapportjaar ? '#94a3b8' : '#2563EB', color: 'white', padding: '15px 30px', borderRadius: '14px', border: 'none', fontSize: '0.84rem', fontWeight: '700', cursor: !heeftUploadsVoorRapportjaar ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', boxShadow: !heeftUploadsVoorRapportjaar ? 'none' : '0 12px 24px rgba(37,99,235,0.2)' }}>
                  {betaalLoading ? 'Laden...' : !heeftUploadsVoorRapportjaar ? `⬆️ Upload eerst bestanden voor ${rapportBoekjaar}` : '🔒 Betaal €59 via iDEAL'}
                </button>
              </div>
            ) : (
              <div style={{ background: huidigJaarGegenereerd ? '#f0fdf4' : '#eff6ff', borderRadius: '24px', padding: '26px 28px', border: `2px solid ${huidigJaarGegenereerd ? '#86efac' : '#bfdbfe'}`, marginBottom: '26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px', boxShadow: huidigJaarGegenereerd ? '0 18px 46px rgba(22,163,74,0.1)' : '0 18px 46px rgba(37,99,235,0.1)' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '999px', background: huidigJaarGegenereerd ? '#16a34a' : '#2563EB', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem', flexShrink: 0 }}>{huidigJaarGegenereerd ? '✓' : '4'}</div>
                  <div>
                    <div style={{ color: huidigJaarGegenereerd ? '#166534' : '#2563EB', fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Stap 4</div>
                    <h2 style={{ fontWeight: '600', color: huidigJaarGegenereerd ? '#14532d' : '#1e3a8a', fontSize: '1.08rem', marginBottom: '4px' }}>{huidigJaarGegenereerd ? 'Rapport beschikbaar' : 'Rapport wordt gegenereerd'}</h2>
                    <p style={{ color: huidigJaarGegenereerd ? '#166534' : '#1D4ED8', fontSize: '0.84rem', margin: 0 }}>{huidigJaarGegenereerd ? `Rapport gegenereerd op ${new Date(huidigRapport!.gegenereerd_op!).toLocaleDateString('nl-NL')}` : `Uw uploads worden geanalyseerd voor ${geselecteerdeVereniging.naam} boekjaar ${rapportBoekjaar}. Dit duurt meestal circa 2 minuten.`}</p>
                  </div>
                </div>
                <div className="card-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {huidigJaarGegenereerd && (
                    <button onClick={() => setToonRapport(true)} style={{ background: 'white', color: '#166534', padding: '12px 20px', borderRadius: '12px', border: '1.5px solid #86efac', fontSize: '0.84rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>📄 Bekijk rapport</button>
                  )}
                  <button onClick={() => setBevestigDeleteRapport(rapportBoekjaar)} style={{ background: 'white', border: '1.5px solid #fecaca', color: '#ef4444', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontSize: '0.85rem' }} title="Boekjaar verwijderen">🗑️</button>
                  <button onClick={handleGenereerRapport} disabled={rapportLoading} style={{ background: '#16a34a', color: 'white', padding: '12px 24px', borderRadius: '12px', border: 'none', fontSize: '0.84rem', fontWeight: '700', cursor: rapportLoading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', boxShadow: '0 12px 24px rgba(22,163,74,0.18)' }}>
                    {rapportLoading ? '⏳ Genereren...' : huidigJaarGegenereerd ? '🔄 Rapport vernieuwen' : '📊 Genereer rapport'}
                  </button>
                </div>
              </div>
            )}

            {rapportError && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.84rem', fontWeight: '700' }}>{rapportError}</p>}
            {error && <p style={{ color: '#ef4444', marginBottom: '16px', fontSize: '0.84rem', fontWeight: '700' }}>{error}</p>}

            <div style={{ background: '#fffbeb', borderRadius: '16px', padding: '16px 20px', border: '1px solid #fde68a', marginTop: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#92400e', lineHeight: 1.6 }}>
                <strong>⚠️ Disclaimer:</strong> Het kascontrolerapport is een hulpmiddel voor de kascommissie en wordt opgesteld op basis van de door u aangeleverde documenten. Wij adviseren de kascontroleur om het rapport te gebruiken als ondersteuning bij zijn of haar eigen controle en de bevindingen zelf te verifiëren. Slimme Kascontrole is niet aansprakelijk voor eventuele fouten of beslissingen op basis van het rapport. De verantwoordelijkheid voor de kascontrole blijft bij de kascommissie. Zie ook onze <a href="/voorwaarden" style={{ color: '#92400e' }}>algemene voorwaarden</a>.
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
