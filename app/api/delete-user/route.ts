import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { user_id } = await req.json()

    if (!user_id) {
      return NextResponse.json({ error: 'user_id vereist' }, { status: 400 })
    }

    // Verwijder alle data
    await supabase.from('rapporten').delete().eq('user_id', user_id)
    await supabase.from('uploads').delete().eq('user_id', user_id)
    await supabase.from('klanten').delete().eq('user_id', user_id)

    // Verwijder de gebruiker
    const { error } = await supabase.auth.admin.deleteUser(user_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
