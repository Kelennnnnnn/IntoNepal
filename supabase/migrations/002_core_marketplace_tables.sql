-- Migration 002: Core Marketplace Tables
-- Description: Creates agency_applications, listings, and availability tables.

-- 1. agency_applications — the agency profile and verification record
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

COMMENT ON TABLE public.agency_applications IS 'Registered Nepali travel agencies, licensing credentials, and verification state.';

-- 2. listings — trips and itineraries
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

COMMENT ON TABLE public.listings IS 'Treks and tours offered by verified agencies with generated duration_days for server-side SQL filtering.';

-- 3. availability — per-date capacity
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

COMMENT ON TABLE public.availability IS 'Per-departure date capacity, blocked status, and spots_remaining.';
