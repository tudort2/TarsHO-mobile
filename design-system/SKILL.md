---
name: tars-design
description: Use this skill to generate well-branded interfaces and assets for TARS, the home-ownership platform, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files (`tokens/`,
`components/`, `ui_kits/`, `guidelines/`, `assets/`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create
static HTML files for the user to view — link `styles.css`, use the `--primary` / `--buy` / `--sell`
role tokens, and reuse the components in `components/`. If working on production code, copy assets and
read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design,
ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code,
depending on the need.

Key reminders specific to TARS:
- Reason about color in **roles** (primary = blue, buy = violet, sell = cyan), not the legacy desktop
  var names (`--teal`/`--indigo`/`--coral` are mis-hued).
- Voice is calm, second-person, status-over-salesmanship; no emoji; numbers in tabular mono.
- Both light and dark (`data-theme`) must work. Follow the 4/8 spacing rhythm; card radius 14.
- Icons are Lucide stroke (via `components/core/Icon.jsx`); the logo in `assets/` is a reconstruction.
