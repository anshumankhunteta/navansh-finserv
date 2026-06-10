-- ============================================
-- Newsletter Feature Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Subscribers table
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'hero'
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
-- No public policies — all access via service role from Server Actions

-- Newsletter issues (draft → approved → sent lifecycle)
CREATE TABLE newsletter_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  content_json JSONB NOT NULL,
  content_html TEXT,
  admin_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ,
  recipient_count INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'approved', 'sent', 'failed', 'rejected'))
);

ALTER TABLE newsletter_issues ENABLE ROW LEVEL SECURITY;
-- No public policies — all access via service role from Server Actions
