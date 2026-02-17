CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT,
  contact_method TEXT[] NOT NULL,
  country TEXT, -- Two-letter ISO country code (e.g., 'IN', 'US')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on created_at for faster querying
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert (for public form submissions)
CREATE POLICY "allow_public_inserts" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Rate limiting table for IP-based spam prevention
CREATE TABLE IF NOT EXISTS rate_limit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_ip TEXT NOT NULL,
  country TEXT, -- Track country for analytics
  fingerprint TEXT, -- Hash of name or other identifying data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups by IP and timestamp
CREATE INDEX IF NOT EXISTS idx_rate_limit_ip_time ON rate_limit_log(client_ip, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert (for rate limiting checks)
CREATE POLICY "allow_public_rate_limit_inserts" ON rate_limit_log
  FOR INSERT
  WITH CHECK (true);

