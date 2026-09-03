# Into Nepal — Database Migration Order

All migrations are stored under `/supabase/migrations/` and follow a strict numerical dependency sequence.

## Migration Sequence

1. **`001_initial_types_and_helpers.sql`**
   - **Dependencies**: None
   - **Contents**:
     - Extensions: `uuid-ossp`, `pgcrypto`
     - Timestamp trigger function: `set_updated_at()`
     - Immutable duration parser: `extract_duration_days(duration_str TEXT)`
     - Role & privilege helper: `is_admin()` and `is_verified_agency(user_id UUID)`

2. **`002_core_marketplace_tables.sql`**
   - **Dependencies**: `001_initial_types_and_helpers.sql`
   - **Contents**:
     - `agency_applications`: Agency profiles, registration credentials, document URLs, review stats
     - `listings`: Trips and itineraries with `duration_days` generated always stored column, difficulty, categories, pricing, JSONB itinerary
     - `availability`: Per-date departure capacity, `spots_total`, `spots_remaining`, `blocked`, and `price_override`

3. **`003_bookings_financials_payouts.sql`**
   - **Dependencies**: `002_core_marketplace_tables.sql`
   - **Contents**:
     - `bookings`: Financial records with all monetary amounts as `NUMERIC(10,2)` (never float), commission calculation columns, status, and payment intents
     - `reviews`: Verified traveler reviews linked 1:1 with completed bookings (`uq_review_per_booking`)
     - `payouts`: Agency disbursements via Stripe Connect or approved manual wire
     - `agency_bank_details`: Payout bank details with raw account numbers stored via Supabase Vault secret IDs (`account_number_secret_id`)

4. **`004_conversations_user_and_support.sql`**
   - **Dependencies**: `003_bookings_financials_payouts.sql`
   - **Contents**:
     - `conversations`: Two-party chat threads between travelers and agencies
     - `messages`: Chronological conversation messages with read timestamps
     - `wishlists`: Traveler saved listings (`uq_wishlist_user_listing`)
     - `notification_preferences`: Email and notification preferences
     - `contact_submissions`: Public traveler support and contact submissions

5. **`005_audit_platform_settings_and_webhooks.sql`**
   - **Dependencies**: None (standalone operational tables)
   - **Contents**:
     - `audit_log`: Trigger-written immutable audit log for compliance and dispute management
     - `platform_settings`: Single-source-of-truth runtime configurations with seeded defaults (`payments_enabled=true`, `payouts_enabled=true`, `maintenance_mode=false`, `commission_rate=15`)
     - `webhook_events`: Stripe webhook idempotency table preventing replay and double charges

6. **`006_indexes.sql`**
   - **Dependencies**: Tables from `002` through `005`
   - **Contents**:
     - Composite search index: `listings(status, category, location, duration_days, price)`
     - Financial query index: `bookings(traveler_id, agency_id, payment_intent_id)`
     - Departure query index: `availability(listing_id, date)`
     - Rating query index: `reviews(listing_id)`
     - Payout query index: `payouts(agency_user_id)`
     - Communication, wishlist, and audit log performance indexes

7. **`007_availability_concurrency.sql`**
   - **Dependencies**: `availability` table (`002`)
   - **Contents**:
     - `claim_availability_spots(p_availability_id UUID, p_guests INT) RETURNS BOOLEAN`: Atomic single-statement decrement of spots with row-count check.
     - `release_availability_spots(p_availability_id UUID, p_guests INT) RETURNS VOID`: Atomic release returning spots up to `spots_total`.
     - *Zero-trigger rule*: No insert or delete triggers touch `spots_remaining`, eliminating race conditions and double-decrements.

8. **`008_triggers_and_automation.sql`**
   - **Dependencies**: Tables `002` through `005`
   - **Contents**:
     - `enforce_default_role`: `BEFORE INSERT ON auth.users` forces `role='user'` to eliminate privilege escalation
     - `audit_financial_change`: `AFTER UPDATE ON bookings, payouts` writes state changes to `audit_log`
     - `lock_booking_financial_fields`: `BEFORE UPDATE ON bookings` locks monetary and commission columns from client modification
     - `recalculate_listing_rating`: `AFTER INSERT/UPDATE/DELETE ON reviews` updates ratings on `listings` and `agency_applications`
     - `set_updated_at`: Automatically updates `updated_at` timestamps on all applicable tables

9. **`009_row_level_security.sql`**
   - **Dependencies**: All tables and helper functions
   - **Contents**:
     - RLS enabled across all 15 tables
     - Explicit policies for travelers, verified agencies, and administrators
     - Strict isolation of payouts, bank secrets, bookings, and audit records

---

## Execution Instructions

Run migrations using the Supabase CLI:

```bash
supabase db reset
# or apply migrations incrementally:
supabase migration up
```
