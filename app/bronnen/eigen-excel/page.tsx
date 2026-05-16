import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Eigen Excel kasboek gebruiken | Slimme Kascontrole',
  description: 'Gebruik uw eigen Excel-kasboek voor uw kascontrolerapport. Download de template en upload uw bestanden.',
  alternates: { canonical: '/bronnen/eigen-excel' },
}

export default function EigenExcelBron() {
  return (
    <main style={{ minHeight: '100vh', paddingTop: '72px', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
      <style>{`
        .site-nav { box-sizing: border-box; width: 100%; }
        @media (max-width: 900px) {
          .site-nav { padding: 0 20px !important; }
        }
        @media (max-width: 500px) {
          .site-nav { padding: 0 16px !important; }
        }
      `}</style>

      {/* Nav */}
      <Navbar links={[{ href: '/', label: '← Terug naar home' }]} />

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

      <Footer />
    </main>
  )
}
