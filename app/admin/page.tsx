'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { RapportRenderer } from '@/components/RapportRenderer'

const ADMIN_EMAIL = 'info@vertras.nl'

interface Klant {
  id: string
  user_id: string
  email: string
  naam?: string
  vereniging?: string
  adres?: string
  kvk?: string
  postcode?: string
  plaats?: string
  telefoon?: string
  plan: string
  rapport_beschikbaar: boolean
  rapport_tekst?: string
  rapport_gegenereerd_op?: string
}

interface Rapport {
  id: string
  user_id: string
  boekjaar: string
  betaald: boolean
  rapport_tekst?: string
  gegenereerd_op?: string
}

interface Upload {
  id: string
  user_id: string
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
  const [rapporten, setRapporten] = useState<Rapport[]>([])
  const [uploads, setUploads] = useState<Upload[]>([])
  const [geselecteerdeKlant, setGeselecteerdeKlant] = useState<Klant | null>(null)
  const [toonRapport, setToonRapport] = useState<Rapport | null>(null)
  const [zoekterm, setZoekterm] = useState('')
  const [filter, setFilter] = useState<'alle' | 'betaald' | 'onbetaald' | 'rapport_klaar'>('alle')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'klanten' | 'kortingscodes'>('klanten')

  // Kortingscodes state
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [couponsLoading, setCouponsLoading] = useState(false)
  const [nieuwNaam, setNieuwNaam] = useState('')
  const [nieuwBedrag, setNieuwBedrag] = useState('')
  const [nieuwCode, setNieuwCode] = useState('')
  const [nieuwVerloopt, setNieuwVerloopt] = useState('')
  const [aanmakenLoading, setAanmakenLoading] = useState(false)
  const [aanmakenFout, setAanmakenFout] = useState('')

  const router = useRouter()

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
    const [{ data: klantenData }, { data: rapportenData }, { data: uploadsData }] = await Promise.all([
      supabase.from('klanten').select('*').order('naam', { ascending: true }),
      supabase.from('rapporten').select('*').order('boekjaar', { ascending: false }),
      supabase.from('uploads').select('*').order('upload_datum', { ascending: false }),
    ])
    setKlanten(klantenData || [])
    setRapporten(rapportenData || [])
    setUploads(uploadsData || [])
    setLoading(false)
  }

  async function loadCoupons() {
    setCouponsLoading(true)
    try {
      const res = await fetch('/api/coupons')
      const data = await res.json()
      setCoupons(data)
    } catch (e) {
      console.error(e)
    }
    setCouponsLoading(false)
  }

  useEffect(() => {
    if (activeTab === 'kortingscodes') loadCoupons()
  }, [activeTab])

  async function handleAanmaken() {
    if (!nieuwNaam || !nieuwBedrag || !nieuwCode) {
      setAanmakenFout('Vul alle verplichte velden in.')
      return
    }
    setAanmakenLoading(true)
    setAanmakenFout('')
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    if (!confirm('Code deactiveren?')) return
    await fetch('/api/coupons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
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
    const zoek = zoekterm.toLowerCase()
    const matchZoek = !zoekterm ||
      k.naam?.toLowerCase().includes(zoek) ||
      k.email?.toLowerCase().includes(zoek) ||
      k.vereniging?.toLowerCase().includes(zoek)
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
                            <div style={{ fontWeight: '600', fontSize: '0.88rem', color: '#0f172a' }}>{k.naam || '—'}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{k.vereniging || '—'}</div>
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
                <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', position: 'sticky', top: '88px' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Klantdetails</h3>
                    <button onClick={() => setGeselecteerdeKlant(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem', lineHeight: 1 }}>×</button>
                  </div>
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Persoonsgegevens</div>
                      {[
                        ['Naam', geselecteerdeKlant.naam],
                        ['E-mail', geselecteerdeKlant.email],
                        ['Telefoon', geselecteerdeKlant.telefoon],
                        ['Vereniging', geselecteerdeKlant.vereniging],
                        ['KVK', geselecteerdeKlant.kvk],
                        ['Adres', geselecteerdeKlant.adres],
                        ['Postcode', geselecteerdeKlant.postcode],
                        ['Plaats', geselecteerdeKlant.plaats],
                      ].map(([label, waarde]) => waarde ? (
                        <div key={label} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '0.85rem' }}>
                          <span style={{ color: '#64748b', minWidth: '80px', flexShrink: 0 }}>{label}</span>
                          <span style={{ color: '#0f172a', fontWeight: '500' }}>{waarde}</span>
                        </div>
                      ) : null)}
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Rapporten & bestanden</div>
                      {getRapportenVoorKlant(geselecteerdeKlant.user_id).length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Geen rapporten</p>
                      ) : (
                        getRapportenVoorKlant(geselecteerdeKlant.user_id).map(r => {
                          const uploadsVoorBoekjaar = getUploadsVoorKlant(geselecteerdeKlant.user_id).filter(u => u.boekjaar === r.boekjaar)
                          return (
                            <div key={r.id} style={{ background: '#f8fafc', borderRadius: '8px', padding: '12px', marginBottom: '8px', border: '1px solid #e2e8f0' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>Boekjaar {r.boekjaar}</span>
                                <span className={`badge ${r.betaald ? 'badge-groen' : 'badge-oranje'}`}>{r.betaald ? '✓ Betaald' : '⏳ Onbetaald'}</span>
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
                              {uploadsVoorBoekjaar.length > 0 && (
                                <div style={{ marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                                  <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#94a3b8', marginBottom: '4px' }}>
                                    {uploadsVoorBoekjaar.reduce((acc, u) => acc + (u.bestanden?.length || 0), 0)} geüploade bestanden
                                  </div>
                                  <ul style={{ margin: 0, padding: '0 0 0 12px' }}>
                                    {uploadsVoorBoekjaar.flatMap(u => u.bestanden || []).map((b: string, idx: number) => {
                                      const naam = b.split('/').pop()?.replace(/^\d+-/, '') || b
                                      return <li key={idx} style={{ fontSize: '0.73rem', color: '#64748b', marginBottom: '2px' }}>· {naam}</li>
                                    })}
                                  </ul>
                                </div>
                              )}
                              {uploadsVoorBoekjaar.length === 0 && (
                                <div style={{ marginTop: '8px', fontSize: '0.73rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '6px' }}>
                                  Geen bestanden geüpload voor dit boekjaar
                                </div>
                              )}
                            </div>
                          )
                        })
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
                  <input className="input-field" value={nieuwNaam} onChange={e => setNieuwNaam(e.target.value)} placeholder="Campagnenaam" style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Kortingsbedrag in € *</label>
                  <input className="input-field" type="number" value={nieuwBedrag} onChange={e => setNieuwBedrag(e.target.value)} placeholder="bijv. 30" style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Code *</label>
                  <input className="input-field" value={nieuwCode} onChange={e => setNieuwCode(e.target.value.toUpperCase())} placeholder="bijv. BVNL2026" style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#64748b', display: 'block', marginBottom: '4px' }}>Vervaldatum (optioneel)</label>
                  <input className="input-field" type="date" value={nieuwVerloopt} onChange={e => setNieuwVerloopt(e.target.value)} style={{ width: '100%', padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
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
      </div>

      {/* Rapport modal */}
      {toonRapport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '20px', overflowY: 'auto' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                Rapport boekjaar {toonRapport.boekjaar} — {geselecteerdeKlant?.naam || geselecteerdeKlant?.email}
              </h3>
              <button onClick={() => setToonRapport(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              {toonRapport.rapport_tekst && <RapportRenderer tekst={toonRapport.rapport_tekst} />}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
