-- ============================================================================
-- INTO NEPAL COMPLETE DATABASE SETUP
-- Paste and run this script in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================================

-- 1. EXTENSIONS & UTILITIES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.extract_duration_days(duration_str TEXT)
RETURNS INTEGER LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE
  v_match TEXT;
BEGIN
  IF duration_str IS NULL OR trim(duration_str) = '' THEN RETURN 1; END IF;
  v_match := (regexp_matches(duration_str, '([0-9]+)'))[1];
  IF v_match IS NOT NULL THEN RETURN v_match::INTEGER; ELSE RETURN 1; END IF;
EXCEPTION WHEN OTHERS THEN
  RETURN 1;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'role') = 'service_role' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true,
    false
  );
$$;

-- 2. CORE TABLES
CREATE TABLE IF NOT EXISTS public.agency_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  description TEXT,
  years_operating INTEGER DEFAULT 0 CHECK (years_operating >= 0),
  license_doc_url TEXT,
  registration_doc_url TEXT,
  insurance_doc_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'suspended')),
  rejection_reason TEXT,
  stripe_account_id TEXT,
  logo_url TEXT,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_agency_user UNIQUE (user_id)
);

CREATE OR REPLACE FUNCTION public.is_verified_agency(p_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agency_applications
    WHERE user_id = p_user_id AND status = 'verified'
  );
$$;

CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'Trekking', 'Adventure', 'Cultural', 'Wildlife', 'Rafting', 'Mountaineering', 'Wellness', 'Photography'
  )),
  location TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  duration TEXT NOT NULL,
  duration_days INTEGER GENERATED ALWAYS AS (public.extract_duration_days(duration)) STORED,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Moderate', 'Challenging', 'Difficult', 'Expert')),
  max_participants INTEGER NOT NULL CHECK (max_participants > 0),
  images TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  includes TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  excludes TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  itinerary JSONB NOT NULL DEFAULT '[]'::JSONB,
  meeting_point TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'hidden')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  spots_total INTEGER NOT NULL CHECK (spots_total >= 0),
  spots_remaining INTEGER NOT NULL CHECK (spots_remaining >= 0 AND spots_remaining <= spots_total),
  price_override NUMERIC(10,2) CHECK (price_override IS NULL OR price_override > 0),
  blocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_availability_listing_date UNIQUE (listing_id, date)
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  agency_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  availability_id UUID REFERENCES public.availability(id) ON DELETE SET NULL,
  trip_date DATE NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  traveler_name TEXT NOT NULL,
  traveler_email TEXT NOT NULL,
  traveler_phone TEXT,
  price_per_person NUMERIC(10,2) NOT NULL CHECK (price_per_person > 0),
  total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  commission_rate NUMERIC(5,2) NOT NULL CHECK (commission_rate >= 0 AND commission_rate <= 100),
  commission_amount NUMERIC(10,2) NOT NULL CHECK (commission_amount >= 0),
  net_payout NUMERIC(10,2) NOT NULL CHECK (net_payout >= 0),
  status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (
    status IN ('pending_payment', 'confirmed', 'completed', 'cancelled')
  ),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (
    payment_status IN ('unpaid', 'paid', 'refunded')
  ),
  payment_intent_id TEXT,
  refund_amount NUMERIC(10,2) DEFAULT 0.00 CHECK (refund_amount >= 0),
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  photos TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_review_per_booking UNIQUE (booking_id)
);

CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  booking_ids UUID[] NOT NULL DEFAULT '{}'::UUID[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  stripe_transfer_id TEXT,
  method TEXT NOT NULL DEFAULT 'stripe' CHECK (method IN ('stripe', 'manual')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.agency_bank_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  account_number_secret_id UUID NOT NULL,
  swift_code TEXT NOT NULL,
  last_four TEXT NOT NULL CHECK (char_length(last_four) = 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_agency_bank_details UNIQUE (agency_user_id)
);

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (trim(content) <> ''),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_wishlist_user_listing UNIQUE (user_id, listing_id)
);

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  new_booking BOOLEAN NOT NULL DEFAULT TRUE,
  booking_cancelled BOOLEAN NOT NULL DEFAULT TRUE,
  payout_processed BOOLEAN NOT NULL DEFAULT TRUE,
  new_message BOOLEAN NOT NULL DEFAULT TRUE,
  marketing BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

INSERT INTO public.platform_settings (key, value)
VALUES
  ('payments_enabled', 'true'::jsonb),
  ('payouts_enabled', 'true'::jsonb),
  ('maintenance_mode', 'false'::jsonb),
  ('commission_rate', '15'::jsonb)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_at = now();

CREATE TABLE IF NOT EXISTS public.webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_listings_search ON public.listings (status, category, location, duration_days, price);
CREATE INDEX IF NOT EXISTS idx_listings_agency_id ON public.listings (agency_id);
CREATE INDEX IF NOT EXISTS idx_bookings_traveler_id ON public.bookings (traveler_id);
CREATE INDEX IF NOT EXISTS idx_bookings_agency_id ON public.bookings (agency_id);
CREATE INDEX IF NOT EXISTS idx_availability_listing_date ON public.availability (listing_id, date);
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON public.reviews (listing_id);
CREATE INDEX IF NOT EXISTS idx_payouts_agency_user_id ON public.payouts (agency_user_id);

-- 4. CONCURRENCY RPC
CREATE OR REPLACE FUNCTION public.claim_availability_spots(p_availability_id UUID, p_guests INT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_rows_affected INTEGER;
BEGIN
  IF p_guests IS NULL OR p_guests <= 0 THEN
    RAISE EXCEPTION 'Number of guests must be greater than zero';
  END IF;
  UPDATE public.availability
  SET spots_remaining = spots_remaining - p_guests, updated_at = now()
  WHERE id = p_availability_id AND blocked = FALSE AND spots_remaining >= p_guests;
  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  RETURN (v_rows_affected = 1);
END;
$$;

CREATE OR REPLACE FUNCTION public.release_availability_spots(p_availability_id UUID, p_guests INT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF p_guests IS NULL OR p_guests <= 0 THEN RETURN; END IF;
  UPDATE public.availability
  SET spots_remaining = LEAST(spots_total, spots_remaining + p_guests), updated_at = now()
  WHERE id = p_availability_id;
END;
$$;

-- 5. TRIGGERS
CREATE OR REPLACE FUNCTION public.recalculate_listing_rating()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_listing_id UUID;
  v_avg_rating NUMERIC(3,2);
  v_count INTEGER;
BEGIN
  IF (TG_OP = 'DELETE') THEN v_listing_id := OLD.listing_id;
  ELSE v_listing_id := NEW.listing_id; END IF;

  SELECT COALESCE(ROUND(AVG(rating)::NUMERIC, 2), 0.00), COUNT(*)
  INTO v_avg_rating, v_count
  FROM public.reviews WHERE listing_id = v_listing_id AND hidden = FALSE;

  UPDATE public.listings SET rating = v_avg_rating, review_count = v_count, updated_at = now() WHERE id = v_listing_id;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS tr_recalculate_listing_rating ON public.reviews;
CREATE TRIGGER tr_recalculate_listing_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.recalculate_listing_rating();

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.agency_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- 7. ESSENTIAL POLICIES
DROP POLICY IF EXISTS "Public can read platform settings" ON public.platform_settings;
CREATE POLICY "Public can read platform settings" ON public.platform_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view verified agencies" ON public.agency_applications;
CREATE POLICY "Public can view verified agencies" ON public.agency_applications FOR SELECT USING (status = 'verified');

DROP POLICY IF EXISTS "Public can view published listings" ON public.listings;
CREATE POLICY "Public can view published listings" ON public.listings FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Public can view unblocked availability" ON public.availability;
CREATE POLICY "Public can view unblocked availability" ON public.availability FOR SELECT USING (blocked = FALSE);

DROP POLICY IF EXISTS "Public can view non-hidden reviews" ON public.reviews;
CREATE POLICY "Public can view non-hidden reviews" ON public.reviews FOR SELECT USING (hidden = FALSE);

-- 8. GRANT PRIVILEGES TO API ROLES
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 9. FORCE SCHEMA CACHE RELOAD
NOTIFY pgrst, 'reload schema';
