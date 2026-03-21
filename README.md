# rn-store-skills

React Native App Store & Google Play compliance skill for AI coding agents.

Catches store rejection issues **before** you submit — in every chat where you write or modify React Native code.

## What it does

Every time you add a feature, fix a bug, or change configuration in a React Native / Expo app, this skill automatically checks your changes against:

- **Apple App Store Review Guidelines** — privacy, payments, permissions, design, metadata, and more
- **Google Play Store Policies** — target SDK, billing, data safety, content policies, and more
- **Common React Native rejection patterns** — Expo Go submissions, missing JS bundles, Hermes crashes, WebView-heavy apps, permission overuse
- **20+ specific rejection rules** — with detection patterns, fix steps, and example rejection messages
- **10 app-type checklists** — social, kids, health, games, AI, crypto, VPN, macOS, subscriptions, UGC

About 40% of app submissions get rejected on the first try. This skill helps you avoid that.

## Install

### Via skills CLI (recommended)

```bash
npx skills add JohnAdib/rn-store-skills
```

### Via skillpm

```bash
npx skillpm add rn-store-skills
```

### Manual (Claude web / claude.ai)

1. Download or zip the `skills/rn-store-compliance/` folder
2. Go to [claude.ai/customize/skills](https://claude.ai/customize/skills)
3. Upload the zip — it contains one SKILL.md + reference files that Claude loads on-demand

### Manual (any agent)

Copy `skills/rn-store-compliance/` into your project's skills directory:

```bash
# Claude Code
cp -r skills/rn-store-compliance .claude/skills/

# Cursor
cp -r skills/rn-store-compliance .cursor/skills/

# Windsurf
cp -r skills/rn-store-compliance .windsurf/skills/
```

## Skill Structure

```
skills/rn-store-compliance/
├── SKILL.md                              ← main hub (loaded on trigger)
└── references/
    ├── guidelines/
    │   ├── apple.md                      ← Apple App Store Review Guidelines (1.x–5.x)
    │   └── google-play.md               ← Google Play Store policies
    ├── rules/                            ← detection → fix → example rejection
    │   ├── metadata.md                   ← trademarks, competitors, China, previews
    │   ├── subscriptions.md              ← ToS/PP links, misleading pricing, IAP
    │   ├── privacy.md                    ← unnecessary data, privacy manifest
    │   ├── design.md                     ← SIWA violations, minimum functionality
    │   ├── entitlements.md               ← unused entitlements, background modes
    │   ├── performance.md                ← crashes, Hermes, bundle size, ANR
    │   └── permissions.md                ← over-requesting, vague rationale, timing
    ├── app-types/                        ← compliance by app category
    │   ├── social.md                     ← social / messaging / community
    │   ├── kids.md                       ← Kids Category (COPPA, parental gates)
    │   ├── health-fitness.md             ← health / fitness / medical
    │   ├── games.md                      ← games / gambling / loot boxes
    │   ├── ai.md                         ← AI / generative AI / China DST
    │   ├── crypto-finance.md             ← crypto / finance / trading
    │   └── vpn.md                        ← VPN / networking
    ├── features/                         ← compliance by feature
    │   ├── subscriptions.md              ← IAP, subscriptions, restore purchases
    │   ├── ugc.md                        ← user-generated content, moderation
    │   └── macos.md                      ← macOS / Mac App Store
    ├── all-apps.md                       ← universal checklist (every app)
    ├── react-native.md                   ← RN/Expo-specific patterns
    ├── pre-submission.md                 ← both-store submission checklist
    └── rejections.md                     ← how to respond to and appeal rejections
```

The SKILL.md is a lightweight navigation hub. Claude loads only the reference files relevant to the current task, keeping context efficient.

## Coverage

### Apple App Store
- Safety (objectionable content, kids, health apps)
- Performance (completeness, metadata accuracy, SDK requirements)
- Business (IAP, subscriptions, reader apps)
- Design (quality, copycats, minimum functionality, Sign in with Apple)
- Legal (privacy, ATT, PrivacyInfo.xcprivacy, nutrition labels)
- Complete guideline quick-index (50+ guidelines)

### Google Play Store
- Content policies (restricted content, deceptive behavior, ads)
- Technical requirements (target SDK, AAB, 64-bit, billing library, foreground services)
- Store listing (screenshots, data safety, content rating)
- Closed testing requirements
- Account deletion requirements

### Rejection Rules
- 20+ specific rules with grep/code detection patterns
- React Native-specific detection commands
- Step-by-step fix instructions
- Real example rejection messages from Apple and Google

### App-Type Checklists
- 7 app-type checklists (social, kids, health, games, AI, crypto, VPN)
- 3 feature checklists (subscriptions, UGC, macOS)
- Both Apple and Google requirements in each
- React Native library recommendations

### React Native Specific
- Permission handling (Info.plist / AndroidManifest.xml) with code examples
- Payment integration (react-native-iap, RevenueCat)
- Build configuration (ProGuard, Hermes, signing, EAS Build)
- 10 most common RN rejection patterns with fixes
- AI/generative AI feature rules for both stores
- Age rating requirements

## Compatibility

Works with any AI coding agent that supports the Agent Skills format:

- Claude Code / Claude.ai
- Cursor
- Windsurf
- Cline
- GitHub Copilot (via skills)
- Any agent supporting skills directories

## Research & Docs

The `docs/` folder contains research notes, official source links, changelog, and improvement backlog. See [docs/README.md](docs/README.md) for the structure.

## Related Projects

Inspired by [app-store-preflight-skills](https://github.com/truongduy2611/app-store-preflight-skills) by [@truongduy2611](https://github.com/truongduy2611) — an iOS/macOS App Store preflight checker. We expanded to both stores with React Native detection patterns, app-type checklists, and feature-specific compliance guides.

## Contributing

PRs welcome! If you know of a store guideline or rejection pattern we're missing, please open an issue or PR. See [docs/ideas/backlog.md](docs/ideas/backlog.md) for planned improvements.

## License

MIT
