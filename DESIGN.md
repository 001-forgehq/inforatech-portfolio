# Design Direction - Infortech Systems Portfolio

## The Brief

Building a portfolio site for **Infortech Systems**, based in Nairobi, Kenya. The company serves East African institutions and businesses with two flagship products: a Business Management System and a School Management System. We sell reliability to business owners and school administrators — not hype.

## Design Direction (one sentence)

This is a grounded, information-dense B2B portfolio that resembles a well-organized systems manual rather than a marketing brochure — using architectural orange as a practical accent, a technical serif for display text that evokes engineering drawings, and layout grids derived from A4 paper measurements.

## Justification (5 lines)

East African B2B buyers expect clarity and substance over flash; we position Infortech as the pragmatic implementer who delivers systems that work. The architectural orange (#F3910D) references construction sites and physical infrastructure while remaining web-safe for contrast testing. The serif display font (Interchange) suggests structural engineering rather than consumer fashion; its monoline weight avoids the cliché of "modern startup." Sections are offset by 4px horizontally to create rhythm without relying on cards, card shadows, or gradient washes. All copy is concrete and task-oriented — every heading answers what something does, for whom, and why it matters.

## Color Tokens (CSS Variables)

```css
:root {
  /* Primary - architectural orange as our dominant color */
  --color-primary: #F3910D;           /* Used for buttons, key links, active states */
  
  /* Accent - deep charcoal that reads as black on light backgrounds */
  --color-accent: #2A343E;            /* Headlines, borders, icons */
  
  /* Surface - main background */
  --color-bg: #FAF9F6;                /* Warm off-white, easier on eyes than pure white */
  
  /* Content - body text */
  --color-text: #2D3135;              /* Dark grey-blue for maximum readability */
  --color-text-muted: #5F6770;        /* Secondary text, captions, inactive states */
  
  /* Neutral scale - derived from 5-step progression */
  --color-100: #EAE9E4;               /* Lightest neutral */
  --color-200: #DAD8CE;               
  --color-300: #C4BFB5;               
  --color-400: #ADA69A;               
  --color-500: #978E81;               /* Accent neutral */
  
  /* Semantic colors - minimal palette */
  --color-success: #2D7A4F;           /* Deep green, not emerald */
  --color-error: #C23B22;             /* Brick red, not pure red */
  --color-warning: #F59E0B;           /* Amber for attention states */
}
```

**Why these colors?** Orange signals construction, safety gear, and physical work — appropriate for a company building real systems. The palette has no purple/blue gradients or glassmorphism. All colors have sufficient contrast (WCAG AA) when paired with our type scale.

## Type Pairing

### Display Font
- **Font family**: `Interchange`, `GT Walsheim`, "GTE Poetsen", "Times New Roman"
- **Role**: Headlines, section titles, decorative text elements
- **Why**: A technical serif that looks like it came from an architectural or engineering drawing. The monoline feel suggests precision and structure — not consumer-facing fashion. Avoids the Inter/Roboto/Arial trap entirely.

### Body Font
- **Font family**: `IBM Plex Sans`, `Söhne`, "Helvetica Neue", system-sans-serif
- **Role**: All body text, captions, form labels
- **Why**: IBM Plex Sans has that technical documentation feel while remaining readable at small sizes. The slight geometric character fits infrastructure work without being corporate-cliché.

### Type Scale (fluid with clamp)

```css
/* Headlines */
h1 { font-size: clamp(2.5rem, 6vw + 1rem, 4.5rem); line-height: 1.1; }
h2 { font-size: clamp(2rem, 5vw + 0.8rem, 3rem); line-height: 1.25; }
h3 { font-size: clamp(1.5rem, 4vw + 0.5rem, 2rem); line-height: 1.35; }

/* Body */
body, p, li { font-size: clamp(1rem, 0.85vw + 0.9rem, 1.125rem); line-height: 1.7; }

/* Small/secondary */
small, .caption { font-size: clamp(0.8rem, 0.65vw + 0.75rem, 0.875rem); }
```

**Spacing**: Headlines have generous leading to create white space that feels expensive without using cards. Body text gets comfortable line-height for lengthy reading sections like implementation guides.

## Spacing Scale (A4-derived)

```css
/* Based on A4 proportions — practical and grounded */
--space-xs: 0.25rem;   /* 4px - minimum spacing, tight gutters */
--space-sm: 0.5rem;    /* 8px - component padding, icon gaps */
--space-md: 1rem;      /* 16px - standard margin between content blocks */
--space-lg: 1.5rem;    /* 24px - section padding */
--space-xl: 2rem;      /* 32px - major section separators */
--space-2xl: 3rem;     /* 48px - hero vertical rhythm */
--space-3xl: 4rem;     /* 64px - full-page breaks */
```

**Usage rule**: All content containers have `padding-inline-start/end: var(--space-md)` on mobile and scale to `var(--space-xl)` at large screens. Sections breathe with vertical gaps of multiples of `--space-lg`.

## Border Radius

```css
--radius-sm: 2px;      /* Tight corners for tables, technical-looking elements */
--radius-md: 6px;      /* Form inputs, small cards when needed */
--radius-lg: 12px;     /* Primary containers on large breakpoints only */
--radius-full: 9999px; /* Buttons, pills - minimal use */
```

**Rationale**: Small radius values feel more like documentation than consumer apps. We avoid the "rounded everywhere" trend — buttons get `--radius-sm` to reinforce the technical aesthetic. Primary containers on large screens may get a subtle border-radius but never exceed 12px.

## Shadow System

```css
--shadow-subtle: 0 1px 2px rgba(42, 52, 62, 0.08), 0 0 0 1px rgba(42, 52, 62, 0.04);
--shadow-card: 0 4px 12px rgba(42, 52, 62, 0.12), 0 0 0 1px rgba(42, 52, 62, 0.06);
--shadow-float: 0 8px 24px rgba(42, 52, 62, 0.18), 0 2px 4px rgba(42, 52, 62, 0.1);
```

**Usage**: Primary containers use `--shadow-subtle` with a thin border rule. Cards only get shadow when they're floating above the baseline — like feature comparisons or testimonial-style blocks. Shadows never combine with borders; either the element has a border with subtle shadow, OR no border with card shadow. Not both.

## Layout Concept

### Grid System

```
Mobile (≤480px):  Single column, full-width content, horizontal scroll allowed for tables
Tablet (481-768px): Two-column grids for comparisons, stacked cards
Desktop Small (769-1024px): Three-column feature grids, asymmetric layouts
Desktop Large (1025-1440px): Content constrained to 1100px max-width, left-aligned
Wide (≥1441px): Full utilization of screen width, multi-column content areas
```

### What Makes This Page Recognizably Infortech

1. **Offset sections** — Every other major section shifts right or left by `var(--space-md)` to create a zigzag rhythm that avoids centered-everything templates.

2. **Technical serif headers** — The display font creates visual distinction that immediately signals "engineering" rather than "marketing."

3. **Table-first information hierarchy** — Feature comparisons and process steps use tables with hairline borders rather than cards. Tables feel more like documentation.

4. **No card stacks** — Content uses irregular layouts: sidebar + main content, full-width hero statements followed by narrow columns, alternating text/image positions. The grid feels hand-built, not dropped from a template library.

5. **Process-oriented visual elements** — Screenshots of the software systems are presented as documentation (labelled diagrams with numbered callouts) rather than decorative images.

6. **Border-heavy structure** — Hairline rules separate information visually. Section dividers are thin lines (1px solid var(--color-accent)) not colored bands. This reads like a spec sheet.

### ASCII Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                        │  ← Fixed, no shadow
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                    HERO                                       │
│           ┌──────────────────────────────────┐               │
│           │  Large serif headline            │               │  ← Left-aligned text
│           │       + colored underline        │               │     (no centered box)
│           │                                  │               │
│           │         Subtext block            │               │
│           └──────────────────────────────────┘               │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│ PROJECTS                                                      │  ← Offset right by --space-md
│   ════════════════════════════════════════════              │
│                                                               │
│   ┌──────────────────┐    ┌──────────────────┐              │
│   │ BUSINESS         │    │ SCHOOL           │     Feature 1 │
│   │ MANAGEMENT       │    │ SYSTEM           │               │
│   │ SYSTEM           │    │                  │     Feature 2 │
│   │ [UI mockup as    │    │ [UI mockup]      │               │
│   │ diagram/table]   │    │  comparison      │     Feature 3 │
│   └──────────────────┘    └──────────────────┘              │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│ HOW WE WORK                                                   │  ← Back to center/left
│   ══════════════                                              │
│   Step 1 ─────> Step 2 ─────> Step 3                         │     Horizontal process row
│                                                               │
├─────────────────────────────────────────────────────────────┤
│ WHY INFORTECH                                                 │
│ ┌──────────────────────────────────────────┐                 │
│ │ Core values as bulleted list             │                 │
│ │ [no decorative bullets, using custom     │                 │
│ │  SVG markers in var(--color-primary)]    │                 │
│ └──────────────────────────────────────────┘                 │
├─────────────────────────────────────────────────────────────┤
│ CONTACT                                                       │  ← Left offset again
│   ════════                                                    │
│   Form with technical borders                                │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                        │
└─────────────────────────────────────────────────────────────┘
```

## Animation Principles

- **Single entrance style** — All sections fade up with `opacity: 0; transform: translateY(20px)` on page load, then animate to visible. No staggered entrances that create motion chaos.
- **Purposeful interaction feedback** — Buttons press down (`transform: translateY(2px)`), forms shake on error, tabs slide open. Motion responds to user action.
- **Reduced motion** — Respect `@media (prefers-reduced-motion: reduce)` by removing all animations and transitions.
- **Duration** — All transitions use 200ms ease-out. Page-load fades take 600ms for polish without drama.

## Anti-Slop Checklist (for self-review)

- [ ] No generic hero copy ("Revolutionize," "Empower," etc.)
- [ ] No emoji icons — all SVG, consistent stroke weight
- [ ] Layouts vary — no more than one identical card grid in sight
- [ ] No gradient blobs or glassmorphism
- [ ] Copy is concrete, not lorem ipsum
- [ ] At least two different accent animation styles avoided (stick to fade-up only)
- [ ] Focus states visible on all interactive elements
- [ ] All sections have alt text describing function, not decoration
