import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

export const ADMIN_EMAIL = 'info@slimmekascontrole.nl'

export async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get('Authorization') || ''

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user || user.email !== ADMIN_EMAIL) {
    return { ok: false as const, user: null }
  }

  return { ok: true as const, user }
}
