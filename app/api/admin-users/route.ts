import { requireAdmin } from '../_adminAuth'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin.ok) return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 403 })

  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Haal alles op via service role (bypassed RLS)
    const [
      { data: klanten, error: klantenError },
      { data: rapporten, error: rapportenError },
      { data: uploads, error: uploadsError },
      { data: authData, error: authError },
    ] = await Promise.all([
      supabase.from('klanten').select('*'),
      supabase.from('rapporten').select('*'),
      supabase.from('uploads').select('*'),
      supabase.auth.admin.listUsers(),
    ])

    if (klantenError) return NextResponse.json({ error: klantenError.message }, { status: 500 })
    if (rapportenError) return NextResponse.json({ error: rapportenError.message }, { status: 500 })
    if (uploadsError) return NextResponse.json({ error: uploadsError.message }, { status: 500 })
    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })

    const result = (klanten ?? []).map(klant => {
      const authUser = authData.users.find(u => u.id === klant.user_id)
      return {
        ...klant,
        last_sign_in_at: authUser?.last_sign_in_at ?? null,
        created_at: authUser?.created_at ?? null,
        rapporten: (rapporten ?? []).filter(r => r.user_id === klant.user_id),
        uploads: (uploads ?? []).filter(u => u.user_id === klant.user_id),
      }
    })

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}