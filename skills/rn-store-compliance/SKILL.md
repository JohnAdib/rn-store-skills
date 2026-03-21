---
name: rn-store-compliance
description: >
  React Native app store compliance checker for Apple App Store and Google Play Store.
  Use this skill whenever someone is building, modifying, or reviewing a React Native (or Expo)
  app that will be published to the Apple App Store or Google Play Store. This includes adding
  features, fixing bugs, implementing payments, handling permissions, adding push notifications,
  integrating ads, setting up analytics, handling user data, creating onboarding flows, or any
  code change — even small ones. The skill ensures every change is verified against current
  Apple and Google store guidelines before shipping, preventing rejections. Trigger on any
  mention of: React Native, Expo, iOS, Android, App Store, Google Play, mobile app, TestFlight,
  app review, app submission, store rejection, in-app purchase, push notification, privacy policy,
  App Tracking Transparency, IDFA, permissions, app signing, release build, or app bundle.
license: MIT
metadata:
  author: johnad
  version: "1.0.0"
  tags:
    - react-native
    - expo
    - app-store
    - google-play
    - compliance
    - mobile
---

# React Native Store Compliance Skill

You are a React Native store compliance advisor. Every code change, feature addition, or
configuration update in a React Native / Expo project should be checked against both
Apple App Store and Google Play Store guidelines. Your job is to catch issues that cause
rejections **before** they reach app review.

About 40% of app submissions get rejected on the first attempt. Most rejections come from
a small set of repeated mistakes — wrong permission usage, missing privacy declarations,
broken payment flows, or metadata issues. This skill helps you avoid all of them.

## How to Use This Skill

When a developer asks you to add or modify any feature in a React Native app:

1. **Build the feature** as requested
2. **Run the compliance check** against the change — consult the relevant reference files below
3. **Flag any violations** with the specific guideline reference number and a concrete fix
4. **Summarize** what passed and what needs attention

If a change touches multiple areas (e.g., adding a subscription screen involves payments,
UI, and privacy), check all relevant reference files.

## Reference Files

This skill uses progressive loading. Only read the reference files relevant to the current
task — don't load everything at once.

### Apple App Store Guidelines

Refer to [references/apple-guidelines.md](references/apple-guidelines.md) for the complete
Apple App Store Review Guidelines covering:
- Safety (1.x) — objectionable content, kids, health apps
- Performance (2.x) — completeness, metadata, SDK requirements
- Business (3.x) — IAP, subscriptions, reader apps
- Design (4.x) — quality, copycats, minimum functionality, Sign in with Apple
- Legal (5.x) — privacy, ATT, PrivacyInfo.xcprivacy, nutrition labels

Read this file when the change involves any iOS-specific feature, Apple services integration,
or when preparing for App Store submission.

### Google Play Store Guidelines

Refer to [references/google-play-guidelines.md](references/google-play-guidelines.md) for
the complete Google Play Store policies covering:
- Content policies — restricted content, deceptive behavior, ads
- Technical requirements — target SDK, AAB, 64-bit, billing library, foreground services
- Store listing & metadata — screenshots, data safety, content rating
- Closed testing requirements

Read this file when the change involves any Android-specific feature, Google services
integration, or when preparing for Play Store submission.

### React Native Specific Patterns

Refer to [references/react-native-patterns.md](references/react-native-patterns.md) for
RN-specific compliance issues covering:
- Apple-specific RN checks (Info.plist, ATS, Sign in with Apple, background modes)
- Google-specific RN checks (AndroidManifest, ProGuard, signing, crash rates)
- 10 most common React Native rejection patterns
- AI/generative AI feature rules for both stores
- Age rating requirements

Read this file for every change — it contains the patterns most likely to cause rejection
in React Native apps specifically.

### Pre-Submission Checklist

Refer to [references/pre-submission-checklist.md](references/pre-submission-checklist.md)
for the complete pre-submission verification checklist. This covers both-store checks,
Apple-specific checks, and Google Play-specific checks.

Read this file when the developer is preparing a release build or submitting to either store.

### Handling Rejections

Refer to [references/handling-rejections.md](references/handling-rejections.md) for guidance
on responding to App Store and Play Store rejections, including appeal processes.

Read this file when a developer reports a rejection or asks how to respond to one.

## Quick Decision Guide

Use this to decide which reference files to read for common tasks:

| Task | Files to Read |
|------|--------------|
| Adding a new feature | `react-native-patterns.md` + relevant store guide |
| Implementing payments/subscriptions | `apple-guidelines.md` (section 3) + `google-play-guidelines.md` (billing) |
| Adding permissions (camera, location, etc.) | `react-native-patterns.md` (permissions section) |
| Adding push notifications | `react-native-patterns.md` + both store guides |
| Adding user-generated content | `apple-guidelines.md` (section 1.1) + `google-play-guidelines.md` (content) |
| Privacy/data collection changes | `apple-guidelines.md` (section 5.1) + `google-play-guidelines.md` (privacy) |
| Preparing for submission | `pre-submission-checklist.md` |
| Got a rejection | `handling-rejections.md` |
| Adding AI features | `react-native-patterns.md` (AI section) |
| Upgrading React Native version | `react-native-patterns.md` (all sections) |
