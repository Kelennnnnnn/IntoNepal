# Into Nepal — Multi-Vendor Adventure Travel Marketplace

A full-stack, enterprise-grade multi-vendor travel marketplace platform connecting global travelers with verified local Nepali trekking and tour operators.

---

## 🏔️ Core Features

- **Traveler Marketplace**:
  - Filter by region (Everest, Annapurna, Langtang, Manaslu, Mustang, etc.), difficulty, category, and budget.
  - Interactive itineraries with elevation profiles, included/excluded services, and packing checklists.
  - Inquiry & provisional reservation flow adapted for local bank and remittance transactions.
- **Agency Partner Portal**:
  - Direct agency onboarding: registration number, operating license upload, PAN/VAT, and profile.
  - Real-time itinerary builder and departure calendar management.
  - Direct inquiry inbox and traveler booking review.
- **Admin Verification Console**:
  - KYC/Licensing document verification and audit trail.
  - Platform commission settings and payout logs.
  - Dispute resolution and review moderation.
- **Concurrency & Transaction Safety**:
  - Row-level atomic slot reservation via PostgreSQL RPC (`claim_availability_spots`).
  - Row-Level Security (RLS) policies enforcing multi-tenant isolation.

---

## 🚀 Setting Up with a New Supabase Organization & Project

### 1. Create your New Supabase Project
1. Log in to [supabase.com](https://supabase.com).
2. Create a new organization (or select an existing one).
3. Click **New Project**, choose your region (e.g. `Singapore (ap-southeast-1)` or `India (ap-south-1)` for closest proximity to Nepal), and set a database password.

### 2. Run Database Migrations (1 Step)
1. In your new Supabase Project, go to the **SQL Editor** (`>_` icon in the left menu).
2. Open the file `supabase/setup_into_nepal.sql` from this repository.
3. Paste its contents into the SQL Editor and click **Run**.
4. All tables, RLS policies, concurrency locks, and default platform settings will be initialized automatically.

### 3. Connect Environment Variables
In your project settings (or `.env.local`):
```bash
VITE_SUPABASE_URL="https://<your-new-project-ref>.supabase.co"
VITE_SUPABASE_ANON_KEY="<your-new-anon-key>"
```

---

## 🐙 Linking to GitHub

### Option A: 1-Click Export via Google AI Studio (Easiest)
1. In the Google AI Studio interface, click the **Settings / Menu** in the top right.
2. Select **Export to GitHub**.
3. Authorize GitHub and choose your repository name (e.g., `into-nepal-marketplace`).
4. AI Studio will automatically push the entire repository to your GitHub account!

### Option B: Push via Git CLI
If you cloned or downloaded the project:
```bash
git init
git add .
git commit -m "feat: Initial commit of Into Nepal Marketplace"
git branch -M main
git remote add origin https://github.com/<your-username>/into-nepal-marketplace.git
git push -u origin main
```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter & type check
npm run lint

# Production build
npm run build
```
