'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { RapportRenderer } from '@/components/RapportRenderer'
import Navbar from '@/components/Navbar'

interface Upload {
  id: string
  user_id?: string
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
  user_id?: string
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
  const [alleRapporten, setAlleRapporten] = useState<Rapport[]>([])
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
  const [uploadWaarschuwingen, setUploadWaarschuwingen] = useState<{ bestand: string; melding: string }[]>([])
  const [error, setError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [rapportError, setRapportError] = useState('')
  const [toonRapport, setToonRapport] = useState(false)
  const [bevestigDelete, setBevestigDelete] = useState<string | null>(null)
  const [bevestigDeleteRapport, setBevestigDeleteRapport] = useState<{ boekjaar: string, vereniging_id: string | null } | null>(null)
  const [deleteRapportLoading, setDeleteRapportLoading] = useState(false)

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
  const rapportJaren = [currentYear - 1, currentYear]  // 2025, 2026
  const uploadJaren = [currentYear - 3, currentYear - 2, currentYear - 1, currentYear]  // 2023, 2024, 2025, 2026
  const jaren = rapportJaren  // alias voor bestaande code
  const ADMIN_EMAIL = 'info@slimmekascontrole.nl'

  useEffect(() => {
    if (toonRapport) window.scrollTo(0, 0)
  }, [toonRapport])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('betaald') === 'true' && !loading) {
      setTimeout(() => {
        document.getElementById('stap4')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }, [loading])

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
      // Laad alle rapporten over alle VvE's om de meest urgente te selecteren
      const { data: alleRapportenData } = await supabase.from('rapporten').select('*').eq('user_id', userId)
      setAlleRapporten(alleRapportenData || [])

      // Selecteer de VvE die het meest aandacht nodig heeft:
      // Prioriteit: betaald maar geen rapport > geen klaar rapport > klaar
      const huidigBoekjaar = (new Date().getFullYear() - 1).toString()
      let priorityVve = vList[0]
      let bestPriority = 99

      for (const v of vList) {
        const vRaps = (alleRapportenData || []).filter(r => r.vereniging_id === v.id)
        const heeftGenereren = vRaps.some(r => r.betaald && !r.rapport_tekst)
        const heeftKlaar = vRaps.some(r => r.betaald && r.rapport_tekst && r.boekjaar === huidigBoekjaar)

        let priority: number
        if (heeftGenereren) priority = 1       // betaald maar rapport nog niet gegenereerd
        else if (!heeftKlaar) priority = 2     // nieuw of nog niet klaar
        else priority = 3                      // volledig klaar

        if (priority < bestPriority) {
          bestPriority = priority
          priorityVve = v
        }
      }

      setGeselecteerdeVereniging(priorityVve)
      await loadUploadsEnRapporten(userId, priorityVve.id)
    }

    setLoading(false)
  }

  async function loadUploadsEnRapporten(userId: string, verenigingId: string) {
    const { data: uploadsData } = await supabase.from('uploads').select('*').eq('user_id', userId).eq('vereniging_id', verenigingId).order('boekjaar', { ascending: false })
    const { data: rapportenData } = await supabase.from('rapporten').select('*').eq('user_id', userId).eq('vereniging_id', verenigingId).order('boekjaar', { ascending: false })

    setUploads(uploadsData || [])
    const rapportenLijst = rapportenData || []
    setRapporten(rapportenLijst)

    // Werk alleRapporten bij zodat de dropdown-labels actueel blijven
    setAlleRapporten(prev => {
      const zonder = prev.filter(r => r.vereniging_id !== verenigingId)
      return [...zonder, ...rapportenLijst]
    })

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
        setUploadWaarschuwingen(data.waarschuwingen || [])
        setFiles(null)
        setToelichting('')
        const fileInput = document.getElementById('fileInput') as HTMLInputElement
        if (fileInput) fileInput.value = ''
        await loadUploadsEnRapporten(user.id, geselecteerdeVereniging.id)
        if (!data.waarschuwingen?.length) setTimeout(() => setUploadSuccess(false), 4000)
      } else { setUploadError(data.error || 'Er ging iets mis') }
    } catch { setUploadError('Er ging iets mis') }
    setUploading(false)
  }

  async function handleBetaal() {
    if (!geselecteerdeVereniging) return
    setBetaalLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ email: user.email, user_id: user.id, boekjaar: rapportBoekjaar, vereniging_id: geselecteerdeVereniging.id }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setError(data.error || 'Betalen mislukt')
    } catch { setError('Betalen mislukt') }
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
        setToonRapport(true); window.scrollTo(0, 0)
      } else {
        const msg = data.error || ''
        if (msg.includes('429') || msg.includes('rate limit')) {
          setRapportError('Te veel verzoeken tegelijk. Wacht 1-2 minuten en probeer opnieuw.')
        } else if (msg.includes('503') || msg.includes('529') || msg.includes('overload')) {
          setRapportError('De AI-dienst is momenteel druk bezet. Probeer het over een minuut opnieuw.')
        } else {
          setRapportError(`Rapport genereren mislukt: ${msg || 'onbekende fout'}`)
        }
      }
    } catch { setRapportError('Er ging iets mis. Controleer uw internetverbinding en probeer opnieuw.') }
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

  async function handleDeleteRapport(info: { boekjaar: string, vereniging_id: string | null }) {
    const { boekjaar, vereniging_id } = info
    setDeleteRapportLoading(true)

    try {
      let rapportQuery = supabase
        .from('rapporten')
        .delete()
        .eq('user_id', user?.id)
        .eq('boekjaar', boekjaar)

      if (vereniging_id) rapportQuery = rapportQuery.eq('vereniging_id', vereniging_id)

      const { error: rapportError } = await rapportQuery

      if (rapportError) {
        console.error('Delete rapport error:', rapportError)
        setDeleteRapportLoading(false)
        alert(`Verwijderen mislukt: ${rapportError.message} (code: ${rapportError.code})`)
        return
      }

      // Haal uploads op om storage bestanden te verwijderen
      let uploadsSelectQuery = supabase
        .from('uploads')
        .select('bestanden')
        .eq('user_id', user?.id)
        .eq('boekjaar', boekjaar)

      if (vereniging_id) uploadsSelectQuery = uploadsSelectQuery.eq('vereniging_id', vereniging_id)

      const { data: teVerwijderenUploads } = await uploadsSelectQuery
      if (teVerwijderenUploads?.length) {
        const alleBestanden = teVerwijderenUploads.flatMap(u => u.bestanden || [])
        if (alleBestanden.length) {
          await supabase.storage.from('kascontrole-bestanden').remove(alleBestanden)
        }
      }

      // Verwijder upload DB-rijen
      let uploadsQuery = supabase
        .from('uploads')
        .delete()
        .eq('user_id', user?.id)
        .eq('boekjaar', boekjaar)

      if (vereniging_id) uploadsQuery = uploadsQuery.eq('vereniging_id', vereniging_id)

      await uploadsQuery

      setRapporten(prev => prev.filter(r => !(r.user_id === user?.id && r.boekjaar === boekjaar)))
      setUploads(prev => prev.filter(u => !(u.user_id === user?.id && u.boekjaar === boekjaar)))
      setBevestigDeleteRapport(null)
      if (user?.id && user?.email) await loadData(user.id, user.email)
    } catch (err) {
      console.error(err)
      alert('Verwijderen mislukt')
    } finally {
      setDeleteRapportLoading(false)
    }
  }

async function zoekAdres(pc: string, hn: string) {
    if (pc.replace(' ', '').length < 6 || !hn) return
    setVerenigingHuisnummer(hn)
    setAdresLaden(true)
    setVerenigingForm(p => ({ ...p, adres: '', plaats: '' }))
    try {
      const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ', '')}+${hn}&fq=type:adres&rows=1`)
      const data = await res.json()
      if (data.response?.docs?.[0]) {
        const doc = data.response.docs[0]
        setVerenigingForm(p => ({ ...p, adres: `${doc.straatnaam || ''} ${hn}`, plaats: doc.woonplaatsnaam || '' }))
      } else {
        setVerenigingForm(p => ({ ...p, adres: 'niet gevonden', plaats: '' }))
      }
    } catch {
      setVerenigingForm(p => ({ ...p, adres: 'niet gevonden', plaats: '' }))
    }
    setAdresLaden(false)
  }

  async function zoekAdresProfiel(pc: string, hn: string) {
    if (pc.replace(' ', '').length < 6 || !hn) return
    setProfielHuisnummer(hn)
    setProfielAdresLaden(true)
    setProfielForm(p => ({ ...p, adres: '', plaats: '' }))
    try {
      const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ', '')}+${hn}&fq=type:adres&rows=1`)
      const data = await res.json()
      if (data.response?.docs?.[0]) {
        const doc = data.response.docs[0]
        setProfielForm(p => ({ ...p, postcode: pc, adres: `${doc.straatnaam || ''} ${hn}`, plaats: doc.woonplaatsnaam || '' }))
      } else {
        setProfielForm(p => ({ ...p, adres: 'niet gevonden', plaats: '' }))
      }
    } catch {
      setProfielForm(p => ({ ...p, adres: 'niet gevonden', plaats: '' }))
    }
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
    { nr: 4, titel: huidigJaarGegenereerd ? 'Rapport beschikbaar' : huidigJaarBetaald ? 'Genereer uw rapport' : 'Rapport ontvangen', tekst: huidigJaarGegenereerd ? 'Download gereed' : huidigJaarBetaald ? 'Klik op Genereer rapport' : 'Na betaling' },
  ]

  if (loading) return (
    <main style={{ minHeight: '100vh', paddingTop: '72px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
      <p style={{ color: '#475569' }}>Laden...</p>
    </main>
  )

  if (toonRapport && rapportTekstVoorWeergave) return (
    <main style={{ minHeight: '100vh', paddingTop: '72px', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`@media print { .no-print { display: none !important; } @page { size: A4 portrait; margin: 10mm; } html, body { background: white !important; overflow: visible !important; } main { background: white !important; overflow: visible !important; padding-top: 0 !important; min-height: 0 !important; } .rapport-outer { padding: 0 !important; margin: 0 !important; max-width: 100% !important; } .rapport-wrapper { box-shadow: none !important; border: none !important; border-radius: 0 !important; padding: 0 !important; margin: 0 !important; max-width: 100% !important; } }`}</style>
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
      <div className="rapport-outer" style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
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
            <p style={{ color: '#475569', fontSize: '0.84rem', marginBottom: '24px', lineHeight: 1.6 }}>De rapport-/betaalregel voor boekjaar {bevestigDeleteRapport.boekjaar} wordt permanent verwijderd. Eventuele uploads kunt u apart verwijderen bij de uploads.</p>
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
                <button type="button" onClick={() => zoekAdresProfiel(profielForm.postcode, profielHuisnummer)} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.78rem', cursor: 'pointer', padding: '0 0 6px', fontFamily: 'Outfit, sans-serif' }}>
                  🔍 {profielAdresLaden ? 'Adres opzoeken...' : 'Adres opzoeken'}
                </button>
                {!profielAdresLaden && profielForm.adres === 'niet gevonden' && (
                  <p style={{ fontSize: '0.78rem', color: '#ef4444', margin: '0 0 6px' }}>Adres niet gevonden — vul straat en plaats handmatig in.</p>
                )}
                {profielForm.adres && profielForm.adres !== 'niet gevonden' && profielForm.plaats && (
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
                <button type="button" onClick={() => zoekAdres(verenigingForm.postcode, verenigingHuisnummer)} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.78rem', cursor: 'pointer', padding: '0 0 6px', fontFamily: 'Outfit, sans-serif' }}>
                  🔍 {adresLaden ? 'Adres opzoeken...' : 'Adres opzoeken'}
                </button>
                {!adresLaden && verenigingForm.adres === 'niet gevonden' && (
                  <p style={{ fontSize: '0.78rem', color: '#ef4444', margin: '0 0 6px' }}>Adres niet gevonden — vul straat en plaats handmatig in.</p>
                )}
                {verenigingForm.adres && verenigingForm.adres !== 'niet gevonden' && verenigingForm.plaats && (
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
          .stap-badge-row { flex-wrap: wrap !important; row-gap: 6px !important; }
          .stap-done-row { flex-wrap: wrap !important; row-gap: 4px !important; }
          .stap-value-chip { max-width: 200px !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; }
        }
      `}</style>

      <Navbar
        links={[
          { href: '/#hoe-het-werkt', label: 'Hoe het werkt' },
          { href: '/#waarom', label: 'Waarom' },
          { href: '/#handleidingen', label: 'Handleidingen' },
          { href: '/#over-ons', label: 'Over ons' },
          { href: '/#tarieven', label: 'Tarieven' },
          { href: '/#contact', label: 'Contact' },
        ]}
        rightContent={(
          <>
            <ul className="skc-nav-links" style={{ display: 'flex', gap: '22px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
              <li><a href="/#hoe-het-werkt">Hoe het werkt</a></li>
              <li><a href="/#waarom">Waarom</a></li>
              <li><a href="/#handleidingen">Handleidingen</a></li>
              <li><a href="/#over-ons">Over ons</a></li>
              <li><a href="/#tarieven">Tarieven</a></li>
              <li><a href="/#contact">Contact</a></li>
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
            <p style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2563EB', margin: '0 0 10px' }}>Mijn omgeving</p>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Uw kascontrole dashboard</h1>
            <p style={{ color: '#475569', fontSize: '0.92rem', margin: 0 }}>Volg 4 eenvoudige stappen en ontvang uw professioneel kascontrolerapport.</p>
          </div>
          {geselecteerdeVereniging && (
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '14px 16px', minWidth: '220px', boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Geselecteerd</div>
              <div style={{ color: '#0f172a', fontWeight: '700' }}>{geselecteerdeVereniging.naam}</div>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>Boekjaar {rapportBoekjaar}</div>
              <button onClick={() => openVerenigingForm(geselecteerdeVereniging)} style={{ marginTop: '10px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563EB', cursor: 'pointer', fontSize: '0.75rem', padding: '5px 10px', borderRadius: '8px', fontWeight: '700', fontFamily: 'Outfit, sans-serif' }}>✏️ Bewerken</button>
            </div>
          )}
        </div>

        <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 18px', lineHeight: 1.6 }}>Doorloop onderstaande stappen om uw kascontrolerapport te ontvangen. De actieve stap is blauw gemarkeerd.</p>

        <div style={{ background: geselecteerdeVereniging ? 'white' : '#eff6ff', border: '1px solid #e2e8f0', borderLeft: `4px solid ${geselecteerdeVereniging ? '#22c55e' : '#2563EB'}`, borderRadius: '16px', padding: '22px', marginBottom: '22px', boxShadow: geselecteerdeVereniging ? 'none' : '0 2px 12px rgba(37,99,235,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
            <div>
              {geselecteerdeVereniging ? (
                <div className="stap-done-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dcfce7', color: '#166534', fontWeight: '700', fontSize: '0.75rem', flexShrink: 0 }}>✓</div>
                  <span style={{ color: '#166534', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Stap 1 — Gereed</span>
                  <span className="stap-value-chip" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.72rem', fontWeight: '600', padding: '2px 8px', borderRadius: '999px' }}>{geselecteerdeVereniging.naam}</span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2563EB', color: 'white', fontWeight: '700', fontSize: '0.95rem', flexShrink: 0 }}>1</div>
                  <span style={{ color: '#2563EB', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Stap 1</span>
                  <span style={{ background: '#dbeafe', color: '#1D4ED8', fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>Aan de beurt</span>
                </div>
              )}
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Kies de vereniging</h2>
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
                + Vereniging toevoegen
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select
                value={geselecteerdeVereniging?.id || ''}
                onChange={e => {
                  const v = verenigingen.find(v => v.id === e.target.value)
                  if (v) handleWisselVereniging(v)
                }}
                style={{ ...inp, minHeight: '54px', fontSize: '0.84rem', fontWeight: '700', borderRadius: '14px', borderColor: '#93c5fd', flex: '1', minWidth: '220px', maxWidth: '400px' }}
              >
                <option value="" disabled>Selecteer een vereniging...</option>
                {verenigingen.map(v => {
                  const huidigBoekjaar = (new Date().getFullYear() - 1).toString()
                  const vRaps = alleRapporten.filter(r => r.vereniging_id === v.id)
                  const heeftGenereren = vRaps.some(r => r.betaald && !r.rapport_tekst)
                  const heeftKlaar = vRaps.some(r => r.betaald && r.rapport_tekst && r.boekjaar === huidigBoekjaar)
                  const status = heeftGenereren ? ' ⚡ Genereren' : heeftKlaar ? ' ✓ Klaar' : ' ◦ Nieuw'
                  return <option key={v.id} value={v.id}>{v.naam}{status}</option>
                })}
              </select>
              {geselecteerdeVereniging && verenigingen.length > 1 && (
                <button onClick={() => handleDeleteVereniging(geselecteerdeVereniging)} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', fontSize: '0.84rem', padding: '12px 16px', borderRadius: '12px', fontWeight: '700', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' }}>🗑️</button>
              )}
            </div>
          )}
        </div>

        {geselecteerdeVereniging && (
          <>
            <div style={{ background: 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', borderLeft: '4px solid #22c55e', marginBottom: '26px', boxShadow: 'none' }}>
              <div className="stap-done-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dcfce7', color: '#166534', fontWeight: '700', fontSize: '0.75rem', flexShrink: 0 }}>✓</div>
                <span style={{ color: '#166534', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Stap 2 — Gereed</span>
                <span className="stap-value-chip" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.72rem', fontWeight: '600', padding: '2px 8px', borderRadius: '999px' }}>Boekjaar {rapportBoekjaar}</span>
              </div>
              <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.15rem', marginBottom: '6px' }}>Kies het boekjaar</h2>
              <p style={{ color: '#475569', fontSize: '0.84rem', marginBottom: '18px' }}>Voor welk boekjaar wilt u een kascontrolerapport maken voor <strong>{geselecteerdeVereniging.naam}</strong>?</p>
              <div className="upload-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 260px) 1fr', gap: '16px', alignItems: 'stretch' }}>
                <select value={rapportBoekjaar} onChange={e => { setRapportBoekjaar(e.target.value); setBoekjaar(e.target.value) }} style={{ ...inp, minHeight: '54px', fontSize: '0.84rem', fontWeight: '700', borderRadius: '14px', borderColor: '#93c5fd' }}>
                  {jaren.map(j => <option key={j} value={j}>Boekjaar {j}</option>)}
                </select>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '14px 16px', color: '#475569', fontSize: '0.84rem', lineHeight: 1.6 }}>
                  Selecteer het boekjaar waarover u een kascontrolerapport wilt ontvangen.
                </div>
              </div>
            </div>

            <div style={{ background: heeftUploadsVoorRapportjaar ? 'white' : '#eff6ff', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', borderLeft: `4px solid ${heeftUploadsVoorRapportjaar ? '#22c55e' : '#2563EB'}`, marginBottom: '26px', boxShadow: heeftUploadsVoorRapportjaar ? 'none' : '0 2px 12px rgba(37,99,235,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '18px' }}>
                <div>
                  {heeftUploadsVoorRapportjaar ? (
                    <div className="stap-done-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                      <div style={{ width: '22px', height: '22px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dcfce7', color: '#166534', fontWeight: '700', fontSize: '0.75rem', flexShrink: 0 }}>✓</div>
                      <span style={{ color: '#166534', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Stap 3 — Gereed</span>
                      <span className="stap-value-chip" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', fontSize: '0.72rem', fontWeight: '600', padding: '2px 8px', borderRadius: '999px' }}>{uploadsVoorRapportjaar.length} bestand(en) geüpload</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2563EB', color: 'white', fontWeight: '700', fontSize: '0.95rem', flexShrink: 0 }}>3</div>
                      <span style={{ color: '#2563EB', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Stap 3</span>
                      <span style={{ background: '#dbeafe', color: '#1D4ED8', fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '999px', whiteSpace: 'nowrap' }}>Aan de beurt</span>
                    </div>
                  )}
                  <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Upload uw bestanden</h2>
                  <p style={{ color: '#475569', margin: '6px 0 0', fontSize: '0.84rem' }}>Voeg de financiële documenten toe voor {geselecteerdeVereniging.naam}.</p>
                </div>
                <div style={{ background: heeftUploadsVoorRapportjaar ? '#f0fdf4' : '#fffbeb', border: `1px solid ${heeftUploadsVoorRapportjaar ? '#bbf7d0' : '#fde68a'}`, color: heeftUploadsVoorRapportjaar ? '#166534' : '#92400e', padding: '9px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: '700' }}>
                  {heeftUploadsVoorRapportjaar ? `✓ ${uploadsVoorRapportjaar.length} upload(s) voor ${rapportBoekjaar}` : `Nog geen uploads voor ${rapportBoekjaar}`}
                </div>
              </div>

              <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '14px 16px', marginBottom: '18px', fontSize: '0.84rem', color: '#1e3a8a', lineHeight: 1.65 }}>
                Upload de bestanden van boekjaar <strong>{rapportBoekjaar}</strong>. U kunt <strong>meerdere bestanden tegelijk selecteren</strong> — houd Ctrl (Windows) of ⌘ (Mac) ingedrukt bij het selecteren. Wilt u ook een trendanalyse? Upload dan per jaar de bestanden en druk elke keer op de uploadknop. Optioneel zijn {rapportJaarNum - 2}, {rapportJaarNum - 1} en {rapportJaarNum + 1}.<br />
                <span style={{ color: '#64748b', fontSize: '0.88em' }}>Ondersteunde typen: PDF, Excel, CSV, Word, PNG, JPG, HEIC · Max 10MB per bestand</span>
              </div>

              <form onSubmit={handleUpload}>
                <div className="upload-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px', marginBottom: '16px', alignItems: 'stretch' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '7px', fontSize: '0.84rem' }}>Boekjaar van deze bestanden</label>
                    <select value={boekjaar} onChange={e => setBoekjaar(e.target.value)} style={{ ...inp, minHeight: '52px', borderRadius: '14px' }}>
                      {uploadJaren.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '7px', fontSize: '0.84rem' }}>Bestanden</label>
                    <div onClick={() => document.getElementById('fileInput')?.click()} style={{ border: '2px dashed #60a5fa', borderRadius: '16px', padding: '18px 20px', minHeight: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: files ? '#f0fdf4' : '#f8fafc', fontSize: '0.84rem', color: files ? '#166534' : '#475569', fontWeight: '700' }}>
                      {files ? `✓ ${files.length} bestand(en) geselecteerd` : '📎 Klik om bestanden te selecteren (meerdere tegelijk mogelijk)'}
                    </div>
                    <input id="fileInput" type="file" multiple accept=".pdf,.xlsx,.xls,.csv,.txt,.ods,.docx,.doc,.png,.jpg,.jpeg,.heic" style={{ display: 'none' }} onChange={e => setFiles(e.target.files)} />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '7px', fontSize: '0.84rem' }}>Toelichting <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
                  <textarea value={toelichting} onChange={e => setToelichting(e.target.value)} placeholder="Bijzonderheden voor dit boekjaar..." rows={2} style={{ ...inp, resize: 'vertical', borderRadius: '14px' }} />
                </div>
                {uploadSuccess && <p style={{ color: '#16a34a', fontSize: '0.84rem', marginBottom: '12px', fontWeight: '700' }}>✓ Bestanden geüpload!</p>}
                {uploadWaarschuwingen.length > 0 && (
                  <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                    <div style={{ fontWeight: '700', color: '#92400e', fontSize: '0.84rem', marginBottom: '8px' }}>⚠️ Let op: mogelijke problemen met uw bestanden</div>
                    {uploadWaarschuwingen.map((w, i) => (
                      <div key={i} style={{ fontSize: '0.82rem', color: '#78350f', marginBottom: '4px' }}>
                        <strong>{w.bestand}:</strong> {w.melding}
                      </div>
                    ))}
                    <div style={{ fontSize: '0.78rem', color: '#92400e', marginTop: '10px', lineHeight: 1.5 }}>
                      Verwijder het bestand en upload een correcte versie voordat u gaat betalen.
                    </div>
                  </div>
                )}
                {uploadError && <p style={{ color: '#ef4444', fontSize: '0.84rem', marginBottom: '12px', fontWeight: '700' }}>{uploadError}</p>}
                <button type="submit" disabled={uploading} style={{ background: '#0f172a', color: 'white', padding: '14px 26px', borderRadius: '14px', border: 'none', fontSize: '0.84rem', fontWeight: '700', cursor: uploading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', boxShadow: '0 12px 24px rgba(15,23,42,0.18)' }}>
                  {uploading ? 'Uploaden...' : '📤 Upload bestanden'}
                </button>
              </form>

              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '20px', paddingTop: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '0.84rem', fontWeight: '600', color: '#0f172a', margin: 0 }}>Geüploade bestanden</h2>
                    <p style={{ color: '#64748b', fontSize: '0.84rem', margin: '4px 0 0' }}>Controleer welke boekjaren al zijn aangeleverd.</p>
                  </div>
                  {boekjaren.length > 0 && <span style={{ fontSize: '0.78rem', color: '#475569', background: '#f8fafc', padding: '7px 10px', borderRadius: '999px', fontWeight: '700', border: '1px solid #e2e8f0' }}>{uploads.length} upload(s) · {boekjaren.join(', ')}</span>}
                </div>
                <div style={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                  {uploads.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📂</div>
                      <p style={{ color: '#475569', fontSize: '0.84rem', margin: 0 }}>Nog geen uploads voor {geselecteerdeVereniging.naam}.</p>
                    </div>
                  ) : (
                    <div>
                      {uploads.map(upload => (
                        <div key={upload.id} style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
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
              </div>
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
                    <button onClick={() => { setRapportBoekjaar(r.boekjaar); setToonRapport(true); window.scrollTo(0, 0) }} style={{ background: 'white', color: '#2563EB', padding: '9px 16px', borderRadius: '10px', border: '1.5px solid #2563EB', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                      📄 Bekijk
                    </button>
                  </div>
                ))}
              </div>
            )}

            {!huidigJaarBetaald ? (
              <div id="stap4" style={{ background: heeftUploadsVoorRapportjaar ? '#eff6ff' : 'white', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', borderLeft: `4px solid ${heeftUploadsVoorRapportjaar ? '#2563EB' : '#cbd5e1'}`, marginBottom: '22px', boxShadow: heeftUploadsVoorRapportjaar ? '0 2px 12px rgba(37,99,235,0.08)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: heeftUploadsVoorRapportjaar ? '32px' : '26px', height: heeftUploadsVoorRapportjaar ? '32px' : '26px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: heeftUploadsVoorRapportjaar ? '#2563EB' : '#f1f5f9', color: heeftUploadsVoorRapportjaar ? 'white' : '#94a3b8', fontWeight: '700', fontSize: heeftUploadsVoorRapportjaar ? '0.95rem' : '0.84rem', flexShrink: 0 }}>4</div>
                  <span style={{ color: heeftUploadsVoorRapportjaar ? '#2563EB' : '#94a3b8', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Stap 4</span>
                  {heeftUploadsVoorRapportjaar && <span style={{ background: '#dbeafe', color: '#1D4ED8', fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '999px' }}>Aan de beurt</span>}
                </div>
                <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.15rem', marginBottom: '6px' }}>Betaal en ontvang het rapport</h2>
                <p style={{ color: '#475569', fontSize: '0.84rem', marginBottom: '16px', lineHeight: 1.6 }}>
                  Betaal éénmalig €59 via iDEAL voor <strong>{geselecteerdeVereniging.naam}</strong> boekjaar <strong>{rapportBoekjaar}</strong>. Daarna kunt u het rapport genereren.
                </p>
                <button onClick={handleBetaal} disabled={betaalLoading || !heeftUploadsVoorRapportjaar} style={{ background: !heeftUploadsVoorRapportjaar ? '#94a3b8' : '#2563EB', color: 'white', padding: '15px 30px', borderRadius: '14px', border: 'none', fontSize: '0.84rem', fontWeight: '700', cursor: !heeftUploadsVoorRapportjaar ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', boxShadow: !heeftUploadsVoorRapportjaar ? 'none' : '0 12px 24px rgba(37,99,235,0.2)' }}>
                  {betaalLoading ? 'Laden...' : !heeftUploadsVoorRapportjaar ? `⬆️ Upload eerst bestanden voor ${rapportBoekjaar}` : '🔒 Betaal €59 via iDEAL'}
                </button>
              </div>
            ) : (
              <div id="stap4" style={{ background: huidigJaarGegenereerd ? '#f0fdf4' : '#eff6ff', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0', borderLeft: `4px solid ${huidigJaarGegenereerd ? '#22c55e' : '#2563EB'}`, marginBottom: '22px', boxShadow: huidigJaarGegenereerd ? 'none' : '0 2px 12px rgba(37,99,235,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: huidigJaarGegenereerd ? '#16a34a' : '#2563EB', color: 'white', fontWeight: '700', fontSize: '0.95rem', flexShrink: 0 }}>
                        {huidigJaarGegenereerd ? '✓' : '4'}
                      </div>
                      <div>
                        <span style={{ color: huidigJaarGegenereerd ? '#166534' : '#2563EB', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Stap 4</span>
                        {!huidigJaarGegenereerd && <span style={{ background: '#dbeafe', color: '#1D4ED8', fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '999px', marginLeft: '8px' }}>Aan de beurt</span>}
                        {huidigJaarGegenereerd && <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '999px', marginLeft: '8px' }}>Rapport klaar!</span>}
                      </div>
                    </div>
                    <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.15rem', margin: 0 }}>{huidigJaarGegenereerd ? 'Rapport beschikbaar' : 'Genereer uw rapport'}</h2>
                    <p style={{ color: '#475569', margin: '6px 0 0', fontSize: '0.84rem' }}>{huidigJaarGegenereerd ? `Gegenereerd op ${new Date(huidigRapport!.gegenereerd_op!).toLocaleDateString('nl-NL')}` : `Uw bestanden staan klaar. Klik op "Genereer rapport" om te starten — dit duurt circa 3–5 minuten.`}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {huidigJaarGegenereerd && (
                      <button onClick={() => { setToonRapport(true); window.scrollTo(0, 0) }} style={{ background: 'white', color: '#166534', padding: '10px 18px', borderRadius: '10px', border: '1.5px solid #86efac', fontSize: '0.84rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>📄 Bekijk rapport</button>
                    )}
                    <button onClick={() => setBevestigDeleteRapport({ boekjaar: rapportBoekjaar, vereniging_id: geselecteerdeVereniging?.id || null })} style={{ background: 'white', border: '1.5px solid #fecaca', color: '#ef4444', padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }} title="Boekjaar verwijderen">🗑️</button>
                    <button onClick={handleGenereerRapport} disabled={rapportLoading} style={{ background: '#16a34a', color: 'white', padding: '10px 20px', borderRadius: '10px', border: 'none', fontSize: '0.84rem', fontWeight: '700', cursor: rapportLoading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                      {rapportLoading ? '⏳ Genereren...' : huidigJaarGegenereerd ? '🔄 Vernieuwen' : '📊 Genereer rapport'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {rapportError && <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', fontSize: '0.84rem', color: '#92400e', fontWeight: '600' }}>⚠️ {rapportError}</div>}
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
