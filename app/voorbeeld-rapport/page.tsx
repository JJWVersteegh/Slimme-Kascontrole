import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Voorbeeldrapport kascontrole VvE | Slimme Kascontrole',
  description: 'Bekijk een fictief voorbeeld van een professioneel kascontrolerapport voor een VvE. Zo ziet u exact wat u ontvangt.',
}

export default function VoorbeeldRapportPage() {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8"/>
<title>Voorbeeldrapport Kascontrole - Slimme Kascontrole</title>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:'Outfit',sans-serif;color:#0f172a;background:#f8fafc;overflow-x:hidden}
a{text-decoration:none}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.97);backdrop-filter:blur(12px);border-bottom:1px solid #e2e8f0;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 48px}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
.nav-logo-icon{background:#2563EB;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center}

.nav-links{display:flex;gap:28px;list-style:none;align-items:center;flex-wrap:nowrap}
.nav-links a{font-size:0.88rem;font-weight:500;color:#475569;text-decoration:none;transition:color 0.2s;white-space:nowrap}
.nav-links a:hover{color:#2563EB}
.btn-nav{background:#2563EB;color:white!important;padding:10px 22px;border-radius:6px;font-weight:700}
.btn-nav:hover{background:#1D4ED8!important}
.hamburger{display:none;background:none;border:1.5px solid #e2e8f0;border-radius:6px;cursor:pointer;padding:7px;flex-direction:column;gap:4px;align-items:center;justify-content:center}
.ham-bar{display:block;width:20px;height:2px;background:#0f172a;border-radius:2px}
.mobile-menu{display:none;position:fixed;top:72px;left:0;right:0;background:white;border-bottom:1px solid #e2e8f0;z-index:199;padding:12px 20px 20px;box-shadow:0 8px 24px rgba(0,0,0,0.1)}
.mobile-menu a{display:block;padding:12px 16px;color:#0f172a;text-decoration:none;font-weight:500;border-radius:8px;font-size:0.95rem}
.mobile-menu a:hover{background:#f8fafc}
.mobile-menu .mobile-btn{background:#2563EB;color:white!important;text-align:center;margin-top:8px;font-weight:700}

/* PAGE */
.page-wrap{padding:132px 48px 72px;background:#f8fafc;min-height:100vh}
.container{max-width:1120px;margin:0 auto}
.hero-card{background:white;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;box-shadow:0 16px 48px rgba(15,23,42,0.06)}
.hero-top{display:grid;grid-template-columns:1.05fr 0.95fr;gap:0}
.hero-copy{padding:52px}
.label{display:inline-flex;align-items:center;background:#eff6ff;color:#2563EB;border:1px solid #bfdbfe;border-radius:999px;padding:7px 14px;font-size:0.78rem;font-weight:700;margin-bottom:22px}
h1{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3.3rem);line-height:1.08;color:#0f2460;letter-spacing:-0.03em;margin-bottom:18px}
h1 em{font-style:italic;font-weight:400;color:#2563EB}
.lead{font-size:1.02rem;color:#475569;line-height:1.8;max-width:560px;margin-bottom:32px}
.cta-row{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.btn-primary{background:#2563EB;color:white;padding:14px 28px;border-radius:8px;font-size:0.95rem;font-weight:700;box-shadow:0 4px 20px rgba(37,99,235,0.32)}
.btn-primary:hover{background:#1D4ED8}
.btn-secondary{color:#1e40af;font-size:0.92rem;font-weight:600}
.preview-panel{background:#1e3a8a;color:white;padding:52px;display:flex;align-items:center;justify-content:center}
.pdf-mock{width:100%;max-width:360px;background:white;border-radius:14px;color:#0f172a;box-shadow:0 24px 70px rgba(0,0,0,0.22);padding:26px}
.mock-header{height:16px;background:#1e3a8a;border-radius:5px;margin-bottom:18px}
.mock-title{font-weight:800;font-size:1.05rem;margin-bottom:5px}
.mock-sub{font-size:0.75rem;color:#64748b;margin-bottom:18px}
.mock-row{height:10px;background:#e2e8f0;border-radius:6px;margin-bottom:9px}
.mock-row.short{width:70%}
.mock-table{margin-top:18px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden}
.mock-tr{display:grid;grid-template-columns:1fr 1fr 1fr}
.mock-td{height:28px;border-right:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;background:#f8fafc}
.mock-td:last-child{border-right:0}
.mock-tr:last-child .mock-td{border-bottom:0}
.demo-badge{display:inline-block;margin-top:18px;background:#fef3c7;color:#92400e;border:1px solid #fde68a;border-radius:999px;padding:6px 10px;font-size:0.72rem;font-weight:800}

.content-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:28px}
.card{background:white;border:1px solid #e2e8f0;border-radius:16px;padding:30px;box-shadow:0 8px 30px rgba(15,23,42,0.04)}
.card h2{font-family:'Outfit',sans-serif;font-size:1.25rem;color:#0f172a;margin-bottom:16px}
.checks{display:flex;flex-direction:column;gap:12px}
.check{display:flex;gap:10px;color:#475569;font-size:0.93rem;line-height:1.55}
.check::before{content:'✓';color:#2563EB;font-weight:800;flex-shrink:0}
.note{margin-top:20px;background:#eff6ff;border-left:4px solid #2563EB;border-radius:0 10px 10px 0;padding:16px 18px;color:#1e3a8a;font-size:0.88rem;line-height:1.65}
.download-box{text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100%}
.pdf-icon{font-size:2.8rem;margin-bottom:12px}
.download-box p{font-size:0.9rem;color:#64748b;line-height:1.7;margin-bottom:22px;max-width:360px}
.back-link{display:inline-flex;margin-top:28px;color:#475569;font-size:0.9rem;font-weight:600}
.back-link:hover{color:#2563EB}

@media(max-width:900px){
  nav{padding:0 20px}
  .nav-links{display:none!important}
  .hamburger{display:flex!important}
  .page-wrap{padding:104px 18px 48px}
  .hero-top,.content-grid{grid-template-columns:1fr}
  .hero-copy,.preview-panel{padding:30px 22px}
  .preview-panel{display:none}
  .card{padding:24px}
}
@media(max-width:500px){
  nav{padding:0 16px!important}
  .page-wrap{padding-left:14px;padding-right:14px}
  .cta-row{flex-direction:column;align-items:stretch}
  .btn-primary,.btn-secondary{text-align:center}
}
</style>
</head>
<body>

<nav>
  <a href="/" class="nav-logo" aria-label="Slimme Kascontrole">
    <span class="nav-logo-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span style="font-size:1.2rem;font-weight:800;color:#2563EB;line-height:0.95">slimme<br/>kascontrole</span>
  </a>

  <ul class="nav-links">
    <li><a href="/#waarom">Waarom</a></li>
    <li><a href="/#hoe-het-werkt">Hoe het werkt</a></li>
    <li><a href="/handleidingen">Handleidingen</a></li>
    <li><a href="/#over-ons">Over ons</a></li>
    <li><a href="/#tarieven">Tarieven</a></li>
    <li><a href="/#contact">Contact</a></li>
    <li><a href="/mijn-omgeving">Mijn omgeving</a></li>
    <li><a href="/login" class="btn-nav">Account aanmaken</a></li>
  </ul>

  <button class="hamburger" onclick="document.querySelector('.mobile-menu').style.display = document.querySelector('.mobile-menu').style.display === 'block' ? 'none' : 'block'" aria-label="Menu">
    <span class="ham-bar"></span>
    <span class="ham-bar"></span>
    <span class="ham-bar"></span>
  </button>
</nav>

<div class="mobile-menu">
  <a href="/#waarom">Waarom</a>
  <a href="/#hoe-het-werkt">Hoe het werkt</a>
  <a href="/handleidingen">Handleidingen</a>
  <a href="/#over-ons">Over ons</a>
  <a href="/#tarieven">Tarieven</a>
  <a href="/#contact">Contact</a>
  <a href="/mijn-omgeving">Mijn omgeving</a>
  <a href="/login" class="mobile-btn">Account aanmaken</a>
</div>

<main class="page-wrap">
  <div class="container">
    <section class="hero-card">
      <div class="hero-top">
        <div class="hero-copy">
          <div class="label">Voorbeeldrapport</div>
          <h1>Bekijk wat u straks <em>echt ontvangt.</em></h1>
          <p class="lead">
            Bekijk een fictief maar realistisch voorbeeld van een kascontrolerapport van Slimme Kascontrole.
            De opbouw, analyses en stijl zijn gelijk aan het rapport dat u na upload ontvangt.
          </p>

          <div class="cta-row">
            <a href="/voorbeeldrapport-slimme-kascontrole.pdf" target="_blank" class="btn-primary">
              Download voorbeeldrapport
            </a>
            <a href="/" class="btn-secondary">Terug naar homepage →</a>
          </div>
        </div>

        <div class="preview-panel">
          <div class="pdf-mock">
            <div class="mock-header"></div>
            <div class="mock-title">Kascommissie rapport</div>
            <div class="mock-sub">VvE Parkzicht Residence · Boekjaar 2025</div>
            <div class="mock-row"></div>
            <div class="mock-row"></div>
            <div class="mock-row short"></div>
            <div class="mock-table">
              <div class="mock-tr"><div class="mock-td"></div><div class="mock-td"></div><div class="mock-td"></div></div>
              <div class="mock-tr"><div class="mock-td"></div><div class="mock-td"></div><div class="mock-td"></div></div>
              <div class="mock-tr"><div class="mock-td"></div><div class="mock-td"></div><div class="mock-td"></div></div>
            </div>
            <span class="demo-badge">DEMO RAPPORT</span>
          </div>
        </div>
      </div>
    </section>

    <div class="content-grid">
      <section class="card">
        <h2>Wat ontvangt u?</h2>
        <div class="checks">
          <div class="check">Analyse van inkomsten en uitgaven</div>
          <div class="check">Controle van banksaldi en transacties</div>
          <div class="check">Analyse van openstaande posten</div>
          <div class="check">Inzichtelijke tabellen en bevindingen</div>
          <div class="check">Advies voor de Algemene Ledenvergadering</div>
        </div>
        <div class="note">
          Dit voorbeeldrapport bevat uitsluitend fictieve gegevens. Het is bedoeld om te laten zien wat u qua structuur en inhoud kunt verwachten.
        </div>
      </section>

      <section class="card download-box">
        <div class="pdf-icon">📄</div>
        <h2>Voorbeeldrapport PDF</h2>
        <p>
          Open of download het volledige voorbeeldrapport en bekijk hoe de bevindingen, tabellen en adviezen worden gepresenteerd.
        </p>
        <div style="margin-top:4px;color:#64748b;font-size:0.92rem;line-height:1.7;max-width:360px">
          Volledig fictief voorbeeldrapport in PDF-formaat, bedoeld om exact te laten zien hoe uw uiteindelijke kascontrolerapport eruitziet.
        </div>
      </section>
    </div>

    <a href="/" class="back-link">← Terug naar homepage</a>
  </div>
</main>

</body>
</html>`
