'use client'

export default function Contact() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
      {/* Nav */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: '#2563EB', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1D4ED8' }}>slimme</div>
            <div style={{ fontWeight: '500', fontSize: '1.05rem', color: '#3b82f6' }}>kascontrole</div>
          </div>
        </a>
        <a href="/" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>← Terug naar home</a>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2563EB', marginBottom: '12px' }}>Contact</p>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.4rem', fontWeight: '700', color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.02em' }}>Neem contact op</h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, maxWidth: '540px' }}>Heeft u vragen over Slimme Kascontrole, uw bestelling of uw rapport? Wij helpen u graag verder.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>📞</div>
              <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px', fontSize: '1rem' }}>Bel ons</h3>
              <a href="tel:0624235829" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '600', fontSize: '1.05rem' }}>06-24235829</a>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>Bereikbaar op werkdagen</p>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>✉️</div>
              <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px', fontSize: '1rem' }}>E-mail</h3>
              <a href="mailto:info@slimmekascontrole.nl" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: '600', fontSize: '1rem' }}>info@slimmekascontrole.nl</a>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>Reactie binnen 1 werkdag</p>
            </div>

            <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '28px', border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>🏢</div>
              <h3 style={{ fontWeight: '700', color: '#0f172a', marginBottom: '8px', fontSize: '1rem' }}>Over ons</h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                Slimme Kascontrole is een dienst van<br />
                <strong style={{ color: '#0f172a' }}>Vertras B.V.</strong><br />
                Bergschenhoek, Nederland
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.1rem', marginBottom: '4px' }}>Veelgestelde vragen</h2>

            {[
              { v: 'Hoe snel ontvang ik mijn rapport?', a: 'Direct na betaling kunt u op "Genereer rapport" klikken. De AI analyseert uw bestanden en het rapport is binnen 1-2 minuten klaar.' },
              { v: 'Welke bestanden kan ik uploaden?', a: 'PDF, Excel (.xlsx, .xls), CSV en afbeeldingen. U kunt bestanden exporteren vanuit uw bank, Twinq, Isabel, Yuki of een eigen kasboek.' },
              { v: 'Is mijn financiële data veilig?', a: 'Ja. Al uw bestanden worden versleuteld opgeslagen. Wij delen nooit gegevens met derden.' },
              { v: 'Kan ik rapporten van meerdere jaren opslaan?', a: 'Ja, uw omgeving bewaart alle uploads en rapporten. Zo kunt u eenvoudig vergelijken over de jaren heen.' },
              { v: 'Wat als ik hulp nodig heb?', a: 'Bel of mail ons gerust. Wij helpen u door het proces en zorgen dat uw rapport er professioneel uitziet.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem', marginBottom: '8px' }}>❓ {item.v}</h4>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.5)', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.83rem' }}>
        <span>© 2025 SlimmeKascontrole.nl — Een dienst van Vertras B.V.</span>
        <div>
          <a href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginLeft: '24px' }}>Home</a>
          <a href="/registreer" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginLeft: '24px' }}>Account aanmaken</a>
        </div>
      </footer>
    </main>
  )
}
