import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kascommissie Rapport – Professioneel kascontrolerapport voor uw vereniging | €59',
  description: 'Professioneel kascommissie rapport voor uw vereniging of VvE. Volledig gecontroleerd in minuten. Eenmalig €59 incl. btw — klaar voor de ledenvergadering.',
}

export default function KascommissieRapport() {
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
.rapport-onderdelen{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:1100px;margin:0 auto}
.onderdeel{background:#f8fafc;border-radius:12px;padding:24px;border:1px solid #e2e8f0;display:flex;gap:16px;align-items:flex-start}
.onderdeel-icon{font-size:1.5rem;flex-shrink:0}
.onderdeel h3{font-size:0.92rem;font-weight:700;color:#0f172a;margin-bottom:6px}
.onderdeel p{font-size:0.82rem;color:#475569;line-height:1.6}
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
  .two-col,.rapport-onderdelen{grid-template-columns:1fr}
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
    <div class="breadcrumb"><a href="/">Home</a> › Kascommissie Rapport</div>
    <div class="hero-eyebrow">📋 Voor elke kascommissie in Nederland</div>
    <h1>Een professioneel kascommissie rapport — <em>in minuten klaar</em> voor €59</h1>
    <p class="hero-sub">Als kascommissielid wilt u een grondig en professioneel rapport presenteren op de ledenvergadering. Met Slimme Kascontrole upload u de financiële stukken en ontvangt u direct een volledig kascommissie rapport. Eenmalig €59 incl. btw — geen abonnement.</p>
    <a href="/registreer" class="btn-primary">Gratis account aanmaken</a>
    <a href="#wat-zit-erin" class="btn-ghost">Bekijk wat er in zit →</a>
  </div>
</section>

<section>
  <div class="container two-col">
    <div class="text-body">
      <p class="section-label">Wat is een kascommissie rapport?</p>
      <h2>Het rapport dat uw kascommissie <em>sterk maakt</em> op de vergadering</h2>
      <p>Een kascommissie rapport is het officiële verslag van de kascommissie aan de ledenvergadering. Het beschrijft de bevindingen van de controle van de jaarrekening en geeft een advies over al dan niet verlenen van decharge aan het bestuur.</p>
      <p>In de praktijk worstelen veel kascommissieleden met dit rapport. Hoe ziet het eruit? Wat moet er allemaal in? Slimme Kascontrole neemt u dit werk uit handen — u uploadt de stukken, wij stellen het rapport op.</p>
      <div class="callout">
        <strong>Wist u dat?</strong> Een onvolledig of onjuist kascommissie rapport kan juridische gevolgen hebben. Als de decharge achteraf ongeldig blijkt, kunnen bestuursleden persoonlijk aansprakelijk worden gesteld. Een professioneel rapport beschermt iedereen.
      </div>
    </div>
    <div>
      <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80" alt="Kascommissie rapport" style="border-radius:16px;width:100%;height:400px;object-fit:cover;box-shadow:0 16px 48px rgba(0,0,0,0.1)"/>
    </div>
  </div>
</section>

<section id="wat-zit-erin" style="background:#f8fafc">
  <div class="container">
    <div style="text-align:center;margin-bottom:48px">
      <p class="section-label">Inhoud rapport</p>
      <h2>Wat zit er in het <em>kascommissie rapport</em>?</h2>
      <p class="section-sub" style="margin:0 auto">Een volledig rapport met alle onderdelen die een professionele kascontrole vereist.</p>
    </div>
    <div class="rapport-onderdelen">
      <div class="onderdeel">
        <div class="onderdeel-icon">📌</div>
        <div>
          <h3>Opdracht en werkzaamheden</h3>
          <p>Beschrijving van welke documenten zijn beoordeeld en welke werkzaamheden zijn verricht door de kascommissie.</p>
        </div>
      </div>
      <div class="onderdeel">
        <div class="onderdeel-icon">⚡</div>
        <div>
          <h3>Samenvatting bevindingen</h3>
          <p>Overzicht van kritische punten, aandachtspunten en goedgekeurde posten — direct inzichtelijk voor de vergadering.</p>
        </div>
      </div>
      <div class="onderdeel">
        <div class="onderdeel-icon">💰</div>
        <div>
          <h3>Balans en saldocontrole</h3>
          <p>Aansluiting van alle bankrekeningen en balansposten. Afwijkingen worden direct gesignaleerd.</p>
        </div>
      </div>
      <div class="onderdeel">
        <div class="onderdeel-icon">🔍</div>
        <div>
          <h3>Volledige factuurcontrole</h3>
          <p>Elke factuur en uitgave wordt gecontroleerd op juistheid en autorisatie. Geen steekproeven.</p>
        </div>
      </div>
      <div class="onderdeel">
        <div class="onderdeel-icon">📋</div>
        <div>
          <h3>Contracten & abonnementen</h3>
          <p>Zijn alle lopende contracten en abonnementen nog actueel? Verlopen ze binnenkort? Worden ze nog gebruikt?</p>
        </div>
      </div>
      <div class="onderdeel">
        <div class="onderdeel-icon">📊</div>
        <div>
          <h3>Trendanalyse meerdere jaren</h3>
          <p>Vergelijking met voorgaande boekjaren om patronen en ontwikkelingen inzichtelijk te maken.</p>
        </div>
      </div>
      <div class="onderdeel">
        <div class="onderdeel-icon">⚠️</div>
        <div>
          <h3>Openstaande posten</h3>
          <p>Overzicht van debiteuren en crediteuren. Zijn openstaande bedragen inmiddels vereffend?</p>
        </div>
      </div>
      <div class="onderdeel">
        <div class="onderdeel-icon">✅</div>
        <div>
          <h3>Advies aan de vergadering</h3>
          <p>Duidelijk advies: goedkeuring, voorwaardelijke goedkeuring of aanhouding — met concrete voorwaarden.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<section style="background:#f8fafc">
  <div class="container" style="text-align:center">
    <p class="section-label">Veelgestelde vragen</p>
    <h2>Vragen over het <em>kascommissie rapport</em></h2>
    <div class="faq-list">
      <div class="faq-item" style="text-align:left">
        <h3>Wat moet er in een kascommissie rapport staan?</h3>
        <p>Een volledig kascommissie rapport bevat minimaal: de opdracht en werkzaamheden, bevindingen over de jaarrekening, controle van bankrekeningen en facturen, openstaande posten, en een advies aan de ledenvergadering over decharge. Slimme Kascontrole genereert al deze onderdelen automatisch.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Mag een kascommissie een extern rapport gebruiken?</h3>
        <p>Ja. De kascommissie is verantwoordelijk voor de controle, maar mag daarvoor externe hulpmiddelen inzetten. Slimme Kascontrole ondersteunt de kascommissie bij het opstellen van het rapport — de kascommissie blijft verantwoordelijk voor de inhoud.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Hoe snel ontvang ik het rapport?</h3>
        <p>Direct na betaling wordt uw rapport gegenereerd. U hoeft niet te wachten op een afspraak of handmatige verwerking.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Werkt het voor VvE's, sportverenigingen én stichtingen?</h3>
        <p>Ja. Slimme Kascontrole werkt voor alle Nederlandse verenigingen en organisaties met een kascommissie — VvE's, sportverenigingen, buurtverenigingen, stichtingen en meer.</p>
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
    <h2 style="color:white;text-align:center;margin-bottom:16px">Klaar voor uw kascommissie rapport?</h2>
    <p class="section-sub" style="color:rgba(255,255,255,0.75);text-align:center;margin:0 auto 32px">Maak gratis een account aan en ontvang direct uw professionele rapport.</p>
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
