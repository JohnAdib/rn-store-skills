---
name: asc-toolkit
description: >
  App Store Connect automation toolkit — build, sign, release, metadata,
  TestFlight, pricing, screenshots, crash triage, and ASO via asc CLI.
  Use for any App Store Connect or TestFlight task.
---

# App Store Connect Toolkit

Automate App Store Connect workflows using the `asc` CLI. This skill covers
building, signing, releasing, metadata management, TestFlight, pricing,
screenshots, crash diagnostics, and App Store Optimization.

## How to Use This Skill

When a developer needs to perform any App Store Connect operation:

1. **Identify the task** from the quick decision guide below
2. **Load the relevant reference file** — only load what's needed
3. **Follow the commands** in the reference file
4. **Check troubleshooting** if something fails

## Reference Files

This skill uses progressive loading. Only read what's relevant.

### Build & Distribution

| Task | File |
|------|------|
| Build, archive, export IPA/PKG | `references/xcode-build.md` |
| Track build processing, find builds, cleanup | `references/build-lifecycle.md` |
| macOS notarization (Developer ID) | `references/notarization.md` |
| Certificates, profiles, bundle IDs, capabilities | `references/signing-setup.md` |

### Release & Review

| Task | File |
|------|------|
| Submit to App Store, phased release, rollout | `references/release-flow.md` |
| TestFlight groups, testers, builds, beta review | `references/testflight-ops.md` |
| Pre-submission readiness checks | `references/submission-health.md` |

### Metadata & Localization

| Task | File |
|------|------|
| Sync/translate metadata across 37+ locales | `references/metadata-sync.md` |
| Supported App Store locales list | `references/locales.md` |
| Generate localized release notes | `references/whats-new-writer.md` |
| Localize subscription/IAP display names | `references/subscription-localize.md` |
| RevenueCat catalog sync | `references/revenuecat.md` |

### Marketing & Optimization

| Task | File |
|------|------|
| ASO audit — keywords, metadata scoring | `references/aso-audit.md` |
| Screenshot capture, framing, upload | `references/screenshots.md` |

### Diagnostics & Pricing

| Task | File |
|------|------|
| Crash triage, beta feedback, performance | `references/crash-triage.md` |
| Territory pricing, PPP, introductory offers | `references/pricing.md` |

### Utilities

| Task | File |
|------|------|
| asc CLI reference — commands, flags, auth | `references/cli-usage.md` |
| Multi-step asc CLI workflow examples | `references/cli-workflows.md` |
| Resolve IDs — apps, builds, groups, testers | `references/id-resolver.md` |

## Quick Decision Guide

| Task | Files to Read |
|------|--------------|
| Build and upload to ASC | `xcode-build.md` + `signing-setup.md` |
| Release to App Store | `release-flow.md` + `submission-health.md` |
| Set up TestFlight | `testflight-ops.md` + `build-lifecycle.md` |
| Update app metadata | `metadata-sync.md` + `locales.md` |
| Write release notes | `whats-new-writer.md` |
| Set up subscriptions/IAP | `subscription-localize.md` + `pricing.md` |
| Optimize for search | `aso-audit.md` + `metadata-sync.md` |
| Capture screenshots | `screenshots.md` |
| Debug crashes | `crash-triage.md` |
| Set up code signing | `signing-setup.md` |
| Notarize macOS app | `notarization.md` |
| Learn asc CLI | `cli-usage.md` + `cli-workflows.md` |
| Find an ASC ID | `id-resolver.md` |
| RevenueCat sync | `revenuecat.md` + `subscription-localize.md` |
