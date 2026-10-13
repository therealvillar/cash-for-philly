CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  submission_key TEXT NOT NULL UNIQUE,
  lead_type TEXT NOT NULL CHECK (lead_type IN ('seller','agent','contact')),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  property_location TEXT,
  city TEXT,
  zip TEXT,
  property_type TEXT,
  message TEXT NOT NULL,
  preferred_contact TEXT NOT NULL CHECK (preferred_contact IN ('email','phone')),
  source_path TEXT NOT NULL,
  created_at TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  marketing_consent INTEGER NOT NULL DEFAULT 0 CHECK (marketing_consent IN (0,1)),
  marketing_consent_at TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','closed')),
  CHECK (email IS NOT NULL OR phone IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_type_status ON leads(lead_type, status);
