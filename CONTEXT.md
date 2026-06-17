# Atzengold Web — Session Context

## What We Built
A full marketing/webshop/B2B website + admin CMS for the Atzengold Kellerbier brand (Franconia x Berlin).

## Current State
- All frontend components done: Age Gate, Cookie Banner, 3D Stockist Map (Maplibre GL), Story/Brew timeline, Merch Shop (with cart), B2B Portal, Brand Hub, Instagram Feed (mocked), Newsletter, Testimonials, Language Switcher
- Full admin CMS: Login (API key), Dashboard, Generic CRUD + 8 editors (Venues, Story, Merch, Testimonials, Beer Profile, Brand Hub, Translations, Settings) — all backed by Vercel KV
- 8 API endpoints + seed endpoint + email endpoint (Resend) + upload endpoint + translations endpoint
- 46 unit tests passing, TypeScript clean, build succeeds
- i18n: 91 translation keys across DE/EN/de-BY locales
- **Image upload** — Vercel Blob store `atzengold-images` connected, `BLOB_READ_WRITE_TOKEN` in `.env.local`
- **Auto-compression** — Uploaded images converted to WebP, resized to max 800px, compressed to ≤100KB via sharp
- **Admin image guidelines** — `imageConfig` prop on AdminCrud fields, per-collection hints shown in form
- 5 public components wired to live API data with static JSON fallbacks
- **Translation editor** — Admin UI for DE↔EN with DeepL auto-translate, manual override tracking, KV-backed
- Dev workflow: two processes (Vercel API on 3001, Vite on 3000)

## Next Things To Do
1. Add `RESEND_API_KEY` to admin Settings for email delivery
2. Add production `ADMIN_API_KEY` env var
3. Wire custom i18next backend (`translations-backend.ts`) into `i18n.ts` to serve KV overrides at runtime
4. Remove or ignore `de-BY` locale (client only needs DE + EN)

## Running Locally
- **Terminal 1**: `vercel dev --listen 3001` — API server (serverless functions)
- **Terminal 2**: `npm run dev` — Vite frontend on port 3000, proxies `/api/*` to 3001
- `npm run build` → succeeds (CSS warnings are pre-existing Tailwind v4 issues, non-blocking)
- `npx vitest run` → 46 tests pass
- `npx tsc --noEmit` → clean

## Key Files Modified (Current Session — Cuckoo Brew Video)
- **New files**: (none)
- **Modified files**:
  - `src/components/StoryAndBrew.tsx` — Added gold "▶ Watch" button, full-screen video modal, timed subtitle state, fixed subtitle height jank
- **New assets**:
  - `public/videos/atzengold-cuckoo-brewing.mp4` — Optimized H.264 (1.7MB, 1280x720, 10s)
  - `public/videos/atzengold-cuckoo-brewing-original.mp4` — Original backup (2.5MB)

## Admin Access
- URL: `http://localhost:3000/#admin`
- Shortcut: `Alt+A`
- Dev API key: `atzengold-admin-dev-key`
- Footer has "Admin" link (visible after age gate)
- Settings page for API keys (Resend, DeepL, Instagram, Stripe) stored in KV

## Git
- Branch: `main` (fast-forward merged from `code-quality-improvements`)
- Not pushed to remote
