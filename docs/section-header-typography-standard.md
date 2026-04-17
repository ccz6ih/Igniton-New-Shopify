# Igniton Section Header Typography — Standard Pattern

Every Igniton section with a `.ig-section-label` eyebrow and `.ig-section-title` heading should expose the same typography controls in the theme editor. Paste the JSON below into the section's `settings` array, and render the shared snippet in the section's `{% style %}` area.

## 1. Schema — paste into section's `settings` array

```json
{
  "type": "header",
  "content": "Typography"
},
{
  "type": "range",
  "id": "label_size",
  "min": 60, "max": 180, "step": 5,
  "default": 100,
  "unit": "%",
  "label": "Section label size"
},
{
  "type": "range",
  "id": "label_spacing",
  "min": 0, "max": 3, "step": 0.25,
  "default": 0.75,
  "unit": "rem",
  "label": "Space below label"
},
{
  "type": "range",
  "id": "heading_size",
  "min": 2, "max": 8, "step": 0.25,
  "default": 3.5,
  "unit": "rem",
  "label": "Section heading size"
},
{
  "type": "range",
  "id": "heading_max_width",
  "min": 400, "max": 1400, "step": 25,
  "default": 900,
  "unit": "px",
  "label": "Heading container width",
  "info": "Wider = more room before the heading wraps."
},
{
  "type": "range",
  "id": "heading_spacing",
  "min": 0.5, "max": 6, "step": 0.25,
  "default": 2.5,
  "unit": "rem",
  "label": "Space below heading"
},
{
  "type": "range",
  "id": "mobile_heading_scale",
  "min": 40, "max": 100, "step": 5,
  "default": 65,
  "unit": "%",
  "label": "Mobile heading scale"
}
```

## 2. Rendering — render the snippet at the top of the section template

```liquid
{% render 'ig-section-header-style',
  section_id_selector: 'IgYourSection-' | append: section.id,
  label_size: section.settings.label_size,
  label_spacing: section.settings.label_spacing,
  heading_size: section.settings.heading_size,
  heading_max_width: section.settings.heading_max_width,
  heading_spacing: section.settings.heading_spacing,
  mobile_heading_scale: section.settings.mobile_heading_scale
%}
```

(Use whatever prefix matches the section's `<section id="...">`.)

## How it works
- The snippet outputs a `<style>` block scoped to the section's ID.
- Each section keeps its own schema definitions (Shopify doesn't support cross-section schema sharing natively), but the **render logic lives in one place** — update the snippet once and all sections get the new behavior.
- When adding a new Igniton section, copy the JSON block above into its schema and render the snippet. Done.
- If you want to add a new typography control (say, label letter-spacing), add the setting to the JSON template, add the parameter to the snippet, and update each section to pass it. One setting change propagates through a repeatable pattern.

## Current adopters
- `sections/ig-products-grid.liquid`
- `sections/ig-how-it-works.liquid`

When adding to a new section, append it to this list.
