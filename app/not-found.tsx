import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Pagina niet gevonden | Slimme Kascontrole',
}

export default function NotFound() {
  return (
    <>
      <main style={{ minHeight: '100vh', paddingTop: '72px', background: '#f8fafc', fontFamily: 'Outfit, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '72px 24px 64px' }}>
        <Navbar />
        <div style={{ maxWidth: '480px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🔍</div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Pagina niet gevonden</h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '32px' }}>
            De pagina die u zoekt bestaat niet of is verplaatst. Ga terug naar de homepage of log in op uw omgeving.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" style={{ background: '#2563EB', color: 'white', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif' }}>← Terug naar home</a>
            <a href="/mijn-omgeving" style={{ background: 'white', color: '#1e3a8a', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem', border: '2px solid #bfdbfe', fontFamily: 'Outfit, sans-serif' }}>Mijn omgeving</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
