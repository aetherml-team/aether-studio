---
name: Landing Page Playbook
overview: Write a fully self-contained PLAYBOOK.md — a step-by-step recipe with all code snippets, structures, and conventions embedded directly, so it works from a blank project without referencing any existing codebase.
todos:
  - id: write-playbook
    content: Write PLAYBOOK.md — fully self-contained with all code blocks, CSS variables, file structures, and conventions embedded inline
    status: pending
isProject: false
---

# Landing Page Playbook Document

Write `PLAYBOOK.md` at the repo root. It must be **100% self-contained** — every code snippet, CSS variable block, config structure, file template, and convention is embedded directly in the document. No "see file X" or "like project Y does it." Anyone following this document from a blank folder should be able to produce a complete, polished landing page.

The document is written as direct instructions to a senior engineer + marketing strategist (or an AI assistant). It is meant to be followed phase-by-phase in strict order.

---

## Document structure: 7 Phases

### Phase 1 — Intake: Understand the Business

- Prompt template for extracting business info: name, industry, value proposition, target audience, tone of voice, competitors, existing brand assets
- A structured **Brand Brief** output format (a filled-in block) that every subsequent phase references
- Example of a completed Brand Brief for reference
- The placeholder `[BRAND_BRIEF]` is used throughout the rest of the doc to mean "derive this from the brand brief above"

### Phase 2 — Foundations: Project Scaffold

Include the **exact commands** to scaffold a project from scratch:

- `npm create vite@latest` with React + TypeScript + SWC
- Exact `npm install` command for all runtime deps (framer-motion, react-i18next, i18next, i18next-browser-languagedetector, next-themes, tailwindcss, tailwind-merge, clsx, class-variance-authority, lucide-react, radix-ui primitives, etc.)
- Exact dev deps (tailwindcss, postcss, autoprefixer, eslint, etc.)
- The **full file tree** to create:
  ```
  src/
    components/   (Navbar, Footer, ThemeToggle, LanguageToggle, SectionCTA, ui/)
    pages/        (Index.tsx, NotFound.tsx)
    sections/     (all section components)
    locales/      (en.json, es.json)
    lib/          (motion.ts, utils.ts)
    i18n.ts
    index.css
    main.tsx
    App.tsx
  ```

- The **full contents** of foundational utility files:
  - `src/lib/utils.ts` (cn helper with clsx + twMerge)
  - `src/lib/motion.ts` (EASE constant, viewport presets, fadeUp/fadeIn/slideX helpers)
  - `vite.config.ts` (with @ alias)
  - `tsconfig.json` paths

### Phase 3 — Theming: Colors, Fonts, CSS Variables

Include the **complete CSS variable system** inline — the full `:root` and `.dark` blocks with every variable name, its purpose, and placeholder values to fill from the brand brief:

```css
:root {
  --background: [BRAND light bg];
  --foreground: [BRAND light text];
  --primary: [BRAND primary hue/sat/light];
  --primary-bright: ...;
  --primary-dim: ...;
  /* ... every variable ... */
}
.dark {
  --background: [BRAND dark bg];
  /* ... every variable ... */
}
```

- Full list of all CSS variables used and what each controls
- The **complete `tailwind.config.ts`** with the color mapping, font families, border-radius, keyframes, and plugins
- Instructions for choosing a font trio (heading, body, mono) with the Google Fonts `@import` line format
- The **complete `theme-provider.tsx`** code (next-themes wrapper + theme-color meta sync)
- The **complete `ThemeToggle.tsx`** code (dropdown with light/dark/system using lucide icons)
- Rules: HSL format for all colors, dominant primary with sharp accent, no purple-gradient-on-white cliches, dark mode must be a first-class citizen

### Phase 4 — SEO and Metadata

Include the **complete `index.html` template** with every meta tag, OG tag, Twitter card tag, and JSON-LD block — each value marked with `[BRAND_*]` placeholders:

```html
<title>[BRAND_NAME] — [BRAND_TAGLINE]</title>
<meta name="description" content="[SEO_DESCRIPTION]" />
<!-- ... every tag ... -->
<script type="application/ld+json">{ ... }</script>
```

- `robots.txt` template
- `sitemap.xml` template
- `site.webmanifest` template
- Guidelines for writing SEO title (under 60 chars, brand + value prop) and description (under 160 chars, includes key benefit + differentiator)
- Theme-color meta sync script (inline in `<head>` for flash-of-wrong-theme prevention)

### Phase 5 — Copy and Translations (i18n)

Include the **complete `src/i18n.ts`** initialization code:

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import es from "./locales/es.json";
// ... full init with detection order, fallback, etc.
```

Include the **complete `LanguageToggle.tsx`** component code (EN/ES pill toggle).

Include the **full JSON key structure** for translation files — every section's keys with `[BRAND_*]` placeholders:

```json
{
  "navbar": { "link1": "[...]", "cta": "[...]" },
  "hero": { "headline": "[...]", "description": "[...]", "cta": "[...]" },
  "services": { "label": "[...]", "items": [...] },
  ...
}
```

- Copywriting guidelines: headline formulas (pain-agitate-solve, before/after, question hooks), how to write CTAs that convert, social proof patterns, specificity over vagueness ("30+ hours saved" beats "save time")
- Instructions: write EN first, then translate to ES maintaining the same tone

### Phase 6 — Sections: Compose the Page

For **each section type**, include:

- When to use it (which business types benefit)
- The **complete component code** with `useTranslation()`, Framer Motion animations, and responsive Tailwind classes
- The translation keys it reads
- Customization guidance (what to change per business, what stays the same)

Section catalog:

- **Navbar** — sticky, blur-on-scroll, mobile hamburger, theme + language toggles
- **Hero** — full-viewport, headline + subline + CTA + optional decorative visual, stat counters
- **Problem/Solution** — two-column, pain point vs. solution with proof tags
- **Services/Features** — card grid with icons, name, description, proof line
- **Client Showcase / Testimonials** — tabbed/rotating client stories with quotes, metrics, service pills
- **Process / How We Work** — 3-step numbered flow with connecting line
- **Check Fit / Who We Help** — audience list with qualification CTA
- **Metrics / Stats** — animated counter row
- **Contact** — form with selects, success state, email fallback
- **Footer** — column links, social icons, copyright

Include a **section selection guide** — a decision matrix:

- Service business: Hero, Problem/Solution, Services, Testimonials, Process, Contact
- E-commerce/product: Hero, Features, Pricing, Testimonials, FAQ, Contact
- Portfolio/creative: Hero, Gallery, Process, Testimonials, Contact
- SaaS: Hero, Problem/Solution, Features, Pricing, Testimonials, FAQ, Contact

Include the **complete `Index.tsx`** pattern showing how to compose sections.

### Phase 7 — Polish and Launch Checklist

Concrete checklist items:

- Every section animated with staggered `whileInView` reveals + `reduced-motion` fallback
- Hover micro-interactions on cards, buttons, and links
- Dark mode: verify every section, every gradient, every border in both themes
- Mobile: verify every section at 320px, 375px, 768px, 1024px, 1440px
- Lighthouse targets: Performance > 90, Accessibility > 95, SEO = 100, Best Practices > 95
- Language toggle: switch to each language, verify every visible string changes
- Favicon set: .ico, .svg, apple-touch-icon, web-app-manifest icons
- Console: zero errors, zero warnings
- Build: `npm run build` passes clean

---

## Tone and voice of the document

Opens with: "You are a senior software engineer and marketing strategist. Your task is to build a complete, polished, production-ready landing page from scratch. The client has provided a business description — you will turn it into a high-converting page. Follow these phases strictly in order. Do not skip ahead."

Each phase ends with a **checkpoint**: "Before proceeding to Phase N+1, verify that: [list]."

All code blocks are complete and copy-pasteable. No "..." ellipsis in code — every file is shown in full. Placeholders use the `[BRAND_*]` format consistently.