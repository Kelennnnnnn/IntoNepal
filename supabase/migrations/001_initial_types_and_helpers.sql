-- Migration 001: Extensions and Core Helper Functions
-- Description: Enables required PostgreSQL extensions and creates reusable utility functions for Into Nepal.

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Automatic updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. Extract duration in days as an IMMUTABLE function for generated column
-- Extracts the primary integer number from strings like "14 Days", "14 days / 13 nights", "7 Days", "3-5 days"
CREATE OR REPLACE FUNCTION public.extract_duration_days(duration_str TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
STRICT
AS $$
DECLARE
  v_match TEXT;
BEGIN
  IF duration_str IS NULL OR trim(duration_str) = '' THEN
    RETURN 1;
  END IF;
  v_match := (regexp_matches(duration_str, '([0-9]+)'))[1];
  IF v_match IS NOT NULL THEN
    RETURN v_match::INTEGER;
  ELSE
    RETURN 1;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RETURN 1;
END;
$$;

-- 4. Role & Admin verification function
-- Checks app_metadata ONLY. user_metadata is client-writable via
-- supabase.auth.updateUser() and must never be trusted for authorization.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

