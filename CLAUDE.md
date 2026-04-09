# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Panda Commerce monorepo — a composable ecommerce platform with two independent apps:

- **`apps/storefront/`** — Customer-facing Medusa storefront (Next.js 15 + Bun)
- **`apps/payload-cms/`** — Headless CMS for landing/product pages (Payload 3 + pnpm)

The Medusa backend lives in a separate repo (`store-pandacat-ai`) and is already configured with payment modules for ECPay and PAYUni.

## Commands

### Storefront (`apps/storefront/` or root)

```bash
bun install                    # Install dependencies
bun run dev                    # Dev server on :8000 (turbopack)
bun run build                  # Production build
bun run start                  # Start production server on :8000
bun run lint                   # ESLint
```

### Payload CMS (`apps/payload-cms/`)

```bash
pnpm install                   # Install dependencies
pnpm dev                       # Dev server (generates import map first)
pnpm build                     # Production build
pnpm lint                      # ESLint
pnpm test:int                  # Unit tests (Vitest)
pnpm test:e2e                  # E2E tests (Playwright)
pnpm migrate                   # Run DB migrations
pnpm sync:products             # Sync Medusa products into Payload
```

## Architecture

### Storefront

**Region-based routing**: Middleware (`src/middleware.ts`) resolves country code from URL path → Vercel IP header → `NEXT_PUBLIC_DEFAULT_REGION`. All pages live under `src/app/[countryCode]/`.

**Data layer**: `src/lib/config.ts` initializes the Medusa JS SDK. Server actions in `src/lib/data/` handle cart, customer, orders, and products. Cache tags (`revalidateTag`) are used for invalidation.

**i18n**: Messages loaded from `src/lib/i18n/messages.ts`. Supported locales configured via `NEXT_PUBLIC_SUPPORTED_LOCALES` env var. The SDK injects `x-medusa-locale` header via `get-locale-header.ts`.

**Payload CMS integration**: `src/lib/payload/` fetches landing pages, product pages, and site settings from the Payload CMS API. Content changes in Payload trigger Next.js revalidation via webhooks.

**Payment flow**: `src/lib/constants.tsx` maps payment provider IDs to display info. The checkout supports:
- **Stripe** — embedded card element via `@stripe/react-stripe-js`
- **Hosted redirect** — ECPay (`pp_ecpay-aio_ecpay-aio`) and PAYUni (`pp_payuni-upp_payuni-upp`) use form POST redirects
- **Manual** — test/free orders

`isHostedRedirectPayment()` in constants.tsx gates ECPay/PAYUni into the `HostedRedirectPaymentButton` component which calls `placeOrder()` then submits a hidden form with redirect URL and form fields from the payment session data.

### Payload CMS

**Collections**: ProductPages (synced from Medusa), LandingPages, FAQItems, Media (R2 storage), Users.

**Blocks**: Hero, ProductShelf, FeatureGrid, MediaStory, ComparisonTable, FAQ, CTAButton, etc. — used for composable page building.

**Medusa sync**: Webhook at `/api/integrations/medusa/products` receives product upsert/delete events. Manual bulk sync via `pnpm sync:products`.

**Storefront revalidation**: `hooks/revalidate-storefront.ts` sends POST to storefront with cache tags when content changes.

## Key Environment Variables

### Storefront

| Variable | Purpose |
|---|---|
| `MEDUSA_BACKEND_URL` | Medusa server URL (default: `http://localhost:9000`) |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Medusa publishable API key |
| `NEXT_PUBLIC_STRIPE_KEY` | Stripe public key |
| `NEXT_PUBLIC_BASE_URL` | Storefront URL (used for payment callbacks) |
| `PAYLOAD_CMS_URL` | Payload CMS API URL |
| `NEXT_PUBLIC_DEFAULT_REGION` | Fallback country code (ISO-2, default: `us`) |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default locale (e.g. `en-US`) |
| `REVALIDATE_SECRET` | Shared secret for revalidation webhooks |

### Payload CMS

| Variable | Purpose |
|---|---|
| `DATABASE_URI` | PostgreSQL connection string |
| `PAYLOAD_SECRET` | Payload encryption secret |
| `R2_*` | Cloudflare R2 storage config |
| `FRONTEND_REVALIDATE_URL` | Storefront revalidation endpoint |
| `MEDUSA_BACKEND_URL` | Medusa API for product sync |
