# Design System

The token set below is the contract. Sections and snippets reference tokens, never raw values.

## Color tokens

Defined as CSS custom properties on `:root` in `assets/base.css` (Dawn's entry). Keep the set small — add a token only when a new semantic role appears, not per new shade.

| Token | Role | Value |
|---|---|---|
| `--ig-bg` | Default page background | _TBD_ |
| `--ig-surface` | Card / elevated surface | _TBD_ |
| `--ig-ink` | Primary text | _TBD_ |
| `--ig-ink-muted` | Secondary text | _TBD_ |
| `--ig-accent` | CTAs, links, focus | _TBD_ |
| `--ig-accent-ink` | Text on accent | _TBD_ |
| `--ig-line` | Dividers, borders | _TBD_ |
| `--ig-positive` | Savings, success | _TBD_ |
| `--ig-critical` | Errors, remove | _TBD_ |

Shopify color schemes in `settings_schema.json` should map onto these tokens rather than introducing a parallel set. Target **no more than 4** schemes: Light, Dark, Accent, Muted.

## Typography

| Role | Family | Weight | Size (desktop) | Line-height |
|---|---|---|---|---|
| Display | _TBD_ | | 56–72px | 1.05 |
| H1 | _TBD_ | | 40–48px | 1.1 |
| H2 | _TBD_ | | 28–32px | 1.2 |
| H3 | _TBD_ | | 20–22px | 1.3 |
| Body | _TBD_ | | 16px | 1.5 |
| Small | _TBD_ | | 13–14px | 1.45 |

Load fonts via Shopify `font_picker` in theme settings so merchants can't break the scale accidentally. Avoid more than two families.

## Spacing

Base unit: 4px. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96. No values off the scale.

Section vertical padding: desktop 96px top/bottom default, 64px compact, 48px mobile.

## Radii & elevation

- Radius: `--ig-radius-sm` 4px, `--ig-radius-md` 12px, `--ig-radius-lg` 24px. Pick one primary radius for the site — consistency beats variety.
- Shadow: one elevation level max, used sparingly on floating elements (sticky cart, dropdowns). No decorative shadows on cards.

## Motion

- Duration: 150ms for micro, 300ms for transitions, 600ms for reveals. Never exceed 600ms.
- Easing: `cubic-bezier(0.2, 0, 0, 1)` for enter, `cubic-bezier(0.4, 0, 1, 1)` for exit.
- Respect `prefers-reduced-motion` — all non-essential animation must short-circuit.

## Grid & layout

- Max container width: **1440px** (down from the old 1600px — denser, easier to photograph for).
- Gutter: 24px desktop, 16px mobile.
- Columns: 12 desktop, 6 tablet, 4 mobile.

## Breakpoints

| Name | Min width |
|---|---|
| `sm` | 480px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

Mobile-first. Write base styles for `sm` and layer up.
