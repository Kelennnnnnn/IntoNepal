-- Migration 007: Availability Concurrency Functions
-- Description: Atomic reservation and release RPCs for departure capacity.
-- CRITICAL CONCURRENCY RULE: Only these two functions may modify spots_remaining.
-- NO insert/cancel triggers may touch spots_remaining to prevent race conditions or double-decrementing.

-- 1. Atomic claim function
CREATE OR REPLACE FUNCTION public.claim_availability_spots(
  p_availability_id UUID,
  p_guests INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rows_affected INTEGER;
BEGIN
  IF p_guests IS NULL OR p_guests <= 0 THEN
    RAISE EXCEPTION 'Number of guests must be greater than zero';
  END IF;

  UPDATE public.availability
  SET spots_remaining = spots_remaining - p_guests,
      updated_at = now()
  WHERE id = p_availability_id
    AND blocked = FALSE
    AND spots_remaining >= p_guests;

  GET DIAGNOSTICS v_rows_affected = ROW_COUNT;
  RETURN (v_rows_affected = 1);
END;
$$;

COMMENT ON FUNCTION public.claim_availability_spots(UUID, INT) IS
'Atomically decrements available departure spots if capacity permits. Single source of truth for booking capacity.';

-- 2. Atomic release function
CREATE OR REPLACE FUNCTION public.release_availability_spots(
  p_availability_id UUID,
  p_guests INT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_guests IS NULL OR p_guests <= 0 THEN
    RETURN;
  END IF;

  UPDATE public.availability
  SET spots_remaining = LEAST(spots_total, spots_remaining + p_guests),
      updated_at = now()
  WHERE id = p_availability_id;
END;
$$;

COMMENT ON FUNCTION public.release_availability_spots(UUID, INT) IS
'Atomically returns spots to availability up to spots_total on cancellation or payment failure.';
