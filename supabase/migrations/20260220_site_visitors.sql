CREATE TABLE IF NOT EXISTS site_visitors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ip text,
  city text,
  region text,
  country text,
  latitude double precision,
  longitude double precision,
  page text,
  user_agent text,
  referrer text,
  visited_at timestamptz DEFAULT now()
);

-- Index for real-time queries
CREATE INDEX idx_site_visitors_visited_at ON site_visitors(visited_at DESC);

-- Auto-delete after 30 days
CREATE OR REPLACE FUNCTION cleanup_old_visitors() RETURNS void AS $$
BEGIN
  DELETE FROM site_visitors WHERE visited_at < now() - interval '30 days';
END;
$$ LANGUAGE plpgsql;

-- RLS - allow anon insert, authenticated read
ALTER TABLE site_visitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts" ON site_visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated reads" ON site_visitors FOR SELECT USING (true);
