-- Migration 010: Fix is_admin() Security Vulnerability
-- Description: Ensures public.is_admin() reads role claims strictly from app_metadata or service_role.
-- In Supabase Auth, user_metadata (raw_user_meta_data) can be modified by the authenticated user
-- via the client SDK (supabase.auth.updateUser). Relying on user_metadata allows privilege escalation.
-- Only app_metadata (raw_app_meta_data) is server-controlled and protected from client tampering.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'role') = 'service_role' OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true,
    false
  );
$$;

-- Ensure execution permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;
