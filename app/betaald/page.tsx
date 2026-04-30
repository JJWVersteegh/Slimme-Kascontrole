'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function BetaaldContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')

  return (
    <main style={{ minHeight: '100vh', background: '#faf8f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '560px' }}>
        <div style={{ width: '80px', height: '80px', background: '#e8f4ee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2rem' }}>✓</div>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0d3d2e', marginBottom: '16px' }}>Betaling ontvangen!</h1>
        <p style={{ fontSize: '1.05rem', color: '#4a4a45', marginBottom: '12px' }}>Bedankt voor uw bestelling. U ontvangt binnen enkele minuten een e-mail met een link om uw financiële gegevens te uploaden.</p>
        <p style={{ fontSize: '0.9rem', color: '#4a4a45', marginBottom: '32px' }}>Controleer ook uw spammap als u de e-mail niet ziet.</p>
        <div style={{ background: '#e8f4ee', borderRadius: '12px', padding: '20px', marginBottom: '32px' }}>
          <p style={{ fontSize: '0.9rem', color: '#0d3d2e', margin: 0 }}>📧 Heeft u de e-mail ontvangen? Klik op de uploadlink om direct aan de slag te gaan.</p>
        </div>
        <a href="/mijn-omgeving" style={{ background: '#0d3d2e', color: 'white', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>Ga naar mijn omgeving →</a>
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
