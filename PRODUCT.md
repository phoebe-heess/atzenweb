# Atzengold Web — Product Guide

## Overview

A marketing/webshop/B2B website + admin CMS for Atzengold Kellerbier (Franconia x Berlin).
Built with React + TypeScript + Vite, hosted on Vercel with Upstash Redis for data storage.

## User Audiences

1. **Beer enthusiasts** — discovering the brand, reading the story, finding stockists, browsing merch, connecting on social.
2. **Gastronomy professionals (B2B)** — bar/restaurant owners evaluating the product, submitting enquiries to stock Atzengold.

---

## Account Setup Guide

To get the site fully running, the client needs to create **one account** and optionally a second one for future features.

### 1. Resend (Email Delivery) — Required

Resend handles email delivery for newsletter signups and B2B enquiries.

**Step-by-step:**

1. Go to https://resend.com and sign up (free tier: 100 emails/day)
2. Verify a domain you own (e.g. `atzengold.de`) — this will be the "from" address
   - If you don't have a domain yet, you can use the testing address `onboarding@resend.dev` (emails will show "from" that address)
3. Once signed in, go to **API Keys** in the left sidebar
4. Click **Create API Key** → name it `atzengold-web`
5. Copy the key (starts with `re_`)
6. Go to https://atzengold.vercel.app/#admin → login with the admin key
7. Navigate to **Settings** in the sidebar
8. Paste the key into the **Resend API Key** field → **Save Settings**

**To change the recipient email** (where submitted forms land):
- Currently set to `soundofnairobi@gmail.com` in `api/send-email.ts:95`
- Update the `to` field there and re-deploy

### 2. Instagram Feed — Optional

The site has an Instagram feed section on the homepage (currently shows mock data).
To connect a real Instagram feed:

**Step-by-step:**

#### Option A: Meta Graph API (recommended for business accounts)

1. Go to https://developers.facebook.com/ → **My Apps** → **Create App**
2. Choose **Business** type → name it `Atzengold Web`
3. Add the **Instagram Graph API** product
4. Link your Instagram business/creator account
5. Generate a **long-lived access token** (starts with `EAAC...`)
6. Copy the token → paste into Admin > **Settings** > Instagram Access Token
7. The token lasts ~60 days — set a calendar reminder to refresh it

#### Option B: Third-party widget (easier, no coding)

Use a service like **Elfsight**, **Yotpo**, or **SnapWidget**:
1. Get an embed code/API key from the widget service
2. The developer can integrate it into the Instagram section later

### 3. Stripe (Webshop Payments) — Required for Merch Shop

Stripe handles payment processing for the merch shop checkout. Customers pay via Stripe Checkout and are redirected back to the site after payment.

**Step-by-step:**

1. Go to https://stripe.com → sign up (or log in)
2. From the Stripe Dashboard sidebar → **Developers** → **API Keys**
3. Copy the **Secret Key** (`sk_live_...` for production or `sk_test_...` for testing)
4. Go to https://atzengold.vercel.app/#admin → login with the admin key
5. Navigate to **Settings** in the sidebar
6. Paste the key into the **Stripe Secret Key** field → **Save Settings**

**Stripe Webhook (for automatic order status updates):**

The webhook endpoint is at `https://atzengold.vercel.app/api/stripe-webhook`. To configure it:

1. In Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://atzengold.vercel.app/api/stripe-webhook`
3. Select event: `checkout.session.completed`
4. Click **Add endpoint**
5. Reveal the **Signing Secret** (`whsec_...`) and add it as an environment variable:
   - Go to Vercel project → **Settings** → **Environment Variables**
   - Add `STRIPE_WEBHOOK_SECRET` with the signing secret value
   - Re-deploy the project

> **Note:** The webhook updates order status from `pending` to `paid` when Stripe confirms successful payment. Without the webhook, orders remain as `pending` and need manual status updates via Admin > Orders.

**Testing with Stripe test mode:**

1. Use a **test** Secret Key (`sk_test_...`) in Admin Settings
2. Use the test card number `4242 4242 4242 4242` with any future expiry date and any CVC
3. For webhook testing, use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe-webhook`

**DHL Shipping (Germany only):**

- Flat rate: €4.90
- Free shipping for orders over €50.00
- Shipping addresses restricted to Germany (`allowed_countries: ['DE']`)
- Delivery via DHL GoGreen (climate-neutral)
- Delivery time: 2-4 business days

---

## Admin Access

| Item | Value |
|------|-------|
| URL | `https://atzengold.vercel.app/#admin` |
| Login | API key set during deployment (ask your developer) |
| Shortcut | `Alt + A` from any page |

### Admin Sections

| Section | What it does |
|---------|-------------|
| Dashboard | Overview of all collections |
| Venues | Add/edit stockist locations (bars, shops, restaurants) |
| Story | Edit brand narrative timeline chapters |
| Merch | Manage shop items (name, price, images, sizes, options, description) |
| Orders | View and manage customer orders, update status (pending → paid → shipped → cancelled) |
| Testimonials | Customer reviews (add in DE, EN, or de-BY) |
| Beer Profile | Flavor gauges, ABV, IBU, characteristics |
| Brand Hub | Brand colors, values, mission description |
| Brand Guidelines | Extended brand guideline document viewer |
| Translations | View and edit DE/EN translation overrides with DeepL auto-translate |
| Settings | **API keys** — Resend, Instagram, Stripe |

---

## Content Management

### Venues
Each venue has: name, address, longitude/latitude (pin on map), type (Bar/Restaurant/Shop), optional food/dog-friendly tags, and a notes field.

### Merch
Each item has: name, price, description, multiple images (upload via Vercel Blob or paste URL), category, optional sizes (S/M/L/XL), and optional custom options (e.g. color). Visitors can add items to cart, view product details with image gallery, and pay via Stripe Checkout.

### Orders
Orders are created automatically when a customer completes Stripe Checkout. Each order stores: customer name/email/address, items purchased, subtotal/shipping/total, Stripe session ID, and status (`pending` → `paid` → `shipped` → `cancelled`). Orders can be updated manually in Admin > Orders or automatically via the Stripe webhook (`checkout.session.completed` → status set to `paid`).

### Testimonials
Add reviews with: author name, role text, quote/body, star rating (1-5), and language tag. The site displays them in a rotating carousel filterable by language.

---

## Technical Details (for reference)

- **Hosting**: Vercel (Hobby plan, free)
- **Database**: Upstash Redis via Vercel KV (free tier, 10 MB)
- **Domain**: Ask your developer to configure a custom domain in Vercel project settings
- **Map**: Maplibre GL — free, no API key needed. Venue coordinates (longitude/latitude) are stored with each venue
- **Admin auth**: Bearer token from `ADMIN_API_KEY` environment variable
- **i18n**: German (DE), English (EN), Bavarian (de-BY) — switchable via language selector
- **Dark/Light mode**: Toggle in footer
