export default function IsabelYukiBron() {
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
        <a href="/#bronnen" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>← Terug</a>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '64px 24px' }}>

        {/* Header */}
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💼</div>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Bestanden exporteren uit Isabel / Yuki</h1>
        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '48px', maxWidth: '640px' }}>
          Isabel en Yuki zijn populaire boekhoudpakketten voor Nederlandse verenigingen en VvE's. Hieronder leggen we uit welke exports u nodig heeft en hoe u ze downloadt.
        </p>

        {/* Tabs Isabel vs Yuki */}
        <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '28px', marginBottom: '40px', border: '1px solid #bfdbfe' }}>
          <h2 style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '1rem', marginBottom: '16px' }}>📋 Wat heeft u nodig?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              '✓ Jaarrekening / resultatenrekening',
              '✓ Balans',
              '✓ Bankmutaties / kasboek',
              '✓ Debiteuren overzicht',
              '✓ Crediteuren overzicht',
              '✓ Begroting vs. werkelijk',
            ].map((item, i) => (
              <div key={i} style={{ fontSize: '0.88rem', color: '#1e3a8a', fontWeight: '500' }}>{item}</div>
            ))}
          </div>
        </div>

        {/* Isabel sectie */}
        <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.2rem', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>Exporteren uit Isabel</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
          {[
            {
              titel: 'Jaarrekening (resultatenrekening)',
              stappen: [
                'Log in op Isabel Online',
                'Ga naar Rapporten → Resultatenrekening',
                'Stel de periode in: 1 januari t/m 31 december van het boekjaar',
                'Klik op Exporteren → Excel (.xlsx)',
              ]
            },
            {
              titel: 'Balans',
              stappen: [
                'Ga naar Rapporten → Balans',
                'Stel peildatum in op 31 december',
                'Exporteer als Excel',
              ]
            },
            {
              titel: 'Bankmutaties / kasboek',
              stappen: [
                'Ga naar Bank → Overzicht mutaties',
                'Selecteer het volledige boekjaar',
                'Exporteer als CSV of Excel',
              ]
            },
            {
              titel: 'Debiteuren en crediteuren',
              stappen: [
                'Ga naar Relaties → Debiteuren / Crediteuren',
                'Klik op Openstaande posten',
                'Exporteer als Excel',
              ]
            },
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem', marginBottom: '12px' }}>{item.titel}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {item.stappen.map((stap, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#0f172a' }}>
                    <span style={{ color: '#2563EB', fontWeight: '700', flexShrink: 0 }}>{i + 1}.</span>
                    <span>{stap}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Yuki sectie */}
        <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.2rem', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>Exporteren uit Yuki</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '48px' }}>
          {[
            {
              titel: 'Jaarrekening (winst en verlies)',
              stappen: [
                'Log in op app.yuki.nl',
                'Ga naar Rapportages → Winst en verliesrekening',
                'Stel het boekjaar in',
                'Klik op het download-icoon → Excel of PDF',
              ]
            },
            {
              titel: 'Balans',
              stappen: [
                'Ga naar Rapportages → Balans',
                'Selecteer peildatum 31 december',
                'Download als Excel of PDF',
              ]
            },
            {
              titel: 'Bankmutaties',
              stappen: [
                'Ga naar Bank → Bankoverzicht',
                'Selecteer de bankrekening en het boekjaar',
                'Exporteer als CSV of Excel',
              ]
            },
            {
              titel: 'Debiteuren en crediteuren',
              stappen: [
                'Ga naar Relaties → Openstaande posten',
                'Filter op debiteuren of crediteuren',
                'Exporteer als Excel',
              ]
            },
            {
              titel: 'Begroting vs. werkelijk',
              stappen: [
                'Ga naar Rapportages → Budgetvergelijking',
                'Selecteer het boekjaar',
                'Exporteer als Excel of PDF',
              ]
            },
          ].map((item, idx) => (
            <div key={idx} style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem', marginBottom: '12px' }}>{item.titel}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {item.stappen.map((stap, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#0f172a' }}>
                    <span style={{ color: '#2563EB', fontWeight: '700', flexShrink: 0 }}>{i + 1}.</span>
                    <span>{stap}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background: '#1e3a8a', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px' }}>Klaar met downloaden?</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: '24px' }}>Upload uw bestanden in uw Slimme Kascontrole omgeving en genereer uw rapport.</p>
          <a href="/mijn-omgeving" style={{ background: '#2563EB', color: 'white', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>Ga naar mijn omgeving →</a>
        </div>

      </div>

      <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.5)', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.83rem', marginTop: '64px' }}>
        <span>© 2025 SlimmeKascontrole.nl — Een dienst van Vertras B.V.</span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</a>
          <a href="/bronnen/twinq" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Twinq</a>
          <a href="/bronnen/eigen-excel" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Eigen Excel</a>
        </div>
      </footer>
    </main>
  )
}
