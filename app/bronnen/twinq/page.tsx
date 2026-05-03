export default function TwinqBron() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/#handleidingen" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ background: '#2563EB', width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1D4ED8' }}>slimme</div>
            <div style={{ fontWeight: '500', fontSize: '1.05rem', color: '#3b82f6' }}>kascontrole</div>
          </div>
        </a>
        <a href="/#handleidingen" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>← Terug</a>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '64px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '12px' }}>
          <img src="/twinq-logo.jpg" alt="Twinq" style={{ height: '40px', objectFit: 'contain' }}/>
        </div>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Bestanden exporteren uit Twinq</h1>
        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '48px', maxWidth: '640px' }}>
          Twinq bevat alle financiële informatie die nodig is voor een volledige kascontrole. Hieronder leggen we stap voor stap uit welke bestanden u moet downloaden en hoe.
        </p>

        {/* Wat heeft u nodig */}
        <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '28px', marginBottom: '40px', border: '1px solid #bfdbfe' }}>
          <h2 style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '1rem', marginBottom: '16px' }}>📋 Wat heeft u nodig uit Twinq?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[
              '✓ Winst- en verliesrekening (P&L)',
              '✓ Balans',
              '✓ Bankmutaties / bankafschriften',
              '✓ Inkoopfacturen',
              '✓ Verkoopfacturen',
              '✓ Debiteuren overzicht',
              '✓ Crediteuren overzicht',
              '✓ Werkelijk vs. begroot',
            ].map((item, i) => (
              <div key={i} style={{ fontSize: '0.88rem', color: '#1e3a8a', fontWeight: '500' }}>{item}</div>
            ))}
          </div>
        </div>

        {/* Stappen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {[
            {
              num: '1',
              titel: 'Winst- en verliesrekening (P&L)',
              uitleg: 'De P&L geeft een overzicht van alle inkomsten en uitgaven over het boekjaar. Dit is het belangrijkste document voor de kascontrole.',
              stappen: [
                'Log in op uw Twinq dashboard',
                'Ga naar Rapportages → Resultatenrekening',
                'Stel de periode in op het volledige boekjaar (1 jan – 31 dec)',
                'Klik op Exporteren → Excel of PDF',
                'Sla het bestand op als "PL_[jaar].xlsx"',
              ]
            },
            {
              num: '2',
              titel: 'Balans',
              uitleg: 'De balans toont de financiële positie op de laatste dag van het boekjaar: wat heeft de vereniging, en wat is ze verschuldigd.',
              stappen: [
                'Ga naar Rapportages → Balans',
                'Stel de peildatum in op 31 december van het boekjaar',
                'Klik op Exporteren → Excel of PDF',
                'Sla op als "Balans_[jaar].xlsx"',
              ]
            },
            {
              num: '3',
              titel: 'Bankmutaties',
              uitleg: 'Een volledig overzicht van alle bij- en afschrijvingen op de bankrekening. Hiermee controleren we of de saldi kloppen.',
              stappen: [
                'Ga naar Bank → Bankafschriften of Mutaties',
                'Selecteer alle bankrekeningen',
                'Stel de periode in op het volledige boekjaar',
                'Exporteer als Excel of CSV',
                'Sla op als "Bank_[jaar].xlsx"',
              ]
            },
            {
              num: '4',
              titel: 'Inkoopfacturen',
              uitleg: 'Alle facturen die de vereniging heeft ontvangen en betaald. Dit zijn de kosten van de vereniging.',
              stappen: [
                'Ga naar Inkoop → Facturen',
                'Filter op het boekjaar',
                'Exporteer het overzicht als Excel',
                'Tip: exporteer ook de PDF\'s van grote facturen (>€500) als bijlage',
              ]
            },
            {
              num: '5',
              titel: 'Verkoopfacturen',
              uitleg: 'Alle facturen die de vereniging heeft gestuurd (bijv. contributie, huur). Dit zijn de inkomsten.',
              stappen: [
                'Ga naar Verkoop → Facturen',
                'Filter op het boekjaar',
                'Exporteer als Excel',
              ]
            },
            {
              num: '6',
              titel: 'Debiteuren overzicht',
              uitleg: 'Wie moet de vereniging nog geld betalen? Dit overzicht toont openstaande vorderingen.',
              stappen: [
                'Ga naar Verkoop → Debiteuren of Openstaande posten',
                'Exporteer het overzicht als Excel',
                'Sla op als "Debiteuren_[jaar].xlsx"',
              ]
            },
            {
              num: '7',
              titel: 'Crediteuren overzicht',
              uitleg: 'Aan wie moet de vereniging nog geld betalen? Dit overzicht toont openstaande schulden.',
              stappen: [
                'Ga naar Inkoop → Crediteuren of Openstaande posten',
                'Exporteer als Excel',
                'Sla op als "Crediteuren_[jaar].xlsx"',
              ]
            },
            {
              num: '8',
              titel: 'Werkelijk vs. begroot',
              uitleg: 'Vergelijking van de werkelijke cijfers met de begroting. Hiermee zien we waar grote afwijkingen zijn.',
              stappen: [
                'Ga naar Rapportages → Begroting vs. Werkelijk (of Budgetvergelijking)',
                'Selecteer het boekjaar',
                'Exporteer als Excel of PDF',
                'Sla op als "Begroting_vs_Werkelijk_[jaar].xlsx"',
              ]
            },
          ].map((item) => (
            <div key={item.num} style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', background: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 }}>{item.num}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '6px' }}>{item.titel}</h3>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '14px' }}>{item.uitleg}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {item.stappen.map((stap, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: '#0f172a' }}>
                        <span style={{ color: '#2563EB', fontWeight: '700', flexShrink: 0 }}>{i + 1}.</span>
                        <span>{stap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Mappen tip */}
        <div style={{ background: '#fefce8', borderRadius: '12px', padding: '20px', margin: '32px 0', border: '1px solid #fde68a' }}>
          <p style={{ fontSize: '0.88rem', color: '#78350f', margin: '0 0 10px', lineHeight: 1.6 }}>
            <strong>📂 Tip: organiseer uw bestanden per boekjaar</strong>
          </p>
          <p style={{ fontSize: '0.88rem', color: '#78350f', margin: '0 0 10px', lineHeight: 1.6 }}>
            Maak op uw computer een aparte map per boekjaar en sla alle gedownloade bestanden daarin op. Zo weet u precies welke bestanden bij welk jaar horen bij het uploaden.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['📁 2023', '📁 2024', '📁 2025'].map((map, i) => (
              <div key={i} style={{ background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '6px', padding: '6px 14px', fontSize: '0.83rem', fontFamily: 'monospace', color: '#78350f' }}>{map}</div>
            ))}
          </div>
          <p style={{ fontSize: '0.83rem', color: '#92400e', margin: '10px 0 0', lineHeight: 1.5 }}>
            In onze tool selecteert u per upload het bijbehorende boekjaar — zo koppelt het systeem automatisch de juiste bestanden aan het juiste jaar.
          </p>
        </div>
        {/* CTA */}
        <div style={{ background: '#1e3a8a', borderRadius: '16px', padding: '32px', marginTop: '48px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px' }}>Klaar met downloaden?</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: '24px' }}>Upload uw bestanden in uw Slimme Kascontrole omgeving en genereer uw rapport.</p>
          <a href="/mijn-omgeving" style={{ background: '#2563EB', color: 'white', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>Ga naar mijn omgeving →</a>
        </div>

      </div>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.5)', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.83rem', marginTop: '64px' }}>
        <span>© 2026 Slimme Kascontrole — Een dienst van Vertras B.V.</span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/#handleidingen" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</a>
          <a href="/bronnen/isabel-yuki" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Isabel / Yuki</a>
          <a href="/bronnen/eigen-excel" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Eigen Excel</a>
        </div>
      </footer>

    </main>
  )
}
