CREATE TABLE IF NOT EXISTS credentials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  project text,
  type text,
  fields jsonb DEFAULT '[]'::jsonb,
  notes text,
  expires_at timestamptz,
  created_by text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated access" ON credentials FOR ALL USING (true) WITH CHECK (true);
