# Sections & Templates

## Principles

1. **One section, one job.** If a section has more than ~8 blocks or branches on layout variant, split it.
2. **Schema is the API.** Merchants configure via the theme editor — no "edit the Liquid file" instructions in the handoff.
3. **No duplicate sections.** Before adding a new one, check if an existing section needs a block or setting instead.

## Launch set (Phase 1)

Sections needed to ship the homepage, PDP, collection, and cart. Every other section comes later.

| Section | Template | Status | Notes |
|---|---|---|---|
| Hero | index | not started | Headline, sub, primary CTA, optional secondary CTA, bg image/video |
| Product feature row | index | not started | Image + copy + CTA, alternating L/R |
| Science / claims strip | index | not started | 3–4 stats with source footnotes |
| Bundle/product grid | index, collection | not started | Reuses `product-card` snippet |
| Testimonials | index | not started | Source-linked quotes, avatar optional |
| Founder letter | index | not started | Long-form block with signature |
| FAQ | index, product | not started | Accordion, schema.org markup |
| Newsletter | footer/index | not started | Klaviyo-connected form |
| Product detail | product | not started | Image gallery, buy box, subscribe toggle, accordion |
| Cart drawer | global | not started | Gift/discount, upsell slot |
| Collection grid | collection | not started | Filters: product type, goal |

## Reused snippets

| Snippet | Purpose |
|---|---|
| `product-card.liquid` | Used in collection, recommendations, upsell |
| `price.liquid` | Handles regular, sale, subscription pricing |
| `button.liquid` | Single source of truth for CTA styling |
| `icon-*.liquid` | Inline SVG icons, no sprite sheet |

## Deferred (Phase 2+)

Blog, compare table, ingredient deep-dive, quiz, account area customizations, B2B gating.
