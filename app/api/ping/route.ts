import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  // Simpele query om Supabase actief te houden
  await supabase.from('klanten').select('id').limit(1)
  return NextResponse.json({ ok: true, time: new Date().toISOString() })
}
