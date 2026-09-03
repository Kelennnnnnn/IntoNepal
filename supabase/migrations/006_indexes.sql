-- Migration 006: Performance and Query Indexes
-- Description: Creates optimized indexes for query filters, sorting, foreign key lookups, and concurrency.

-- 1. listings indexes
-- Primary search composite index: status, category, location, duration_days, price
CREATE INDEX IF NOT EXISTS idx_listings_search
  ON public.listings (status, category, location, duration_days, price);

CREATE INDEX IF NOT EXISTS idx_listings_agency_id
  ON public.listings (agency_id);

CREATE INDEX IF NOT EXISTS idx_listings_featured_rating
  ON public.listings (featured, rating DESC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_listings_created_at
  ON public.listings (created_at DESC);

-- 2. bookings indexes
CREATE INDEX IF NOT EXISTS idx_bookings_traveler_id
  ON public.bookings (traveler_id);

CREATE INDEX IF NOT EXISTS idx_bookings_agency_id
  ON public.bookings (agency_id);

CREATE INDEX IF NOT EXISTS idx_bookings_payment_intent_id
  ON public.bookings (payment_intent_id);

CREATE INDEX IF NOT EXISTS idx_bookings_listing_date
  ON public.bookings (listing_id, trip_date);

CREATE INDEX IF NOT EXISTS idx_bookings_status
  ON public.bookings (status, payment_status);

-- 3. availability indexes
CREATE INDEX IF NOT EXISTS idx_availability_listing_date
  ON public.availability (listing_id, date);

CREATE INDEX IF NOT EXISTS idx_availability_open_spots
  ON public.availability (listing_id, date, spots_remaining)
  WHERE blocked = FALSE;

-- 4. reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id
  ON public.reviews (listing_id);

CREATE INDEX IF NOT EXISTS idx_reviews_agency_id
  ON public.reviews (agency_id);

CREATE INDEX IF NOT EXISTS idx_reviews_visible
  ON public.reviews (listing_id, rating DESC)
  WHERE hidden = FALSE;

-- 5. payouts indexes
CREATE INDEX IF NOT EXISTS idx_payouts_agency_user_id
  ON public.payouts (agency_user_id);

CREATE INDEX IF NOT EXISTS idx_payouts_status
  ON public.payouts (status);

-- 6. agency_applications indexes
CREATE INDEX IF NOT EXISTS idx_agency_applications_user_id
  ON public.agency_applications (user_id);

CREATE INDEX IF NOT EXISTS idx_agency_applications_status
  ON public.agency_applications (status);

-- 7. conversations and messages indexes
CREATE INDEX IF NOT EXISTS idx_conversations_traveler_agency
  ON public.conversations (traveler_id, agency_id);

CREATE INDEX IF NOT EXISTS idx_conversations_agency_last_msg
  ON public.conversations (agency_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_traveler_last_msg
  ON public.conversations (traveler_id, last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created
  ON public.messages (conversation_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_messages_unread
  ON public.messages (conversation_id, read_at)
  WHERE read_at IS NULL;

-- 8. wishlists and audit log indexes
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id
  ON public.wishlists (user_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_entity
  ON public.audit_log (entity_type, entity_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_actor
  ON public.audit_log (actor_user_id);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at
  ON public.audit_log (created_at DESC);
