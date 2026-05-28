import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_EMAIL } from '../_adminAuth'

export const dynamic = 'force-dynamic'

export async function DELETE(req: NextRequest) {
  try {
    const { createClient } = await import('@supabase/supabase-js')

    // Controleer of verzoek van admin komt
    const anonSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } }
    )
    const { data: { user } } = await anonSupabase.auth.getUser()
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 403 })
    }

    const { vereniging_id, rapport_boekjaar, user_id } = await req.json()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Rapport verwijderen
    if (rapport_boekjaar && user_id) {
      await supabase.from('rapporten')
        .update({ rapport_tekst: null, gegenereerd_op: null })
        .eq('user_id', user_id)
        .eq('boekjaar', rapport_boekjaar)
      return NextResponse.json({ success: true })
    }

    // Vereniging verwijderen (inclusief uploads en rapporten)
    if (vereniging_id) {
      // Verwijder uploads uit storage
      const { data: uploads } = await supabase
        .from('uploads')
        .select('bestanden')
        .eq('vereniging_id', vereniging_id)

      if (uploads) {
        const allFiles = uploads.flatMap(u => u.bestanden || [])
        if (allFiles.length > 0) {
          await supabase.storage.from('kascontrole-bestanden').remove(allFiles)
        }
      }

      // Verwijder uploads records
      await supabase.from('uploads').delete().eq('vereniging_id', vereniging_id)
      // Verwijder rapporten records
      await supabase.from('rapporten').delete().eq('vereniging_id', vereniging_id)
      // Verwijder vereniging
      const { error } = await supabase.from('verenigingen').delete().eq('id', vereniging_id)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Geen actie opgegeven' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}