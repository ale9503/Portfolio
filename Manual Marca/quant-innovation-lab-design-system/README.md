# Quant Innovation Lab — Design System

**Version:** 1.0 | **Created:** April 2026 | **Status:** Active

> "Imagining the future isn't enough: we have to build it, together."

---

## About

Quant Innovation Lab (QIL) exists to turn potential into impact. Ideas cross the bridge from mind to world, upheld by rigorous execution and long-term vision. QIL doesn't chase quick wins — it explores, tests, and shares. Innovation grows when it's carefully tended.

**No external sources were provided.** This design system was built from the company description alone. No Figma links, codebase, or existing assets were attached. All visual decisions are original interpretations of the brand brief.

---

## CONTENT FUNDAMENTALS

### Voice & Tone
- **Confident but not arrogant.** QIL speaks with authority earned through rigor, not volume.
- **Precise language.** Avoid filler words, buzzwords, or hype. "Rigorous execution" not "best-in-class solutions."
- **Long-view thinking.** Copy reflects patience and depth — not urgency or FOMO.
- **Collaborative "we" and "together."** Community is central. Avoid overly distant third-person.
- **Intellectual warmth.** Scientific precision paired with human care — not cold or corporate.

### Casing
- **Sentence case** everywhere — including headings and CTAs. Never title case for UI copy.
- **Acronym exception:** QIL is always capitalized. Product names use proper noun casing.

### Person & Voice
- First-person plural ("we explore, we build, we share") for brand statements.
- Second-person ("you") for direct user interactions and CTAs.
- Avoid passive voice. Prefer active, verb-led sentences.

### Specific Examples
- ✓ "We don't chase quick wins."
- ✓ "Explore, test, and share."
- ✓ "Build it, together."
- ✗ "Leveraging best-in-class innovation solutions."
- ✗ "Our Cutting-Edge Platform Delivers Results."

### Emoji
**Never used.** QIL communicates through language and visual precision — not decorative characters.

### Length
- Headlines: 3–8 words. Sharp, declarative.
- Subheads: 1 sentence, max 15 words.
- Body copy: Dense, substantive. Readers are intelligent. Don't over-explain.

---

## VISUAL FOUNDATIONS

### Color
- **Primary palette:** Deep ink-black `#09090B`, warm ivory `#F5F1E8`, amber-gold `#C8922A`
- **Secondary:** Slate `#52647A`, sage `#5C7A62`, warm-mid `#8C7B65`
- **Semantic:** Error `#B94A3A`, Success `#4A7A5C`, Warning `#C8922A` (reuses amber)
- **Surface system:** Ink → Charcoal → Slate → Ivory → White; dark-first design with light variant

### Typography
- **Display:** DM Serif Display — elegant, slightly editorial, old-world gravitas
- **UI / Body:** Space Grotesk — geometric, precise, modern
- **Mono / Data:** JetBrains Mono — clean, technical, purposeful
- **Scale:** 12 / 14 / 16 / 18 / 24 / 32 / 48 / 64 / 96px
- **Line height:** 1.5 body, 1.15 display, 1.0 mono

### Backgrounds
- Predominantly **solid**: ink-black, ivory, or charcoal — no gradients
- Occasional **noise texture overlay** (2–4% opacity) for paper-like warmth on ivory surfaces
- No photography backgrounds; no full-bleed imagery unless editorial hero

### Spacing
- Base unit: **8px**. Scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px
- Generous negative space — never crowded

### Borders & Rules
- **1px solid** thin rules, color: `rgba(255,255,255,0.12)` on dark / `rgba(0,0,0,0.1)` on light
- Used liberally to delineate sections — no box-shadows on cards in dark mode
- Light mode cards: `1px solid rgba(0,0,0,0.08)` with subtle `box-shadow: 0 1px 4px rgba(0,0,0,0.06)`

### Corner Radii
- **Sharp by default.** `border-radius: 0` on most elements.
- **Radius 4px** only for small interactive chips/tags.
- **Radius 2px** for input fields.
- No pill buttons. No large rounded cards.

### Shadows & Elevation
- Minimal shadow use — elevation communicated through borders and color contrast
- Light mode: `0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)` for lifted cards
- Dark mode: no box-shadows; use border + background contrast

### Animation & Motion
- **Easing:** `cubic-bezier(0.25, 0.1, 0.25, 1)` — smooth ease. Never bouncy.
- **Duration:** 150ms micro-interactions, 250ms transitions, 400ms page reveals
- **Pattern:** Subtle fade + 4px upward translate for entrances. No scale animations.
- No decorative animations. Motion serves clarity.

### Hover & Press States
- **Hover:** Foreground color shift (amber accent) + underline for links; background tint `rgba(200,146,42,0.08)` for buttons
- **Press:** 1px inset feel via `translateY(1px)` — no color pop
- **Focus:** `outline: 2px solid #C8922A` offset 2px — always visible

### Imagery
- **Color vibe:** Warm, slightly desaturated. Never oversaturated.
- No stock photography. Prefer editorial illustration, data visualization, or abstract geometry.
- No hand-drawn illustrations; no playful doodles. Precision aesthetic.

### Cards
- No rounded corners. `border-radius: 0`
- Light mode: `background: #FFFFFF; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 1px 3px rgba(0,0,0,0.06)`
- Dark mode: `background: #111113; border: 1px solid rgba(255,255,255,0.08)`

### Use of Transparency & Blur
- Occasional `backdrop-filter: blur(12px)` for overlays/modals only — not decorative
- `rgba` overlays used for hover states, not decorative layering

### Layout
- **12-column grid**, 24px gutters, max-width 1280px
- Section headers always left-aligned or full-width
- No center-aligned body copy blocks (except hero callouts)

---

## ICONOGRAPHY

No icon assets were provided. **Recommendation: Use Lucide icons** (thin-stroke, geometric, 1.5px stroke weight) — these match QIL's precise, restrained aesthetic.

CDN: `https://unpkg.com/lucide@latest`

- Never use emoji as icons
- Never use filled/bold icon styles — stroke only
- Icon size: 16px (inline), 20px (UI), 24px (standalone)
- Icon color: inherits text color; accent color only on key CTAs

---

## FILE INDEX

```
README.md                         ← This file
SKILL.md                          ← Agent skill definition
colors_and_type.css               ← All CSS variables (colors, type, spacing)
assets/
  logo.svg                        ← QIL wordmark (SVG)
  logo-mark.svg                   ← QIL monogram mark
preview/
  colors-primary.html             ← Primary color swatches
  colors-neutral.html             ← Neutral/surface swatches
  colors-semantic.html            ← Semantic color tokens
  type-display.html               ← Display type specimen
  type-body.html                  ← Body/UI type specimen
  type-mono.html                  ← Mono type specimen
  type-scale.html                 ← Full type scale
  spacing-tokens.html             ← Spacing scale tokens
  spacing-radius-shadow.html      ← Radii, shadows, borders
  components-buttons.html         ← Button variants
  components-inputs.html          ← Form inputs
  components-cards.html           ← Card variants
  components-badges.html          ← Badges and tags
  brand-logo.html                 ← Logo usage
ui_kits/
  web/
    README.md                     ← Web UI kit notes
    index.html                    ← Interactive web prototype
    Header.jsx                    ← Navigation header
    Hero.jsx                      ← Hero section
    LabCard.jsx                   ← Research/project card
    Footer.jsx                    ← Footer
```
