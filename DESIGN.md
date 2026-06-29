---
version: "alpha"
name: SONI Portfolio
description: >
  Visual identity for Võ Quang Minh (SONI) — Event & Brand Photographer
  based in Đà Lạt, Vietnam. The design system blends cinematic darkness
  with warm gold accents, evoking premium editorial and fine-art photography.

colors:
  background:      "#050505"
  surface:         "#0d0d0d"
  surface-raised:  "rgba(255, 255, 255, 0.025)"
  primary:         "#ffffff"
  secondary:       "rgba(255, 255, 255, 0.52)"
  muted:           "rgba(255, 255, 255, 0.28)"
  accent:          "#D4AF37"
  accent-hover:    "rgba(212, 175, 55, 0.10)"
  accent-glow:     "rgba(212, 175, 55, 0.18)"
  border:          "rgba(255, 255, 255, 0.09)"
  border-accent:   "rgba(212, 175, 55, 0.45)"
  overlay-dark:    "rgba(0, 0, 0, 0.75)"
  selection-bg:    "#D4AF37"
  selection-text:  "#050505"

typography:
  display:
    fontFamily: Amulya
    fontWeight: 900
    fontSize: "clamp(3.5rem, 12vw, 9rem)"
    lineHeight: 0.9
    letterSpacing: "-0.02em"
    textTransform: uppercase
  h1:
    fontFamily: Cormorant Garamond
    fontWeight: 700
    fontStyle: italic
    fontSize: "clamp(1.6rem, 4vw, 2.6rem)"
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  h2:
    fontFamily: Be Vietnam Pro
    fontWeight: 600
    fontSize: "clamp(1.3rem, 3vw, 2rem)"
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body-md:
    fontFamily: Be Vietnam Pro
    fontWeight: 400
    fontSize: 0.9375rem
    lineHeight: 1.65
  body-sm:
    fontFamily: Be Vietnam Pro
    fontWeight: 400
    fontSize: 0.8125rem
    lineHeight: 1.6
  label-caps:
    fontFamily: Be Vietnam Pro
    fontWeight: 500
    fontSize: 0.625rem
    letterSpacing: "0.22em"
    textTransform: uppercase
  label-xs:
    fontFamily: Be Vietnam Pro
    fontWeight: 400
    fontSize: 0.5625rem
    letterSpacing: "0.14em"
    textTransform: uppercase

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 1.35rem
  full: 9999px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  section: "clamp(4rem, 8vw, 8rem)"

components:
  nav-island:
    backgroundColor: "rgba(5, 5, 5, 0.72)"
    backdropFilter: "blur(20px) saturate(160%)"
    border: "0.5px solid {colors.border}"
    borderRadius: "{rounded.full}"
    height: 52px
    padding: "0 1.5rem"
  nav-link:
    typography: "{typography.label-caps}"
    color: "{colors.secondary}"
    color-hover: "{colors.primary}"
    underlineColor: "{colors.accent}"
  nav-cta:
    color: "{colors.accent}"
    border: "0.5px solid {colors.border-accent}"
    borderRadius: "{rounded.full}"
    padding: "0.42rem 1.1rem"
    color-hover: "{colors.primary}"
    backgroundColor-hover: "{colors.accent-hover}"
  button-primary:
    backgroundColor: "rgba(212, 175, 55, 0.08)"
    textColor: "{colors.accent}"
    border: "0.5px solid {colors.border-accent}"
    borderRadius: "{rounded.full}"
    padding: "0.75rem 2.25rem"
    typography: "{typography.label-caps}"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    border: "0.5px solid {colors.accent}"
  card-project:
    backgroundColor: "{colors.surface}"
    borderRadius: "{rounded.sm}"
    overlayGradient: "linear-gradient(160deg, rgba(212,175,55,0.15) 0%, rgba(0,0,0,0.75) 100%)"
  card-tag:
    backgroundColor: "rgba(212, 175, 55, 0.08)"
    border: "0.5px solid rgba(212, 175, 55, 0.28)"
    textColor: "rgba(255, 255, 255, 0.78)"
    typography: "{typography.label-xs}"
    padding: "0.18rem 0.5rem"
  glass-surface:
    backgroundColor: "rgba(5, 5, 5, 0.72)"
    backdropFilter: "blur(20px)"
    border: "0.5px solid {colors.border}"
  hero-social-icon:
    size: 19px
    color: "rgba(255, 255, 255, 0.72)"
    color-hover: "{colors.primary}"
    fill: currentColor
  hero-social-icon-hover:
    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.8))"
    transform: "scale(1.18)"
  scrollbar:
    width: 2px
    backgroundColor: "{colors.background}"
    thumbColor: "{colors.accent}"
---

## Overview

**Cinematic Darkness meets Artisan Gold.** SONI's visual identity is built on deep,
near-black backgrounds lit by a single warm gold accent — evoking the feeling of a
high-end photography exhibition or a premier film credit sequence. Every element
prioritizes clarity, restraint, and premium craft.

The palette is intentionally minimal: one rich background, one luminous accent, and a
hierarchy of white opacities that guide the eye without competing with the photography
itself. The photography is always the star — the UI is its frame.

## Colors

The palette is anchored in an almost-black foundation (`#050505`) with a single
precious-metal accent.

- **Background (`#050505`):** Near-black, richer than pure black — creates depth without harshness.
- **Surface (`#0d0d0d`):** Slightly lifted surface for cards and secondary panels.
- **Primary (`#ffffff`):** Pure white for headlines and high-priority text.
- **Secondary (`rgba(255,255,255,0.52)`):** Mid-opacity white for body copy, descriptions, and secondary labels.
- **Muted (`rgba(255,255,255,0.28)`):** Low-opacity white for hints, placeholders, dividers.
- **Accent / Gold (`#D4AF37`):** The sole warm color in the system. Used exclusively for
  interactive elements, hover states, active underlines, scrollbar thumb, and calls-to-action.
  This is "Soni Gold" — the signature of the brand.
- **Border (`rgba(255,255,255,0.09)`):** Hairline borders on glass surfaces and cards.
- **Border Accent (`rgba(212,175,55,0.45)`):** Gold-tinted borders on interactive components.

> **Rule:** Never use the accent gold for decorative or passive elements.
> It signals "interact here" or "this is important". Overuse destroys the brand's sense of restraint.

## Typography

The type system uses three typefaces, each assigned a distinct role:

- **Amulya (Display/Hero):** Used only for the hero name "SONI". Weight 900, tight tracking,
  uppercase. Conveys power and identity.
- **Cormorant Garamond Italic (Editorial H1):** Serif italic for section headlines. Suggests
  editorial finesse, film credits, and timeless craft.
- **Be Vietnam Pro (UI/Body):** A clean Vietnamese-supporting sans-serif for all UI labels,
  nav, body copy, and metadata.

**Scale Rationale:**
- Hero display is responsive (`clamp`-based) so the name always commands the viewport width.
- Nav labels use `0.22em` letter-spacing uppercase at `10px` — tight enough for sophistication,
  spaced enough for readability at scale.
- Body sits at `15px / 1.65` — optimized for Vietnamese diacritics and long-form reading.

## Layout

The layout system is based on **full-viewport sections** with a centered, constrained content column.

- **Max content width:** `880px` for nav, `1280px` for content grids.
- **Section padding:** `clamp(4rem, 8vw, 8rem)` vertical padding on all major sections.
- **Grid:** 12-column fluid grid at desktop, single-column on mobile.
- **Hero:** Always full viewport height (`100svh`), centered content, Galaxy WebGL background.
- **Gallery:** Horizontal scroll with sticky positioning, full-bleed card panels.

The nav floats as an island above content (`position: fixed`) with `backdrop-filter: blur(20px)`
to maintain legibility over any background.

## Elevation & Depth

Depth is created through **backdrop blur, gradient overlays, and border opacity** — never
hard drop shadows except for interactive feedback.

| Level | Usage | Style |
|:------|:------|:------|
| 0 — Base | Page background | `#050505`, flat |
| 1 — Surface | Cards, panels | `#0d0d0d` + hairline border |
| 2 — Float | Nav island, modals | `rgba(5,5,5,0.72)` + `blur(20px)` |
| 3 — Overlay | Image hover overlay | gradient + opacity transition |
| Glow | Active / hover state | `drop-shadow(0 0 8px rgba(255,255,255,0.8))` |

## Shapes

- **Pill (`9999px`):** Used for nav island, all buttons, all tags/badges.
- **Rounded-sm (`4px`):** Project cards, media containers.
- **Rounded-lg (`1.35rem`):** Mobile dropdown menus, modal panels.
- **Sharp (`0px`):** Gallery cards (full-bleed, edge-to-edge).

## Components

### Navigation Island
A floating pill nav centered at the top of the viewport. Background is a semi-transparent
dark glass (`rgba(5,5,5,0.72)`) with `blur(20px)`. Links are `label-caps` style at 10px.
The CTA button ("CONTACT") uses the accent gold as text and border.

### Hero Section
Full-bleed WebGL Galaxy background (OGL-based particle field, hue 165°, low saturation).
The name "SONI" is rendered in Amulya 900 at max display size. Below the name: social icon
row (filled SVGs, 19px, white 72% opacity) separated by bullet dots. A single pill CTA
("Xem CV") sits below.

### Project Cards
Dark `#0d0d0d` base with image fills. On hover: a `160deg` gradient overlay (D4AF37 → black)
fades in; a tag strip slides up from the bottom with skill labels in border-accent pill badges.

### Social Icons
Filled SVG icons at 19px. Default: `rgba(255,255,255,0.72)`. Hover: pure white + white glow
`drop-shadow`. Scale up `1.18x` on hover. Separated by small bullet dots at 7px.

### Gallery Cards
Full-width panels in a horizontal scroll container. Each card covers 100vw. Background images
use `object-fit: cover`. Phase name in large display type; description in secondary white.

### Contact Cards
Glassmorphic cards (`rgba(5,5,5,0.72)` + `blur(20px)`) with hairline borders. Inner content
uses the standard typography hierarchy.

## Do's and Don'ts

### Do
- Use `#D4AF37` only for interactive signals: hover states, active indicators, CTA borders,
  scrollbar, selection highlight.
- Use `backdrop-filter: blur(20px)` for any floating/elevated surface.
- Apply `0.5px` border widths — hairline borders feel premium; thick borders feel heavy.
- Use `clamp()` for all font sizes and spacing that should be fluid across viewport sizes.
- Use `Be Vietnam Pro` for all UI text — it has excellent Vietnamese diacritic support.
- Keep gallery imagery as the focal point; reduce UI chrome to minimum within gallery sections.
- Respect `prefers-reduced-motion` by disabling animations for users who request it.

### Don't
- Never use the gold accent for decorative or passive elements. It must always carry meaning.
- Never use `box-shadow` with colored shadows — only `rgba(0,0,0,x)` or white glows for feedback.
- Never use more than 3 font families on any single page.
- Never place text directly on a photographic image without an overlay or backdrop.
- Never use white at full opacity (`#ffffff`) for body text — use `rgba(255,255,255,0.88)` or
  lower to preserve hierarchy.
- Never use pure blue, red, or green anywhere in the UI — the gold is the only chromatic color.
