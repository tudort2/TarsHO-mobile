# TARS — Mobile UI Kit

High-fidelity recreation of the TARS Home-Ownership **iOS app** (`TarsHO-mobile`). Reuses the shared design-system primitives inside an iPhone device frame.

## Run
Open `index.html`. A bottom tab bar switches between three built-out screens:
- **Home** — greeting, property hero, equity/rate KPIs, journey snapshot.
- **Journey** — the full ownership journey stepper with overall progress.
- **Team** — your contacts (loan officer, agent, closing coordinator).

## Files
- `index.html` — entry; wraps `MobileApp` in the iOS frame.
- `MobileApp.jsx` — all three tab screens + bottom tab bar (`window.MobileApp`).
- `ios-frame.jsx` — device bezel/status bar (starter component, `window.IOSDevice`).
- Data comes from `../desktop/data.js` (`window.TARS_DATA`) — shared with the desktop kit.

## Fidelity notes
Mobile mirrors the desktop hierarchy and accent roles (primary / buy / sell) per `DESIGN.md`, at ~10–15% smaller type. Dark mode works through the same `data-theme` tokens. The source app's role switching and live API data are out of scope for the kit.
