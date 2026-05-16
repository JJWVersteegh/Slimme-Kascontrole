import type { Metadata } from 'next'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Kascontrole Stichting – Professioneel rapport voor uw stichting | €59',
  description: 'Kascontrole voor uw stichting. Volledig gecontroleerd rapport in minuten. Eenmalig €59 incl. btw — geen abonnement. Klaar voor de bestuursvergadering.',
  alternates: { canonical: '/stichting-kascontrole' },
  openGraph: { title: 'Kascontrole Stichting – Professioneel rapport voor uw stichting | €59', description: 'Kascontrole voor uw stichting. Volledig gecontroleerd rapport in minuten. Eenmalig €59 incl. btw.', url: 'https://www.slimmekascontrole.nl/stichting-kascontrole', images: [{ url: '/og-image.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: 'Kascontrole Stichting – Professioneel rapport voor uw stichting | €59', images: ['/og-image.jpg'] },
}

export default function StichtingKascontrole() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Footer />
    </>
  )
}

const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:'Outfit',sans-serif;color:#0f172a;background:white;overflow-x:hidden}
nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.97);backdrop-filter:blur(12px);border-bottom:1px solid #e2e8f0;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 48px}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.nav-logo-icon{background:#2563EB;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center}
.nav-links{display:flex;gap:28px;list-style:none;align-items:center}
.nav-links a{font-size:0.88rem;font-weight:500;color:#475569;text-decoration:none}
.nav-links a:hover{color:#2563EB}
.btn-nav{background:#2563EB;color:white!important;padding:9px 20px;border-radius:6px;font-weight:600}
.hamburger{display:none;background:none;border:1.5px solid #e2e8f0;border-radius:6px;cursor:pointer;padding:7px;flex-direction:column;gap:4px}
.ham-bar{display:block;width:20px;height:2px;background:#0f172a;border-radius:2px}
.mobile-menu{display:none;position:fixed;top:72px;left:0;right:0;background:white;border-bottom:1px solid #e2e8f0;z-index:199;padding:12px 20px 20px}
.mobile-menu a{display:block;padding:12px 16px;color:#0f172a;text-decoration:none;font-weight:500;border-radius:8px;font-size:0.95rem}
.mobile-menu .mobile-btn{background:#2563EB;color:white!important;text-align:center;margin-top:8px;font-weight:700}
.hero{background:#0f2460;padding:140px 48px 88px;min-height:60vh;display:flex;align-items:center}
.hero-content{max-width:700px}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(37,99,235,0.35);border:1px solid rgba(147,197,253,0.5);color:#bfdbfe;font-size:0.72rem;font-weight:700;padding:5px 13px;border-radius:20px;margin-bottom:24px;letter-spacing:0.05em;text-transform:uppercase}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:700;line-height:1.15;color:white;margin-bottom:20px}
.hero h1 em{font-style:italic;color:#93c5fd}
.hero-sub{font-size:1rem;color:rgba(255,255,255,0.85);line-height:1.7;margin-bottom:32px;max-width:560px}
.btn-primary{background:#2563EB;color:white;padding:14px 30px;border-radius:8px;font-size:0.95rem;font-weight:700;text-decoration:none;display:inline-block;margin-right:16px}
.btn-ghost{color:rgba(255,255,255,0.8);font-size:0.9rem;font-weight:500;text-decoration:none}
section{padding:88px 48px}
.section-label{font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#2563EB;margin-bottom:12px}
h2{font-family:'Playfair Display',serif;font-size:clamp(1.7rem,3vw,2.4rem);font-weight:700;color:#0f172a;line-height:1.15;margin-bottom:16px}
h2 em{font-style:italic;color:#2563EB}
.section-sub{font-size:0.97rem;color:#475569;line-height:1.7;max-width:580px;margin-bottom:48px}
.container{max-width:1100px;margin:0 auto}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.callout{background:#eff6ff;border-left:4px solid #2563EB;border-radius:0 10px 10px 0;padding:18px 22px;margin:20px 0;font-size:0.88rem;color:#1e3a8a;line-height:1.7}
.text-body p{font-size:0.93rem;color:#475569;line-height:1.8;margin-bottom:16px}
.features-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1100px;margin:0 auto}
.feature{background:#f8fafc;border-radius:12px;padding:24px;border:1px solid #e2e8f0}
.feature-icon{font-size:1.8rem;margin-bottom:12px}
.feature h3{font-size:0.95rem;font-weight:700;color:#0f172a;margin-bottom:6px}
.feature p{font-size:0.83rem;color:#475569;line-height:1.6}
.faq-list{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:12px}
.faq-item{background:white;border-radius:12px;border:1px solid #e2e8f0;padding:20px 24px}
.faq-item h3{font-size:0.92rem;font-weight:700;color:#0f172a;margin-bottom:8px}
.faq-item p{font-size:0.85rem;color:#475569;line-height:1.6}
.cta-section{background:#0f2460;padding:88px 48px;text-align:center}
.breadcrumb{font-size:0.82rem;color:rgba(255,255,255,0.6);margin-bottom:16px}
.breadcrumb a{color:rgba(255,255,255,0.6);text-decoration:none}
footer{background:#0f172a;color:rgba(255,255,255,0.6);padding:48px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px}
footer a{color:rgba(255,255,255,0.6);text-decoration:none;font-size:0.85rem}
.footer-links{display:flex;gap:24px;flex-wrap:wrap}
@media(max-width:768px){
  nav{padding:0 20px}
  .nav-links{display:none}
  .hamburger{display:flex}
  .hero{padding:120px 20px 60px}
  section{padding:60px 20px}
  .two-col,.features-grid{grid-template-columns:1fr}
  footer{flex-direction:column;text-align:center;padding:32px 20px}
  .footer-links{justify-content:center}
}
</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo">
    <div class="nav-logo-icon">
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div style="line-height:1.1">
      <div style="font-weight:700;font-size:1rem;color:#2563EB">slimme</div>
      <div style="font-weight:500;font-size:1rem;color:#3b82f6">kascontrole</div>
    </div>
  </a>
  <ul class="nav-links">
    <li><a href="/#hoe-het-werkt">Hoe het werkt</a></li>
    <li><a href="/#waarom">Waarom</a></li>
    <li><a href="/#tarieven">Tarieven</a></li>
    <li><a href="/mijn-omgeving">Mijn omgeving</a></li>
    <li><a href="/registreer" class="btn-nav">Account aanmaken</a></li>
  </ul>
  <button class="hamburger" onclick="document.getElementById('mob').style.display=document.getElementById('mob').style.display==='block'?'none':'block'">
    <span class="ham-bar"></span><span class="ham-bar"></span><span class="ham-bar"></span>
  </button>
</nav>
<div class="mobile-menu" id="mob">
  <a href="/#hoe-het-werkt">Hoe het werkt</a>
  <a href="/#waarom">Waarom kascontrole?</a>
  <a href="/#tarieven">Tarieven</a>
  <a href="/mijn-omgeving">Mijn omgeving</a>
  <a href="/registreer" class="mobile-btn">Account aanmaken</a>
</div>

<section class="hero">
  <div class="hero-content">
    <div class="breadcrumb"><a href="/">Home</a> › Kascontrole Stichting</div>
    <div class="hero-eyebrow">🏛️ Voor stichtingen in Nederland</div>
    <h1>Kascontrole voor uw stichting — <em>professioneel rapport</em> voor €59</h1>
    <p class="hero-sub">Uw stichting is verplicht financiële verantwoording af te leggen. Met Slimme Kascontrole uploadt u de financiële stukken en ontvangt u direct een volledig gecontroleerd kascontrolerapport. Eenmalig €59 incl. btw — geen abonnement.</p>
    <a href="/registreer" class="btn-primary">Gratis account aanmaken</a>
    <a href="#hoe-het-werkt" class="btn-ghost">Bekijk hoe het werkt →</a>
  </div>
</section>

<section>
  <div class="container two-col">
    <div class="text-body">
      <p class="section-label">Waarom kascontrole voor stichtingen?</p>
      <h2>Financiële transparantie is <em>cruciaal</em> voor uw stichting</h2>
      <p>Stichtingen hebben een bijzondere verantwoordingsplicht. Donateurs, subsidieverstrekkers en andere stakeholders willen zekerheid dat gelden correct worden besteed. Een professioneel kascontrolerapport geeft die zekerheid.</p>
      <p>Bovendien zijn veel stichtingen verplicht jaarlijks financiële verantwoording af te leggen — aan het bestuur, aan de Kamer van Koophandel of aan subsidieverstrekkers. Slimme Kascontrole helpt u daarbij.</p>
      <div class="callout">
        <strong>Subsidies en fondsen:</strong> Veel subsidieverstrekkers en fondsen eisen een onafhankelijke kascontrole als voorwaarde voor uitkering. Een professioneel rapport van Slimme Kascontrole voldoet aan deze eis en versterkt uw positie bij aanvragen.
      </div>
      <p>Of u nu een buurtfonds, culturele stichting, zorginstelling of een andere stichting heeft — Slimme Kascontrole werkt voor elke Nederlandse stichting.</p>
    </div>
    <div>
      <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80" alt="Kascontrole stichting" style="border-radius:16px;width:100%;height:400px;object-fit:cover;box-shadow:0 16px 48px rgba(0,0,0,0.1)"/>
    </div>
  </div>
</section>

<section id="hoe-het-werkt" style="background:#f8fafc">
  <div class="container" style="text-align:center">
    <p class="section-label">Hoe het werkt</p>
    <h2>Kascontrole stichting in <em>vier stappen</em></h2>
    <p class="section-sub" style="margin:0 auto 48px">Geen boekhoudkundige kennis vereist. Upload uw stukken en ontvang uw rapport.</p>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;max-width:1100px;margin:0 auto">
      <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:28px">
        <div style="font-size:2rem;font-weight:800;color:#bfdbfe;margin-bottom:12px">01</div>
        <h3 style="font-size:1rem;font-weight:700;color:#0f172a;margin-bottom:8px">Account aanmaken en stichting kiezen</h3>
        <p style="font-size:0.85rem;color:#475569;line-height:1.6">Maak gratis een account aan, voeg uw stichting toe en selecteer het boekjaar.</p>
      </div>
      <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:28px">
        <div style="font-size:2rem;font-weight:800;color:#bfdbfe;margin-bottom:12px">02</div>
        <h3 style="font-size:1rem;font-weight:700;color:#0f172a;margin-bottom:8px">Bestanden downloaden</h3>
        <p style="font-size:0.85rem;color:#475569;line-height:1.6">Download de financiële stukken van uw stichting via uw boekhoudprogramma als PDF, Excel of CSV.</p>
      </div>
      <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:28px">
        <div style="font-size:2rem;font-weight:800;color:#bfdbfe;margin-bottom:12px">03</div>
        <h3 style="font-size:1rem;font-weight:700;color:#0f172a;margin-bottom:8px">Bestanden uploaden</h3>
        <p style="font-size:0.85rem;color:#475569;line-height:1.6">Upload uw bestanden veilig via onze SSL-versleutelde omgeving. Meerdere bestanden tegelijk mogelijk.</p>
      </div>
      <div style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:28px">
        <div style="font-size:2rem;font-weight:800;color:#bfdbfe;margin-bottom:12px">04</div>
        <h3 style="font-size:1rem;font-weight:700;color:#0f172a;margin-bottom:8px">Betaal en ontvang uw rapport</h3>
        <p style="font-size:0.85rem;color:#475569;line-height:1.6">Betaal eenmalig €59 via iDEAL en ontvang direct uw rapport — klaar voor de bestuursvergadering of subsidieaanvraag.</p>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div style="text-align:center;margin-bottom:48px">
      <p class="section-label">Het rapport</p>
      <h2>Wat controleert Slimme Kascontrole <em>voor uw stichting</em>?</h2>
    </div>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">🔍</div>
        <h3>Volledige factuurcontrole</h3>
        <p>Alle facturen en uitgaven worden gecontroleerd op juistheid, volledigheid en autorisatie.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🎯</div>
        <h3>Doelbestedingscontrole</h3>
        <p>Zijn de bestede middelen in lijn met de doelstelling van de stichting? Subsidies correct verantwoord?</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📋</div>
        <h3>Contracten & abonnementen</h3>
        <p>Zijn alle lopende contracten en abonnementen nog actueel en noodzakelijk voor de stichting?</p>
      </div>
      <div class="feature">
        <div class="feature-icon">💰</div>
        <h3>Saldocontrole</h3>
        <p>Alle bankrekeningen en fondsen worden gecontroleerd. Afwijkingen worden direct gesignaleerd.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📊</div>
        <h3>Trendanalyse</h3>
        <p>Vergelijking met voorgaande boekjaren geeft inzicht in de financiële ontwikkeling van uw stichting.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">✅</div>
        <h3>Advies bestuur</h3>
        <p>Duidelijk advies over goedkeuring van de jaarrekening — klaar voor de bestuursvergadering.</p>
      </div>
    </div>
  </div>
</section>

<section style="background:#f8fafc">
  <div class="container" style="text-align:center">
    <p class="section-label">Veelgestelde vragen</p>
    <h2>Vragen over kascontrole voor <em>stichtingen</em></h2>
    <div class="faq-list">
      <div class="faq-item" style="text-align:left">
        <h3>Is kascontrole verplicht voor een stichting?</h3>
        <p>Dit hangt af van de statuten en de omvang van de stichting. Grotere stichtingen (omzet boven €6 miljoen) zijn verplicht een accountantscontrole te laten uitvoeren. Kleinere stichtingen leggen verantwoording af via de statuten of aan subsidieverstrekkers. Slimme Kascontrole is geschikt voor kleinere stichtingen die een professioneel rapport nodig hebben.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Kan ik het rapport gebruiken voor een subsidieaanvraag?</h3>
        <p>Ja. Veel subsidieverstrekkers accepteren een kascontrolerapport als bewijs van financieel beheer. Ons rapport geeft een volledig overzicht van de financiën van uw stichting.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Welke bestanden heb ik nodig?</h3>
        <p>U heeft de jaarrekening of het financiële overzicht van uw stichting nodig, inclusief bankafschriften. Dit kunt u aanleveren als PDF, Excel of CSV.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Hoe snel ontvang ik het rapport?</h3>
        <p>Direct na betaling wordt uw rapport gegenereerd. Het rapport is meteen beschikbaar in uw account.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Wat kost het?</h3>
        <p>Eenmalig €59 incl. btw per boekjaar. Geen abonnement, geen verborgen kosten.</p>
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <h2 style="color:white;text-align:center;margin-bottom:16px">Klaar voor uw kascontrole?</h2>
    <p class="section-sub" style="color:rgba(255,255,255,0.75);text-align:center;margin:0 auto 32px">Maak gratis een account aan en ontvang direct uw professionele kascontrolerapport.</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
      <a href="/registreer" class="btn-primary">Gratis account aanmaken</a>
      <a href="/" style="color:rgba(255,255,255,0.8);font-size:0.9rem;font-weight:500;text-decoration:none;display:flex;align-items:center">← Terug naar home</a>
    </div>
  </div>
</section>

</body>
</html>`
