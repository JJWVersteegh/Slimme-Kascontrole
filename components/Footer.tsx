export default function Footer() {
  return (
    <>
      <style>{`
        .skc-footer{background:#0f172a;color:rgba(255,255,255,0.5);padding:40px 48px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;font-size:0.8rem;font-family:Outfit,sans-serif}
        .skc-footer-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .skc-footer a{color:rgba(255,255,255,0.5);text-decoration:none}
        .skc-footer a:hover{color:#93c5fd}
        .skc-footer-links{display:flex;gap:20px;flex-wrap:wrap}
        @media(max-width:900px){.skc-footer{flex-direction:column;text-align:center;padding:32px 20px}.skc-footer-links{justify-content:center}}
      `}</style>
      <footer className="skc-footer">
        <a href="/" className="skc-footer-logo">
          <div style={{ background: '#2563EB', width: '34px', height: '34px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>slimme</div>
            <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>kascontrole</div>
          </div>
        </a>
        <span>© 2026 Slimme Kascontrole · Vertras B.V. · KvK 59010215</span>
        <div className="skc-footer-links">
          <a href="/voorwaarden">Voorwaarden</a>
          <a href="/privacyverklaring">Privacyverklaring</a>
          <a href="/#contact">Contact</a>
          <a href="/mijn-omgeving">Mijn omgeving</a>
          <a href="/registreer">Account aanmaken</a>
        </div>
      </footer>
    </>
  )
}
