import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Slimme Kascontrole – Uw kascontrole klaar voor de ALV',
  description: 'Professioneel kascontrolerapport voor uw vereniging. Voor slechts €59.',
}

export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: getLandingHTML() }} />
  )
}

function getLandingHTML() {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,500&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --blue:#2563EB;--blue-dark:#1D4ED8;--blue-deeper:#1e3a8a;
  --blue-light:#93c5fd;--blue-pale:#eff6ff;--blue-mid:#3b82f6;
  --gold:#f59e0b;--white:#ffffff;--ink:#0f172a;--ink-soft:#475569;
  --cream:#f8fafc;--border:#e2e8f0;
}
html{scroll-behavior:smooth}
body{font-family:'Outfit',sans-serif;color:var(--ink);background:var(--white);overflow-x:hidden}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 48px;height:72px;display:flex;align-items:center;justify-content:space-between;transition:box-shadow 0.3s}
nav.scrolled{box-shadow:0 4px 24px rgba(0,0,0,0.08)}
.nav-links{display:flex;gap:32px;list-style:none;align-items:center}
.nav-links a{font-size:0.9rem;font-weight:500;color:var(--ink-soft);text-decoration:none;transition:color 0.2s}
.nav-links a:hover{color:var(--blue)}
.btn-nav{background:var(--blue);color:white!important;padding:10px 22px;border-radius:6px;font-weight:600;transition:background 0.2s!important}
.btn-nav:hover{background:var(--blue-dark)!important}

/* HERO */
h1{font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4vw,3.4rem);font-weight:700;line-height:1.1;color:var(--ink);margin-bottom:20px;animation:fadeUp 0.6s 0.1s ease both;letter-spacing:-0.02em}
h1 .accent{color:var(--blue)}
h1 em{font-style:italic;font-weight:500}
.hero-sub{font-size:1.05rem;color:var(--ink-soft);font-weight:400;line-height:1.7;max-width:500px;margin-bottom:36px;animation:fadeUp 0.6s 0.2s ease both}
.hero-ctas{display:flex;gap:16px;align-items:center;flex-wrap:wrap;animation:fadeUp 0.6s 0.3s ease both}
.btn-primary{background:var(--blue);color:white;padding:15px 32px;border-radius:8px;font-size:0.95rem;font-weight:600;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s,background 0.2s;box-shadow:0 4px 16px rgba(37,99,235,0.3);font-family:'Outfit',sans-serif}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(37,99,235,0.4);background:var(--blue-dark)}
.btn-ghost{color:var(--blue);font-size:0.95rem;font-weight:500;text-decoration:none;display:flex;align-items:center;gap:6px;transition:gap 0.2s}
.btn-ghost:hover{gap:10px}
.btn-ghost::after{content:'→'}
.price-amount{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:var(--blue)}

/* HERO IMAGE */

/* TRUST BAR */
.trust-bar{background:var(--blue-deeper);padding:20px 48px;display:flex;align-items:center;justify-content:center;gap:48px;flex-wrap:wrap}
.trust-item{display:flex;align-items:center;gap:10px;color:rgba(255,255,255,0.8);font-size:0.85rem}
.trust-item strong{color:white}
.trust-dot{width:6px;height:6px;background:var(--blue-light);border-radius:50%}

/* SECTIONS */
section{padding:96px 48px}
.section-label{font-size:0.72rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--blue);margin-bottom:14px}
h2{font-family:'Playfair Display',serif;font-size:clamp(1.8rem,3vw,2.6rem);font-weight:700;color:var(--ink);letter-spacing:-0.02em;line-height:1.15;margin-bottom:16px}
h2 em{font-style:italic;color:var(--blue)}
.section-sub{font-size:1rem;color:var(--ink-soft);font-weight:400;line-height:1.7;max-width:560px;margin-bottom:56px}

/* WHY SECTION */
.why-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;max-width:1100px;margin:0 auto}
.why-text p{font-size:0.95rem;color:var(--ink-soft);line-height:1.8;margin-bottom:16px}
.why-text p strong{color:var(--ink)}
.why-callout{background:var(--blue-pale);border-left:4px solid var(--blue);border-radius:0 12px 12px 0;padding:20px 24px;margin:24px 0;font-size:0.9rem;color:var(--blue-deeper);line-height:1.7}
.why-image{border-radius:16px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,0.1)}
.why-image img{width:100%;height:400px;object-fit:cover;display:block}

/* HOW IT WORKS */
.how-bg{background:var(--cream)}
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:40px;max-width:1100px;margin:0 auto}
.step{background:white;border-radius:16px;padding:36px;border:1px solid var(--border);transition:transform 0.2s,box-shadow 0.2s;position:relative}
.step:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.08)}
.step-num{font-family:'Playfair Display',serif;font-size:3rem;font-weight:700;color:var(--blue-pale);line-height:1;margin-bottom:16px}
.step-icon{width:52px;height:52px;background:var(--blue-pale);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin-bottom:20px}
.step h3{font-family:'Outfit',sans-serif;font-size:1.1rem;font-weight:700;color:var(--ink);margin-bottom:10px}
.step p{font-size:0.88rem;color:var(--ink-soft);line-height:1.7}

/* SOURCES */
.sources-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;max-width:1100px;margin:0 auto}
.source-card{background:white;border-radius:12px;padding:24px;border:1px solid var(--border);text-align:center;transition:transform 0.2s,box-shadow 0.2s}
.source-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.08)}
.source-icon{font-size:2rem;margin-bottom:12px}
.source-name{font-weight:700;color:var(--ink);font-size:0.95rem;margin-bottom:4px}
.source-desc{font-size:0.78rem;color:var(--ink-soft)}

/* FEATURES */
.features-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;max-width:1100px;margin:0 auto}
.feature-list{display:flex;flex-direction:column;gap:24px}
.feature-item{display:flex;gap:16px;align-items:flex-start}
.feature-icon{width:44px;height:44px;background:var(--blue-pale);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;transition:background 0.2s}
.feature-item:hover .feature-icon{background:var(--blue-light)}
.feature-text h4{font-weight:700;color:var(--ink);font-size:0.95rem;margin-bottom:4px}
.feature-text p{font-size:0.85rem;color:var(--ink-soft);line-height:1.6}
.feature-visual{background:var(--blue-deeper);border-radius:20px;padding:40px;color:white;position:relative;overflow:hidden}
.feature-visual::before{content:'';position:absolute;top:-60px;right:-60px;width:200px;height:200px;background:radial-gradient(circle,rgba(147,197,253,0.15) 0%,transparent 70%)}
.fv-title{font-family:'Playfair Display',serif;font-size:1.1rem;margin-bottom:24px;color:var(--blue-light)}
.check-list{list-style:none;display:flex;flex-direction:column;gap:14px}
.check-list li{display:flex;gap:12px;font-size:0.88rem;color:rgba(255,255,255,0.8);line-height:1.5}
.check-list li::before{content:'✓';color:var(--blue-light);font-weight:700;flex-shrink:0}

/* PRICING */
.pricing-bg{background:var(--cream)}
.pricing-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;max-width:760px;margin:0 auto}
.price-card{background:white;border-radius:16px;padding:36px;border:2px solid var(--border);transition:transform 0.2s,box-shadow 0.2s;position:relative}
.price-card:hover{transform:translateY(-4px);box-shadow:0 16px 48px rgba(0,0,0,0.08)}
.price-card.featured{border-color:var(--blue);background:var(--blue-deeper);color:white}
.price-card.featured h3,.price-card.featured .price-amount{color:white}
.price-card.featured .price-sub{color:rgba(255,255,255,0.6)}
.price-card.featured .feat-li{color:rgba(255,255,255,0.85)}
.price-card.featured .feat-li::before{color:var(--blue-light)}
.popular-tag{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--gold);color:white;font-size:0.7rem;font-weight:700;padding:4px 14px;border-radius:20px;letter-spacing:0.05em;text-transform:uppercase;white-space:nowrap}
.price-card h3{font-family:'Outfit',sans-serif;font-size:1.1rem;font-weight:700;color:var(--ink);margin-bottom:6px}
.price-amount{font-family:'Playfair Display',serif;font-size:2.6rem;font-weight:700;color:var(--ink);line-height:1;margin:16px 0 4px}
.price-sub{font-size:0.82rem;color:var(--ink-soft);margin-bottom:24px}
.feat-li{font-size:0.87rem;color:var(--ink-soft);display:flex;gap:8px;margin-bottom:10px;align-items:flex-start}
.feat-li::before{content:'✓';color:var(--blue);font-weight:700;flex-shrink:0;margin-top:1px}
.btn-plan{display:block;text-align:center;margin-top:28px;padding:13px;border-radius:8px;font-size:0.9rem;font-weight:600;text-decoration:none;transition:all 0.2s;font-family:'Outfit',sans-serif}
.btn-plan-outline{border:1.5px solid var(--blue-light);color:var(--blue)}
.btn-plan-outline:hover{background:var(--blue-pale)}
.btn-plan-solid{background:var(--gold);color:white}
.btn-plan-solid:hover{background:#d97706}

/* TESTIMONIALS */
.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;max-width:1100px;margin:0 auto}
.testi{background:white;border-radius:16px;padding:32px;border:1px solid var(--border)}
.stars{font-size:0.85rem;color:var(--gold);letter-spacing:3px;margin-bottom:14px}
.testi blockquote{font-size:0.9rem;color:var(--ink-soft);line-height:1.7;margin-bottom:20px;font-style:italic}
.testi-author{font-size:0.85rem;font-weight:700;color:var(--ink)}
.testi-role{font-size:0.78rem;color:var(--ink-soft)}

/* CTA */
.cta-section{background:var(--blue);color:white;text-align:center}
.cta-section h2{color:white;font-family:'Playfair Display',serif}
.cta-section .section-label{color:rgba(255,255,255,0.7)}
.cta-section .section-sub{color:rgba(255,255,255,0.7);margin:0 auto 40px}
.btn-cta-white{background:white;color:var(--blue);padding:16px 40px;border-radius:8px;font-size:1rem;font-weight:700;text-decoration:none;transition:transform 0.2s,box-shadow 0.2s;display:inline-block;font-family:'Outfit',sans-serif}
.btn-cta-white:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.2)}
.btn-cta-ghost{color:rgba(255,255,255,0.8);font-size:0.95rem;font-weight:500;text-decoration:none;display:inline-flex;align-items:center;gap:6px;margin-left:24px;transition:color 0.2s}
.btn-cta-ghost:hover{color:white}
.btn-cta-ghost::after{content:'→'}

/* FOOTER */
footer{background:#0f172a;color:rgba(255,255,255,0.5);padding:48px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;font-size:0.83rem}
footer a{color:rgba(255,255,255,0.5);text-decoration:none;margin-left:24px}
footer a:hover{color:var(--blue-light)}

/* ANIMATIONS */
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.fade-in{opacity:0;transform:translateY(20px);transition:opacity 0.7s ease,transform 0.7s ease}
.fade-in.visible{opacity:1;transform:translateY(0)}

/* RESPONSIVE */
@media(max-width:900px){
  nav{padding:0 20px}
  .nav-links{display:none}
  .hero{grid-template-columns:1fr;padding:100px 24px 60px}
  .hero-image{display:none}
  section{padding:64px 24px}
  .steps,.sources-grid,.testi-grid{grid-template-columns:1fr}
  .features-grid,.why-grid,.pricing-grid{grid-template-columns:1fr}
  .trust-bar{padding:16px 24px;gap:20px}
  footer{flex-direction:column;text-align:center}
  footer a{margin:0 12px}
}
</style>
</head>
<body>

<!-- NAV -->
<nav id="navbar">
  <a href="/" style="display:inline-flex;align-items:center;gap:10px;text-decoration:none">
    <div style="background:#2563EB;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center">
      <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div style="line-height:1.1">
      <div style="font-weight:700;font-size:1.05rem;color:#1D4ED8;font-family:Outfit,sans-serif">slimme</div>
      <div style="font-weight:500;font-size:1.05rem;color:#3b82f6;font-family:Outfit,sans-serif">kascontrole</div>
    </div>
  </a>
  <ul class="nav-links">
    <li><a href="#waarom">Waarom</a></li>
    <li><a href="#hoe-het-werkt">Hoe het werkt</a></li>
    <li><a href="#tarieven">Tarieven</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/mijn-omgeving">Mijn omgeving</a></li>
    <li><a href="/registreer" class="btn-nav">Account aanmaken</a></li>
  </ul>
</nav>

<!-- HERO -->
<section style="position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;padding-top:72px">
  <div style="position:absolute;inset:0;z-index:0">
    <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=85" alt="Kascontrole" style="width:100%;height:100%;object-fit:cover;object-position:center top"/>
    <div style="position:absolute;inset:0;background:linear-gradient(105deg,rgba(15,23,42,0.90) 0%,rgba(30,58,138,0.80) 45%,rgba(15,23,42,0.50) 100%)"></div>
  </div>
  <div style="position:relative;z-index:1;max-width:1100px;margin:0 auto;padding:80px 48px;width:100%">
    <div style="max-width:640px">
      <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(37,99,235,0.3);border:1px solid rgba(147,197,253,0.4);color:#93c5fd;font-size:0.78rem;font-weight:600;padding:6px 14px;border-radius:20px;margin-bottom:28px;letter-spacing:0.04em;text-transform:uppercase;animation:fadeUp 0.6s ease both">✦ Verplicht voor elke vereniging</div>
      <h1 style="font-family:'Playfair Display',serif;font-size:clamp(2.4rem,4.5vw,3.8rem);font-weight:700;line-height:1.1;color:white;margin-bottom:20px;letter-spacing:-0.02em;animation:fadeUp 0.6s 0.1s ease both">Uw kascontrole klaar<br/>voor de <em style="font-style:italic;font-weight:400;color:#93c5fd">volgende ALV</em></h1>
      <p style="font-size:1.1rem;color:rgba(255,255,255,0.88);font-weight:400;line-height:1.7;max-width:520px;margin-bottom:36px;animation:fadeUp 0.6s 0.2s ease both">Upload uw financiële bestanden en ontvang een volledig gecontroleerd kascontrolerapport, opgesteld door onze kascontroleurs. Betrouwbaar, veilig en conform de wettelijke eisen.</p>
      <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:44px;animation:fadeUp 0.6s 0.3s ease both">
        <a href="/registreer" style="background:#2563EB;color:white;padding:16px 36px;border-radius:8px;font-size:1rem;font-weight:700;text-decoration:none;box-shadow:0 4px 20px rgba(37,99,235,0.5);font-family:Outfit,sans-serif;display:inline-block">Account aanmaken</a>
        <a href="#hoe-het-werkt" style="color:rgba(255,255,255,0.85);font-size:0.95rem;font-weight:500;text-decoration:none;display:flex;align-items:center;gap:6px">Bekijk hoe het werkt →</a>
      </div>
      <div style="display:inline-flex;align-items:center;gap:20px;padding:18px 24px;background:rgba(255,255,255,0.10);backdrop-filter:blur(12px);border-radius:12px;border:1px solid rgba(255,255,255,0.18);animation:fadeUp 0.6s 0.4s ease both">
        <div>
          <div style="font-size:0.7rem;font-weight:600;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:2px">Prijs per boekjaar</div>
          <div style="display:flex;align-items:baseline;gap:2px">
            <span style="font-size:1rem;font-weight:700;color:#93c5fd">€</span>
            <span style="font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:700;color:white;line-height:1">59</span>
          </div>
        </div>
        <div style="width:1px;height:48px;background:rgba(255,255,255,0.18)"></div>
        <div style="display:flex;flex-direction:column;gap:7px">
          <div style="font-size:0.83rem;color:rgba(255,255,255,0.88);display:flex;align-items:center;gap:8px"><span style="color:#93c5fd;font-weight:700">✓</span> Volledig gecontroleerd rapport</div>
          <div style="font-size:0.83rem;color:rgba(255,255,255,0.88);display:flex;align-items:center;gap:8px"><span style="color:#93c5fd;font-weight:700">✓</span> Trendanalyse meerdere jaren</div>
          <div style="font-size:0.83rem;color:rgba(255,255,255,0.88);display:flex;align-items:center;gap:8px"><span style="color:#93c5fd;font-weight:700">✓</span> PDF-export voor de ALV</div>
        </div>
      </div>
    </div>
    <div style="position:absolute;bottom:32px;right:48px;display:flex;gap:10px;flex-wrap:wrap">
      <div style="background:rgba(255,255,255,0.10);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.18);border-radius:8px;padding:9px 14px;font-size:0.78rem;color:white;display:flex;align-items:center;gap:6px">🔒 SSL-versleuteld</div>
      <div style="background:rgba(255,255,255,0.10);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.18);border-radius:8px;padding:9px 14px;font-size:0.78rem;color:white;display:flex;align-items:center;gap:6px">🏛️ AVG-conform</div>
      <div style="background:rgba(255,255,255,0.10);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.18);border-radius:8px;padding:9px 14px;font-size:0.78rem;color:white;display:flex;align-items:center;gap:6px">🇳🇱 Data in Nederland</div>
    </div>
  </div>
</section>

<!-- TRUST BAR -->
<div style="background:#1e3a8a;padding:18px 48px;display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:nowrap;overflow:hidden">
  <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.85);font-size:0.82rem;white-space:nowrap"><span>🔒</span><span><strong style="color:white">Veilig & privé</strong> — versleuteld</span></div>
  <div style="width:4px;height:4px;background:rgba(255,255,255,0.3);border-radius:50%;flex-shrink:0"></div>
  <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.85);font-size:0.82rem;white-space:nowrap"><span>⚡</span><span><strong style="color:white">Rapport binnen minuten</strong> — AI analyseert direct</span></div>
  <div style="width:4px;height:4px;background:rgba(255,255,255,0.3);border-radius:50%;flex-shrink:0"></div>
  <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.85);font-size:0.82rem;white-space:nowrap"><span>📄</span><span><strong style="color:white">PDF-export</strong> — direct voor de ALV</span></div>
  <div style="width:4px;height:4px;background:rgba(255,255,255,0.3);border-radius:50%;flex-shrink:0"></div>
  <div style="display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.85);font-size:0.82rem;white-space:nowrap"><span>🏛️</span><span><strong style="color:white">Wettelijk verplicht</strong> — wij regelen het</span></div>
</div>

<!-- WAAROM SECTIE -->
<section id="waarom">
  <div class="why-grid">
    <div class="why-text fade-in">
      <p class="section-label">Waarom kascontrole?</p>
      <h2>Elke vereniging is <em>wettelijk verplicht</em> tot kascontrole</h2>
      <p>Volgens de statuten van vrijwel elke vereniging én de algemene ledenvergadering (ALV) is het bestuur verplicht verantwoording af te leggen over het financiële beheer. Een kascommissie controleert of de penningmeester en beheerder alles correct hebben geboekt.</p>
      <div class="why-callout">
        <strong>Belangrijk:</strong> Als uw vereniging een externe beheerder heeft — zoals een VvE-beheerder of sportbeheerder — dan heeft u als lid het recht én de plicht om te controleren of deze partij uw geld correct beheert. Slimme Kascontrole helpt u daarbij.
      </div>
      <p>Veel kascommissies missen de tijd of kennis om een gedegen rapport op te stellen. Slimme Kascontrole neemt dit werk volledig van u over — u uploadt de stukken, wij leveren het rapport.</p>
    </div>
    <div class="why-image fade-in">
      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80" alt="Financiële controle" loading="lazy"/>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section class="how-bg" id="hoe-het-werkt">
  <div style="max-width:1100px;margin:0 auto;text-align:center">
    <p class="section-label fade-in">Hoe het werkt</p>
    <h2 class="fade-in">Drie stappen naar een <em>perfect rapport</em></h2>
    <p class="section-sub fade-in" style="margin:0 auto 56px">Geen boekhoudkundige kennis vereist. Upload uw bestanden en ontvang direct een professioneel rapport.</p>
    <div class="steps">
      <div class="step fade-in">
        <div class="step-num">01</div>
        <div class="step-icon">🏦</div>
        <h3>Download uw verenigingsgegevens</h3>
        <p>Download de jaarrekening of het financiële overzicht van uw VVE of vereniging via Twinq, Isabel, uw beheerder of boekhoudprogramma als PDF, Excel of CSV.</p>
      </div>
      <div class="step fade-in">
        <div class="step-num">02</div>
        <div class="step-icon">📤</div>
        <h3>Upload naar uw omgeving</h3>
        <p>Maak een account aan, upload uw bestanden en voeg eventueel een toelichting toe. Alles staat veilig opgeslagen.</p>
      </div>
      <div class="step fade-in">
        <div class="step-num">03</div>
        <div class="step-icon">📊</div>
        <h3>Ontvang uw rapport</h3>
        <p>Na betaling van €59 analyseert onze AI uw bestanden en genereert direct een professioneel kascontrolerapport als PDF.</p>
      </div>
    </div>
  </div>
</section>

<!-- BRONNEN SECTIE -->
<section>
  <div style="max-width:1100px;margin:0 auto;text-align:center">
    <p class="section-label fade-in">Waar haalt u uw gegevens vandaan?</p>
    <h2 class="fade-in">Ondersteunde <em>bronnen</em></h2>
    <p class="section-sub fade-in" style="margin:0 auto 48px">Wij verwerken bestanden uit alle gangbare boekhoud- en banksystemen.</p>
    <div class="sources-grid">
      <div class="source-card fade-in">
        <div class="source-icon">🏦</div>
        <div class="source-name">Uw bank</div>
        <div class="source-desc">ING, Rabobank, ABN AMRO — exporteer als PDF of CSV</div>
      </div>
      <div class="source-card fade-in">
        <div class="source-icon">📊</div>
        <div class="source-name">Twinq</div>
        <div class="source-desc">Export via Twinq dashboard als Excel of PDF</div>
      </div>
      <div class="source-card fade-in">
        <div class="source-icon">💼</div>
        <div class="source-name">Isabel / Yuki</div>
        <div class="source-desc">Boekhoudexport als CSV of Excel</div>
      </div>
      <div class="source-card fade-in">
        <div class="source-icon">📁</div>
        <div class="source-name">Eigen Excel</div>
        <div class="source-desc">Uw eigen kasboek of Excel-overzicht</div>
      </div>
    </div>
  </div>
</section>

<!-- FEATURES -->
<section style="background:var(--cream)">
  <div class="features-grid">
    <div>
      <p class="section-label fade-in">Functies</p>
      <h2 class="fade-in">Alles wat een kascommissie <em>nodig heeft</em></h2>
      <p class="section-sub fade-in">Speciaal ontwikkeld voor Nederlandse verenigingen, VvE's en stichtingen.</p>
      <div class="feature-list">
        <div class="feature-item fade-in">
          <div class="feature-icon">🤖</div>
          <div class="feature-text">
            <h4>AI-analyse van uw bestanden</h4>
            <p>Upload PDF, Excel of CSV — onze AI leest en analyseert alles automatisch.</p>
          </div>
        </div>
        <div class="feature-item fade-in">
          <div class="feature-icon">🔍</div>
          <div class="feature-text">
            <h4>Automatische controle</h4>
            <p>Saldi, categorieën en afwijkingen worden automatisch gedetecteerd en gemarkeerd.</p>
          </div>
        </div>
        <div class="feature-item fade-in">
          <div class="feature-icon">📅</div>
          <div class="feature-text">
            <h4>Meerdere boekjaren</h4>
            <p>Bewaar rapporten van meerdere jaren en volg trends in uw financiële gezondheid.</p>
          </div>
        </div>
        <div class="feature-item fade-in">
          <div class="feature-icon">📋</div>
          <div class="feature-text">
            <h4>Direct klaar voor de ALV</h4>
            <p>Download als PDF en presenteer direct op uw algemene ledenvergadering.</p>
          </div>
        </div>
      </div>
    </div>
    <div class="feature-visual fade-in">
      <p class="fv-title">Wat controleert Slimme Kascontrole?</p>
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

<!-- TARIEVEN -->
<section class="pricing-bg" id="tarieven">
  <div style="max-width:760px;margin:0 auto;text-align:center">
    <p class="section-label fade-in">Tarieven</p>
    <h2 class="fade-in">Eerlijke prijzen, <em>geen verrassingen</em></h2>
    <p class="section-sub fade-in" style="margin:0 auto 56px">Kies het plan dat past bij uw vereniging.</p>
  </div>
  <div class="pricing-grid">
    <div class="price-card featured fade-in">
      <div class="popular-tag">Meest gekozen</div>
      <h3>Vereniging</h3>
      <p style="font-size:0.85rem;color:rgba(255,255,255,0.55);margin-bottom:8px">Voor actieve verenigingen</p>
      <div class="price-amount">€ 59</div>
      <p class="price-sub">per boekjaar</p>
      <div class="feat-li">Onbeperkt bestanden uploaden</div>
      <div class="feat-li">AI-analyse & afwijkingsdetectie</div>
      <div class="feat-li">Meerdere boekjaren bewaren</div>
      <div class="feat-li">PDF-export voor de ALV</div>
      <div class="feat-li">E-mail ondersteuning</div>
      <a href="/registreer" class="btn-plan btn-plan-solid">Account aanmaken</a>
    </div>
    <div class="price-card fade-in">
      <h3>Koepel</h3>
      <p style="font-size:0.85rem;color:var(--ink-soft);margin-bottom:8px">Voor meerdere afdelingen</p>
      <div class="price-amount">€ 149</div>
      <p class="price-sub">per jaar</p>
      <div class="feat-li">Tot 10 verenigingen</div>
      <div class="feat-li">Centraal beheerportaal</div>
      <div class="feat-li">Geconsolideerde rapportage</div>
      <div class="feat-li">Dedicated support</div>
      <a href="/registreer" class="btn-plan btn-plan-outline">Neem contact op</a>
    </div>
  </div>
</section>

<!-- VEILIGHEID -->
<section style="background:var(--blue-deeper);color:white">
  <div style="max-width:1100px;margin:0 auto;text-align:center">
    <p style="font-size:0.72rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--blue-light);margin-bottom:14px" class="fade-in">Uw gegevens zijn veilig</p>
    <h2 style="color:white;max-width:560px;margin:0 auto 16px" class="fade-in">Wij nemen de beveiliging van uw gegevens <em>uiterst serieus</em></h2>
    <p style="color:rgba(255,255,255,0.7);max-width:520px;margin:0 auto 56px;font-size:1rem;line-height:1.7" class="fade-in">Financiële gegevens zijn gevoelig. Daarom hebben wij meerdere beveiligingslagen ingebouwd om uw data te beschermen.</p>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:24px;max-width:1000px;margin:0 auto">
      <div class="fade-in" style="background:rgba(255,255,255,0.08);border-radius:16px;padding:28px 20px;border:1px solid rgba(255,255,255,0.12)">
        <div style="font-size:2rem;margin-bottom:12px">🔒</div>
        <h4 style="font-weight:700;color:white;font-size:0.95rem;margin-bottom:8px">SSL-versleuteling</h4>
        <p style="font-size:0.82rem;color:rgba(255,255,255,0.65);line-height:1.6">Alle verbindingen zijn beveiligd met 256-bit SSL-encryptie.</p>
      </div>
      <div class="fade-in" style="background:rgba(255,255,255,0.08);border-radius:16px;padding:28px 20px;border:1px solid rgba(255,255,255,0.12)">
        <div style="font-size:2rem;margin-bottom:12px">🇳🇱</div>
        <h4 style="font-weight:700;color:white;font-size:0.95rem;margin-bottom:8px">Data in Nederland</h4>
        <p style="font-size:0.82rem;color:rgba(255,255,255,0.65);line-height:1.6">Uw gegevens worden opgeslagen op servers binnen de EU.</p>
      </div>
      <div class="fade-in" style="background:rgba(255,255,255,0.08);border-radius:16px;padding:28px 20px;border:1px solid rgba(255,255,255,0.12)">
        <div style="font-size:2rem;margin-bottom:12px">👁️</div>
        <h4 style="font-weight:700;color:white;font-size:0.95rem;margin-bottom:8px">Strikt vertrouwelijk</h4>
        <p style="font-size:0.82rem;color:rgba(255,255,255,0.65);line-height:1.6">Uw financiële gegevens worden nooit gedeeld met derden.</p>
      </div>
      <div class="fade-in" style="background:rgba(255,255,255,0.08);border-radius:16px;padding:28px 20px;border:1px solid rgba(255,255,255,0.12)">
        <div style="font-size:2rem;margin-bottom:12px">⚖️</div>
        <h4 style="font-weight:700;color:white;font-size:0.95rem;margin-bottom:8px">AVG-conform</h4>
        <p style="font-size:0.82rem;color:rgba(255,255,255,0.65);line-height:1.6">Wij voldoen volledig aan de Europese privacywetgeving (AVG/GDPR).</p>
      </div>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section>
  <div style="max-width:1100px;margin:0 auto;text-align:center">
    <p class="section-label fade-in">Ervaringen</p>
    <h2 class="fade-in">Wat zeggen onze gebruikers?</h2>
    <p class="section-sub fade-in" style="margin:0 auto 56px">Honderden Nederlandse verenigingen werken al met Slimme Kascontrole.</p>
    <div class="testi-grid">
      <div class="testi fade-in">
        <div class="stars">★★★★★</div>
        <blockquote>"Vroeger kostte onze kascontrole een heel weekend. Nu is het in een uurtje klaar en ziet het rapport er ook nog eens professioneel uit."</blockquote>
        <p class="testi-author">Marieke van den Berg</p>
        <p class="testi-role">Penningmeester, SV Oranje</p>
      </div>
      <div class="testi fade-in">
        <div class="stars">★★★★★</div>
        <blockquote>"De automatische controle vond een dubbele boeking die wij jarenlang over het hoofd hadden gezien. Ontzettend fijn dat dit nu automatisch gaat."</blockquote>
        <p class="testi-author">Jan Plomp</p>
        <p class="testi-role">Kascommissielid, Buurtvereniging De Eiken</p>
      </div>
      <div class="testi fade-in">
        <div class="stars">★★★★★</div>
        <blockquote>"Eindelijk een tool die echt voor verenigingen is gemaakt. Onze leden op de ALV waren onder de indruk van het professionele rapport."</blockquote>
        <p class="testi-author">Sandra Kuipers</p>
        <p class="testi-role">Secretaris, VvE De Linden</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section" id="contact">
  <p class="section-label fade-in">Aan de slag</p>
  <h2 class="fade-in" style="max-width:560px;margin:0 auto 16px">Klaar voor uw volgende ALV?</h2>
  <p class="section-sub fade-in" style="color:rgba(255,255,255,0.7);margin:0 auto 40px;max-width:480px">Maak een account aan, upload uw bestanden en ontvang uw kascontrolerapport voor €59 per boekjaar.</p>
  <div class="fade-in">
    <a href="/registreer" class="btn-cta-white">Account aanmaken</a>
    <a href="/mijn-omgeving" class="btn-cta-ghost">Inloggen</a>
  </div>
</section>

<!-- FOOTER -->
<footer>
  <a href="/" style="display:inline-flex;align-items:center;gap:10px;text-decoration:none">
    <div style="background:#2563EB;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center">
      <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div style="line-height:1.1">
      <div style="font-weight:700;font-size:0.95rem;color:white;font-family:Outfit,sans-serif">slimme</div>
      <div style="font-weight:500;font-size:0.95rem;color:rgba(255,255,255,0.6);font-family:Outfit,sans-serif">kascontrole</div>
    </div>
  </a>
  <span>© 2025 SlimmeKascontrole.nl — Alle rechten voorbehouden</span>
  <div>
    <a href="#">Privacy</a>
    <a href="#">Voorwaarden</a>
    <a href="/registreer">Contact</a>
  </div>
</footer>

<script>
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>10)
})
const obs=new IntersectionObserver((entries)=>{
  entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('visible'),i*80)})
},{threshold:0.1})
document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el))
</script>
</body>
</html>`
}
