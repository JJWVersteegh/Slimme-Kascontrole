import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Privacyverklaring | Slimme Kascontrole',
  description: 'Lees hoe Slimme Kascontrole omgaat met uw persoonsgegevens. AVG-conform, veilig en transparant.',
  alternates: { canonical: '/privacyverklaring' },
}

export default function Privacyverklaring() {
  return (
    <>
    <main style={{ minHeight: '100vh', paddingTop: '72px', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
      <Navbar links={[{ href: '/', label: '← Terug naar home' }]} />
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '64px 24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Privacyverklaring</h1>
        <p style={{ color: '#475569', marginBottom: '40px', fontSize: '0.9rem' }}>Slimme Kascontrole · Vertras B.V. · Versie 1.0 · Mei 2025</p>
        {[
          {
            t: '1. Wie zijn wij',
            c: 'Slimme Kascontrole is een dienst van Vertras B.V., gevestigd te Bergschenhoek, Nederland. Wij zijn verantwoordelijk voor de verwerking van uw persoonsgegevens zoals beschreven in deze privacyverklaring. Vragen? Neem contact op via info@slimmekascontrole.nl.'
          },
          {
            t: '2. Welke gegevens verwerken wij',
            c: 'Wij verwerken de volgende persoonsgegevens: naam en contactgegevens (e-mailadres, telefoonnummer, adres), gegevens van uw vereniging of VvE (naam, KvK-nummer, adres), financiële bestanden die u uploadt (bankafschriften, jaarrekeningen, kasboeken), en betalingsgegevens (verwerkt via Stripe, wij slaan geen betaalgegevens op).'
          },
          {
            t: '3. Waarom verwerken wij uw gegevens',
            c: 'Wij verwerken uw gegevens uitsluitend voor het opstellen van uw kascontrolerapport, het beheren van uw account, het verwerken van uw betaling, en het beantwoorden van uw vragen en verzoeken. Wij gebruiken uw gegevens niet voor marketingdoeleinden zonder uw toestemming.'
          },
          {
            t: '4. Hoe lang bewaren wij uw gegevens',
            c: 'Uw account en geüploade bestanden worden bewaard zolang uw account actief is. U kunt uw bestanden op elk moment zelf verwijderen via uw omgeving. Na verwijdering zijn de bestanden definitief gewist. Financiële administratie bewaren wij 7 jaar conform de wettelijke bewaarplicht.'
          },
          {
            t: '5. Beveiliging',
            c: 'Alle gegevens worden versleuteld opgeslagen op beveiligde servers binnen de Europese Unie (Supabase, gehost in de EU). Alle verbindingen zijn beveiligd met SSL/TLS-encryptie. Toegang tot uw gegevens is beperkt tot bevoegde medewerkers.'
          },
          {
            t: '6. Delen met derden',
            c: 'Wij delen uw persoonsgegevens nooit met derden voor commerciële doeleinden. Wij maken gebruik van de volgende verwerkers: Supabase (opslag van gegevens, EU), Stripe (betalingsverwerking), Anthropic (AI-verwerking van uw financiële bestanden voor het rapport). Met alle verwerkers hebben wij verwerkersovereenkomsten gesloten.'
          },
          {
            t: '7. Uw rechten',
            c: 'Op grond van de AVG heeft u het recht op inzage in uw persoonsgegevens, correctie van onjuiste gegevens, verwijdering van uw gegevens ("recht op vergetelheid"), beperking van de verwerking, en overdraagbaarheid van gegevens. Om gebruik te maken van uw rechten kunt u contact opnemen via info@slimmekascontrole.nl. Wij reageren binnen 30 dagen.'
          },
          {
            t: '8. Cookies',
            c: 'Slimme Kascontrole maakt gebruik van functionele cookies die noodzakelijk zijn voor het functioneren van de website (inlogstatus). Wij plaatsen geen tracking- of advertentiecookies zonder uw toestemming.'
          },
          {
            t: '9. Klachten',
            c: 'Als u een klacht heeft over de verwerking van uw persoonsgegevens, kunt u contact opnemen via info@slimmekascontrole.nl. U heeft ook het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens (autoriteitpersoonsgegevens.nl).'
          },
          {
            t: '10. Wijzigingen',
            c: 'Wij behouden ons het recht voor deze privacyverklaring te wijzigen. De meest actuele versie is altijd te vinden op deze pagina. Bij ingrijpende wijzigingen informeren wij u per e-mail.'
          },
        ].map((item, i) => (
          <div key={i} style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>{item.t}</h2>
            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.7 }}>{item.c}</p>
          </div>
        ))}
        <div style={{ marginTop: '40px', padding: '20px', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
          <p style={{ fontSize: '0.88rem', color: '#1e3a8a', lineHeight: 1.7 }}>
            <strong>Contact:</strong> Vertras B.V. · Bergschenhoek, Nederland<br />
            E-mail: <a href="mailto:info@slimmekascontrole.nl" style={{ color: '#2563EB' }}>info@slimmekascontrole.nl</a> · Tel: <a href="tel:0624235829" style={{ color: '#2563EB' }}>06-24235829</a>
          </p>
        </div>
      </div>
    </main>
    <Footer />
    </>
  )
}
