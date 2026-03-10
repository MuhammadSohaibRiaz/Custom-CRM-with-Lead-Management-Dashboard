-- ============================================================
-- LeadFlow CRM – Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Custom types
CREATE TYPE user_role AS ENUM ('admin', 'agent');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'closed_won', 'closed_lost');

-- 2. Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'agent',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  source TEXT,
  value NUMERIC(12,2) DEFAULT 0,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Lead notes
CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Activity log
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Indexes
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX idx_activity_log_lead_id ON activity_log(lead_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);

-- 7. Auto-update updated_at on leads
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 8. Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    'agent'::public.user_role
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'handle_new_user failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Helper: check if caller is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Leads policies
CREATE POLICY "Agents see assigned leads"
  ON leads FOR SELECT
  USING (assigned_to = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Admins see all leads"
  ON leads FOR SELECT
  USING (is_admin());

CREATE POLICY "Authenticated users can create leads"
  ON leads FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Agents update own leads"
  ON leads FOR UPDATE
  USING (assigned_to = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Admins update all leads"
  ON leads FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins delete leads"
  ON leads FOR DELETE
  USING (is_admin());

-- Lead notes policies
CREATE POLICY "View notes for accessible leads"
  ON lead_notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_notes.lead_id
        AND (leads.assigned_to = auth.uid() OR leads.created_by = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Add notes to accessible leads"
  ON lead_notes FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_notes.lead_id
        AND (leads.assigned_to = auth.uid() OR leads.created_by = auth.uid() OR is_admin())
    )
  );

-- Activity log policies
CREATE POLICY "View activity for accessible leads"
  ON activity_log FOR SELECT
  USING (
    lead_id IS NULL
    OR EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = activity_log.lead_id
        AND (leads.assigned_to = auth.uid() OR leads.created_by = auth.uid() OR is_admin())
    )
  );

CREATE POLICY "Authenticated users create activity"
  ON activity_log FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
