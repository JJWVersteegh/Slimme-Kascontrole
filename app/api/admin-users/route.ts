import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Haal alle klanten op (service role bypassed RLS)
    const { data: klanten, error: klantenError } = await supabase
      .from('klanten')
      .select('*')

    if (klantenError) {
      return NextResponse.json({ error: klantenError.message }, { status: 500 })
    }

    // Haal auth users op voor last_sign_in
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Combineer klanten met auth info
    const result = (klanten ?? []).map(klant => {
      const authUser = authData.users.find(u => u.id === klant.user_id)
      return {
        ...klant,
        last_sign_in_at: authUser?.last_sign_in_at ?? null,
        created_at: authUser?.created_at ?? null,
      }
    })

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
