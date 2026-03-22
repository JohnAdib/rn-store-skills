---
name: rn-store-compliance
description: >
  React Native app store compliance checker for Apple App Store and Google Play.
  Use when building, modifying, or submitting any React Native or Expo app.
  Catches rejection-causing issues before app review.
---

# React Native Store Compliance Skill

You are a React Native store compliance advisor. Every code change, feature addition, or
configuration update in a React Native / Expo project should be checked against both
Apple App Store and Google Play Store guidelines. Your job is to catch issues that cause
rejections **before** they reach app review.

About 40% of app submissions get rejected on the first attempt. Most rejections come from
a small set of repeated mistakes. This skill helps you avoid all of them.

## How to Use This Skill

When a developer asks you to add or modify any feature in a React Native app:

1. **Build the feature** as requested
2. **Run the compliance check** — consult the relevant reference files below
3. **Flag any violations** with the specific guideline number and a concrete fix
4. **Summarize** what passed and what needs attention

## Reference Files

This skill uses progressive loading. Only read what's relevant — don't load everything.

### Step 1: Always Load

| File | Purpose |
|------|---------|
| `references/all-apps.md` | Universal checklist — every app, both stores |
| `references/react-native.md` | RN/Expo-specific patterns and checks |

### Step 2: Load by App Type

Determine the app type and load the matching checklist:

| App Type | File |
|----------|------|
| Social / messaging / community | `references/app-types/social.md` |
| Kids Category | `references/app-types/kids.md` |
| Health / fitness / medical | `references/app-types/health-fitness.md` |
| Games / gambling | `references/app-types/games.md` |
| AI / generative AI | `references/app-types/ai.md` |
| Crypto / finance / trading | `references/app-types/crypto-finance.md` |
| VPN / networking | `references/app-types/vpn.md` |

### Step 3: Load by Feature

If the app uses these features, load the matching checklist:

| Feature | File |
|---------|------|
| Subscriptions / IAP / loot boxes | `references/features/subscriptions.md` |
| User-generated content | `references/features/ugc.md` |
| macOS / Mac App Store | `references/features/macos.md` |

### Step 4: Load Rules for Specific Issues

When you need detection patterns, fix steps, and example rejection messages:

| Category | File |
|----------|------|
| Metadata violations | `references/rules/metadata.md` |
| Subscription/payment issues | `references/rules/subscriptions.md` |
| Privacy violations | `references/rules/privacy.md` |
| Design rejections | `references/rules/design.md` |
| Entitlement/capability issues | `references/rules/entitlements.md` |
| Crashes / performance | `references/rules/performance.md` |
| Permission problems | `references/rules/permissions.md` |
| Copyright / IP / media | `references/rules/copyright-media.md` |
| Legal compliance (GDPR, COPPA, DMA) | `references/rules/legal.md` |
| OTA / CodePush update violations | `references/rules/ota-updates.md` |
| App completeness / demo accounts | `references/rules/app-completeness.md` |

### Step 5: Submission & Rejection

| Task | File |
|------|------|
| Pre-submission verification | `references/pre-submission.md` |
| Got a rejection / need to appeal | `references/rejections.md` |

### Full Store Guidelines

| Store | File |
|-------|------|
| Apple App Store Review Guidelines | `references/guidelines/apple.md` |
| Google Play Store Policies | `references/guidelines/google-play.md` |

## Quick Decision Guide

| Task | Files to Read |
|------|--------------|
| Adding a new feature | `all-apps.md` + `react-native.md` + relevant app-type |
| Implementing payments/subscriptions | `features/subscriptions.md` + `rules/subscriptions.md` |
| Adding permissions (camera, location, etc.) | `rules/permissions.md` + `react-native.md` |
| Adding push notifications | `react-native.md` (push section) |
| Adding user-generated content | `features/ugc.md` + `app-types/social.md` |
| Privacy/data collection changes | `rules/privacy.md` + `guidelines/apple.md` (5.x) |
| Preparing for submission | `pre-submission.md` + `all-apps.md` |
| Got a rejection | `rejections.md` + matching `rules/*.md` |
| Adding AI features | `app-types/ai.md` + `rules/metadata.md` (China) |
| Building a kids app | `app-types/kids.md` |
| Building a health/medical app | `app-types/health-fitness.md` |
| Building a game | `app-types/games.md` + `features/subscriptions.md` |
| Crypto/finance app | `app-types/crypto-finance.md` |
| VPN app | `app-types/vpn.md` |
| macOS app | `features/macos.md` + `rules/entitlements.md` |
| Upgrading React Native | `react-native.md` + `rules/performance.md` |
| Copyright / media licensing | `rules/copyright-media.md` |
| Legal / GDPR / COPPA / DMA | `rules/legal.md` + `rules/privacy.md` |
| OTA updates (CodePush/Expo Updates) | `rules/ota-updates.md` + `react-native.md` |
| App completeness / demo account | `rules/app-completeness.md` |
| Account deletion requirement | `rules/design.md` + `rules/legal.md` |
