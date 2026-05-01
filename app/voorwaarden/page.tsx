export default function Voorwaarden() {
  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
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
        <a href="/" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.9rem' }}>← Terug</a>
      </nav>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Algemene Voorwaarden</h1>
        <p style={{ color: '#475569', marginBottom: '40px', fontSize: '0.9rem' }}>Slimme Kascontrole · Vertras B.V. · Versie 1.0 · Mei 2025</p>
        {[
          { t: '1. Algemeen', c: 'Slimme Kascontrole is een dienst van Vertras B.V., gevestigd te Bergschenhoek, Nederland. Door gebruik te maken van onze dienst gaat u akkoord met deze voorwaarden.' },
          { t: '2. De dienst', c: 'Slimme Kascontrole biedt een platform voor het opstellen van kascontrolerapporten voor verenigingen, VvE\'s en stichtingen. U uploadt financiële bestanden, waarna wij een volledig kascontrolerapport opstellen.' },
          { t: '3. Tarief', c: 'De dienst wordt aangeboden voor een eenmalig tarief van €59 incl. btw per kascontrole. Dit is geen abonnement. U betaalt per kascontrole, niet per jaar of per maand.' },
          { t: '4. Privacy en gegevens', c: 'Uw financiële gegevens worden vertrouwelijk behandeld en nooit gedeeld met derden. Alle gegevens worden opgeslagen op beveiligde servers binnen de Europese Unie. Wij voldoen aan de AVG (GDPR).' },
          { t: '5. Beveiliging', c: 'Alle verbindingen zijn beveiligd met SSL-encryptie. Uw gegevens zijn beschermd met industrie-standaard beveiligingsmaatregelen.' },
          { t: '6. Aansprakelijkheid', c: 'Het kascontrolerapport is informatief van aard en opgesteld op basis van de door u aangeleverde documenten. Vertras B.V. is niet aansprakelijk voor beslissingen die worden genomen op basis van het rapport.' },
          { t: '7. Klachten', c: 'Bij klachten kunt u contact opnemen via info@slimmekascontrole.nl of 06-24235829. Wij streven ernaar klachten binnen 5 werkdagen te behandelen.' },
          { t: '8. Toepasselijk recht', c: 'Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Rotterdam.' },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>{item.t}</h2>
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
  )
}
