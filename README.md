# TARS Mobile App (React Native / Expo)

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli eas-cli`

### Install & Run
```bash
npm install
cp .env.example .env          # add your Railway URL
npx expo start                # scan QR with Expo Go app to preview
```

### Build for TestFlight (no Mac needed)
```bash
eas login                     # create free account at expo.dev
eas build:configure           # one-time setup
eas build --platform ios      # triggers cloud build on Expo's Mac servers
```
The build link will appear in your Expo dashboard. Submit to TestFlight directly from there.

## Project Structure
```
src/
  theme/       — Colors, spacing, typography tokens
  types/       — TypeScript interfaces
  data/        — Mock data (swap for real API calls)
  api/         — API client (update BASE_URL in client.ts)
  components/  — Shared UI: TopBar, RoleSwitcher
  navigation/  — Stack + Tab navigators
  screens/
    LoginScreen.tsx
    ProfileScreen.tsx
    homeowner/   — Dashboard, PropertyDetail, Journey (Buy/Sell)
    broker/      — BrokerCRM, ContactDetail
```

## Connecting to Your Railway Backend
Edit `src/api/client.ts` — set `BASE_URL` or add `EXPO_PUBLIC_API_URL` to your `.env` file.

## Screens
- **Login** — dark gradient, animated button, error handling
- **Role Switcher** — tap role chip in top bar to switch between homeowner/broker/provider/admin
- **Homeowner Dashboard** — net worth strip, buy/sell journey banners, property cards, task list
- **Property Detail** — stats grid, equity bar, mortgage breakdown, map placeholder
- **Buy/Sell Journey** — 16-stage vertical rail, tap any stage for checklist
- **Broker CRM** — stats strip, searchable/filterable contact list
- **Contact Detail** — tap-to-call/email/text, desired property card, interaction history
- **Profile** — role chips, change password modal, sign out
