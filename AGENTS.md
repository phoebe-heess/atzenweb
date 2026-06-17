# Atzengold Web — Agent Context

## Project
Marketing/webshop/B2B SPA for Atzengold Kellerbier. React 19 + TS + Vite + Tailwind v4 (OKLCH tokens). Hash-routed SPA, dark mode, i18n (DE/EN/de-BY). Maplibre GL map, Vercel KV backend, Stripe Checkout.

## Stack
- **UI**: React 19 + TS, Tailwind v4 — tokens in `src/index.css` `@theme`. Brand: `primary`/#058054 forest, `canvas`/#edcea7 cream, `accent`/#d38b0d gold (decorative only). Text AAA on light: `ink` deep-forest (7.0:1), `ink-secondary` (5.4:1). Dark bg: `primary-deep` (7.0:1 with cream). Utility: `magenta`=#B83A3D.
- **Routing**: Hash-based `#section` → `scrollIntoView`
- **Map**: Maplibre GL (`react-map-gl/maplibre`) + `use-supercluster`
- **Data**: Vercel KV (Redis, prefix `ag:`). Public fallback to static JSON
- **Email**: Resend (`/api/send-email`)
- **Payments**: Stripe Checkout (€, DE-only, locale `de`)
- **Admin**: Bearer token auth (`ADMIN_API_KEY`), KV-backed CRUD
- **Testing**: Vitest + @testing-library/react (46 tests, 7 files)
- **Images**: Vercel Blob + sharp (WebP ≤100KB, max 800px)

## Key Design Decisions
1. Admin auth: Bearer token, default dev key `atzengold-admin-dev-key`
2. Venue coords: flattened `longitude`/`latitude` (not nested)
3. Beer profile / Brand Hub / Settings / Translations: singleton KV keys
4. Translations: KV overrides → JSON base. Manual (★) persist; auto (☆) re-translate via DeepL
5. Stripe secret key from KV Settings (Admin > Settings); webhook optional (`STRIPE_WEBHOOK_SECRET`)
6. Order flow: `pending` → `paid` (webhook) → `shipped`/`cancelled` (manual). DHL €4.90, free ≥€50
7. Legal pages: overlay pattern (AGB, Widerrufsrecht, Datenschutz, Impressum)
8. ProductDetail rendered inside MerchShop (no state lifting)
9. `MerchItem.image` aliased to `images[0]`; `sizes` kept alongside `options`
10. Instagram: mocked (phase B5 skipped)

## Session History
- **Phase A (initial)**: All 12 UI components, i18n, admin CMS, 6 API endpoints, KV lib, 46 tests
- **Session 1**: Footer restructure, NewsletterSignup/B2B polish, HeritageCrests font, i18n gap fixes, dark mode contrast, Vercel+KV setup, `getCollection` bugfix, live API wiring for 5 components, AdminBrandGuidelines dev workflow split, image upload pipeline, AdminCrud `'image'` field type + per-collection guidelines
- **Session 2 (Stripe)**: Multiple images per product, Stripe Checkout API + webhook, Orders admin, ProductDetail overlay, MerchShop rewrite (cart+checkout), CheckoutSuccess, legal pages (AGB/Widerrufsrecht), hash routing for checkout
- **Session 3 (Polish)**: NotificationToast CSS fix → theme tokens, ProductDetail lightbox (pinch-zoom, nav arrows), AdminOrders expandable detail (packing slip, Stripe link), CookieBanner backdrop, Impressum/Datenschutz rewrite → theme tokens, font polish (HeritageCrests, StoryAndBrew)
- **Session 4 (Bezugsquellen)**: Added "Bezugsquellen" eyebrow to ThreeDMap above map card + list panel, styled as gold `ribbon bg-accent` badge matching other section eyebrows
- **Session 5 (Cuckoo Brew Video)**: Optimized cuckoo-brewing explainer video (2.5→1.7MB via ffmpeg H.264 CRF 26), added gold "▶ Watch: How Cuckoo Brewing Works" button in StoryAndBrew.tsx, full-screen modal video player with timed subtitles (0-2s, 2-4s, 4-6s pause, 6-8s, 8-10s), fixed subtitle height jank with `min-h` placeholder

## Commands
```bash
npx tsc --noEmit      # typecheck
npx vitest run         # 46 tests
npm run build          # production build
# Dev: Terminal 1 → vercel dev --listen 3001 (API)
#      Terminal 2 → npm run dev (Vite frontend :3000, proxies /api/* → :3001)
# Admin: http://localhost:3000/#admin | API key: atzengold-admin-dev-key
```

## Git
- Branch: `main` (fast-forward merged from `code-quality-improvements`)
- Base: `c00a240` "Phase A: cleanup, i18n JSON files, build & test fixes"
- Not pushed
