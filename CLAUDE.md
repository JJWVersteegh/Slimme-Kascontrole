# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
npm run start    # Run production build locally
```

No test suite exists. Verify changes manually via `npm run dev`.

## Stack

- **Next.js 16.2.4** (App Router) + React 19 + TypeScript
- **Supabase** — auth, Postgres database, file storage (`kascontrole-bestanden` bucket)
- **Stripe** — payments (iDEAL + card, €59 fixed price)
- **Resend** — transactional email
- **Moneybird** — automatic invoice creation after payment
- **Vercel Analytics** — page view tracking via `<Analytics />` in `app/layout.tsx`

Styling is **100% inline styles** — no Tailwind utility classes are used despite Tailwind being installed.

## Architecture

### Pages

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Marketing homepage |
| `/registreer` | `app/registreer/page.tsx` | Registration + herkomst tracking |
| `/mijn-omgeving` | `app/mijn-omgeving/page.tsx` | Customer dashboard (upload → pay → generate) |
| `/admin` | `app/admin/page.tsx` | Admin panel (klanten, uploads, rapporten, beheerders, kortingscodes, 🧹 opruimen) |
| `/via/[slug]` | `app/via/[slug]/page.tsx` | Referral link — saves slug to `localStorage('skc_ref')`, redirects to `/` |
| `/betaald` | `app/betaald/page.tsx` | Post-payment confirmation |
| `/rapport` | `app/rapport/page.tsx` | Rapport viewer |

### API Routes

All API routes are in `app/api/`. Key patterns:

- **Auth check** — forward the `Authorization: Bearer <token>` header from the client, then verify with an anon Supabase client:
  ```ts
  const anonClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } })
  const { data: { user } } = await anonClient.auth.getUser()
  ```
- **Admin routes** — use `requireAdmin()` from `app/api/_adminAuth.ts`. Only `info@vertras.nl` is admin.
- **Service role** — created inline in routes that need it (bypasses RLS). Never export or share the service role client.

| Route | Purpose |
|---|---|
| `POST /api/checkout` | Creates Stripe session, requires auth |
| `POST /api/webhook` | Stripe webhook → sets `rapporten.betaald = true`, creates Moneybird invoice, sends Resend email |
| `POST /api/genereer-rapport-totaal` | Reads uploads from storage, calls Claude AI, saves rapport |
| `POST /api/upload` | Handles file upload to Supabase storage |
| `GET/DELETE /api/admin-orphan-users` | Lists/deletes auth users without a `klanten` row |
| `DELETE /api/admin-delete-vereniging` | Deletes vereniging + cascades |

### Supabase Patterns

**Critical**: The Supabase query builder is **immutable**. Conditional filters must reassign:
```ts
// ✅ Correct
let query = supabase.from('rapporten').select('*').eq('user_id', id)
if (vereniging_id) query = query.eq('vereniging_id', vereniging_id)

// ❌ Wrong — filter is silently discarded
let query = supabase.from('rapporten').select('*').eq('user_id', id)
if (vereniging_id) query.eq('vereniging_id', vereniging_id)
```

**Client-side**: Use `lib/supabase.ts` (anon client).  
**API routes**: Instantiate clients inline — either anon (with forwarded auth header) or service role.

### Database Tables (key ones)

- `klanten` — user profile, linked to `auth.users` via `user_id`
- `verenigingen` — VvE/association per klant
- `uploads` — file upload records; `bestanden: string[]` holds storage paths
- `rapporten` — one row per boekjaar+vereniging; `betaald`, `rapport_tekst`, `gegenereerd_op`
- `beheerders` — VvE managers with referral slug; FK to klanten is `ON DELETE SET NULL`
- `kortingscodes` — promo codes for Stripe

### File Uploads

Storage bucket: `kascontrole-bestanden`  
Path format: `{user_id}/{boekjaar}/{filename}`  
Stored in `uploads.bestanden` as an array of storage paths.  
The AI report generator only reads Excel (.xlsx/.xls) and CSV files from uploads — PDF/images are stored but not parsed.

### Referral Tracking

`/via/[slug]` → saves to `localStorage('skc_ref')` → `/registreer` reads it on mount and clears it after registration. The `beheerders` table has a `slug` column for matching.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
MONEYBIRD_API_KEY
NEXT_PUBLIC_BASE_URL        # https://www.slimmekascontrole.nl
RESEND_API_KEY
```
