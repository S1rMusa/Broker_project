# Broker — Kenya Lender-Borrower Matching Platform

Broker is a **fintech matching platform** for Kenya. It does **not** transfer money, hold customer funds, or issue loans. It connects borrowers with licensed lenders, scores compatibility, and refers qualified applications.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 21 (standalone, Signals) |
| Backend | Supabase (Auth, PostgreSQL, RLS) |
| Styling | Tailwind CSS 3 |
| Charts | Chart.js |
| State | Angular Signals |

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for database)

### 1. Install dependencies

```bash
cd broker
npm install
```

### 2. Run the app (demo mode)

Works without Supabase — uses mock lenders, live market simulation, and demo auth.

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200)

> **Important:** Run `npm start` from the `broker` folder (not by opening HTML files directly). If the UI looks unstyled, stop the server (Ctrl+C) and run `npm start` again so Tailwind CSS reloads.

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Borrower | `borrower@broker.ke` | `demo1234` |
| Lender Admin | `lender@broker.ke` | `demo1234` |
| Super Admin | `admin@broker.ke` | `demo1234` |

## Connect to Supabase

The app runs in **demo mode** until you add real Supabase credentials. Follow this plan in order.

### Overview

| Step | Where | What you do |
|------|--------|-------------|
| 1 | [supabase.com](https://supabase.com) | Create project, copy API keys |
| 2 | Supabase Dashboard → **SQL Editor** | Run migration + seed SQL |
| 3 | Supabase Dashboard → **Authentication** | Configure URLs, email, roles metadata |
| 4 | `src/environments/` | Paste URL + anon key |
| 5 | Terminal | Restart `npm start`, register / log in |

---

### Step 1 — Create a Supabase project

1. Sign in at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Click **New project** → choose org, name (e.g. `broker-kenya`), database password, region (e.g. `eu-west-1` or closest to Kenya).
3. Wait until the project status is **Active**.

**Copy these values** (you need them in Step 4):

| Setting | Location in dashboard |
|---------|------------------------|
| **Project URL** | **Project Settings** → **API** → **Project URL** |
| **anon public key** | **Project Settings** → **API** → **Project API keys** → `anon` `public` |

> Use the **anon** key in the Angular app only. Never put the `service_role` key in frontend code.

---

### Step 2 — Run database schema and seed (Supabase Dashboard)

Open **SQL Editor** → **New query** and run the files **in this order**:

#### 2a. Migration (tables, RLS, triggers)

Paste and run the full contents of:

```
supabase/migrations/20240522000001_initial_schema.sql
```

This creates:

- `profiles`, `user_roles`, `lenders`, `loan_products`
- `borrower_applications`, `application_documents`, `lender_matches`
- `notifications`, `commissions`, `market_rates`, `audit_logs`
- Row Level Security (RLS) policies
- Trigger to auto-create a `profiles` row when a user signs up in Auth

#### 2b. Seed data (16 lenders)

Paste and run:

```
supabase/seed.sql
```

Verify in **Table Editor** → `lenders` that 16 rows exist.

#### Optional — Supabase CLI (instead of SQL Editor)

```bash
cd broker
npm install -g supabase          # if not installed
supabase login
supabase link --project-ref YOUR_PROJECT_REF   # ref = subdomain of your URL

supabase db push                 # applies supabase/migrations/
# Then run seed manually in SQL Editor, or:
psql "$DATABASE_URL" -f supabase/seed.sql
```

`YOUR_PROJECT_REF` is the ID in `https://YOUR_PROJECT_REF.supabase.co`.

---

### Step 3 — What to edit in the Supabase Dashboard

#### Authentication → [URL configuration](https://supabase.com/dashboard/project/_/auth/url-configuration)

| Field | Value (local dev) |
|-------|-------------------|
| **Site URL** | `http://localhost:4200` |
| **Redirect URLs** | `http://localhost:4200/**` |

For production, add your deployed domain (e.g. `https://broker.yourdomain.com/**`).

#### Authentication → [Providers](https://supabase.com/dashboard/project/_/auth/providers) → Email

| Setting | Recommendation |
|---------|----------------|
| **Enable Email provider** | On |
| **Confirm email** | Off for local dev; **On** for production |
| **Secure email change** | On (production) |

#### Authentication → [Users](https://supabase.com/dashboard/project/_/auth/users) (after first signup)

When testing roles manually, edit a user’s **raw user metadata** (or use SQL on `profiles`):

```json
{
  "full_name": "Peter Ochieng",
  "role": "lender_admin"
}
```

Allowed `role` values: `borrower`, `lender_admin`, `super_admin`.

For **lender admins**, also set `lender_id` on the `profiles` row to a UUID from the `lenders` table (Table Editor → `profiles`).

#### Storage (optional — document uploads)

1. **Storage** → **New bucket** → name: `application-documents`
2. Set **Private**
3. Add policies so authenticated users can upload/read their own files (or add later when wiring `application_documents` uploads).

#### API → [Settings](https://supabase.com/dashboard/project/_/settings/api)

- Leave **Expose schema** as `public` (default).
- No change needed unless you add extra schemas.

#### Database → [Extensions](https://supabase.com/dashboard/project/_/database/extensions)

- Ensure **uuid-ossp** (or use built-in `gen_random_uuid()` on Postgres 15+) — migration uses `uuid_generate_v4()`.

---

### Step 4 — Edit Angular environment files

**Development** — `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://YOUR_PROJECT_REF.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',  // anon key only
  appName: 'Broker',
  appTagline: 'Kenya\'s Lender-Borrower Matching Platform',
};
```

**Production** — `src/environments/environment.prod.ts` (same keys, `production: true`).

Replace placeholders:

- `YOUR_PROJECT_REF` → from your project URL
- `eyJ...` → **anon public** key from Step 1

The app detects configuration in `SupabaseService.isConfigured()` — once the URL no longer contains `your-project`, **demo auth is disabled** and real Supabase Auth is used.

---

### Step 5 — Local Supabase config (optional)

If you use `supabase start` locally, align `supabase/config.toml` with the app:

```toml
[auth]
site_url = "http://localhost:4200"
additional_redirect_urls = ["http://localhost:4200"]
```

Already set in this repo; update if you change the dev port (`ng serve --port 4300`).

---

### Step 6 — Test the connection

```bash
npm start
```

1. Open [http://localhost:4200/auth/register](http://localhost:4200/auth/register)
2. Register as **Borrower** with a real email (if confirm email is on, verify inbox).
3. Check **Authentication** → **Users** and **Table Editor** → `profiles` for the new row.
4. Sign in — you should land on `/borrower/dashboard` (not demo mock users).

**Promote a user to Super Admin** (SQL Editor):

```sql
UPDATE profiles
SET role = 'super_admin'
WHERE email = 'your-email@example.com';
```

Sign out and sign in again to load the admin dashboard.

---

### Step 7 — Role and data checklist

| Role | `profiles.role` | Extra setup |
|------|-----------------|-------------|
| Borrower | `borrower` | Default on signup |
| Lender Admin | `lender_admin` | Set `profiles.lender_id` to one `lenders.id` |
| Super Admin | `super_admin` | Manual SQL or metadata update |

| Feature | Supabase table(s) |
|---------|-------------------|
| Lender marketplace | `lenders`, `loan_products` |
| Applications | `borrower_applications` |
| Matching results | `lender_matches` |
| Notifications | `notifications` |
| Commissions | `commissions` (super admin) |
| Audit trail | `audit_logs` (super admin) |

---

### Troubleshooting

| Problem | Fix |
|---------|-----|
| “Configure Supabase credentials” error | Update both `supabaseUrl` and `supabaseAnonKey` in `environment.ts` |
| Login works but wrong dashboard | Check `profiles.role` in Table Editor |
| RLS blocks reads/writes | Ensure user is logged in; check policies in migration file |
| No lenders on marketplace | Re-run `supabase/seed.sql` |
| Email not arriving | Auth → Email templates; disable confirm email for dev |
| CORS / redirect errors | Add exact URL under Auth → URL configuration |

---

### Security reminders

- Never commit real keys to git; use environment files or CI secrets.
- Use **anon** key in the browser; reserve **service_role** for trusted server-side scripts only.
- Review RLS policies in `supabase/migrations/20240522000001_initial_schema.sql` before production.

## Project Structure

```
broker/
├── supabase/
│   ├── migrations/     # PostgreSQL schema + RLS
│   └── seed.sql        # 16 Kenyan lenders
├── src/app/
│   ├── core/           # Guards, services, models, mock data
│   ├── shared/         # Charts, cards, toasts, skeletons
│   ├── layout/         # Public header, dashboard shell
│   └── features/
│       ├── public/     # Landing, marketplace, calculator
│       ├── auth/       # Login, register
│       ├── borrower/   # Dashboard, applications, profile
│       ├── lender/     # Pipeline, analytics, borrowers
│       └── admin/      # Platform analytics, audit, users
└── tailwind.config.js
```

## Features

### Public (no login required)
- Live market dashboard with animated rate charts
- Lender marketplace (16 lenders, search, pagination)
- Lender detail pages
- Loan calculator
- Market trends page

### Borrower
- Eligibility matching engine
- Recommended lenders with compatibility %
- Application form & tracking
- Affordability & approval probability scores
- Notifications

### Lender Admin
- Incoming applications & compatibility scores
- Pipeline management
- Borrower filtering
- Conversion analytics

### Super Admin
- Platform analytics & fraud monitoring
- User & lender management
- Audit logs & commission tracking

## Matching Engine

`MatchingService` scores borrowers on:
- Income & affordability
- Employment type vs lender risk profile
- Requested amount vs lender range
- Debt ratio & CRB status
- Business stability

Returns compatibility score, approval likelihood, and top 5 lender matches.

## Future Integrations (placeholders)

See `src/app/core/placeholders/future-integrations.ts`:
- AI underwriting
- OCR document scanning
- M-Pesa STK push
- Lender APIs
- Fraud detection
- CRB (Metropol) integration

## Build

```bash
npm run build
```

## Design

- **Primary:** Blue (`#2563eb`)
- **Accent:** Orange (`#f97316`)
- Glassmorphism cards, dark/light mode, responsive sidenav

## License

Proprietary — Broker Kenya © 2026
