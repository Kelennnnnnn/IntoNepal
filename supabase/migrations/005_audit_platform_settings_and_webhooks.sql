-- Migration 005: Audit Log, Platform Settings, and Webhook Events
-- Description: Creates compliance audit trail, central configuration, and Stripe webhook idempotency tables.

-- 13. audit_log — system and administrative audit records
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.audit_log IS 'Immutable audit records written by database triggers and admin operations.';

-- 14. platform_settings — runtime single-source-of-truth settings
CREATE TABLE IF NOT EXISTS public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.platform_settings IS 'Global platform parameters such as runtime commission rate and kill-switches.';

-- Seed initial default platform settings
INSERT INTO public.platform_settings (key, value)
VALUES
  ('payments_enabled', 'true'::jsonb),
  ('payouts_enabled', 'true'::jsonb),
  ('maintenance_mode', 'false'::jsonb),
  ('commission_rate', '15'::jsonb)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    updated_at = now();

-- 15. webhook_events — Stripe webhook event idempotency table
CREATE TABLE IF NOT EXISTS public.webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.webhook_events IS 'Idempotency ledger ensuring Stripe webhooks are processed exactly once.';
