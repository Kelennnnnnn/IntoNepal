# Connecting Into Nepal Backend to Supabase

This guide outlines how to connect your Into Nepal frontend and backend to your Supabase project.

---

## 1. Retrieve Your Supabase Credentials

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and open your project.
2. In the left navigation menu, click on the **Project Settings** (gear icon) at the bottom.
3. Click on **API** in the sub-menu.
4. You will see two key values:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **Project API Keys** -> `anon` / `public` (starts with `ey...`)

---

## 2. Setting Credentials in Google AI Studio

In Google AI Studio:
1. Open the project settings panel (or `.env` file).
2. Set the environment variables:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key
   ```
3. When running locally in your IDE:
   Create a `.env.local` file in the project root with the same two lines.

---

## 3. Architecture & Security Guarantees

- **`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`**:
  These are safe to be used in the client. All access is controlled by the **Row Level Security (RLS)** policies we created in Migration `009_row_level_security.sql`.
- **Admin / Service Role (`SUPABASE_SERVICE_ROLE_KEY`)**:
  This secret bypasses RLS and is **never** exposed to the browser. It is strictly reserved for backend webhooks (e.g. Stripe webhook listener, payout transfers).
- **Single Source of Truth Commission**:
  The commission rate is stored in `platform_settings` table (`commission_rate = 15`) and read dynamically via `getRuntimeCommissionRate()`.

---

## 4. Testing Your Connection

Once configured, the app's Supabase Connection Status indicator will show **Connected**, and your queries to `listings`, `agency_applications`, and `availability` will hit your live PostgreSQL database directly!
