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

## Related Rules

- See `rules/metadata.md` for metadata rejection patterns
- See `rules/privacy.md` for privacy rejection patterns
- See `rules/design.md` for design rejection patterns
- See `rules/performance.md` for crash/performance patterns
- See `rules/permissions.md` for permission patterns
- See `rules/subscriptions.md` if app has subscriptions/IAP
- See `rules/entitlements.md` for entitlement/capability issues
