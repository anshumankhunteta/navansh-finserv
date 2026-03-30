-- ============================================================
-- Mutual Fund Screener — Schema Migration
-- Tables: mf_schemes, mf_nav
-- ============================================================

-- Scheme master data
CREATE TABLE mf_schemes (
  scheme_code    integer PRIMARY KEY,
  scheme_name    text NOT NULL,
  fund_house     text,
  scheme_type    text,
  scheme_category text,
  isin_growth    text,
  return_1y      numeric,
  return_3y      numeric,
  return_5y      numeric,
  updated_at     timestamptz DEFAULT now()
);

-- Daily NAV history (seeded with latest only for now)
CREATE TABLE mf_nav (
  scheme_code integer NOT NULL REFERENCES mf_schemes(scheme_code) ON DELETE CASCADE,
  nav_date    date    NOT NULL,
  nav         numeric NOT NULL,
  PRIMARY KEY (scheme_code, nav_date)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_mf_schemes_category  ON mf_schemes (scheme_category);
CREATE INDEX idx_mf_schemes_fund_house ON mf_schemes (fund_house);
CREATE INDEX idx_mf_nav_scheme_date   ON mf_nav (scheme_code, nav_date DESC);

-- ============================================================
-- Row Level Security — public read, no auth required
-- ============================================================
ALTER TABLE mf_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE mf_nav     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view all schemes"
  ON mf_schemes FOR SELECT
  USING (true);

CREATE POLICY "Public can view all NAVs"
  ON mf_nav FOR SELECT
  USING (true);
