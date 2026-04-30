'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Registreer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [verzonden, setVerzonden] = useState(false)
  const [error, setError] = useState('')

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setError('Vul een geldig e-mailadres in')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/mijn-omgeving`,
      },
    })

    if (error) {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } else {
      setVerzonden(true)
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#faf8f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
            <div style={{ background: '#3a6b1e', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', color: '#2d5a0e', fontSize: '1rem', lineHeight: 1.1 }}>slimme</div>
              <div style={{ fontWeight: '500', color: '#6aaa2a', fontSize: '1rem', lineHeight: 1.1 }}>kascontrole</div>
            </div>
          </a>
          {!verzonden ? (
            <>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0d3d2e', marginBottom: '8px' }}>Gratis starten</h1>
              <p style={{ color: '#4a4a45', fontSize: '0.95rem' }}>Vul uw e-mailadres in en ontvang een inloglink. Geen wachtwoord nodig.</p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0d3d2e', marginBottom: '8px' }}>Controleer uw e-mail</h1>
              <p style={{ color: '#4a4a45', fontSize: '0.95rem' }}>We hebben een inloglink gestuurd naar <strong>{email}</strong>. Klik op de link om in te loggen.</p>
            </>
          )}
        </div>

        {!verzonden ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(13,61,46,0.08)' }}>
            <form onSubmit={handleMagicLink}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0d3d2e', marginBottom: '6px', fontSize: '0.9rem' }}>E-mailadres</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '13px 14px', borderRadius: '8px', border: '1.5px solid #c8e0d4', fontSize: '1rem', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                  placeholder="uw@emailadres.nl"
                />
              </div>
              {error && <p style={{ color: '#d44', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: '#0d3d2e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Bezig...' : '✉️ Stuur inloglink'}
              </button>
            </form>

            <div style={{ marginTop: '20px', padding: '16px', background: '#e8f4ee', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#0d3d2e' }}>
                ✓ Gratis account aanmaken<br />
                ✓ Bestanden uploaden<br />
                ✓ Rapport na betaling van €59
              </p>
            </div>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#4a4a45' }}>
              Al een account? Gebruik dezelfde link om in te loggen.
            </p>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(13,61,46,0.08)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📧</div>
            <p style={{ color: '#4a4a45', marginBottom: '24px', fontSize: '0.95rem' }}>Controleer ook uw spammap als u de e-mail niet ziet.</p>
            <button
              onClick={() => { setVerzonden(false); setEmail('') }}
              style={{ background: 'none', border: '1.5px solid #c8e0d4', color: '#0d3d2e', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Ander e-mailadres gebruiken
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
