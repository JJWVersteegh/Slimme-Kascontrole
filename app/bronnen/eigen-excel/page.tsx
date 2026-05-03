export default function EigenExcelBron() {
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
        <a href="/#handleidingen" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>← Terug</a>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '64px 24px' }}>

        {/* Header */}
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📁</div>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px' }}>Eigen Excel of kasboek gebruiken</h1>
        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '48px', maxWidth: '640px' }}>
          Werkt uw vereniging met een zelfgemaakt kasboek of Excel-overzicht? Geen probleem — u kunt dit gewoon uploaden. Op deze pagina leggen we uit wat we verwachten en hoe u uw bestand het beste kunt aanleveren.
        </p>

        {/* Wat accepteren we */}
        <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '28px', marginBottom: '40px', border: '1px solid #bfdbfe' }}>
          <h2 style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '1rem', marginBottom: '12px' }}>✅ Welke bestanden accepteren we?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { type: 'Excel (.xlsx, .xls)', omschrijving: 'Kasboek, overzicht inkomsten/uitgaven, begroting' },
              { type: 'CSV', omschrijving: 'Export uit een eenvoudig boekhoudprogramma of bank' },
              { type: 'PDF', omschrijving: 'Bankafschriften, factuuroverzichten' },
              { type: 'Afbeelding (.jpg, .png)', omschrijving: 'Foto van een kasboek of handgeschreven overzicht' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '0.88rem' }}>
                <span style={{ fontWeight: '700', color: '#2563EB', minWidth: '140px' }}>{item.type}</span>
                <span style={{ color: '#475569' }}>{item.omschrijving}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stappen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 }}>1</div>
              <div>
                <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>Zorg voor een overzicht van inkomsten en uitgaven</h3>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '12px' }}>Het minimale wat we nodig hebben is een overzicht van alle inkomsten en uitgaven over het boekjaar. Dit kan een eenvoudig kasboek zijn.</p>
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', fontSize: '0.85rem', color: '#475569' }}>
                  <strong style={{ color: '#0f172a', display: 'block', marginBottom: '8px' }}>Uw Excel moet minimaal bevatten:</strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>• Datum van de transactie</span>
                    <span>• Omschrijving (wat was het voor?)</span>
                    <span>• Bedrag (inkomst of uitgave)</span>
                    <span>• Saldo na transactie (optioneel maar handig)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 }}>2</div>
              <div>
                <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>Voeg bankafschriften toe</h3>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6 }}>Download uw bankafschriften als PDF of CSV vanuit uw bankieren-app (ING, Rabobank, ABN AMRO). Dit helpt ons om te controleren of uw kasboek klopt met wat er daadwerkelijk is betaald.</p>
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    'ING: Mijn ING → Betaalrekening → Afschriften → Download CSV of PDF',
                    'Rabobank: Rabo App → Rekening → Exporteren → MT940 of CSV',
                    'ABN AMRO: Internetbankieren → Exporteren → Excel of CSV',
                  ].map((stap, i) => (
                    <div key={i} style={{ fontSize: '0.83rem', color: '#475569', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px' }}>
                      {stap}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 }}>3</div>
              <div>
                <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>Voeg een begroting toe (indien beschikbaar)</h3>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6 }}>Als uw vereniging een begroting heeft gemaakt, voeg die dan ook toe. Dit geeft de kascommissie inzicht in waar afwijkingen zijn. Een simpel Excel-bestand met inkomsten en uitgaven per post is voldoende.</p>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '36px', height: '36px', background: '#2563EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 }}>4</div>
              <div>
                <h3 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>Benoem uw bestanden duidelijk</h3>
                <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '10px' }}>Geef uw bestanden een duidelijke naam zodat we ze snel kunnen herkennen.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {[
                    'Kasboek_2024.xlsx',
                    'Bankafschriften_2024.pdf',
                    'Begroting_2024.xlsx',
                  ].map((naam, i) => (
                    <div key={i} style={{ background: '#f1f5f9', borderRadius: '6px', padding: '6px 12px', fontSize: '0.83rem', color: '#0f172a', fontFamily: 'monospace' }}>
                      {naam}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

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
        {/* Tip */}
        <div style={{ background: '#fefce8', borderRadius: '12px', padding: '20px', margin: '32px 0', border: '1px solid #fde68a' }}>
          <p style={{ fontSize: '0.88rem', color: '#78350f', margin: 0, lineHeight: 1.6 }}>
            <strong>💡 Tip:</strong> Hoe meer bestanden u aanlevert, hoe completer het rapport wordt. U kunt altijd meerdere bestanden tegelijk uploaden. Upload gerust ook facturen van grote uitgaven (&gt;€500) als extra bewijs.
          </p>
        </div>

        {/* CTA */}
        <div style={{ background: '#1e3a8a', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: '700', marginBottom: '10px' }}>Klaar met verzamelen?</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: '24px' }}>Upload uw bestanden in uw Slimme Kascontrole omgeving en genereer uw rapport.</p>
          <a href="/mijn-omgeving" style={{ background: '#2563EB', color: 'white', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>Ga naar mijn omgeving →</a>
        </div>

      </div>

      <footer style={{ background: '#0f172a', color: 'rgba(255,255,255,0.5)', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '0.83rem', marginTop: '64px' }}>
        <span>© 2026 Slimme Kascontrole — Een dienst van Vertras B.V.</span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <a href="/#handleidingen" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</a>
          <a href="/bronnen/twinq" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Twinq</a>
          <a href="/bronnen/isabel-yuki" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Isabel / Yuki</a>
        </div>
      </footer>
    </main>
  )
}
