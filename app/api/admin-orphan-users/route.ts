import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = 'info@slimmekascontrole.nl'

async function requireAdmin(req: NextRequest) {
  const anonClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } }
  )
  const { data: { user } } = await anonClient.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) return null
  return user
}

// GET: haal alle auth users op die niet in klanten tabel staan
export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 403 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Haal alle auth users op
  const { data: authData, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Haal alle bekende user_ids op uit klanten tabel
  const { data: klanten } = await supabase.from('klanten').select('user_id')
  const bekende = new Set((klanten || []).map(k => k.user_id))

  // Filter op users die niet in klanten staan (en niet de admin zelf)
  const orphans = authData.users
    .filter(u => !bekende.has(u.id) && u.email !== ADMIN_EMAIL)
    .map(u => ({ id: u.id, email: u.email, created_at: u.created_at }))

  return NextResponse.json({ orphans })
}

// DELETE: verwijder een orphan user volledig
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req)
  if (!admin) return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 403 })

  const { user_id } = await req.json()
  if (!user_id) return NextResponse.json({ error: 'user_id vereist' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase.auth.admin.deleteUser(user_id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
