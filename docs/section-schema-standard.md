# Section Schema Standard

> **Status:** v1.0 — 2026-04-17
> **Supersedes:** `section-header-typography-standard.md` (to be deleted after all adopters migrate)
> **Implemented by:** `snippets/ig-section-controls.liquid`
> **Used by:** every `ig-*` section (see §7 Adopters)

This is the Elementor-without-bloat layer. It defines the **7 canonical control groups** every Igniton custom section should compose from, the **CSS variable contract** each one produces, and the **recipes** for adopting the standard in new and existing sections.

If you're adding a new section, start here. If you're retrofitting an old one, start at §6.

---

## 1. Why this exists

The default Shopify section-building experience has two failure modes:

1. **Every section invents its own controls.** One uses a select for padding, another uses a range, a third hardcodes it. Merchants (and front-end editors) have to re-learn the UI every time.
2. **Controls are inconsistent across sections.** "Heading size" on Section A is a number from 1–10; on Section B it's Small/Medium/Large; on Section C it's a percentage of scale. Everyone wastes time hunting the right knob.

The standard solves both. Every section exposes the same control vocabulary in the same order, and a single snippet (`ig-section-controls`) translates the settings into CSS variables the component CSS consumes.

**The payoff:**
- New sections take ~30 minutes to scaffold, not hours.
- Front-end people can tweak layout across any section without touching Liquid or CSS.
- Dark/light swap "just works" — every section reads Dawn's scheme variables.
- Mobile scaling is mechanical — one control, every section behaves the same.

---

## 2. The seven canonical control groups

Every section picks the subset of groups it needs. **Unused groups are not included** — don't copy-paste controls you won't wire up. Always keep the standard order, so merchants recognize the layout.

| # | Group | Purpose | Used on |
|---|---|---|---|
| 1 | Color scheme | Background, text, button color via Dawn's native scheme system | Every section |
| 2 | Container width | Narrow / medium / default / wide / full bleed | Every section |
| 3 | Spacing | Top/bottom padding, desktop + mobile (4 settings) | Every section |
| 4 | Label (eyebrow) | Size + space below | Sections with an eyebrow |
| 5 | Heading | Size + max-width + space below + mobile scale | Sections with a heading |
| 6 | Body | Body text size + max-width | Sections with paragraph body text |
| 7 | Image | Ratio + max-width | Sections with hero/feature images |

Section-specific settings (link URLs, block types, buttons, etc.) appear **after** these groups, never interleaved.

---

## 3. The canonical schema blocks — copy-paste

Every group below is ready to drop into a section's `settings: []` array. Use the `{ "type": "header", "content": "…" }` separators to keep the theme editor visually grouped.

### 3.1 Color scheme

```json
{
  "type": "header",
  "content": "Color"
},
{
  "type": "color_scheme",
  "id": "color_scheme",
  "label": "Color scheme",
  "default": "scheme-1"
}
```

### 3.2 Container width

```json
{
  "type": "header",
  "content": "Layout"
},
{
  "type": "select",
  "id": "container_width",
  "label": "Container width",
  "options": [
    { "value": "narrow",  "label": "Narrow (720px)" },
    { "value": "medium",  "label": "Medium (960px)" },
    { "value": "default", "label": "Default (1200px)" },
    { "value": "wide",    "label": "Wide (1440px)" },
    { "value": "full",    "label": "Full bleed" }
  ],
  "default": "default"
}
```

### 3.3 Spacing (4 settings)

```json
{
  "type": "header",
  "content": "Spacing — desktop"
},
{
  "type": "range",
  "id": "padding_block_start_desktop",
  "min": 0, "max": 200, "step": 4,
  "unit": "px",
  "default": 96,
  "label": "Top padding (desktop)"
},
{
  "type": "range",
  "id": "padding_block_end_desktop",
  "min": 0, "max": 200, "step": 4,
  "unit": "px",
  "default": 96,
  "label": "Bottom padding (desktop)"
},
{
  "type": "header",
  "content": "Spacing — mobile"
},
{
  "type": "range",
  "id": "padding_block_start_mobile",
  "min": 0, "max": 200, "step": 4,
  "unit": "px",
  "default": 48,
  "label": "Top padding (mobile)"
},
{
  "type": "range",
  "id": "padding_block_end_mobile",
  "min": 0, "max": 200, "step": 4,
  "unit": "px",
  "default": 48,
  "label": "Bottom padding (mobile)"
}
```

### 3.4 Label (eyebrow)

Section labels are smallcaps/tracked and sit above the heading. Think "UNIVERSITY STUDIED" · "CLINICAL RESULTS". These are *not* body text — the 1rem floor does not apply (brand smallcaps typically render 11–14px).

```json
{
  "type": "header",
  "content": "Label"
},
{
  "type": "range",
  "id": "label_size",
  "min": 60, "max": 180, "step": 5,
  "unit": "%",
  "default": 100,
  "label": "Label size",
  "info": "Percent of base label size (0.8125rem / 13px)."
},
{
  "type": "select",
  "id": "label_spacing",
  "label": "Space below label",
  "options": [
    { "value": "0.25", "label": "Tight" },
    { "value": "0.5",  "label": "Compact" },
    { "value": "0.75", "label": "Normal" },
    { "value": "1.25", "label": "Loose" },
    { "value": "2",    "label": "Spacious" }
  ],
  "default": "0.75"
}
```

### 3.5 Heading

```json
{
  "type": "header",
  "content": "Heading"
},
{
  "type": "range",
  "id": "heading_size",
  "min": 2, "max": 8, "step": 0.25,
  "unit": "rem",
  "default": 3.5,
  "label": "Heading size (desktop)"
},
{
  "type": "select",
  "id": "heading_max_width",
  "label": "Heading container width",
  "options": [
    { "value": "600",  "label": "Narrow (600px)" },
    { "value": "900",  "label": "Medium (900px)" },
    { "value": "1200", "label": "Wide (1200px)" },
    { "value": "1400", "label": "Full (1400px)" }
  ],
  "default": "900"
},
{
  "type": "select",
  "id": "heading_spacing",
  "label": "Space below heading",
  "options": [
    { "value": "1",    "label": "Tight" },
    { "value": "1.75", "label": "Compact" },
    { "value": "2.5",  "label": "Normal" },
    { "value": "3.5",  "label": "Loose" },
    { "value": "5",    "label": "Spacious" }
  ],
  "default": "2.5"
},
{
  "type": "select",
  "id": "mobile_heading_scale",
  "label": "Mobile heading scale",
  "info": "How aggressively the heading shrinks on mobile.",
  "options": [
    { "value": "40",  "label": "Aggressive (40%)" },
    { "value": "55",  "label": "Balanced (55%)" },
    { "value": "65",  "label": "Default (65%)" },
    { "value": "80",  "label": "Gentle (80%)" },
    { "value": "100", "label": "Same as desktop" }
  ],
  "default": "65"
}
```

### 3.6 Body

The `min: 1` on `body_size` enforces the 1rem floor — merchants cannot configure body text below 16px via the editor. Legal disclaimers and metadata get their own section-specific controls if needed (and they live in the section's CSS, not here).

```json
{
  "type": "header",
  "content": "Body"
},
{
  "type": "range",
  "id": "body_size",
  "min": 1, "max": 1.5, "step": 0.0625,
  "unit": "rem",
  "default": 1,
  "label": "Body text size",
  "info": "Minimum 1rem / 16px. Legal disclaimers are handled separately."
},
{
  "type": "select",
  "id": "body_max_width",
  "label": "Body container width",
  "options": [
    { "value": "480", "label": "Narrow (480px)" },
    { "value": "640", "label": "Medium (640px)" },
    { "value": "800", "label": "Wide (800px)" },
    { "value": "1000","label": "Full (1000px)" }
  ],
  "default": "640"
}
```

### 3.7 Image (optional — only for sections with images)

```json
{
  "type": "header",
  "content": "Image"
},
{
  "type": "select",
  "id": "image_ratio",
  "label": "Image aspect ratio",
  "options": [
    { "value": "natural",   "label": "Natural" },
    { "value": "square",    "label": "Square (1:1)" },
    { "value": "portrait",  "label": "Portrait (4:5)" },
    { "value": "landscape", "label": "Landscape (3:2)" },
    { "value": "wide",      "label": "Wide (16:9)" }
  ],
  "default": "natural"
},
{
  "type": "range",
  "id": "image_max_width",
  "min": 200, "max": 1200, "step": 20,
  "unit": "px",
  "default": 600,
  "label": "Image max width"
}
```

---

## 4. CSS variable contract

`ig-section-controls` emits the following custom properties, scoped to `#shopify-section-{{ section.id }}`. Component CSS reads these — **never** read `section.settings` from CSS directly.

| Variable | Unit | Purpose |
|---|---|---|
| `--ig-container-width` | px or `100%` | Max-width for the section's container element |
| `--ig-pad-start` | px | Desktop top padding |
| `--ig-pad-end` | px | Desktop bottom padding |
| `--ig-pad-start-m` | px | Mobile top padding |
| `--ig-pad-end-m` | px | Mobile bottom padding |
| `--ig-label-scale` | number | Multiplier for base label size (e.g. `1.0` = 100%) |
| `--ig-label-spacing` | rem | Space below label |
| `--ig-heading-size` | rem | Desktop heading size |
| `--ig-heading-width` | px | Heading max-width |
| `--ig-heading-spacing` | rem | Space below heading |
| `--ig-mobile-scale` | number | Multiplier for mobile heading (e.g. `0.65`) |
| `--ig-body-size` | rem | Body text size |
| `--ig-body-width` | px | Body max-width |

Image variables are section-scoped and emitted by the section template directly (not standardized yet — pending image-heavy sections to generalize from).

---

## 5. How component CSS consumes the contract

Component CSS (`assets/component-ig-<name>.css`) reads only CSS variables. Here's the standard pattern every section follows:

```css
/* Section wrapper */
.ig-<name> {
  padding-block: var(--ig-pad-start) var(--ig-pad-end);
}
@media screen and (max-width: 749px) {
  .ig-<name> {
    padding-block: var(--ig-pad-start-m) var(--ig-pad-end-m);
  }
}

/* Container */
.ig-<name>__container {
  width: 100%;
  max-width: var(--ig-container-width);
  margin-inline: auto;
  padding-inline: 1.5rem;
}
@media screen and (min-width: 750px) {
  .ig-<name>__container {
    padding-inline: 5rem;
  }
}

/* Label */
.ig-section-label {
  font-size: calc(0.8125rem * var(--ig-label-scale));
  margin-bottom: var(--ig-label-spacing);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  font-weight: 500;
  color: rgb(var(--color-foreground));
}

/* Heading — clamp() for desktop↔mobile scale */
.ig-section-title {
  font-size: clamp(
    calc(var(--ig-heading-size) * var(--ig-mobile-scale)),
    4vw + 1rem,
    var(--ig-heading-size)
  );
  max-width: var(--ig-heading-width);
  margin-bottom: var(--ig-heading-spacing);
  color: rgb(var(--color-foreground));
}

/* Body */
.ig-section-body {
  font-size: var(--ig-body-size);
  max-width: var(--ig-body-width);
  color: rgb(var(--color-foreground));
  opacity: 0.85; /* For body secondary — full opacity if body is the primary content */
}
```

Notes:
- `rgb(var(--color-foreground))` — Dawn color vars are RGB triplets, not full colors.
- `clamp()` on heading means the browser picks the middle value (viewport-responsive) unless it falls outside the min/max. That's the mobile scaling mechanism — no `@media` needed on the heading itself.
- Use `color-<scheme>` class on the section wrapper to pull in the scheme's text/background. Dawn handles the rest.

---

## 6. Retrofit recipe — upgrading an existing section

This is the checklist for migrating a section currently using inline styles, hardcoded settings, or the old `ig-section-header-style` snippet.

1. **Read** the current section's schema and note which universal groups it needs.
2. **Delete** any of these from the section's schema (they're replaced by the universal pattern):
   - Inline `padding_top`/`padding_bottom` selects
   - `background_color` hex picker (color scheme handles this)
   - Any custom typography range that duplicates a universal one
   - Custom `text_size` (replaced by `body_size`)
3. **Paste** the canonical groups from §3 in order. Adjust defaults per section (e.g., a compact strip section might default `padding_block_start_desktop: 48`).
4. **Replace** the render call:
   ```liquid
   {# OLD #}
   {% render 'ig-section-header-style', section_id_selector: '…', label_size: …, … %}

   {# NEW #}
   {% render 'ig-section-controls', section: section %}
   ```
5. **Remove** inline `{% style %}` blocks that emitted padding/background/font-size values. Those now come from CSS variables via the snippet.
6. **Update the component CSS** (`assets/component-ig-<name>.css`) to read CSS variables instead of raw values. Follow the pattern in §5.
7. **Add the scheme class** on the section wrapper: `class="… color-{{ section.settings.color_scheme }}"`.
8. **Test in theme editor**:
   - Change the color scheme → section inverts cleanly
   - Drag the desktop padding sliders → section expands/contracts
   - Drag the mobile padding sliders → mobile view updates (use responsive preview)
   - Drag the heading size range → heading resizes desktop
   - Change mobile heading scale select → mobile heading resizes
9. **Delete** any now-unused custom CSS in `assets/component-ig-<name>.css`.
10. **Add the section to the Adopters list** in §7 below.

---

## 7. Current adopters

| Section | Retrofit status | Notes |
|---|---|---|
| `ig-how-it-works.liquid` | ✅ retrofitted 2026-04-17 | Reference implementation |
| `ig-hero.liquid` | ⏳ pending | |
| `ig-trust-bar.liquid` | ⏳ pending | |
| `ig-products-grid.liquid` | ⏳ pending | Was on old `ig-section-header-style` pattern |
| `ig-products-showcase.liquid` | ⏳ pending | |
| `ig-guarantee-strip.liquid` | ⏳ pending | |
| `ig-results-split.liquid` | ⏳ pending | |
| `ig-why-different.liquid` | ⏳ pending | |
| `ig-final-cta.liquid` | ⏳ pending | |

When every `ig-*` section is retrofitted, delete `snippets/ig-section-header-style.liquid` and `docs/section-header-typography-standard.md`.

---

## 8. Adding a new control to the standard

The standard is meant to be extended carefully. Before adding a new control group, ask:

1. **Is this control genuinely universal?** (Used on 3+ sections.) If it's only needed by one section, keep it section-specific.
2. **Does it conflict with an existing one?** If yes, update the existing one — don't add a parallel control.
3. **Can the merchant accidentally break the site with it?** If yes, add `min`/`max` guardrails or convert to a select with presets.

If the answer to (1) and (3) is clean, add the control by:

1. Add the schema block to §3 of this doc (the copy-paste source).
2. Add the variable emission to `snippets/ig-section-controls.liquid`.
3. Add the variable to the contract table in §4.
4. Add a usage example to §5.
5. Retrofit each `ig-*` section to include the new group where relevant.

---

## 9. Reference: new section recipe (from scratch)

When creating a brand-new `ig-*` section:

1. Create `sections/ig-<name>.liquid`.
2. Create `assets/component-ig-<name>.css`.
3. At the top of the section template, in this order:
   ```liquid
   {{ 'component-ig-<name>.css' | asset_url | stylesheet_tag }}
   {% render 'ig-section-controls', section: section %}
   ```
4. Build your HTML. Use the scheme class on the wrapper:
   ```liquid
   <section id="IgMySection-{{ section.id }}"
            class="ig-my-section color-{{ section.settings.color_scheme }}">
     <div class="ig-my-section__container">
       {%- if section.settings.section_label != blank -%}
         <p class="ig-section-label">{{ section.settings.section_label }}</p>
       {%- endif -%}
       {%- if section.settings.section_title != blank -%}
         <h2 class="ig-section-title">{{ section.settings.section_title }}</h2>
       {%- endif -%}
       <!-- section-specific content -->
     </div>
   </section>
   ```
5. In the `{% schema %}` block, paste the canonical groups from §3 that your section needs. Then add section-specific settings after.
6. Write the component CSS consuming only `var(--ig-*)` and `var(--color-*)` — no raw hex, no font-family declarations.
7. Test in theme editor against the retrofit checklist (§6 step 8).
8. Add to the Adopters list (§7).
