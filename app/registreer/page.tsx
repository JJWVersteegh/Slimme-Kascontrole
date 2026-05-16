'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function Registreer() {
  const [mode, setMode] = useState<'registreer' | 'login' | 'reset'>('registreer')
  const [email, setEmail] = useState('')
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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [succes, setSucces] = useState('')
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('mode') === 'login') setMode('login')
  }, [])

  async function zoekAdres(
    pc: string,
    hn: string,
    setAdresFn: (waarde: string) => void,
    setPlaatsFn: (waarde: string) => void,
    setLadenFn: (waarde: boolean) => void
  ) {
    if (pc.length < 6 || !hn) return
    setLadenFn(true)
    try {
      const res = await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc.replace(' ','')}+${hn}&fq=type:adres&rows=1`)
      const data = await res.json()
      if (data.response?.docs?.[0]) {
        const doc = data.response.docs[0]
        const straat = doc.straatnaam || ''
        const woonplaats = doc.woonplaatsnaam || ''
        setAdresFn(`${straat} ${hn}`)
        setPlaatsFn(woonplaats)
      }
    } catch {}
    setLadenFn(false)
  }

  async function handleRegistreer(e: React.FormEvent) {
    e.preventDefault()
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
                      <input type="text" value={postcode} onChange={e => { setPostcode(e.target.value); zoekAdres(e.target.value, huisnummer, setAdres, setPlaats, setAdresLaden) }}
                        style={inp} placeholder="Postcode, bijv. 1234 AB" maxLength={7} />
                      <input type="text" value={huisnummer} onChange={e => { setHuisnummer(e.target.value); zoekAdres(postcode, e.target.value, setAdres, setPlaats, setAdresLaden) }}
                        style={inp} placeholder="Nr." />
                    </div>
                    {adresLaden && <p style={{ fontSize: '0.78rem', color: '#2563EB', margin: '0 0 6px' }}>🔍 Persoonlijk adres opzoeken...</p>}
                    {adres && (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '8px 12px', fontSize: '0.83rem', color: '#166534' }}>
                        ✓ {adres}, {postcode.toUpperCase()} {plaats}
                      </div>
                    )}
                    {!adres && postcode.length >= 6 && huisnummer && !adresLaden && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                        <input type="text" value={adres} onChange={e => setAdres(e.target.value)} style={{ ...inp, fontSize: '0.88rem' }} placeholder="Straatnaam + nr" />
                        <input type="text" value={plaats} onChange={e => setPlaats(e.target.value)} style={{ ...inp, fontSize: '0.88rem' }} placeholder="Plaats" />
                      </div>
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
                      <input type="text" value={vvePostcode} onChange={e => { setVvePostcode(e.target.value); zoekAdres(e.target.value, vveHuisnummer, setVveAdres, setVvePlaats, setVveAdresLaden) }}
                        style={inp} placeholder="Postcode vereniging" maxLength={7} required />
                      <input type="text" value={vveHuisnummer} onChange={e => { setVveHuisnummer(e.target.value); zoekAdres(vvePostcode, e.target.value, setVveAdres, setVvePlaats, setVveAdresLaden) }}
                        style={inp} placeholder="Nr." required />
                    </div>
                    {vveAdresLaden && <p style={{ fontSize: '0.78rem', color: '#2563EB', margin: '0 0 6px' }}>🔍 Adres opzoeken...</p>}
                    {vveAdres && (
                      <div style={{ background: 'white', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '8px 12px', fontSize: '0.83rem', color: '#166534' }}>
                        ✓ {vveAdres}, {vvePostcode.toUpperCase()} {vvePlaats}
                      </div>
                    )}
                    {!vveAdres && vvePostcode.length >= 6 && vveHuisnummer && !vveAdresLaden && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                        <input type="text" value={vveAdres} onChange={e => setVveAdres(e.target.value)} style={{ ...inp, fontSize: '0.88rem' }} placeholder="Straatnaam + nr" />
                        <input type="text" value={vvePlaats} onChange={e => setVvePlaats(e.target.value)} style={{ ...inp, fontSize: '0.88rem' }} placeholder="Plaats" />
                      </div>
                    )}
                  </div>
                </div>
                {error && <p style={{ color: '#d44', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer' }}>
                  {loading ? 'Bezig...' : 'Account aanmaken'}
                </button>
                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.87rem', color: '#475569' }}>
                  Al een account?{' '}
                  <button type="button" onClick={() => { setMode('login'); setError('') }}
                    style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.87rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Outfit, sans-serif' }}>
                    Inloggen →
                  </button>
                </p>
              </form>
            )}

            {/* Login */}
            {mode === 'login' && (
              <form onSubmit={handleLogin}>
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
                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.87rem', color: '#475569' }}>
                  Nog geen account?{' '}
                  <button type="button" onClick={() => { setMode('registreer'); setError('') }}
                    style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.87rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Outfit, sans-serif' }}>
                    Maak er een aan →
                  </button>
                </p>
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
