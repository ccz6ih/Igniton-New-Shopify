# Page Sections Build Plan

> **Status:** v1.0 — 2026-04-19
> **Scope:** Build sections + templates for 6 pages (homepage, about, science, results, products, PDP) from HTML references in `/docs`.
> **Supersedes nothing.** Complements `section-schema-standard.md` and `MIGRATION_PLAN.md`. When the Migration Plan's memory-app port resumes, this work runs in parallel or pauses for it per the user's direction.

This is the single source of truth for the pages build. It consolidates the per-page research into one plan with phasing, file inventory, and retrofit strategy.

---

## 1. Guiding decisions

| # | Decision | Source |
|---|---|---|
| 1 | Drop `ig-` prefix on new sections — generic names only | User, 2026-04-19 |
| 2 | Existing `ig-*` sections get retrofitted to `section-schema-standard.md`, not renamed (preserves `templates/index.json` references) | Maintainer call; rename would break the live homepage |
| 3 | Build shared reusable sections (hero, stat bar, timeline, CTA, FAQ) once; use across pages | Consolidated from all 6 page plans |
| 4 | Product/collection data comes from Shopify pickers — not schema text fields | User requirement |
| 5 | PDP tabs implemented as option A: each tab = one section, JS tab nav on top | User, 2026-04-19 |
| 6 | `ig-section-controls` snippet has known gaps to fix in a later phase — new sections use it where working, fall back to inline `<style>` block where not | User, 2026-04-19 |
| 7 | `featured-blog` dropped from homepage (not in new HTML); section file stays available for reinsertion | Default — confirmed OK with user |
| 8 | No git pushes to `main` without user confirmation (main auto-deploys to live theme) | Standing user instruction |

---

## 2. Section inventory — what exists, what's new

### 2.1 Existing `ig-*` sections (9 files, retained)

| File | Homepage slot? | Retrofit status vs. `section-schema-standard.md` |
|---|---|---|
| `ig-hero.liquid` | ✅ yes | ⏳ pending — uses partial schema, has custom orb controls worth preserving |
| `ig-trust-bar.liquid` | ✅ yes | ⏳ pending |
| `ig-how-it-works.liquid` | ✅ yes | ✅ retrofitted (reference implementation) |
| `ig-products-grid.liquid` | ✅ current (to be swapped) | ⏳ pending |
| `ig-products-showcase.liquid` | ⬜ not yet | ⏳ pending |
| `ig-guarantee-strip.liquid` | ✅ yes | ⏳ pending |
| `ig-results-split.liquid` | ⬜ not yet | ⏳ pending |
| `ig-why-different.liquid` | ⬜ not yet | ⏳ pending |
| `ig-final-cta.liquid` | ⬜ not yet | ⏳ pending |

### 2.2 New reusable sections (7 files, drop `ig-` prefix)

Use on multiple pages. Worth the up-front design effort.

| File | Used on | Purpose | Foundation |
|---|---|---|---|
| `page-hero.liquid` | about, science, results, products | Lighter-weight hero: breadcrumb, eyebrow, headline, sub, optional CTA. No orb. | Dawn `image-banner` + schema standard |
| `stats-bar.liquid` | about, results, PDP | N-column numeric stat grid (blocks: num / unit / label / source) | Scratch, schema standard |
| `timeline.liquid` | about, science, results | Numbered timeline, horizontal or vertical (blocks: step / time / title / body) | Scratch |
| `comparison-table.liquid` | science, products | Feature rows × 2–3 value columns with header labels (blocks: row) | Scratch, mobile collapses to stacked |
| `study-cards.liquid` | science, results, PDP | Clinical study card grid (blocks: study tag, title, authors, design stats, optional article link) | `multicolumn` shape |
| `testimonial-quotes.liquid` | about, results, PDP | Pull-quote / physician-quote cards (blocks: quote, name, credentials, portrait) | Scratch |
| `faq.liquid` | PDP, products, science | Collapsible Q&A (blocks: question, answer). Uses `<details>` — no JS required | Dawn `collapsible-content` as reference |

### 2.3 New page-specific sections (12 files)

**About page (3 new):**

| File | Purpose | Pickers |
|---|---|---|
| `founder-letter.liquid` | Sticky portrait column + multi-paragraph bio + credentials subgrid | Image |
| `advisor-grid.liquid` | Advisor intro + card grid (blocks: advisor — tag / name / title / quote / optional image) | Image |
| `mission-pillars.liquid` | Left statement + right numbered pillars (blocks: pillar) | None |

**Science page (1 new; rest are reuses):**

| File | Purpose | Pickers |
|---|---|---|
| `molecular-comparison.liquid` | Dark GDV measurement box + right feature cells | None |

**Results page (2 new; most via reuse):**

| File | Purpose | Pickers |
|---|---|---|
| `biomarker-grid.liquid` | Product hero copy + 2x2 biomarker cells (mix accent/white) | Optional product link |
| `review-summary.liquid` | Aggregate rating + distribution bars + verified review card grid (blocks: review) | None (or Shopify reviews app later) |

**Products (collection) page (1 new; rest reuse):**

| File | Purpose | Pickers |
|---|---|---|
| `products-bundle.liquid` | Featured bundle block with real product data + subscribe/one-time toggle | 1 product |

**PDP-specific (5 new + `main-product.liquid` edits):**

| File | Purpose | Pickers |
|---|---|---|
| `main-product.liquid` (modify) | Add subscription toggle, stat strip, trust row | Native product |
| `product-overview.liquid` | Benefits checklist + timeline-to-results | None |
| `product-ingredients.liquid` | Ingredient card grid (blocks: ingredient — tag / name / body) | None (or metafield later) |
| `product-clinical-evidence.liquid` | Reuses `study-cards` + inline process steps | Optional article |
| `product-cross-sell.liquid` | 2 cards linking to related products | 2 product pickers |

PDP tab JS goes in a small snippet loaded by `templates/product.igniton.json` (not a section).

### 2.4 New templates (5 files)

| File | Notes |
|---|---|
| `templates/page.about.json` | Wires the about-page sections |
| `templates/page.science.json` | Wires the science-page sections |
| `templates/page.results.json` | Wires the results-page sections |
| `templates/page.products.json` | Static products-landing page |
| `templates/product.igniton.json` | Assignable per-product; tabs layout |

### 2.5 Deletions

None. Keep every existing file — retrofits happen in-place so `templates/index.json` IDs stay valid.

---

## 3. Retrofit strategy for existing `ig-*` sections

Per the schema standard's §6 retrofit recipe. The rule: **no change to `templates/index.json` section IDs or block IDs**. Schema *settings* may be renamed only if a one-liner in the section's Liquid aliases the old ID to the new (or if the setting is currently unused in `index.json`).

### 3.1 Per-section retrofit checklist

For each of the 8 `ig-*` sections still on the old pattern:

1. Audit current schema for settings already present in `index.json` (don't remove those IDs).
2. Add missing canonical groups from `section-schema-standard.md` §3.
3. Replace inline `{% style %}` blocks with `{% render 'ig-section-controls', section: section %}`.
4. Replace `component-ig-*.css` hardcoded values with `var(--ig-*)` references per §5.
5. Add `color-{{ section.settings.color_scheme }}` to wrapper (if missing).
6. Manual theme-editor test: color scheme flip, padding sliders, heading size, mobile scale.
7. Update §7 Adopters table in `section-schema-standard.md`.

### 3.2 `ig-section-controls` gap audit

As part of retrofit, document which controls in the snippet are broken. Known unknowns per user — audit surfaces them. Track in a new appendix to `section-schema-standard.md` (or inline TODOs in the snippet). Fixes deferred to a later phase.

### 3.3 Risk mitigation

- Retrofit one section at a time. Verify on local dev before moving to next.
- Never touch the 3 sections wired into `index.json` without explicit review: `ig-hero`, `ig-trust-bar`, `ig-how-it-works`, `ig-guarantee-strip`, `ig-products-grid`.
- For the sections *not* in `index.json` (`ig-products-showcase`, `ig-results-split`, `ig-why-different`, `ig-final-cta`), retrofit freely — only the homepage re-wire step surfaces them.
- Lighthouse mobile score should not regress on homepage after all retrofits land. Measure before, measure after.

---

## 4. Phasing (quality over quantity)

Each phase ships a coherent, testable deliverable. No phase starts until the prior phase passes its gate.

### Phase A — Homepage finish + foundation

**Deliverables:**
- Retrofit `ig-hero`, `ig-trust-bar`, `ig-guarantee-strip`, `ig-products-grid` (in-place, no schema breakage).
- Retrofit `ig-products-showcase`, `ig-results-split`, `ig-why-different`, `ig-final-cta` (lower-risk, not yet in `index.json`).
- Rewire `templates/index.json` — new order, add the 3 missing sections, swap grid→showcase, drop `featured-blog`.
- `ig-section-controls` gap audit documented.

**Gate:**
- Homepage renders identically or better on desktop + mobile.
- Color scheme flip works on every homepage section.
- No console errors in theme editor.
- Lighthouse mobile ≥ current baseline.

### Phase B — Shared reusable sections

**Deliverables:**
- Build 7 reusable sections: `page-hero`, `stats-bar`, `timeline`, `comparison-table`, `study-cards`, `testimonial-quotes`, `faq`.
- Each with complete schema, component CSS, preset, accessibility pass.

**Gate:**
- Each section independently drops onto a blank `page.json` with default settings and looks correct.
- Each section's 7-group schema verified against standard.
- Each section's CSS passes the "no raw hex, no hardcoded font-family" audit.

### Phase C — About + Science pages

**Deliverables:**
- Build `founder-letter`, `advisor-grid`, `mission-pillars` (about-specific).
- Build `molecular-comparison` (science-specific).
- Write `templates/page.about.json` and `templates/page.science.json` wiring reuses + specifics.

**Gate:**
- Both pages render at visual parity with HTML references.
- Copy populated from HTML.
- Real product/article links resolved where HTML shows them.

### Phase D — Results + Products pages

**Deliverables:**
- Build `biomarker-grid`, `review-summary` (results-specific).
- Build `products-bundle` (products-specific).
- Write `templates/page.results.json` and `templates/page.products.json`.

**Gate:**
- Same as Phase C for these two pages.
- Products page bundle pulls live data via product picker.

### Phase E — PDP

**Deliverables:**
- Modify `main-product.liquid` for subscription toggle, stat strip, trust row.
- Build `product-overview`, `product-ingredients`, `product-clinical-evidence`, `product-cross-sell`.
- Build tabs snippet + JS.
- Write `templates/product.igniton.json`.
- Assign to `igni-cognition` product in admin (user action; document in this doc).

**Gate:**
- PDP renders, tabs switch without page reload, price/variant picker works (regression test).
- Add-to-cart works, variant image swaps work, metafield displays don't throw.
- Lighthouse mobile PDP ≥ 85 per `MIGRATION_PLAN.md` §8.

### Phase F — Polish

**Deliverables:**
- Fix `ig-section-controls` gaps documented in Phase A.
- Copy pass against HTML references.
- Accessibility + keyboard audit across all new pages.
- Lighthouse pass.

---

## 5. Per-page final section composition

Quick reference for what each template will wire up.

### 5.1 Homepage (`templates/index.json`) — post-Phase-A

```
ig-hero
ig-trust-bar
ig-products-showcase
ig-how-it-works
ig-guarantee-strip
ig-results-split
ig-why-different
ig-final-cta
```

### 5.2 About (`templates/page.about.json`)

```
page-hero                (reusable)
mission-pillars          (about-specific)
founder-letter           (about-specific)
stats-bar                (reusable)
ig-why-different         (reuse: differentiators)
testimonial-quotes       (reusable: physician quotes)
advisor-grid             (about-specific)
ig-final-cta             (reuse)
```

### 5.3 Science (`templates/page.science.json`)

```
page-hero                (reusable)
testimonial-quotes       (reusable: the "core question" blockquote — OR scratch section if quote layout doesn't fit)
stats-bar                (reusable: "what changes" 3-card grid)
ig-how-it-works          (reuse: enhancement process — 4 steps)
comparison-table         (reusable: standard vs enhanced)
timeline                 (reusable: history 1990s–2024)
study-cards              (reusable: clinical evidence)
molecular-comparison     (science-specific)
ig-final-cta             (reuse)
```

### 5.4 Results (`templates/page.results.json`)

```
page-hero                (reusable)
stats-bar                (reusable: headline stats, 5-col)
biomarker-grid           (results-specific: Cognition product)
timeline                 (reusable: cognitive timeline, 3-step)
biomarker-grid           (results-specific: Longevity product — second instance)
timeline                 (reusable: longevity timeline, 4-step — second instance)
study-cards              (reusable: study details)
review-summary           (results-specific)
ig-final-cta             (reuse)
```
Note: tab nav above the two biomarker-grid sections is a small snippet, not a section.

### 5.5 Products landing (`templates/page.products.json`)

```
page-hero                (reusable)
products-bundle          (products-specific)
ig-products-grid         (reuse or extend)
ig-trust-bar             (reuse: "why enhanced" icon row — may need a variant)
ig-guarantee-strip       (reuse)
comparison-table         (reusable: product feature matrix)
comparison-table         (reusable: vs competitors — second instance)
```

### 5.6 PDP (`templates/product.igniton.json`)

```
main-product             (modified)
product-overview         (Tab 1)
product-ingredients      (Tab 2)
product-clinical-evidence (Tab 3)
review-summary           (Tab 4 — reuse from Results)
faq                      (Tab 5)
ig-guarantee-strip       (reuse)
product-cross-sell       (PDP-specific)
ig-final-cta             (reuse)
```
Tab nav = snippet consuming section anchors.

---

## 6. Content, copy, images

- **Copy**: pull from the HTML reference files verbatim for Phase A–E. Rewrites happen in Phase F or later, not during the build.
- **Images**: HTML references use placeholder gradients/SVGs. For real images, use Shopify's image picker in each section — defaults can point to `shopify://shop_images/*` if known, else leave `image` setting blank with a visible placeholder in Liquid.
- **Products**: use product pickers. Defaults should point to known handles (`igni-cognition`, `igni-longevity`, `igni-cognition-longevity-pack`) only if the handles are confirmed to exist in the connected store.
- **Articles / studies**: URL setting for now. Article picker is nice but adds schema complexity — defer unless the HTML shows a real article link.

---

## 7. Open items, deferred

- `ig-section-controls` known-broken controls — audit in Phase A, fix in Phase F.
- Subscription toggle on PDP — the HTML shows "Subscribe & Save 20%" as a visual toggle. Real subscription logic requires a subscription app (Shopify Subscriptions, Recharge). For Phase E, build the toggle UI; wire real app hooks when the app is installed.
- Shopify reviews — `review-summary` section builds the layout; real data needs a reviews app metafield or API. Phase E: static settings; real data later.
- Decision: `featured-blog` — left out of homepage per default. If content marketing becomes a goal, rewire in Phase F.
- PDP tab JS — lightweight vanilla JS, no framework. Accessibility: ARIA tablist pattern, arrow-key nav, focus management.

---

## 8. Risk register

| Risk | Mitigation |
|---|---|
| Retrofit breaks live homepage | Never change section IDs or block IDs in `index.json`; test each retrofit against the theme editor before moving on |
| Auto-deploy on `main` push surprises the user | No pushes without explicit user confirmation. User does the push; Claude builds + demonstrates locally |
| `ig-section-controls` gaps block work | Fall back to inline `<style>` for broken controls in the interim; document gaps |
| Section-name collision | All new names checked against `sections/` directory before creation |
| Shopify 5-range-per-section limit | Convert 6th+ ranges to selects with named steps (per reference memory) |
| PDP metafields not yet defined | Use fallback text in Liquid (`{{ metafield \| default: 'placeholder' }}`); document required metafields in §9 |

---

## 9. Required Shopify metafields (PDP)

Placeholder list for Phase E. Confirm with user before schema lock.

| Metafield | Namespace.key | Type | Used on |
|---|---|---|---|
| Product stat strip | `igniton.stat_strip` (JSON) | JSON | main-product, stats-bar |
| Ingredient list | `igniton.ingredients` | JSON (array) | product-ingredients |
| Subscription discount | `igniton.sub_discount_pct` | Number | main-product |
| Clinical study link | `igniton.study_url` | URL | study-cards |

---

## 10. Change log

- **2026-04-19** — v1.0 drafted. Phases A–F scoped. Retrofit strategy locked. Awaiting user approval to kick off Phase A.
