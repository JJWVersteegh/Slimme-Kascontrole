export default function Home() {
  return (
    <>
      <html lang="nl">
      <head>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Slimme Kascontrole — Volledig gecontroleerd kascontrolerapport voor uw vereniging</title>
        <meta name="description" content="Upload uw financiële bestanden en ontvang een volledig gecontroleerd kascontrolerapport. Voor Nederlandse verenigingen, VvE's en stichtingen. €59 per boekjaar."/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
        <style>{`
          :root{
            --blue:#2563EB;
            --blue-dark:#1d4ed8;
            --blue-deeper:#1e3a8a;
            --blue-light:#93c5fd;
            --blue-pale:#eff6ff;
            --ink:#0f172a;
            --ink-soft:#475569;
            --border:#e2e8f0;
            --cream:#f8fafc;
            --white:#ffffff;
          }
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:'Inter',sans-serif;color:var(--ink);background:var(--white);line-height:1.6}
          h1,h2,h3{font-family:'Playfair Display',serif;line-height:1.15}
          h1{font-size:clamp(2.2rem,4vw,3.2rem)}
          h2{font-size:clamp(1.6rem,3vw,2.4rem)}
          em{font-style:italic;color:var(--blue)}

          /* NAV */
          nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;justify-content:space-between;align-items:center;padding:0 48px;height:68px;background:rgba(255,255,255,0.95);backdrop-filter:blur(8px);border-bottom:1px solid transparent;transition:border-color 0.3s,box-shadow 0.3s}
          nav.scrolled{border-color:var(--border);box-shadow:0 2px 16px rgba(0,0,0,0.06)}
          .logo{display:flex;align-items:center;gap:10px;text-decoration:none}
          .logo-icon{width:36px;height:36px;background:var(--blue);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
          .logo-text-top{font-family:'Inter',sans-serif;font-size:0.7rem;font-weight:600;color:var(--blue);letter-spacing:0.05em;text-transform:uppercase;line-height:1}
          .logo-text-bot{font-family:'Playfair Display',serif;font-size:1.05rem;font-weight:700;color:var(--ink);line-height:1.1}
          .nav-links{list-style:none;display:flex;align-items:center;gap:32px}
          .nav-links a{text-decoration:none;color:var(--ink-soft);font-size:0.9rem;font-weight:500;transition:color 0.2s}
          .nav-links a:hover{color:var(--ink)}
          .btn-nav{background:var(--blue);color:white!important;padding:8px 20px;border-radius:8px;font-weight:600!important;transition:background 0.2s!important}
          .btn-nav:hover{background:var(--blue-dark)!important}
          #hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;padding:8px;background:none;border:none;z-index:200}
          #hamburger span{display:block;width:22px;height:2px;background:var(--ink);border-radius:2px;transition:all 0.3s}
          #mobile-menu{display:none;position:fixed;top:68px;left:0;right:0;background:white;border-bottom:1px solid var(--border);box-shadow:0 8px 24px rgba(0,0,0,0.1);z-index:99;padding:16px}
          #mobile-menu ul{list-style:none}

          /* HERO */
          .hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden}
          .hero-bg{position:absolute;inset:0;z-index:0}
          .hero-bg img{width:100%;height:100%;object-fit:cover;object-position:center 30%;opacity:0.55}
          .hero-overlay{position:absolute;inset:0;background:linear-gradient(105deg,rgba(15,23,42,0.82) 0%,rgba(30,58,138,0.70) 45%,rgba(15,23,42,0.40) 100%)}
          .hero-content{position:relative;z-index:1;max-width:1100px;margin:0 auto;width:100%;padding:100px 48px 80px}
          .hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:rgba(147,197,253,0.15);border:1px solid rgba(147,197,253,0.3);color:var(--blue-light);font-size:0.78rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:6px 14px;border-radius:999px;margin-bottom:24px}
          .hero h1{color:white;max-width:680px;margin-bottom:20px}
          .hero-sub{color:rgba(255,255,255,0.8);font-size:1.05rem;max-width:560px;margin-bottom:36px;line-height:1.7}
          .hero-cta-row{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:40px}
          .btn-primary{display:inline-flex;align-items:center;gap:8px;background:var(--blue);color:white;font-weight:700;font-size:0.95rem;padding:14px 28px;border-radius:10px;text-decoration:none;transition:background 0.2s,transform 0.15s,box-shadow 0.2s;box-shadow:0 4px 16px rgba(37,99,235,0.4)}
          .btn-primary:hover{background:var(--blue-dark);transform:translateY(-1px);box-shadow:0 6px 20px rgba(37,99,235,0.5)}
          .btn-ghost{color:rgba(255,255,255,0.8);font-size:0.95rem;font-weight:500;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:color 0.2s}
          .btn-ghost:hover{color:white}
          .hero-badges-desktop{display:flex;gap:20px;flex-wrap:wrap}
          .hero-badge-item{display:flex;align-items:center;gap:6px;color:rgba(255,255,255,0.7);font-size:0.8rem}
          .hero-badge-item span{color:var(--blue-light);font-size:1rem}

          /* TRUST BAR */
          .trust-bar{background:var(--blue-deeper);padding:20px 48px;display:flex;justify-content:center;align-items:center;gap:40px;flex-wrap:wrap}
          .trust-item{display:flex;align-items:center;gap:8px;color:rgba(255,255,255,0.75);font-size:0.82rem;font-weight:500}
          .trust-icon{color:var(--blue-light);font-size:1rem}

          /* SECTIONS */
          section{padding:96px 48px}
          .section-label{font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--blue);margin-bottom:12px}
          .section-sub{color:var(--ink-soft);font-size:1rem;margin-top:16px;line-height:1.7;max-width:600px}
          .section-sub.centered{text-align:center;margin-left:auto;margin-right:auto}

          /* STEPS */
          .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:56px}
          .step{display:flex;flex-direction:column;gap:0}
          .step-img{width:100%;height:200px;object-fit:cover;border-radius:16px 16px 0 0}
          .step-body{background:var(--blue-pale);border-radius:0 0 16px 16px;padding:28px;flex:1}
          .step-num{font-family:'Playfair Display',serif;font-size:2.5rem;font-weight:700;color:var(--blue);line-height:1;margin-bottom:8px}
          .step-body h3{font-size:1.05rem;margin-bottom:8px;color:var(--ink)}
          .step p{font-size:0.88rem;color:var(--ink-soft);line-height:1.7}

          /* SOURCES */
          .sources-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:900px;margin:0 auto}
          .source-card{background:white;border-radius:12px;padding:28px 24px;border:1px solid var(--border);text-align:center;transition:transform 0.2s,box-shadow 0.2s}
          .source-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.08)}
          .source-icon{height:48px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
          .source-icon img{max-height:40px;max-width:120px;object-fit:contain}
          .source-icon-emoji{font-size:2rem}
          .source-name{font-weight:700;color:var(--ink);font-size:0.95rem;margin-bottom:4px}
          .source-desc{font-size:0.78rem;color:var(--ink-soft)}

          /* FEATURES */
          .features-bg{background:var(--cream)}
          .features-grid{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;max-width:1100px;margin:0 auto}
          .feature-list{display:flex;flex-direction:column;gap:24px}
          .feature-item{display:flex;gap:16px;align-items:flex-start}
          .feature-icon{width:44px;height:44px;background:var(--blue-pale);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
          .feature-text h4{font-weight:700;color:var(--ink);font-size:0.95rem;margin-bottom:4px}
          .feature-text p{font-size:0.85rem;color:var(--ink-soft);line-height:1.6}
          .feature-visual{background:var(--blue-deeper);border-radius:20px;padding:40px;color:white}
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
          .price-card.featured .price-note,.price-card.featured .price-feat{color:rgba(255,255,255,0.75)}
          .price-badge{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:var(--blue);color:white;font-size:0.72rem;font-weight:700;letter-spacing:0.06em;padding:4px 14px;border-radius:999px;white-space:nowrap}
          .price-card h3{font-size:1rem;margin-bottom:20px}
          .price-amount{font-family:'Playfair Display',serif;font-size:2.8rem;font-weight:700;color:var(--ink);line-height:1}
          .price-note{font-size:0.78rem;color:var(--ink-soft);margin-top:4px;margin-bottom:20px}
          .price-feats{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:28px}
          .price-feat{font-size:0.85rem;color:var(--ink-soft);display:flex;gap:8px}
          .price-feat::before{content:'✓';color:var(--blue);font-weight:700}
          .price-card.featured .price-feat::before{color:var(--blue-light)}
          .btn-price{display:block;text-align:center;padding:12px;border-radius:8px;font-weight:700;font-size:0.9rem;text-decoration:none;transition:all 0.2s}
          .btn-price-outline{border:2px solid var(--blue);color:var(--blue)}
          .btn-price-outline:hover{background:var(--blue);color:white}
          .btn-price-solid{background:var(--blue-light);color:var(--blue-deeper)}
          .btn-price-solid:hover{background:white}

          /* TESTIMONIALS */
          .testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:56px}
          .testi-card{background:white;border-radius:12px;padding:28px;border:1px solid var(--border)}
          .stars{color:#f59e0b;font-size:0.9rem;margin-bottom:12px}
          .testi-card blockquote{font-size:0.88rem;color:var(--ink-soft);line-height:1.7;margin-bottom:16px;font-style:italic}
          .testi-author{font-weight:700;font-size:0.85rem;color:var(--ink)}
          .testi-role{font-size:0.78rem;color:var(--ink-soft)}

          /* FAQ */
          .faq-list{max-width:700px;margin:40px auto 0;display:flex;flex-direction:column;gap:0}
          .faq-item{border-bottom:1px solid var(--border)}
          .faq-q{width:100%;background:none;border:none;text-align:left;padding:20px 0;font-size:0.95rem;font-weight:600;color:var(--ink);cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px}
          .faq-q:hover{color:var(--blue)}
          .faq-icon{color:var(--blue);font-size:1.1rem;flex-shrink:0;transition:transform 0.2s}
          .faq-a{font-size:0.88rem;color:var(--ink-soft);line-height:1.8;padding-bottom:20px;display:none}
          .faq-item.open .faq-a{display:block}
          .faq-item.open .faq-icon{transform:rotate(45deg)}

          /* CTA BANNER */
          .cta-banner{background:var(--blue-deeper);text-align:center;padding:80px 48px}
          .cta-banner h2{color:white;margin-bottom:16px}
          .cta-banner p{color:rgba(255,255,255,0.75);margin-bottom:32px;font-size:1rem}

          /* FOOTER */
          footer{background:#0f172a;color:rgba(255,255,255,0.5);padding:48px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;font-size:0.83rem}
          footer a{color:rgba(255,255,255,0.5);text-decoration:none;margin-left:24px}
          footer a:hover{color:var(--blue-light)}

          /* ANIMATIONS */
          @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
          .fade-in{opacity:0;transform:translateY(20px);transition:opacity 0.7s ease,transform 0.7s ease}
          .fade-in.visible{opacity:1;transform:translateY(0)}

          /* RESPONSIVE */
          @media(max-width:900px){
            nav{padding:0 20px}
            .nav-links{display:none!important}
            #hamburger{display:flex!important}
            section{padding:64px 24px}
            .hero-content{padding:100px 24px 72px!important}
            .steps,.testi-grid{grid-template-columns:1fr}
            .sources-grid{grid-template-columns:1fr 1fr}
            .features-grid,.pricing-grid{grid-template-columns:1fr}
            footer{flex-direction:column;text-align:center}
            footer a{margin:0 12px}
            .trust-bar{padding:16px 24px;gap:20px}
            .hero-badges-desktop{display:none!important}
            .cta-banner{padding:64px 24px}
          }
          @media(max-width:500px){
            .sources-grid{grid-template-columns:1fr}
            .pricing-grid{grid-template-columns:1fr}
          }
        `}</style>
      </head>
      <body>

        {/* NAV */}
        <nav id="navbar">
          <a href="/" className="logo">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="logo-text-top">slimme</div>
              <div className="logo-text-bot">kascontrole</div>
            </div>
          </a>
          <ul className="nav-links">
            <li><a href="#waarom">Waarom</a></li>
            <li><a href="#hoe-het-werkt">Hoe het werkt</a></li>
            <li><a href="#tarieven">Tarieven</a></li>
            <li><a href="/mijn-omgeving">Mijn omgeving</a></li>
            <li><a href="/contact" className="btn-nav">Contact</a></li>
          </ul>
          <button id="hamburger" onClick={() => {}} aria-label="Menu">
            <span id="bar1"></span>
            <span id="bar2"></span>
            <span id="bar3"></span>
          </button>
        </nav>

        {/* MOBILE MENU */}
        <div id="mobile-menu">
          <ul>
            <li><a href="#waarom" style={{display:'block',padding:'12px 16px',color:'#0f172a',textDecoration:'none',fontWeight:'500',borderRadius:'8px',fontSize:'0.95rem'}}>Waarom</a></li>
            <li><a href="#hoe-het-werkt" style={{display:'block',padding:'12px 16px',color:'#0f172a',textDecoration:'none',fontWeight:'500',borderRadius:'8px',fontSize:'0.95rem'}}>Hoe het werkt</a></li>
            <li><a href="#tarieven" style={{display:'block',padding:'12px 16px',color:'#0f172a',textDecoration:'none',fontWeight:'500',borderRadius:'8px',fontSize:'0.95rem'}}>Tarieven</a></li>
            <li><a href="/mijn-omgeving" style={{display:'block',padding:'12px 16px',color:'#0f172a',textDecoration:'none',fontWeight:'500',borderRadius:'8px',fontSize:'0.95rem'}}>Mijn omgeving</a></li>
            <li><a href="/contact" style={{display:'block',padding:'12px 16px',color:'#0f172a',textDecoration:'none',fontWeight:'500',borderRadius:'8px',fontSize:'0.95rem'}}>Contact</a></li>
            <li style={{marginTop:'8px'}}><a href="/registreer" style={{display:'block',padding:'14px 16px',background:'#2563EB',color:'white',textDecoration:'none',fontWeight:'700',borderRadius:'8px',textAlign:'center',fontSize:'0.95rem'}}>Account aanmaken</a></li>
          </ul>
        </div>

        {/* HERO */}
        <div className="hero">
          <div className="hero-bg">
            <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=85" alt="Kascontrole"/>
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-eyebrow">✦ Verplicht voor elke vereniging</div>
            <h1>Uw kascontrole klaar<br/>voor de <em>volgende ALV</em></h1>
            <p className="hero-sub">Upload uw financiële bestanden en ontvang een volledig gecontroleerd kascontrolerapport, opgesteld door onze kascontroleurs. Betrouwbaar, veilig en conform de wettelijke eisen.</p>
            <div className="hero-cta-row">
              <a href="/registreer" className="btn-primary">Start nu — €59 per boekjaar →</a>
              <a href="#hoe-het-werkt" className="btn-ghost">Hoe werkt het?</a>
            </div>
            <div className="hero-badges-desktop">
              <div className="hero-badge-item"><span>🔒</span> SSL-beveiligd</div>
              <div className="hero-badge-item"><span>🇳🇱</span> Data opgeslagen in NL</div>
              <div className="hero-badge-item"><span>✓</span> AVG-conform</div>
              <div className="hero-badge-item"><span>📄</span> Direct als PDF</div>
            </div>
          </div>
        </div>

        {/* TRUST BAR */}
        <div className="trust-bar">
          <div className="trust-item"><span className="trust-icon">🏛️</span> Wettelijk verplicht voor verenigingen</div>
          <div className="trust-item"><span className="trust-icon">🔍</span> 100% controle, geen steekproeven</div>
          <div className="trust-item"><span className="trust-icon">📄</span> Rapport direct als PDF</div>
          <div className="trust-item"><span className="trust-icon">🔒</span> Veilig &amp; AVG-conform</div>
        </div>

        {/* WAAROM SECTIE */}
        <section id="waarom" style={{background:'var(--white)'}}>
          <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'64px',alignItems:'center'}}>
            <div>
              <p className="section-label fade-in">Waarom SlimmeKascontrole?</p>
              <h2 className="fade-in">Kascontrole is <em>wettelijk verplicht</em></h2>
              <p className="section-sub fade-in">Elke Nederlandse vereniging is verplicht om jaarlijks de financiële administratie te laten controleren door een kascommissie. Toch zijn veel kascommissies slecht uitgerust voor die taak.</p>
              <div style={{display:'flex',flexDirection:'column',gap:'16px',marginTop:'28px'}}>
                <div className="feature-item fade-in">
                  <div className="feature-icon">📋</div>
                  <div className="feature-text">
                    <h4>Verplicht door wet en statuten</h4>
                    <p>Artikel 2:48 BW verplicht verenigingen tot jaarlijkse financiële controle. Een professioneel rapport beschermt het bestuur en geeft leden vertrouwen.</p>
                  </div>
                </div>
                <div className="feature-item fade-in">
                  <div className="feature-icon">⏱️</div>
                  <div className="feature-text">
                    <h4>Handmatige controle kost te veel tijd</h4>
                    <p>Vrijwilligers spenderen gemiddeld 8 uur aan een kascontrole. Wij verwerken uw bestanden en leveren een volledig rapport binnen 24 uur.</p>
                  </div>
                </div>
                <div className="feature-item fade-in">
                  <div className="feature-icon">✅</div>
                  <div className="feature-text">
                    <h4>Volledig gecontroleerd — geen steekproeven</h4>
                    <p>Elke factuur, elk saldo, elke boeking wordt gecontroleerd. Niets wordt overgeslagen.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="fade-in">
              <img src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=700&q=80" alt="Kascontrole" style={{width:'100%',borderRadius:'16px',boxShadow:'0 16px 48px rgba(0,0,0,0.12)'}}/>
            </div>
          </div>
        </section>

        {/* HOE HET WERKT */}
        <section id="hoe-het-werkt" style={{background:'var(--cream)'}}>
          <div style={{maxWidth:'1100px',margin:'0 auto'}}>
            <p className="section-label fade-in" style={{textAlign:'center'}}>Hoe het werkt</p>
            <h2 className="fade-in" style={{textAlign:'center'}}>Drie stappen naar uw <em>rapport</em></h2>
            <div className="steps">
              <div className="step fade-in">
                <img className="step-img" src="https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?w=600&q=80" alt="Bestanden uploaden"/>
                <div className="step-body">
                  <div className="step-num" style={{color:'var(--blue)'}}>01</div>
                  <h3>Upload uw bestanden</h3>
                  <p>Upload uw boekhouding, bankafschriften of kasboek. Wij accepteren PDF, Excel en CSV vanuit Twinq, Isabel, Yuki of uw eigen administratie.</p>
                </div>
              </div>
              <div className="step fade-in">
                <img className="step-img" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80" alt="Controle"/>
                <div className="step-body">
                  <div className="step-num" style={{color:'var(--blue)'}}>02</div>
                  <h3>Onze kascontroleurs controleren</h3>
                  <p>Uw bestanden worden veilig versleuteld opgeslagen. Uw gegevens worden nooit gedeeld met derden en veilig opgeslagen in Nederland.</p>
                </div>
              </div>
              <div className="step fade-in">
                <img className="step-img" src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80" alt="Rapport ontvangen"/>
                <div className="step-body">
                  <div className="step-num" style={{color:'var(--blue)'}}>03</div>
                  <h3>Ontvang uw volledig rapport</h3>
                  <p>Na eenmalige betaling van €59 incl. btw stellen onze kascontroleurs uw rapport op. Direct als PDF, klaar voor presentatie op uw ALV.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BRONNEN SECTIE */}
        <section>
          <div style={{maxWidth:'1100px',margin:'0 auto',textAlign:'center'}}>
            <p className="section-label fade-in">Waar haalt u uw gegevens vandaan?</p>
            <h2 className="fade-in">Ondersteunde <em>bronnen</em></h2>
            <p className="section-sub centered fade-in">Wij verwerken bestanden uit alle gangbare boekhoud- en banksystemen.</p>
            <div className="sources-grid" style={{marginTop:'48px'}}>
              <div className="source-card fade-in">
                <div className="source-icon">
                  <img src="/twinq-logo.jpg" alt="Twinq"/>
                </div>
                <div className="source-name">Twinq</div>
                <div className="source-desc">Export via Twinq dashboard als Excel of PDF</div>
              </div>
              <div className="source-card fade-in">
                <div className="source-icon">
                  <div className="source-icon-emoji">💼</div>
                </div>
                <div className="source-name">Isabel / Yuki</div>
                <div className="source-desc">Boekhoudexport als CSV of Excel</div>
              </div>
              <div className="source-card fade-in">
                <div className="source-icon">
                  <div className="source-icon-emoji">📁</div>
                </div>
                <div className="source-name">Eigen Excel</div>
                <div className="source-desc">Uw eigen kasboek of Excel-overzicht</div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features-bg">
          <div className="features-grid">
            <div>
              <p className="section-label fade-in">Functies</p>
              <h2 className="fade-in">Alles wat een kascommissie <em>nodig heeft</em></h2>
              <p className="section-sub fade-in">Speciaal ontwikkeld voor Nederlandse verenigingen, VvE&apos;s en stichtingen.</p>
              <div className="feature-list" style={{marginTop:'32px'}}>
                <div className="feature-item fade-in">
                  <div className="feature-icon">🔍</div>
                  <div className="feature-text">
                    <h4>Volledige controle — geen steekproeven</h4>
                    <p>Elke factuur, elk saldo, elke boeking wordt gecontroleerd. Niets gaat door de mazen van het net.</p>
                  </div>
                </div>
                <div className="feature-item fade-in">
                  <div className="feature-icon">📊</div>
                  <div className="feature-text">
                    <h4>Trendanalyse over meerdere jaren</h4>
                    <p>Vergelijk inkomsten en uitgaven over de jaren heen. Stel het bestuur bij met concrete cijfers.</p>
                  </div>
                </div>
                <div className="feature-item fade-in">
                  <div className="feature-icon">📄</div>
                  <div className="feature-text">
                    <h4>Professioneel PDF-rapport</h4>
                    <p>Direct klaar voor presentatie op de ALV. Inclusief samenvatting, bevindingen en handtekeningveld.</p>
                  </div>
                </div>
                <div className="feature-item fade-in">
                  <div className="feature-icon">🔒</div>
                  <div className="feature-text">
                    <h4>Veilig en AVG-conform</h4>
                    <p>Alle bestanden worden versleuteld opgeslagen in Nederlandse datacenters. Nooit gedeeld met derden.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="feature-visual fade-in">
              <p className="fv-title">Wat uw rapport bevat</p>
              <ul className="check-list">
                <li>Saldocontrole per rekening en periode</li>
                <li>Vergelijking begroting vs. werkelijk</li>
                <li>Overzicht van ongebruikelijke transacties</li>
                <li>Trendanalyse inkomsten &amp; uitgaven</li>
                <li>Bevindingen en aanbevelingen</li>
                <li>Ondertekeningsveld kascommissie</li>
                <li>Klaar voor archivering &amp; ALV-presentatie</li>
              </ul>
            </div>
          </div>
        </section>

        {/* TARIEVEN */}
        <section className="pricing-bg" id="tarieven">
          <div style={{maxWidth:'1100px',margin:'0 auto',textAlign:'center'}}>
            <p className="section-label fade-in">Tarieven</p>
            <h2 className="fade-in">Transparante <em>prijzen</em></h2>
            <p className="section-sub centered fade-in">Geen verborgen kosten. Geen abonnement. Betaal per boekjaar.</p>
            <div className="pricing-grid" style={{marginTop:'48px'}}>
              <div className="price-card fade-in">
                <h3>Standaard controle</h3>
                <div className="price-amount">€59</div>
                <div className="price-note">incl. btw — per boekjaar</div>
                <ul className="price-feats">
                  <li className="price-feat">Volledig gecontroleerd kascontrolerapport</li>
                  <li className="price-feat">Tot 3 bestanden uploaden</li>
                  <li className="price-feat">PDF-rapport binnen 24 uur</li>
                  <li className="price-feat">Klaar voor ALV-presentatie</li>
                </ul>
                <a href="/registreer" className="btn-price btn-price-outline">Start nu</a>
              </div>
              <div className="price-card featured fade-in">
                <div className="price-badge">Meest gekozen</div>
                <h3>Uitgebreide controle</h3>
                <div className="price-amount">€89</div>
                <div className="price-note">incl. btw — per boekjaar</div>
                <ul className="price-feats">
                  <li className="price-feat">Alles uit Standaard</li>
                  <li className="price-feat">Trendanalyse (tot 3 jaar)</li>
                  <li className="price-feat">Onbeperkt bestanden</li>
                  <li className="price-feat">Prioriteit afhandeling</li>
                  <li className="price-feat">Telefonische toelichting</li>
                </ul>
                <a href="/registreer" className="btn-price btn-price-solid">Start nu</a>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section>
          <div style={{maxWidth:'1100px',margin:'0 auto',textAlign:'center'}}>
            <p className="section-label fade-in">Ervaringen</p>
            <h2 className="fade-in">Wat verenigingen <em>zeggen</em></h2>
            <div className="testi-grid">
              <div className="testi-card fade-in">
                <div className="stars">★★★★★</div>
                <blockquote>&ldquo;Als penningmeester ben ik elk jaar uren kwijt aan de kascontrole. Nu is het in een uurtje klaar en ziet het rapport er ook nog eens professioneel uit.&rdquo;</blockquote>
                <p className="testi-author">Marieke van den Berg</p>
                <p className="testi-role">Penningmeester, SV Oranje</p>
              </div>
              <div className="testi-card fade-in">
                <div className="stars">★★★★★</div>
                <blockquote>&ldquo;De controle vond een dubbele boeking die wij jarenlang over het hoofd hadden gezien. Ontzettend fijn dat dit nu automatisch gaat.&rdquo;</blockquote>
                <p className="testi-author">Jan Plomp</p>
                <p className="testi-role">Kascommissielid, Buurtvereniging De Eiken</p>
              </div>
              <div className="testi-card fade-in">
                <div className="stars">★★★★★</div>
                <blockquote>&ldquo;Eindelijk een tool die echt voor verenigingen is gemaakt, niet voor accountants. Onze leden op de ALV waren onder de indruk van het rapport.&rdquo;</blockquote>
                <p className="testi-author">Sandra Kuipers</p>
                <p className="testi-role">Secretaris, Hobbyclub Atelier</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{background:'var(--cream)'}}>
          <div style={{maxWidth:'1100px',margin:'0 auto',textAlign:'center'}}>
            <p className="section-label fade-in">Veelgestelde vragen</p>
            <h2 className="fade-in">Heeft u een <em>vraag</em>?</h2>
            <div className="faq-list">
              {[
                {v:'Hoe snel ontvang ik mijn rapport?', a:'Direct na betaling kunt u uw bestanden uploaden. Onze kascontroleurs leveren het rapport binnen 24 uur.'},
                {v:'Welke bestanden kan ik uploaden?', a:'PDF, Excel (.xlsx, .xls) en CSV. U kunt bestanden exporteren vanuit Twinq, Isabel, Yuki of uw eigen kasboek.'},
                {v:'Is mijn financiële data veilig?', a:'Ja. Al uw bestanden worden versleuteld opgeslagen in Nederlandse datacenters. Wij delen nooit gegevens met derden.'},
                {v:'Kan ik rapporten van meerdere jaren opslaan?', a:'Ja, uw omgeving bewaart alle uploads en rapporten. Zo kunt u eenvoudig vergelijken over de jaren heen.'},
                {v:'Wat als ik hulp nodig heb?', a:'Bel of mail ons gerust. Wij helpen u door het proces en zorgen dat uw rapport er professioneel uitziet.'},
              ].map((item,i) => (
                <div className="faq-item" key={i}>
                  <button className="faq-q" onClick={() => {}} data-faq={i}>
                    {item.v}
                    <span className="faq-icon">+</span>
                  </button>
                  <div className="faq-a">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <div className="cta-banner">
          <h2 className="fade-in" style={{color:'white'}}>Klaar om te starten?</h2>
          <p className="fade-in">Maak een account aan en upload uw eerste bestanden. Binnen 24 uur heeft u uw rapport.</p>
          <a href="/registreer" className="btn-primary fade-in" style={{display:'inline-flex'}}>Account aanmaken →</a>
        </div>

        {/* FOOTER */}
        <footer>
          <a href="/" className="logo" style={{textDecoration:'none'}}>
            <div className="logo-icon">
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="logo-text-top" style={{color:'rgba(255,255,255,0.6)'}}>slimme</div>
              <div className="logo-text-bot" style={{color:'white',fontSize:'0.95rem'}}>kascontrole</div>
            </div>
          </a>
          <span>© 2025 SlimmeKascontrole.nl — Alle rechten voorbehouden</span>
          <div>
            <a href="/privacy">Privacy</a>
            <a href="/voorwaarden">Voorwaarden</a>
            <a href="/contact">Contact</a>
          </div>
        </footer>

        <script dangerouslySetInnerHTML={{__html:`
          // Sticky nav
          window.addEventListener('scroll',()=>{
            document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>10)
          })

          // Scroll animations
          const obs=new IntersectionObserver((entries)=>{
            entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('visible'),i*80)})
          },{threshold:0.1})
          document.querySelectorAll('.fade-in').forEach(el=>obs.observe(el))

          // Hamburger menu
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
          document.getElementById('hamburger').addEventListener('click',toggleMenu)
          document.querySelectorAll('#mobile-menu a[href^="#"]').forEach(a=>a.addEventListener('click',closeMenu))

          // FAQ accordion
          document.querySelectorAll('.faq-q').forEach(btn=>{
            btn.addEventListener('click',()=>{
              const item=btn.parentElement
              const wasOpen=item.classList.contains('open')
              document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'))
              if(!wasOpen)item.classList.add('open')
            })
          })
        `}}/>

      </body>
      </html>
    </>
  )
}
