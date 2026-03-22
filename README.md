# rn-store-skills

React Native store compliance + App Store Connect automation skills for AI coding agents.

2 skills covering everything from rejection prevention to release automation.

> Apple rejected ~1.93 million of ~7.77 million app submissions in 2024 — roughly **25% of all submissions**. Most rejections come from a small set of repeated mistakes. This skill pack helps AI agents catch every one of them before review.

## Skills

### 1. `rn-store-compliance`

React Native compliance checker — Apple & Google guidelines, 30+ rejection rules, 11 rule categories, 7 app-type checklists, 3 feature checklists, RN-specific patterns, copyright/IP, legal compliance, OTA update rules.

Progressive loading: loads only the relevant reference files for each task.

### 2. `asc-toolkit`

App Store Connect automation toolkit — build, sign, release, metadata, TestFlight, pricing, screenshots, crash triage, and ASO via the `asc` CLI.

19 reference files organized by category: Build & Distribution, Release & Review, Metadata & Localization, Marketing & Optimization, Diagnostics & Pricing, Utilities.

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

1. Download or zip the skill folder(s) you need from `skills/`
2. Go to [claude.ai/customize/skills](https://claude.ai/customize/skills)
3. Upload the zip — each skill has a SKILL.md + reference files

### Manual (any agent)

Copy the skill(s) you need into your project's skills directory:

```bash
# All skills
cp -r skills/* .claude/skills/

# Or individual skills
cp -r skills/rn-store-compliance .claude/skills/
cp -r skills/asc-toolkit .claude/skills/
```

Works with Claude Code, Cursor, Windsurf, Cline, and any agent supporting skills directories.

## Structure

```
skills/
├── rn-store-compliance/                  <- Store compliance checker
│   ├── SKILL.md
│   └── references/
│       ├── guidelines/                   <- Apple & Google guidelines
│       ├── rules/                        <- 11 detection rule sets
│       ├── app-types/                    <- 7 app category checklists
│       ├── features/                     <- 3 feature checklists
│       ├── all-apps.md                   <- Universal checklist
│       ├── react-native.md              <- RN/Expo-specific
│       ├── pre-submission.md            <- Pre-submission checklist
│       └── rejections.md                <- Rejection response guide
└── asc-toolkit/                          <- App Store Connect toolkit
    ├── SKILL.md
    └── references/
        ├── xcode-build.md               <- Build & archive
        ├── build-lifecycle.md            <- Build tracking & cleanup
        ├── notarization.md              <- macOS notarization
        ├── signing-setup.md             <- Certs, profiles, bundle IDs
        ├── release-flow.md              <- Release workflows
        ├── testflight-ops.md            <- TestFlight distribution
        ├── submission-health.md         <- Pre-submission readiness
        ├── metadata-sync.md             <- Metadata management
        ├── locales.md                   <- 37 App Store locales
        ├── whats-new-writer.md          <- Release notes
        ├── subscription-localize.md     <- Subscription localization
        ├── revenuecat.md                <- RevenueCat sync
        ├── aso-audit.md                 <- ASO optimization
        ├── screenshots.md               <- Screenshot pipeline
        ├── crash-triage.md              <- Crash analysis
        ├── pricing.md                   <- Territory pricing
        ├── cli-usage.md                 <- asc CLI reference
        ├── cli-workflows.md             <- Multi-step workflows
        └── id-resolver.md               <- ID resolution
```

## Coverage

### Store Compliance (rn-store-compliance)
- Apple App Store Review Guidelines (1.x-5.x) — full index
- Google Play Store Policies — full index
- 30+ rejection rules with detection patterns, fixes, and real rejection messages
- 11 rule categories (metadata, subscriptions, privacy, design, entitlements, performance, permissions, copyright/IP, legal, OTA updates, app completeness)
- 7 app-type checklists (social, kids, health, games, AI, crypto, VPN)
- 3 feature checklists (subscriptions, UGC, macOS)
- React Native / Expo specific patterns and detection

### App Store Connect Automation (asc-toolkit)
- Build, archive, upload for iOS/macOS/tvOS/visionOS
- Code signing setup and rotation
- TestFlight distribution and beta management
- App Store release with phased rollout
- Metadata sync and translation (37 locales)
- Screenshot capture, framing, and upload
- Subscription and IAP localization
- Crash triage and performance diagnostics
- Territory-specific pricing with PPP strategies
- ASO audits and keyword optimization
- Multi-step workflow automation
- EAS Build/Submit and Fastlane alternatives throughout

## Research & Docs

The `docs/` folder contains research notes, official source links, changelog, and improvement backlog. See [docs/README.md](docs/README.md) for the structure.

## Related Projects

- [app-store-preflight-skills](https://github.com/truongduy2611/app-store-preflight-skills) by [@truongduy2611](https://github.com/truongduy2611) — iOS/macOS App Store preflight checker
- [app-store-connect-cli-skills](https://github.com/rudrankriyam/app-store-connect-cli-skills) by [@rudrankriyam](https://github.com/rudrankriyam) — App Store Connect CLI skill pack

## Contributing

PRs welcome! If you know of a store guideline, rejection pattern, or ASC workflow we're missing, please open an issue or PR. See [docs/ideas/backlog.md](docs/ideas/backlog.md) for planned improvements.

## License

MIT
