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

## Mobile Deployment Workflow

1. **Edit files** → write to `outputs/tars-app/src/...`
2. **Run** `deploy-tars.bat` from `outputs/` folder (on Windows)
   - Copies `tars-app/` → `TarsHO-mobile/`
   - Runs `npm install --legacy-peer-deps`
   - Starts `npx expo start --tunnel --clear`
3. **Scan QR** with Expo Go on phone

> ⚠️ The bash sandbox's `/sessions/.../mnt/TarsHO-mobile/` is **NOT** a live Windows mount — writes there do NOT reach the real repo. Always write to `outputs/tars-app/` and run `deploy-tars.bat`.

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
