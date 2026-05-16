'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { RapportRenderer } from '@/components/RapportRenderer'

const ADMIN_EMAIL = 'info@slimmekascontrole.nl'

interface Klant {
  id: string
  user_id: string
  email: string
  naam?: string
  telefoon?: string
  adres?: string
  postcode?: string
  plaats?: string
  plan: string
  rapport_beschikbaar: boolean
  herkomst?: string
  beheerder_naam?: string
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
  id: string
  user_id: string
  vereniging_id?: string | null
  boekjaar: string
  betaald: boolean
  rapport_tekst?: string
  gegenereerd_op?: string
}

interface Upload {
  id: string
  user_id: string
  vereniging_id?: string | null
  boekjaar: string
  status: string
  upload_datum: string
  toelichting: string
  bestanden: string[]
}

interface PromoCode {
  id: string
  code: string
  active: boolean
  times_redeemed: number
  expires_at: number | null
}

interface Coupon {
  id: string
  name: string
  amount_off: number | null
  percent_off: number | null
  currency: string
  valid: boolean
  times_redeemed: number
  created: number
  promoCodes: PromoCode[]
}

export default function AdminPortal() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [klanten, setKlanten] = useState<Klant[]>([])
  const [verenigingen, setVerenigingen] = useState<Vereniging[]>([])
  const [rapporten, setRapporten] = useState<Rapport[]>([])
  const [uploads, setUploads] = useState<Upload[]>([])
  const [geselecteerdeKlant, setGeselecteerdeKlant] = useState<Klant | null>(null)
  const [toonRapport, setToonRapport] = useState<Rapport | null>(null)
  const [zoekterm, setZoekterm] = useState('')
  const [filter, setFilter] = useState<'alle' | 'betaald' | 'onbetaald' | 'rapport_klaar'>('alle')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'klanten' | 'kortingscodes' | 'beheerders'>('klanten')

  // Kortingscodes state
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [couponsLoading, setCouponsLoading] = useState(false)
  const [nieuwNaam, setNieuwNaam] = useState('')
  const [nieuwBedrag, setNieuwBedrag] = useState('')
  const [nieuwCode, setNieuwCode] = useState('')
  const [nieuwVerloopt, setNieuwVerloopt] = useState('')
  const [aanmakenLoading, setAanmakenLoading] = useState(false)
  const [aanmakenFout, setAanmakenFout] = useState('')
  // Beheerders state
  const [beheerders, setBeheerders] = useState<{ id: string; naam: string; slug: string; fee_bedrag: number; actief: boolean }[]>([])
  const [beheerderForm, setBeheerderForm] = useState({ naam: '', slug: '', fee_bedrag: '15' })
  const [beheerderSaving, setBeheerderSaving] = useState(false)
  const [bewerkBeheerder, setBewerkBeheerder] = useState<string | null>(null)

  const [bewerkKlant, setBewerkKlant] = useState<Klant | null>(null)
  const [bewerkData, setBewerkData] = useState<Partial<Klant>>({})
  const [bewerkVerenigingData, setBewerkVerenigingData] = useState<Partial<Vereniging>>({})
  const [bewerkVerenigingId, setBewerkVerenigingId] = useState<string | null>(null)
  const [adminAdresLaden, setAdminAdresLaden] = useState(false)
  const [adminHuisnummer, setAdminHuisnummer] = useState('')
  const [adminProfielAdresLaden, setAdminProfielAdresLaden] = useState(false)
  const [adminProfielHuisnummer, setAdminProfielHuisnummer] = useState('')
  const [bewerkVve, setBewerkVve] = useState<Vereniging | null>(null)
  const [bewerkVveData, setBewerkVveData] = useState<Partial<Vereniging>>({})
  const [bewerkVveAdresLaden, setBewerkVveAdresLaden] = useState(false)
  const [bewerkVveHuisnummer, setBewerkVveHuisnummer] = useState('')
  const [bewerkVveSaving, setBewerkVveSaving] = useState(false)

  const [lastLogins, setLastLogins] = useState<Record<string, string>>({})
  const router = useRouter()

  function haalHuisnummerUitAdres(adres?: string) {
    const match = (adres || '').match(/\b(\d+[A-Za-z0-9\-]*)\b\s*$/)
    return match ? match[1] : ''
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/registreer'); return }
      if (session.user.email !== ADMIN_EMAIL) {
        router.push('/mijn-omgeving'); return
      }
      setUser(session.user)
      loadData()
    })
  }, [])

  async function loadData() {
    try {
      const res = await fetch('/api/admin-users', { headers: { 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` } })
      const data = await res.json()

      const logins: Record<string, string> = {}
      const allRapporten: Rapport[] = []
      const allUploads: Upload[] = []

      data.forEach((k: any) => {
        logins[k.user_id] = k.last_sign_in_at
        if (k.rapporten) allRapporten.push(...k.rapporten)
        if (k.uploads) allUploads.push(...k.uploads)
      })

      setLastLogins(logins)
      setKlanten(data.sort((a: any, b: any) => (a.email || '').localeCompare(b.email || '')))
      setRapporten(allRapporten.sort((a, b) => b.boekjaar.localeCompare(a.boekjaar)))
      setUploads(allUploads.sort((a, b) => new Date(b.upload_datum).getTime() - new Date(a.upload_datum).getTime()))

      // Haal alle verenigingen op via service role
      const vRes = await fetch('/api/admin-verenigingen', { headers: { 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` } })
      if (vRes.ok) {
        const vData = await vRes.json()
        setVerenigingen(vData)
      } else {
        console.error('Fout bij laden verenigingen:', await vRes.text())
      }
    } catch (e) {
      console.error('Fout bij laden:', e)
    }

    setLoading(false)
  }

  async function loadCoupons() {
    setCouponsLoading(true)
    try {
      const res = await fetch('/api/coupons', { headers: { 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` } })
      const data = await res.json()
      setCoupons(data)
    } catch (e) {
      console.error(e)
    }
    setCouponsLoading(false)
  }

  async function loadBeheerders() {
    const { data } = await supabase.from('beheerders').select('*').order('naam')
    if (data) setBeheerders(data)
  }

  async function handleSaveBeheerder() {
    if (!beheerderForm.naam || !beheerderForm.slug) return
    setBeheerderSaving(true)
    const slug = beheerderForm.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    if (bewerkBeheerder) {
      await supabase.from('beheerders').update({ naam: beheerderForm.naam, slug, fee_bedrag: parseInt(beheerderForm.fee_bedrag) || 15 }).eq('id', bewerkBeheerder)
    } else {
      await supabase.from('beheerders').insert({ naam: beheerderForm.naam, slug, fee_bedrag: parseInt(beheerderForm.fee_bedrag) || 15 })
    }
    setBeheerderForm({ naam: '', slug: '', fee_bedrag: '15' })
    setBewerkBeheerder(null)
    await loadBeheerders()
    setBeheerderSaving(false)
  }

  async function handleToggleBeheerder(id: string, actief: boolean) {
    await supabase.from('beheerders').update({ actief: !actief }).eq('id', id)
    await loadBeheerders()
  }

  async function handleDeleteBeheerder(id: string) {
    await supabase.from('klanten').update({ beheerder_id: null, beheerder_naam: null }).eq('beheerder_id', id)
    await supabase.from('beheerders').delete().eq('id', id)
    await loadBeheerders()
  }

  useEffect(() => {
    if (activeTab === 'kortingscodes') loadCoupons()
    if (activeTab === 'beheerders') loadBeheerders()
  }, [activeTab])

  async function handleAanmaken() {
    if (!nieuwNaam || !nieuwBedrag || !nieuwCode) {
      setAanmakenFout('Vul alle verplichte velden in.')
      return
    }
    setAanmakenLoading(true)
    setAanmakenFout('')
    try {
      const { data: { session: postSession } } = await supabase.auth.getSession()
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${postSession?.access_token}` },
        body: JSON.stringify({
          name: nieuwNaam,
          amount_off: parseFloat(nieuwBedrag),
          code: nieuwCode.toUpperCase(),
          expires_at: nieuwVerloopt || null,
        })
      })
      const data = await res.json()
      if (data.error) { setAanmakenFout(data.error); return }
      setNieuwNaam(''); setNieuwBedrag(''); setNieuwCode(''); setNieuwVerloopt('')
      loadCoupons()
    } catch (e: any) {
      setAanmakenFout(e.message)
    }
    setAanmakenLoading(false)
  }

  async function handleDeactiveer(promoCodeId: string) {
    const { data: { session: delSession } } = await supabase.auth.getSession()
    await fetch('/api/coupons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${delSession?.access_token}` },
      body: JSON.stringify({ promoCodeId })
    })
    loadCoupons()
  }

  function getRapportenVoorKlant(userId: string) {
    return rapporten.filter(r => r.user_id === userId)
  }

  function getUploadsVoorKlant(userId: string) {
    return uploads.filter(u => u.user_id === userId)
  }

  function heeftBetaald(userId: string) {
    return rapporten.some(r => r.user_id === userId && r.betaald)
  }

  function heeftRapport(userId: string) {
    return rapporten.some(r => r.user_id === userId && r.rapport_tekst)
  }

  const gefilterd = klanten.filter(k => {
    if (k.email === ADMIN_EMAIL) return false
    const zoek = zoekterm.toLowerCase()
    const klantVerenigingen = verenigingen.filter(v => v.user_id === k.user_id)
    const matchZoek = !zoekterm ||
      k.naam?.toLowerCase().includes(zoek) ||
      k.email?.toLowerCase().includes(zoek) ||
      klantVerenigingen.some(v => v.naam?.toLowerCase().includes(zoek))
    const matchFilter =
      filter === 'alle' ? true :
      filter === 'betaald' ? heeftBetaald(k.user_id) :
      filter === 'onbetaald' ? !heeftBetaald(k.user_id) :
      filter === 'rapport_klaar' ? heeftRapport(k.user_id) : true
    return matchZoek && matchFilter
  })

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/registreer')
  }

  async function handleDeleteKlant(klant: Klant) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch("/api/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session?.access_token}` },
        body: JSON.stringify({ user_id: klant.user_id })
      })
      if (!res.ok) {
        const data = await res.json()
        alert("Fout: " + (data.error || "Onbekende fout"))
        return
      }
      setGeselecteerdeKlant(null)
      loadData()
      alert("Klant verwijderd.")
    } catch (e: any) { alert("Fout: " + e.message) }
  }

  async function handleSaveBewerkKlant() {
    if (!bewerkKlant) return

    let klantUpdate = {
      naam: (bewerkData as any).naam || '',
      telefoon: (bewerkData as any).telefoon || '',
      adres: (bewerkData as any).adres || '',
      postcode: (bewerkData as any).postcode || '',
      plaats: (bewerkData as any).plaats || '',
    }

    // Ook in admin opnieuw ophalen bij opslaan, zodat adres + huisnummer echt worden opgeslagen.
    if (klantUpdate.postcode && adminProfielHuisnummer) {
      try {
        const pc = klantUpdate.postcode
        const hn = adminProfielHuisnummer
        const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ', '')}+${hn}&fq=type:adres&rows=1`)
        const data = await res.json()
        if (data.response?.docs?.[0]) {
          const doc = data.response.docs[0]
          klantUpdate = {
            ...klantUpdate,
            postcode: pc,
            adres: `${doc.straatnaam || ''} ${hn}`,
            plaats: doc.woonplaatsnaam || '',
          }
          setBewerkData(d => ({ ...d, ...klantUpdate }))
        }
      } catch {
        // Als lookup faalt, slaan we handmatig ingevulde velden alsnog op.
      }
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch('/api/admin-update-klant', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          user_id: bewerkKlant.user_id,
          data: klantUpdate
        })
      })

      const result = await res.json()

      if (!res.ok) {
        alert('Opslaan mislukt: ' + (result.error || 'Onbekende fout'))
        return
      }

      const bijgewerkteKlant = result.klant
        ? { ...bewerkKlant, ...result.klant }
        : { ...bewerkKlant, ...klantUpdate }

      setKlanten(prev =>
        prev.map(k =>
          k.user_id === bewerkKlant.user_id
            ? { ...k, ...bijgewerkteKlant }
            : k
        )
      )

      setGeselecteerdeKlant(prev =>
        prev && prev.user_id === bewerkKlant.user_id
          ? { ...prev, ...bijgewerkteKlant }
          : prev
      )

      // Vereniging opslaan indien aangepast
      if (bewerkVerenigingId && Object.keys(bewerkVerenigingData).length > 0) {
        await fetch('/api/admin-update-vereniging', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({
            vereniging_id: bewerkVerenigingId,
            data: bewerkVerenigingData
          })
        })
      }

      setBewerkKlant(null)
      setBewerkData({})
      setBewerkVerenigingData({})
      setBewerkVerenigingId(null)
      setAdminProfielHuisnummer('')

      await loadData()
    } catch (err) {
      console.error(err)
      alert('Opslaan mislukt')
    }
  }

  async function handleSetBetaald(userId: string, boekjaar: string, betaald: boolean) {
    await supabase.from("rapporten").upsert({ user_id: userId, boekjaar, betaald }, { onConflict: "user_id,boekjaar" })
    loadData()
  }

  async function handleDeleteRapport(userId: string, boekjaar: string, verenigingId?: string | null) {
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin-delete-vereniging', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
      body: JSON.stringify({ rapport_boekjaar: boekjaar, user_id: userId, ...(verenigingId ? { vereniging_id: verenigingId } : {}) })
    })
    if (res.ok) {
      loadData()
    } else {
      alert('Verwijderen mislukt')
    }
  }

  async function handleDeleteUpload(uploadId: string) {
    if (!confirm("Upload verwijderen?")) return
    await supabase.from("uploads").delete().eq("id", uploadId)
    loadData()
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #bfdbfe', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Admin portal laden...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-padding { padding: 0 20px !important; }
          .admin-layout { flex-direction: column !important; }
          .admin-sidebar { width: 100% !important; min-width: unset !important; max-width: unset !important; }
        }
        .klant-rij:hover { background: #f8fafc !important; cursor: pointer; }
        .stat-card { background: white; border-radius: 12px; padding: 20px 24px; border: 1px solid #e2e8f0; }
        .badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; }
        .badge-groen { background: #dcfce7; color: #166534; }
        .badge-blauw { background: #dbeafe; color: #1e40af; }
        .badge-grijs { background: #f1f5f9; color: #64748b; }
        .badge-oranje { background: #fef3c7; color: #92400e; }
        .badge-rood { background: #fee2e2; color: #991b1b; }
        .filter-btn { padding: 7px 14px; border-radius: 6px; border: 1.5px solid #e2e8f0; background: white; cursor: pointer; font-family: Outfit, sans-serif; font-size: 0.82rem; font-weight: 500; color: #475569; transition: all 0.15s; }
        .filter-btn.actief { background: #2563EB; border-color: #2563EB; color: white; }
        .tab-btn { padding: 9px 20px; border-radius: 8px; border: none; cursor: pointer; font-family: Outfit, sans-serif; font-size: 0.88rem; font-weight: 600; transition: all 0.15s; }
        .tab-btn.actief { background: #2563EB; color: white; }
        .tab-btn:not(.actief) { background: white; color: #475569; border: 1.5px solid #e2e8f0; }
        .input-field { width: 100%; padding: 9px 14px; border: 1.5px solid #e2e8f0; border-radius: 8px; fontSize: 0.88rem; fontFamily: Outfit, sans-serif; outline: none; box-sizing: border-box; }
        .input-field:focus { border-color: #2563EB; }
        .nav-mobile-menu a { display: block; padding: 12px 16px; color: #0f172a; text-decoration: none; font-weight: 500; border-radius: 8px; font-size: 0.95rem; }
      `}</style>

      {/* Nav */}
      <nav className="nav-padding" style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 200, width: '100%', boxSizing: 'border-box', maxWidth: '100%', minWidth: 0 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: '#2563EB', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#2563EB' }}>slimme</div>
            <div style={{ fontWeight: '500', fontSize: '1rem', color: '#3b82f6' }}>kascontrole</div>
          </div>
        </a>
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>🔐 Admin Portal</span>
          <span style={{ fontSize: '0.85rem', color: '#475569' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '9px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', fontWeight: '600' }}>Uitloggen</button>
        </div>
        <button className="nav-hamburger" onClick={() => setMobileMenuOpen(o => !o)} style={{ display: 'none', background: 'none', border: '1.5px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', padding: '7px', flexDirection: 'column', gap: '4px', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ display: 'block', width: '20px', height: '2px', background: '#0f172a', borderRadius: '2px' }} />
          <span style={{ display: 'block', width: '20px', height: '2px', background: '#0f172a', borderRadius: '2px' }} />
          <span style={{ display: 'block', width: '20px', height: '2px', background: '#0f172a', borderRadius: '2px' }} />
        </button>
      </nav>
      {mobileMenuOpen && (
        <div className="nav-mobile-menu" style={{ position: 'fixed', top: '72px', left: 0, right: 0, background: 'white', borderBottom: '1px solid #e2e8f0', zIndex: 199, padding: '12px 20px 20px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <button onClick={handleLogout} style={{ width: '100%', background: '#2563EB', color: 'white', border: 'none', padding: '12px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif' }}>Uitloggen</button>
        </div>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div className="stat-card">
            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Totaal klanten</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>{klanten.length}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Betaald</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#16a34a' }}>{klanten.filter(k => heeftBetaald(k.user_id)).length}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Rapport klaar</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2563EB' }}>{klanten.filter(k => heeftRapport(k.user_id)).length}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Uploads totaal</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a' }}>{uploads.length}</div>
          </div>
          <div className="stat-card">
            <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Wacht op rapport</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#d97706' }}>{rapporten.filter(r => r.betaald && !r.rapport_tekst).length}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button className={`tab-btn${activeTab === 'klanten' ? ' actief' : ''}`} onClick={() => setActiveTab('klanten')}>👥 Klanten</button>
          <button className={`tab-btn${activeTab === 'kortingscodes' ? ' actief' : ''}`} onClick={() => setActiveTab('kortingscodes')}>🎁 Kortingscodes</button>
          <button className={`tab-btn${activeTab === 'beheerders' ? ' actief' : ''}`} onClick={() => setActiveTab('beheerders')}>🤝 Beheerders</button>
        </div>

        {/* Klanten tab */}
        {activeTab === 'klanten' && (
          <div className="admin-layout" style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 14px' }}>Klanten</h2>
                  <input
                    type="text"
                    placeholder="Zoek op naam, e-mail of vereniging..."
                    value={zoekterm}
                    onChange={e => setZoekterm(e.target.value)}
                    style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', marginBottom: '12px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(['alle', 'betaald', 'onbetaald', 'rapport_klaar'] as const).map(f => (
                      <button key={f} className={`filter-btn${filter === f ? ' actief' : ''}`} onClick={() => setFilter(f)}>
                        {f === 'alle' ? 'Alle' : f === 'betaald' ? '✓ Betaald' : f === 'onbetaald' ? '⏳ Onbetaald' : '📄 Rapport klaar'}
                      </button>
                    ))}
                  </div>
                </div>

                {gefilterd.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Geen klanten gevonden</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Naam / Vereniging</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>E-mail</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uploads</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gefilterd.map((k) => (
                        <tr key={k.id} className="klant-rij" onClick={() => setGeselecteerdeKlant(geselecteerdeKlant?.id === k.id ? null : k)} style={{ borderTop: '1px solid #f1f5f9', background: geselecteerdeKlant?.id === k.id ? '#eff6ff' : 'white', transition: 'background 0.15s' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#0f172a' }}>{k.naam || <span style={{ color: '#94a3b8' }}>Geen naam</span>}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              {verenigingen.filter(v => v.user_id === k.user_id).map(v => v.naam).join(', ') || <span style={{ color: '#94a3b8' }}>Geen vereniging</span>}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                              {lastLogins[k.user_id] ? `Ingelogd: ${new Date(lastLogins[k.user_id]).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` : 'Nog niet ingelogd'}
                            </div>
                            {k.herkomst && (
                              <div style={{ marginTop: '4px' }}>
                                <span style={{ background: '#f0fdf4', color: '#166534', fontSize: '0.7rem', fontWeight: '600', padding: '2px 7px', borderRadius: '999px', border: '1px solid #bbf7d0' }}>
                                  {k.herkomst === 'google' ? '🔍 Google' : k.herkomst === 'social' ? '📱 Social media' : k.herkomst === 'beheerder' ? `🤝 ${k.beheerder_naam || 'Via een relatie'}` : k.herkomst === 'mond-tot-mond' ? '👥 Mond-tot-mond' : `💬 ${k.herkomst}`}
                                </span>
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569' }}>{k.email}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {heeftBetaald(k.user_id)
                                ? <span className="badge badge-groen">✓ Betaald</span>
                                : <span className="badge badge-oranje">⏳ Onbetaald</span>}
                              {heeftRapport(k.user_id)
                                ? <span className="badge badge-blauw">📄 Rapport klaar</span>
                                : <span className="badge badge-grijs">Geen rapport</span>}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#475569' }}>
                            {getUploadsVoorKlant(k.user_id).length} bestand(en)
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {geselecteerdeKlant && (
              <div style={{ width: '380px', minWidth: '340px', flexShrink: 0 }}>
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', position: 'sticky', top: '88px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Klantdetails</h3>
                      <button onClick={() => setGeselecteerdeKlant(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button onClick={() => { setBewerkKlant(geselecteerdeKlant); setBewerkData({ naam: geselecteerdeKlant!.naam, telefoon: geselecteerdeKlant!.telefoon, adres: (geselecteerdeKlant as any).adres || '', postcode: (geselecteerdeKlant as any).postcode || '', plaats: (geselecteerdeKlant as any).plaats || '' }); setAdminProfielHuisnummer(haalHuisnummerUitAdres((geselecteerdeKlant as any).adres)) }} style={{ background: '#eff6ff', color: '#2563EB', border: '1px solid #bfdbfe', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>✏️ Bewerken</button>
                      <button onClick={() => handleDeleteKlant(geselecteerdeKlant!)} style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>🗑️ Verwijderen</button>
                    </div>
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Persoonsgegevens</div>
                      {[
                        ['Naam', geselecteerdeKlant.naam],
                        ['E-mail', geselecteerdeKlant.email],
                        ['Telefoon', geselecteerdeKlant.telefoon],
                      ].map(([label, waarde]) => waarde ? (
                        <div key={label} style={{ display: 'flex', gap: '8px', marginBottom: '6px', width: '100%', maxWidth: '100%', overflow: 'hidden', fontSize: '0.85rem' }}>
                          <span style={{ color: '#64748b', minWidth: '80px', flexShrink: 0 }}>{label}</span>
                          <span style={{ color: '#0f172a', fontWeight: '500' }}>{waarde}</span>
                        </div>
                      ) : null)}
                    </div>

                    {/* Verenigingen met rapporten */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Verenigingen & rapporten</div>
                      {verenigingen.filter(v => v.user_id === geselecteerdeKlant.user_id).length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Geen verenigingen</p>
                      ) : (
                        verenigingen.filter(v => v.user_id === geselecteerdeKlant.user_id).map(v => {
                          const rapportenVoorVereniging = getRapportenVoorKlant(geselecteerdeKlant.user_id)
                            .filter(r => r.vereniging_id === v.id)
                            .sort((a, b) => b.boekjaar.localeCompare(a.boekjaar))

                          return (
                            <div key={v.id} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px', marginBottom: '10px', border: '1px solid #e2e8f0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'flex-start' }}>
                                <div>
                                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a', marginBottom: '4px' }}>{v.naam}</div>
                                  {v.kvk && <div style={{ fontSize: '0.78rem', color: '#64748b' }}>KvK: {v.kvk}</div>}
                                  {v.adres && <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{v.adres}, {v.postcode} {v.plaats}</div>}
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', marginBottom: '10px' }}>
                                <button
                                  onClick={() => { setBewerkVve(v); setBewerkVveData({ naam: v.naam, kvk: v.kvk, adres: v.adres, postcode: v.postcode, plaats: v.plaats }); setBewerkVveHuisnummer(haalHuisnummerUitAdres(v.adres)) }}
                                  style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563EB', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'Outfit, sans-serif', fontWeight: '600' }}
                                >✏️ Bewerken</button>
                                <button onClick={async () => {
                                  const { data: { session } } = await supabase.auth.getSession()
                                  const res = await fetch('/api/admin-delete-vereniging', {
                                    method: 'DELETE',
                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
                                    body: JSON.stringify({ vereniging_id: v.id })
                                  })
                                  if (res.ok) {
                                    setVerenigingen(prev => prev.filter(x => x.id !== v.id))
                                  } else {
                                    alert('Verwijderen mislukt')
                                  }
                                }} style={{ background: 'none', border: '1px solid #fecaca', color: '#ef4444', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'Outfit, sans-serif' }}>🗑️ Verwijderen</button>
                              </div>

                              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                                {rapportenVoorVereniging.length === 0 ? (
                                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Geen rapporten voor deze VvE</div>
                                ) : (
                                  rapportenVoorVereniging.map(r => (
                                    <div key={r.id} style={{ background: 'white', borderRadius: '8px', padding: '10px', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: '700', fontSize: '0.86rem', color: '#0f172a' }}>Boekjaar {r.boekjaar}</span>
                                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                          <span style={{ background: r.betaald ? '#dcfce7' : '#fef3c7', color: r.betaald ? '#166534' : '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '600' }}>{r.betaald ? '✓ Betaald' : '⏳ Onbetaald'}</span>
                                          <button onClick={() => handleDeleteRapport(r.user_id, r.boekjaar, r.vereniging_id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '0.8rem', padding: '2px' }} title="Rapport verwijderen">🗑️</button>
                                        </div>
                                      </div>
                                      {r.rapport_tekst ? (
                                        <button onClick={() => setToonRapport(r)} style={{ width: '100%', background: '#2563EB', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
                                          📄 Rapport openen
                                        </button>
                                      ) : (
                                        <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Nog geen rapport gegenereerd</span>
                                      )}
                                      {r.gegenereerd_op && (
                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                                          Gegenereerd op {new Date(r.gegenereerd_op).toLocaleDateString('nl-NL')}
                                        </div>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          )
                        })
                      )}

                      {getRapportenVoorKlant(geselecteerdeKlant.user_id).some(r => !r.vereniging_id) && (
                        <div style={{ background: '#fff7ed', borderRadius: '10px', padding: '12px', marginTop: '12px', border: '1px solid #fed7aa' }}>
                          <div style={{ fontWeight: '700', fontSize: '0.86rem', color: '#9a3412', marginBottom: '8px' }}>Rapporten zonder gekoppelde VvE</div>
                          {getRapportenVoorKlant(geselecteerdeKlant.user_id).filter(r => !r.vereniging_id).map(r => (
                            <div key={r.id} style={{ background: 'white', borderRadius: '8px', padding: '10px', marginBottom: '8px', border: '1px solid #fed7aa' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontWeight: '700', fontSize: '0.86rem', color: '#0f172a' }}>Boekjaar {r.boekjaar}</span>
                                <span style={{ background: r.betaald ? '#dcfce7' : '#fef3c7', color: r.betaald ? '#166534' : '#92400e', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: '600' }}>{r.betaald ? '✓ Betaald' : '⏳ Onbetaald'}</span>
                              </div>
                              {r.rapport_tekst && (
                                <button onClick={() => setToonRapport(r)} style={{ width: '100%', background: '#2563EB', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
                                  📄 Rapport openen
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Kortingscodes tab */}
        {activeTab === 'kortingscodes' && (
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Nieuwe code aanmaken */}
            <div style={{ flex: '0 0 340px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 20px' }}>🎁 Nieuwe kortingscode</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Naam (bijv. BVNL Vastgoed Chat) *</label>
                  <input className="input-field" value={nieuwNaam} onChange={e => setNieuwNaam(e.target.value)} placeholder="Campagnenaam" style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', maxWidth: '100%', minWidth: 0 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Kortingsbedrag in € *</label>
                  <input className="input-field" type="number" value={nieuwBedrag} onChange={e => setNieuwBedrag(e.target.value)} placeholder="bijv. 30" style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', maxWidth: '100%', minWidth: 0 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Code *</label>
                  <input className="input-field" value={nieuwCode} onChange={e => setNieuwCode(e.target.value.toUpperCase())} placeholder="bijv. BVNL2026" style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Vervaldatum (optioneel)</label>
                  <input className="input-field" type="date" value={nieuwVerloopt} onChange={e => setNieuwVerloopt(e.target.value)} style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', maxWidth: '100%', minWidth: 0 }} />
                </div>
                {aanmakenFout && <div style={{ color: '#dc2626', fontSize: '0.82rem', background: '#fee2e2', padding: '8px 12px', borderRadius: '6px' }}>{aanmakenFout}</div>}
                <button onClick={handleAanmaken} disabled={aanmakenLoading} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '11px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif', opacity: aanmakenLoading ? 0.7 : 1 }}>
                  {aanmakenLoading ? 'Aanmaken...' : '+ Aanmaken'}
                </button>
              </div>
            </div>

            {/* Overzicht codes */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Bestaande codes</h2>
                  <button onClick={loadCoupons} style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Outfit, sans-serif', color: '#475569' }}>↻ Vernieuwen</button>
                </div>
                {couponsLoading ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Laden...</div>
                ) : coupons.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Geen kortingscodes gevonden</div>
                ) : (
                  <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {coupons.map(coupon => (
                      <div key={coupon.id} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontWeight: '700', fontSize: '0.92rem', color: '#0f172a' }}>{coupon.name}</span>
                            <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#2563EB', fontWeight: '600' }}>
                              {coupon.amount_off ? `€${(coupon.amount_off / 100).toFixed(0)} korting` : `${coupon.percent_off}% korting`}
                            </span>
                          </div>
                          <span className={`badge ${coupon.valid ? 'badge-groen' : 'badge-grijs'}`}>{coupon.valid ? 'Actief' : 'Inactief'}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
                          {coupon.times_redeemed}× gebruikt
                        </div>
                        {coupon.promoCodes.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {coupon.promoCodes.map(p => (
                              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <code style={{ fontWeight: '700', fontSize: '0.88rem', color: '#0f172a', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>{p.code}</code>
                                  <span className={`badge ${p.active ? 'badge-groen' : 'badge-rood'}`}>{p.active ? 'Actief' : 'Inactief'}</span>
                                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.times_redeemed}× gebruikt</span>
                                  {p.expires_at && <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>vervalt {new Date(p.expires_at * 1000).toLocaleDateString('nl-NL')}</span>}
                                </div>
                                {p.active && (
                                  <button onClick={() => handleDeactiveer(p.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '4px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
                                    Deactiveren
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Beheerders tab */}
        {activeTab === 'beheerders' && (
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Formulier */}
            <div style={{ flex: '0 0 320px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 20px' }}>
                {bewerkBeheerder ? '✏️ Beheerder bewerken' : '➕ Beheerder toevoegen'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Naam *</label>
                  <input value={beheerderForm.naam} onChange={e => setBeheerderForm(f => ({ ...f, naam: e.target.value, slug: bewerkBeheerder ? f.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') }))} placeholder="bijv. Janssen Beheer" style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Slug (URL) *</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '9px 14px' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>slimmekascontrole.nl/via/</span>
                    <input value={beheerderForm.slug} onChange={e => setBeheerderForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))} placeholder="janssen-beheer" style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', background: 'transparent', minWidth: 0 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Fee per verkoop (€)</label>
                  <input type="number" value={beheerderForm.fee_bedrag} onChange={e => setBeheerderForm(f => ({ ...f, fee_bedrag: e.target.value }))} placeholder="15" style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button onClick={handleSaveBeheerder} disabled={beheerderSaving} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif' }}>
                  {beheerderSaving ? 'Opslaan...' : bewerkBeheerder ? 'Opslaan' : '+ Toevoegen'}
                </button>
                {bewerkBeheerder && (
                  <button onClick={() => { setBewerkBeheerder(null); setBeheerderForm({ naam: '', slug: '', fee_bedrag: '15' }) }} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif' }}>
                    Annuleren
                  </button>
                )}
              </div>
            </div>

            {/* Overzicht */}
            <div style={{ flex: 1, minWidth: '300px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Beheerders ({beheerders.length})</h2>
              </div>
              {beheerders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Nog geen beheerders toegevoegd</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Naam</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unieke link</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Klanten</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Betaald</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fee</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                      <th style={{ padding: '10px 16px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {beheerders.map(b => {
                      const klanten_via = klanten.filter((k: any) => k.beheerder_id === b.id)
                      const betaald_via = klanten_via.filter(k => heeftBetaald(k.user_id))
                      const fee_totaal = betaald_via.length * b.fee_bedrag
                      return (
                        <tr key={b.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0f172a', fontSize: '0.88rem' }}>{b.naam}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <code style={{ fontSize: '0.75rem', color: '#2563EB', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>/via/{b.slug}</code>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: '#0f172a' }}>{klanten_via.length}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: '#16a34a' }}>{betaald_via.length}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: '#2563EB' }}>€{fee_totaal}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <span style={{ background: b.actief ? '#dcfce7' : '#f1f5f9', color: b.actief ? '#166534' : '#64748b', padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: '700' }}>
                              {b.actief ? 'Actief' : 'Inactief'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button onClick={() => { setBewerkBeheerder(b.id); setBeheerderForm({ naam: b.naam, slug: b.slug, fee_bedrag: String(b.fee_bedrag) }) }} style={{ background: '#eff6ff', color: '#2563EB', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>✏️</button>
                              <button onClick={() => handleToggleBeheerder(b.id, b.actief)} style={{ background: b.actief ? '#fef9c3' : '#f0fdf4', color: b.actief ? '#854d0e' : '#166534', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>
                                {b.actief ? 'Deactiveer' : 'Activeer'}
                              </button>
                              <button onClick={() => handleDeleteBeheerder(b.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600', fontFamily: 'Outfit, sans-serif' }}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bewerk klant modal - alleen persoonsgegevens */}
      {bewerkKlant && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '28px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>✏️ Persoonsgegevens bewerken</h3>
              <button onClick={() => setBewerkKlant(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem' }}>×</button>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>👤 Kascommissielid</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Naam</label>
                  <input value={(bewerkData as any)['naam'] || ''} onChange={e => setBewerkData(d => ({ ...d, naam: e.target.value }))} style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', maxWidth: '100%', minWidth: 0 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Postcode + huisnummer <span style={{ fontWeight: '400', color: '#94a3b8' }}>(adres automatisch)</span></label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(90px, 1fr)', gap: '8px', marginBottom: '6px', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                    <input value={(bewerkData as any)['postcode'] || ''} onChange={e => setBewerkData(d => ({ ...d, postcode: e.target.value }))} onKeyDown={e => e.key === 'Enter' && e.preventDefault()} placeholder="1234 AB" style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', width: '100%', maxWidth: '100%', minWidth: 0 }} />
                    <input value={adminProfielHuisnummer} onChange={e => setAdminProfielHuisnummer(e.target.value)} onKeyDown={e => e.key === 'Enter' && e.preventDefault()} onBlur={async e => {
                      const pc = (bewerkData as any)['postcode'] || ''
                      const hn = e.target.value
                      if (pc.replace(' ','').length < 6 || !hn) return
                      setAdminProfielHuisnummer(hn)
                      setAdminProfielAdresLaden(true)
                      try {
                        const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ','')}+${hn}&fq=type:adres&rows=1`)
                        const data = await res.json()
                        if (data.response?.docs?.[0]) {
                          const doc = data.response.docs[0]
                          setBewerkData(d => ({ ...d, adres: `${doc.straatnaam || ''} ${hn}`, plaats: doc.woonplaatsnaam || '' }))
                        }
                      } catch {}
                      setAdminProfielAdresLaden(false)
                    }} placeholder="Nr" style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', width: '100%', maxWidth: '100%', minWidth: 0 }} />
                  </div>
                  {adminProfielAdresLaden && <p style={{ fontSize: '0.78rem', color: '#2563EB', margin: '0 0 6px' }}>🔍 Adres opzoeken...</p>}
                  {(bewerkData as any)['adres'] && (bewerkData as any)['plaats'] && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '6px 10px', fontSize: '0.8rem', color: '#166534', marginBottom: '6px' }}>
                      ✓ {(bewerkData as any)['adres']}, {(bewerkData as any)['postcode']} {(bewerkData as any)['plaats']}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input value={(bewerkData as any)['adres'] || ''} onChange={e => setBewerkData(d => ({ ...d, adres: e.target.value }))} placeholder="Straat + huisnummer" style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', width: '100%', maxWidth: '100%', minWidth: 0 }} />
                    <input value={(bewerkData as any)['plaats'] || ''} onChange={e => setBewerkData(d => ({ ...d, plaats: e.target.value }))} placeholder="Plaats" style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', width: '100%', maxWidth: '100%', minWidth: 0 }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Telefoonnummer</label>
                  <input value={(bewerkData as any)['telefoon'] || ''} onChange={e => setBewerkData(d => ({ ...d, telefoon: e.target.value }))} placeholder="06-12345678" style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', maxWidth: '100%', minWidth: 0 }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSaveBewerkKlant} style={{ flex: 1, background: '#2563EB', color: 'white', border: 'none', padding: '11px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif' }}>Opslaan</button>
              <button onClick={() => setBewerkKlant(null)} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', padding: '11px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif' }}>Annuleren</button>
            </div>
          </div>
        </div>
      )}

      {/* Bewerk VvE modal - apart per vereniging */}
      {bewerkVve && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px', padding: '28px', margin: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>🏢 VvE bewerken: {bewerkVve.naam}</h3>
              <button onClick={() => setBewerkVve(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem' }}>×</button>
            </div>
            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Naam vereniging</label>
                  <input value={bewerkVveData.naam || ''} onChange={e => setBewerkVveData(d => ({ ...d, naam: e.target.value }))} style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', maxWidth: '100%', minWidth: 0 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>KvK-nummer</label>
                  <input value={bewerkVveData.kvk || ''} onChange={e => setBewerkVveData(d => ({ ...d, kvk: e.target.value }))} style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', maxWidth: '100%', minWidth: 0 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Postcode + huisnummer <span style={{ fontWeight: '400', color: '#94a3b8' }}>(adres automatisch)</span></label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(90px, 1fr)', gap: '8px', marginBottom: '6px', width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                    <input value={bewerkVveData.postcode || ''} onChange={e => setBewerkVveData(d => ({ ...d, postcode: e.target.value }))} onKeyDown={e => e.key === 'Enter' && e.preventDefault()} placeholder="1234 AB" style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', width: '100%', maxWidth: '100%', minWidth: 0 }} />
                    <input value={bewerkVveHuisnummer} onChange={e => setBewerkVveHuisnummer(e.target.value)} onKeyDown={e => e.key === 'Enter' && e.preventDefault()} onBlur={async e => {
                      const pc = bewerkVveData.postcode || ''
                      const hn = e.target.value
                      if (pc.replace(' ','').length < 6 || !hn) return
                      setBewerkVveHuisnummer(hn)
                      setBewerkVveAdresLaden(true)
                      try {
                        const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ','')}+${hn}&fq=type:adres&rows=1`)
                        const data = await res.json()
                        if (data.response?.docs?.[0]) {
                          const doc = data.response.docs[0]
                          setBewerkVveData(d => ({ ...d, adres: `${doc.straatnaam || ''} ${hn}`, plaats: doc.woonplaatsnaam || '' }))
                        }
                      } catch {}
                      setBewerkVveAdresLaden(false)
                    }} placeholder="Nr" style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', width: '100%', maxWidth: '100%', minWidth: 0 }} />
                  </div>
                  {bewerkVveAdresLaden && <p style={{ fontSize: '0.78rem', color: '#2563EB', margin: '0 0 6px' }}>🔍 Adres opzoeken...</p>}
                  {bewerkVveData.adres && bewerkVveData.plaats && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '6px 10px', fontSize: '0.8rem', color: '#166534', marginBottom: '6px' }}>
                      ✓ {bewerkVveData.adres}, {bewerkVveData.postcode} {bewerkVveData.plaats}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <input value={bewerkVveData.adres || ''} onChange={e => setBewerkVveData(d => ({ ...d, adres: e.target.value }))} placeholder="Straat + huisnummer" style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', width: '100%', maxWidth: '100%', minWidth: 0 }} />
                    <input value={bewerkVveData.plaats || ''} onChange={e => setBewerkVveData(d => ({ ...d, plaats: e.target.value }))} placeholder="Plaats" style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', width: '100%', maxWidth: '100%', minWidth: 0 }} />
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={async () => {
                setBewerkVveSaving(true)
                try {
                  let vveUpdate = { ...bewerkVveData }

                  // Ook in admin opnieuw ophalen bij opslaan, zodat adres + huisnummer echt worden opgeslagen.
                  if (vveUpdate.postcode && bewerkVveHuisnummer) {
                    try {
                      const pc = vveUpdate.postcode
                      const hn = bewerkVveHuisnummer
                      const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${String(pc).replace(' ', '')}+${hn}&fq=type:adres&rows=1`)
                      const data = await res.json()
                      if (data.response?.docs?.[0]) {
                        const doc = data.response.docs[0]
                        vveUpdate = {
                          ...vveUpdate,
                          postcode: pc,
                          adres: `${doc.straatnaam || ''} ${hn}`,
                          plaats: doc.woonplaatsnaam || '',
                        }
                        setBewerkVveData(d => ({ ...d, ...vveUpdate }))
                      }
                    } catch {
                      // Als lookup faalt, slaan we handmatig ingevulde velden alsnog op.
                    }
                  }

                  const { data: { session } } = await supabase.auth.getSession()
                  const res = await fetch('/api/admin-update-vereniging', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
                    body: JSON.stringify({ vereniging_id: bewerkVve.id, data: vveUpdate })
                  })
                  if (res.ok) {
                    setVerenigingen(prev => prev.map(v => v.id === bewerkVve.id ? { ...v, ...vveUpdate } : v))
                    setBewerkVve(null)
                  } else {
                    alert('Opslaan mislukt')
                  }
                } catch { alert('Opslaan mislukt') }
                setBewerkVveSaving(false)
              }} disabled={bewerkVveSaving} style={{ flex: 1, background: '#2563EB', color: 'white', border: 'none', padding: '11px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700', fontFamily: 'Outfit, sans-serif' }}>
                {bewerkVveSaving ? 'Opslaan...' : 'Opslaan'}
              </button>
              <button onClick={() => setBewerkVve(null)} style={{ flex: 1, background: '#f1f5f9', color: '#475569', border: 'none', padding: '11px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Outfit, sans-serif' }}>Annuleren</button>
            </div>
          </div>
        </div>
      )}

            {/* Rapport modal */}
      {toonRapport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: '#f8fafc', borderRadius: '16px', width: '100%', maxWidth: '960px', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                Rapport boekjaar {toonRapport.boekjaar} — {geselecteerdeKlant?.naam || geselecteerdeKlant?.email}
              </h3>
              <button onClick={() => setToonRapport(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '32px 24px', maxHeight: 'calc(90vh - 60px)', overflowY: 'auto' }}>
              <div style={{ maxWidth: '860px', margin: '0 auto' }}>
                <div style={{ background: 'white', borderRadius: '16px', padding: '56px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
                  <div style={{ textAlign: 'center', borderBottom: '3px solid #2563EB', paddingBottom: '28px', marginBottom: '36px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ background: '#2563EB', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <span style={{ fontWeight: '700', color: '#1D4ED8', fontSize: '1.1rem', fontFamily: 'Outfit, sans-serif' }}>slimmekascontrole.nl</span>
                    </div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: '600', color: '#0f172a', margin: '0 0 8px' }}>KASCOMMISSIE RAPPORT</h1>
                    <p style={{ color: '#475569', margin: 0, fontSize: '0.84rem' }}>
                      {verenigingen.find(v => v.id === toonRapport.vereniging_id)?.naam || geselecteerdeKlant?.naam || geselecteerdeKlant?.email} · Boekjaar {toonRapport.boekjaar}
                    </p>
                  </div>
                  {toonRapport.rapport_tekst && <RapportRenderer tekst={toonRapport.rapport_tekst} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
