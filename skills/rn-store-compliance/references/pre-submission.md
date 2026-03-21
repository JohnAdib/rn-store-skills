# Pre-Submission Checklist

Run through before every submission. Links to relevant rules and guidelines.

---

## Both Stores

- [ ] **Privacy policy** linked, accessible, accurate
  - In-app (settings or onboarding) + store listing
  - Describes ALL data collection including third-party SDKs
- [ ] **Data collection declared** — Privacy Labels (Apple) / Data Safety (Google)
  - Includes data from ALL third-party SDKs
  - Matches privacy policy
- [ ] **No crashes** on launch or core user flows
  - Real devices, multiple sizes, multiple OS versions
  - See `rules/performance.md`
- [ ] **No placeholder content** — no Lorem ipsum, "coming soon", beta labels, debug logs
- [ ] **Metadata matches app** — screenshots, description, title reflect actual functionality
  - See `rules/metadata.md`
- [ ] **Third-party licenses** respected
- [ ] **Payments correct**
  - Digital goods → platform IAP
  - See `rules/subscriptions.md` + `features/subscriptions.md`
- [ ] **UGC features** (if any) have: reporting, blocking, content filtering
  - See `features/ugc.md`
- [ ] **Permission strings** specific and meaningful
  - See `rules/permissions.md`
- [ ] **App works** without optional permissions granted (no crashes, graceful degradation)
- [ ] **Account deletion** available in-app if account creation offered

---

## Apple-Specific

- [ ] **Sign in with Apple** if using any third-party login
  - See `rules/design.md`
- [ ] **PrivacyInfo.xcprivacy** present and accurate
  - See `rules/privacy.md`
- [ ] **App Tracking Transparency** prompt if tracking users
  - Shown before tracking, doesn't gate functionality
- [ ] **No unused background modes** in Info.plist
  - See `rules/entitlements.md`
- [ ] **Subscription screens** show: price, duration, end terms, trial details, ToS link, PP link
  - See `rules/subscriptions.md`
- [ ] **Info.plist permission descriptions** are specific
  - See `rules/permissions.md`
- [ ] **Uses iOS 26 SDK or later** (April 2026+)
- [ ] **App preview videos** — screen captures only, no device frames
  - See `rules/metadata.md`
- [ ] **Demo account** provided if login required (pre-populated with data)

---

## Google Play-Specific

- [ ] **Targets Android 15 (API 35)+**
- [ ] **Published as AAB** (not APK)
- [ ] **ProGuard/R8 enabled** with correct keep rules, tested on real device
- [ ] **Foreground service types** declared for all foreground services
  - See `rules/entitlements.md`
- [ ] **Closed testing** completed (new apps: 12+ testers, 14 days)
- [ ] **16 KB page size** compatibility for native libraries
- [ ] **Play Billing Library v7+** for IAP
- [ ] **POST_NOTIFICATIONS** runtime permission handled (Android 13+)
- [ ] **Data Safety section** matches privacy policy

---

## Build Verification (Both)

- [ ] **Release build tested on real device**
- [ ] **All deep links tested** from cold start, background, external apps
- [ ] **Offline behavior** — clear state, no crash
- [ ] **Memory usage** acceptable on low-end devices
- [ ] **App size under 200MB**
  - See `rules/performance.md`
- [ ] **Hermes tested** in release mode (Intl, regex, dates)
- [ ] **Certificate/signing valid** and not expired
- [ ] **Version number incremented** above current live version

---

## App-Type Specific

Load the relevant checklist based on your app type:

- Social/messaging → `app-types/social.md`
- Kids → `app-types/kids.md`
- Health/fitness/medical → `app-types/health-fitness.md`
- Games → `app-types/games.md`
- AI/generative AI → `app-types/ai.md`
- Crypto/finance → `app-types/crypto-finance.md`
- VPN → `app-types/vpn.md`
- macOS → `features/macos.md`
- Has subscriptions/IAP → `features/subscriptions.md`
- Has UGC → `features/ugc.md`
