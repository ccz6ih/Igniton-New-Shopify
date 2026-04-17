# Igniton Migration Plan

> **Status:** Draft v1.0 — 2026-04-17
> **Scope:** Full theme rebuild on fresh Dawn + port of Memory App from legacy theme.
> **Timeline:** 4 weeks to production-ready.
> **Owners:** Craig (lead), developer collaborator (memory app port).

This plan is the single source of truth for the rebuild. Every other doc in `/docs` either feeds into this plan or is superseded by it. When this plan conflicts with another doc in `/docs`, **this plan wins** — then update the other doc.

---

## 1. Why fresh-Dawn + port (decision log)

We evaluated two approaches:

**A. Strip the legacy theme.** Remove Poppins/Quicksand/custom colors from the existing codebase and re-skin in place.

**B. Start on fresh Dawn v15.4.1 (already done) and port custom sections in.**

We chose **B**, because:

- Brand tokens in the legacy theme live in a dozen places (scattered `{% stylesheet %}` blocks, inline `<style>` in section files, `assets/*.css`, `config/settings_schema.json`, snippet partials). Stripping is whack-a-mole for 2–3 weeks with no guarantee of catching every declaration.
- The new design system is not a skin — it's a different typographic scale (1rem floor), a different color architecture (4 schemes, not 12), and a different schema philosophy (merchant-controlled, Elementor-like). Retrofitting a newer mental model into older code fights the old patterns.
- The legacy theme has ~180 sections. Fewer than 40 are used on the live site. Porting is also a pruning exercise.
- Fresh Dawn has latest Shopify platform features (color schemes as a first-class primitive, padding groups, font_picker typography settings) that the scaffolding depends on.

**The reframe:** fresh-start ≠ rebuild. HTML structure and Liquid logic of each custom section move over verbatim. Only the CSS tokens and schema layer get rewritten.


---

## 2. Current state inventory

### 2.1 What's already in the new theme

**Base:** Shopify Dawn v15.4.1, fresh install, git-initialized.

**Custom sections built (9):**

| File | Status | CSS file | Notes |
|---|---|---|---|
| `ig-hero.liquid` | built | `component-ig-hero.css` | Uses `ig-section-header-style` snippet |
| `ig-trust-bar.liquid` | built | `component-ig-trust-bar.css` | |
| `ig-products-grid.liquid` | built | `component-ig-products-grid.css` | Adopted typography standard |
| `ig-products-showcase.liquid` | built | `component-ig-products-showcase.css` | |
| `ig-how-it-works.liquid` | built | `component-ig-how-it-works.css` | Adopted typography standard |
| `ig-guarantee-strip.liquid` | built | `component-ig-guarantee-strip.css` | |
| `ig-results-split.liquid` | built | `component-ig-results-split.css` | |
| `ig-why-different.liquid` | built | `component-ig-why-different.css` | |
| `ig-final-cta.liquid` | built | `component-ig-final-cta.css` | |

**Docs folder:** 12 files, most skeletal. `brand-standards-v1.md` is authoritative for color + type; everything else is partially filled.

**Shared snippet pattern started:** `ig-section-header-style` — a per-section `<style>` emitter driven by schema settings. Only 2 sections consume it today. **This is the seed of the universal schema standard (§5).**

### 2.2 What's in the legacy theme to port

**Memory App — sections (9 to port):**

1. `dashboard.liquid`
2. `memory-app-gate.liquid` (consent + routing)
3. `main-account.liquid` (customized with memory-app hooks)
4. `operational-memory.liquid`
5. `number-recall-test.liquid`
6. `speed-grid-test.liquid`
7. `target-finder.liquid`
8. `find-all-digits-test.liquid`
9. `krepelin-counting-test.liquid`

(`apps.liquid` is stock Dawn — already present in new theme, no port needed.)

**Memory App — page templates (7 to port):**

- `page.brain-training.json` → memory app gate
- `page.dashboard.json`
- `page.number-recall-test.json`
- `page.speed-grid-test.json`
- `page.find-all-digits-test.json`
- `page.target-finder-test.json`
- `page.operational-memory-test.json`
- `page.krepelin-counting-test.json`

**Memory App — snippets (3 to port):**

- `memory-app-routing.liquid` (consent-gating logic, referenced from `theme.liquid`)
- `achievement-check.liquid` (fired on test completion)
- `achievement-display.liquid` (UI component for showing badges/rank)

**Memory App — assets (5 to port):**

- `ignition-app.css` (main styling)
- `ignition-app-responsive.css` (breakpoint overlays)
- `ignition-app-global.js` (customer + session state)
- `achievement-system.css`
- `achievement-system.js`

**Out of scope for memory-app port (but may come in future phases):** everything else in the legacy `sections/` folder (~170 files). Marketing sections for the bigger site rebuild will be triaged in week 3.

### 2.3 What's stale in existing docs

| File | Issue | Action |
|---|---|---|
| `design-system.md` | Every token value is "_TBD_" | Fill from `brand-standards-v1.md` (week 1) |
| `homepage-sections-plan.md` | References Cormorant Garamond + DM Sans | Rewrite to reflect Playfair Display + Plus Jakarta Sans + mark as historical / superseded by current build |
| `sections.md` | Lists no `ig-*` sections under "Launch set" despite 9 being built | Update status column, link each row to its component CSS file |
| `section-header-typography-standard.md` | Adopter list shows only 2 sections (products-grid, how-it-works) | After §5 is ratified, either roll the pattern out to all 9 `ig-*` sections or absorb this doc into `section-schema-standard.md` |
| `roadmap.md` | Phase 0 is mostly unchecked but foundations are partly done | Reconcile against what's actually been shipped |


---

## 3. Strategic principles (the guardrails)

Every decision downstream follows from these. If something in the build violates one of these, the build is wrong — not the principle.

### 3.1 Schema is the API

Merchants (and you, in the theme editor) never edit Liquid to change a site. Every visual choice — color, font size, padding, image ratio, container width — is exposed as a schema setting. A section without schema controls for these things is an incomplete section.

### 3.2 Dawn color schemes are the color system

There are exactly **4 color schemes**, mapped to Dawn's native `color_schemes` in `settings_schema.json`:

| Scheme | Background | Text | Accent | Use |
|---|---|---|---|---|
| `scheme-1` — Light (default) | `#FFFFFF` | `#121241` (navy) | `#B49153` (gold) | 55% of pages. Default everywhere unless overridden. |
| `scheme-2` — Dark | `#121241` (navy) | `#FFFFFF` | `#B49153` (gold) | Hero bands, "why different" dark sections, final CTA backdrops. |
| `scheme-3` — Indigo accent | `#191880` (indigo) with radial navy gradient | `#FFFFFF` | `#B49153` | Reserved for hero orbs, depth layers, active nav indicators. Never a flat block. |
| `scheme-4` — Warm mute | `#FDFAF5` | `#121241` | `#B49153` | Quiet storytelling sections, founder letters, disclaimers. |

Every custom section exposes a `color_scheme` setting. CSS inside the section references scheme variables (`--color-background`, `--color-foreground`, `--color-button`, etc.) — **never** raw hex. This is how "dark to light sections just work" — change the scheme in the dropdown, everything downstream updates.

### 3.3 Typography is controlled in one place

Fonts are set via Dawn's native typography settings (`settings.type_header_font`, `settings.type_body_font`). Every section's CSS uses `var(--font-heading-family)` and `var(--font-body-family)` — **never** a hardcoded `font-family: 'Poppins', ...`. Change the font in Shopify admin once, every section updates.

Display font (headings): **Playfair Display** · weight 400 · italic reserved for product names ("*Igni*Cognition").
Body font: **Plus Jakarta Sans** · weights 300, 500.

### 3.4 1rem is the floor

Minimum body text size is **1rem (16px)** on all breakpoints. No exceptions — except:

- Legal / FDA disclaimer lines: 0.6875rem (11px) is allowed per brand guidelines.
- Metadata microcopy (e.g., `n=80, 90 days`): 0.8125rem (13px) minimum.

If a design mock shows 13px body text, the mock is wrong. Flag it.

### 3.5 Mobile scaling is mechanical, not manual

Every section exposes a `mobile_heading_scale` range control (40%–100%, default 65%). The section's CSS uses `clamp()` + a CSS variable the schema writes into. Example:

```css
.ig-section-title {
  font-size: clamp(
    calc(var(--ig-heading-size) * var(--ig-mobile-heading-scale, 0.65)),
    4vw + 1rem,
    var(--ig-heading-size)
  );
}
```

This means: on desktop, heading renders at the configured size. On mobile, it renders at the scaled-down size. One control, two breakpoints.

### 3.6 No inline `<style>` blocks in sections

If a section needs styling, it gets a file in `assets/component-ig-<name>.css`, loaded via `{{ 'component-ig-<name>.css' | asset_url | stylesheet_tag }}` at the top of the section. The **only** inline `<style>` allowed is the one emitted by `ig-section-controls` (see §5) — and that one exists precisely because its values come from schema and can't be pre-written.

### 3.7 Animation is gated on `prefers-reduced-motion`

Every keyframe, every transition over 150ms, every transform — wrapped in `@media (prefers-reduced-motion: no-preference)` or short-circuited inside when the user opts out. No exceptions.

### 3.8 Keyboard nav works

Every interactive element — button, link, quiz input, progress indicator — is reachable by tab, activatable by enter/space, has a visible focus ring. Audited before merge.


---

## 4. Four-week phasing

Week boundaries are Monday–Sunday. Tasks roll over if a gate fails; they don't evaporate.

### Week 1 (Apr 20–26) — Foundation & schema standard

**Goal:** Lock the architecture. If week 1 is half-done, the project slips by multiples.

- [ ] **Day 1–2 — Docs reconciliation.**
  - Fill `design-system.md` token table from `brand-standards-v1.md`.
  - Rewrite `homepage-sections-plan.md` to reflect current state (Playfair + Jakarta, already-built sections) OR mark as historical.
  - Update `sections.md` status rows for the 9 `ig-*` sections.
- [ ] **Day 2–3 — Color schemes committed.**
  - Replace Dawn defaults in `config/settings_schema.json` with the 4-scheme set from §3.2.
  - Verify each `ig-*` section respects `color_scheme` setting (audit + fix any raw-hex references).
- [ ] **Day 3–4 — Ship §5 (Universal Section Schema Standard).**
  - Write `docs/section-schema-standard.md`.
  - Build `snippets/ig-section-controls.liquid` (the CSS-variable emitter).
  - Build `snippets/ig-section-schema.liquid`... wait — Liquid snippets can't render schema. Instead: ship a canonical JSON block in `section-schema-standard.md` that every new section copy-pastes.
- [ ] **Day 4–5 — Retrofit the 9 existing `ig-*` sections** to consume the new standard.
  - This is the highest-leverage work. It validates the standard and it gives the memory-app port a reference pattern.
- [ ] **Day 5–7 — Legacy inventory + dependency graph.**
  - Read every memory-app section end-to-end, log assets/snippets/liquid dependencies in §6.
  - Confirm no hidden coupling to legacy global JS.

**Exit gate for week 1:** all 9 `ig-*` sections use the new schema standard; color scheme switch in the theme editor visibly inverts any of them without code changes; no raw hex colors remain in any `component-ig-*.css` file.

### Week 2 (Apr 27–May 3) — Memory app port, part 1 (foundations + first 3 sections)

- [ ] **Day 1 — Port assets & snippets (leaves of the dependency tree first).**
  - `ignition-app.css` → `ignition-app.css` (renamed wouldn't help; keep the filename, strip font declarations, replace hardcoded colors with scheme variables).
  - `ignition-app-responsive.css` → same file, breakpoints aligned with `design-system.md` (480/768/1024/1280).
  - `ignition-app-global.js` → unchanged (pure JS, no styling).
  - `achievement-system.css/.js` → same treatment.
  - `memory-app-routing.liquid`, `achievement-check.liquid`, `achievement-display.liquid` → copy verbatim; verify no font/color hardcoding in Liquid Liquid-rendered style blocks.
- [ ] **Day 2 — Port `memory-app-gate.liquid`.** Highest-visibility section. Complete style-transform pass; schema added; tested with/without consent, with/without customer login.
- [ ] **Day 3 — Port `dashboard.liquid`.** Integrates with `achievement-display` snippet and routing; stateful.
- [ ] **Day 4 — Port `speed-grid-test.liquid`.** Most interactive test; validates the JS + achievement pipeline works end-to-end.
- [ ] **Day 5 — QA + iterate.** Checkpoint with developer collaborator; resolve any schema standard gaps surfaced by the first three ports.

**Exit gate for week 2:** gate → dashboard → speed-grid test runs end-to-end on the new theme; consent persists; achievements fire; no Poppins/Quicksand declarations remain in any shipped file.

### Week 3 (May 4–10) — Memory app port, part 2 (remaining tests) + main site content

- [ ] **Day 1–3 — Port remaining 5 test sections.**
  - `number-recall-test`
  - `target-finder`
  - `find-all-digits-test`
  - `krepelin-counting-test`
  - `operational-memory`
  - Each one follows the same checklist (below in §6). Treat as mechanical once the first three set the pattern.
- [ ] **Day 3 — Port `main-account.liquid`** with memory-app hooks preserved.
- [ ] **Day 4–5 — Main site content build-out.**
  - Homepage (use already-built `ig-*` sections).
  - PDP (`main-product.liquid`) — triage which legacy `product-*` patterns carry forward.
  - Collection grid.
- [ ] **Day 6–7 — Cross-section review.**
  - Lighthouse mobile ≥ 85 on homepage, PDP, dashboard.
  - Keyboard nav audit on every interactive surface.

**Exit gate for week 3:** every memory-app page renders on the new theme with visual parity (or better); main purchase flow works; no console errors in the theme editor on any page.

### Week 4 (May 11–17) — Polish, QA, content, launch

- [ ] **Day 1–2 — Content population.** Replace every placeholder with real copy/images from the creative strategy deliverables.
- [ ] **Day 2–3 — Cross-device QA.** Physical devices: iPhone (Safari), Android (Chrome), iPad, desktop (Chrome, Firefox, Safari). Document any device-specific bugs.
- [ ] **Day 3 — Tracking & integrations.**
  - GA4, Meta pixel verified in Tag Assistant.
  - Klaviyo forms + email capture tested.
  - Subscription flow tested with real payment.
  - 301 redirects from old URLs staged.
- [ ] **Day 4 — Accessibility pass.** axe DevTools or Lighthouse a11y ≥ 95 on every key template.
- [ ] **Day 5 — Password-protected preview** shared with stakeholders for final sign-off.
- [ ] **Day 6 — Launch.** Theme publish → smoke test → DNS/redirect verification.
- [ ] **Day 7 — Post-launch monitoring** + bug triage.

**Exit gate for week 4:** theme is live, paid orders are going through, no P0/P1 bugs open.


---

## 5. The Universal Section Schema Standard (the Elementor-without-bloat layer)

This is the scaling primitive. Once this is locked, building a new section is copy-paste-tweak, not re-architect.

Full spec lives in `docs/section-schema-standard.md` (to be written in week 1). Below is the design summary.

### 5.1 What every section must expose

Seven control groups. Order is fixed — merchants learn once, recognize everywhere.

**1. Color scheme**
```json
{ "type": "color_scheme", "id": "color_scheme", "label": "Color scheme", "default": "scheme-1" }
```
No section is exempt.

**2. Container width**
```json
{
  "type": "select",
  "id": "container_width",
  "label": "Container width",
  "options": [
    { "value": "narrow",    "label": "Narrow (720px)" },
    { "value": "default",   "label": "Default (1200px)" },
    { "value": "wide",      "label": "Wide (1440px)" },
    { "value": "full",      "label": "Full bleed" }
  ],
  "default": "default"
}
```

**3. Spacing (desktop + mobile, top + bottom)**

Four range inputs:
- `padding_block_start_desktop` (0–200, step 4, default 96)
- `padding_block_end_desktop` (0–200, step 4, default 96)
- `padding_block_start_mobile` (0–200, step 4, default 48)
- `padding_block_end_mobile` (0–200, step 4, default 48)

**4. Typography — eyebrow / label**

- `label_size` (60–180%, default 100)
- `label_spacing` (0–3rem, default 0.75)

**5. Typography — heading**

- `heading_size` (2–8rem, step 0.25, default 3.5)
- `heading_max_width` (400–1400px, step 25, default 900)
- `heading_spacing` (0.5–6rem, step 0.25, default 2.5)
- `mobile_heading_scale` (40–100%, default 65)

**6. Typography — body / subheading**

- `body_size` (0.875–1.5rem, step 0.0625, default 1rem) — **cannot go below 0.875rem (14px) via UI; enforced by the schema `min` value.**
- `body_max_width` (400–900px, default 640)

**7. Image sizing (for sections that use images)**

- `image_ratio` (select: square / portrait / landscape / wide / natural)
- `image_max_width` (range, optional, for card/feature images)

Section-specific settings go **after** these seven groups, never mixed in. That's the "consistent, scannable UI for front-end people" Craig asked for.

### 5.2 How it renders — `snippets/ig-section-controls.liquid`

One snippet reads every standard setting and emits a scoped `<style>` block writing CSS custom properties onto the section wrapper. The section's component CSS file then consumes those variables.

```liquid
{%- comment -%}
  Usage at top of any ig-* section:
  {% render 'ig-section-controls', section: section %}
{%- endcomment -%}

<style>
  #shopify-section-{{ section.id }} .ig-section {
    --ig-pad-start:      {{ section.settings.padding_block_start_desktop }}px;
    --ig-pad-end:        {{ section.settings.padding_block_end_desktop }}px;
    --ig-pad-start-m:    {{ section.settings.padding_block_start_mobile }}px;
    --ig-pad-end-m:      {{ section.settings.padding_block_end_mobile }}px;
    --ig-label-size:     {{ section.settings.label_size | divided_by: 100.0 }}rem;
    --ig-label-spacing:  {{ section.settings.label_spacing }}rem;
    --ig-heading-size:   {{ section.settings.heading_size }}rem;
    --ig-heading-width:  {{ section.settings.heading_max_width }}px;
    --ig-heading-spacing:{{ section.settings.heading_spacing }}rem;
    --ig-mobile-scale:   {{ section.settings.mobile_heading_scale | divided_by: 100.0 }};
    --ig-body-size:      {{ section.settings.body_size }}rem;
    --ig-body-width:     {{ section.settings.body_max_width }}px;
  }
</style>
```

The corresponding component CSS then reads only variables:

```css
.ig-section {
  padding-block: var(--ig-pad-start) var(--ig-pad-end);
}
@media (max-width: 749px) {
  .ig-section {
    padding-block: var(--ig-pad-start-m) var(--ig-pad-end-m);
  }
}
.ig-section__title {
  max-width: var(--ig-heading-width);
  margin-bottom: var(--ig-heading-spacing);
  font-size: clamp(
    calc(var(--ig-heading-size) * var(--ig-mobile-scale)),
    4vw + 1rem,
    var(--ig-heading-size)
  );
}
```

### 5.3 The canonical schema block

`docs/section-schema-standard.md` holds the full JSON block ready to copy-paste into any new section's `settings: []` array. When a new control is added to the standard, update the doc — then update every adopting section (mechanical change, listed in the "Current adopters" section of the doc).

### 5.4 Font size floor (enforced in schema)

For body/subheading controls: `"min": 0.875` on the range. For heading: `"min": 2`. **Merchants cannot select below those floors in the UI** — that's the guardrail. Legal and metadata exceptions live in the section's CSS, not exposed to schema.

### 5.5 What this buys us

- **New sections take ~30 minutes to scaffold** instead of 3 hours. Schema copy-paste + component CSS file + Liquid markup = done.
- **Front-end people can make global-feeling changes** without touching code. Change the heading size on one section, see it live in the theme editor — no deploy.
- **Dark/light swap "just works"** because every section reads scheme variables, not hex. One dropdown flip.
- **Mobile scaling is consistent** because every section uses the same `clamp()` + mobile_scale pattern.
- **You stop being the bottleneck** for tweaks like "make this headline smaller" or "more padding."


---

## 6. Memory App port inventory & per-file checklist

### 6.1 Port order (dependency tree, leaves first)

```
[assets]                         ← port first (week 2 day 1)
  ignition-app.css
  ignition-app-responsive.css
  ignition-app-global.js
  achievement-system.css
  achievement-system.js
    ↓
[snippets]                       ← port second
  memory-app-routing.liquid        → referenced from layout/theme.liquid
  achievement-check.liquid          → rendered inside test sections on completion
  achievement-display.liquid        → rendered inside dashboard
    ↓
[sections]                       ← port in visibility order
  memory-app-gate                   (the entry point; test this first)
  dashboard                         (the hub)
  speed-grid-test                   (validates the achievement pipeline)
  number-recall-test
  target-finder
  find-all-digits-test
  krepelin-counting-test
  operational-memory
  main-account                      (account page hooks — last, lowest risk)
    ↓
[templates]                      ← port last, trivial JSON config
  page.brain-training.json
  page.dashboard.json
  page.number-recall-test.json
  page.speed-grid-test.json
  page.find-all-digits-test.json
  page.target-finder-test.json
  page.operational-memory-test.json
  page.krepelin-counting-test.json
    ↓
[layout wiring]                  ← final connection
  layout/theme.liquid               → add `{% render 'memory-app-routing' %}` inside <body>
```

### 6.2 Per-file transform checklist

When porting any section file, run this checklist. A section is "done" only when every box is checked.

- [ ] **Copy Liquid + HTML verbatim** into `sections/<n>.liquid` in new theme.
- [ ] **Extract inline `<style>` block** to `assets/component-<n>.css` (or roll into `ignition-app.css` if it's shared across multiple memory-app sections).
- [ ] **Strip all `font-family` declarations.** None should remain. Rely on Dawn's inherited `--font-heading-family` / `--font-body-family`.
- [ ] **Replace hex colors** with scheme variables per §7. No raw `#121241`, `#191880`, `#D3A23C`, `#B49153`, `#1B1B57` should remain in CSS or inline style attributes.
- [ ] **Audit font sizes.** Any `font-size` < 1rem flagged unless it's a documented legal/metadata exception.
- [ ] **Add universal schema block** (the 7 control groups from §5.1) to section's `{% schema %}`.
- [ ] **Render `{% render 'ig-section-controls', section: section %}`** at top of the section template.
- [ ] **Replace inline CSS values** with `var(--ig-*)` references.
- [ ] **Test `color_scheme` flip** — change scheme in theme editor, verify section inverts cleanly.
- [ ] **Test mobile scale control** — drag the slider, verify heading shrinks proportionally.
- [ ] **Test padding controls** — drag sliders, verify section expands/contracts.
- [ ] **Animation audit:** every `@keyframes` / `transition > 150ms` gated on `prefers-reduced-motion: no-preference`.
- [ ] **Keyboard test:** tab through every interactive element; focus visible; enter/space activates.
- [ ] **Functional parity check:** compare side-by-side with legacy theme; identical behavior.
- [ ] **Console clean** in theme editor — no warnings, no 404s on assets.

### 6.3 Special considerations per section

**`memory-app-gate.liquid`** — ~750 lines. Biggest single port. The inline `<style>` block (~250 lines) should move to `assets/component-memory-gate.css` cleanly. The consent-submit JavaScript references customer ID/email directly — preserve Liquid interpolation. **Color use:** heavy use of `rgba(255,255,255,0.x)` overlays on a dark-scheme background — these stay as rgba (they're transparency overlays, not brand colors) but the underlying background becomes `var(--color-background)` via scheme-2.

**`dashboard.liquid`** — depends on `achievement-display` snippet. Verify the snippet renders inside the new theme's layout context before the full dashboard ships.

**Test sections (5)** — all share the `achievement-check.liquid` fire-on-complete pattern. Port one (speed-grid), validate the achievement loop, then the remaining four are mechanical.

**`main-account.liquid`** — customized version of Dawn's stock account page. Diff against fresh Dawn's `main-account.liquid` (already present in new theme at `sections/main-account.liquid`) to identify the memory-app-specific additions. Apply those additions as patches to the new theme's file rather than replacing it — this preserves any stock Dawn updates we benefit from.

**`memory-app-routing.liquid`** — uses `{% raw %}` escaping for JS. Copy exactly as-is. The only transform is: verify the asset URL for `ignition-app-global.js` resolves in the new theme.

### 6.4 Templates are trivial

Page templates are JSON references to sections. They port by copying the `.json` file to `templates/` in the new theme **after** the section it references has been ported and confirmed working. No style transforms needed — schema-level config only.

Clean up junk while we're here: drop `page.krepelin-counting-test (2).json` (legacy duplicate).


---

## 7. Token & style remapping reference

The translation table for the port. Every occurrence of the left column in a legacy file becomes the right column in the new file.

### 7.1 Fonts

| Legacy | New | Notes |
|---|---|---|
| `font-family: 'Poppins', sans-serif` | *remove line entirely* | Inherited from `--font-heading-family` / `--font-body-family` |
| `font-family: 'Quicksand', sans-serif` | *remove line entirely* | Same |
| `font-family: 'Cormorant Garamond', serif` | *remove line entirely* | Same (from earlier brand iteration) |
| `font-family: 'DM Sans', sans-serif` | *remove line entirely* | Same |
| `font-weight: 800` on headings | `font-weight: 400` | Playfair Display is a display serif; 400 is the brand-standard weight |
| `font-weight: 700` on button labels | `font-weight: 500` | Jakarta @ 500 per brand standard |
| `text-transform: uppercase; letter-spacing: 3px` on small caps | `text-transform: uppercase; letter-spacing: 0.15em; font-weight: 500` | Brand-standard section label style |

### 7.2 Colors

Legacy hex values map to scheme variables (not raw hex in the new theme). Use these references inside component CSS:

| Legacy hex | Meaning | New reference |
|---|---|---|
| `#121241`, `#1B1B57` | Navy (primary ink / dark bg) | `var(--color-foreground)` on light schemes; `var(--color-background)` on scheme-2 dark |
| `#191880` | Indigo accent/gradient | `var(--ig-indigo)` — exposed as token in `base.css`, scheme-independent |
| `#D3A23C`, `#B49153`, `#B8860B` | Gold/ember accent | `var(--color-accent)` (scheme-aware) or `var(--ig-ember)` (fixed token in `base.css`) |
| `#FDFAF5` | Warm white | `var(--ig-warm-white)` token |
| `#6B6660` | Warm gray | `var(--ig-muted)` token |
| `#FFFFFF` as background | Scheme-1 default | `var(--color-background)` |
| `rgba(255,255,255,0.x)` overlays on dark | Transparency effect | keep as `rgba(255,255,255,0.x)` — this is not a brand color, it's an overlay |
| `rgba(18,18,65,0.x)` | Navy at reduced opacity | `rgb(from var(--color-foreground) r g b / 0.x)` (modern CSS) or keep rgba literal with a comment |

**Key rule:** if a color communicates brand (navy text, gold CTA), it uses a scheme variable. If it's a mechanical effect (transparency overlay, blur layer), raw rgba is fine but comment why.

### 7.3 Spacing

The legacy theme uses arbitrary padding values (20px, 32px, 40px, 48px, 60px, etc). The new theme uses the `design-system.md` scale: 4, 8, 12, 16, 24, 32, 48, 64, 96.

During port, snap each value to the nearest scale step:

| Legacy | New |
|---|---|
| 20px | 16px or 24px (choose based on visual) |
| 40px | 48px |
| 60px | 64px |
| 100px | 96px |

For schema-controlled padding (section top/bottom), merchants drive via the universal controls — component CSS should not hardcode `padding-block`.

### 7.4 Structural transforms

**Inline `<style>` block** → extract to `assets/component-<n>.css`, load at section top with `{{ 'component-<n>.css' | asset_url | stylesheet_tag }}`.

**Hardcoded `max-width: 800px`** on inner containers → `max-width: var(--ig-heading-width)` if it's a headline wrapper; otherwise a custom setting.

**Custom `@keyframes`** → keep, but ensure gated on reduced-motion (§3.7).

**`@media (max-width: 749px)`** → keep as-is; this matches Dawn's mobile breakpoint convention.

---

## 8. Guardrails & QA (the definition of done)

A file is not "done" until it passes every guardrail below. No exceptions "just for this section."

### 8.1 Visual & brand

- [ ] Font-family is inherited from Dawn settings (no hardcoded families).
- [ ] Every color either comes from a scheme variable, an `--ig-*` brand token, or a documented rgba overlay.
- [ ] No body text below 1rem (16px) except legal (0.6875rem) or metadata (0.8125rem).
- [ ] Spacing values snap to the 4/8/12/16/24/32/48/64/96 scale.

### 8.2 Schema & editor UX

- [ ] All 7 universal control groups present (§5.1), in the standard order.
- [ ] Section-specific settings come *after* the standard controls.
- [ ] Every setting has a label string in `locales/en.default.schema.json`.
- [ ] Ranges have sensible min/max/step values (no mile-long sliders).
- [ ] Every setting has a default that looks good without any merchant tweaking.

### 8.3 Functional

- [ ] No console errors in theme editor.
- [ ] No console errors on published preview.
- [ ] Color scheme dropdown inverts the section cleanly.
- [ ] All interactive states (hover, focus, active, disabled) visible and accessible.

### 8.4 Accessibility

- [ ] Keyboard nav: every interactive element reachable, activatable, visibly focused.
- [ ] Semantic HTML: headings in order, landmarks used correctly, buttons are buttons.
- [ ] Color contrast ≥ 4.5:1 for body, ≥ 3:1 for large text.
- [ ] `prefers-reduced-motion: reduce` disables non-essential animation.
- [ ] Images have meaningful `alt` text (or `alt=""` if decorative).

### 8.5 Performance

- [ ] Lighthouse mobile performance ≥ 85 on touched templates.
- [ ] CSS scoped to the section (no global leaks).
- [ ] Images `loading="lazy"` below the fold, `loading="eager" fetchpriority="high"` for LCP images.
- [ ] No layout shift on load (CLS < 0.1).
- [ ] JS that isn't critical is deferred.

### 8.6 Mobile

- [ ] Tested at 375px, 414px, 768px, 1024px, 1280px, 1440px.
- [ ] Tap targets ≥ 44×44px.
- [ ] No horizontal scroll at any breakpoint.


---

## 9. Documentation cleanup (Phase 0 tasks)

These are tracked here and should be closed out before memory-app porting begins in week 2. None of these take more than 30 minutes individually.

| Doc | Action | Deadline |
|---|---|---|
| `design-system.md` | Fill every TBD token from `brand-standards-v1.md`. Replace old breakpoint naming with `design-system.md`'s own. | Week 1, day 1 |
| `homepage-sections-plan.md` | Rewrite to current brand (Playfair + Jakarta, not Cormorant + DM Sans). Mark sections that have shipped ✅. | Week 1, day 2 |
| `sections.md` | Update status column: 9 `ig-*` sections are built. Add a "Memory App" section below "Launch set" listing the 9 files to port. | Week 1, day 2 |
| `section-header-typography-standard.md` | Absorb into new `section-schema-standard.md` (supersedes). | Week 1, day 3 |
| `section-schema-standard.md` | **Create** — the full spec for §5 of this doc. | Week 1, day 3 |
| `workflow.md` | Add: "Before creating a new section, read `section-schema-standard.md` and start from the canonical schema block." | Week 1, day 3 |
| `roadmap.md` | Check off completed Phase 0 items; update Phase 1 to reflect 9 sections already built; add Memory App phase. | Week 1, day 4 |
| `brand.md` | Either populate or delete. A placeholder brand doc is worse than no brand doc. | Week 1, day 4 |

New doc to create this phase: **`docs/section-schema-standard.md`**, with:
1. The canonical schema JSON block
2. The `ig-section-controls` snippet source
3. The CSS-variable contract
4. Current adopters list (auto-maintained)
5. "How to add a new control" recipe

---

## 10. Open questions for Craig

Answer these before week 1 day 3, so the schema standard can be finalized:

1. **Scheme naming.** Are we OK with `scheme-1` (Light), `scheme-2` (Dark), `scheme-3` (Indigo accent), `scheme-4` (Warm mute) as the locked set? Any other real use case I'm missing (e.g., a gold-on-navy premium card scheme)?

2. **Mobile breakpoint.** `design-system.md` says `md` = 768px, but Dawn default and most `ig-*` sections use `749px`. Which wins? (I recommend 749px — matches Dawn's internal assumptions.)

3. **Container widths.** Narrow 720 / Default 1200 / Wide 1440 / Full — is that the right set, or do we want a 960px option too? (Legacy theme used 1600px default; new design-system.md says 1440px max — confirming the 1440px direction.)

4. **Gold usage in dark schemes.** Brand doc says "Gold appears only as accent text or CTA buttons against dark backgrounds" — confirming this means `--color-accent` in scheme-2 resolves to `#B49153` and gets used for both CTA bg and accent text. OK?

5. **`IgniCognition™` italic treatment.** The brand doc shows it as Playfair Italic in gold. Do we want a reusable `{% render 'ig-product-name' %}` snippet that wraps product names consistently, or is this purely a copywriting convention?

6. **Memory app gate — consent persistence.** The legacy gate writes consent to localStorage + cart attributes + customer note. Is all three still required, or can we simplify to localStorage + customer metafield during the port? (Metafield is cleaner than parsing customer.note.)

7. **Achievement system** — any plans to expand it, or is the current scope stable? If stable, port as-is. If expanding, flag which new mechanics so I can plan the data model before the port.

8. **Klaviyo integration points** — which memory-app events fire Klaviyo flows (completion, first-test, achievement unlock)? The port needs to preserve these hooks.

9. **Existing test data.** Any legacy customer data (test scores, achievements) that needs migrating, or does everyone start fresh on the new theme?

10. **Staging URL** — is there a dev store I should be targeting, or are we using your existing dev environment?

---

## 11. Living document

When something in the build or the plan changes, update this doc. This is not a "write once, archive" artifact; it tracks reality.

Convention: append a dated entry under the relevant section. Example:

> **2026-04-22** — Finalized scheme-3 to use radial gradient rather than flat indigo per brand doc rule. Updated §3.2 and `base.css` scheme tokens.

Keep the section heading structure stable so links don't rot.

---

**End of plan v1.0.**
