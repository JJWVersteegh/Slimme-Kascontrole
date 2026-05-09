import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voorbeeldrapport kascontrole VvE | Slimme Kascontrole',
  description:
    'Bekijk een fictief voorbeeld van een professioneel kascontrolerapport voor een VvE. Zo ziet u exact wat u ontvangt.',
}

export default function VoorbeeldRapportPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: 'Outfit, sans-serif',
      }}
    >
      {/* Nav exact zoals de handleidingenpagina */}
      <nav
        style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 48px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              background: '#2563EB',
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
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

          <div style={{ lineHeight: 1.1 }}>
            <div
              style={{
                fontWeight: '700',
                fontSize: '1.05rem',
                color: '#1D4ED8',
              }}
            >
              slimme
            </div>
            <div
              style={{
                fontWeight: '500',
                fontSize: '1.05rem',
                color: '#3b82f6',
              }}
            >
              kascontrole
            </div>
          </div>
        </a>

        <a
          href="/"
          style={{
            color: '#475569',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          ← Terug
        </a>
      </nav>

      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '64px 24px 72px' }}>
        <section
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '18px',
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(15,23,42,0.06)',
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
          }}
        >
          <div style={{ padding: '52px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#eff6ff',
                color: '#2563EB',
                border: '1px solid #bfdbfe',
                borderRadius: '999px',
                padding: '7px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                marginBottom: '22px',
              }}
            >
              Voorbeeldrapport
            </div>

            <h1
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2rem, 4vw, 3.3rem)',
                lineHeight: 1.08,
                color: '#0f2460',
                letterSpacing: '-0.03em',
                marginBottom: '18px',
              }}
            >
              Bekijk wat u straks{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#2563EB' }}>
                echt ontvangt.
              </em>
            </h1>

            <p
              style={{
                fontSize: '1.02rem',
                color: '#475569',
                lineHeight: 1.8,
                maxWidth: '560px',
                marginBottom: '32px',
              }}
            >
              Bekijk een fictief maar realistisch voorbeeld van een kascontrolerapport van
              Slimme Kascontrole. De opbouw, analyses en stijl zijn gelijk aan het rapport
              dat u na upload ontvangt.
            </p>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href="/voorbeeldrapport-slimme-kascontrole.pdf"
                target="_blank"
                style={{
                  background: '#2563EB',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(37,99,235,0.32)',
                  textDecoration: 'none',
                }}
              >
                Download voorbeeldrapport
              </a>
            </div>
          </div>

          <div
            style={{
              background: '#1e3a8a',
              color: 'white',
              padding: '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '360px',
                background: 'white',
                borderRadius: '14px',
                color: '#0f172a',
                boxShadow: '0 24px 70px rgba(0,0,0,0.22)',
                padding: '26px',
              }}
            >
              <div
                style={{
                  height: '16px',
                  background: '#1e3a8a',
                  borderRadius: '5px',
                  marginBottom: '18px',
                }}
              />
              <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '5px' }}>
                Kascommissie rapport
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '18px' }}>
                VvE Parkzicht Residence · Boekjaar 2025
              </div>

              {[100, 100, 70].map((w, i) => (
                <div
                  key={i}
                  style={{
                    width: `${w}%`,
                    height: '10px',
                    background: '#e2e8f0',
                    borderRadius: '6px',
                    marginBottom: '9px',
                  }}
                />
              ))}

              <div
                style={{
                  marginTop: '18px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                {[0, 1, 2].map((row) => (
                  <div key={row} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                    {[0, 1, 2].map((cell) => (
                      <div
                        key={cell}
                        style={{
                          height: '28px',
                          borderRight: cell < 2 ? '1px solid #e2e8f0' : undefined,
                          borderBottom: row < 2 ? '1px solid #e2e8f0' : undefined,
                          background: '#f8fafc',
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <span
                style={{
                  display: 'inline-block',
                  marginTop: '18px',
                  background: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fde68a',
                  borderRadius: '999px',
                  padding: '6px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                }}
              >
                DEMO RAPPORT
              </span>
            </div>
          </div>
        </section>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginTop: '28px',
          }}
        >
          <section
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 8px 30px rgba(15,23,42,0.04)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '16px' }}>
              Wat ontvangt u?
            </h2>

            {[
              'Analyse van inkomsten en uitgaven',
              'Controle van banksaldi en transacties',
              'Analyse van openstaande posten',
              'Inzichtelijke tabellen en bevindingen',
              'Advies voor de Algemene Ledenvergadering',
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  gap: '10px',
                  color: '#475569',
                  fontSize: '0.93rem',
                  lineHeight: 1.55,
                  marginBottom: '12px',
                }}
              >
                <span style={{ color: '#2563EB', fontWeight: 800 }}>✓</span>
                <span>{item}</span>
              </div>
            ))}

            <div
              style={{
                marginTop: '20px',
                background: '#eff6ff',
                borderLeft: '4px solid #2563EB',
                borderRadius: '0 10px 10px 0',
                padding: '16px 18px',
                color: '#1e3a8a',
                fontSize: '0.88rem',
                lineHeight: 1.65,
              }}
            >
              Dit voorbeeldrapport bevat uitsluitend fictieve gegevens. Het is bedoeld om te
              laten zien wat u qua structuur en inhoud kunt verwachten.
            </div>
          </section>

          <section
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 8px 30px rgba(15,23,42,0.04)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100%',
            }}
          >
            <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>📄</div>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '16px' }}>
              Voorbeeldrapport PDF
            </h2>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#64748b',
                lineHeight: 1.7,
                marginBottom: '14px',
                maxWidth: '360px',
              }}
            >
              Open of download het volledige voorbeeldrapport en bekijk hoe de bevindingen,
              tabellen en adviezen worden gepresenteerd.
            </p>
            <div
              style={{
                marginTop: '4px',
                color: '#64748b',
                fontSize: '0.92rem',
                lineHeight: 1.7,
                maxWidth: '360px',
              }}
            >
              Volledig fictief voorbeeldrapport in PDF-formaat, bedoeld om exact te laten
              zien hoe uw uiteindelijke kascontrolerapport eruitziet.
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
