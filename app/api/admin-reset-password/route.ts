import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/app/api/_adminAuth'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { ok } = await requireAdmin(req)
  if (!ok) return NextResponse.json({ error: 'Geen toegang' }, { status: 403 })

  const { user_id, nieuw_wachtwoord } = await req.json()
  if (!user_id || !nieuw_wachtwoord || nieuw_wachtwoord.length < 8) {
    return NextResponse.json({ error: 'user_id en wachtwoord (min. 8 tekens) zijn verplicht' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.auth.admin.updateUserById(user_id, { password: nieuw_wachtwoord })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
