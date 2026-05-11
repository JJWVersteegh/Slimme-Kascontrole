'use client'
import Navbar from '@/components/Navbar'

export default function BronnenOverzicht() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        .site-nav { box-sizing: border-box; width: 100%; }
        @media (max-width: 900px) {
          .site-nav { padding: 0 20px !important; }
        }
        @media (max-width: 500px) {
          .site-nav { padding: 0 16px !important; }
        }

        .bron-card { transition: transform 0.2s, box-shadow 0.2s; }
        .bron-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
      `}</style>

      {/* Nav */}
      <Navbar links={[{ href: '/', label: '← Terug naar home' }]} />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2563EB', marginBottom: '12px' }}>Handleidingen</p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>Hoe haalt u uw gegevens op?</h1>
        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '48px', maxWidth: '640px' }}>
          Voor een goede kascontrole heeft u financiële gegevens nodig uit uw boekhoudpakket of bank. Kies hieronder uw situatie en volg de stap-voor-stap handleiding.
        </p>

        {/* Kaarten */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>

          <a href="/bronnen/twinq" className="bron-card" style={{ background: 'white', borderRadius: '16px', padding: '32px 24px', border: '1px solid #e2e8f0', textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ height: '48px', display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <img src="/twinq-logo.jpg" alt="Twinq" style={{ maxHeight: '36px', objectFit: 'contain' }}/>
            </div>
            <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>Twinq</h2>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '16px' }}>Exporteer de P&amp;L, balans, bankmutaties, debiteuren en crediteuren uit Twinq.</p>
            <span style={{ color: '#2563EB', fontSize: '0.85rem', fontWeight: '600' }}>Bekijk handleiding →</span>
          </a>

          <a href="/bronnen/isabel-yuki" className="bron-card" style={{ background: 'white', borderRadius: '16px', padding: '32px 24px', border: '1px solid #e2e8f0', textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ height: '48px', display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '2rem' }}>💼</div>
            <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>Isabel / Yuki</h2>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '16px' }}>Exporteer uw jaarrekening, balans en bankafschriften uit Isabel of Yuki.</p>
            <span style={{ color: '#2563EB', fontSize: '0.85rem', fontWeight: '600' }}>Bekijk handleiding →</span>
          </a>

          <a href="/bronnen/eigen-excel" className="bron-card" style={{ background: 'white', borderRadius: '16px', padding: '32px 24px', border: '1px solid #e2e8f0', textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <div style={{ height: '48px', display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '2rem' }}>📁</div>
            <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>Eigen Excel</h2>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '16px' }}>Werkt u met een eigen kasboek of Excel? Hier leest u hoe u dit aanlevert.</p>
            <span style={{ color: '#2563EB', fontSize: '0.85rem', fontWeight: '600' }}>Bekijk handleiding →</span>
          </a>

        </div>

        {/* Info blok */}
        <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '28px', border: '1px solid #bfdbfe' }}>
          <h3 style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '1rem', marginBottom: '8px' }}>💡 Tip: verzamel altijd meerdere jaren</h3>
          <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.7 }}>
            Voor een trendanalyse kunt u bestanden van meerdere jaren uploaden. Het rapport richt zich op het door u gekozen boekjaar, maar voorgaande jaren helpen om patronen te herkennen — zoals kosten die elk jaar stijgen of een debiteur die al jaren niet betaalt.
          </p>
        </div>
      </div>

      <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.5)', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.83rem', marginTop: '64px' }}>
        <span>© 2025 SlimmeKascontrole.nl — Een dienst van Vertras B.V.</span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</a>
          <a href="/registreer" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Account aanmaken</a>
          <a href="/mijn-omgeving" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Mijn omgeving</a>
        </div>
      </footer>
    </main>
  )
}
