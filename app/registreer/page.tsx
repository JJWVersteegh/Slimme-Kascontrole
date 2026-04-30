'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Registreer() {
  const [mode, setMode] = useState<'registreer' | 'login'>('registreer')
  const [email, setEmail] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [wachtwoord2, setWachtwoord2] = useState('')
  const [naam, setNaam] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleRegistreer(e: React.FormEvent) {
    e.preventDefault()
    if (wachtwoord !== wachtwoord2) { setError('Wachtwoorden komen niet overeen'); return }
    if (wachtwoord.length < 6) { setError('Wachtwoord moet minimaal 6 tekens zijn'); return }
    setLoading(true); setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password: wachtwoord,
      options: { data: { naam } }
    })

    if (error) {
      setError(error.message === 'User already registered' ? 'Dit e-mailadres is al geregistreerd. Log in.' : 'Er ging iets mis. Probeer het opnieuw.')
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

  const inputStyle = {
    width: '100%', padding: '13px 14px', borderRadius: '8px',
    border: '1.5px solid #c8e0d4', fontSize: '1rem', outline: 'none',
    fontFamily: 'Inter, sans-serif', background: 'white'
  }
  const labelStyle = {
    display: 'block' as const, fontWeight: '600' as const,
    color: '#0d3d2e', marginBottom: '6px', fontSize: '0.9rem'
  }

  return (
    <main style={{ minHeight: '100vh', background: '#faf8f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '20px' }}>
            <div style={{ background: '#3a6b1e', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', color: '#2d5a0e', fontSize: '1rem', lineHeight: 1.1 }}>slimme</div>
              <div style={{ fontWeight: '500', color: '#6aaa2a', fontSize: '1rem', lineHeight: 1.1 }}>kascontrole</div>
            </div>
          </a>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0d3d2e', marginBottom: '4px' }}>
            {mode === 'registreer' ? 'Gratis account aanmaken' : 'Inloggen'}
          </h1>
          <p style={{ color: '#4a4a45', fontSize: '0.9rem' }}>
            {mode === 'registreer' ? 'Upload bestanden en ontvang uw rapport' : 'Welkom terug!'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#e8f4ee', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
          {(['registreer', 'login'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', background: mode === m ? 'white' : 'transparent', color: mode === m ? '#0d3d2e' : '#4a4a45', boxShadow: mode === m ? '0 2px 8px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }}>
              {m === 'registreer' ? 'Nieuw account' : 'Inloggen'}
            </button>
          ))}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(13,61,46,0.08)' }}>
          <form onSubmit={mode === 'registreer' ? handleRegistreer : handleLogin}>
            {mode === 'registreer' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Uw naam</label>
                <input type="text" value={naam} onChange={e => setNaam(e.target.value)} style={inputStyle} placeholder="Voor- en achternaam" required />
              </div>
            )}
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>E-mailadres</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="uw@emailadres.nl" required />
            </div>
            <div style={{ marginBottom: mode === 'registreer' ? '16px' : '24px' }}>
              <label style={labelStyle}>Wachtwoord</label>
              <input type="password" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} style={inputStyle} placeholder="Minimaal 6 tekens" required />
            </div>
            {mode === 'registreer' && (
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Wachtwoord bevestigen</label>
                <input type="password" value={wachtwoord2} onChange={e => setWachtwoord2(e.target.value)} style={inputStyle} placeholder="Herhaal wachtwoord" required />
              </div>
            )}
            {error && <p style={{ color: '#d44', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '14px', background: '#0d3d2e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Bezig...' : mode === 'registreer' ? 'Account aanmaken' : 'Inloggen'}
            </button>
          </form>

          {mode === 'registreer' && (
            <div style={{ marginTop: '20px', padding: '14px', background: '#e8f4ee', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.83rem', color: '#0d3d2e' }}>
                ✓ Gratis account · ✓ Bestanden uploaden · ✓ Rapport na betaling €59
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
