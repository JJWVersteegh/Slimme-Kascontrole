-- Run this in your Supabase SQL Editor

-- Klanten tabel
CREATE TABLE klanten (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  email TEXT NOT NULL,
  plan TEXT DEFAULT 'vereniging',
  upload_token TEXT UNIQUE,
  token_expiry TIMESTAMPTZ,
  stripe_session_id TEXT,
  aangemaakt_op TIMESTAMPTZ DEFAULT NOW()
);

-- Uploads tabel
CREATE TABLE uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  boekjaar TEXT NOT NULL,
  toelichting TEXT,
  bestanden TEXT[],
  status TEXT DEFAULT 'ontvangen',
  upload_datum TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE klanten ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own klant" ON klanten FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own uploads" ON uploads FOR SELECT USING (auth.uid() = user_id);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('kascontrole-bestanden', 'kascontrole-bestanden', false);
