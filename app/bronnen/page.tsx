export default function BronnenOverzicht() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: '#2563EB', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1D4ED8' }}>slimme</div>
            <div style={{ fontWeight: '500', fontSize: '1.05rem', color: '#3b82f6' }}>kascontrole</div>
          </div>
        </a>
        <a href="/" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>← Terug naar home</a>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '64px 24px' }}>

        {/* Header */}
        <p style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2563EB', marginBottom: '12px' }}>Handleidingen</p>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px' }}>Hoe haalt u uw gegevens op?</h1>
        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '48px', maxWidth: '640px' }}>
          Voor een goede kascontrole heeft u financiële gegevens nodig uit uw boekhoudpakket of bank. Kies hieronder uw situatie en volg de stap-voor-stap handleiding.
        </p>

        {/* Kaarten */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>

          <a href="/bronnen/twinq" style={{ background: 'white', borderRadius: '16px', padding: '32px 24px', border: '1px solid #e2e8f0', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)' }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}>
            <div style={{ height: '48px', display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <img src="/twinq-logo.jpg" alt="Twinq" style={{ maxHeight: '36px', objectFit: 'contain' }}/>
            </div>
            <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.05rem', marginBottom: '8px' }}>Twinq</h2>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '16px' }}>Export de P&amp;L, balans, bankmutaties, debiteuren en crediteuren uit Twinq.</p>
            <span style={{ color: '#2563EB', fontSize: '0.85rem', fontWeight: '600' }}>Bekijk handleiding →</span>
          </a>

          <a href="/bronnen/isabel-yuki" style={{ background: 'white', borderRadius: '16px', padding: '32px 24px', border: '1px solid #e2e8f0', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)' }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}>
            <div style={{ height: '48px', display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '2rem' }}>💼</div>
            <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.05rem', marginBottom: '8px' }}>Isabel / Yuki</h2>
            <p style={{ color: '#475569', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '16px' }}>Exporteer uw jaarrekening, balans en bankafschriften uit Isabel of Yuki.</p>
            <span style={{ color: '#2563EB', fontSize: '0.85rem', fontWeight: '600' }}>Bekijk handleiding →</span>
          </a>

          <a href="/bronnen/eigen-excel" style={{ background: 'white', borderRadius: '16px', padding: '32px 24px', border: '1px solid #e2e8f0', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)' }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}>
            <div style={{ height: '48px', display: 'flex', alignItems: 'center', marginBottom: '16px', fontSize: '2rem' }}>📁</div>
            <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.05rem', marginBottom: '8px' }}>Eigen Excel</h2>
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

      {/* Footer */}
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
