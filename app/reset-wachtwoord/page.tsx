'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetWachtwoord() {
  const [wachtwoord, setWachtwoord] = useState('')
  const [bevestig, setBevestig] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Supabase handelt de session automatisch af via de URL hash
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Gebruiker is klaar om wachtwoord in te stellen
      }
    })
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (wachtwoord.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens lang zijn.')
      return
    }
    if (wachtwoord !== bevestig) {
      setError('Wachtwoorden komen niet overeen.')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password: wachtwoord })

    if (error) {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/mijn-omgeving'), 2500)
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
            <div style={{ background: '#2563EB', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', color: '#2563EB', fontSize: '1rem', lineHeight: 1.1 }}>slimme</div>
              <div style={{ fontWeight: '500', color: '#3b82f6', fontSize: '1rem', lineHeight: 1.1 }}>kascontrole</div>
            </div>
          </a>

          {!success ? (
            <>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Nieuw wachtwoord instellen</h1>
              <p style={{ color: '#475569', fontSize: '0.95rem' }}>Kies een nieuw wachtwoord voor uw account.</p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Wachtwoord gewijzigd!</h1>
              <p style={{ color: '#475569', fontSize: '0.95rem' }}>U wordt doorgestuurd naar uw omgeving...</p>
            </>
          )}
        </div>

        {!success ? (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}>
            <form onSubmit={handleReset}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '6px', fontSize: '0.9rem' }}>Nieuw wachtwoord</label>
                <input
                  type="password"
                  value={wachtwoord}
                  onChange={e => setWachtwoord(e.target.value)}
                  required
                  style={{ width: '100%', padding: '13px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '1rem', outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' }}
                  placeholder="Minimaal 8 tekens"
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', color: '#0f172a', marginBottom: '6px', fontSize: '0.9rem' }}>Bevestig wachtwoord</label>
                <input
                  type="password"
                  value={bevestig}
                  onChange={e => setBevestig(e.target.value)}
                  required
                  style={{ width: '100%', padding: '13px 14px', borderRadius: '8px', border: '1.5px solid #e2e8f0', fontSize: '1rem', outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' }}
                  placeholder="Herhaal wachtwoord"
                />
              </div>
              {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '12px', background: '#fee2e2', padding: '10px 12px', borderRadius: '6px' }}>{error}</p>}
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', padding: '14px', background: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Bezig...' : 'Wachtwoord opslaan'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
            <p style={{ color: '#475569', fontSize: '0.95rem' }}>U wordt automatisch doorgestuurd...</p>
          </div>
        )}
      </div>
    </main>
  )
}
