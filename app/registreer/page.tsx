'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function Registreer() {
  const [mode, setMode] = useState<'registreer' | 'login' | 'reset'>('registreer')
  const [email, setEmail] = useState('')
  const [email2, setEmail2] = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [wachtwoord2, setWachtwoord2] = useState('')
  const [naam, setNaam] = useState('')
  const [vereniging, setVereniging] = useState('')
  const [kvk, setKvk] = useState('')
  const [postcode, setPostcode] = useState('')
  const [huisnummer, setHuisnummer] = useState('')
  const [adres, setAdres] = useState('')
  const [plaats, setPlaats] = useState('')
  const [vvePostcode, setVvePostcode] = useState('')
  const [vveHuisnummer, setVveHuisnummer] = useState('')
  const [vveAdres, setVveAdres] = useState('')
  const [vvePlaats, setVvePlaats] = useState('')
  const [telefoon, setTelefoon] = useState('')
  const [adresLaden, setAdresLaden] = useState(false)
  const [vveAdresLaden, setVveAdresLaden] = useState(false)
  const [adresNietGevonden, setAdresNietGevonden] = useState(false)
  const [vveAdresNietGevonden, setVveAdresNietGevonden] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [succes, setSucces] = useState('')
  const [herkomst, setHerkomst] = useState('')
  const [herkomstAnders, setHerkomstAnders] = useState('')
  const [beheerderSlug, setBeheerderSlug] = useState('')
  const [beheerders, setBeheerders] = useState<{ id: string; naam: string; slug: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('mode') === 'login') setMode('login')
    const ref = params.get('ref') || localStorage.getItem('skc_ref')
    if (ref) {
      setHerkomst('beheerder')
      setBeheerderSlug(ref)
    }
  }, [])

  useEffect(() => {
    supabase.from('beheerders').select('id, naam, slug').eq('actief', true).order('naam').then(({ data }) => {
      if (data) setBeheerders(data)
    })
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/mijn-omgeving')
    })
  }, [])

  async function zoekAdresPersoonlijk(pc: string, hn: string) {
    if (pc.replace(' ', '').length < 6 || !hn) return
    setAdresLaden(true)
    setAdres(''); setPlaats(''); setAdresNietGevonden(false)
    try {
      const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ', '')}+${hn}&fq=type:adres&rows=1`)
      const data = await res.json()
      if (data.response?.docs?.[0]) {
        const doc = data.response.docs[0]
        setAdres(`${doc.straatnaam || ''} ${hn}`)
        setPlaats(doc.woonplaatsnaam || '')
      } else {
        setAdresNietGevonden(true)
      }
    } catch {
      setAdresNietGevonden(true)
    }
    setAdresLaden(false)
  }

  async function zoekAdresVve(pc: string, hn: string) {
    if (pc.replace(' ', '').length < 6 || !hn) return
    setVveAdresLaden(true)
    setVveAdres(''); setVvePlaats(''); setVveAdresNietGevonden(false)
    try {
      const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ', '')}+${hn}&fq=type:adres&rows=1`)
      const data = await res.json()
      if (data.response?.docs?.[0]) {
        const doc = data.response.docs[0]
        setVveAdres(`${doc.straatnaam || ''} ${hn}`)
        setVvePlaats(doc.woonplaatsnaam || '')
      } else {
        setVveAdresNietGevonden(true)
      }
    } catch {
      setVveAdresNietGevonden(true)
    }
    setVveAdresLaden(false)
  }

  async function handleRegistreer(e: React.FormEvent) {
    e.preventDefault()
    if (email !== email2) { setError('E-mailadressen komen niet overeen'); return }
    if (wachtwoord !== wachtwoord2) { setError('Wachtwoorden komen niet overeen'); return }
    if (wachtwoord.length < 6) { setError('Wachtwoord moet minimaal 6 tekens zijn'); return }
    setLoading(true); setError('')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email, password: wachtwoord, options: { data: { naam } }
    })
    if (authError) {
      setError(authError.message === 'User already registered' ? 'Dit e-mailadres is al geregistreerd. Log in.' : 'Er ging iets mis.')
      setLoading(false); return
    }
    // Sla gegevens op in klanten tabel
    if (authData.user) {
      const beheerder = beheerders.find(b => b.slug === beheerderSlug)
      const beheerderVrijTekst = herkomst === 'beheerder' && (!beheerder || beheerderSlug === '_anders') && herkomstAnders ? herkomstAnders : herkomst === 'beheerder' && !beheerder && beheerderSlug && beheerderSlug !== '_anders' ? beheerderSlug : null
      await supabase.from('klanten').upsert({
        user_id: authData.user.id,
        email,
        naam,
        vereniging,
        kvk,
        adres,
        postcode: postcode.toUpperCase().replace(' ', ''),
        plaats,
        telefoon,
        herkomst: herkomst === 'anders' && herkomstAnders ? `anders: ${herkomstAnders}` : herkomst || null,
        beheerder_id: beheerder?.id || null,
        beheerder_naam: beheerder?.naam || beheerderVrijTekst || null,
      })

      // Sla ook op in verenigingen tabel
      if (vereniging) {
        await supabase.from('verenigingen').insert({
          user_id: authData.user.id,
          naam: vereniging,
          kvk: kvk || null,
          adres: vveAdres || null,
          postcode: vvePostcode.toUpperCase().replace(' ', '') || null,
          plaats: vvePlaats || null,
        })
      }
    }
    localStorage.removeItem('skc_ref')
    router.push('/mijn-omgeving')
    setLoading(false)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord })
    if (error) {
      setError('Ongeldig e-mailadres of wachtwoord')
    } else {
      router.push('/mijn-omgeving')
    }
    setLoading(false)
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(''); setSucces('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-wachtwoord`,
    })
    if (error) {
      setError('Er ging iets mis. Controleer uw e-mailadres.')
    } else {
      setSucces('E-mail verstuurd! Controleer uw inbox voor de resetlink.')
    }
    setLoading(false)
  }

  const inp = {
    width: '100%', padding: '13px 14px', borderRadius: '8px',
    border: '1.5px solid #c8e0d4', fontSize: '1rem', outline: 'none',
    fontFamily: 'Outfit, sans-serif', background: 'white'
  }
  const lbl = {
    display: 'block' as const, fontWeight: '600' as const,
    color: '#1e3a8a', marginBottom: '6px', fontSize: '0.9rem'
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>

      <Navbar />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', paddingTop: '96px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(13,61,46,0.08)' }}>

            {/* Registreer */}
            {mode === 'registreer' && (
              <form onSubmit={handleRegistreer}>
                {/* Intro */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2563EB', margin: '0 0 8px' }}>Slimme Kascontrole</p>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1e3a8a', margin: '0 0 8px' }}>Account aanmaken</h1>
                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>Vul uw persoonlijke gegevens in en de gegevens van uw vereniging.</p>
                </div>
                {/* Privacy blokje */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '24px', padding: '14px 16px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  {[
                    { icon: '🔒', tekst: 'Bestanden versleuteld opgeslagen in Europese datacenters' },
                    { icon: '🇳🇱', tekst: 'AVG-conform — uw data wordt nooit gedeeld met derden' },
                    { icon: '📄', tekst: 'Alleen gebruikt voor uw kascontrolerapport' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: '#475569' }}>
                      <span style={{ flexShrink: 0 }}>{item.icon}</span>
                      <span>{item.tekst}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '24px', padding: '18px', border: '1px solid #bfdbfe', borderRadius: '14px', background: '#eff6ff' }}>
                  <h3 style={{ margin: '0 0 6px', color: '#1e3a8a', fontSize: '1.05rem', fontWeight: 800 }}>
                    1. Gegevens kascommissielid / contactpersoon
                  </h3>
                  <p style={{ margin: '0 0 18px', color: '#475569', fontSize: '0.88rem', lineHeight: 1.45 }}>
                    Vul hier uw persoonlijke contactgegevens in. Dit hoeft niet hetzelfde adres te zijn als het adres van de vereniging.
                  </p>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>Uw naam <span style={{ fontWeight: '400', fontSize: '0.8rem', color: '#94a3b8' }}>(kascommissielid)</span></label>
                    <input type="text" value={naam} onChange={e => setNaam(e.target.value)} style={inp} placeholder="Voor- en achternaam" required />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>Uw persoonlijke adres</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <input type="text" value={postcode}
                        onChange={e => { setPostcode(e.target.value); setAdres(''); setAdresNietGevonden(false) }}
                        onBlur={e => zoekAdresPersoonlijk(e.target.value, huisnummer)}
                        style={inp} placeholder="Postcode, bijv. 1234 AB" maxLength={7} />
                      <input type="text" value={huisnummer}
                        onChange={e => { setHuisnummer(e.target.value); setAdres(''); setAdresNietGevonden(false) }}
                        onBlur={e => zoekAdresPersoonlijk(postcode, e.target.value)}
                        style={inp} placeholder="Nr." />
                    </div>
                    {adresLaden && <p style={{ fontSize: '0.78rem', color: '#2563EB', margin: '0 0 6px' }}>Adres opzoeken...</p>}
                    {adres && (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '8px 12px', fontSize: '0.83rem', color: '#166534' }}>
                        ✓ {adres}, {postcode.toUpperCase()} {plaats}
                      </div>
                    )}
                    {adresNietGevonden && !adresLaden && (
                      <>
                        <p style={{ fontSize: '0.78rem', color: '#ef4444', margin: '4px 0 6px' }}>Adres niet gevonden. Vul handmatig in:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <input type="text" value={adres} onChange={e => setAdres(e.target.value)} style={{ ...inp, fontSize: '0.88rem' }} placeholder="Straatnaam + nr" />
                          <input type="text" value={plaats} onChange={e => setPlaats(e.target.value)} style={{ ...inp, fontSize: '0.88rem' }} placeholder="Plaats" />
                        </div>
                      </>
                    )}
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>Telefoonnummer <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
                    <input type="tel" value={telefoon} onChange={e => setTelefoon(e.target.value)} style={inp} placeholder="bijv. 06-12345678" />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>E-mailadres</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} placeholder="uw@emailadres.nl" required />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>E-mailadres bevestigen</label>
                    <input type="email" value={email2} onChange={e => setEmail2(e.target.value)} style={email2 && email2 !== email ? { ...inp, borderColor: '#ef4444' } : email2 && email2 === email ? { ...inp, borderColor: '#22c55e' } : inp} placeholder="Herhaal uw e-mailadres" required />
                    {email2 && email2 !== email && <p style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px' }}>E-mailadressen komen niet overeen</p>}
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>Wachtwoord</label>
                    <input type="password" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} style={inp} placeholder="Minimaal 6 tekens" required />
                  </div>

                  <div>
                    <label style={lbl}>Wachtwoord bevestigen</label>
                    <input type="password" value={wachtwoord2} onChange={e => setWachtwoord2(e.target.value)} style={inp} placeholder="Herhaal wachtwoord" required />
                  </div>
                </div>

                <div style={{ marginBottom: '24px', padding: '18px', border: '1px solid #bbf7d0', borderRadius: '14px', background: '#f0fdf4' }}>
                  <h3 style={{ margin: '0 0 6px', color: '#166534', fontSize: '1.05rem', fontWeight: 800 }}>
                    2. Gegevens uw vereniging
                  </h3>
                  <p style={{ margin: '0 0 18px', color: '#475569', fontSize: '0.88rem', lineHeight: 1.45 }}>
                    Vul hier de gegevens en het adres van uw vereniging in. Later kunt u in Mijn omgeving extra verenigingen toevoegen.
                  </p>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>Naam vereniging</label>
                    <input type="text" value={vereniging} onChange={e => setVereniging(e.target.value)} style={inp} placeholder="bijv. VvE De Goudstraat of Sportclub De Eendracht" required />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>KvK-nummer vereniging <span style={{ fontWeight: '400', color: '#94a3b8' }}>(optioneel)</span></label>
                    <input type="text" value={kvk} onChange={e => setKvk(e.target.value)} style={inp} placeholder="bijv. 12345678" />
                  </div>

                  <div>
                    <label style={lbl}>Adres vereniging</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', marginBottom: '8px' }}>
                      <input type="text" value={vvePostcode}
                        onChange={e => { setVvePostcode(e.target.value); setVveAdres(''); setVveAdresNietGevonden(false) }}
                        onBlur={e => zoekAdresVve(e.target.value, vveHuisnummer)}
                        style={inp} placeholder="Postcode vereniging" maxLength={7} />
                      <input type="text" value={vveHuisnummer}
                        onChange={e => { setVveHuisnummer(e.target.value); setVveAdres(''); setVveAdresNietGevonden(false) }}
                        onBlur={e => zoekAdresVve(vvePostcode, e.target.value)}
                        style={inp} placeholder="Nr." />
                    </div>
                    {vveAdresLaden && <p style={{ fontSize: '0.78rem', color: '#2563EB', margin: '0 0 6px' }}>Adres opzoeken...</p>}
                    {vveAdres && (
                      <div style={{ background: 'white', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '8px 12px', fontSize: '0.83rem', color: '#166534' }}>
                        ✓ {vveAdres}, {vvePostcode.toUpperCase()} {vvePlaats}
                      </div>
                    )}
                    {vveAdresNietGevonden && !vveAdresLaden && (
                      <>
                        <p style={{ fontSize: '0.78rem', color: '#ef4444', margin: '4px 0 6px' }}>Adres niet gevonden. Vul handmatig in:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <input type="text" value={vveAdres} onChange={e => setVveAdres(e.target.value)} style={{ ...inp, fontSize: '0.88rem' }} placeholder="Straatnaam + nr" />
                          <input type="text" value={vvePlaats} onChange={e => setVvePlaats(e.target.value)} style={{ ...inp, fontSize: '0.88rem' }} placeholder="Plaats" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* Herkomst */}
                <div style={{ marginBottom: '24px', padding: '18px', border: '1px solid #e2e8f0', borderRadius: '14px', background: '#f8fafc' }}>
                  <h3 style={{ margin: '0 0 14px', color: '#0f172a', fontSize: '0.95rem', fontWeight: 700 }}>3. Hoe heeft u ons gevonden? <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '0.82rem' }}>(optioneel)</span></h3>
                  <select value={herkomst} onChange={e => { setHerkomst(e.target.value); if (e.target.value !== 'beheerder') setBeheerderSlug(''); if (e.target.value !== 'anders') setHerkomstAnders('') }} style={{ ...inp, marginBottom: (herkomst === 'beheerder' || herkomst === 'anders') ? '12px' : '0' }}>
                    <option value="">Selecteer een optie...</option>
                    <option value="google">Google / zoekmachine</option>
                    <option value="social">Via social media</option>
                    <option value="beheerder">Via een relatie</option>
                    <option value="anders">Anders</option>
                  </select>
                  {herkomst === 'beheerder' && (
                    beheerders.length > 0 ? (
                      <>
                        <select value={beheerderSlug} onChange={e => setBeheerderSlug(e.target.value)} style={{ ...inp, marginBottom: beheerderSlug === '_anders' ? '12px' : '0' }}>
                          <option value="">Selecteer uw relatie...</option>
                          {beheerders.map(b => (
                            <option key={b.id} value={b.slug}>{b.naam}</option>
                          ))}
                          <option value="_anders">Anders, namelijk...</option>
                        </select>
                        {beheerderSlug === '_anders' && (
                          <input value={herkomstAnders} onChange={e => setHerkomstAnders(e.target.value)} placeholder="Via wie heeft u ons gevonden?" style={inp} />
                        )}
                      </>
                    ) : (
                      <input value={beheerderSlug} onChange={e => setBeheerderSlug(e.target.value)} placeholder="Via wie heeft u ons gevonden?" style={inp} />
                    )
                  )}
                  {herkomst === 'anders' && (
                    <input value={herkomstAnders} onChange={e => setHerkomstAnders(e.target.value)} placeholder="Namelijk..." style={inp} />
                  )}
                </div>

                {error && <p style={{ color: '#d44', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                  {loading ? 'Bezig...' : 'Account aanmaken'}
                </button>
                <button type="button" onClick={() => { setMode('login'); setError('') }}
                  style={{ width: '100%', marginTop: '12px', padding: '13px', background: 'white', border: '2px solid #bfdbfe', color: '#1e3a8a', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                  Inloggen →
                </button>
              </form>
            )}

            {/* Login */}
            {mode === 'login' && (
              <form onSubmit={handleLogin}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#2563EB', margin: '0 0 8px' }}>Slimme Kascontrole</p>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1e3a8a', margin: 0 }}>Inloggen</h1>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>E-mailadres</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} placeholder="uw@emailadres.nl" required />
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <label style={lbl}>Wachtwoord</label>
                  <input type="password" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} style={inp} placeholder="Uw wachtwoord" required />
                </div>
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                  <button type="button" onClick={() => { setMode('reset'); setError('') }}
                    style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
                    Wachtwoord vergeten?
                  </button>
                </div>
                {error && <p style={{ color: '#d44', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                  {loading ? 'Bezig...' : 'Inloggen'}
                </button>
                <button type="button" onClick={() => { setMode('registreer'); setError('') }}
                  style={{ width: '100%', marginTop: '12px', padding: '13px', background: 'white', border: '2px solid #bfdbfe', color: '#1e3a8a', borderRadius: '8px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                  Nog geen account? Registreer →
                </button>
              </form>
            )}

            {/* Reset */}
            {mode === 'reset' && (
              <form onSubmit={handleReset}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={lbl}>E-mailadres</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inp} placeholder="uw@emailadres.nl" required />
                </div>
                {error && <p style={{ color: '#d44', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
                {succes && <p style={{ color: '#2563EB', fontSize: '0.85rem', marginBottom: '12px' }}>{succes}</p>}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                  {loading ? 'Bezig...' : '✉️ Stuur resetlink'}
                </button>
                <button type="button" onClick={() => { setMode('login'); setError(''); setSucces('') }}
                  style={{ width: '100%', marginTop: '12px', padding: '12px', background: 'none', border: '1.5px solid #c8e0d4', color: '#1e3a8a', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
                  ← Terug naar inloggen
                </button>
              </form>
            )}
          </div>
      </div>
      </div>
    </main>
  )
}
