---
title: Igniton Brand Standards
version: 1.0
date: 2026-04
source: Brand Guidelines · Typography & Color (PDF provided by client)
---

# Igniton — Brand Standards v1.0

## Color Palette

| Role         | Hex       | Usage share | Use for |
|--------------|-----------|-------------|---------|
| Pure White   | `#FFFFFF` | 55% | Primary background for all pages, cards, and content areas. The dominant color in every layout. |
| Navy         | `#121241` | 20% | All body text, headlines, nav, buttons, footers, and dark section backgrounds. |
| Indigo       | `#191880` | 10% | Hero accents, hover states, gradient overlays, dark section depth layer. |
| Gold (Ember) | `#B49153` | 10% | Accent only. Eyebrows, italic emphasis, CTAs, borders, stat numbers. |
| Warm Gray    | `#6B6660` | 5%  | Body copy, captions, metadata, secondary descriptive text. |

### Usage Rules

**Default — standard page layout**
White dominates all content areas. Navy for text and nav. Gold for **one accent per section** — eyebrow label, stat number, or CTA. Never use both navy and indigo as background on the same page section.

**Accent only — dark sections & hero bands**
Navy is the primary dark background. Indigo is used as a radial gradient overlay or secondary depth layer — never as a flat full-width block. Gold appears only as accent text or CTA buttons against dark backgrounds.

**Indigo — where to use it**
Hover states on navy buttons. Radial gradient overlays behind hero orbs. Active nav indicator. Gradient blend from navy in full-bleed headers. Never as body text color — contrast with white is insufficient for accessibility.

## Typography System

### Display Font — Playfair Display (Google Fonts, free)
- **H1** · weight 400 · 48–72px — "Think faster."
- **H2** · weight 400 · 32–40px — "Age slower."
- **Italic** — product names ("IgniCognition™")
- **Small caps** — section labels ("UNIVERSITY STUDIED")

### Body Font — Plus Jakarta Sans (Google Fonts, free)
- **Body** · weight 300 · 15–16px — "Clinically proven to improve memory and focus in 30 days."
- **Labels** · weight 500 · uppercase — "SHOP NOW", "SUBSCRIBE & SAVE", "30-DAY GUARANTEE"
- **Legal** · weight 400 · 11px — "These statements have not been evaluated by the FDA."

## Implementation in Theme

**Fonts are configured through Dawn's native Theme Settings → Typography panel** (`settings.type_header_font` / `settings.type_body_font`). The theme uses Dawn's `--font-heading-family` and `--font-body-family` CSS variables everywhere — no hardcoded `font-family` in custom sections. Change the font in Shopify admin once and every section picks it up.

**Colors** are exposed as tokens on `:root` in `base.css`:
- `--ig-ink: #121241` (navy)
- `--ig-ember: #b49153` (gold)
- `--ig-muted: #6b6660` (warm gray)
- `--ig-warm-white: #fdfaf5`

Section-level color scheme selection is handled via Shopify's built-in color schemes (Theme Settings → Colors) and the `color_scheme` setting exposed on each Igniton section.

## Source PDF
`docs/igniton-brand-guidelines.pdf` (authoritative — this file is a derived summary).
