# rn-store-skills

React Native App Store & Google Play compliance skill for AI coding agents.

Catches store rejection issues **before** you submit — in every chat where you write or modify React Native code.

## What it does

Every time you add a feature, fix a bug, or change configuration in a React Native / Expo app, this skill automatically checks your changes against:

- **Apple App Store Review Guidelines** — privacy, payments, permissions, design, metadata, and more
- **Google Play Store Policies** — target SDK, billing, data safety, content policies, and more
- **Common React Native rejection patterns** — Expo Go submissions, missing JS bundles, Hermes crashes, WebView-heavy apps, permission overuse

About 40% of app submissions get rejected on the first try. This skill helps you avoid that.

## Install

### Via skills CLI (recommended)

```bash
npx skills add johnad/rn-store-skills
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
    ├── apple-guidelines.md               ← Apple App Store Review Guidelines (1.x–5.x)
    ├── google-play-guidelines.md         ← Google Play Store policies
    ├── react-native-patterns.md          ← RN-specific checks, 10 rejection patterns, AI rules
    ├── pre-submission-checklist.md       ← both-store + platform-specific checklists
    └── handling-rejections.md            ← how to respond to and appeal rejections
```

The SKILL.md is a lightweight navigation hub. Claude loads only the reference files relevant to the current task, keeping context efficient.

## Coverage

### Apple App Store
- Safety (objectionable content, kids, health apps)
- Performance (completeness, metadata accuracy, SDK requirements)
- Business (IAP, subscriptions, reader apps)
- Design (quality, copycats, minimum functionality, Sign in with Apple)
- Legal (privacy, ATT, PrivacyInfo.xcprivacy, nutrition labels)

### Google Play Store
- Content policies (restricted content, deceptive behavior, ads)
- Technical requirements (target SDK, AAB, 64-bit, billing library, foreground services)
- Store listing (screenshots, data safety, content rating)
- Closed testing requirements
- Account deletion requirements

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

## Contributing

PRs welcome! If you know of a store guideline or rejection pattern we're missing, please open an issue or PR. See [docs/ideas/backlog.md](docs/ideas/backlog.md) for planned improvements.

## License

MIT
