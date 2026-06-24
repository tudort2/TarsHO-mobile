# TARS Design System — DESIGN.md

> **Unified design schema for the TARS Home-Ownership platform.** The desktop (`TarsHO`)
> and mobile (`TarsHO-mobile`) clients share this token system. **Read this file first**
> in any design session, map new UI to these tokens, and implement in the platform's
> token layer — **never hardcode raw hex/px values.**

This file was produced by design inference over the existing frontends. Keep it in sync
when tokens change.

---

## 1. Source of truth (where tokens are defined)

| Platform | Tokens live in |
|---|---|
| **Desktop** (`TarsHO`) | CSS custom properties in `public/index.html` → `:root{…}` (light) + `[data-theme="dark"]{…}` (dark). Mirrored in `public/bellevue-map.html`. Theme switch: `setTheme('light'\|'dark')` toggles `data-theme` on `<html>` and `postMessage`s iframes. |
| **Mobile** (`TarsHO-mobile`) | `src/context/ThemeContext.tsx` (`LightColors` / `DarkColors`, `useColors()` hook) and `src/theme/index.ts` (`Spacing`, `Radius`, `Typography`, `FontFamily`, `Shadow`). |

---

## 2. Color tokens

| Role | Desktop CSS var | Mobile token | Light | Dark |
|---|---|---|---|---|
| App background | `--bg` | `bgBase` | `#F8FAFC` | `#0F172A` |
| Background alt | `--bg-2` | — | `#F1F5F9` | `#0B1220` |
| Surface / card | `--surface` | `bgSurface` | `#FFFFFF` | `#162033` |
| Surface alt | `--surface-2` | — | `#F8FAFC` | `#0F172A` |
| Border | `--border` | `border` | `#E2E8F0` | `#1E293B` |
| Border strong | `--border-2` | — | `#CBD5E1` | `#2A3A55` |
| Text primary | `--ink` / `--text-primary` | `textPrimary` | `#0F172A` | `#F8FAFC` |
| Text secondary | `--ink-2` / `--text-secondary` | `textSecondary` | `#64748B` | `#94A3B8` |
| Text muted | `--ink-3` / `--text-muted` | `textMuted` | `#94A3B8` | `#64748B` |
| **Primary** (brand blue) | `--teal` | `primary` | `#2563EB` | `#2563EB` |
| Primary soft | `--teal-2` | — | `rgba(37,99,235,.12)` | `rgba(37,99,235,.18)` |
| **Buy** (violet) | `--indigo` | `buy` | `#8B5CF6` | `#8B5CF6` |
| Buy soft | `--indigo-2` | — | `rgba(139,92,246,.12)` | `rgba(139,92,246,.20)` |
| **Sell** (cyan) | `--coral` | `sell` | `#06B6D4` | `#06B6D4` |
| Sell soft | `--coral-2` | — | `rgba(6,182,212,.12)` | `rgba(6,182,212,.18)` |
| Success | `--success` | `success` | `#10B981` | `#34D399` |
| Warning | `--warning` | `warning` | `#F59E0B` | `#FCD34D` |
| Danger | `--danger` | `danger` | `#F43F5E` | `#FB7185` |

> ⚠️ **Desktop naming quirk:** the CSS var **`--teal` holds the brand _blue_** (`#2563EB`),
> **`--indigo` holds violet** (= mobile `buy`), **`--coral` holds cyan** (= mobile `sell`).
> Use the *role* (primary / buy / sell), not the literal var name, when reasoning about color.

Each accent has a `-2` "soft" tint for chip/pill/badge backgrounds.

---

## 3. Typography

**Families** — Display: `Geist → Inter → system`; Body: `Inter → system`; Mono: `IBM Plex Mono → system mono`.
Desktop: `--font-display`, `--font-sans`, `--font-mono`. Mobile: `FontFamily.display/body/mono` (currently system fallbacks until Google Fonts are loaded in `App.tsx`).

| Variant | Desktop (px) | Mobile `Typography` | Weight | Tracking |
|---|---|---|---|---|
| display | `--fs-display` 40 | 28 / lh 34 | 800 | -0.02em / -0.5 |
| h1 | `--fs-h1` 28 | 26 / lh 32 | 700 | -0.01em / -0.3 |
| h2 | `--fs-h2` 22 | 20 / lh 26 | 700 | -0.2 |
| h3 | `--fs-h3` 18 | 16 / lh 22 | 600 | -0.1 |
| body | `--fs-body` 14 | 14 / lh 20 | 400 (md 500, sb 600) | — |
| sm | — | 13 / lh 18 | 400 / 500 | — |
| label | `--fs-label` 13 | 11 / lh 14 | 600, **UPPERCASE** | +0.05em / +0.7 |
| meta / xs | `--fs-meta` 12 | 11 / lh 16 | 400 | — |
| mono / monoLg | (`--font-mono`) | 13 / 20 | 500 / 600 | tabular numbers |

Line-heights (desktop): `--lh-tight 1.1`, `--lh-snug 1.3`, `--lh-normal 1.5`.
Desktop display/heading sizes run slightly larger than mobile (screen size); keep the same hierarchy and weights.

---

## 4. Spacing (4 / 8 base scale)

| Token | xs | sm | md | lg | xl | xxl |
|---|---|---|---|---|---|---|
| Mobile `Spacing` | 4 | 8 | 16 | 24 | 32 | 48 |

Desktop uses the same 4/8 rhythm ad-hoc in CSS (no named vars yet); prefer multiples of 4.

## 5. Radius

| | sm | md / base | lg | xl | full |
|---|---|---|---|---|---|
| Desktop | `--radius-sm` 8 | `--radius` 14 | `--radius-lg` 22 | — | 999 (pills) |
| Mobile `Radius` | 6 | 12 | 16 | 24 | 999 |

Canonical card radius ≈ **14px desktop / 16px mobile**; pills/badges use **full (999)**.

## 6. Elevation / shadow

- **Desktop:** `--shadow-sm` (hairline), `--shadow` (card/raised), `--shadow-lg` (modal/popover) — subtle, navy-tinted.
- **Mobile:** `Shadow.sm / .md / .lg` (iOS `shadow*` + Android `elevation`).

## 7. Motion

Desktop: `--ease: cubic-bezier(.2,.7,.3,1)`, `--dur: 150ms`. Use for hover/theme transitions. Mobile: keep transitions ≤ ~180ms, ease-out.

---

## 8. Core component patterns

| Pattern | Desktop | Notes |
|---|---|---|
| **Pill / badge** | `.pill` + `.teal/.indigo/.coral/.warning` | radius full, soft bg + accent text |
| **Tile / card** | `.tile`, `.card` | `--surface` bg, 1px `--border`, radius 14, `--shadow-sm` → `--shadow` on hover |
| **Button** | `.btn.primary` (filled brand), `.btn.ghost` (subtle) | radius ~10 |
| **KPI / stat** | `.stat`, `.card .big` | mono numerals |
| **Chips / segmented / sliders** | filter controls | active state = primary border + `--teal-2` bg |

Mobile mirrors these via components in `src/components/` using `useColors()` + `Typography`.

---

## 9. Conventions (rules for edits)

1. **Never hardcode** colors/sizes — desktop: `var(--token)`; mobile: `useColors()` + `Spacing`/`Radius`/`Typography`.
2. On mobile, **use `useColors()`**, not the static `Colors` alias, in new/edited screens (dark-mode safe).
3. Keep desktop & mobile **visually consistent** — same hierarchy, same accent roles (primary / buy / sell), same spacing rhythm.
4. Light/dark must both work: desktop via `[data-theme]`, mobile via `ThemeContext` mode.
5. When adding a new token, add it to **both** source-of-truth files and update this table.
