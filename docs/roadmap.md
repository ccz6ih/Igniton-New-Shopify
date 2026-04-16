# Roadmap

## Phase 0 — Foundations (current)

- [ ] Lock brand decisions in [brand.md](brand.md) (palette, type, motion personality).
- [ ] Fill in token values in [design-system.md](design-system.md).
- [ ] Replace Dawn's default color schemes with the new 4-scheme set in `config/settings_schema.json`.
- [ ] Set up `shopify theme dev` against staging theme.
- [ ] Create `assets/base.css` token layer.

## Phase 1 — Core templates

- [ ] Home: hero, feature rows, science strip, testimonials, founder letter, FAQ, newsletter.
- [ ] Product detail with subscription toggle.
- [ ] Collection grid with filtering.
- [ ] Cart drawer with discount/gift mechanics.
- [ ] Global header + footer.

## Phase 2 — Conversion layer

- [ ] Bundle builder.
- [ ] Upsell slot in cart.
- [ ] Quiz → product recommendation.
- [ ] Subscription management UI (if not handled by the subscription app).

## Phase 3 — Content depth

- [ ] Blog / science articles.
- [ ] Ingredient deep-dive pages.
- [ ] Compare table (Igniton vs. category).
- [ ] About / founder story page.

## Launch gates

Before flipping the theme live:

- [ ] All Phase 1 templates signed off by design + founder.
- [ ] Full checkout tested with real payment.
- [ ] Subscription signup tested end-to-end.
- [ ] Mobile Lighthouse ≥ 85 on Home, PDP, Collection.
- [ ] Klaviyo flows fire correctly on signup and abandoned cart.
- [ ] 301 redirects from old theme URLs in place.
- [ ] GA4 / Meta pixel / any other tracking verified in tag assistant.
