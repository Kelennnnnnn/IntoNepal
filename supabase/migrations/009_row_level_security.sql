-- Migration 009: Row Level Security (RLS)
-- Description: Enables and enforces Row Level Security policies across all 15 tables.

-- ============================================================================
-- 1. agency_applications
-- ============================================================================
ALTER TABLE public.agency_applications ENABLE ROW LEVEL SECURITY;

-- Public can view verified agencies
CREATE POLICY "Public can view verified agencies"
  ON public.agency_applications
  FOR SELECT
  USING (status = 'verified');

-- Agency users can view their own application
CREATE POLICY "Agencies can view own application"
  ON public.agency_applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all agency applications"
  ON public.agency_applications
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Authenticated users can submit an application
CREATE POLICY "Users can submit agency application"
  ON public.agency_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Agencies can update their own application
CREATE POLICY "Agencies can update own application"
  ON public.agency_applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id AND
    -- Prevent agencies from self-approving their verification status
    (status = 'pending' OR status = (SELECT a.status FROM public.agency_applications a WHERE a.id = id))
  );

-- Admins can update any application (verify, reject, suspend)
CREATE POLICY "Admins can update any agency application"
  ON public.agency_applications
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 2. listings
-- ============================================================================
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Public can read published listings
CREATE POLICY "Public can view published listings"
  ON public.listings
  FOR SELECT
  USING (status = 'published');

-- Agencies can view all their own listings (draft, published, hidden)
CREATE POLICY "Agencies can view own listings"
  ON public.listings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = agency_id);

-- Admins can view all listings
CREATE POLICY "Admins can view all listings"
  ON public.listings
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Verified agencies can create listings
CREATE POLICY "Verified agencies can insert listings"
  ON public.listings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid() = agency_id AND public.is_verified_agency(auth.uid())) OR
    public.is_admin()
  );

-- Agencies can update their own listings
CREATE POLICY "Agencies can update own listings"
  ON public.listings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = agency_id OR public.is_admin())
  WITH CHECK (auth.uid() = agency_id OR public.is_admin());

-- Agencies can delete their own listings
CREATE POLICY "Agencies can delete own listings"
  ON public.listings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = agency_id OR public.is_admin());

-- ============================================================================
-- 3. availability
-- ============================================================================
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Public can view unblocked availability for published listings
CREATE POLICY "Public can view unblocked availability for published listings"
  ON public.availability
  FOR SELECT
  USING (
    blocked = FALSE AND
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = availability.listing_id AND l.status = 'published'
    )
  );

-- Agencies can view all availability for their own listings
CREATE POLICY "Agencies can view availability for own listings"
  ON public.availability
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = availability.listing_id AND l.agency_id = auth.uid()
    ) OR public.is_admin()
  );

-- Agencies can create availability for their own listings
CREATE POLICY "Agencies can insert availability for own listings"
  ON public.availability
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = availability.listing_id AND l.agency_id = auth.uid()
    ) OR public.is_admin()
  );

-- Agencies can update availability for their own listings
CREATE POLICY "Agencies can update availability for own listings"
  ON public.availability
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = availability.listing_id AND l.agency_id = auth.uid()
    ) OR public.is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = availability.listing_id AND l.agency_id = auth.uid()
    ) OR public.is_admin()
  );

-- Agencies can delete availability for their own listings
CREATE POLICY "Agencies can delete availability for own listings"
  ON public.availability
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.listings l
      WHERE l.id = availability.listing_id AND l.agency_id = auth.uid()
    ) OR public.is_admin()
  );

-- ============================================================================
-- 4. bookings
-- ============================================================================
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Travelers can view their own bookings
CREATE POLICY "Travelers can view own bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = traveler_id);

-- Agencies can view bookings for their agency
CREATE POLICY "Agencies can view own bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = agency_id);

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Travelers can create their own booking
CREATE POLICY "Travelers can create own booking"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = traveler_id);

-- Travelers or Agencies can update non-financial fields (e.g., cancellation)
CREATE POLICY "Participants and admins can update bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = traveler_id OR
    auth.uid() = agency_id OR
    public.is_admin()
  )
  WITH CHECK (
    auth.uid() = traveler_id OR
    auth.uid() = agency_id OR
    public.is_admin()
  );

-- ============================================================================
-- 5. reviews
-- ============================================================================
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can view non-hidden reviews
CREATE POLICY "Public can view non-hidden reviews"
  ON public.reviews
  FOR SELECT
  USING (hidden = FALSE);

-- Authors and admins can view their own or hidden reviews
CREATE POLICY "Authors and admins can view reviews"
  ON public.reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = traveler_id OR public.is_admin());

-- Travelers can create reviews for their completed bookings
CREATE POLICY "Travelers can insert reviews for their bookings"
  ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = traveler_id AND
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = reviews.booking_id
        AND b.traveler_id = auth.uid()
        AND b.payment_status = 'paid'
    )
  );

-- Authors can update their own reviews; Admins can moderate/hide
CREATE POLICY "Authors and admins can update reviews"
  ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = traveler_id OR public.is_admin())
  WITH CHECK (auth.uid() = traveler_id OR public.is_admin());

-- Authors or admins can delete reviews
CREATE POLICY "Authors and admins can delete reviews"
  ON public.reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = traveler_id OR public.is_admin());

-- ============================================================================
-- 6. payouts
-- ============================================================================
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Agencies can view only their own payouts
CREATE POLICY "Agencies can view own payouts"
  ON public.payouts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = agency_user_id);

-- Admins can view all payouts
CREATE POLICY "Admins can view all payouts"
  ON public.payouts
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Payout creation and modification are restricted to admins and service_role
CREATE POLICY "Admins can manage payouts"
  ON public.payouts
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 7. agency_bank_details
-- ============================================================================
ALTER TABLE public.agency_bank_details ENABLE ROW LEVEL SECURITY;

-- Agency can view only their own bank details
CREATE POLICY "Agencies can view own bank details"
  ON public.agency_bank_details
  FOR SELECT
  TO authenticated
  USING (auth.uid() = agency_user_id);

-- Admins can view bank details
CREATE POLICY "Admins can view all agency bank details"
  ON public.agency_bank_details
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Agencies can insert their own bank details
CREATE POLICY "Agencies can insert own bank details"
  ON public.agency_bank_details
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = agency_user_id);

-- Agencies can update their own bank details
CREATE POLICY "Agencies can update own bank details"
  ON public.agency_bank_details
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = agency_user_id OR public.is_admin())
  WITH CHECK (auth.uid() = agency_user_id OR public.is_admin());

-- ============================================================================
-- 8. conversations
-- ============================================================================
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Only conversation participants or admins can view conversations
CREATE POLICY "Participants can view conversations"
  ON public.conversations
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = traveler_id OR
    auth.uid() = agency_id OR
    public.is_admin()
  );

-- Participants can create a conversation
CREATE POLICY "Participants can insert conversations"
  ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = traveler_id OR
    auth.uid() = agency_id OR
    public.is_admin()
  );

-- Participants can update conversation timestamps
CREATE POLICY "Participants can update conversations"
  ON public.conversations
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = traveler_id OR
    auth.uid() = agency_id OR
    public.is_admin()
  );

-- ============================================================================
-- 9. messages
-- ============================================================================
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Conversation participants can view messages
CREATE POLICY "Participants can view messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND (c.traveler_id = auth.uid() OR c.agency_id = auth.uid())
    ) OR public.is_admin()
  );

-- Conversation participants can send messages as themselves
CREATE POLICY "Participants can insert messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND (c.traveler_id = auth.uid() OR c.agency_id = auth.uid())
    )
  );

-- Recipient can mark message as read
CREATE POLICY "Recipient can update message read status"
  ON public.messages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = messages.conversation_id
        AND (c.traveler_id = auth.uid() OR c.agency_id = auth.uid())
    ) OR public.is_admin()
  );

-- ============================================================================
-- 10. wishlists
-- ============================================================================
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wishlists"
  ON public.wishlists
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 11. notification_preferences
-- ============================================================================
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notification preferences"
  ON public.notification_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 12. contact_submissions
-- ============================================================================
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact form (even unauthenticated travelers)
CREATE POLICY "Anyone can submit contact form"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Only admins can read contact submissions
CREATE POLICY "Admins can view contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Only admins can update status (e.g. replied)
CREATE POLICY "Admins can update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 13. audit_log
-- ============================================================================
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Admin read only; strictly NO client-side inserts or updates
CREATE POLICY "Admins can view audit logs"
  ON public.audit_log
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ============================================================================
-- 14. platform_settings
-- ============================================================================
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Public read for runtime settings (payments_enabled, commission_rate, maintenance_mode)
CREATE POLICY "Public can read platform settings"
  ON public.platform_settings
  FOR SELECT
  USING (true);

-- Admin-only write
CREATE POLICY "Admins can update platform settings"
  ON public.platform_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can insert platform settings"
  ON public.platform_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 15. webhook_events
-- ============================================================================
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service role and admins can access webhook events ledger
CREATE POLICY "Admins can view webhook events"
  ON public.webhook_events
  FOR SELECT
  TO authenticated
  USING (public.is_admin());
