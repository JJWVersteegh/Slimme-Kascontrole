import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VvE Kascontrole Checklist – Alles wat u nodig heeft | Slimme Kascontrole',
  description: 'Volledige VvE kascontrole checklist. Welke documenten heeft u nodig? Wat moet er gecontroleerd worden? Download uw checklist of laat Slimme Kascontrole het voor u doen voor €59.',
  alternates: { canonical: '/vve-kascontrole-checklist' },
}

export default function VveKascontroleChecklist() {
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
.hero{background:#0f2460;padding:140px 48px 88px;min-height:55vh;display:flex;align-items:center}
.hero-content{max-width:700px}
.hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(37,99,235,0.35);border:1px solid rgba(147,197,253,0.5);color:#bfdbfe;font-size:0.72rem;font-weight:700;padding:5px 13px;border-radius:20px;margin-bottom:24px;letter-spacing:0.05em;text-transform:uppercase}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(2rem,4vw,3.2rem);font-weight:700;line-height:1.15;color:white;margin-bottom:20px}
.hero h1 em{font-style:italic;color:#93c5fd}
.hero-sub{font-size:1rem;color:rgba(255,255,255,0.85);line-height:1.7;margin-bottom:32px;max-width:560px}
.btn-primary{background:#2563EB;color:white;padding:14px 30px;border-radius:8px;font-size:0.95rem;font-weight:700;text-decoration:none;display:inline-block;margin-right:16px;box-shadow:0 4px 20px rgba(37,99,235,0.45)}
.btn-primary:hover{background:#1D4ED8}
.btn-ghost{color:rgba(255,255,255,0.8);font-size:0.9rem;font-weight:500;text-decoration:none}
section{padding:88px 48px}
.section-label{font-size:0.7rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#2563EB;margin-bottom:12px}
h2{font-family:'Playfair Display',serif;font-size:clamp(1.7rem,3vw,2.4rem);font-weight:700;color:#0f172a;line-height:1.15;margin-bottom:16px}
h2 em{font-style:italic;color:#2563EB}
.section-sub{font-size:0.97rem;color:#475569;line-height:1.7;max-width:580px;margin-bottom:48px}
.container{max-width:1100px;margin:0 auto}
.callout{background:#eff6ff;border-left:4px solid #2563EB;border-radius:0 10px 10px 0;padding:18px 22px;margin:20px 0;font-size:0.88rem;color:#1e3a8a;line-height:1.7}
.checklist-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;max-width:1100px;margin:0 auto}
.checklist-card{background:white;border-radius:16px;border:1px solid #e2e8f0;padding:28px}
.checklist-card h3{font-size:1rem;font-weight:700;color:#0f172a;margin-bottom:16px;display:flex;align-items:center;gap:10px}
.check-item{display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:0.88rem;color:#475569;line-height:1.5}
.check-item:last-child{border-bottom:none}
.check-item .check{color:#2563EB;font-weight:700;flex-shrink:0;margin-top:1px}
.check-item strong{color:#0f172a}
.vs-table{max-width:760px;margin:0 auto;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0}
.vs-header{display:grid;grid-template-columns:1fr 1fr 1fr;background:#0f2460;color:white;padding:16px 20px;font-weight:700;font-size:0.88rem}
.vs-row{display:grid;grid-template-columns:1fr 1fr 1fr;padding:14px 20px;border-bottom:1px solid #f1f5f9;font-size:0.85rem;align-items:center}
.vs-row:last-child{border-bottom:none}
.vs-row:nth-child(even){background:#f8fafc}
.vs-check{color:#16a34a;font-weight:700}
.vs-cross{color:#dc2626;font-weight:700}
.vs-label{color:#475569}
.faq-list{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:12px}
.faq-item{background:white;border-radius:12px;border:1px solid #e2e8f0;padding:20px 24px}
.faq-item h3{font-size:0.92rem;font-weight:700;color:#0f172a;margin-bottom:8px}
.faq-item p{font-size:0.85rem;color:#475569;line-height:1.6}
.cta-section{background:#0f2460;padding:88px 48px;text-align:center}
.breadcrumb{font-size:0.82rem;color:rgba(255,255,255,0.6);margin-bottom:16px}
.breadcrumb a{color:rgba(255,255,255,0.6);text-decoration:none}
footer{background:#0f172a;color:rgba(255,255,255,0.5);padding:40px 48px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;font-size:0.8rem}
.footer-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
footer a{color:rgba(255,255,255,0.5);text-decoration:none}
footer a:hover{color:#93c5fd}
.footer-links{display:flex;gap:20px;flex-wrap:wrap}
@media(max-width:768px){
  nav{padding:0 20px}
  .nav-links{display:none}
  .hamburger{display:flex}
  .hero{padding:120px 20px 60px}
  section{padding:60px 20px}
  .checklist-grid{grid-template-columns:1fr}
  .vs-header,.vs-row{grid-template-columns:1.5fr 1fr 1fr;font-size:0.78rem;padding:10px 12px}
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
    <div class="breadcrumb"><a href="/">Home</a> › VvE Kascontrole Checklist</div>
    <div class="hero-eyebrow">✦ Compleet overzicht voor uw kascommissie</div>
    <h1>VvE Kascontrole Checklist — <em>alles wat u nodig heeft</em></h1>
    <p class="hero-sub">Welke documenten heeft u nodig voor de kascontrole? Wat moet er allemaal worden gecontroleerd? Deze volledige checklist helpt uw kascommissie op weg — of laat Slimme Kascontrole het voor u doen voor €59.</p>
    <a href="/registreer" class="btn-primary">Direct starten voor €59</a>
    <a href="#checklist" class="btn-ghost">Bekijk de checklist →</a>
  </div>
</section>

<!-- CHECKLIST DOCUMENTEN -->
<section id="checklist">
  <div class="container">
    <div style="text-align:center;margin-bottom:48px">
      <p class="section-label">De checklist</p>
      <h2>Welke documenten heeft u nodig voor de <em>VvE kascontrole</em>?</h2>
      <p class="section-sub" style="margin:0 auto">Een volledige kascontrole vereist de juiste documenten. Zorg dat u deze heeft voordat u begint.</p>
    </div>
    <div class="checklist-grid">
      <div class="checklist-card">
        <h3>📄 Financiële documenten</h3>
        <div class="check-item"><span class="check">✓</span><span><strong>Jaarrekening</strong> — de officiële jaarrekening van de VvE over het te controleren boekjaar</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Bankafschriften</strong> — alle bankafschriften van alle rekeningen over het volledige boekjaar</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Resultatenrekening</strong> — overzicht van alle inkomsten en uitgaven per categorie</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Balans</strong> — overzicht van bezittingen en schulden per einde boekjaar</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Reserveoverzicht</strong> — stand van het reservefonds begin en einde boekjaar</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Begroting</strong> — de goedgekeurde begroting voor vergelijking met werkelijke kosten</span></div>
      </div>
      <div class="checklist-card">
        <h3>🏦 Betalingen & facturen</h3>
        <div class="check-item"><span class="check">✓</span><span><strong>Betaalde facturen</strong> — kopieën van alle facturen die zijn betaald in het boekjaar</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Contributie-overzicht</strong> — overzicht van wie heeft betaald en wie nog niet</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Eigenaarssaldi</strong> — openstaande vorderingen op eigenaars</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Crediteurensaldi</strong> — openstaande schulden aan leveranciers</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Stortingsbewijzen</strong> — bewijs van ontvangen betalingen</span></div>
      </div>
      <div class="checklist-card">
        <h3>📋 Contracten & verzekeringen</h3>
        <div class="check-item"><span class="check">✓</span><span><strong>Lopende contracten</strong> — overzicht van alle contracten met leveranciers en dienstverleners</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Verzekeringspolissen</strong> — kopieën van alle verzekeringsdekkingen van de VvE</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Onderhoudscontracten</strong> — contracten voor lift, cv-installatie, groenonderhoud etc.</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Abonnementen</strong> — alle lopende abonnementen en servicecontracten</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Beheerovereenkomst</strong> — contract met de VvE-beheerder indien van toepassing</span></div>
      </div>
      <div class="checklist-card">
        <h3>📜 Vergaderstukken</h3>
        <div class="check-item"><span class="check">✓</span><span><strong>Notulen ALV</strong> — notulen van de vorige algemene ledenvergadering</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Vergaderbesluiten</strong> — overzicht van alle financiële besluiten die zijn genomen</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>Splitsingsakte</strong> — bij twijfel over verdeling van kosten</span></div>
        <div class="check-item"><span class="check">✓</span><span><strong>MJOP</strong> — Meerjarenonderhoudsplan voor vergelijking met reservefonds</span></div>
      </div>
    </div>
    <div class="callout" style="max-width:1100px;margin:32px auto 0">
      <strong>Tip:</strong> Heeft u een externe VvE-beheerder? Vraag hem of haar om een financieel exportbestand (PDF of Excel). De meeste beheersoftware zoals Twinq en Isabel ondersteunt dit. Onze handleidingen leggen per programma precies uit hoe u dit doet.
    </div>
  </div>
</section>

<!-- WAT WORDT GECONTROLEERD -->
<section style="background:#f8fafc">
  <div class="container">
    <div style="text-align:center;margin-bottom:48px">
      <p class="section-label">De controle</p>
      <h2>Wat wordt er <em>gecontroleerd</em> bij een VvE kascontrole?</h2>
      <p class="section-sub" style="margin:0 auto">Een volledige kascontrole gaat verder dan alleen de cijfers. Dit zijn alle punten die Slimme Kascontrole controleert.</p>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:1100px;margin:0 auto">
      <div class="checklist-card">
        <h3>💰 Financiële controle</h3>
        <div class="check-item"><span class="check">✓</span><span>Aansluiting begin- en eindsaldo met bankafschriften</span></div>
        <div class="check-item"><span class="check">✓</span><span>Volledigheid van alle inkomsten</span></div>
        <div class="check-item"><span class="check">✓</span><span>Juistheid van alle uitgaven en facturen</span></div>
        <div class="check-item"><span class="check">✓</span><span>Dubbele of ongebruikelijke posten</span></div>
        <div class="check-item"><span class="check">✓</span><span>Exploitatieresultaat vs begroting</span></div>
        <div class="check-item"><span class="check">✓</span><span>Stand en opbouw reservefonds</span></div>
        <div class="check-item"><span class="check">✓</span><span>Openstaande debiteuren en crediteuren</span></div>
      </div>
      <div class="checklist-card">
        <h3>📋 Contracten & abonnementen</h3>
        <div class="check-item"><span class="check">✓</span><span>Zijn alle contracten nog actueel?</span></div>
        <div class="check-item"><span class="check">✓</span><span>Verlopen er contracten binnenkort?</span></div>
        <div class="check-item"><span class="check">✓</span><span>Worden alle abonnementen nog gebruikt?</span></div>
        <div class="check-item"><span class="check">✓</span><span>Is de verzekeringsdekking nog voldoende?</span></div>
        <div class="check-item"><span class="check">✓</span><span>Zijn onderhoudscontracten conform besluiten?</span></div>
        <div class="check-item"><span class="check">✓</span><span>Beheert de beheerder uw geld correct?</span></div>
        <div class="check-item"><span class="check">✓</span><span>Trendanalyse over meerdere jaren</span></div>
      </div>
    </div>
  </div>
</section>

<!-- VERGELIJKING -->
<section>
  <div class="container" style="text-align:center">
    <p class="section-label">Vergelijking</p>
    <h2>Zelf doen, uitbesteden of <em>Slimme Kascontrole</em>?</h2>
    <p class="section-sub" style="margin:0 auto 40px">Kies de optie die het beste past bij uw VvE.</p>
    <div class="vs-table">
      <div class="vs-header">
        <div></div>
        <div>Traditioneel</div>
        <div>Slimme Kascontrole</div>
      </div>
      <div class="vs-row">
        <div class="vs-label">Kosten</div>
        <div>€250 – €785</div>
        <div style="color:#16a34a;font-weight:700">€59</div>
      </div>
      <div class="vs-row">
        <div class="vs-label">Tijd</div>
        <div>Dagen/weken</div>
        <div style="color:#16a34a;font-weight:700">Minuten</div>
      </div>
      <div class="vs-row">
        <div class="vs-label">Volledige controle</div>
        <div class="vs-check">✓</div>
        <div class="vs-check">✓</div>
      </div>
      <div class="vs-row">
        <div class="vs-label">Contractencheck</div>
        <div class="vs-check">✓</div>
        <div class="vs-check">✓</div>
      </div>
      <div class="vs-row">
        <div class="vs-label">Trendanalyse</div>
        <div class="vs-cross">✗</div>
        <div class="vs-check">✓</div>
      </div>
      <div class="vs-row">
        <div class="vs-label">Direct beschikbaar</div>
        <div class="vs-cross">✗</div>
        <div class="vs-check">✓</div>
      </div>
      <div class="vs-row">
        <div class="vs-label">Geen abonnement</div>
        <div class="vs-cross">✗</div>
        <div class="vs-check">✓</div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section style="background:#f8fafc">
  <div class="container" style="text-align:center">
    <p class="section-label">Veelgestelde vragen</p>
    <h2>Vragen over de <em>VvE kascontrole checklist</em></h2>
    <div class="faq-list">
      <div class="faq-item" style="text-align:left">
        <h3>Moet ik alle documenten hebben voordat ik kan starten?</h3>
        <p>U heeft minimaal een financieel overzicht of jaarrekening nodig. Hoe meer documenten u uploadt, hoe completer het rapport wordt. Slimme Kascontrole geeft aan welke informatie eventueel nog ontbreekt.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>In welk formaat moet ik de bestanden aanleveren?</h3>
        <p>Slimme Kascontrole accepteert PDF, Excel (xlsx) en CSV bestanden. De meeste VvE-beheersoftware kan deze formaten exporteren. Onze handleidingen leggen per programma uit hoe u dit doet.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Hoe lang duurt de kascontrole?</h3>
        <p>Na het uploaden van uw bestanden en betaling ontvangt u direct uw rapport. U hoeft niet te wachten op een afspraak of handmatige verwerking.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Kan ik bestanden van meerdere jaren uploaden?</h3>
        <p>Ja. U kunt bestanden van meerdere boekjaren uploaden voor een diepgaande trendanalyse. U betaalt slechts eenmalig €59 voor het rapport over het gewenste boekjaar.</p>
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <h2 style="color:white;text-align:center;margin-bottom:16px">Klaar om te starten?</h2>
    <p class="section-sub" style="color:rgba(255,255,255,0.75);text-align:center;margin:0 auto 32px">Upload uw bestanden en ontvang direct uw professionele VvE kascontrolerapport voor €59.</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
      <a href="/registreer" class="btn-primary">Gratis account aanmaken</a>
      <a href="/" style="color:rgba(255,255,255,0.8);font-size:0.9rem;font-weight:500;text-decoration:none;display:flex;align-items:center">← Terug naar home</a>
    </div>
  </div>
</section>

<footer>
  <a href="/" class="footer-logo">
    <div style="background:#2563EB;width:32px;height:32px;border-radius:6px;display:flex;align-items:center;justify-content:center">
      <svg width="16" height="16" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div style="line-height:1.1;margin-left:10px">
      <div style="font-weight:700;font-size:0.9rem;color:rgba(255,255,255,0.7)">slimme</div>
      <div style="font-weight:500;font-size:0.9rem;color:rgba(255,255,255,0.5)">kascontrole</div>
    </div>
  </a>
  <div class="footer-links">
    <a href="/vve-kascontrole">VvE Kascontrole</a>
    <a href="/vve-kascontrole-checklist">Checklist</a>
    <a href="/controle-jaarrekening-vve">Jaarrekening</a>
    <a href="/sportvereniging-kascontrole">Sportvereniging</a>
    <a href="/kascommissie-rapport">Kascommissie</a>
    <a href="/stichting-kascontrole">Stichting</a>
  </div>
  <p>© 2026 Slimme Kascontrole</p>
</footer>
</body>
</html>`
