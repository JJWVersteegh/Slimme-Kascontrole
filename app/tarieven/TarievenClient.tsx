'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TarievenClient() {
  const standaardBoekjaar = (new Date().getFullYear() - 1).toString()
  const [email, setEmail] = useState('')
  const [naam, setNaam] = useState('')
  const [vereniging, setVereniging] = useState('')
  const [boekjaar, setBoekjaar] = useState(standaardBoekjaar)
  const [adres, setAdres] = useState('')
  const [postcode, setPostcode] = useState('')
  const [plaats, setPlaats] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleBestellen() {
    const cleanEmail = email.trim()
    const cleanNaam = naam.trim()
    const cleanVereniging = vereniging.trim()
    const cleanBoekjaar = boekjaar.trim()

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Vul een geldig e-mailadres in')
      return
    }
    if (!cleanNaam) {
      setError('Vul uw naam in')
      return
    }
    if (!cleanVereniging) {
      setError('Vul de naam van de vereniging of organisatie in')
      return
    }
    if (!/^\d{4}$/.test(cleanBoekjaar)) {
      setError('Vul een geldig boekjaar in, bijvoorbeeld 2025')
      return
    }

    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          naam: cleanNaam,
          vereniging: cleanVereniging,
          boekjaar: cleanBoekjaar,
          adres: adres.trim(),
          postcode: postcode.trim(),
          plaats: plaats.trim(),
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Er ging iets mis. Probeer het opnieuw.')
      }
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.')
    }
    setLoading(false)
  }

  return (
    <main style={{ minHeight: '100vh', paddingTop: '72px', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <Navbar links={[{ href: '/mijn-omgeving', label: 'Mijn omgeving →' }]} />

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2563EB', marginBottom: '12px' }}>Tarieven</p>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '16px' }}>Eenmalig tarief</h1>
          <p style={{ color: '#475569', fontSize: '1.05rem', marginBottom: '32px' }}>Eerlijke prijs, geen verrassingen. Vul uw gegevens in en betaal direct via iDEAL.</p>
        </div>

        <div style={{ background: '#1e3a8a', borderRadius: '16px', padding: '40px 36px', color: 'white', position: 'relative', marginBottom: '24px' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: 'white', fontSize: '0.7rem', fontWeight: '700', padding: '4px 14px', borderRadius: '20px', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Eenmalig — geen abonnement</div>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: '700', lineHeight: 1, marginBottom: '4px' }}>€ 59</div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>incl. btw · per kascontrole</p>
          </div>
          {['Volledig gecontroleerd kascontrolerapport', 'AI-analyse & afwijkingsdetectie', 'Meerdere boekjaren uploaden', 'Trendanalyse over meerdere jaren', 'PDF-export', 'E-mail ondersteuning'].map(f => (
            <div key={f} style={{ display: 'flex', gap: '10px', marginBottom: '12px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ color: '#93c5fd', fontWeight: '700', flexShrink: 0 }}>✓</span> {f}
            </div>
          ))}

          <div style={{ marginTop: '28px' }}>
            <input type="email" placeholder="Uw e-mailadres *" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Uw naam *" value={naam} onChange={e => setNaam(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Vereniging of organisatie *" value={vereniging} onChange={e => setVereniging(e.target.value)} style={inputStyle} />
            <input type="text" inputMode="numeric" placeholder="Boekjaar, bijvoorbeeld 2025 *" value={boekjaar} onChange={e => setBoekjaar(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleBestellen()} style={inputStyle} />
            <input type="text" placeholder="Adres" value={adres} onChange={e => setAdres(e.target.value)} style={inputStyle} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '8px' }}>
              <input type="text" placeholder="Postcode" value={postcode} onChange={e => setPostcode(e.target.value)} style={inputStyle} />
              <input type="text" placeholder="Plaats" value={plaats} onChange={e => setPlaats(e.target.value)} style={inputStyle} />
            </div>
            {error && <p style={{ color: '#fca5a5', fontSize: '0.85rem', marginBottom: '8px' }}>{error}</p>}
            <button
              onClick={handleBestellen}
              disabled={loading}
              style={{ display: 'block', width: '100%', padding: '15px', borderRadius: '8px', background: '#f59e0b', color: 'white', border: 'none', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'Inter, sans-serif' }}
            >
              {loading ? 'Laden...' : '🔒 Nu bestellen – iDEAL of creditcard'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#475569' }}>
          Veilige betaling via Stripe · Factuur per e-mail · Na betaling direct aan de slag
        </p>
      </div>
    </main>
    <Footer />
  )
}

const inputStyle = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: '8px',
  border: '1.5px solid rgba(255,255,255,0.3)',
  fontSize: '1rem',
  background: 'rgba(255,255,255,0.1)',
  outline: 'none',
  color: 'white',
  marginBottom: '8px',
  boxSizing: 'border-box',
} as const
