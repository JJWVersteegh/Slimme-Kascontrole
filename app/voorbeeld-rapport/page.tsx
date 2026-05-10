import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voorbeeldrapport kascontrole VvE | Slimme Kascontrole',
  description:
    'Bekijk een fictief voorbeeld van een professioneel kascontrolerapport voor een VvE. Zo ziet u exact wat u ontvangt.',
}

export default function VoorbeeldRapportPage() {
  return (
    <main className="voorbeeld-page">

      <style>{`
        .voorbeeld-page {
          min-height: 100vh;
          background: #f8fafc;
          font-family: Outfit, sans-serif;
          color: #0f172a;
        }

        .voorbeeld-nav {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 48px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .voorbeeld-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }

        .voorbeeld-logo-icon {
          background: #2563EB;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .voorbeeld-logo-text {
          line-height: 1.1;
        }

        .voorbeeld-logo-text div:first-child {
          font-weight: 700;
          font-size: 1.05rem;
          color: #1D4ED8;
        }

        .voorbeeld-logo-text div:last-child {
          font-weight: 500;
          font-size: 1.05rem;
          color: #3b82f6;
        }

        .terug-link {
          color: #475569;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }

        .container {
          max-width: 860px;
          margin: 0 auto;
          padding: 64px 24px;
        }

        .label {
          display: inline-flex;
          align-items: center;
          background: #eff6ff;
          color: #2563EB;
          border: 1px solid #bfdbfe;
          border-radius: 999px;
          padding: 7px 14px;
          font-size: 0.78rem;
          font-weight: 700;
          margin-bottom: 18px;
        }

        h1 {
          font-family: Outfit, sans-serif;
          font-size: 2.2rem;
          line-height: 1.15;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 12px;
          letter-spacing: -0.02em;
        }

        .intro {
          color: #475569;
          font-size: 1rem;
          line-height: 1.7;
          margin: 0 0 40px;
          max-width: 680px;
        }

        .download-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 30px;
          margin-bottom: 28px;
          box-shadow: 0 8px 30px rgba(15,23,42,0.04);
        }

        .download-card-inner {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
        }

        .download-card h2 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px;
        }

        .download-card p {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.7;
          margin: 0;
        }

        .btn-primary {
          background: #2563EB;
          color: white;
          padding: 14px 24px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(37,99,235,0.22);
        }

        .info-card {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 32px;
        }

        .info-card h2 {
          font-weight: 700;
          color: #1e3a8a;
          font-size: 1rem;
          margin: 0 0 16px;
        }

        .checks {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px 18px;
        }

        .check {
          font-size: 0.9rem;
          color: #1e3a8a;
          font-weight: 500;
          line-height: 1.5;
        }

        .section-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 24px;
          box-shadow: 0 8px 30px rgba(15,23,42,0.04);
        }

        .section-card h2 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 10px;
        }

        .section-card p {
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.7;
          margin: 0;
        }

        .demo-note {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #9a3412;
          border-radius: 16px;
          padding: 22px;
          font-size: 0.9rem;
          line-height: 1.7;
          margin-top: 32px;
        }

        @media (max-width: 700px) {
          .voorbeeld-nav {
            padding: 0 20px;
            height: 72px;
          }

          .voorbeeld-logo-icon {
            width: 36px;
            height: 36px;
          }

          .voorbeeld-logo-text div:first-child,
          .voorbeeld-logo-text div:last-child {
            font-size: 1rem;
          }

          .container {
            padding: 36px 18px 56px;
          }

          h1 {
            font-size: 1.75rem;
          }

          .intro {
            font-size: 0.95rem;
            margin-bottom: 28px;
          }

          .download-card,
          .info-card,
          .section-card {
            padding: 22px;
            border-radius: 14px;
          }

          .download-card-inner {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .btn-primary {
            display: block;
            text-align: center;
            width: 100%;
          }

          .checks {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <nav className="voorbeeld-nav">
        <a href="/#handleidingen" className="voorbeeld-logo">
          <div className="voorbeeld-logo-icon">
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
              <polyline
                points="3,12 9,18 19,6"
                stroke="white"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="voorbeeld-logo-text">
            <div>slimme</div>
            <div>kascontrole</div>
          </div>
        </a>

        <a href="/" className="terug-link">← Terug</a>
      </nav>

      <div className="container">
        <div className="label">Voorbeeldrapport</div>

        <h1>Bekijk een voorbeeld van een kascontrolerapport</h1>

        <p className="intro">
          Bekijk een fictief maar realistisch voorbeeld van een kascontrolerapport van
          Slimme Kascontrole. De opbouw, analyses en stijl zijn gelijk aan het rapport
          dat u na upload ontvangt.
        </p>

        <section className="download-card">
          <div className="download-card-inner">
            <div>
              <h2>📄 Voorbeeldrapport PDF</h2>
              <p>
                Download het volledige voorbeeldrapport en bekijk hoe bevindingen,
                tabellen en adviezen worden gepresenteerd.
              </p>
            </div>

            <a
              href="/voorbeeldrapport-slimme-kascontrole.pdf"
              target="_blank"
              className="btn-primary"
            >
              Download voorbeeldrapport
            </a>
          </div>
        </section>

        <section className="info-card">
          <h2>✅ Wat ziet u in het voorbeeldrapport?</h2>

          <div className="checks">
            <div className="check">✓ Analyse van inkomsten en uitgaven</div>
            <div className="check">✓ Controle van banksaldi en transacties</div>
            <div className="check">✓ Analyse van openstaande posten</div>
            <div className="check">✓ Inzichtelijke tabellen en bevindingen</div>
            <div className="check">✓ Risico-indeling per aandachtspunt</div>
            <div className="check">✓ Advies voor de Algemene Ledenvergadering</div>
          </div>
        </section>

        <section className="section-card">
          <h2>Zelfde structuur als het echte rapport</h2>
          <p>
            Het voorbeeldrapport is bewust niet mooier gemaakt dan het echte rapport.
            Zo ziet u vooraf duidelijk wat u als VvE kunt verwachten na het uploaden van
            de financiële bestanden.
          </p>
        </section>

        <section className="section-card">
          <h2>Fictieve gegevens, realistische inhoud</h2>
          <p>
            Alle namen, bedragen, leveranciers en openstaande posten in het voorbeeld zijn
            fictief. De controle-opzet, onderdelen en toelichting zijn representatief voor
            het uiteindelijke kascontrolerapport.
          </p>
        </section>

        <div className="demo-note">
          <strong>Let op:</strong> dit voorbeeldrapport is uitsluitend bedoeld als demonstratie.
          Het bevat geen echte VvE-gegevens en kan niet worden gebruikt als formeel
          kascontrolerapport.
        </div>
      </div>
    </main>
  )
}
