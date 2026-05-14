import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VvE Kascommissie – Wat doet de kascommissie? | Slimme Kascontrole',
  description: 'Alles over de VvE kascommissie. Wat zijn de taken? Wie mag lid zijn? Hoe werkt de kascontrole? En hoe stelt Slimme Kascontrole uw rapport op voor €59.',
  alternates: { canonical: '/vve-kascommissie' },
}

export default function VveKascommissie() {
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
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:start}
.callout{background:#eff6ff;border-left:4px solid #2563EB;border-radius:0 10px 10px 0;padding:18px 22px;margin:20px 0;font-size:0.88rem;color:#1e3a8a;line-height:1.7}
.text-body p{font-size:0.93rem;color:#475569;line-height:1.8;margin-bottom:16px}
.taken-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1100px;margin:0 auto}
.taak{background:white;border-radius:12px;padding:24px;border:1px solid #e2e8f0}
.taak-icon{font-size:1.8rem;margin-bottom:12px}
.taak h3{font-size:0.95rem;font-weight:700;color:#0f172a;margin-bottom:8px}
.taak p{font-size:0.83rem;color:#475569;line-height:1.6}
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
  .two-col,.taken-grid{grid-template-columns:1fr}
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
    <div class="breadcrumb"><a href="/">Home</a> › VvE Kascommissie</div>
    <div class="hero-eyebrow">✦ Alles over de VvE kascommissie</div>
    <h1>De VvE kascommissie — <em>taken, rechten en plichten</em></h1>
    <p class="hero-sub">Wat doet de kascommissie van een VvE precies? Wie mag er lid van zijn? En hoe maakt u als kascommissielid een professioneel rapport voor de ALV? Alles wat u moet weten over de VvE kascommissie.</p>
    <a href="/registreer" class="btn-primary">Direct rapport aanvragen voor €59</a>
    <a href="#taken" class="btn-ghost">Lees meer →</a>
  </div>
</section>

<!-- WAT IS DE KASCOMMISSIE -->
<section id="taken">
  <div class="container two-col">
    <div class="text-body">
      <p class="section-label">Wat is de VvE kascommissie?</p>
      <h2>De kascommissie: <em>waakhond</em> van de VvE financiën</h2>
      <p>De kascommissie van een VvE is een groep van twee of drie eigenaars die jaarlijks de financiën van de VvE controleert. De kascommissie wordt benoemd tijdens de Algemene Ledenvergadering (ALV) en brengt verslag uit aan diezelfde vergadering.</p>
      <p>De kascommissie heeft een controlerende en adviserende taak. Ze controleert of de penningmeester en beheerder alles correct hebben geboekt en adviseert de vergadering over het al dan niet verlenen van decharge aan het bestuur.</p>
      <div class="callout">
        <strong>Wettelijke basis:</strong> De verplichting voor een kascommissie is vastgelegd in artikel 2:48 van het Burgerlijk Wetboek. Zonder een correcte kascontrole is de decharge van het bestuur juridisch ongeldig.
      </div>
      <p>In de praktijk zijn kascommissieleden enthousiaste vrijwilligers zonder boekhoudkundige achtergrond. Ze missen vaak de kennis en tijd om een grondige controle uit te voeren. Slimme Kascontrole helpt de kascommissie door het volledige rapport te genereren — u uploadt de stukken, wij stellen het rapport op.</p>
    </div>
    <div>
      <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80" alt="VvE kascommissie vergadering" style="border-radius:16px;width:100%;height:400px;object-fit:cover;box-shadow:0 16px 48px rgba(0,0,0,0.1)"/>
    </div>
  </div>
</section>

<!-- TAKEN -->
<section style="background:#f8fafc">
  <div class="container">
    <div style="text-align:center;margin-bottom:48px">
      <p class="section-label">Taken</p>
      <h2>Wat zijn de taken van de <em>VvE kascommissie</em>?</h2>
      <p class="section-sub" style="margin:0 auto">De kascommissie heeft een breed takenpakket dat verder gaat dan alleen de cijfers controleren.</p>
    </div>
    <div class="taken-grid">
      <div class="taak">
        <div class="taak-icon">🔍</div>
        <h3>Jaarrekening controleren</h3>
        <p>De kascommissie controleert of de jaarrekening een juist beeld geeft van de financiële situatie van de VvE — balans, resultatenrekening en toelichting.</p>
      </div>
      <div class="taak">
        <div class="taak-icon">🏦</div>
        <h3>Banksaldi controleren</h3>
        <p>Aansluiting van alle bankrekeningen met de boekhouding. Zijn er afwijkingen? Kloppen de beginbalans en eindbalans?</p>
      </div>
      <div class="taak">
        <div class="taak-icon">📄</div>
        <h3>Facturen beoordelen</h3>
        <p>Zijn alle kosten inderdaad voor rekening van de VvE? Zijn facturen goedgekeurd door bevoegde personen? Zijn er dubbele betalingen?</p>
      </div>
      <div class="taak">
        <div class="taak-icon">📋</div>
        <h3>Contracten & abonnementen</h3>
        <p>Zijn alle lopende contracten nog actueel? Verlopen verzekeringen of onderhoudscontracten binnenkort? Worden abonnementen nog gebruikt?</p>
      </div>
      <div class="taak">
        <div class="taak-icon">🏗️</div>
        <h3>Reservefonds bewaken</h3>
        <p>Is het reservefonds conform de wettelijke vereisten en het MJOP opgebouwd? Zijn onttrekkingen conform vergaderbesluiten?</p>
      </div>
      <div class="taak">
        <div class="taak-icon">📊</div>
        <h3>Verslag uitbrengen</h3>
        <p>De kascommissie brengt verslag uit aan de ALV en adviseert over het verlenen of weigeren van decharge aan het bestuur.</p>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section>
  <div class="container" style="text-align:center">
    <p class="section-label">Veelgestelde vragen</p>
    <h2>Alles wat u moet weten over de <em>VvE kascommissie</em></h2>
    <div class="faq-list">
      <div class="faq-item" style="text-align:left">
        <h3>Wie mag lid zijn van de kascommissie?</h3>
        <p>Elk lid van de VvE mag lid zijn van de kascommissie, mits hij of zij geen bestuurslid is. De kascommissie moet onafhankelijk zijn van het bestuur dat ze controleert. Doorgaans bestaat de kascommissie uit twee of drie eigenaars.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Hoe lang zit iemand in de kascommissie?</h3>
        <p>De kascommissieleden worden jaarlijks benoemd op de ALV. In de praktijk worden leden vaak herbenoemd, maar voor de onafhankelijkheid is het gebruikelijk om maximaal twee à drie jaar in de kascommissie te zitten.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Wat als de kascommissie de jaarrekening afkeurt?</h3>
        <p>Als de kascommissie ernstige bezwaren heeft, kan zij de ALV adviseren de decharge te weigeren. Dit is een ingrijpende stap. Slimme Kascontrole helpt u de bevindingen helder en onderbouwd te presenteren.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Moet de kascommissie boekhoudkundige kennis hebben?</h3>
        <p>Nee — de kascommissie bestaat uit gewone eigenaars, geen accountants. Slimme Kascontrole is speciaal ontwikkeld voor kascommissieleden zonder boekhoudkundige achtergrond. U uploadt de stukken, wij genereren het professionele rapport.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Wat kost het rapport?</h3>
        <p>Eenmalig €59 incl. btw per boekjaar. Geen abonnement, geen verborgen kosten. Een stuk goedkoper dan een extern bureau dat €250 tot €785 vraagt.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Kan de kascommissie externe hulp inschakelen?</h3>
        <p>Ja. De kascommissie is verantwoordelijk voor de controle, maar mag daarvoor externe hulpmiddelen inzetten. Slimme Kascontrole ondersteunt de kascommissie bij het opstellen van het rapport.</p>
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <h2 style="color:white;text-align:center;margin-bottom:16px">Klaar als kascommissielid?</h2>
    <p class="section-sub" style="color:rgba(255,255,255,0.75);text-align:center;margin:0 auto 32px">Maak gratis een account aan en ontvang direct uw professionele kascommissie rapport voor €59.</p>
    <div style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
      <a href="/registreer" class="btn-primary">Gratis account aanmaken</a>
      <a href="/vve-kascontrole-checklist" style="color:rgba(255,255,255,0.8);font-size:0.9rem;font-weight:500;text-decoration:none;display:flex;align-items:center">Bekijk de checklist →</a>
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
    <a href="/vve-kascommissie">Kascommissie</a>
    <a href="/sportvereniging-kascontrole">Sportvereniging</a>
    <a href="/stichting-kascontrole">Stichting</a>
  </div>
  <p>© 2026 Slimme Kascontrole</p>
</footer>
</body>
</html>`
