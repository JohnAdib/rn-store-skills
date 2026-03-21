# Round 01 — Initial Research

**Date**: 2026-03-21
**Goal**: Establish baseline knowledge for v1.0.0 skill creation

## Sources Consulted

### Existing Skills Repos
- https://github.com/truongduy2611/app-store-preflight-skills — App Store preflight skill
- https://github.com/rudrankriyam/app-store-connect-cli-skills — App Store Connect CLI skills
- https://github.com/vercel-labs/agent-skills — Vercel's official agent skills (includes react-native-guidelines)

### Apple Guidelines
- https://developer.apple.com/app-store/review/guidelines/ — Official Apple App Store Review Guidelines
- https://theapplaunchpad.com/blog/app-store-review-guidelines — iOS App Store Review Guidelines 2026
- https://nextnative.dev/blog/app-store-review-guidelines — App Store Review Guidelines Checklist
- https://twinr.dev/blogs/apple-app-store-rejection-reasons-2025/ — Common rejection reasons
- https://moldstud.com/articles/p-understanding-app-store-review-guidelines-a-essential-guide-for-react-native-developers — RN-specific guide

### Google Play Guidelines
- https://play.google.com/about/developer-content-policy/ — Official Google Play Developer Policy
- https://natively.dev/articles/app-store-requirements — Combined iOS & Android submission guide 2026

### Publishing / Distribution
- https://skills.sh — Skills discovery and CLI tool
- https://www.npmjs.com/package/skills — npm package for skills CLI
- https://github.com/sbroenne/skillpm — skillpm package manager
- https://github.com/antfu/skills-npm — Skills npm proposal

## Key Findings

### Skill Format
- Skills use `SKILL.md` as the main entry point with YAML frontmatter
- Multi-file skills are supported with `references/` directory for progressive loading
- Claude loads SKILL.md on trigger, then loads reference files on-demand
- skills.sh works purely through GitHub repos — no registration needed
- `npx skills add owner/repo` installs from any public GitHub repo

### Store Guidelines (2025-2026 Changes)
- Apple: iOS 26 SDK required from April 2026
- Apple: New age ratings (13+, 16+, 18+) from July 2025
- Apple: AI service disclosure requirements (consent modals for data sharing)
- Apple: PrivacyInfo.xcprivacy now required
- Google: Android 15 (API 35) target SDK required from August 2025
- Google: 16 KB page size compatibility for native libs
- Google: Play Billing Library v7+ required
- Google: Closed testing (12 testers, 14 days) for new apps
- Google: Account deletion requirement for apps with account creation

### React Native Specifics
- ~40% first-submission rejection rate
- Top RN-specific issues: Expo Go submissions, JS bundle errors, Hermes crashes,
  permission over-requesting, WebView-heavy apps
- Key RN libraries for compliance: react-native-iap, react-native-tracking-transparency,
  @invertase/react-native-apple-authentication, expo-in-app-purchases

## Gaps Identified for Future Rounds

- [ ] Detailed PrivacyInfo.xcprivacy API categories and required reason codes
- [ ] Complete list of Google Play Data Safety data types and categories
- [ ] Specific EAS Build configuration best practices
- [ ] React Native New Architecture compliance implications
- [ ] EU Digital Markets Act (DMA) impact on payment rules
- [ ] Specific Expo SDK version compatibility matrix
- [ ] App Store Connect API automation for compliance checks
- [ ] Google Play Console pre-launch report integration
- [ ] Accessibility requirements (WCAG compliance for both stores)
- [ ] Localization requirements and pitfalls
