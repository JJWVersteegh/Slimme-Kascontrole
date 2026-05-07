import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = 'info@slimmekascontrole.nl'

export async function POST(req: NextRequest) {
  try {
    const { createClient } = await import('@supabase/supabase-js')

    const anonSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } }
    )
    const { data: { user } } = await anonSupabase.auth.getUser()
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 403 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { user_id } = await req.json()
    if (!user_id) return NextResponse.json({ error: 'user_id vereist' }, { status: 400 })

    // Verwijder bestanden uit storage
    const { data: uploads } = await supabase.from('uploads').select('bestanden').eq('user_id', user_id)
    if (uploads) {
      const allFiles = uploads.flatMap(u => u.bestanden || [])
      if (allFiles.length > 0) {
        await supabase.storage.from('kascontrole-bestanden').remove(allFiles)
      }
    }

    // Verwijder alle data in juiste volgorde
    await supabase.from('rapporten').delete().eq('user_id', user_id)
    await supabase.from('uploads').delete().eq('user_id', user_id)
    await supabase.from('verenigingen').delete().eq('user_id', user_id)
    await supabase.from('klanten').delete().eq('user_id', user_id)

    const { error } = await supabase.auth.admin.deleteUser(user_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
