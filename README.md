# Igniton — Dawn rebuild

Ground-up rebuild of the Igniton storefront on a clean **Shopify Dawn 15.4.1**
install, carrying the brand and conversion learnings forward from the previous
theme without its accumulated customization.

> **This is not the theme serving igniton.com.** That is
> [`Shopify-Igniton-Stripped`](https://github.com/ccz6ih/Shopify-Igniton-Stripped),
> checked out locally as `Shopify-Igniton-Download`. Pushes there reach
> customers in about a minute. Pushes here do not. Check which repo you are in
> before you start — see the table at the bottom.

## Start here

**`docs/` is the source of truth.** From `docs/README.md`: *"nothing ships to
the theme without a decision recorded here first."* Read in this order:

| # | Doc | What it gives you |
|---|---|---|
| 1 | [docs/README.md](docs/README.md) | Orientation and status |
| 2 | [docs/brand.md](docs/brand.md) | Who Igniton is, how the site should feel |
| 3 | [docs/design-system.md](docs/design-system.md) | Tokens, type scale, motion rules |
| 4 | [docs/sections.md](docs/sections.md) | What is being built, in what order |
| 5 | [docs/workflow.md](docs/workflow.md) | Conventions, and the "What NOT to do" list |
| 6 | [docs/section-schema-standard.md](docs/section-schema-standard.md) | Read before writing any schema |

Progress is tracked in [docs/roadmap.md](docs/roadmap.md) and
[docs/MIGRATION_PLAN.md](docs/MIGRATION_PLAN.md).

Using an AI agent? `.cursor/rules/igniton-rebuild.mdc` loads automatically in
Cursor. Other agents should be pointed at it explicitly.

## Layout

```
sections/      82 sections. ig-* are the new architecture; the rest are
               Dawn stock or page-specific builds (about, science, results,
               products, PDP).
snippets/      42 reusable fragments
assets/        CSS / JS / images — one CSS file per section, no inline <style>
templates/     JSON page templates
docs/          Source of truth: standards, plans, brand, research
```

## The one trap that will waste your week

**Never write `"default": ""` in a section schema.** Shopify rejects that file
at sync time, deploys everything else in the commit, and reports success — so
the theme quietly keeps serving the old version of that one file, forever.
`shopify theme check` does not catch it. The only place the real error appears
is **Shopify admin → Online Store → Themes → GitHub connection activity log**.

To make a setting optional, omit the `default` key entirely.

This cost four weeks on the live theme's memory-quiz page in September 2026.

## Related repos

| Repo | Local path | Serves igniton.com? |
|---|---|---|
| **This one** — Dawn rebuild | `Igniton-New-Shopify` | No |
| Live theme | `Shopify-Igniton-Download` | **Yes** |
| Reward backend | `igniton-review-reward` | Vercel fn applying Recharge discounts |
