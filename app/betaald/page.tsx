'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function BetaaldContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '560px' }}>

        {/* Logo */}
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '40px' }}>
          <div style={{ background: '#2563EB', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1D4ED8' }}>slimme</div>
            <div style={{ fontWeight: '500', fontSize: '1.05rem', color: '#3b82f6' }}>kascontrole</div>
          </div>
        </a>

        {/* Checkmark */}
        <div style={{ width: '80px', height: '80px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="36" height="36" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>Betaling ontvangen!</h1>
        <p style={{ fontSize: '1rem', color: '#475569', marginBottom: '12px', lineHeight: 1.7 }}>
          Bedankt voor uw betaling. U kunt nu direct uw bestanden uploaden en uw kascontrolerapport genereren.
        </p>
        <p style={{ fontSize: '0.88rem', color: '#94a3b8', marginBottom: '32px' }}>
          U ontvangt ook een bevestiging per e-mail. Controleer uw spammap als u deze niet ziet.
        </p>

        {/* Info blokje */}
        <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '20px', marginBottom: '32px', border: '1px solid #bfdbfe' }}>
          <p style={{ fontSize: '0.9rem', color: '#1e3a8a', margin: 0, lineHeight: 1.6 }}>
            ✅ Uw betaling is verwerkt. Ga naar uw omgeving, upload uw bestanden en klik op <strong>Genereer rapport</strong>.
          </p>
        </div>

        <a href="/mijn-omgeving" style={{ background: '#2563EB', color: 'white', padding: '14px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '1rem', display: 'inline-block' }}>
          Ga naar mijn omgeving →
        </a>
      </div>
    </main>
  )
}

export default function Betaald() {
  return (
    <Suspense>
      <BetaaldContent />
    </Suspense>
  )
}
