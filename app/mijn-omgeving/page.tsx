'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Upload {
  id: string
  boekjaar: string
  status: string
  upload_datum: string
  toelichting: string
  bestanden: string[]
}

interface Klant {
  plan: string
  email: string
  aangemaakt_op: string
}

export default function MijnOmgeving() {
  const [user, setUser] = useState<any>(null)
  const [klant, setKlant] = useState<Klant | null>(null)
  const [uploads, setUploads] = useState<Upload[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      loadData(session.user.id)
    })
  }, [])

  async function loadData(userId: string) {
    const [{ data: klantData }, { data: uploadsData }] = await Promise.all([
      supabase.from('klanten').select('*').eq('user_id', userId).single(),
      supabase.from('uploads').select('*').eq('user_id', userId).order('boekjaar', { ascending: false }),
    ])
    setKlant(klantData)
    setUploads(uploadsData || [])
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const statusColor: Record<string, string> = {
    ontvangen: '#c9a84c',
    'in behandeling': '#1e7a55',
    gereed: '#0d3d2e',
  }

  const statusLabel: Record<string, string> = {
    ontvangen: '📥 Ontvangen',
    'in behandeling': '⚙️ In behandeling',
    gereed: '✓ Gereed',
  }

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#faf8f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <p style={{ color: '#4a4a45' }}>Laden...</p>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#faf8f3', fontFamily: 'Inter, sans-serif' }}>
      {/* Nav */}
      <nav style={{ background: 'white', borderBottom: '1px solid #e0ede6', padding: '16px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#3a6b1e', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none"><polyline points="3,12 9,18 19,6" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <span style={{ fontWeight: '700', color: '#0d3d2e' }}>Slimme Kascontrole</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '0.85rem', color: '#4a4a45' }}>{user?.email}</span>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #c8e0d4', color: '#0d3d2e', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Uitloggen</button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 24px' }}>
        {/* Welcome */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#0d3d2e', marginBottom: '4px' }}>Mijn omgeving</h1>
          <p style={{ color: '#4a4a45' }}>Plan: <strong style={{ color: '#1e7a55', textTransform: 'capitalize' }}>{klant?.plan || 'Vereniging'}</strong></p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Uploads', value: uploads.length },
            { label: 'Boekjaren', value: new Set(uploads.map(u => u.boekjaar)).size },
            { label: 'Gereed', value: uploads.filter(u => u.status === 'gereed').length },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e0ede6', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0d3d2e', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: '#4a4a45' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Upload history */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e0ede6', overflow: 'hidden', marginBottom: '32px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e0ede6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0d3d2e', margin: 0 }}>Mijn uploads</h2>
          </div>

          {uploads.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📁</div>
              <p style={{ color: '#4a4a45', marginBottom: '16px' }}>Nog geen uploads. Gebruik de link uit uw bevestigingsmail om uw eerste gegevens te uploaden.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8faf9' }}>
                  {['Boekjaar', 'Datum', 'Bestanden', 'Toelichting', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '600', color: '#4a4a45', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload, i) => (
                  <tr key={upload.id} style={{ borderTop: '1px solid #f0f4f2' }}>
                    <td style={{ padding: '16px', fontWeight: '700', color: '#0d3d2e' }}>{upload.boekjaar}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#4a4a45' }}>{new Date(upload.upload_datum).toLocaleDateString('nl-NL')}</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#4a4a45' }}>{upload.bestanden?.length || 0} bestand(en)</td>
                    <td style={{ padding: '16px', fontSize: '0.85rem', color: '#4a4a45', maxWidth: '200px' }}>{upload.toelichting ? upload.toelichting.substring(0, 60) + (upload.toelichting.length > 60 ? '...' : '') : '—'}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ background: statusColor[upload.status] + '20', color: statusColor[upload.status] || '#4a4a45', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '600' }}>
                        {statusLabel[upload.status] || upload.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Trend analyse */}
        {uploads.length >= 2 && (
          <div style={{ background: '#0d3d2e', borderRadius: '16px', padding: '32px', color: 'white' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>📈 Trendoverzicht</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: '20px' }}>Uw gegevens over meerdere jaren</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {uploads.slice(0, 4).map(u => (
                <div key={u.id} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#a8d5bc' }}>{u.boekjaar}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>{statusLabel[u.status] || u.status}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
