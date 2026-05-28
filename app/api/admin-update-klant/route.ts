import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_EMAIL } from '../_adminAuth'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest) {
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

    const { user_id, data } = await req.json()

    if (!user_id) {
      return NextResponse.json({ error: 'user_id vereist' }, { status: 400 })
    }

    const cleanData = {
      naam: data?.naam || '',
      telefoon: data?.telefoon || '',
      adres: data?.adres || '',
      postcode: data?.postcode || '',
      plaats: data?.plaats || '',
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: updatedRows, error } = await supabase
      .from('klanten')
      .update(cleanData)
      .eq('user_id', user_id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!updatedRows || updatedRows.length === 0) {
      return NextResponse.json({ error: 'Geen klant gevonden voor deze user_id' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      klant: updatedRows[0],
      updated_count: updatedRows.length
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
