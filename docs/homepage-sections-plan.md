# Homepage Sections Plan

## Overview
This document outlines the plan to convert the `igniton-homepage-2.html` design into modular Shopify sections for the Dawn theme. We'll build sections one at a time, ensuring each is perfect on both desktop and mobile before moving to the next.

## Design Principles
- ✅ Keep the Dawn schema structure
- ✅ Add custom CSS to existing assets (component-*.css pattern)
- ✅ Use custom properties for colors and spacing
- ✅ Mobile-first responsive design
- ✅ Follow the brand guidelines (Cormorant Garamond + DM Sans)
- ✅ Each section must be independently testable

## Color Tokens (to add to base.css)
```css
:root {
  --ig-ink: #121241;
  --ig-paper: #f8f5ef;
  --ig-warm-white: #fdfaf5;
  --ig-ember: #b49153;
  --ig-ember-light: #c9a96e;
  --ig-gold: #b49153;
  --ig-muted: #6b6660;
  --ig-border: rgba(18,18,65,0.1);
  --ig-card-bg: rgba(18,18,65,0.03);
}
```

## Typography Tokens (to add to base.css)
```css
.ig-font-display { font-family: 'Cormorant Garamond', serif; }
.ig-font-body { font-family: 'DM Sans', sans-serif; }
```

---

## Section Breakdown

### 1. Hero Section ✨
**File:** `sections/ig-hero.liquid`
**CSS:** `assets/component-ig-hero.css`

**Purpose:** Large hero with headline, subheadline, CTAs, proof stats, and decorative orb

**Schema Settings:**
- Eyebrow text (text input)
- Headline (richtext)
- Subheadline text (textarea)
- Primary CTA text + link
- Secondary CTA text + link
- Proof stats (blocks, max 4)
  - Number (text)
  - Unit (text, optional)
  - Label (text)
- Background color
- Enable decorative orb (checkbox)

**Mobile Considerations:**
- Stack proof stats vertically
- Reduce font sizes (clamp)
- Hide or reduce orb size
- Full-width padding adjustments

---

### 2. Trust Bar Section
**File:** `sections/ig-trust-bar.liquid`
**CSS:** `assets/component-ig-trust-bar.css`

**Purpose:** Horizontal bar with trust signals (bullets/dots)

**Schema Settings:**
- Background color (dark or light)
- Trust items (blocks, recommended 5)
  - Icon/dot color
  - Text (text input)
  - Text color

**Mobile Considerations:**
- Reduce gap between items
- Wrap items if needed
- Smaller font size

---

### 3. Products Grid Section
**File:** `sections/ig-products-grid.liquid`
**CSS:** `assets/component-ig-products-grid.css`

**Purpose:** Display 2 product cards + 1 full-width bundle card

**Schema Settings:**
- Section label (text)
- Section title (richtext)
- Product cards (blocks, max 3)
  - Product reference (product picker)
  - Tag text (text)
  - Custom description (textarea, optional - falls back to product description)
  - Stats (sub-blocks, max 3)
    - Stat number
    - Stat label
  - Override price display (text, optional)
  - Link text (default: "Shop Now →")
  - Full width (checkbox, for bundle card)
  - Background color (for featured cards)

**Mobile Considerations:**
- Single column layout
- Equal padding on all cards
- Maintain hover states (tap states on mobile)

---

### 4. How It Works Section
**File:** `sections/ig-how-it-works.liquid`
**CSS:** `assets/component-ig-how-it-works.css`

**Purpose:** 4-step horizontal process explanation

**Schema Settings:**
- Section label (text)
- Section title (richtext)
- Background color (paper or warm-white)
- Steps (blocks, max 4 recommended)
  - Step number (auto-generated or manual)
  - Step title (text)
  - Step description (textarea)
- Footer link text (optional)
- Footer link URL (optional)

**Mobile Considerations:**
- Stack steps vertically
- Maintain border-right on desktop only
- Reduce step number size

---

### 5. Guarantee Strip Section
**File:** `sections/ig-guarantee-strip.liquid`
**CSS:** `assets/component-ig-guarantee-strip.css`

**Purpose:** Full-width colored strip with guarantee message

**Schema Settings:**
- Icon/emoji (text input)
- Guarantee text (richtext)
- Background color
- Text color

**Mobile Considerations:**
- Reduce padding
- Smaller font size
- Stack icon and text if needed

---

### 6. Results/Proof Section (Split Layout)
**File:** `sections/ig-results-split.liquid`
**CSS:** `assets/component-ig-results-split.css`

**Purpose:** Left side: big stats grid, Right side: testimonials

**Schema Settings:**
- Section label (text)
- Section title (richtext)
- Big stats (blocks, max 4)
  - Stat number (text)
  - Stat label (text)
  - Source citation (text)
- Testimonials section label (text)
- Testimonials (blocks, unlimited)
  - Star rating (1-5 number)
  - Quote text (textarea)
  - Customer name/meta (text)
- Link to all reviews (text + URL)
- Disclaimer text (richtext)

**Mobile Considerations:**
- Stack left/right into single column
- Stats grid becomes 2-column
- Testimonials stack vertically

---

### 7. Why Different Section (Dark Background)
**File:** `sections/ig-why-different.liquid`
**CSS:** `assets/component-ig-why-different.css`

**Purpose:** 4 feature cards on dark ink background

**Schema Settings:**
- Section label (text)
- Section title (richtext)
- Background color (default: dark ink)
- Feature cards (blocks, recommended 4)
  - Icon SVG code (textarea) or icon picker
  - Title (text)
  - Description (textarea)
  - Icon background color

**Mobile Considerations:**
- Single column on mobile
- Reduce padding
- Maintain hover effects (tap-friendly)

---

### 8. Final CTA Section
**File:** `sections/ig-final-cta.liquid`
**CSS:** `assets/component-ig-final-cta.css`

**Purpose:** Centered call-to-action with radial gradient background effect

**Schema Settings:**
- Section label (text)
- Section title (richtext)
- Subtitle text (textarea)
- CTA buttons (blocks, max 3)
  - Button text (text)
  - Button link (URL)
  - Button style (primary, secondary, muted)
- Footer text with links (richtext)
- Enable gradient effect (checkbox)

**Mobile Considerations:**
- Stack buttons vertically
- Reduce padding
- Maintain gradient effect

---

## Build Order Priority

### Phase 1: Foundation (Week 1)
1. ✅ Add color tokens to base.css
2. ✅ Add typography setup
3. ✅ Build **Hero Section** (most important, sets the tone)
4. ✅ Build **Trust Bar Section** (simple, quick win)

### Phase 2: Core Content (Week 1-2)
5. ✅ Build **Products Grid Section** (critical for conversion)
6. ✅ Build **How It Works Section** (education/trust)
7. ✅ Build **Guarantee Strip Section** (simple, trust builder)

### Phase 3: Proof & Conversion (Week 2)
8. ✅ Build **Results/Proof Section** (complex split layout)
9. ✅ Build **Why Different Section** (brand differentiators)
10. ✅ Build **Final CTA Section** (conversion focused)

---

## Testing Checklist (for each section)

- [ ] Desktop view (1440px+)
- [ ] Tablet view (768px - 1024px)
- [ ] Mobile view (375px - 480px)
- [ ] Theme editor schema works correctly
- [ ] All settings update in real-time
- [ ] Blocks can be added/removed
- [ ] Colors match design system
- [ ] Typography matches brand guidelines
- [ ] Animations/hover states work
- [ ] Accessibility (keyboard navigation, screen readers)
- [ ] Performance (no layout shifts)

---

## Next Steps

1. **Review this plan** with stakeholder
2. **Start with Phase 1** - Add tokens and build Hero section
3. **One section at a time** - Build, test, perfect, then move on
4. **Document as we go** - Note any deviations or improvements

---

## Notes & Decisions

- Using component-*.css pattern to match Dawn's architecture
- All custom properties prefixed with `--ig-` to avoid conflicts
- Keeping Dawn's page-width and grid system
- Animations to be subtle and respect prefers-reduced-motion
- All sections should work independently and can be reordered
