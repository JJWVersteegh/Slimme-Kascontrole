-- Run in Supabase SQL Editor
ALTER TABLE klanten ADD COLUMN IF NOT EXISTS rapport_beschikbaar BOOLEAN DEFAULT FALSE;
ALTER TABLE klanten ADD COLUMN IF NOT EXISTS rapport_tekst TEXT;
ALTER TABLE klanten ADD COLUMN IF NOT EXISTS rapport_gegenereerd_op TIMESTAMPTZ;

-- Update RLS policies
CREATE POLICY IF NOT EXISTS "Users can update own klant" ON klanten FOR UPDATE USING (auth.uid() = user_id);
