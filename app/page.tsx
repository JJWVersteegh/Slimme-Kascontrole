import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Slimme Kascontrole – Uw kascontrole klaar voor de ALV',
  description: 'Volledig gecontroleerd kascontrolerapport voor uw vereniging. Eenmalig €59 incl. btw per kascontrole.',
}

export default function Home() {
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
html{overflow-x:hidden;width:100%}
body{overflow-x:hidden;width:100%;max-width:100vw}
img{max-width:100%;height:auto}
div,section,nav,footer,ul{max-width:100%}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;color:#0f172a;background:white;overflow-x:hidden}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.97);backdrop-filter:blur(12px);border-bottom:1px solid #e2e8f0;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 48px;transition:box-shadow 0.3s}
nav.scrolled{box-shadow:0 4px 24px rgba(0,0,0,0.08)}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.nav-logo-icon{background:#2563EB;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center}
.nav-links{display:flex;gap:28px;list-style:none;align-items:center;flex-wrap:wrap}
.nav-links a{font-size:0.88rem;font-weight:500;color:#475569;text-decoration:none;transition:color 0.2s}
.nav-links a:hover{color:#2563EB}
.btn-nav{background:#2563EB;color:white!important;padding:9px 20px;border-radius:6px;font-weight:600;transition:background 0.2s!important}
.btn-nav:hover{background:#1D4ED8!important}
.hamburger{display:none;background:none;border:1.5px solid #e2e8f0;border-radius:6px;cursor:pointer;padding:7px;flex-direction:column;gap:4px;align-items:center;justify-content:center}
.ham-bar{display:block;width:20px;height:2px;background:#0f172a;border-radius:2px;transition:all 0.3s}
.mobile-menu{display:none;position:fixed;top:72px;left:0;right:0;background:white;border-bottom:1px solid #e2e8f0;z-index:199;padding:12px 20px 20px;box-shadow:0 8px 24px rgba(0,0,0,0.1)}
.mobile-menu a{display:block;padding:12px 16px;color:#0f172a;text-decoration:none;font-weight:500;border-radius:8px;font-size:0.95rem;transition:background 0.15s}
.mobile-menu a:hover{background:#f8fafc}
.mobile-menu .mobile-btn{background:#2563EB;color:white!important;text-align:center;margin-top:8px;font-weight:700}

/* HERO */
.hero{position:relative;min-height:100vh;width:100%;display:flex;align-items:center;overflow:hidden;background:#0f2460}
.hero-bg{position:absolute;inset:0;z-index:0}
.hero-bg img{width:100%;height:100%;object-fit:cover;object-position:center 60%;opacity:0.6}

.hero-content{position:relative;z-index:1;width:100%;padding:0 48px}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(37,99,235,0.35);border:1px solid rgba(147,197,253,0.5);color:#bfdbfe;font-size:0.72rem;font-weight:700;padding:5px 13px;border-radius:20px;margin-bottom:24px;letter-spacing:0.05em;text-transform:uppercase}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(2rem,4.5vw,3.8rem);font-weight:700;line-height:1.1;color:white;margin-bottom:20px;letter-spacing:-0.02em}
.hero h1 em{font-style:italic;font-weight:400;color:#93c5fd}
.hero-sub{font-size:clamp(0.92rem,2vw,1.05rem);color:rgba(255,255,255,0.88);line-height:1.7;margin-bottom:32px;max-width:500px}
.hero-ctas{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-bottom:36px}
.btn-primary{background:#2563EB;color:white;padding:14px 30px;border-radius:8px;font-size:0.95rem;font-weight:700;text-decoration:none;box-shadow:0 4px 20px rgba(37,99,235,0.45);font-family:'Outfit',sans-serif;white-space:nowrap;display:inline-block}
.btn-primary:hover{background:#1D4ED8}
.btn-ghost-white{color:rgba(255,255,255,0.85);font-size:0.9rem;font-weight:500;text-decoration:none;display:flex;align-items:center;gap:6px;white-space:nowrap}
.hero-price{display:flex;align-items:center;gap:12px;padding:14px 16px;background:rgba(0,0,0,0.45);backdrop-filter:blur(12px);border-radius:12px;border:1px solid rgba(255,255,255,0.25);flex-wrap:wrap;max-width:100%}
.price-label{font-size:0.65rem;font-weight:700;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:2px}
.price-num{display:flex;align-items:baseline;gap:1px}
.price-num span:first-child{font-size:0.9rem;font-weight:700;color:#93c5fd}
.price-num span:last-child{font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;color:white;line-height:1}
.price-divider{width:1px;height:40px;background:rgba(255,255,255,0.2);flex-shrink:0}
.price-checks{display:flex;flex-direction:column;gap:5px}
.price-check{font-size:0.78rem;color:rgba(255,255,255,0.9);display:flex;align-items:center;gap:6px}
.price-check span:first-child{color:#93c5fd;font-weight:700}

/* SECTIONS */
section{padding:88px 48px}
.section-label{font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#2563EB;margin-bottom:12px}
h2{font-family:'Playfair Display',serif;font-size:clamp(1.7rem,3vw,2.5rem);font-weight:700;color:#0f172a;letter-spacing:-0.02em;line-height:1.15;margin-bottom:14px}
h2 em{font-style:italic;color:#2563EB}
.section-sub{font-size:0.97rem;color:#475569;line-height:1.7;max-width:540px;margin-bottom:52px}
.section-sub.centered{text-align:center;margin-left:auto;margin-right:auto}
.centered{text-align:center}
.centered .section-sub{margin:0 auto 52px;text-align:center}

/* WHY */
.why-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;max-width:1100px;margin:0 auto}
.why-text p{font-size:0.93rem;color:#475569;line-height:1.8;margin-bottom:14px}
.why-callout{background:#eff6ff;border-left:4px solid #2563EB;border-radius:0 10px 10px 0;padding:18px 22px;margin:20px 0;font-size:0.88rem;color:#1e3a8a;line-height:1.7}
.why-img{border-radius:16px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.1)}
.why-img img{width:100%;height:400px;object-fit:cover;display:block}

/* ABOUT */
.about-bg{background:#f8fafc}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;max-width:1100px;margin:0 auto}
.about-img{border-radius:16px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.1)}
.about-img img{width:100%;height:420px;object-fit:cover;display:block}
.about-quote{background:white;border-radius:12px;padding:24px;border:1px solid #e2e8f0;margin-top:24px;font-style:italic;color:#475569;font-size:0.92rem;line-height:1.7;position:relative}
.about-quote::before{content:'"';font-family:'Playfair Display',serif;font-size:3rem;color:#2563EB;line-height:0.8;display:block;margin-bottom:8px}

/* HOW */
.how-bg{background:white}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;max-width:1100px;margin:0 auto}
.step{background:white;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;transition:transform 0.2s,box-shadow 0.2s}
.step:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.08)}
.step-img{width:100%;height:200px;object-fit:cover;display:block}
.step-body{padding:24px}
.step-num{font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:700;color:#eff6ff;line-height:1;margin-bottom:8px}
.step h3{font-family:'Outfit',sans-serif;font-size:1rem;font-weight:700;color:#0f172a;margin-bottom:8px}
.step p{font-size:0.85rem;color:#475569;line-height:1.7}

/* SOURCES */
.sources-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:800px;margin:0 auto}
.source-card{background:white;border-radius:12px;padding:22px;border:1px solid #e2e8f0;text-align:center;transition:transform 0.2s,box-shadow 0.2s;cursor:pointer;text-decoration:none;display:block;color:inherit}
.source-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.07)}
.source-icon{font-size:1.8rem;margin-bottom:10px}
.source-name{font-weight:700;color:#0f172a;font-size:0.9rem;margin-bottom:3px}
.source-desc{font-size:0.75rem;color:#475569;line-height:1.5}

/* FEATURES */
.features-bg{background:#f8fafc}
.features-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;max-width:1100px;margin:0 auto}
.feature-list{display:flex;flex-direction:column;gap:22px}
.feature-item{display:flex;gap:14px;align-items:flex-start}
.feature-icon{width:42px;height:42px;background:#eff6ff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;transition:background 0.2s}
.feature-item:hover .feature-icon{background:#bfdbfe}
.feature-text h4{font-weight:700;color:#0f172a;font-size:0.92rem;margin-bottom:3px}
.feature-text p{font-size:0.83rem;color:#475569;line-height:1.6}
.feature-visual{background:#1e3a8a;border-radius:20px;padding:36px;color:white}
.fv-title{font-family:'Playfair Display',serif;font-size:1.05rem;margin-bottom:20px;color:#93c5fd}
.check-list{list-style:none;display:flex;flex-direction:column;gap:12px}
.check-list li{display:flex;gap:10px;font-size:0.86rem;color:rgba(255,255,255,0.82);line-height:1.5}
.check-list li::before{content:'✓';color:#93c5fd;font-weight:700;flex-shrink:0}

/* SECURITY */
.security-bg{background:#1e3a8a;color:white}
.security-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;max-width:1000px;margin:0 auto}
.sec-card{background:rgba(255,255,255,0.08);border-radius:14px;padding:24px 18px;border:1px solid rgba(255,255,255,0.12);text-align:center}
.sec-icon{font-size:1.8rem;margin-bottom:10px}
.sec-title{font-weight:700;color:white;font-size:0.88rem;margin-bottom:6px}
.sec-desc{font-size:0.78rem;color:rgba(255,255,255,0.65);line-height:1.6}

/* PRICING */
.pricing-bg{background:#f8fafc}
.pricing-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:760px;margin:0 auto}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-top:48px}
.price-card{background:white;border-radius:16px;padding:32px;border:2px solid #e2e8f0;transition:transform 0.2s,box-shadow 0.2s;position:relative}
.price-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.08)}
.price-card.featured{border-color:#2563EB;background:#1e3a8a;color:white}
.popular-tag{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:#f59e0b;color:white;font-size:0.68rem;font-weight:700;padding:4px 14px;border-radius:20px;letter-spacing:0.05em;text-transform:uppercase;white-space:nowrap}
.price-card h3{font-size:1.05rem;font-weight:700;color:#0f172a;margin-bottom:6px}
.price-card.featured h3{color:white}
.price-amount{font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:700;color:#0f172a;line-height:1;margin:14px 0 4px}
.price-card.featured .price-amount{color:white}
.price-note{font-size:0.78rem;color:#475569;margin-bottom:20px}
.price-card.featured .price-note{color:rgba(255,255,255,0.6)}
.feat-li{font-size:0.84rem;color:#475569;display:flex;gap:7px;margin-bottom:8px;align-items:flex-start}
.feat-li::before{content:'✓';color:#2563EB;font-weight:700;flex-shrink:0;margin-top:1px}
.price-card.featured .feat-li{color:rgba(255,255,255,0.85)}
.price-card.featured .feat-li::before{color:#93c5fd}
.btn-plan{display:block;text-align:center;margin-top:24px;padding:12px;border-radius:8px;font-size:0.88rem;font-weight:700;text-decoration:none;font-family:'Outfit',sans-serif;transition:all 0.2s}
.btn-plan-blue{background:#2563EB;color:white}
.btn-plan-blue:hover{background:#1D4ED8}
.btn-plan-outline{border:1.5px solid #bfdbfe;color:#2563EB}
.btn-plan-outline:hover{background:#eff6ff}

/* TESTIMONIALS */
.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:0 auto}
.testi{background:white;border-radius:16px;padding:28px;border:1px solid #e2e8f0}
.stars{font-size:0.82rem;color:#f59e0b;letter-spacing:3px;margin-bottom:12px}
.testi blockquote{font-size:0.88rem;color:#475569;line-height:1.7;margin-bottom:18px;font-style:italic}
.testi-author{font-size:0.82rem;font-weight:700;color:#0f172a}
.testi-role{font-size:0.75rem;color:#475569}

/* CTA */
.cta-bg{background:#2563EB;color:white;text-align:center}
.cta-bg h2{color:white}
.cta-bg .section-sub{color:rgba(255,255,255,0.75);margin:0 auto 36px}
.btn-white{background:white;color:#2563EB;padding:15px 36px;border-radius:8px;font-size:0.95rem;font-weight:700;text-decoration:none;display:inline-block;font-family:'Outfit',sans-serif;transition:transform 0.2s,box-shadow 0.2s}
.btn-white:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.15)}
.btn-ghost-blue{color:rgba(255,255,255,0.8);font-size:0.9rem;font-weight:500;text-decoration:none;display:inline-flex;align-items:center;gap:6px;margin-left:20px}
.btn-ghost-blue:hover{color:white}

/* FOOTER */
footer{background:#0f172a;color:rgba(255,255,255,0.5);padding:40px 48px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;font-size:0.8rem}
.footer-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
footer a{color:rgba(255,255,255,0.5);text-decoration:none}
footer a:hover{color:#93c5fd}
.footer-links{display:flex;gap:20px;flex-wrap:wrap}

/* ANIMATIONS */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.fade-in{opacity:0;transform:translateY(18px);transition:opacity 0.7s ease,transform 0.7s ease}
.fade-in.visible{opacity:1;transform:translateY(0)}

/* RESPONSIVE */
@media(max-width:900px){
  nav{padding:0 20px}
  .nav-links{display:none!important}
  .hamburger{display:flex!important}
  section{padding:56px 20px}
  .steps,.testi-grid{grid-template-columns:1fr}
  .features-grid,.why-grid,.about-grid,.pricing-grid,.contact-grid{grid-template-columns:1fr}
  .sources-grid,.security-grid{grid-template-columns:1fr 1fr}
  .hero-content{padding:0 16px!important;width:100%!important}
  footer{flex-direction:column;text-align:center;padding:32px 20px}
  .footer-links{justify-content:center}
}
@media(max-width:500px){
  .sources-grid,.security-grid{grid-template-columns:1fr}
  .pricing-grid{grid-template-columns:1fr}
  .hero-price{gap:10px;padding:12px}
  .price-divider{display:none}
  .why-grid,.about-grid,.features-grid{grid-template-columns:1fr}
  section{padding:48px 16px!important}
  nav{padding:0 16px!important}
}
</style>
</head>
<body>

<!-- NAV -->
<nav id="navbar">
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
    <li><a href="#waarom">Waarom</a></li>
    <li><a href="#hoe-het-werkt">Hoe het werkt</a></li>
    <li><a href="#handleidingen">Handleidingen</a></li>
    <li><a href="#over-ons">Over ons</a></li>
    <li><a href="#tarieven">Tarieven</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="/mijn-omgeving">Mijn omgeving</a></li>
    <li><a href="/registreer" class="btn-nav">Account aanmaken</a></li>
  </ul>
  <button class="hamburger" id="hamburger" onclick="toggleMenu()" aria-label="Menu">
    <span class="ham-bar" id="bar1"></span>
    <span class="ham-bar" id="bar2"></span>
    <span class="ham-bar" id="bar3"></span>
  </button>
</nav>

<!-- MOBIEL MENU -->
<div class="mobile-menu" id="mobile-menu">
  <a href="#waarom" onclick="closeMenu()">Waarom kascontrole?</a>
  <a href="#hoe-het-werkt" onclick="closeMenu()">Hoe het werkt</a>
  <a href="#handleidingen" onclick="closeMenu()">Handleidingen</a>
  <a href="#over-ons" onclick="closeMenu()">Over ons</a>
  <a href="#tarieven" onclick="closeMenu()">Tarieven</a>
  <a href="#contact" onclick="closeMenu()">Contact</a>
  <a href="/mijn-omgeving" onclick="closeMenu()">Mijn omgeving</a>
  <a href="/registreer" class="mobile-btn">Account aanmaken</a>
</div>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg">
    <img src="/hero.jpg" alt="Kascontrole voor verenigingen"/>
    <div class="hero-overlay"></div>
  </div>
  <div class="hero-content">
    <div style="max-width:600px">
      <div class="hero-eyebrow">✦ Verplicht voor elke vereniging</div>
      <h1>Uw kascontrolerapport in<br/><em>minuten klaar</em> voor de ALV</h1>
      <p class="hero-sub">Upload uw financiële bestanden en ontvang een volledig gecontroleerd kascontrolerapport, opgesteld door onze kascontroleurs. Eenmalig €59 incl. btw — geen abonnement.</p>
      <div class="hero-ctas">
        <a href="/registreer" class="btn-primary">Account aanmaken</a>
        <a href="#hoe-het-werkt" class="btn-ghost-white">Bekijk hoe het werkt →</a>
      </div>
      <div class="hero-price">
        <div>
          <div class="price-label">Eenmalig per kascontrole</div>
          <div class="price-num"><span>€</span><span>59</span></div>
          <div style="font-size:0.68rem;color:rgba(255,255,255,0.5);margin-top:2px">incl. btw</div>
        </div>
        <div class="price-divider"></div>
        <div class="price-checks">
          <div class="price-check"><span>✓</span>Volledig gecontroleerd rapport</div>
          <div class="price-check"><span>✓</span>Trendanalyse meerdere jaren</div>
          <div class="price-check"><span>✓</span>Geen abonnement</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- WAAROM -->
<section id="waarom">
  <div class="why-grid">
    <div class="why-text fade-in">
      <p class="section-label">Waarom kascontrole?</p>
      <h2>Elke vereniging is <em>wettelijk verplicht</em> tot kascontrole</h2>
      <p>Volgens de statuten van vrijwel elke vereniging en de Algemene Ledenvergadering (ALV) is het bestuur verplicht verantwoording af te leggen over het financiële beheer. Een kascommissie controleert of de penningmeester en beheerder alles correct hebben geboekt.</p>
      <div class="why-callout">
        <strong>Controleer ook uw beheerder:</strong> Als uw vereniging een externe beheerder heeft — zoals een VvE-beheerder — dan heeft u als lid het recht én de plicht om te controleren of deze partij uw geld correct beheert. Slimme Kascontrole helpt u daarbij.
      </div>
      <p>Traditionele kascontrole is vaak steekproefsgewijs. Met Slimme Kascontrole voert u een <strong>volledige controle</strong> uit — elke factuur, elk saldo, elk boekjaar. Zo staat u sterk op uw ALV.</p>
    </div>
    <div class="why-img fade-in">
      <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=700&q=80" alt="Financiële controle"/>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="how-bg" id="hoe-het-werkt" style="background:#f8fafc">
  <div style="max-width:1100px;margin:0 auto;text-align:center">
    <p class="section-label fade-in" style="text-align:center">Hoe het werkt</p>
    <h2 class="fade-in" style="text-align:center">Drie stappen naar een <em>volledig rapport</em></h2>
    <p class="section-sub centered fade-in">Geen boekhoudkundige kennis vereist. Upload uw bestanden en ontvang uw rapport.</p>
    <div class="steps">
      <div class="step fade-in">
        <img class="step-img" src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80" alt="Documenten downloaden"/>
        <div class="step-body">
          <div class="step-num" style="color:#bfdbfe">01</div>
          <h3>Download uw verenigingsgegevens</h3>
          <p>Download de jaarrekening of het financiële overzicht van uw VvE of vereniging via Twinq, Isabel, uw beheerder of boekhoudprogramma als PDF, Excel of CSV.</p>
        </div>
      </div>
      <div class="step fade-in">
        <img class="step-img" src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80" alt="Veilig uploaden"/>
        <div class="step-body">
          <div class="step-num" style="color:#bfdbfe">02</div>
          <h3>Upload veilig naar uw omgeving</h3>
          <p>Maak een account aan en upload uw bestanden via onze SSL-versleutelde omgeving. Uw gegevens worden nooit gedeeld met derden en veilig opgeslagen in Nederland.</p>
        </div>
      </div>
      <div class="step fade-in">
        <img class="step-img" src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80" alt="Rapport ontvangen"/>
        <div class="step-body">
          <div class="step-num" style="color:#bfdbfe">03</div>
          <h3>Ontvang uw volledig rapport</h3>
          <p>Na eenmalige betaling van €59 incl. btw stellen onze kascontroleurs uw rapport op. Direct als PDF, klaar voor presentatie op uw ALV.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- SOURCES -->
<section id="handleidingen">
  <div style="max-width:1100px;margin:0 auto;text-align:center">
    <p class="section-label fade-in" style="text-align:center">Handleidingen</p>
    <h2 class="fade-in" style="text-align:center">Hoe haalt u uw <em>gegevens op?</em></h2>
    <p class="section-sub centered fade-in">Kies uw boekhoudpakket en volg de stap-voor-stap handleiding om uw bestanden klaar te zetten voor upload.</p>
    <div class="sources-grid">

      <a href="/bronnen/twinq" class="source-card fade-in"><div class="source-icon"><img src="/twinq-logo.jpg" alt="Twinq" style="height:38px;object-fit:contain;"/></div><div class="source-name">Twinq</div><div class="source-desc">Export via Twinq dashboard als Excel of PDF</div><div class="source-link">Hoe exporteer ik? →</div></a>
      <a href="/bronnen/isabel-yuki" class="source-card fade-in"><div class="source-icon">💼</div><div class="source-name">Isabel / Yuki</div><div class="source-desc">Boekhoudexport als CSV of Excel</div><div class="source-link">Hoe exporteer ik? →</div></a>
      <a href="/bronnen/eigen-excel" class="source-card fade-in"><div class="source-icon">📁</div><div class="source-name">Eigen Excel</div><div class="source-desc">Uw eigen kasboek of Excel-overzicht</div><div class="source-link">Hoe aanleveren? →</div></a>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section class="features-bg">
  <div class="features-grid">
    <div>
      <p class="section-label fade-in">Functies</p>
      <h2 class="fade-in">Alles wat een kascommissie <em>nodig heeft</em></h2>
      <p class="section-sub fade-in">Speciaal ontwikkeld voor Nederlandse verenigingen, VvE's en stichtingen.</p>
      <div class="feature-list">
        <div class="feature-item fade-in"><div class="feature-icon">🔍</div><div class="feature-text"><h4>Volledige controle — geen steekproeven</h4><p>Elke factuur, elk saldo, elke boeking wordt gecontroleerd. Geen steekproefsgewijze aanpak meer.</p></div></div>
        <div class="feature-item fade-in"><div class="feature-icon">📅</div><div class="feature-text"><h4>Trendanalyse meerdere jaren</h4><p>Upload bestanden van meerdere jaren voor een diepgaande trendanalyse en vergelijking.</p></div></div>
        <div class="feature-item fade-in"><div class="feature-icon">📋</div><div class="feature-text"><h4>Direct klaar voor de ALV</h4><p>Download als PDF en presenteer direct op uw algemene ledenvergadering.</p></div></div>
        <div class="feature-item fade-in"><div class="feature-icon">🔒</div><div class="feature-text"><h4>Veilig & vertrouwelijk</h4><p>SSL-versleuteld, AVG-conform, data opgeslagen in Nederland. Nooit gedeeld met derden.</p></div></div>
      </div>
    </div>
    <div class="feature-visual fade-in">
      <p class="fv-title">Wat controleren wij?</p>
      <ul class="check-list">
        <li>Klopt het begin- en eindsaldo met de bankafschriften?</li>
        <li>Zijn alle inkomsten volledig verantwoord?</li>
        <li>Kloppen de totalen per categorie?</li>
        <li>Zijn er ongebruikelijke of dubbele posten?</li>
        <li>Is de boekhouding intern consistent?</li>
        <li>Ontbreken er bewijsstukken of toelichting?</li>
        <li>Voldoet het rapport aan de eisen voor de ALV?</li>
        <li>Heeft de beheerder alles correct afgehandeld?</li>
      </ul>
    </div>
  </div>
</section>

<!-- OVER ONS -->
<section id="over-ons">
  <div class="about-grid">
    <div class="about-img fade-in">
      <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=700&q=80" alt="Over Slimme Kascontrole"/>
    </div>
    <div class="fade-in">
      <p class="section-label">Over ons</p>
      <h2>Ontstaan uit eigen <em>ervaring</em></h2>
      <p style="font-size:0.95rem;color:#475569;line-height:1.8;margin-bottom:16px">Slimme Kascontrole is ontstaan vanuit een persoonlijke ervaring. Als lid van de kascommissie van mijn eigen VvE deed ik de kascontrole zelf — en merkte al snel dat dit veel makkelijker, sneller en vollediger kon.</p>
      <p style="font-size:0.95rem;color:#475569;line-height:1.8;margin-bottom:20px">De traditionele kascontrole is vaak steekproefsgewijs: je controleert een paar facturen en hoopt dat de rest klopt. Met Slimme Kascontrole is het anders — <strong>elke factuur, elk saldo, elk boekjaar wordt volledig gecontroleerd</strong>. Zo sta je als kascommissie echt sterk op de ALV.</p>
      <div class="about-quote">
        Ik dacht: dit kan veel makkelijker, veel sneller en veel vollediger. Dat is hoe Slimme Kascontrole is ontstaan — voor iedereen die verantwoordelijk is voor de kascontrole van een vereniging.
        <div style="margin-top:14px;font-style:normal;font-weight:600;color:#0f172a;font-size:0.85rem">Willem-Jan Versteegh · Oprichter Slimme Kascontrole<br/><span style="font-weight:400;color:#475569">Vertras B.V. · Bergschenhoek</span></div>
      </div>
    </div>
  </div>
</section>

<!-- VEILIGHEID -->
<section class="security-bg">
  <div style="max-width:1000px;margin:0 auto;text-align:center">
    <p style="font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#93c5fd;margin-bottom:12px" class="fade-in">Uw gegevens zijn veilig</p>
    <h2 style="color:white;max-width:500px;margin:0 auto 14px" class="fade-in">Wij nemen beveiliging <em style="color:#93c5fd">uiterst serieus</em></h2>
    <p style="color:rgba(255,255,255,0.7);max-width:480px;margin:0 auto 48px;font-size:0.95rem;line-height:1.7" class="fade-in">Financiële gegevens zijn gevoelig. U kunt erop vertrouwen dat uw data veilig is.</p>
    <div class="security-grid">
      <div class="sec-card fade-in"><div class="sec-icon">🔒</div><div class="sec-title">SSL-versleuteling</div><div class="sec-desc">Alle verbindingen zijn beveiligd met 256-bit SSL-encryptie.</div></div>
      <div class="sec-card fade-in"><div class="sec-icon">🇪🇺</div><div class="sec-title">Data in de EU</div><div class="sec-desc">Uw gegevens worden opgeslagen op servers binnen de EU.</div></div>
      <div class="sec-card fade-in"><div class="sec-icon">👁️</div><div class="sec-title">Strikt vertrouwelijk</div><div class="sec-desc">Uw financiële gegevens worden nooit gedeeld met derden.</div></div>
      <div class="sec-card fade-in"><div class="sec-icon">⚖️</div><div class="sec-title">AVG-conform</div><div class="sec-desc">Wij voldoen volledig aan de Europese privacywetgeving.</div></div>
    </div>
  </div>
</section>

<!-- TARIEVEN -->
<section class="pricing-bg" id="tarieven">
  <div style="max-width:760px;margin:0 auto;text-align:center">
    <p class="section-label fade-in" style="text-align:center">Tarieven</p>
    <h2 class="fade-in" style="text-align:center">Eenmalig tarief, <em>geen abonnement</em></h2>
    <p class="section-sub centered fade-in">U betaalt eenmalig €59 incl. btw per kascontrole. U kunt bestanden van meerdere jaren uploaden voor een trendanalyse — maar u betaalt slechts voor één kascontrole.</p>
  </div>
  <div class="pricing-grid">
    <div class="price-card featured fade-in">
      <div class="popular-tag">Meest gekozen</div>
      <h3>Vereniging / VvE</h3>
      <p style="font-size:0.82rem;color:rgba(255,255,255,0.55);margin-bottom:6px">Voor actieve verenigingen</p>
      <div class="price-amount">€ 59</div>
      <p class="price-note">eenmalig incl. btw per kascontrole</p>
      <div class="feat-li">Volledig gecontroleerd rapport</div>
      <div class="feat-li">Trendanalyse tot 4 jaar</div>
      <div class="feat-li">PDF-export voor de ALV</div>
      <div class="feat-li">Geen abonnement</div>
      <div class="feat-li">E-mail ondersteuning</div>
      <a href="/registreer" class="btn-plan btn-plan-blue">Account aanmaken</a>
    </div>
    <div class="price-card fade-in">
      <h3>Koepel</h3>
      <p style="font-size:0.82rem;color:#475569;margin-bottom:6px">Voor meerdere afdelingen</p>
      <div class="price-amount">€ 149</div>
      <p class="price-note">per jaar</p>
      <div class="feat-li">Tot 10 verenigingen</div>
      <div class="feat-li">Centraal beheerportaal</div>
      <div class="feat-li">Geconsolideerde rapportage</div>
      <div class="feat-li">Dedicated support</div>
      <a href="#contact" class="btn-plan btn-plan-outline">Neem contact op</a>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section>
  <div style="max-width:1100px;margin:0 auto;text-align:center">
    <p class="section-label fade-in" style="text-align:center">Ervaringen</p>
    <h2 class="fade-in" style="text-align:center">Wat zeggen onze gebruikers?</h2>
    <p class="section-sub centered fade-in" style="margin:0 auto 48px">Honderden Nederlandse verenigingen werken al met Slimme Kascontrole.</p>
    <div class="testi-grid">
      <div class="testi fade-in"><div class="stars">★★★★★</div><blockquote>"Vroeger kostte onze kascontrole een heel weekend. Nu is het snel klaar en ziet het rapport er ook nog eens professioneel uit."</blockquote><p class="testi-author">Marieke van den Berg</p><p class="testi-role">Penningmeester, SV Oranje</p></div>
      <div class="testi fade-in"><div class="stars">★★★★★</div><blockquote>"De volledige controle vond een dubbele boeking die wij jarenlang over het hoofd hadden gezien. Fijn dat dit nu grondig wordt gecheckt."</blockquote><p class="testi-author">Jan Plomp</p><p class="testi-role">Kascommissielid, Buurtvereniging De Eiken</p></div>
      <div class="testi fade-in"><div class="stars">★★★★★</div><blockquote>"Eindelijk een tool die echt voor verenigingen is gemaakt. Onze leden op de ALV waren onder de indruk van het volledige rapport."</blockquote><p class="testi-author">Sandra Kuipers</p><p class="testi-role">Secretaris, VvE De Linden</p></div>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section id="contact" style="background:var(--cream)">
  <div style="max-width:1100px;margin:0 auto">
    <p class="section-label fade-in" style="text-align:center">Contact</p>
    <h2 class="fade-in" style="text-align:center;margin-bottom:12px">Neem contact <em>op</em></h2>
    <p class="section-sub centered fade-in">Heeft u vragen over Slimme Kascontrole, uw bestelling of uw rapport? Wij helpen u graag verder.</p>
    <div class="contact-grid">
      <!-- Contact info -->
      <div style="display:flex;flex-direction:column;gap:20px">
        <div style="background:white;border-radius:16px;padding:28px;border:1px solid var(--border)" class="fade-in">
          <div style="font-size:1.5rem;margin-bottom:12px">📞</div>
          <h3 style="font-weight:700;color:var(--ink);margin-bottom:4px;font-size:1rem">Bel ons</h3>
          <a href="tel:0624235829" style="color:var(--blue);text-decoration:none;font-weight:600;font-size:1.05rem">06-24235829</a>
          <p style="font-size:0.82rem;color:#94a3b8;margin-top:4px">Bereikbaar op werkdagen</p>
        </div>
        <div style="background:white;border-radius:16px;padding:28px;border:1px solid var(--border)" class="fade-in">
          <div style="font-size:1.5rem;margin-bottom:12px">✉️</div>
          <h3 style="font-weight:700;color:var(--ink);margin-bottom:4px;font-size:1rem">E-mail</h3>
          <a href="mailto:info@slimmekascontrole.nl" style="color:var(--blue);text-decoration:none;font-weight:600;font-size:1rem">info@slimmekascontrole.nl</a>
          <p style="font-size:0.82rem;color:#94a3b8;margin-top:4px">Reactie binnen 1 werkdag</p>
        </div>
        <div style="background:#eff6ff;border-radius:16px;padding:28px;border:1px solid #bfdbfe" class="fade-in">
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
            <img src="/willem-jan.jpg" alt="Willem-Jan Versteegh" style="width:72px;height:72px;border-radius:50%;object-fit:cover;object-position:center top;border:3px solid white;box-shadow:0 2px 12px rgba(0,0,0,0.12)"/>
            <div>
              <div style="font-weight:700;color:var(--ink);font-size:0.95rem">Willem-Jan Versteegh</div>
              <div style="font-size:0.82rem;color:var(--ink-soft)">Oprichter</div>
            </div>
          </div>
          <h3 style="font-weight:700;color:var(--ink);margin-bottom:8px;font-size:1rem">Over ons</h3>
          <p style="font-size:0.88rem;color:var(--ink-soft);line-height:1.6">
            Slimme Kascontrole is een dienst van<br/>
            <strong style="color:var(--ink)">Vertras B.V.</strong><br/>
            Bergschenhoek, Nederland
          </p>
        </div>
      </div>
      <!-- FAQ -->
      <div style="display:flex;flex-direction:column;gap:16px">
        <h2 style="font-weight:700;color:var(--ink);font-size:1.1rem;margin-bottom:4px" class="fade-in">Veelgestelde vragen</h2>
        <div style="background:white;border-radius:12px;padding:20px;border:1px solid var(--border)" class="fade-in">
          <h4 style="font-weight:700;color:var(--ink);font-size:0.9rem;margin-bottom:8px">❓ Hoe snel ontvang ik mijn rapport?</h4>
          <p style="font-size:0.85rem;color:var(--ink-soft);line-height:1.6">Direct na betaling kunt u op "Genereer rapport" klikken. Het rapport wordt automatisch gegenereerd op basis van uw geüploade bestanden.</p>
        </div>
        <div style="background:white;border-radius:12px;padding:20px;border:1px solid var(--border)" class="fade-in">
          <h4 style="font-weight:700;color:var(--ink);font-size:0.9rem;margin-bottom:8px">❓ Welke bestanden kan ik uploaden?</h4>
          <p style="font-size:0.85rem;color:var(--ink-soft);line-height:1.6">PDF, Excel (.xlsx, .xls) en CSV. Exporteer vanuit Twinq, Isabel, Yuki of uw eigen kasboek.</p>
        </div>
        <div style="background:white;border-radius:12px;padding:20px;border:1px solid var(--border)" class="fade-in">
          <h4 style="font-weight:700;color:var(--ink);font-size:0.9rem;margin-bottom:8px">❓ Is mijn financiële data veilig?</h4>
          <p style="font-size:0.85rem;color:var(--ink-soft);line-height:1.6">Ja. Al uw bestanden worden versleuteld opgeslagen in Nederlandse datacenters. Wij delen nooit gegevens met derden.</p>
        </div>
        <div style="background:white;border-radius:12px;padding:20px;border:1px solid var(--border)" class="fade-in">
          <h4 style="font-weight:700;color:var(--ink);font-size:0.9rem;margin-bottom:8px">❓ Kan ik rapporten van meerdere jaren opslaan?</h4>
          <p style="font-size:0.85rem;color:var(--ink-soft);line-height:1.6">Ja, uw omgeving bewaart alle uploads en rapporten. Zo kunt u eenvoudig vergelijken over de jaren heen.</p>
        </div>
        <div style="background:white;border-radius:12px;padding:20px;border:1px solid var(--border)" class="fade-in">
          <h4 style="font-weight:700;color:var(--ink);font-size:0.9rem;margin-bottom:8px">❓ Wat als ik hulp nodig heb?</h4>
          <p style="font-size:0.85rem;color:var(--ink-soft);line-height:1.6">Bel of mail ons gerust. Wij helpen u door het proces en zorgen dat uw rapport er professioneel uitziet.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-bg">
  <p class="section-label fade-in" style="color:rgba(255,255,255,0.7)">Aan de slag</p>
  <h2 class="fade-in" style="max-width:520px;margin:0 auto 14px">Klaar voor uw volgende ALV?</h2>
  <p class="section-sub fade-in" style="color:rgba(255,255,255,0.75);margin:0 auto 36px;max-width:460px">Maak een account aan, upload uw bestanden en ontvang uw volledig gecontroleerde kascontrolerapport. Eenmalig €59 incl. btw — geen abonnement.</p>
  <div class="fade-in">
    <a href="/registreer" class="btn-white">Account aanmaken</a>
    <a href="/mijn-omgeving" class="btn-ghost-blue">Inloggen →</a>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <a href="/" class="footer-logo">
    <div style="background:#2563EB;width:34px;height:34px;border-radius:7px;display:flex;align-items:center;justify-content:center">
      <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div style="line-height:1.1">
      <div style="font-weight:700;font-size:0.9rem;color:white">slimme</div>
      <div style="font-weight:500;font-size:0.9rem;color:rgba(255,255,255,0.6)">kascontrole</div>
    </div>
  </a>
  <span>© 2026 Slimme Kascontrole · Een dienst van Vertras B.V.</span>
  <div class="footer-links">
    <a href="/voorwaarden">Voorwaarden</a>
    <a href="#contact">Contact</a>
    <a href="/mijn-omgeving">Mijn omgeving</a>
    <a href="/registreer">Account aanmaken</a>
  </div>
</footer>

<script>
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>10)
})
const obs=new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('visible'),i*60)})
},{threshold:0.1})
document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el))

function toggleMenu(){
  const menu=document.getElementById('mobile-menu')
  const b1=document.getElementById('bar1')
  const b2=document.getElementById('bar2')
  const b3=document.getElementById('bar3')
  const open=menu.style.display==='block'
  menu.style.display=open?'none':'block'
  b1.style.transform=open?'':'rotate(45deg) translate(5px,5px)'
  b2.style.opacity=open?'1':'0'
  b3.style.transform=open?'':'rotate(-45deg) translate(5px,-5px)'
}
function closeMenu(){
  document.getElementById('mobile-menu').style.display='none'
  document.getElementById('bar1').style.transform=''
  document.getElementById('bar2').style.opacity='1'
  document.getElementById('bar3').style.transform=''
}
document.addEventListener('click',function(e){
  const menu=document.getElementById('mobile-menu')
  const ham=document.getElementById('hamburger')
  if(menu&&menu.style.display==='block'&&!menu.contains(e.target)&&!ham.contains(e.target))closeMenu()
})
</script>
</body>
</html>`
