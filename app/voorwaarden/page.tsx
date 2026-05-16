import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden | Slimme Kascontrole',
  description: 'Lees de algemene voorwaarden van Slimme Kascontrole, een dienst van Vertras B.V.',
  alternates: { canonical: '/voorwaarden' },
}

export default function Voorwaarden() {
  return (
    <>
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
      <Navbar links={[{ href: '/', label: '← Terug naar home' }]} />
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Algemene Voorwaarden</h1>
        <p style={{ color: '#475569', marginBottom: '40px', fontSize: '0.9rem' }}>Slimme Kascontrole · Vertras B.V. · Versie 1.0 · Mei 2025</p>
        {[
          { t: '1. Algemeen', c: 'Slimme Kascontrole is een dienst van Vertras B.V., gevestigd te Bergschenhoek, Nederland. Door gebruik te maken van onze dienst gaat u akkoord met deze voorwaarden.' },
          { t: '2. De dienst', c: 'Slimme Kascontrole biedt een platform voor het opstellen van kascontrolerapporten voor verenigingen, VvE\'s en stichtingen. U uploadt financiële bestanden, waarna wij een volledig kascontrolerapport opstellen.' },
          { t: '3. Tarief', c: 'De dienst wordt aangeboden voor een eenmalig tarief van €59 incl. btw per kascontrole. Dit is geen abonnement. U betaalt per kascontrole, niet per jaar of per maand.' },
          { t: '4. Privacy en gegevens', c: 'Uw financiële gegevens worden vertrouwelijk behandeld en nooit gedeeld met derden. Alle gegevens worden opgeslagen op beveiligde servers binnen de Europese Unie. Wij voldoen aan de AVG (GDPR).' },
          { t: '5. Beveiliging', c: 'Alle verbindingen zijn beveiligd met SSL-encryptie. Uw gegevens zijn beschermd met industrie-standaard beveiligingsmaatregelen.' },
          { t: '6. Aansprakelijkheid en disclaimer', c: 'Het kascontrolerapport is informatief van aard en wordt opgesteld op basis van de door u aangeleverde documenten. Slimme Kascontrole is een hulpmiddel voor de kascommissie — geen vervanging van de eigen controle. Wij adviseren de kascontroleur om het rapport te gebruiken als ondersteuning bij zijn of haar eigen werkzaamheden en de bevindingen zelf te verifiëren. Vertras B.V. is niet aansprakelijk voor eventuele fouten, onvolledigheden of beslissingen die worden genomen op basis van het rapport. De verantwoordelijkheid voor de kascontrole blijft te allen tijde bij de kascommissie.' },
          { t: '7. Klachten', c: 'Bij klachten kunt u contact opnemen via info@slimmekascontrole.nl of 06-24235829. Wij streven ernaar klachten binnen 5 werkdagen te behandelen.' },
          { t: '8. Toepasselijk recht', c: 'Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Rotterdam.' },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>{item.t}</h2>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.7 }}>{item.c}</p>
          </div>
        ))}
        <div style={{ marginTop: '40px', padding: '20px', background: '#eff6ff', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
          <p style={{ fontSize: '0.88rem', color: '#1e3a8a' }}>
            <strong>Contact:</strong> Vertras B.V. · info@slimmekascontrole.nl · 06-24235829 · Bergschenhoek, Nederland
          </p>
        </div>
      </div>
    </main>
    <Footer />
    </>
  )
}
