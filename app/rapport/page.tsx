'use client'
import { useState } from 'react'

interface RapportData {
  vereniging: string
  beheerder: string
  boekjaar: string
  rapport: string
}

export default function RapportGenerator() {
  const [stap, setStap] = useState(1)
  const [loading, setLoading] = useState(false)
  const [rapport, setRapport] = useState<RapportData | null>(null)
  const [error, setError] = useState('')

  // Stap 1: verenigingsgegevens
  const [vereniging, setVereniging] = useState('')
  const [beheerder, setBeheerder] = useState('')
  const [boekjaar, setBoekjaar] = useState(new Date().getFullYear().toString())
  const [stad, setStad] = useState('')

  // Stap 2: financiële gegevens (tekst invoer)
  const [beginsaldo, setBeginsaldo] = useState('')
  const [eindsaldo, setEindsaldo] = useState('')
  const [totaalInkomsten, setTotaalInkomsten] = useState('')
  const [totaalUitgaven, setTotaalUitgaven] = useState('')
  const [aantalFacturen, setAantalFacturen] = useState('')
  const [bijzonderheden, setBijzonderheden] = useState('')
  const [begroting, setBegroting] = useState('')

  async function genereerRapport() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/rapport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vereniging, beheerder, boekjaar, stad, beginsaldo, eindsaldo, totaalInkomsten, totaalUitgaven, aantalFacturen, bijzonderheden, begroting }),
      })

      const data = await response.json()
      const tekst = data.rapport || ''

      if (tekst) {
        setRapport({ vereniging, beheerder, boekjaar, rapport: tekst })
        setStap(3)
      } else {
        setError('Er ging iets mis bij het genereren. Probeer opnieuw.')
      }
    } catch {
      setError('Er ging iets mis. Controleer uw internetverbinding.')
    }
    setLoading(false)
  }

  function printRapport() {
    window.print()
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: '8px',
    border: '1.5px solid #c8e0d4', fontSize: '0.95rem',
    background: 'white', outline: 'none', fontFamily: 'Inter, sans-serif'
  }

  const labelStyle = {
    display: 'block' as const, fontWeight: '600' as const,
    color: '#1e3a8a', marginBottom: '6px', fontSize: '0.9rem'
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .rapport-content { padding: 0 !important; }
          body { background: white !important; }
        }
        .aandachtspunt {
          background: #fff8e6;
          border-left: 4px solid #c9a84c;
          padding: 12px 16px;
          margin: 12px 0;
          border-radius: 0 8px 8px 0;
        }
      `}</style>

      <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
        {/* Nav */}
        <nav className="no-print" style={{ background: 'white', borderBottom: '1px solid #e0ede6', padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ background: '#2563EB', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span style={{ fontWeight: '700', color: '#1e3a8a' }}>Slimme Kascontrole</span>
          </a>
          <a href="/mijn-omgeving" style={{ color: '#1e3a8a', textDecoration: 'none', fontSize: '0.9rem' }}>← Mijn omgeving</a>
        </nav>

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>

          {/* Stappen indicator */}
          {stap < 3 && (
            <div className="no-print" style={{ display: 'flex', gap: '8px', marginBottom: '40px', alignItems: 'center' }}>
              {[1, 2].map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: stap >= s ? '#1e3a8a' : '#e0ede6',
                    color: stap >= s ? 'white' : '#475569',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: '700', fontSize: '0.85rem'
                  }}>{s}</div>
                  <span style={{ fontSize: '0.85rem', color: stap >= s ? '#1e3a8a' : '#475569', fontWeight: stap === s ? '600' : '400' }}>
                    {s === 1 ? 'Verenigingsgegevens' : 'Financiële gegevens'}
                  </span>
                  {s < 2 && <div style={{ width: '40px', height: '2px', background: stap > s ? '#1e3a8a' : '#e0ede6' }} />}
                </div>
              ))}
            </div>
          )}

          {/* STAP 1: Verenigingsgegevens */}
          {stap === 1 && (
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '8px' }}>Kascontrolerapport genereren</h1>
              <p style={{ color: '#475569', marginBottom: '40px' }}>Vul de gegevens in en ontvang automatisch een professioneel rapport.</p>

              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #e0ede6', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '24px' }}>Stap 1 — Verenigingsgegevens</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Naam vereniging *</label>
                    <input style={inputStyle} value={vereniging} onChange={e => setVereniging(e.target.value)} placeholder="bijv. VVE De Goudstraat" />
                  </div>
                  <div>
                    <label style={labelStyle}>Beheerder / Penningmeester *</label>
                    <input style={inputStyle} value={beheerder} onChange={e => setBeheerder(e.target.value)} placeholder="bijv. Kolpa VvE Beheer B.V." />
                  </div>
                  <div>
                    <label style={labelStyle}>Boekjaar *</label>
                    <select style={inputStyle} value={boekjaar} onChange={e => setBoekjaar(e.target.value)}>
                      {[2026, 2025, 2024, 2023, 2022].map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Stad</label>
                    <input style={inputStyle} value={stad} onChange={e => setStad(e.target.value)} placeholder="bijv. Rotterdam" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!vereniging || !beheerder) { setError('Vul alle verplichte velden in'); return }
                  setError(''); setStap(2)
                }}
                style={{ background: '#1e3a8a', color: 'white', padding: '14px 32px', borderRadius: '8px', border: 'none', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Volgende stap →
              </button>
              {error && <p style={{ color: '#d44', marginTop: '12px', fontSize: '0.9rem' }}>{error}</p>}
            </div>
          )}

          {/* STAP 2: Financiële gegevens */}
          {stap === 2 && (
            <div>
              <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '8px' }}>Financiële gegevens</h1>
              <p style={{ color: '#475569', marginBottom: '32px' }}>Vul de cijfers in uit de jaarrekening of bankafschriften.</p>

              <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #e0ede6', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '24px' }}>Stap 2 — Financiële gegevens</h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>Beginsaldo (€) *</label>
                    <input style={inputStyle} value={beginsaldo} onChange={e => setBeginsaldo(e.target.value)} placeholder="bijv. 11993.38" type="number" step="0.01" />
                  </div>
                  <div>
                    <label style={labelStyle}>Eindsaldo (€) *</label>
                    <input style={inputStyle} value={eindsaldo} onChange={e => setEindsaldo(e.target.value)} placeholder="bijv. 10058.21" type="number" step="0.01" />
                  </div>
                  <div>
                    <label style={labelStyle}>Totaal inkomsten (€) *</label>
                    <input style={inputStyle} value={totaalInkomsten} onChange={e => setTotaalInkomsten(e.target.value)} placeholder="bijv. 24492.00" type="number" step="0.01" />
                  </div>
                  <div>
                    <label style={labelStyle}>Totaal uitgaven (€) *</label>
                    <input style={inputStyle} value={totaalUitgaven} onChange={e => setTotaalUitgaven(e.target.value)} placeholder="bijv. 26427.17" type="number" step="0.01" />
                  </div>
                  <div>
                    <label style={labelStyle}>Aantal verwerkte facturen</label>
                    <input style={inputStyle} value={aantalFacturen} onChange={e => setAantalFacturen(e.target.value)} placeholder="bijv. 40" type="number" />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={labelStyle}>Begrotingsvergelijking <span style={{ fontWeight: '400', color: '#999' }}>(optioneel)</span></label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                    value={begroting}
                    onChange={e => setBegroting(e.target.value)}
                    placeholder="bijv. Begroting voorzag €24.212 inkomsten en €24.212 uitgaven. Schoonmaak begroot €3.500 maar slechts €387 gerealiseerd."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Bijzonderheden / aandachtspunten <span style={{ fontWeight: '400', color: '#999' }}>(optioneel)</span></label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                    value={bijzonderheden}
                    onChange={e => setBijzonderheden(e.target.value)}
                    placeholder="bijv. Ontbrekende factuur nr. 8, openstaande debiteur Businessbay B.V. €1.162 (2 jaar niet betaald), schoonmaakcontract opgezegd oktober 2025..."
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => setStap(1)}
                  style={{ background: 'white', color: '#1e3a8a', padding: '14px 24px', borderRadius: '8px', border: '1.5px solid #c8e0d4', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}
                >
                  ← Terug
                </button>
                <button
                  onClick={() => {
                    if (!beginsaldo || !eindsaldo || !totaalInkomsten || !totaalUitgaven) {
                      setError('Vul alle verplichte velden in'); return
                    }
                    setError(''); genereerRapport()
                  }}
                  disabled={loading}
                  style={{ background: '#1e3a8a', color: 'white', padding: '14px 32px', borderRadius: '8px', border: 'none', fontSize: '1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? '⏳ Rapport genereren...' : '🤖 Genereer AI rapport'}
                </button>
              </div>
              {error && <p style={{ color: '#d44', marginTop: '12px', fontSize: '0.9rem' }}>{error}</p>}
              {loading && (
                <div style={{ marginTop: '20px', background: '#eff6ff', borderRadius: '8px', padding: '16px' }}>
                  <p style={{ color: '#1e3a8a', margin: 0, fontSize: '0.9rem' }}>⏳ AI analyseert de financiële gegevens en schrijft uw rapport... Dit duurt ongeveer 15-30 seconden.</p>
                </div>
              )}
            </div>
          )}

          {/* STAP 3: Rapport */}
          {stap === 3 && rapport && (
            <div>
              <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#1e3a8a', marginBottom: '4px' }}>Rapport gegenereerd ✓</h1>
                  <p style={{ color: '#475569' }}>{rapport.vereniging} — Boekjaar {rapport.boekjaar}</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => { setStap(1); setRapport(null) }}
                    style={{ background: 'white', color: '#1e3a8a', padding: '12px 20px', borderRadius: '8px', border: '1.5px solid #c8e0d4', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Nieuw rapport
                  </button>
                  <button
                    onClick={printRapport}
                    style={{ background: '#1e3a8a', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    🖨️ Afdrukken / PDF
                  </button>
                </div>
              </div>

              {/* Rapport inhoud */}
              <div className="rapport-content" style={{ background: 'white', borderRadius: '16px', padding: '48px', border: '1px solid #e0ede6', lineHeight: '1.8' }}>
                {/* Rapport header */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0d3d2e', paddingBottom: '24px', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#2563EB', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <span style={{ fontWeight: '700', color: '#1e3a8a', fontSize: '1.1rem' }}>slimmekascontrole.nl</span>
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1e3a8a', margin: '0 0 8px' }}>KASCOMMISSIE RAPPORT</h2>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e3a8a', margin: '0 0 4px' }}>{rapport.vereniging}</h3>
                  <p style={{ color: '#475569', margin: 0 }}>Boekjaar {rapport.boekjaar} · Opgesteld door slimmekascontrole.nl</p>
                </div>

                {/* Rapport tekst */}
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', color: '#1a1a18' }}>
                  {rapport.rapport.split('\n').map((line, i) => {
                    if (line.startsWith('[AANDACHTSPUNT:')) {
                      return <div key={i} className="aandachtspunt"><strong>⚠️ Aandachtspunt</strong><br />{line.replace('[AANDACHTSPUNT:', '').replace(']', '')}</div>
                    }
                    if (line.startsWith('# ')) {
                      return <h2 key={i} style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e3a8a', marginTop: '28px', marginBottom: '12px' }}>{line.replace('# ', '')}</h2>
                    }
                    if (line.startsWith('## ')) {
                      return <h3 key={i} style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1e3a8a', marginTop: '20px', marginBottom: '8px' }}>{line.replace('## ', '')}</h3>
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={i} style={{ fontWeight: '700', margin: '4px 0' }}>{line.replace(/\*\*/g, '')}</p>
                    }
                    return <p key={i} style={{ margin: '4px 0' }}>{line}</p>
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
