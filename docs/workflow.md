# Development Workflow

## Local dev

```bash
cd c:/Projects/Igniton-New-Shopify
shopify theme dev --store <store-handle>.myshopify.com
```

First run will prompt for auth. The dev server hot-reloads Liquid/CSS/JS.

## Branching

- `main` — production, auto-deploys to the live theme.
- `staging` — QA theme on the store (unpublished).
- Feature branches off `main`, PR into `staging` first.

## File conventions

- **Sections** (`sections/*.liquid`): one section per file, schema at bottom, kebab-case filename.
- **Snippets** (`snippets/*.liquid`): reusable partials, no `{% schema %}`.
- **CSS** (`assets/*.css`): one file per section (`section-hero.css`), loaded with `{{ 'section-hero.css' | asset_url | stylesheet_tag }}` inside the section. Global tokens live in `base.css`.
- **JS** (`assets/*.js`): web components preferred. One component per file. Avoid jQuery.
- **Locales** (`locales/*.json`): every merchant-facing string goes through `{{ 'key' | t }}`.

## Naming

- Sections: `ig-<purpose>` (e.g., `ig-hero`, `ig-science-strip`). Prefix distinguishes custom from Dawn originals.
- CSS classes: BEM (`ig-hero__headline--large`).
- JS custom elements: `ig-<name>` (e.g., `<ig-cart-drawer>`).

## Before every PR

- [ ] Lighthouse mobile score ≥ 85 on touched templates.
- [ ] No new console errors in the theme editor.
- [ ] Every new setting has a label in `locales/en.default.schema.json`.
- [ ] `prefers-reduced-motion` respected on any new animation.
- [ ] Keyboard nav works on any new interactive element.

## What NOT to do

- Don't add inline `<style>` blocks in sections — use the section's CSS file.
- Don't introduce new color values — add a token in `design-system.md` first, then use it.
- Don't copy sections from the old theme without reviewing whether they still fit the new brand.
- Don't install apps that inject code into `theme.liquid` without logging it in this doc.
