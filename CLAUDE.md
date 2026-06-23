# TARS — Project Memory for Claude

## What TARS Is
TARS (The Autonomous Real-estate System) is a full-stack homeownership platform with two client apps sharing one backend. Desktop and mobile are developed in parallel: desktop/server moves first, mobile follows.

---

## Repository Layout

| Repo | Path | Tech |
|------|------|------|
| **Desktop + Server** | `C:\Users\tudor\OneDrive\Documents\GitHub\TarsHO` | Vanilla JS/HTML + Node.js/Express + PostgreSQL |
| **Mobile** | `C:\Users\tudor\OneDrive\Documents\GitHub\TarsHO-mobile` | React Native + Expo SDK 54 |
| **Backend (live)** | Railway | `https://tarsho-production.up.railway.app` |

---

## Desktop App (`TarsHO/`)

### Structure
```
TarsHO/
  public/index.html      ← entire frontend (single-file vanilla JS/HTML)
  server/
    index.js             ← Express entry point (port 3000 / Railway)
    routes/
      auth.js            ← POST /api/auth/login, /register, /switch-role
      contacts.js        ← CRUD + interactions: GET/POST/PUT/DELETE /api/contacts
      engagements.js     ← GET/POST/PATCH /api/engagements, stages, advance
      properties.js      ← GET/POST/PUT/DELETE /api/properties
      market.js          ← market data endpoints
      invitations.js     ← invitation flow
      admin.js           ← admin panel endpoints
    db/
      pool.js            ← pg connection pool
      migrate.js / seed.js
    middleware/
      auth.js            ← requireAuth, requireRole
    services/
      mls.js             ← MLS integration
```

### Desktop Views (data-view names in index.html)
- `dashboard` — homeowner dashboard (properties, net worth, My Next Home)
- `properties` — property list/detail
- `contacts` — broker CRM (Buyer/Seller/Both contacts)
- `customers` — homeowner contacts (Broker/Provider/Personal)
- `mywork` — broker My Work (active client tiles with house images)
- `research` — market research / charts
- `provider-work` — provider work queue
- `provider-services` — provider services catalog
- `admin-accounts` — admin user management
- `spec` — spec/journey view
- `buyer-page` / `seller-page` — buy/sell engagement journey

---

## Mobile App (`TarsHO-mobile/`)

### Structure
```
TarsHO-mobile/
  App.tsx
  src/
    api/client.ts           ← all API calls, BASE_URL = Railway
    context/
      AuthContext.tsx        ← JWT login/logout/switchRole, AsyncStorage
      ThemeContext.tsx       ← light/dark, useColors(), useTheme()
    theme/index.ts           ← Spacing, Radius, Typography, Colors (=LightColors)
    types/index.ts           ← Contact, Engagement, Property, etc.
    utils/initials.ts        ← getInitials() — filters non-alpha tokens
    navigation/AppNavigator.tsx
    components/
      TopBar.tsx             ← { title, right? }
      RoleSwitcher.tsx       ← self-contained modal, no props
    screens/
      LoginScreen.tsx
      ProfileScreen.tsx
      homeowner/
        DashboardScreen.tsx
        PropertyDetailScreen.tsx
        JourneyScreen.tsx
        HomeownerContactsScreen.tsx   ← Broker/Provider/Personal contacts
        HomeownerContactDetailScreen.tsx ← view + edit for HO contacts
      broker/
        BrokerCRMScreen.tsx           ← Buyer/Seller/Both contacts
        ContactDetailScreen.tsx       ← view + edit (broker fields + desiredProperty)
        MyWorkScreen.tsx              ← active client tiles w/ house images
        EngagementDetailScreen.tsx    ← frozen header + scrollable timeline
```

### Navigation Stacks
```
AppNavigator
├── HomeStack:               Dashboard → PropertyDetail
├── HomeownerContactsStack:  HomeownerContacts → HomeownerContactDetail
├── BrokerCRMStack:          BrokerCRM → ContactDetail
└── MyWorkStack:             MyWork → EngagementDetail
```

### Roles & Tab Sets
| Role | Tabs |
|------|------|
| `homeowner` | Home, Journey, Contacts, Profile |
| `broker` | My Work, Contacts, Profile |

---

## Shared Backend API (Railway)

Base URL: `https://tarsho-production.up.railway.app`

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/auth/login` | `{ email, password }` → `{ token, user }` |
| POST | `/api/auth/register` | |
| POST | `/api/auth/switch-role` | |
| GET | `/api/contacts` | `?status=&type=&search=` — scoped to `owner_id` |
| POST | `/api/contacts` | |
| GET | `/api/contacts/:id` | includes interactions |
| PUT | `/api/contacts/:id` | |
| DELETE | `/api/contacts/:id` | |
| POST | `/api/contacts/:id/interactions` | log interaction |
| GET | `/api/engagements` | active engagements for user |
| POST | `/api/engagements` | seeds default buy/sell stages |
| GET | `/api/engagements/:id` | |
| PATCH | `/api/engagements/:id/advance` | move to next stage |
| GET | `/api/properties` | |
| POST | `/api/properties` | |
| PUT | `/api/properties/:id` | |

### Contact Types
- **Broker contacts** (Buyer/Seller/Both): shown in BrokerCRM + MyWork
- **Homeowner contacts** (Broker/Provider/Personal): shown in HomeownerContacts

### Engagement Stages (buy — 16 stages, sell — different set)
Default stage durations (days): Initial Contact=1, Needs Assessment=3, Pre-Approval=7, Property Search=30, Offer Submitted=3, Under Contract=2, Inspection=10, Appraisal=14, Final Walkthrough=1, Closing=3, Post-Close=7

---

## Multi-Variant Build & Deployment System (11 parallel apps)

> **Collaborators & Claude instances: read this whole section before touching any branch.**

### Concept
TarsHO-mobile ships **11 independently-installable apps on one phone** — `main` plus `ui-v1`…`ui-v10`. This lets us build, install, and compare up to 11 UI solutions side-by-side on the same device at the same time. Each is a genuinely separate app (own home-screen icon and name) because each has a **unique native bundle identifier**.

### Golden rules (do not violate without the repo owner's explicit OK)
1. **Work only in the branch you are told to work in.** A human assigns the branch (e.g. "work in `ui-v4`"). Commit and push to **that branch only** — never merge variants into each other.
2. **`ui-v1`…`ui-v10` are LOCKED saved solutions.** Never rebuild, `reset --hard`, or force-push any of them without the repo owner's **explicit** confirmation. `ui-v1` is deliberately kept on older code as a saved snapshot — do **not** "update" it to `main`.
3. **Never cross-copy identity files.** The only files that legitimately differ between a variant and `main` are the 3 identity files listed below. App/feature code is developed normally on each branch.

### Branch identity — ONE shared EAS project
Every branch shares the SAME EAS project. These values are **identical on all branches — never change them per branch**:
`slug: tars-app` · `owner: tudor.toma.team` · `projectId: c7136656-ad3a-4921-9f8d-9c8580d87360` · `updates.url` (same projectId)

Only the per-branch **identity** differs:

| Branch | `app.json` name | bundleIdentifier / package | channel |
|--------|-----------------|----------------------------|---------|
| main   | TARS            | com.tarsusa.homeownership  | main    |
| ui-v1  | TARS v1         | com.tarsusa.app.v1         | ui-v1   |
| ui-v2  | TARS v2         | com.tarsusa.app.v2         | ui-v2   |
| ...    | TARS vN         | com.tarsusa.app.vN         | ui-vN   |
| ui-v10 | TARS v10        | com.tarsusa.app.v10        | ui-v10  |

**The 3 identity files** (everything else equals `main`):
- `app.json` — `expo.name` + `ios.bundleIdentifier` + `android.package`
- `eas.json` — `"channel": "<branch>"` on the development / preview / production build profiles
- `src/config/variant.ts` — `VARIANT` / `CHANNEL` / `VARIANT_NUMBER` (in-app marker; auto-generated, not imported by app code)

**Why unique bundle IDs?** Two apps with the same bundle ID cannot coexist on a device — the OS treats them as the same app (install one → it replaces the other). Parallel install is controlled **only** by the bundle ID, not by how many EAS projects exist. EAS Update **channels** (= branch name) then keep each app's over-the-air updates separate.

### Deploy / build — `deploy-tars.ps1` (run from repo root, PowerShell, Windows)
The script checks out the branch, runs `git reset --hard origin/<branch>` (⚠️ discards local changes), `npm install --legacy-peer-deps`, then either builds a native binary or pushes an OTA update.

```powershell
# FIRST install of an app on the phone — native build (unique bundle ID -> own icon):
.\deploy-tars.ps1 4 -Mode build -Platform android     # ui-v4, Android APK
.\deploy-tars.ps1 4 -Mode build -Platform ios         # ui-v4, iOS
.\deploy-tars.ps1   -Mode build -Platform android     # no number / Enter = main

# FAST day-to-day iteration once the app is installed — OTA JS update to its channel:
.\deploy-tars.ps1 4 -Mode update                      # default mode is "update"
```
- Branch arg: `1`…`10` = `ui-v1`…`ui-v10`; empty/Enter = `main`.
- **`-Mode build`** → `eas build` → a native binary. Install it from the EAS URL/QR it prints. Run once per app, and again only when native config changes (bundle ID, native deps, app icon).
- **`-Mode update`** (default) → `eas update --channel <branch>` → pushes only the JS bundle to an already-installed app. Fast; use for everyday changes.

**Prerequisites:** `eas login` (or set `EXPO_TOKEN`) + EAS build credits. **Android** internal builds install directly from a URL/QR. **iOS** side-loading needs an Apple Developer account with each test device's UDID registered (ad-hoc distribution).

### Rebuilding a variant onto the latest `main` (owner approval required)
Each variant = **`main`'s exact code** + one identity commit. `CLAUDE.md` and `deploy-tars.ps1` live on `main` and reach a variant only when that variant is rebuilt from `main`. To bring a variant up to the current shared code (force-push — get explicit owner OK first):
```bash
git checkout -B ui-vN main
#   set the 3 identity files for ui-vN (name, bundleId+package, channel x3, variant.ts)
git add app.json eas.json src/config/variant.ts
git commit -m "config: ui-vN identity on current solution"
git push --force-with-lease origin ui-vN
```

### Backend
All 11 apps share ONE backend: `https://tarsho-production.up.railway.app` (see the API table above). The variant system is client-side only and does not affect the backend.

---

## Key Theme Colors (ThemeContext)
```ts
LightColors: bgBase #F8FAFC, bgSurface #FFFFFF, textPrimary #0F172A, primary #2563EB
DarkColors:  bgBase #0F172A, bgSurface #162033, textPrimary #F8FAFC
Shared:      buy #8B5CF6, sell #06B6D4, success #22C55E, warning #F59E0B, danger #EF4444
```

---

## Desktop → Mobile Feature Gap (as of June 2026)

### Mobile has, Desktop also has ✅
- Login / auth
- Homeowner dashboard + property tiles
- Homeowner buy/sell journey
- Homeowner contacts (Broker/Provider/Personal) — list, view, edit
- Broker CRM (Buyer/Seller/Both) — list, view, edit, log interaction
- Broker My Work — active client tiles with house images
- Broker engagement detail — frozen header, days timeline, mark/unmark stages
- Light/Dark theme
- Profile screen

### Desktop has, Mobile is missing ❌
- **Research view** — market charts, comparable sales
- **Provider role** — provider-work + provider-services screens
- **Admin panel** — admin-accounts view
- **Contact creation** (Add new contact form) — mobile only views/edits existing
- **Engagement creation** (Start Engagement flow) — mobile only advances existing
- **Property creation/edit** — mobile only views
- **Invitations** — invite homeowner/broker flow
- **Market data** — `renderRail`, `renderResearchCharts`
- **Home Digest / Newsletter toggles** on contacts

---

## Development Notes
- Always use `useColors()` hook for colors (not static `Colors` import) in new screens
- `getInitials(name)` — import from `../../utils/initials`, filters non-alpha tokens
- House images: same 4 Unsplash IDs used in Dashboard + MyWork (cycled by index)
- `api.contacts.list()` returns contacts scoped to the logged-in user's `owner_id`
- Engagement `stages[]` may be empty if fetched without stage join — `buildStages()` synthesizes from `currentStage`/`totalStages` in that case
