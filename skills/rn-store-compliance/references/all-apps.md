# Universal Checklist — Every App, Both Stores

Master checklist loaded for every app regardless of type or category.

---

## Pre-Submission Essentials

- [ ] App is final, complete, and tested on real devices
- [ ] No placeholder/Lorem ipsum content anywhere
- [ ] No beta/test/preview/demo labels in UI
- [ ] Backend services live during review
- [ ] Demo account provided if login required (pre-populated with data)
- [ ] IAP items findable and functional
- [ ] Review notes describe non-obvious features

## Metadata

- [ ] App name ≤ 30 chars, no trademark stuffing
- [ ] No pricing info or other app names in metadata
- [ ] No competitor platform names (no "Android" on Apple, no "iOS" on Google)
- [ ] Screenshots show actual app in use (current build)
- [ ] Category accurately reflects primary function
- [ ] What's New describes actual changes
- [ ] No unverifiable superlative claims ("best", "#1")

## Privacy & Data

- [ ] Privacy policy linked in store listing AND accessible in-app
- [ ] Privacy policy accurately describes ALL data collection (including SDKs)
- [ ] Consent obtained before collecting personal data
- [ ] Only request data relevant to core functionality
- [ ] Account deletion available if account creation offered
- [ ] Third-party SDK data collection declared

## Apple-Specific

- [ ] Sign in with Apple if any third-party login offered
- [ ] Don't re-ask name/email after SIWA
- [ ] App Tracking Transparency prompt if tracking users
- [ ] PrivacyInfo.xcprivacy present with Required Reason API declarations
- [ ] Privacy Nutrition Labels accurate in App Store Connect
- [ ] Uses iOS 26 SDK or later (as of April 2026)
- [ ] App preview videos: screen captures only (no device frames)
- [ ] No Apple device images in app icon
- [ ] Info.plist permission descriptions are specific

## Google-Specific

- [ ] Targets Android 15 (API 35) or later
- [ ] Published as AAB (not APK)
- [ ] Data Safety section matches privacy policy
- [ ] Closed testing completed (12+ testers, 14 days) for new apps
- [ ] POST_NOTIFICATIONS runtime permission handled (Android 13+)
- [ ] 16 KB page size compatibility for native libraries

## Copyright & Intellectual Property

- [ ] All images properly licensed (owned, stock licensed, or CC0/permissive)
- [ ] No copyrighted music or audio without license
- [ ] No copyrighted video content without distribution rights
- [ ] Fonts properly licensed for mobile app embedding
- [ ] Open source licenses complied with (no GPL in App Store without compliance)
- [ ] AI-generated content does not depict real people without consent
- [ ] No screenshots or recordings of competitor apps
- [ ] DMCA / copyright takedown process if app hosts user content

## Legal Compliance

- [ ] GDPR consent before data collection (EU users)
- [ ] Account deletion available in-app (if account creation exists)
- [ ] Export compliance: `ITSAppUsesNonExemptEncryption` set in Info.plist
- [ ] COPPA compliance if targeting children under 13
- [ ] Age rating questionnaire completed honestly
- [ ] Terms of Service accessible in-app and on store listing
- [ ] Loot box / gacha odds disclosed before purchase (if applicable)
- [ ] Regional legal requirements checked (China AI terms, Russia data localization)

## Design & UX

- [ ] Not a copycat of another app
- [ ] Provides meaningful functionality beyond a website
- [ ] No pixelated or stretched images
- [ ] Handles dark mode without breaking
- [ ] Text readable with sufficient contrast

## Business

- [ ] Digital content uses platform IAP
- [ ] Not forcing ratings/reviews
- [ ] Support URL with working contact method
- [ ] Developer identity accurate and verifiable

## Build Verification

- [ ] Release build tested on real device (not simulator)
- [ ] All deep links tested from cold start, background, and external apps
- [ ] Offline behavior: shows clear state, doesn't crash
- [ ] Memory usage acceptable on low-end devices
- [ ] App size under 200MB
- [ ] Certificate/signing valid and not expired
- [ ] Version number incremented above current live version

## App Completeness

- [ ] Demo account provided in review notes (if login required)
- [ ] All premium features accessible during review (demo account unlocked or sandbox IAP instructions)
- [ ] No placeholder content (Lorem ipsum, stock photos as real content, "coming soon")
- [ ] No debug/staging labels or environment indicators in production
- [ ] Backend services live and stable during review period (24/7)
- [ ] All buttons and navigation destinations functional
- [ ] No hardcoded localhost/staging URLs in production build

## OTA Updates

- [ ] OTA (CodePush/Expo Updates) used only for bug fixes, not new features
- [ ] No hidden feature activation via remote config or date triggers
- [ ] Feature flags only toggle features already present in reviewed binary

## Related Rules

- See `rules/metadata.md` for metadata rejection patterns
- See `rules/privacy.md` for privacy rejection patterns
- See `rules/design.md` for design rejection patterns
- See `rules/performance.md` for crash/performance patterns
- See `rules/permissions.md` for permission patterns
- See `rules/subscriptions.md` if app has subscriptions/IAP
- See `rules/entitlements.md` for entitlement/capability issues
- See `rules/copyright-media.md` for copyright/IP/media issues
- See `rules/legal.md` for legal compliance (GDPR, COPPA, DMA, export)
- See `rules/ota-updates.md` for OTA/CodePush update violations
- See `rules/app-completeness.md` for demo accounts, placeholder content, backend readiness
