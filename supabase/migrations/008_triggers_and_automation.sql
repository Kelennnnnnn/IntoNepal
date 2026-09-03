-- Migration 008: Database Triggers and Automation
-- Description: Implements security role enforcement, financial audit logging,
-- immutability locks on financial columns, review rating recalculations, and updated_at triggers.

-- 1. Trigger Function: enforce_default_role
-- Forces role='user' on signup to prevent privilege escalation via metadata injection
CREATE OR REPLACE FUNCTION public.handle_enforce_default_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Overwrite any client-injected role claim in user metadata
  NEW.raw_user_meta_data = jsonb_set(
    COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"user"'::jsonb,
    true
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_enforce_default_role ON auth.users;
CREATE TRIGGER tr_enforce_default_role
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_enforce_default_role();

-- 2. Trigger Function: audit_financial_change
-- Automatically logs financial and status updates on bookings and payouts to audit_log
CREATE OR REPLACE FUNCTION public.audit_financial_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (TG_TABLE_NAME = 'bookings') THEN
    IF (OLD.status IS DISTINCT FROM NEW.status OR
        OLD.payment_status IS DISTINCT FROM NEW.payment_status OR
        OLD.total_amount IS DISTINCT FROM NEW.total_amount OR
        OLD.refund_amount IS DISTINCT FROM NEW.refund_amount) THEN

      INSERT INTO public.audit_log (actor_user_id, action, entity_type, entity_id, details)
      VALUES (
        auth.uid(),
        'BOOKING_FINANCIAL_UPDATE',
        'bookings',
        NEW.id,
        jsonb_build_object(
          'old_status', OLD.status,
          'new_status', NEW.status,
          'old_payment_status', OLD.payment_status,
          'new_payment_status', NEW.payment_status,
          'old_total_amount', OLD.total_amount,
          'new_total_amount', NEW.total_amount,
          'old_refund_amount', OLD.refund_amount,
          'new_refund_amount', NEW.refund_amount,
          'payment_intent_id', NEW.payment_intent_id
        )
      );
    END IF;

  ELSIF (TG_TABLE_NAME = 'payouts') THEN
    IF (OLD.status IS DISTINCT FROM NEW.status OR
        OLD.amount IS DISTINCT FROM NEW.amount OR
        OLD.stripe_transfer_id IS DISTINCT FROM NEW.stripe_transfer_id) THEN

      INSERT INTO public.audit_log (actor_user_id, action, entity_type, entity_id, details)
      VALUES (
        auth.uid(),
        'PAYOUT_FINANCIAL_UPDATE',
        'payouts',
        NEW.id,
        jsonb_build_object(
          'old_status', OLD.status,
          'new_status', NEW.status,
          'old_amount', OLD.amount,
          'new_amount', NEW.amount,
          'stripe_transfer_id', NEW.stripe_transfer_id,
          'method', NEW.method
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_audit_booking_financials ON public.bookings;
CREATE TRIGGER tr_audit_booking_financials
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_financial_change();

DROP TRIGGER IF EXISTS tr_audit_payout_financials ON public.payouts;
CREATE TRIGGER tr_audit_payout_financials
  AFTER UPDATE ON public.payouts
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_financial_change();

-- 3. Trigger Function: lock_booking_financial_fields
-- Prohibits client mutations to total_amount, commission_amount, net_payout, price_per_person, commission_rate
CREATE OR REPLACE FUNCTION public.lock_booking_financial_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Allow service_role, postgres superuser, or explicit admin users
  IF NOT public.is_admin() AND current_user NOT IN ('postgres', 'supabase_admin') THEN
    IF (OLD.total_amount IS DISTINCT FROM NEW.total_amount OR
        OLD.commission_amount IS DISTINCT FROM NEW.commission_amount OR
        OLD.net_payout IS DISTINCT FROM NEW.net_payout OR
        OLD.price_per_person IS DISTINCT FROM NEW.price_per_person OR
        OLD.commission_rate IS DISTINCT FROM NEW.commission_rate) THEN
      RAISE EXCEPTION 'Financial fields (total_amount, commission_amount, net_payout, price_per_person, commission_rate) on bookings are immutable by client operations';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_lock_booking_financial_fields ON public.bookings;
CREATE TRIGGER tr_lock_booking_financial_fields
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.lock_booking_financial_fields();

-- 4. Trigger Function: recalculate_listing_rating
-- Recomputes rating and review_count on listings and agency_applications
CREATE OR REPLACE FUNCTION public.recalculate_listing_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_listing_id UUID;
  v_agency_id UUID;
  v_avg_rating NUMERIC(3,2);
  v_count INTEGER;
  v_agency_avg NUMERIC(3,2);
  v_agency_count INTEGER;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_listing_id := OLD.listing_id;
    v_agency_id := OLD.agency_id;
  ELSE
    v_listing_id := NEW.listing_id;
    v_agency_id := NEW.agency_id;
  END IF;

  -- 1. Recalculate listing metrics
  SELECT COALESCE(ROUND(AVG(rating)::NUMERIC, 2), 0.00), COUNT(*)
  INTO v_avg_rating, v_count
  FROM public.reviews
  WHERE listing_id = v_listing_id AND hidden = FALSE;

  UPDATE public.listings
  SET rating = v_avg_rating,
      review_count = v_count,
      updated_at = now()
  WHERE id = v_listing_id;

  -- 2. Recalculate agency overall metrics
  SELECT COALESCE(ROUND(AVG(rating)::NUMERIC, 2), 0.00), COUNT(*)
  INTO v_agency_avg, v_agency_count
  FROM public.reviews
  WHERE agency_id = v_agency_id AND hidden = FALSE;

  UPDATE public.agency_applications
  SET rating = v_agency_avg,
      review_count = v_agency_count,
      updated_at = now()
  WHERE user_id = v_agency_id;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS tr_recalculate_listing_rating ON public.reviews;
CREATE TRIGGER tr_recalculate_listing_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.recalculate_listing_rating();

-- 5. set_updated_at triggers on all tables with updated_at
DROP TRIGGER IF EXISTS tr_set_updated_at_agency_applications ON public.agency_applications;
CREATE TRIGGER tr_set_updated_at_agency_applications
  BEFORE UPDATE ON public.agency_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_set_updated_at_listings ON public.listings;
CREATE TRIGGER tr_set_updated_at_listings
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_set_updated_at_availability ON public.availability;
CREATE TRIGGER tr_set_updated_at_availability
  BEFORE UPDATE ON public.availability
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_set_updated_at_bookings ON public.bookings;
CREATE TRIGGER tr_set_updated_at_bookings
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_set_updated_at_reviews ON public.reviews;
CREATE TRIGGER tr_set_updated_at_reviews
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_set_updated_at_agency_bank_details ON public.agency_bank_details;
CREATE TRIGGER tr_set_updated_at_agency_bank_details
  BEFORE UPDATE ON public.agency_bank_details
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_set_updated_at_conversations ON public.conversations;
CREATE TRIGGER tr_set_updated_at_conversations
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_set_updated_at_notification_preferences ON public.notification_preferences;
CREATE TRIGGER tr_set_updated_at_notification_preferences
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_set_updated_at_contact_submissions ON public.contact_submissions;
CREATE TRIGGER tr_set_updated_at_contact_submissions
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_set_updated_at_platform_settings ON public.platform_settings;
CREATE TRIGGER tr_set_updated_at_platform_settings
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
