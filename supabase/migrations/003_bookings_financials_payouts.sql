-- Migration 003: Bookings, Reviews, Payouts, and Bank Details
-- Description: Creates financial, booking, review, and payout records with strict NUMERIC types.

-- 4. bookings — the money record
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

COMMENT ON TABLE public.bookings IS 'Booking transaction records with strict server-side calculated financial amounts.';

-- 5. reviews — authenticated reviews tied uniquely to completed bookings
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

COMMENT ON TABLE public.reviews IS 'Verified traveler reviews linked strictly 1:1 with confirmed/completed bookings.';

-- 6. payouts — agency disbursement transactions
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  booking_ids UUID[] NOT NULL DEFAULT '{}'::UUID[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'completed', 'failed')
  ),
  stripe_transfer_id TEXT,
  method TEXT NOT NULL DEFAULT 'stripe' CHECK (method IN ('stripe', 'manual')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

COMMENT ON TABLE public.payouts IS 'Disbursements to agencies via Stripe Connect transfer or approved manual bank wire.';

-- 7. agency_bank_details — bank routing credentials with Vault reference
CREATE TABLE IF NOT EXISTS public.agency_bank_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  account_number_secret_id UUID NOT NULL, -- Reference to Supabase Vault secret, never plaintext
  swift_code TEXT NOT NULL,
  last_four TEXT NOT NULL CHECK (char_length(last_four) = 4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_agency_bank_details UNIQUE (agency_user_id)
);

COMMENT ON TABLE public.agency_bank_details IS 'Agency payout bank routing with raw numbers protected in Supabase Vault.';
