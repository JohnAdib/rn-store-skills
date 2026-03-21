# Pre-Submission Checklist

Run through this checklist before every submission to either store.
Each item links back to the relevant guideline in the reference files.

---

## Both Stores

- [ ] **Privacy policy** is linked, accessible, and accurate
  - Accessible from within the app (settings or onboarding)
  - Linked in store listing metadata
  - Accurately describes all data collection including third-party SDKs
- [ ] **Data collection declared** — App Store Privacy Labels (Apple) / Data Safety section (Google)
  - Includes data from ALL third-party SDKs
  - Matches what the privacy policy says
- [ ] **No crashes** on launch or during core user flows
  - Tested on multiple device sizes and OS versions
  - Tested on real devices, not just simulator/emulator
- [ ] **No placeholder content** — remove all test/dummy/lorem ipsum content
  - No "coming soon" sections
  - No beta/test labels
  - No debug logs or developer tools visible
- [ ] **Metadata matches app** — screenshots, description, and title reflect actual functionality
  - Screenshots taken from the actual build being submitted
  - No features described that don't exist yet
- [ ] **Third-party licenses** respected — open source attributions included where required
- [ ] **Payments work correctly**
  - Digital goods use platform IAP (Apple IAP / Google Play Billing)
  - Physical goods/services can use external payment
  - Subscription screens show price, duration, cancellation terms
- [ ] **UGC features** (if applicable) have all three: reporting, blocking, content filtering
- [ ] **Permission strings** are specific and meaningful
  - Each permission explains exactly why it's needed
  - No over-requesting — only permissions the app actually uses
- [ ] **App works without optional permissions** being granted
  - Denying camera, location, etc. doesn't crash the app
  - Graceful degradation with clear messaging

---

## Apple-Specific

- [ ] **Sign in with Apple** implemented if using any third-party login
  - Uses official Apple button style
  - Handles "Hide My Email" relay
- [ ] **PrivacyInfo.xcprivacy** file is present and accurate
  - Declares reasons for all privacy-sensitive APIs
  - Includes declarations for third-party native modules
- [ ] **App Tracking Transparency** prompt shown if tracking users
  - Shown before any tracking occurs
  - Doesn't gate functionality on acceptance
  - Purpose string is specific and clear
- [ ] **No unused background modes** declared in Info.plist
  - Each `UIBackgroundModes` entry is actively used
  - Third-party libraries haven't added modes you don't need
- [ ] **Subscription screens** (if applicable) show:
  - Price in local currency
  - Duration (weekly/monthly/yearly)
  - What happens when subscription ends
  - Free trial details and when billing starts
  - Link to subscription management
  - Terms of Service link
  - Privacy Policy link
- [ ] **Info.plist permission descriptions** are specific (not generic)
  - "Used to scan barcodes for price comparison" not "This app needs camera access"
- [ ] **Uses iOS 26 SDK or later** (as of April 2026)
  - Check Xcode version and build settings
- [ ] **No beta references** — no "beta", "test", "preview", "demo" in UI text or metadata
- [ ] **Demo account provided** (if login required)
  - Include credentials in the App Review notes
  - Account must be pre-populated with enough data to demonstrate all features

---

## Google Play-Specific

- [ ] **Targets Android 15 (API 35)** or later
  - Check `targetSdkVersion` in `android/app/build.gradle`
- [ ] **Published as AAB** (not APK)
  - `./gradlew bundleRelease` or `eas build --platform android`
- [ ] **ProGuard/R8 enabled** with correct keep rules
  - Tested release build on real device
  - No runtime crashes from missing keep rules
- [ ] **Foreground service types** declared for all foreground services
  - Each service has a valid `foregroundServiceType`
  - Corresponding permissions are declared
- [ ] **Closed testing completed** (new apps only)
  - At least 12 testers opted in
  - 14 consecutive days of testing
- [ ] **16 KB page size** compatibility verified for native libraries
  - Custom native modules tested on Android 15 device/emulator
- [ ] **Play Billing Library v7+** for in-app purchases
  - `react-native-iap` or RevenueCat is up to date
- [ ] **No excessive notifications**
  - Notification permission requested at appropriate time
  - No deceptive or misleading notifications
- [ ] **Account deletion** available in-app (if account creation is offered)
  - Users can delete their account without contacting support
  - Data deletion policy is clear
- [ ] **Data Safety section** matches privacy policy
  - All SDK data collection is declared
  - Sharing and deletion details are accurate

---

## Build Verification (Both Platforms)

- [ ] **Release build tested on real device** — not just debug/simulator
- [ ] **All deep links tested** from cold start, background, and external apps
- [ ] **Offline behavior verified** — shows clear offline state, doesn't crash
- [ ] **Memory usage acceptable** — no OOM crashes on low-end devices
- [ ] **App size under 200MB** — or uses on-demand resources for large assets
- [ ] **Hermes engine tested** (if using) — check Intl, regex, and date operations in release mode
- [ ] **Certificate/signing valid** — not expired, correct team/account
- [ ] **Version number incremented** — higher than the current live version
