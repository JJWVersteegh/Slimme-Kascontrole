import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Controle Jaarrekening VvE – Professioneel en volledig | Slimme Kascontrole',
  description: 'Laat de jaarrekening van uw VvE professioneel controleren. Volledig rapport in minuten. Eenmalig €59 incl. btw — geen abonnement. Klaar voor de ALV.',
  alternates: { canonical: '/controle-jaarrekening-vve' },
}

export default function ControleJaarrekeningVve() {
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
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.callout{background:#eff6ff;border-left:4px solid #2563EB;border-radius:0 10px 10px 0;padding:18px 22px;margin:20px 0;font-size:0.88rem;color:#1e3a8a;line-height:1.7}
.text-body p{font-size:0.93rem;color:#475569;line-height:1.8;margin-bottom:16px}
.onderdelen-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;max-width:1100px;margin:0 auto}
.onderdeel{background:#f8fafc;border-radius:12px;padding:24px;border:1px solid #e2e8f0;display:flex;gap:16px}
.onderdeel-icon{font-size:1.5rem;flex-shrink:0}
.onderdeel h3{font-size:0.92rem;font-weight:700;color:#0f172a;margin-bottom:6px}
.onderdeel p{font-size:0.82rem;color:#475569;line-height:1.6}
.stappenplan{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:0}
.stap{display:flex;gap:24px;position:relative;padding-bottom:32px}
.stap:last-child{padding-bottom:0}
.stap-lijn{position:absolute;left:19px;top:40px;bottom:0;width:2px;background:#e2e8f0}
.stap:last-child .stap-lijn{display:none}
.stap-num{width:40px;height:40px;border-radius:50%;background:#2563EB;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;flex-shrink:0;position:relative;z-index:1}
.stap-content h3{font-size:0.95rem;font-weight:700;color:#0f172a;margin-bottom:6px;margin-top:8px}
.stap-content p{font-size:0.85rem;color:#475569;line-height:1.6}
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
  .two-col,.onderdelen-grid{grid-template-columns:1fr}
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
    <div class="breadcrumb"><a href="/">Home</a> › Controle Jaarrekening VvE</div>
    <div class="hero-eyebrow">✦ Wettelijk verplicht voor elke VvE</div>
    <h1>Controle jaarrekening VvE — <em>volledig en professioneel</em> voor €59</h1>
    <p class="hero-sub">De jaarrekening van uw VvE moet jaarlijks worden gecontroleerd. Met Slimme Kascontrole uploadt u de financiële stukken en ontvangt u direct een volledig gecontroleerd rapport — klaar voor de ALV. Eenmalig €59 incl. btw.</p>
    <a href="/registreer" class="btn-primary">Direct starten voor €59</a>
    <a href="#wat-is" class="btn-ghost">Meer informatie →</a>
  </div>
</section>

<!-- WAT IS CONTROLE JAARREKENING VVE -->
<section id="wat-is">
  <div class="container two-col">
    <div class="text-body">
      <p class="section-label">Wat is de controle jaarrekening VvE?</p>
      <h2>Waarom de jaarrekening van uw VvE <em>gecontroleerd moet worden</em></h2>
      <p>Elke VvE is verplicht jaarlijks een jaarrekening op te stellen en deze te laten controleren door een kascommissie. Dit is vastgelegd in artikel 2:48 van het Burgerlijk Wetboek. De kascommissie controleert of de jaarrekening een juist beeld geeft van de financiële situatie van de VvE.</p>
      <p>De jaarrekening bestaat uit twee delen: de <strong>balans</strong> (bezittingen en schulden) en de <strong>resultatenrekening</strong> (inkomsten en uitgaven). Van elke post op beide overzichten moet worden nagegaan of deze correct is.</p>
      <div class="callout">
        <strong>Let op:</strong> Zonder een correcte controle van de jaarrekening is de decharge van het bestuur juridisch ongeldig. Dit kan betekenen dat bestuursleden persoonlijk aansprakelijk blijven voor financiële fouten. Een professioneel rapport beschermt iedereen.
      </div>
      <p>Met Slimme Kascontrole controleert u de jaarrekening van uw VvE volledig — elke factuur, elk saldo, alle contracten en abonnementen. Geen steekproeven, maar een <strong>100% volledige controle</strong>.</p>
    </div>
    <div>
      <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80" alt="Controle jaarrekening VvE" style="border-radius:16px;width:100%;height:400px;object-fit:cover;box-shadow:0 16px 48px rgba(0,0,0,0.1)"/>
    </div>
  </div>
</section>

<!-- WAT WORDT GECONTROLEERD -->
<section style="background:#f8fafc">
  <div class="container">
    <div style="text-align:center;margin-bottom:48px">
      <p class="section-label">De controle</p>
      <h2>Wat wordt er gecontroleerd in de <em>jaarrekening van uw VvE</em>?</h2>
      <p class="section-sub" style="margin:0 auto">Een volledige controle van de VvE jaarrekening omvat al deze onderdelen.</p>
    </div>
    <div class="onderdelen-grid">
      <div class="onderdeel">
        <div class="onderdeel-icon">💰</div>
        <div>
          <h3>Balanscontrole</h3>
          <p>Aansluiting van alle bankrekeningen en balansposten. Klopt het eindsaldo met de bankafschriften? Zijn alle bezittingen en schulden correct opgenomen?</p>
        </div>
      </div>
      <div class="onderdeel">
        <div class="onderdeel-icon">📊</div>
        <div>
          <h3>Resultatenrekening</h3>
          <p>Zijn alle inkomsten volledig verantwoord? Kloppen alle uitgaven? Vergelijking van werkelijke cijfers met de begroting.</p>
        </div>
      </div>
      <div class="onderdeel">
        <div class="onderdeel-icon">🏦</div>
        <div>
          <h3>Reservefonds</h3>
          <p>Is het reservefonds conform de wettelijke vereisten en het MJOP opgebouwd? Hebben onttrekkingen plaatsgevonden conform vergaderbesluiten?</p>
        </div>
      </div>
      <div class="onderdeel">
        <div class="onderdeel-icon">🔍</div>
        <div>
          <h3>Factuurcontrole</h3>
          <p>Elke betaalde factuur wordt gecontroleerd op juistheid, volledigheid en autorisatie. Zijn de kosten inderdaad voor rekening van de VvE?</p>
        </div>
      </div>
      <div class="onderdeel">
        <div class="onderdeel-icon">👥</div>
        <div>
          <h3>Eigenaarssaldi</h3>
          <p>Overzicht van alle openstaande vorderingen op eigenaars. Wie heeft zijn bijdrage nog niet betaald? Zijn er meerjarige achterstanden?</p>
        </div>
      </div>
      <div class="onderdeel">
        <div class="onderdeel-icon">📋</div>
        <div>
          <h3>Contracten & abonnementen</h3>
          <p>Zijn alle lopende contracten nog actueel? Verlopen verzekeringen binnenkort? Worden alle abonnementen nog gebruikt?</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- HOE HET WERKT -->
<section>
  <div class="container" style="text-align:center">
    <p class="section-label">Hoe het werkt</p>
    <h2>Controle jaarrekening VvE in <em>vier stappen</em></h2>
    <p class="section-sub" style="margin:0 auto 48px">Geen boekhoudkundige kennis vereist.</p>
    <div class="stappenplan" style="text-align:left">
      <div class="stap">
        <div class="stap-lijn"></div>
        <div class="stap-num">1</div>
        <div class="stap-content">
          <h3>Account aanmaken en VvE kiezen</h3>
          <p>Maak gratis een account aan, voeg uw VvE toe en selecteer het boekjaar waarover u een kascontrolerapport wilt ontvangen.</p>
        </div>
      </div>
      <div class="stap">
        <div class="stap-lijn"></div>
        <div class="stap-num">2</div>
        <div class="stap-content">
          <h3>Download de jaarrekening van uw VvE</h3>
          <p>Download de financiële stukken van uw VvE via uw beheerder of boekhoudprogramma — jaarrekening, bankafschriften en contracten als PDF, Excel of CSV.</p>
        </div>
      </div>
      <div class="stap">
        <div class="stap-lijn"></div>
        <div class="stap-num">3</div>
        <div class="stap-content">
          <h3>Upload uw bestanden</h3>
          <p>Upload uw bestanden veilig via onze SSL-versleutelde omgeving. U kunt meerdere bestanden tegelijk selecteren. Uw gegevens worden opgeslagen binnen de EU.</p>
        </div>
      </div>
      <div class="stap">
        <div class="stap-lijn"></div>
        <div class="stap-num">4</div>
        <div class="stap-content">
          <h3>Betaal en ontvang uw rapport</h3>
          <p>Betaal eenmalig €59 via iDEAL en ontvang direct uw professionele kascontrolerapport — inclusief controle van de jaarrekening, balans, resultatenrekening en advies aan de ALV.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section style="background:#f8fafc">
  <div class="container" style="text-align:center">
    <p class="section-label">Veelgestelde vragen</p>
    <h2>Vragen over de controle van de <em>jaarrekening van uw VvE</em></h2>
    <div class="faq-list">
      <div class="faq-item" style="text-align:left">
        <h3>Wie mag de jaarrekening van een VvE controleren?</h3>
        <p>De kascommissie van de VvE is verantwoordelijk voor de controle van de jaarrekening. De kascommissie mag hiervoor externe hulp inschakelen. Slimme Kascontrole ondersteunt de kascommissie bij het opstellen van het rapport — de kascommissie blijft verantwoordelijk voor de inhoud.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Wat is het verschil tussen een kascontrole en een accountantscontrole?</h3>
        <p>Een accountantscontrole is verplicht voor grotere organisaties en geeft een wettelijk oordeel over de jaarrekening. Een kascontrole door de kascommissie is een interne controle die verplicht is voor VvE's. Slimme Kascontrole ondersteunt de kascommissie bij deze interne controle.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Wat als de jaarrekening fouten bevat?</h3>
        <p>Slimme Kascontrole signaleert afwijkingen, fouten en onregelmatigheden in het rapport. Het advies aan de ALV vermeldt duidelijk welke punten aandacht vereisen en wat de kascommissie aanbeveelt.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Hoe lang is het rapport geldig?</h3>
        <p>Het rapport heeft betrekking op één boekjaar. Elk jaar dient een nieuwe kascontrole te worden uitgevoerd. Met Slimme Kascontrole betaalt u eenmalig €59 per boekjaar.</p>
      </div>
      <div class="faq-item" style="text-align:left">
        <h3>Kan ik het rapport gebruiken op de ALV?</h3>
        <p>Ja. Het rapport is specifiek opgesteld voor gebruik op de Algemene Ledenvergadering. Het bevat een duidelijk advies over goedkeuring of aanhouding van de jaarrekening.</p>
      </div>
    </div>
  </div>
</section>

<section class="cta-section">
  <div class="container">
    <h2 style="color:white;text-align:center;margin-bottom:16px">Klaar om de jaarrekening te controleren?</h2>
    <p class="section-sub" style="color:rgba(255,255,255,0.75);text-align:center;margin:0 auto 32px">Upload de jaarrekening van uw VvE en ontvang direct uw professionele kascontrolerapport voor €59.</p>
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
    <a href="/sportvereniging-kascontrole">Sportvereniging</a>
    <a href="/kascommissie-rapport">Kascommissie</a>
    <a href="/stichting-kascontrole">Stichting</a>
  </div>
  <p>© 2026 Slimme Kascontrole</p>
</footer>
</body>
</html>`
