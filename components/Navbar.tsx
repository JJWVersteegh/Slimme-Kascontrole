'use client'

import { ReactNode, useState } from 'react'

type NavLink = { href: string; label: string; primary?: boolean; outline?: boolean; active?: boolean }

const publicLinks: NavLink[] = [
  { href: '/#hoe-het-werkt', label: 'Hoe het werkt' },
  { href: '/#waarom', label: 'Waarom' },
  { href: '/#handleidingen', label: 'Handleidingen' },
  { href: '/#over-ons', label: 'Over ons' },
  { href: '/#tarieven', label: 'Tarieven' },
  { href: '/#contact', label: 'Contact' },
  { href: '/registreer?mode=login', label: 'Inloggen', outline: true },
  { href: '/registreer', label: 'Account aanmaken', primary: true },
]

interface NavbarProps {
  links?: NavLink[]
  rightContent?: ReactNode
  mobileExtra?: ReactNode
  className?: string
}

export default function Navbar({ links = publicLinks, rightContent, mobileExtra, className = '' }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const isSingleBackLink = links.length === 1

  return (
    <>
      <style>{`
        .skc-nav{position:fixed;top:0;left:0;right:0;z-index:200;background:rgba(255,255,255,0.97);backdrop-filter:blur(12px);border-bottom:1px solid #e2e8f0;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 48px;box-sizing:border-box;width:100%;max-width:100%;transition:box-shadow 0.3s}
        .skc-nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0}
        .skc-nav-logo-icon{background:#2563EB;width:38px;height:38px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .skc-nav-links{display:flex;gap:28px;list-style:none;align-items:center;flex-wrap:wrap;margin:0;padding:0}
        .skc-nav-links a{font-size:0.88rem;font-weight:500;color:#475569;text-decoration:none;transition:color 0.2s;font-family:Outfit,sans-serif}
        .skc-nav-links a:hover{color:#2563EB}
        .skc-btn-nav{background:#2563EB;color:white!important;padding:9px 20px;border-radius:6px;font-weight:600;transition:background 0.2s!important}
        .skc-btn-nav:hover{background:#1D4ED8!important}
        .skc-btn-nav-outline{background:white;color:#1e3a8a!important;padding:9px 20px;border-radius:6px;font-weight:600;border:2px solid #bfdbfe;transition:all 0.2s!important}
        .skc-btn-nav-outline:hover{background:#eff6ff!important;border-color:#93c5fd!important}
        .skc-hamburger{display:none;background:none;border:1.5px solid #e2e8f0;border-radius:6px;cursor:pointer;padding:7px;flex-direction:column;gap:4px;align-items:center;justify-content:center}
        .skc-ham-bar{display:block;width:20px;height:2px;background:#0f172a;border-radius:2px;transition:all 0.3s}
        .skc-mobile-menu{position:fixed;top:72px;left:0;right:0;background:white;border-bottom:1px solid #e2e8f0;z-index:199;padding:12px 20px 20px;box-shadow:0 8px 24px rgba(0,0,0,0.1);box-sizing:border-box}
        .skc-mobile-menu a{display:block;padding:12px 16px;color:#0f172a;text-decoration:none;font-weight:500;border-radius:8px;font-size:0.95rem;transition:background 0.15s;font-family:Outfit,sans-serif}
        .skc-mobile-menu a:hover{background:#f8fafc}
        .skc-mobile-menu .skc-mobile-btn{background:#2563EB;color:white!important;text-align:center;margin-top:8px;font-weight:700}
        .skc-mobile-menu .skc-mobile-btn-outline{background:white;color:#1e3a8a!important;text-align:center;margin-top:8px;font-weight:700;border:2px solid #bfdbfe}
        .skc-back-mobile{display:none;align-items:center;gap:6px;color:#2563EB;font-size:0.88rem;font-weight:600;text-decoration:none;font-family:Outfit,sans-serif;background:#eff6ff;border:1.5px solid #bfdbfe;padding:7px 14px;border-radius:8px;white-space:nowrap}
        @media(max-width:900px){.skc-nav{padding:0 20px}.skc-nav-links,.skc-nav-right{display:none!important}.skc-hamburger{display:flex!important}.skc-back-mobile{display:flex!important}}
        @media(max-width:500px){.skc-nav{padding:0 16px!important}}
      `}</style>

      <nav className={`skc-nav ${className}`.trim()}>
        <a href="/" className="skc-nav-logo">
          <div className="skc-nav-logo-icon">
            <svg width="20" height="20" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#2563EB', fontFamily: 'Outfit, sans-serif' }}>slimme</div>
            <div style={{ fontWeight: 500, fontSize: '1rem', color: '#3b82f6', fontFamily: 'Outfit, sans-serif' }}>kascontrole</div>
          </div>
        </a>

        {rightContent ? (
          <div className="skc-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>{rightContent}</div>
        ) : (
          <ul className="skc-nav-links">
            {links.filter(link => !link.primary && !link.outline).map(link => (
              <li key={`${link.href}-${link.label}`}>
                <a href={link.href} style={link.active ? { color: '#2563EB' } : undefined}>{link.label}</a>
              </li>
            ))}
            {links.some(link => link.primary || link.outline) && (
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {links.filter(link => link.primary || link.outline).map(link => (
                  <a key={`${link.href}-${link.label}`} href={link.href} className={link.primary ? 'skc-btn-nav' : 'skc-btn-nav-outline'} style={link.active ? { color: '#2563EB' } : undefined}>{link.label}</a>
                ))}
              </li>
            )}
          </ul>
        )}

        {isSingleBackLink ? (
          <a href={links[0].href} className="skc-back-mobile">← Terug</a>
        ) : (
          <button className="skc-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span className="skc-ham-bar" style={{ transform: open ? 'rotate(45deg) translate(5px,5px)' : undefined }} />
            <span className="skc-ham-bar" style={{ opacity: open ? 0 : 1 }} />
            <span className="skc-ham-bar" style={{ transform: open ? 'rotate(-45deg) translate(5px,-5px)' : undefined }} />
          </button>
        )}
      </nav>

      {open && (
        <div className="skc-mobile-menu">
          {links.map(link => (
            <a key={`${link.href}-${link.label}`} href={link.href} onClick={() => setOpen(false)} className={link.primary ? 'skc-mobile-btn' : link.outline ? 'skc-mobile-btn-outline' : undefined} style={link.active ? { color: '#2563EB' } : undefined}>{link.label}</a>
          ))}
          {mobileExtra}
        </div>
      )}
    </>
  )
}
