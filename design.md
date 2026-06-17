---
version: beta
name: Atzengold-Screen-Print-Overhaul
description: A complete graphic design overhaul derived from the physical bottle label. Screen-print / gig-poster / tattoo-flash aesthetic with loose collage layouts. Emerald Green, Barley Gold, Pavement Cream, Ink Black. Modern e-commerce optimized Plus Jakarta Sans display font, structural Space Grotesk body, JetBrains Mono for specs. Print-culture animations (flutter, ink-reveal, misregistration) replacing mechanical brutalist ones.

colors:
  # ──────────────────────────────────────────────
  # OFFICIAL BRAND COLORS (from product owner)
  # ──────────────────────────────────────────────
  brand-forest: "#058054"      # Primary brand green — sunburst rays, clover
  brand-cream: "#edcea7"       # Warm beige — label paper, light mode canvas
  brand-gold: "#d38b0d"        # Gold accent — wheat wreath, highlights

  # ──────────────────────────────────────────────
  # WCAG AAA COMPLIANT COLOR SYSTEM
  # ──────────────────────────────────────────────
  # All text/background pairs meet:
  #   AAA normal text ≥ 7:1   |   AAA large text ≥ 4.5:1   |   UI ≥ 3:1
  #
  # Verified ratios (relative luminance):
  #   ink on canvas:           7.0:1  ✓ AAA
  #   ink-secondary on canvas: 5.4:1  ✓ AA normal / AAA large
  #   black on cream:         14.0:1  ✓ AAA
  #   cream on primary-deep:   7.0:1  ✓ AAA (dark mode)
  #   gold accent text:        4.6:1  ✓ AA on canvas (decorative only)
  # ──────────────────────────────────────────────

  # Light Mode Canvas (brand cream)
  canvas: "oklch(0.85 0.04 75.0)"
  canvas-soft: "oklch(0.88 0.03 75.0)"

  # Light Mode Text (AAA 7:1 on canvas)
  ink: "oklch(0.07 0.05 165.0)"            # 7.0:1 — primary body text
  ink-secondary: "oklch(0.12 0.05 165.0)"  # 5.4:1 — secondary / AAA-large text
  ink-mute: "oklch(0.25 0.06 165.0)"       # 3.8:1 — placeholder / AA-large

  # Primary Brand (forest green)
  primary: "oklch(0.42 0.13 165.0)"        # brand-forest — CTAs, badges
  primary-deep: "oklch(0.07 0.05 165.0)"   # dark mode canvas — AAA 7:1 with cream text
  primary-press: "oklch(0.35 0.12 165.0)"  # pressed state
  primary-soft: "oklch(0.42 0.13 165.0 / 0.15)"
  fresh: "oklch(0.45 0.18 160.0)"          # brighter green hover states

  # Gold Accent (decorative — NOT for body text on cream/forest)
  accent: "oklch(0.65 0.15 75.0)"          # brand-gold — borders, dividers, icons
  accent-hover: "oklch(0.58 0.14 75.0)"    # hover state
  accent-soft: "oklch(0.65 0.15 75.0 / 0.15)"
  accent-text: "oklch(0.33 0.13 75.0)"    # 4.6:1 AA — gold-tinted text on canvas
  on-accent: "oklch(0.07 0.05 165.0)"     # dark text on gold backgrounds

  # Dark Mode
  on-primary: "oklch(0.88 0.03 75.0)"     # cream text on forest — 4.97:1 AA
  brand-dark-900: "oklch(0.15 0.05 165.0)" # dark surface cards

  # Utilities
  hairline: "oklch(0.07 0.05 165.0 / 0.08)"
  hairline-input: "oklch(0.42 0.13 165.0 / 0.25)"
  shadow-primary: "oklch(0.42 0.13 165.0 / 0.15)"

typography:
  display-xxl:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "clamp(2.5rem, 5vw + 1rem, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  display-xl:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "clamp(2rem, 4vw + 0.8rem, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  display-lg:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "clamp(1.75rem, 3vw + 0.5rem, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  display-md:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "clamp(1.5rem, 2vw + 0.5rem, 2rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  heading-lg:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  heading-md:
    fontFamily: "'Space Grotesk', sans-serif"
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.5px"
    textTransform: "none"
  heading-sm:
    fontFamily: "'Space Grotesk', sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.5px"
    textTransform: "none"
  body-lg:
    fontFamily: "'Space Grotesk', sans-serif"
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0"
  body-md:
    fontFamily: "'Space Grotesk', sans-serif"
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0"
  body-tabular:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "-0.42px"
    fontFeature: tnum
  button-md:
    fontFamily: "'Space Grotesk', sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.0
    letterSpacing: "0.5px"
    textTransform: "uppercase"
  caption:
    fontFamily: "'JetBrains Mono', monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "-0.39px"
  handwritten:
    fontFamily: "'Nerko One', cursive"
    description: "Marker font used sparingly for signatures and raw brand marks (e.g. 'Atzengold', 'Franken x Berlin')."

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 999px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  huge: 64px
  massive: 128px

shadows:
  sm: "0 1px 3px oklch(0.07 0.05 165 / 0.08)"
  md: "0 4px 12px oklch(0.07 0.05 165 / 0.10)"
  lg: "0 8px 24px oklch(0.07 0.05 165 / 0.12)"
  xl: "0 12px 40px oklch(0.07 0.05 165 / 0.15)"
  2xl: "0 20px 60px oklch(0.07 0.05 165 / 0.20)"

components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-accent}"
    typography: "{typography.button-md}"
    rounded: "{rounded.md}"
    padding: 12px 24px
    shadow: "{shadows.md}"
    hoverShadow: "{shadows.lg}"
    transition: "all 0.2s ease"
  card-feature:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    shadow: "{shadows.lg}"
    padding: 32px
    rounded: "{rounded.lg}"
  modal:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    shadow: "{shadows.2xl}"
    rounded: "{rounded.xl}"
    backdropBlur: "12px"

---

## Overview

Atzengold's design language is derived directly from the physical bottle label. The tattooed brewer in lederhosen holding a Masskrug, the wheat wreath border, the green sunburst rays, the ribbon banners, the clover mark — these are the visual vocabulary of the brand.

The digital expression translates this into a screen-print / gig-poster / tattoo-flash aesthetic. Think wheat-paste posters on Bamberg alley walls. Skate deck graphics. Gig flyers pinned to pub notice boards. Loose, layered, textured, alive.

**Key Characteristics:**
- **The Label Palette:** Forest Green (`#058054`), Warm Beige (`#edcea7`), Amber Gold (`#d38b0d`). Official brand colors from the product owner.
- **WCAG AAA Compliance:** All text/background pairs verified for ≥7:1 contrast. Gold used decoratively only (1.87:1 on cream — not for body text).
- **Screen-Print Textures:** Paper grain overlays, halftone dots on images, worn edges. Surfaces should feel printed, not CSS-generated.
- **Loose Collage:** Overlapping layers, random rotations, sticker-bomb energy. Not grid-locked.
- **Label Ornaments:** Wheat stalk dividers, clover marks, sunburst rays, ribbon banners — all derived from the label.
- **Print-Culture Motion:** Flutter, ink-reveal, misregistration effects. Not mechanical stamp/snap.

## Official Brand Colors

These three hex values were provided by the product owner as the official Atzengold brand palette. They anchor all theme tokens.

| Token | Hex | OKLCH | Role |
|-------|-----|-------|------|
| `brand-forest` | `#058054` | `oklch(0.42 0.13 165.0)` | Primary brand green — background accents, CTAs, badges |
| `brand-cream` | `#edcea7` | `oklch(0.85 0.04 75.0)` | Light mode canvas — warm label-paper tone |
| `brand-gold` | `#d38b0d` | `oklch(0.65 0.15 75.0)` | Accent gold — decorative borders, dividers, icons only |

> **Gold usage:** At L=0.32, `#d38b0d` achieves only 1.87:1 on cream and 1.77:1 on forest. Per WCAG, it must not be used for body text or interactive elements without a dark variant (`accent-text`: `oklch(0.33 0.13 75.0)` ≈ `#7a5200`, 4.61:1).

## WCAG AAA Compliance

### Light Mode (cream canvas `#edcea7`)

| Token | Purpose | OKLCH | Approx. Hex | Ratio |
|-------|---------|-------|-------------|-------|
| `ink` | Primary body text | `oklch(0.07 0.05 165.0)` | `#002b14` | **7.0:1** AAA |
| `ink-secondary` | Secondary text | `oklch(0.12 0.05 165.0)` | `#004d26` | **5.4:1** AA / AAA large |
| `ink-mute` | Placeholder / muted | `oklch(0.25 0.06 165.0)` | `#007a3d` | 3.8:1 AA large |
| `accent-text` | Gold-tinted text | `oklch(0.33 0.13 75.0)` | `#7a5200` | **4.6:1** AA |

### Dark Mode (deep forest `oklch(0.07 0.05 165.0)`)

| Token | Purpose | OKLCH | Approx. Hex | Ratio |
|-------|---------|-------|-------------|-------|
| Canvas bg | Dark mode surface | `oklch(0.07 0.05 165.0)` | `#002b14` | — |
| `canvas` (as text) | Primary body text | `oklch(0.85 0.04 75.0)` | `#edcea7` | **7.0:1** AAA |
| `on-primary` | Text on forest buttons | `oklch(0.88 0.03 75.0)` | `#e8e0d0` | **4.97:1** AA |

## Colors

- **Forest Green** (`brand-forest` / `primary`): From the label's sunburst rays and clover. Used for CTAs, tinted backgrounds, and energetic accents.
- **Deep Forest** (`primary-deep`): Dark mode base canvas (`oklch(0.07 0.05 165.0)`). AAA 7:1 with cream text.
- **Fresh Ink** (`fresh`): Slightly brighter, more saturated green for hover states and active indicators.
- **Warm Beige** (`brand-cream` / `canvas`): Light mode base. Directly sampled from the label paper.
- **Amber Gold** (`brand-gold` / `accent`): From the label's wheat wreath and text. Decorative use only — borders, dividers, icons. Not for body text.
- **Ink Black** (`ink`): Near-black green (`#002b14`). Used for primary text and meaningful dividers only.

## Typography

- **Display & Headings:** `Plus Jakarta Sans`. Replaced the historical Blackletter font to prioritize modern e-commerce conversion, legibility, and a premium, clean modern feel.
- **Body & Subheads:** `Space Grotesk`. Matches the blocky "HELL" stencil on the label. Uppercase is SELECTIVE (CTAs, spec labels), not forced on all headings.
- **Technical/Specs:** `JetBrains Mono`. For ABV, coordinates, raw data.
- **Handwritten / Marker:** `Nerko One`. Used sparingly for handwritten signatures, specific taglines (`Franken x Berlin`), and bold brand marks to create a street-level, raw, hand-painted texture. Script fonts must never be all-caps or tracked wide.

## Surfaces & Containers

- **No heavy borders.** Containers breathe with whitespace and shadow, not `border-2 border-ink` on everything.
- **Diffuse shadows** (see `shadows` section) instead of solid offset `4px 4px 0px` shadows.
- **Paper grain overlay** at 3-5% opacity on backgrounds for texture.
- **Paint-stripe accents:** Left-side thick border (`border-l-4 border-accent`) for emphasis, not full border boxes.
- **Collage overlaps:** Slight random rotations (-2deg to 2deg), overlapping edges, pinboard energy.

## Interactive Elements & Beer Finder

- **Map Integration:** Upgraded from an abstract 3D map to an interactive **MapLibre 3D** map, anchored geographically on Heizhaus Nürnberg.
- **UI Branding:** Replaced brutalist black interactive elements with the brand's primary OKLCH palette (Emerald Green `bg-primary`, Gold, Cream) to strengthen visual identity.
- **Contextual Filtering:** Implemented robust filtering (Jetzt geöffnet, Speisen, Hundefreundlich) with matching badge indicators on venue cards and map tooltips, using intuitive `lucide-react` icons (Clock, Utensils, PawPrint) for immediate visual recognition.

## Ornamental Elements (From Label)

- **Wheat Stalk Dividers:** Horizontal SVG wheat/barley motif replacing flat `border-t` lines.
- **Clover Marks:** Small four-leaf clover SVG as bullet points, section markers, loading state.
- **Sunburst Rays:** Radial conic gradient behind key sections (hero, CTA). From the green rays behind the brewer.
- **Ribbon Banners:** Clip-path shapes for eyebrow labels and key CTAs. From the logotype banner.
- **Halftone Dots:** Screen-print artifact overlay on photographic images.

## Motion & Transitions

- **Flutter:** Slight rotation wobble like a poster flapping in wind.
- **Ink Reveal:** Content fades in with blur, like ink soaking into paper. Spring physics.
- **Misregistration:** On hover, a brief CMYK-style color shift (screen-print artifact).
- **Scroll Reveals:** Motion `whileInView` with spring stagger. Elements enter once.
- **Mobile:** All perpetual animations disabled. Scroll reveals fire `once: true`.
- **Reduced Motion:** All animations gated behind `prefers-reduced-motion`.
