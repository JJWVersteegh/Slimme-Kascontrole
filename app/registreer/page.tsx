'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Registreer() {
  const [mode, setMode] = useState<'keuze' | 'registreer' | 'login' | 'reset'>('keuze')
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [wachtwoord2, setWachtwoord2] = useState('')
  const [naam, setNaam] = useState('')
  const [vereniging, setVereniging] = useState('')
  const [kvk, setKvk] = useState('')
  const [postcode, setPostcode] = useState('')
  const [huisnummer, setHuisnummer] = useState('')
  const [adres, setAdres] = useState('')
  const [plaats, setPlaats] = useState('')
  const [adresLaden, setAdresLaden] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [succes, setSucces] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  async function zoekAdres(pc: string, hn: string) {
    if (pc.length < 6 || !hn) return
    setAdresLaden(true)
    try {
      const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ','')}+${hn}&fq=type:adres&rows=1`)
      const data = await res.json()
      if (data.response?.docs?.[0]) {
        const doc = data.response.docs[0]
        const straat = doc.straatnaam || ''
        const woonplaats = doc.woonplaatsnaam || ''
        setAdres(`${straat} ${hn}`)
        setPlaats(woonplaats)
      }
    } catch {}
    setAdresLaden(false)
  }

  async function handleRegistreer(e: React.FormEvent) {
    e.preventDefault()
    if (wachtwoord !== wachtwoord2) { setError('Wachtwoorden komen niet overeen'); return }
    if (wachtwoord.length < 6) { setError('Wachtwoord moet minimaal 6 tekens zijn'); return }
    setLoading(true); setError('')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email, password: wachtwoord, options: { data: { naam } }
    })
    if (authError) {
      setError(authError.message === 'User already registered' ? 'Dit e-mailadres is al geregistreerd. Log in.' : 'Er ging iets mis.')
      setLoading(false); return
    }
    // Sla gegevens op in klanten tabel
    if (authData.user) {
      await supabase.from('klanten').upsert({
        user_id: authData.user.id,
        email,
        naam,
        vereniging,
        kvk,
        adres,
        postcode: postcode.toUpperCase().replace(' ', ''),
        plaats,
      })
    }
    router.push('/mijn-omgeving')
    setLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord })
    if (error) {
      setError('Ongeldig e-mailadres of wachtwoord')
    } else {
      router.push('/mijn-omgeving')
    }
    setLoading(false)
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(''); setSucces('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/mijn-omgeving`,
    })
    if (error) {
      setError('Er ging iets mis. Controleer uw e-mailadres.')
    } else {
      setSucces('E-mail verstuurd! Controleer uw inbox voor de resetlink.')
    }
    setLoading(false)
  }

  const inp = {
    width: '100%', padding: '13px 14px', borderRadius: '8px',
    border: '1.5px solid #c8e0d4', fontSize: '1rem', outline: 'none',
    fontFamily: 'Inter, sans-serif', background: 'white'
  }
  const lbl = {
    display: 'block' as const, fontWeight: '600' as const,
    color: '#1e3a8a', marginBottom: '6px', fontSize: '0.9rem'
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-padding { padding: 0 20px !important; }
        }
        .nav-mobile-menu a { display: block; padding: 12px 16px; color: #0f172a; text-decoration: none; font-weight: 500; border-radius: 8px; font-size: 0.95rem; }
        .nav-mobile-menu a:hover { background: #f8fafc; }
      `}</style>
      <nav className="nav-padding" style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 200, width: '100%', boxSizing: 'border-box' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: '#2563EB', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1D4ED8', fontFamily: 'Outfit, sans-serif' }}>slimme</div>
            <div style={{ fontWeight: '500', fontSize: '1.05rem', color: '#3b82f6', fontFamily: 'Outfit, sans-serif' }}>kascontrole</div>
          </div>
        </a>
        <ul className="nav-links-desktop" style={{ display: 'flex', gap: '28px', listStyle: 'none', alignItems: 'center', margin: 0, padding: 0 }}>
          <li><a href="/#waarom" style={{ fontSize: '0.88rem', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Waarom</a></li>
          <li><a href="/#hoe-het-werkt" style={{ fontSize: '0.88rem', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Hoe het werkt</a></li>
          <li><a href="/#handleidingen" style={{ fontSize: '0.88rem', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Handleidingen</a></li>
          <li><a href="/#over-ons" style={{ fontSize: '0.88rem', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Over ons</a></li>
          <li><a href="/#tarieven" style={{ fontSize: '0.88rem', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Tarieven</a></li>
          <li><a href="/#contact" style={{ fontSize: '0.88rem', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Contact</a></li>
          <li><a href="/mijn-omgeving" style={{ fontSize: '0.88rem', fontWeight: '500', color: '#475569', textDecoration: 'none' }}>Mijn omgeving</a></li>
          <li><a href="/registreer" style={{ background: '#2563EB', color: 'white', padding: '9px 20px', borderRadius: '6px', fontSize: '0.88rem', fontWeight: '600', textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>Account aanmaken</a></li>
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
          <a href="/#hoe-het-werkt" onClick={() => setMobileMenuOpen(false)}>Hoe het werkt</a>
          <a href="/#handleidingen" onClick={() => setMobileMenuOpen(false)}>Handleidingen</a>
          <a href="/#over-ons" onClick={() => setMobileMenuOpen(false)}>Over ons</a>
          <a href="/#tarieven" onClick={() => setMobileMenuOpen(false)}>Tarieven</a>
          <a href="/#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <a href="/mijn-omgeving" onClick={() => setMobileMenuOpen(false)}>Mijn omgeving</a>
          <a href="/registreer" onClick={() => setMobileMenuOpen(false)} style={{ background: '#2563EB', color: 'white !important', marginTop: '8px', borderRadius: '8px', fontWeight: '700', textAlign: 'center' }}>Account aanmaken</a>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* KEUZE SCHERM */}
        {mode === 'keuze' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px 32px', boxShadow: '0 4px 24px rgba(13,61,46,0.08)' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '8px', textAlign: 'center' }}>Welkom</h1>
            <p style={{ color: '#475569', fontSize: '0.9rem', textAlign: 'center', marginBottom: '32px', lineHeight: 1.6 }}>
              Upload uw financiële bestanden en ontvang een volledig gecontroleerd kascontrolerapport. Veilig, betrouwbaar en AVG-conform.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              <button onClick={() => setMode('registreer')} style={{ width: '100%', padding: '16px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '1.4rem' }}>✨</span>
                <div>
                  <div>Nieuw account aanmaken</div>
                  <div style={{ fontWeight: '400', fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>Eerste keer hier? Start hier</div>
                </div>
              </button>
              <button onClick={() => setMode('login')} style={{ width: '100%', padding: '16px', background: 'white', color: '#1e3a8a', border: '2px solid #bfdbfe', borderRadius: '10px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '1.4rem' }}>🔑</span>
                <div>
                  <div>Inloggen</div>
                  <div style={{ fontWeight: '400', fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>Al een account? Log hier in</div>
                </div>
              </button>
            </div>
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Wat wij met uw gegevens doen</p>
              {[
                { icon: '🔒', tekst: 'Bestanden worden versleuteld opgeslagen in Nederlandse datacenters' },
                { icon: '🇳🇱', tekst: 'AVG-conform — uw data wordt nooit gedeeld met derden' },
                { icon: '🗑️', tekst: 'U kunt uw bestanden op elk moment permanent verwijderen' },
                { icon: '📄', tekst: 'Alleen gebruikt voor het opstellen van uw kascontrolerapport' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  <span>{item.tekst}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode !== 'keuze' && mode !== 'reset' && (
          <>
            <div style={{ display: 'flex', background: '#eff6ff', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
              {(['registreer', 'login'] as const).map(m => (
                <button key={m} onClick={() => { setMode(m); setError('') }}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', background: mode === m ? 'white' : 'transparent', color: mode === m ? '#1e3a8a' : '#475569', boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
                  {m === 'registreer' ? 'Nieuw account' : 'Inloggen'}
                </button>
              ))}
            </div>
            <button onClick={() => { setMode('keuze'); setError('') }} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.82rem', cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
              ← Terug
            </button>
          </>
        )}

        {mode !== 'keuze' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(13,61,46,0.08)' }}>

            {/* Registreer */}
            {mode === 'registreer' && (
              <form onSubmit={handleRegistreer}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>Uw naam <span style={{ fontWeight: '400', fontSize: '0.8rem', color: '#94a3b8' }}>(kascommissielid)</span></label>
                  <input type="text" value={naam} onChange={e => setNaam(e.target.value)} style={inp} placeholder="Voor- en achternaam" required />
                </div>

                {/* Postcode + huisnummer met auto-lookup */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>Uw adres <span style={{ fontWeight: '400', fontSize: '0.8rem', color: '#94a3b8' }}>(van kascommissielid)</span></label>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    <input type="text" value={postcode} onChange={e => { setPostcode(e.target.value); zoekAdres(e.target.value, huisnummer) }}
                      style={inp} placeholder="1234 AB" maxLength={7} />
                    <input type="text" value={huisnummer} onChange={e => { setHuisnummer(e.target.value); zoekAdres(postcode, e.target.value) }}
                      style={inp} placeholder="12" />
                  </div>
                  {adresLaden && <p style={{ fontSize: '0.78rem', color: '#2563EB', margin: '0 0 6px' }}>🔍 Adres opzoeken...</p>}
                  {adres && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '8px 12px', fontSize: '0.83rem', color: '#166534' }}>
                      ✓ {adres}, {postcode.toUpperCase()} {plaats}
                    </div>
                  )}
                  {!adres && postcode.length >= 6 && huisnummer && !adresLaden && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                      <input type="text" value={adres} onChange={e => setAdres(e.target.value)} style={{ ...inp, fontSize: '0.88rem' }} placeholder="Straatnaam + nr" />
                      <input type="text" value={plaats} onChange={e => setPlaats(e.target.value)} style={{ ...inp, fontSize: '0.88rem' }} placeholder="Plaats" />
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>Naam vereniging / VvE</label>
                  <input type="text" value={vereniging} onChange={e => setVereniging(e.target.value)} style={inp} placeholder="bijv. VvE De Goudstraat" required />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>KvK-nummer vereniging <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
                  <input type="text" value={kvk} onChange={e => setKvk(e.target.value)} style={inp} placeholder="bijv. 12345678" />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>E-mailadres</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} placeholder="uw@emailadres.nl" required />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>Wachtwoord</label>
                  <input type="password" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} style={inp} placeholder="Minimaal 6 tekens" required />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={lbl}>Wachtwoord bevestigen</label>
                  <input type="password" value={wachtwoord2} onChange={e => setWachtwoord2(e.target.value)} style={inp} placeholder="Herhaal wachtwoord" required />
                </div>
                {error && <p style={{ color: '#d44', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                  {loading ? 'Bezig...' : 'Account aanmaken'}
                </button>
              </form>
            )}

            {/* Login */}
            {mode === 'login' && (
              <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>E-mailadres</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} placeholder="uw@emailadres.nl" required />
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={lbl}>Wachtwoord</label>
                  <input type="password" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} style={inp} placeholder="Uw wachtwoord" required />
                </div>
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                  <button type="button" onClick={() => { setMode('reset'); setError('') }}
                    style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
                    Wachtwoord vergeten?
                  </button>
                </div>
                {error && <p style={{ color: '#d44', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                  {loading ? 'Bezig...' : 'Inloggen'}
                </button>
              </form>
            )}

            {/* Reset */}
            {mode === 'reset' && (
              <form onSubmit={handleReset}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={lbl}>E-mailadres</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} placeholder="uw@emailadres.nl" required />
                </div>
                {error && <p style={{ color: '#d44', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
                {succes && <p style={{ color: '#2563EB', fontSize: '0.85rem', marginBottom: '12px' }}>{succes}</p>}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                  {loading ? 'Bezig...' : '✉️ Stuur resetlink'}
                </button>
                <button type="button" onClick={() => { setMode('login'); setError(''); setSucces('') }}
                  style={{ width: '100%', marginTop: '12px', padding: '12px', background: 'none', border: '1.5px solid #c8e0d4', color: '#1e3a8a', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
                  ← Terug naar inloggen
                </button>
              </form>
            )}
          </div>
        )}
      </div>
      </div>
    </main>
  )
}
