import Navbar from '@/components/Navbar'
export default function VoorbeeldRapportPage() {
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
      `}</style>

      {/* Nav - zelfde stijl als Twinq pagina */}
      <Navbar links={[{ href: '/', label: '← Terug naar home' }]} />

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '64px 24px' }}>

        {/* Header */}
        <div style={{ display: 'inline-flex', alignItems: 'center', background: '#eff6ff', color: '#2563EB', border: '1px solid #bfdbfe', borderRadius: '999px', padding: '7px 14px', fontSize: '0.78rem', fontWeight: '700', marginBottom: '18px' }}>
          Voorbeeldrapport
        </div>

        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '12px', lineHeight: 1.15 }}>
          Bekijk een voorbeeld van een kascontrolerapport
        </h1>

        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.7, marginBottom: '48px', maxWidth: '640px' }}>
          Bekijk een fictief maar realistisch voorbeeld van een kascontrolerapport van Slimme Kascontrole. De opbouw, analyses en stijl zijn gelijk aan het rapport dat u na upload ontvangt.
        </p>

        {/* Download */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '28px', marginBottom: '40px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(15,23,42,0.04)' }}>
          <h2 style={{ fontWeight: '700', color: '#0f172a', fontSize: '1.15rem', marginBottom: '10px' }}>📄 Voorbeeldrapport PDF</h2>

          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '22px' }}>
            Download het volledige voorbeeldrapport en bekijk hoe bevindingen, tabellen en adviezen worden gepresenteerd.
          </p>

          <a
            href="/voorbeeldrapport-slimme-kascontrole.pdf"
            target="_blank"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#2563EB', color: 'white', padding: '13px 22px', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '700', textDecoration: 'none' }}
          >
            Download voorbeeldrapport
          </a>
        </div>

        {/* Wat ziet u */}
        <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '28px', marginBottom: '40px', border: '1px solid #bfdbfe' }}>
          <h2 style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '1rem', marginBottom: '16px' }}>✅ Wat ziet u in het voorbeeldrapport?</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              '✓ Analyse van inkomsten en uitgaven',
              '✓ Controle van banksaldi en transacties',
              '✓ Analyse van openstaande posten',
              '✓ Inzichtelijke tabellen en bevindingen',
              '✓ Risico-indeling per aandachtspunt',
              '✓ Advies voor de Algemene Ledenvergadering',
            ].map((item, i) => (
              <div key={i} style={{ fontSize: '0.88rem', color: '#1e3a8a', fontWeight: '500', lineHeight: 1.55 }}>{item}</div>
            ))}
          </div>
        </div>

        {/* Informatieblokken */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
              Zelfde structuur als het echte rapport
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Het voorbeeldrapport is bewust niet mooier gemaakt dan het echte rapport. Zo ziet u vooraf duidelijk wat u als VvE kunt verwachten na het uploaden van de financiële bestanden.
            </p>
          </div>

          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '10px' }}>
              Fictieve gegevens, realistische inhoud
            </h2>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7 }}>
              Alle namen, bedragen, leveranciers en openstaande posten in het voorbeeld zijn fictief. De controle-opzet, onderdelen en toelichting zijn representatief voor het uiteindelijke kascontrolerapport.
            </p>
          </div>

          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '16px', padding: '24px' }}>
            <p style={{ color: '#9a3412', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
              <strong>Let op:</strong> dit voorbeeldrapport is uitsluitend bedoeld als demonstratie. Het bevat geen echte VvE-gegevens en kan niet worden gebruikt als formeel kascontrolerapport.
            </p>
          </div>

        </div>
      </div>
    </main>
  )
}
