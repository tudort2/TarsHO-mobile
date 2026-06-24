# TARS Mobile — Build & Deployment (Expo / EAS)

> Team quick-reference. Full detail lives in `CLAUDE.md` (top section) on every branch.

## What it is
One repo (`tudort2/TarsHO-mobile`) powers **11 separately-installable apps** that can all live on one phone at the same time — `main` plus design variants `mv1`–`mv10`. Each is a real, distinct app (its own home-screen icon) because each has a **unique bundle identifier**. They all share **one EAS/Expo project** and **one backend** (`https://tarsho-production.up.railway.app`).

## Branch identities
Shared across all branches (never change): EAS `projectId c7136656-ad3a-4921-9f8d-9c8580d87360`, `slug tars-app`, `owner tudor.toma.team`. Only these differ per branch:

| Branch | App name | Bundle ID (iOS/Android) | EAS channel |
|---|---|---|---|
| `main` | TARS | `com.tarsusa.homeownership` | `main` |
| `mv1` *(frozen)* | TARS v1 | `com.tarsusa.app.v1` | `mv1` |
| `mv2` … `mv10` | TARS v2 … v10 | `com.tarsusa.app.v2` … `.v10` | `mv2` … `mv10` |

The only 3 files that differ from `main` on a variant: `app.json` (name + bundle ID), `eas.json` (channel), `src/config/variant.ts` (marker). *(App names/bundle IDs are internal — refer to variants as `mv(n)`.)*

## How to build / deploy
Run from the repo root on Windows:

```powershell
# FIRST install of an app on the phone — native build (own icon, installs alongside others):
.\deploy-tars.ps1 4 -Mode build -Platform android     # mv4, Android APK
.\deploy-tars.ps1 4 -Mode build -Platform ios         # mv4, iOS

# FAST iteration after it's installed — OTA JS push to that app's channel:
.\deploy-tars.ps1 4 -Mode update                       # default mode
```

- Variant arg: `1`–`10` = `mv1`–`mv10`; empty/Enter = `main`. (You can also pass `mv4` directly.)
- `deploy-tars.bat 4` does the same (it auto-downloads the latest `deploy-tars.ps1` from `main`).
- **`-Mode build`** (`eas build`) = a native binary with that branch's unique bundle ID → install once per app, and again when native config changes (bundle ID, native deps, icon).
- **`-Mode update`** (`eas update --channel mvN`) = JS-only OTA to an already-installed app; fast, for everyday changes.

## Why unique bundle IDs
Two apps with the same bundle ID can't coexist on a device — the OS treats them as one (install one → it replaces the other). Parallel install is controlled **only** by the bundle ID; EAS channels then keep each app's OTA updates separate.

## Prerequisites
`eas login` (or `EXPO_TOKEN`) + EAS build credits. **Android** internal builds install straight from a URL/QR. **iOS** side-loading needs an Apple Developer account with each test device's UDID registered (ad-hoc distribution).

## Working rules
1. Work **only in your assigned branch** (e.g. "work in `mv4`"). Commit & push to that branch — never merge variants into each other.
2. **`mv1` is FROZEN** — never push/rebuild it without the owner's explicit OK.
3. `mv2`–`mv10` currently equal `main`; they diverge as each variant is developed.
4. Refer to variants as **`mv(n)`** in chat and scripts.
