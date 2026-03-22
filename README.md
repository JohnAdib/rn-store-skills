# rn-store-skills

React Native store compliance + App Store Connect automation skills for AI coding agents.

17 skills covering everything from rejection prevention to release automation.

> Apple rejected ~1.93 million of ~7.77 million app submissions in 2024 — roughly **25% of all submissions**. Most rejections come from a small set of repeated mistakes. This skill pack helps AI agents catch every one of them before review.

## Skills

### Store Compliance

| Skill | Description |
|-------|-------------|
| `rn-store-compliance` | React Native compliance checker — Apple & Google guidelines, 30+ rejection rules, 10 app-type checklists, RN-specific patterns, copyright/IP, legal compliance, OTA update rules |

### App Store Connect CLI (`asc`)

#### Build & Distribution
| Skill | Description |
|-------|-------------|
| `asc-xcode-build` | Build, archive, export iOS/macOS apps with xcodebuild. EAS Build & Fastlane alternatives. |
| `asc-build-lifecycle` | Track build processing, find latest builds, monitor state, clean up old builds |
| `asc-notarization` | macOS notarization for distribution outside App Store (Developer ID, Electron) |
| `asc-signing-setup` | Bundle IDs, capabilities, certificates, provisioning profiles. EAS credentials & Fastlane match. |

#### Release & Review
| Skill | Description |
|-------|-------------|
| `asc-release-flow` | End-to-end TestFlight + App Store release workflows. Phased rollout. |
| `asc-testflight-ops` | TestFlight distribution — groups, testers, builds, What to Test notes |
| `asc-submission-health` | Preflight technical readiness — builds, metadata, screenshots, compliance |

#### Metadata & Localization
| Skill | Description |
|-------|-------------|
| `asc-metadata-sync` | Sync, validate, and translate App Store metadata across 37+ locales |
| `asc-whats-new-writer` | Generate localized release notes from git log, bullet points, or free text |
| `asc-subscription-localize` | Bulk-localize subscription & IAP display names. RevenueCat sync. |
| `asc-aso-audit` | App Store Optimization — keyword analysis, field utilization, cross-locale gaps |

#### Screenshots & Marketing
| Skill | Description |
|-------|-------------|
| `asc-screenshots` | Screenshot capture, framing, and upload for both stores |

#### Diagnostics & Pricing
| Skill | Description |
|-------|-------------|
| `asc-crash-triage` | Triage TestFlight crashes, beta feedback, performance diagnostics. Sentry/Bugsnag tips. |
| `asc-pricing` | Territory-specific pricing with purchasing power parity strategies |

#### Utilities
| Skill | Description |
|-------|-------------|
| `asc-cli-usage` | asc CLI reference — commands, flags, auth, output formats, workflow automation |
| `asc-id-resolver` | Resolve human-friendly names to App Store Connect API identifiers |

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
3. Upload the zip — each skill has a SKILL.md + optional reference files

### Manual (any agent)

Copy the skill(s) you need into your project's skills directory:

```bash
# All skills
cp -r skills/* .claude/skills/

# Or individual skills
cp -r skills/rn-store-compliance .claude/skills/
cp -r skills/asc-release-flow .claude/skills/
```

Works with Claude Code, Cursor, Windsurf, Cline, and any agent supporting skills directories.

## Structure

```
skills/
├── rn-store-compliance/                  ← Store compliance checker
│   ├── SKILL.md
│   └── references/
│       ├── guidelines/                   ← Apple & Google guidelines
│       ├── rules/                        ← 11 detection rule sets
│       ├── app-types/                    ← 7 app category checklists
│       ├── features/                     ← 3 feature checklists
│       ├── all-apps.md                   ← Universal checklist
│       ├── react-native.md              ← RN/Expo-specific
│       ├── pre-submission.md            ← Pre-submission checklist
│       └── rejections.md                ← Rejection response guide
├── asc-xcode-build/SKILL.md             ← Build & archive
├── asc-build-lifecycle/SKILL.md          ← Build tracking & cleanup
├── asc-notarization/SKILL.md            ← macOS notarization
├── asc-signing-setup/SKILL.md           ← Certs, profiles, bundle IDs
├── asc-release-flow/SKILL.md            ← Release workflows
├── asc-testflight-ops/SKILL.md          ← TestFlight distribution
├── asc-submission-health/SKILL.md       ← Pre-submission readiness
├── asc-metadata-sync/                    ← Metadata management
│   ├── SKILL.md
│   └── references/locales.md
├── asc-whats-new-writer/SKILL.md        ← Release notes
├── asc-subscription-localize/            ← Subscription localization
│   ├── SKILL.md
│   └── references/revenuecat.md
├── asc-aso-audit/SKILL.md               ← ASO optimization
├── asc-screenshots/SKILL.md             ← Screenshot pipeline
├── asc-crash-triage/SKILL.md            ← Crash analysis
├── asc-pricing/SKILL.md                 ← Territory pricing
├── asc-cli-usage/                        ← CLI reference
│   ├── SKILL.md
│   └── references/workflows.md
└── asc-id-resolver/SKILL.md             ← ID resolution
```

## Coverage

### Store Compliance (rn-store-compliance)
- Apple App Store Review Guidelines (1.x–5.x) — full index
- Google Play Store Policies — full index
- 30+ rejection rules with detection patterns, fixes, and real rejection messages
- 11 rule categories (metadata, subscriptions, privacy, design, entitlements, performance, permissions, copyright/IP, legal, OTA updates, app completeness)
- 7 app-type checklists (social, kids, health, games, AI, crypto, VPN)
- 3 feature checklists (subscriptions, UGC, macOS)
- React Native / Expo specific patterns and detection

### App Store Connect Automation (asc-*)
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
