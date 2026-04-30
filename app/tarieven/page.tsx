'use client'
import { useState } from 'react'

export default function Tarieven() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleBestellen(plan: string) {
    if (!email || !email.includes('@')) {
      setError('Vul een geldig e-mailadres in')
      return
    }
    setError('')
    setLoading(plan)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Er ging iets mis. Probeer het opnieuw.')
      }
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.')
    }
    setLoading(null)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#faf8f3', fontFamily: 'Inter, sans-serif' }}>
      {/* Nav */}
      <nav style={{ background: 'rgba(250,248,243,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e0ede6', padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: '#3a6b1e', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#2d5a0e', lineHeight: 1.1 }}>slimme</div>
            <div style={{ fontWeight: '500', fontSize: '1rem', color: '#6aaa2a', lineHeight: 1.1 }}>kascontrole</div>
          </div>
        </a>
        <a href="/mijn-omgeving" style={{ color: '#0d3d2e', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' }}>Mijn omgeving →</a>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1e7a55', marginBottom: '12px' }}>Tarieven</p>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '700', color: '#0d3d2e', marginBottom: '16px' }}>Kies uw plan</h1>
          <p style={{ color: '#4a4a45', fontSize: '1.05rem', marginBottom: '32px' }}>Eerlijke prijzen, geen verrassingen. Vul uw e-mailadres in en kies een plan.</p>

          {/* Email input */}
          <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Uw e-mailadres"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px 18px', borderRadius: '8px', border: '1.5px solid #c8e0d4', fontSize: '1rem', background: 'white', outline: 'none', marginBottom: '8px' }}
            />
            {error && <p style={{ color: '#d44', fontSize: '0.85rem', marginBottom: '8px' }}>{error}</p>}
          </div>
        </div>

        {/* Pricing cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', maxWidth: '700px', margin: '0 auto' }}>
          {/* Vereniging */}
          <div style={{ background: '#0d3d2e', borderRadius: '16px', padding: '36px 28px', color: 'white', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#c9a84c', color: 'white', fontSize: '0.7rem', fontWeight: '700', padding: '4px 14px', borderRadius: '20px', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Meest gekozen</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Vereniging</h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '16px' }}>Voor actieve verenigingen</p>
            <div style={{ fontSize: '2.8rem', fontWeight: '700', lineHeight: 1, marginBottom: '4px' }}>€ 59</div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>per jaar</p>
            {['Onbeperkt rapporten', 'AI-analyse & afwijkingsdetectie', 'Meerdere boekjaren', 'Eigen logo op rapport', 'PDF-export', 'E-mail ondersteuning'].map(f => (
              <div key={f} style={{ display: 'flex', gap: '8px', marginBottom: '10px', fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)' }}>
                <span style={{ color: '#a8d5bc', fontWeight: '700' }}>✓</span> {f}
              </div>
            ))}
            <button
              onClick={() => handleBestellen('vereniging')}
              disabled={loading !== null}
              style={{ display: 'block', width: '100%', marginTop: '28px', padding: '14px', borderRadius: '8px', background: '#c9a84c', color: 'white', border: 'none', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' }}
            >
              {loading === 'vereniging' ? 'Laden...' : 'Nu bestellen – iDEAL'}
            </button>
          </div>

          {/* Koepel */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '36px 28px', border: '2px solid #e0ede6' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0d3d2e', marginBottom: '8px' }}>Koepel</h2>
            <p style={{ fontSize: '0.85rem', color: '#4a4a45', marginBottom: '16px' }}>Voor meerdere afdelingen</p>
            <div style={{ fontSize: '2.8rem', fontWeight: '700', color: '#0d3d2e', lineHeight: 1, marginBottom: '4px' }}>€ 149</div>
            <p style={{ fontSize: '0.82rem', color: '#4a4a45', marginBottom: '24px' }}>per jaar</p>
            {['Tot 10 verenigingen', 'Centraal beheerportaal', 'Geconsolideerde rapportage', 'API-integratie mogelijk', 'Dedicated support'].map(f => (
              <div key={f} style={{ display: 'flex', gap: '8px', marginBottom: '10px', fontSize: '0.88rem', color: '#4a4a45' }}>
                <span style={{ color: '#1e7a55', fontWeight: '700' }}>✓</span> {f}
              </div>
            ))}
            <button
              onClick={() => handleBestellen('koepel')}
              disabled={loading !== null}
              style={{ display: 'block', width: '100%', marginTop: '28px', padding: '14px', borderRadius: '8px', background: 'white', color: '#0d3d2e', border: '1.5px solid #a8d5bc', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' }}
            >
              {loading === 'koepel' ? 'Laden...' : 'Nu bestellen – iDEAL'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.85rem', color: '#4a4a45' }}>
          🔒 Veilige betaling via Stripe · iDEAL & creditcard · Factuur per e-mail
        </p>
      </div>
    </main>
  )
}
