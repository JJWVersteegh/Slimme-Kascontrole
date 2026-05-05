import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kascontrole Sportvereniging – Professioneel rapport voor uw club | €59',
  description: 'Kascontrole voor uw sportvereniging. Volledig gecontroleerd rapport in minuten. Eenmalig €59 incl. btw — geen abonnement. Klaar voor de ledenvergadering.',
}

export default function SportverenigingKascontrole() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
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
.btn-primary:hover{background:#1D4ED8}
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
.steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:0 auto}
.step-card{background:white;border-radius:16px;border:1px solid #e2e8f0;padding:28px}
.step-num{font-size:2rem;font-weight:800;color:#bfdbfe;margin-bottom:12px}
.step-card h3{font-size:1rem;font-weight:700;color:#0f172a;margin-bottom:8px}
.step-card p{font-size:0.85rem;color:#475569;line-height:1.6}
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
footer a:hover{color:white}
.footer-links{display:flex;gap:24px;flex-wrap:wrap}
@media(max-width:768px){
  nav{padding:0 20px}
  .nav-links{display:none}
  .hamburger{display:flex}
  .hero{padding:120px 20px 60px}
  section{padding:60px 20px}
  .two-col,.steps-grid,.features-grid{grid-template-columns:1fr}
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
    <li><a href="/#waarom">Waarom</a></li>
    <li><a href="/#hoe-het-werkt">Hoe het werkt</a></li>
    <li><a href="/#tarieven">Tarieven</a></li>
    <li><a href="/mijn-omgeving">Mijn omgeving</a></li>
    <li><a href="/registreer" class="btn-nav">Account aanmaken</a></li>
  </ul>
  <button class="hamburger" onclick="document.getElementById('mob').style.display=document.getElementById('mob').style.display==='block'?'none':'block'">
    <span class="ham-bar"></span><span class="ham-bar"></span><span class="ham-bar"></span>
  </button>
</nav>
<div class="mobile-menu" id="mob">
  <a href="/#waarom">Waarom kascontrole?</a>
  <a href="/#hoe-het-werkt">Hoe het werkt</a>
  <a href="/#tarieven">Tarieven</a>
  <a href="/mijn-omgeving">Mijn omgeving</a>
  <a href="/registreer" class="mobile-btn">Account aanmaken</a>
</div>

<section class="hero">
  <div class="hero-content">
    <div class="breadcrumb"><a href="/">Home</a> › Kascontrole Sportvereniging</div>
    <div class="hero-eyebrow">⚽ Voor elke sportvereniging in Nederland</div>
    <h1>Kascontrole voor uw sportvereniging — <em>in minuten klaar</em> voor €59</h1>
    <p class="hero-sub">Uw kascommissie heeft een professioneel rapport nodig voor de ledenvergadering. Met Slimme Kascontrole uploadt u de financiële stukken van uw club en ontvangt u direct een volledig gecontroleerd kascontrolerapport. Eenmalig €59 incl. btw — geen abonnement.</p>
    <a href="/registreer" class="btn-primary">Gratis account aanmaken</a>
    <a href="#hoe-het-werkt" class="btn-ghost">Bekijk hoe het werkt →</a>
  </div>
</section>

<section>
  <div class="container two-col">
    <div class="text-body">
      <p class="section-label">Waarom kascontrole?</p>
      <h2>Uw kascommissie verdient een <em>professioneel rapport</em></h2>
      <p>Bij de meeste sportverenigingen zijn de kascommissieleden enthousiaste vrijwilligers — geen accountants. Ze missen vaak de tijd en kennis om een grondige controle uit te voeren. Het resultaat: een globale check die meer vragen oproept dan antwoorden geeft op de ledenvergadering.</p>
      <p>Met Slimme Kascontrole voert u een <strong>volledige controle</strong> uit op alle inkomsten, uitgaven, contracten en abonnementen van uw sportvereniging. Het rapport is direct klaar voor de ledenvergadering.</p>
      <div class="callout">
        <strong>Tip voor sportverenigingen:</strong> Veel clubs hebben abonnementen en contracten (sporthal, materialen, verzekeringen) die al jaren doorlopen zonder dat iemand controleert of ze nog actueel en noodzakelijk zijn. Ons rapport signaleert dit automatisch.
      </div>
      <p>Of u nu een voetbalclub, tennisvereniging, zwemclub of een andere sportvereniging bent — Slimme Kascontrole werkt voor elke Nederlandse sportvereniging.</p>
    </div>
    <div>
      <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" alt="Kascontrole sportvereniging" style="border-radius:16px;width:100%;height:400px;object-fit:cover;box-shadow:0 16px 48px rgba(0,0,0,0.1)"/>
    </div>
  </div>
</section>

<section id="hoe-het-werkt" style="background:#f8fafc">
  <div class="container" style="text-align:center">
    <p class="section-label">Hoe het werkt</p>
    <h2>Kascontrole in <em>drie stappen</em></h2>
    <p class="section-sub" style="margin:0 auto 48px">Geen boekhoudkundige kennis vereist. Upload uw stukken en ontvang uw rapport.</p>
    <div class="steps-grid">
      <div class="step-card">
        <div class="step-num">01</div>
        <h3>Account aanmaken & bestanden uploaden</h3>
        <p>Maak gratis een account aan en upload de financiële stukken van uw sportvereniging — jaarrekening, bankafschriften of het overzicht van uw penningmeester als PDF, Excel of CSV.</p>
      </div>
      <div class="step-card">
        <div class="step-num">02</div>
        <h3>Eenmalig betalen</h3>
        <p>Betaal eenmalig €59 incl. btw via iDEAL of creditcard. Geen abonnement, geen verborgen kosten. Per boekjaar één betaling.</p>
      </div>
      <div class="step-card">
        <div class="step-num">03</div>
        <h3>Volledig rapport ontvangen</h3>
        <p>Ontvang direct uw professionele kascontrolerapport — inclusief contractencheck en klaar voor de ledenvergadering van uw sportvereniging.</p>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="container">
    <div style="text-align:center;margin-bottom:48px">
      <p class="section-label">Het rapport</p>
      <h2>Wat controleert Slimme Kascontrole <em>voor uw sportvereniging</em>?</h2>
    </div>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">🔍</div>
        <h3>Volledige factuurcontrole</h3>
        <p>Alle facturen en uitgaven worden gecontroleerd — van sportmateriaal tot accommodatiekosten.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📋</div>
        <h3>Contracten & abonnementen</h3>
        <p>Zijn alle contracten (sporthal, materialen) nog actueel? Verlopen ze binnenkort? Worden alle abonnementen nog gebruikt?</p>
      </div>
      <div class="feature">
        <div class="feature-icon">🛡️</div>
        <h3>Verzekeringen</h3>
        <p>Is de aansprakelijkheidsverzekering en wedstrijdverzekering nog actueel en voldoende gedekt?</p>
      </div>
      <div class="feature">
        <div class="feature-icon">👥</div>
        <h3>Contributie-inkomsten</h3>
        <p>Zijn alle contributiebetalingen ontvangen? Wie heeft er nog niet betaald? Klopt het ledenbestand met de inkomsten?</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📊</div>
        <h3>Trendanalyse meerdere jaren</h3>
        <p>Vergelijking met voorgaande boekjaren geeft inzicht in de financiële ontwikkeling van uw club.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">📄</div>
        <h3>ALV-klaar rapport</h3>
        <p>Het rapport is direct inzetbaar op uw ledenvergadering. Professionele opmaak met duidelijke conclusies.</p>
      </div>
    </div>
  </div>
</section>

<section style="background:#f8fafc">
  <div class="container" style="text-align:center">
    <p class="section-label">Veelgestelde vragen</p>
    <h2>Vragen over kascontrole voor <em>sportverenigingen</em></h2>
    <p class="section-sub" style="margin:0 auto 40px">De meest gestelde vragen van sportverenigingen over kascontrole.</p>
    <div class="faq-list">
      <div class="faq-item" style="text-align:left">
        <h3>Is kascontrole verplicht voor een sportvereniging?</h3>
        <p>In de meeste gevallen wel. De statuten van vrijwel elke sportvereniging verplichten een jaarlijkse kascontrole door een kascommissie. De kascommissie brengt verslag uit op de Algemene Ledenvergadering (ALV). Zonder kascontrole is decharge van het bestuur juridisch ongeldig.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Welke bestanden heb ik nodig?</h3>
        <p>U heeft de jaarrekening of het financiële overzicht van uw sportvereniging nodig, inclusief bankafschriften. Dit kunt u downloaden via uw boekhoudprogramma of opvragen bij uw penningmeester als PDF, Excel of CSV.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Werkt het ook voor kleine sportverenigingen?</h3>
        <p>Ja, Slimme Kascontrole werkt voor verenigingen van elke omvang. Of u nu 50 of 500 leden heeft — het rapport past zich aan op de omvang van uw financiën.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Hoe snel ontvang ik het rapport?</h3>
        <p>Direct na betaling wordt uw rapport gegenereerd. U hoeft niet te wachten op een afspraak. Het rapport is meteen beschikbaar in uw account.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Wat kost de kascontrole?</h3>
        <p>Eenmalig €59 incl. btw per boekjaar. Geen abonnement, geen jaarlijkse kosten. U betaalt alleen wanneer u een rapport aanvraagt.</p>
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

<footer>
  <div class="nav-logo">
    <div style="background:#2563EB;width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center">
      <svg width="16" height="16" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div style="line-height:1.1;margin-left:10px">
      <div style="font-weight:700;font-size:0.9rem;color:rgba(255,255,255,0.7)">slimme</div>
      <div style="font-weight:500;font-size:0.9rem;color:rgba(255,255,255,0.5)">kascontrole</div>
    </div>
  </div>
  <div class="footer-links">
    <a href="/vve-kascontrole">VvE Kascontrole</a>
    <a href="/sportvereniging-kascontrole">Sportvereniging</a>
    <a href="/kascommissie-rapport">Kascommissie rapport</a>
    <a href="/stichting-kascontrole">Stichting</a>
    <a href="/#contact">Contact</a>
  </div>
  <p style="font-size:0.82rem">© 2026 Slimme Kascontrole</p>
</footer>
</body>
</html>`
