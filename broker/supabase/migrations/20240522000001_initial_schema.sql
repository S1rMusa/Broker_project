-- Broker Platform - Initial Schema
-- Kenya lender-borrower matching platform (no fund custody)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom types
CREATE TYPE user_role AS ENUM ('borrower', 'lender_admin', 'super_admin');
CREATE TYPE application_status AS ENUM (
  'draft', 'submitted', 'under_review', 'matched', 'sent_to_lender',
  'approved', 'rejected', 'withdrawn'
);
CREATE TYPE employment_type AS ENUM (
  'employed', 'self_employed', 'business_owner', 'contract', 'unemployed'
);
CREATE TYPE crb_status AS ENUM ('clear', 'mild', 'moderate', 'severe', 'unknown');
CREATE TYPE trend_direction AS ENUM ('up', 'down', 'stable');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE commission_status AS ENUM ('pending', 'confirmed', 'paid', 'disputed');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone_number TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'borrower',
  lender_id UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  granted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE TABLE lenders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT,
  description TEXT,
  minimum_interest_rate DECIMAL(5,2) NOT NULL,
  maximum_interest_rate DECIMAL(5,2) NOT NULL,
  minimum_loan_amount DECIMAL(14,2) NOT NULL,
  maximum_loan_amount DECIMAL(14,2) NOT NULL,
  processing_time TEXT,
  acceptance_rate DECIMAL(5,2),
  target_customer TEXT,
  risk_level risk_level DEFAULT 'medium',
  trend_direction trend_direction DEFAULT 'stable',
  trend_percentage DECIMAL(5,2) DEFAULT 0,
  active_offers INTEGER DEFAULT 0,
  contact_email TEXT,
  phone_number TEXT,
  physical_address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ADD CONSTRAINT fk_profiles_lender
  FOREIGN KEY (lender_id) REFERENCES lenders(id) ON DELETE SET NULL;

CREATE TABLE loan_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lender_id UUID NOT NULL REFERENCES lenders(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  interest_rate DECIMAL(5,2) NOT NULL,
  min_amount DECIMAL(14,2) NOT NULL,
  max_amount DECIMAL(14,2) NOT NULL,
  term_months INTEGER,
  product_type TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE borrower_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  borrower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  requested_amount DECIMAL(14,2) NOT NULL,
  loan_purpose TEXT,
  employment_type employment_type,
  monthly_income DECIMAL(14,2),
  monthly_expenses DECIMAL(14,2),
  debt_ratio DECIMAL(5,2),
  crb_status crb_status DEFAULT 'unknown',
  business_stability_months INTEGER,
  affordability_score DECIMAL(5,2),
  approval_probability DECIMAL(5,2),
  status application_status DEFAULT 'draft',
  notes TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE application_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES borrower_applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lender_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES borrower_applications(id) ON DELETE CASCADE,
  lender_id UUID NOT NULL REFERENCES lenders(id) ON DELETE CASCADE,
  compatibility_score DECIMAL(5,2) NOT NULL,
  approval_likelihood DECIMAL(5,2),
  rank_position INTEGER,
  is_recommended BOOLEAN DEFAULT false,
  sent_to_lender_at TIMESTAMPTZ,
  lender_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(application_id, lender_id)
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES borrower_applications(id),
  lender_id UUID NOT NULL REFERENCES lenders(id),
  borrower_id UUID REFERENCES profiles(id),
  amount DECIMAL(14,2) NOT NULL,
  currency TEXT DEFAULT 'KES',
  status commission_status DEFAULT 'pending',
  referral_date TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE market_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lender_id UUID REFERENCES lenders(id) ON DELETE CASCADE,
  product_type TEXT,
  rate DECIMAL(5,2) NOT NULL,
  previous_rate DECIMAL(5,2),
  trend_direction trend_direction,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE lender_internal_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES borrower_applications(id) ON DELETE CASCADE,
  lender_admin_id UUID NOT NULL REFERENCES profiles(id),
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE saved_lenders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lender_id UUID NOT NULL REFERENCES lenders(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lender_id)
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_lender ON profiles(lender_id);
CREATE INDEX idx_lenders_slug ON lenders(slug);
CREATE INDEX idx_applications_borrower ON borrower_applications(borrower_id);
CREATE INDEX idx_applications_status ON borrower_applications(status);
CREATE INDEX idx_matches_application ON lender_matches(application_id);
CREATE INDEX idx_matches_lender ON lender_matches(lender_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_market_rates_recorded ON market_rates(recorded_at DESC);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER lenders_updated_at BEFORE UPDATE ON lenders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON borrower_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'borrower')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lenders ENABLE ROW LEVEL SECURITY;
ALTER TABLE loan_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrower_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE lender_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lender_internal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_lenders ENABLE ROW LEVEL SECURITY;

-- Public read lenders
CREATE POLICY "Lenders are viewable by everyone" ON lenders FOR SELECT USING (is_active = true);
CREATE POLICY "Loan products viewable by everyone" ON loan_products FOR SELECT USING (is_active = true);
CREATE POLICY "Market rates viewable by everyone" ON market_rates FOR SELECT USING (true);

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Super admins view all profiles" ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Applications
CREATE POLICY "Borrowers manage own applications" ON borrower_applications FOR ALL
  USING (borrower_id = auth.uid());
CREATE POLICY "Lender admins view assigned applications" ON borrower_applications FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM lender_matches lm
    JOIN profiles p ON p.lender_id = lm.lender_id
    WHERE lm.application_id = borrower_applications.id AND p.id = auth.uid()
  ));
CREATE POLICY "Super admins full access applications" ON borrower_applications FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Notifications
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- Commissions - super admin only
CREATE POLICY "Super admins manage commissions" ON commissions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));

-- Audit logs - super admin
CREATE POLICY "Super admins view audit logs" ON audit_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'));
