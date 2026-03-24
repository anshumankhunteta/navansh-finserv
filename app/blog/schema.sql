-- posts table
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text,
  content jsonb NOT NULL DEFAULT '{}',
  cover_image_url text,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Turn on RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public can only view published posts
CREATE POLICY "Public can view published posts" ON posts
  FOR SELECT
  USING (published = true);

-- Authenticated (Admin) full access
CREATE POLICY "Authenticated full access" ON posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
