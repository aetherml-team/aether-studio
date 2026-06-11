---
target: landing page (src/pages/Index.tsx)
total_score: 23
p0_count: 2
p1_count: 3
timestamp: 2026-06-11T02-24-47Z
slug: src-pages-index-tsx
---
# Critique — Æther landing page (src/pages/Index.tsx)

Date: 2026-06-10 · Sources: design review (Assessment A), deterministic detector (Assessment B), aetherml MCP contrast verification. Browser overlay skipped (no browser automation in session). Accessibility pass deferred by owner; contrast cited here as readability evidence only.

## Design Health Score — 23/40 (Acceptable: significant improvements needed)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Form has no sending state; success message fires without anything being sent (ContactSection.tsx:14-17); no current-section indicator in nav |
| 2 | Match System / Real World | 3 | Owner-voice copy is strong, but jargon leaks: "stack", "payroll hooks", n8n/Supabase/Clerk marquee |
| 3 | User Control and Freedom | 2 | Showcase auto-rotation can be stopped but never resumed (ClientShowcase.tsx:240-243); sticky mobile CTA not dismissible |
| 4 | Consistency and Standards | 2 | Nine different CTA labels for one action; metric values hardcoded in TSX while labels live in locales |
| 5 | Error Prevention | 2 | Native required/email only; no inline validation; localized strings used as select values |
| 6 | Recognition Rather Than Recall | 3 | "The fit" nav label meaningless pre-scroll |
| 7 | Flexibility and Efficiency | 3 | EN/ES, theme toggle, skip link, scroll-padding all present |
| 8 | Aesthetic and Minimalist Design | 2 | Five stacked hero background layers; gradient span in every H2; CTA after every section |
| 9 | Error Recovery | 1 | Zero error states anywhere; mailto link is the only fallback |
| 10 | Help and Documentation | 3 | FAQ is genuinely good: real price, breakage policy, NDA |
| **Total** | | **23/40** | **Acceptable band** |

## Anti-Patterns Verdict

**Does it look AI-generated? Yes — within one scroll.** Execution is careful (the engineering is genuinely good), but the design grammar is assembled from the saturated-template playbook. 10 of 14 known tells present:

- **Gradient headline text (banned), ×9** — `.text-gradient` (index.css:366) in every section H2: Hero:166, Marquee:33, ProblemSolution:25+44, Services:40, Process:32, CheckFit:25, FAQ:39, Contact:52, plus inline bg-clip in ClientShowcase:279.
- **Mono uppercase eyebrow above every section (banned as repeated grammar), ×11** — Hero:210, Marquee:28, ProblemSolution:20+39, Services:35, ClientShowcase:273, Process:27, CheckFit:20, FAQ:34, Contact:47, Footer:79.
- **Numbered markers as scaffolding** — Process 01/02/03 (earned: it is a real sequence) and ClientShowcase padStart indices (:316, not earned).
- **Identical icon-card grid** — 5 services cards, generic lucide icons (Cog, Link2, CreditCard, Globe, Workflow); the per-card proof line is the only non-template element.
- **Side-stripe accent** — ClientShowcase.tsx:303 `lg:border-l-2` (detector-confirmed; arguably a tab indicator, mild).
- **Em dashes (banned), 20+** across en.json/es.json — the copy's default connective.
- **Aphoristic "statement, punchy negation" cadence ×7** — "Don't take our word for it. Take theirs." / "Not a template. Not a generic playbook." / "We're not for everyone." etc.
- **Mono-as-technical-costume** — JetBrains Mono on logo, chips, eyebrows, pills, indices, proof lines: costume, not data.
- **Reflex-default fonts** — Outfit (reflex-reject list) as body; Bricolage rapidly saturating.
- **Glass + glow leakage** — backdrop-blur as default chrome ×7; CTA hover glows 0 0 32px; 4 simultaneous ambient hero animations + marquee + auto-rotation + springy scrollbar = drifting toward the crypto-glow anti-reference.

**Second-order test fails too**: "automation studio that isn't SaaS-cream → dark periwinkle orbital-tech with mono labels" is the predictable counter-template. Swap the logo and this is a thousand other AI-ops studio pages.

**Deterministic scan**: 5 findings, exit 2. True positives: side-tab (ClientShowcase.tsx:303), width transition (index.css:480 nav underline, benign). False positives: em-dash count (CSS custom-property `--` sequences), single-font (missed CSS-side families), numbered-markers citation (real instance exists uncited at ClientShowcase.tsx:316).

**Contrast verification (MCP)**: dark `muted-foreground` on background = **2.9:1 FAIL** (hero description, nav links, eyebrows in dark mode — the most-read text on the page); Tavros yellow #FFF176 on light bg = **1.11:1 FAIL** (headline effectively invisible). All other checked pairs pass (7.5-17.7:1).

## Overall Impression

A genuinely well-engineered page wearing a template costume. The proof layer (real clients, real quotes, real prices) is the best asset and is under-leveraged; the visual system (gradient spans, eyebrows, mono, glow) actively undermines the premium-boutique positioning, and the conversion endpoint — the form — doesn't actually work. Single biggest opportunity: strip the template grammar, dial the copy from hustle to composed, and make the page show one real artifact of Æther's work.

## What's Working

1. **The proof layer is real and specific.** Named owners, Guadalajara-specific taglines, imperfect human quotes, per-service client-attributed proof lines. Most agencies fake this; Æther didn't.
2. **Motion/theming discipline signals real craft.** Central easing tokens (lib/motion.ts), reduced-motion handling in every subsystem, FOUC-proof theme script, scroll-padding for anchors.
3. **The FAQ is the most boutique copy on the page** — calm, concrete, with a real price floor ($4,500), breakage policy, and NDA answer. Mirrored in FAQPage schema.

## Priority Issues

1. **[P0] The contact form is decorative.** `onSubmit` = `preventDefault(); setSent(true)` (ContactSection.tsx:14-17). No network call, no storage; "we'll be in touch within 24 hours" is false and every lead evaporates — fatal irony for an automation studio. **Fix**: wire to a real endpoint (Formspree/Resend/serverless), add sending + error states, keep mailto fallback. **Command**: /impeccable harden
2. **[P0] Theme-breaking color failures.** (a) Light mode: client showcase headline gradient ends in client yellows — Tavros #FFF176 = 1.11:1, invisible (ClientShowcase.tsx:189, 279-285). (b) Hero/contact atmospherics hardcode the dark-mode primary `hsl(240 30% 73%)` (index.css:183-227, ContactSection.tsx:35, SectionCTA.tsx:37) so light mode renders the wrong accent. (c) Dark-mode `muted-foreground` (240 8% 38%) = 2.9:1 on background — the hero description and nav links are genuinely hard to read. **Fix**: per-theme client color pairs or lightness clamp; replace hardcoded HSL with `var(--primary)`; raise dark muted-foreground toward foreground-dim (240 5% 64%, which passes at 7.6:1). **Command**: /impeccable polish
3. **[P1] Banned template grammar saturates the page.** 9 gradient spans + 11 eyebrows + mono costume + glass/glow chrome (full inventory above). This is the main reason it reads "AI template" and directly violates the anti-references. **Fix**: delete `.text-gradient` (solid emphasis, used at most twice); keep eyebrows on ≤2 sections and vary section openers; restrict mono to genuine data. **Command**: /impeccable quieter
4. **[P1] Copy register is hustle-y, off the premium-boutique target.** "Send it. We reply in 24 hours." / "Stop wasting time — talk to us" / "Still doing this manually?" / accusatory hero; the page guilt-trips the reader ~5 times and asks for the sale 9 times. **Fix**: rewrite ~10 strings toward composed confidence; keep wit dry and rare; mirror in es.json. **Command**: /impeccable clarify
5. **[P1] Zero real imagery on a page whose thesis is "the site is the portfolio."** No screenshot of any site built, no workflow artifact, no before/after. Abstract SVG + initials avatars only. **Fix**: add 2-3 real artifacts (framed Eternus portfolio shot, anonymized flow screenshot, reconciliation before/after). **Command**: /impeccable shape (plan the proof artifacts), then craft
6. **[P2] Nine CTA variants for one action, CTA after every section.** Selectivity expressed through repetition reads needy and confuses what's on offer (call? audit? availability?). **Fix**: one canonical offer name + verb; keep SectionCTA after ClientShowcase and CheckFit only. **Command**: /impeccable distill
7. **[P2] ES locale credibility dents.** "en par de horas" grammar slip inside a client quote (es.json:102); `<html lang>` never updates on switch; EN-only title/meta/OG; long ES CTAs risk wrapping the h-12 buttons and md navbar. **Fix**: correct quote, sync lang on languageChanged, add ES meta, shorten ES CTAs. **Command**: /impeccable harden
8. **[P3] Dead code + SEO loose ends.** 7 orphaned section components; canonical/OG on `ther-landing-studio.vercel.app` (Æ mangled); 512² og:image with summary_large_image; fonts double-loaded (preload + CSS @import — the @import delays first text paint); package-lock.json deleted. **Command**: /impeccable optimize

## Persona Red Flags

**Jordan (non-technical owner, first visit)**: "Reconciliation" chip is finance-ops jargon; the 18-name tool marquee (n8n, Supabase, Clerk…) signals "for developers" right after the hero — Mercado Pago is the only name that lands; "The fit" nav label and "Check availability" CTA are ambiguous; "payroll hooks" is dev slang in a client-facing deliverable list. What saves him: the BJJ/gym quotes in his exact voice, and the FAQ.

**Riley (stress tester)**: form submits to nowhere (zero network activity, success message anyway); refresh wipes "sent"; localized strings as select values means a future backend gets "Scheduling chaos" and "Caos de agendamiento" as different answers; showcase auto-rotation permanently dies after one click with no resume; `<html lang>` stays "en" in ES; spots "en par de horas".

**Casey (one thumb, slow connection)**: three font families fetched late via CSS @import inside the bundle; hero copy animates in with 0.22-0.9s delays — on 3G she stares at orbs; orbital SVG sits behind hero text at opacity-20 on mobile (noise under copy); continuous animation tax (marquee + orbs + bloom + pulses + rotation + spring scrollbar) on a low-end GPU; sticky CTA is non-dismissible for the whole journey and competes with five inline SectionCTAs.

## Minor Observations

- ProblemSolution has two eyebrows in one section; its red is raw Tailwind `text-red-400/70`, the only non-token color besides client hexes.
- "99.8% accuracy" is oddly low for money reconciliation (2 errors/1,000); explain or drop.
- "3-day reconciliation into 12 minutes" is the strongest claim on the page and the only unattributed one.
- All four client brand colors are yellow-gold family — the showcase reads as one client with four moods; unplanned yellow-on-periwinkle complementary.
- Form selects use `appearance-none` with no chevron (look like dead inputs); the only label is a disabled placeholder option that vanishes once a value is chosen.
- Footer "Company" column has no company links — no About, no privacy/terms; a studio asking for payment-system access with no privacy policy is a trust gap.
- Three simultaneous linear-motion indicators (scroll bar, showcase progress, marquee).
- "Rotating every 15s" caption duplicates AUTO_MS in code; will drift.
- Hardcoded EN aria-labels ("Focus areas", "Æther home", menu labels).
- StickyMobileCTA's scrollHeight math goes stale on resize until next scroll.

## Questions to Consider

1. Would you hire a wedding filmmaker whose showreel is a paragraph describing weddings? What is the artifact a skeptical gym owner can *look at*?
2. The brand says "3 new clients per month"; the page asks for the sale nine times in nine voices. If Æther genuinely turns people away, what would the page dare to *not* say?
3. If a competitor copied this page tonight and swapped the logo, which element could they not steal? The honest answer is "Manuel Focil's quote" — so why does it share visual weight with a tool-logo marquee anyone can render in ten minutes?
