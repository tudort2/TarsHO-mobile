# TARS Home Ownership — Design System

A design system for **TARS**, a home-ownership platform that guides people through the full
lifecycle of owning a home — buying, selling, financing, and managing equity — with a parallel
**broker / agent** workspace for managing deals. This system is inferred from the two product
codebases below and is the single source of truth for building branded TARS interfaces and assets.

## Source repositories
- **Desktop web app** — `tudort2/TarsHO` → https://github.com/tudort2/TarsHO
  (tokens live in `public/index.html` `:root{…}`; a parcel map in `public/bellevue-map.html`)
- **iOS app** — `tudort2/TarsHO-mobile` → https://github.com/tudort2/TarsHO-mobile
  (tokens in `src/context/ThemeContext.tsx` + `src/theme/index.ts`)
- Both repos carry a shared **`DESIGN.md`** that defines the unified token schema — read it for the
  authoritative color/type/spacing tables. Explore these repos further to build higher-fidelity work.

> The two clients share one token system and the same accent **roles** (primary / buy / sell),
> spacing rhythm, and component vocabulary. Desktop type runs slightly larger than mobile; hierarchy
> and weights are identical.

---

## Content fundamentals (voice & copy)

TARS copy is **plain, calm, and reassuring** — it's guiding people through one of the largest, most
stressful transactions of their lives, so it never hypes or pressures.

- **Person & address:** second person, warm and direct. "Your ownership journey", "Welcome back, Alex",
  "Your team". The product speaks *to* the user about *their* home.
- **Tone:** competent and low-drama. Status over salesmanship — "In progress · due soon",
  "Completed Mar 2021", "Pre-approval secured". Progress is framed as a journey with clear stages.
- **Casing:** Sentence case for headings and buttons ("New request", "Add deal"). UPPERCASE only for
  small overline labels with tracking ("HOME OWNERSHIP", "EST. VALUE").
- **Numbers are first-class.** Money, rates, and metrics are shown in tabular mono figures
  ("$842,000", "5.875%", "+4.2%") and treated as the hero content of cards.
- **Verbs are concrete:** "Upload 2025 tax return", "Review refinance offer", "Schedule appraisal".
  Tasks read like a checklist a human would write.
- **No emoji** in product UI. No exclamation marks, no growth-hacky language. Icons (not emoji) carry
  visual meaning.
- **Vibe:** a trustworthy fintech/proptech advisor — modern, quiet confidence, never playful-cute.

---

## Visual foundations

**Color.** A cool, navy-and-slate neutral base with three saturated accents mapped to **roles**, not
hues. Primary is brand **blue `#2563EB`** (actions, links, the homeowner thread); **buy** is
violet `#8B5CF6`; **sell** is cyan `#06B6D4`. Status uses green / amber / rose. Each accent has a ~12%
"soft" tint used as the fill behind pills, badges, KPI icon chips, and active controls.
> ⚠️ **Legacy var-name quirk** (from the source): desktop CSS `--teal` actually holds the *blue*,
> `--indigo` holds *violet*, `--coral` holds *cyan*. Reason in **roles** (`--primary`/`--buy`/`--sell`),
> which are the canonical aliases in `tokens/colors.css`.

**Type.** Display/headings in **Geist** (800 display, 700 headings, tight −0.02em tracking); body & UI
in **Inter** (400/500/600); numerics & data in **IBM Plex Mono** with tabular figures. Overline labels
are 13px Inter 600 UPPERCASE with +0.05em tracking. Display scale tops out at 40px (desktop) / 28px (mobile).

**Spacing & shape.** 4 / 8 base rhythm. Canonical card radius **14px** (desktop) / 16px (mobile);
pills & avatars are fully round (999); large hero tiles 22px. Generous internal padding (16–24px).

**Surfaces & elevation.** Cards are white (`--surface`) on a near-white app background (`--bg #F8FAFC`),
with a **1px hairline border (`--border`)** plus a **subtle navy-tinted shadow** — `--shadow-sm` at rest,
lifting to `--shadow` on hover. Shadows are soft and low-contrast, never heavy or colored. No glassmorphism
in product chrome (the mobile device frame is the only place liquid-glass appears).

**Backgrounds.** Flat tints — no photographic or illustrated backgrounds in the app. The one place
**gradient** is used intentionally is the property hero banner (brand blue → cyan, 135°), echoing the
logo mark. No repeating patterns, textures, or grain.

**Motion.** Restrained. Transitions use `--ease cubic-bezier(.2,.7,.3,1)` at `--dur 150ms`. Hover lifts a
control −1 to −2px with a shadow bump; progress/journey fills animate width ~400ms. No bounces, no
infinite/looping decorative animation. Respect reduced-motion.

**Interaction states.** Hover = subtle background fill (`--bg-2`) for nav/list rows, or a −1px lift +
shadow for buttons/cards. Active controls (segmented role switcher, selected nav) = elevated white chip
or a `--primary` tint background with primary-colored text/border. Disabled = 50% opacity.

**Borders & dividers.** Hairline `--border` everywhere; `--border-2` for stronger separation and
empty-state dashed "add" affordances. List rows are separated by full-width hairline dividers, dropped on
the last row.

**Imagery vibe.** Cool and clean. When real imagery is added it should read crisp and daylight-neutral
(proptech listing photography), never warm-filtered or moody.

**Dark mode.** First-class. `[data-theme="dark"]` swaps surfaces to navy (`#162033` cards on `#0F172A`),
inverts ink, deepens shadows to neutral black, and slightly raises accent-tint opacity. Both themes are
required to work for any new UI.

---

## Iconography

- **System:** the source apps use hand-placed **inline stroke SVGs**; this design system standardizes on
  the **[Lucide](https://lucide.dev)** set (1.75 stroke weight, round caps/joins) as the closest match.
  ⚠️ **Substitution flagged** — if TARS has a canonical icon set, drop it in and we'll re-point `Icon`.
- **Component:** use `<Icon name="…" />` (from `components/core/Icon.jsx`). A curated subset is inlined so
  cards/kits render offline; `ICON_NAMES` lists them. For anything outside the subset, load the full
  Lucide CDN set with the same stroke settings.
- **Color:** icons inherit `currentColor`, so they tint to their `IconChip` tone or surrounding text.
- **No emoji** as iconography in product UI (the mobile source had a couple of emoji placeholders in
  early components — treat those as legacy, not the standard). No unicode-glyph icons except the journey
  check (✓) inside step markers.
- **Logo:** `assets/tars-logo.svg` (lockup) and `assets/tars-mark.svg` (mark only) are a **reconstruction**
  — a gradient rounded-square mark (blue→cyan) with a house glyph + "TARS / HOME OWNERSHIP" wordmark in
  Geist. ⚠️ Replace with the official logo when available.

---

## What's in here (index)

**Foundations**
- `styles.css` — root entry; `@import`s everything (link this one file).
- `tokens/colors.css` · `tokens/typography.css` · `tokens/spacing.css` · `tokens/fonts.css` · `tokens/base.css`
- `guidelines/*.card.html` — specimen cards (Colors, Type, Spacing, Brand) shown on the Design System tab.

**Components** (`components/`, exposed on `window.TARSDesignSystem_*`)
- core: `Button`, `Card`, `Pill`, `Badge`, `Avatar`, `IconChip`, `Icon`
- patterns: `KPICard`, `ProgressBar`, `StageStep`, `ListRow`
- Each has a `.d.ts` (props), a `.prompt.md` (usage), and a directory `@dsCard` HTML.

**UI kits** (`ui_kits/`)
- `desktop/` — homeowner web app: dashboard + broker pipeline, role & theme switching (`index.html`).
- `mobile/` — iOS app: dashboard / journey / team in a device frame (`index.html`).

**Assets** (`assets/`) — `tars-logo.svg`, `tars-mark.svg`.

**Other** — `SKILL.md` (Agent-Skill manifest), this `readme.md`.

---

## Using the system
- Link `styles.css`; use the `--primary` / `--buy` / `--sell` role aliases and semantic text/surface tokens
  — **never hardcode hex or px**.
- Mount components from `window.TARSDesignSystem_*` after loading `_ds_bundle.js` (run `check_design_system`
  for the exact namespace).
- Keep both light and dark working; follow the 4/8 spacing rhythm and the calm, second-person voice above.
