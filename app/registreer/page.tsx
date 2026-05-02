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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [succes, setSucces] = useState('')
  const router = useRouter()

  async function handleRegistreer(e: React.FormEvent) {
    e.preventDefault()
    if (wachtwoord !== wachtwoord2) { setError('Wachtwoorden komen niet overeen'); return }
    if (wachtwoord.length < 6) { setError('Wachtwoord moet minimaal 6 tekens zijn'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({ email, password: wachtwoord, options: { data: { naam } } })
    if (error) {
      setError(error.message === 'User already registered' ? 'Dit e-mailadres is al geregistreerd. Log in.' : 'Er ging iets mis.')
    } else {
      router.push('/mijn-omgeving')
    }
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

  const inputStyle = {
    width: '100%', padding: '13px 14px', borderRadius: '8px',
    border: '1.5px solid #c8e0d4', fontSize: '1rem', outline: 'none',
    fontFamily: 'Inter, sans-serif', background: 'white'
  }
  const labelStyle = {
    display: 'block' as const, fontWeight: '600' as const,
    color: '#1e3a8a', marginBottom: '6px', fontSize: '0.9rem'
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo + titel */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ background: '#2563EB', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1D4ED8', fontFamily: 'Outfit, sans-serif' }}>slimme</div>
              <div style={{ fontWeight: '500', fontSize: '1.05rem', color: '#3b82f6', fontFamily: 'Outfit, sans-serif' }}>kascontrole</div>
            </div>
          </a>
        </div>

        {/* KEUZE SCHERM */}
        {mode === 'keuze' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px 32px', boxShadow: '0 4px 24px rgba(13,61,46,0.08)' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '8px', textAlign: 'center' }}>Welkom</h1>
            <p style={{ color: '#475569', fontSize: '0.9rem', textAlign: 'center', marginBottom: '32px', lineHeight: 1.6 }}>
              Upload uw financiële bestanden en ontvang een volledig gecontroleerd kascontrolerapport. Veilig, betrouwbaar en AVG-conform.
            </p>

            {/* Keuze knoppen */}
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

            {/* Veiligheidsinfo */}
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

        {/* Tabs voor registreer/login (niet bij keuze of reset) */}
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

        {/* Formulieren — ongewijzigd */}
        {mode !== 'keuze' && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(13,61,46,0.08)' }}>

            {/* Registreer */}
            {mode === 'registreer' && (
              <form onSubmit={handleRegistreer}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Uw naam</label>
                  <input type="text" value={naam} onChange={e => setNaam(e.target.value)} style={inputStyle} placeholder="Voor- en achternaam" required />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Naam vereniging</label>
                  <input type="text" value={vereniging} onChange={e => setVereniging(e.target.value)} style={inputStyle} placeholder="bijv. VvE De Goudstraat" required />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>KvK-nummer <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
                  <input type="text" value={kvk} onChange={e => setKvk(e.target.value)} style={inputStyle} placeholder="bijv. 12345678" />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>E-mailadres</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="uw@emailadres.nl" required />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Wachtwoord</label>
                  <input type="password" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} style={inputStyle} placeholder="Minimaal 6 tekens" required />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>Wachtwoord bevestigen</label>
                  <input type="password" value={wachtwoord2} onChange={e => setWachtwoord2(e.target.value)} style={inputStyle} placeholder="Herhaal wachtwoord" required />
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
                  <label style={labelStyle}>E-mailadres</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="uw@emailadres.nl" required />
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={labelStyle}>Wachtwoord</label>
                  <input type="password" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} style={inputStyle} placeholder="Uw wachtwoord" required />
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

            {/* Wachtwoord reset */}
            {mode === 'reset' && (
              <form onSubmit={handleReset}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={labelStyle}>E-mailadres</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="uw@emailadres.nl" required />
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
    </main>
  )
}
