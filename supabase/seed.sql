-- Supabase Seed Data for Into Nepal (Local / Staging development)
-- Run this in Supabase SQL editor to populate initial verified agency and sample listings

-- 1. Ensure platform settings are present
INSERT INTO public.platform_settings (key, value)
VALUES
  ('payments_enabled', 'true'::jsonb),
  ('payouts_enabled', 'true'::jsonb),
  ('maintenance_mode', 'false'::jsonb),
  ('commission_rate', '15'::jsonb)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value, updated_at = now();

-- Note: To insert agency_applications and listings associated with a user,
-- create an account in Supabase Auth first, then assign that user's UUID to the agency_applications table:
--
-- Example:
-- INSERT INTO public.agency_applications (
--   user_id, company_name, registration_number, address, city,
--   contact_person, phone, email, website, status, years_operating, rating, review_count
-- ) VALUES (
--   '<YOUR_AUTH_USER_UUID>',
--   'Himalayan Treks & Expeditions Ltd.',
--   'REG-NP-2012-8821',
--   'Thamel Marg 29',
--   'Kathmandu',
--   'Pasang Sherpa',
--   '+977 1 4412345',
--   'info@himalayantreks.com.np',
--   'https://himalayantreks.com.np',
--   'verified',
--   14,
--   4.95,
--   128
-- );
