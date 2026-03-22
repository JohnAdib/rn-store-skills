---
name: asc-cli-usage
description: >
  Reference guide for the asc CLI tool — command discovery, flag conventions,
  output formats, authentication, and multi-step workflow automation.
  Trigger on: asc CLI, asc command, asc help, asc authentication, asc flags,
  asc output, App Store Connect CLI, asc workflow, asc automation.
license: MIT
metadata:
  author: JohnAdib
  version: "1.0.0"
  tags: [app-store-connect, asc, cli, reference, utility]
---

# asc CLI Usage Guide

Reference for the [App Store Connect CLI](https://github.com/csjones/app-store-connect-cli) (`asc`).

## Installation

```bash
brew install app-store-connect-cli
```

Or build from source:
```bash
git clone https://github.com/csjones/app-store-connect-cli.git
cd app-store-connect-cli
swift build -c release
```

## Command Discovery

```bash
# Top-level commands
asc --help

# Subcommand help
asc builds --help
asc testflight groups --help

# Command-specific flags
asc builds list --help
```

## Flag Conventions

| Pattern | Meaning | Example |
|---------|---------|---------|
| `--bundle-id` | App identifier | `com.example.app` |
| `--platform` | Target platform | `ios`, `macos`, `tvos`, `visionos` |
| `--locale` | Language code | `en-US`, `de-DE`, `ja` |
| `--limit` | Max results | `--limit 50` |
| `--json` | JSON output | Machine-readable |
| `--csv` | CSV output | Spreadsheet-friendly |
| `--paginate` | Get all pages | Use for complete results |
| `--filter-*` | Server-side filter | `--filter-identifier com.example.*` |

## Output Formats

```bash
# Human-readable (default, TTY-aware)
asc builds list --bundle-id com.example.app

# JSON (for scripting)
asc builds list --bundle-id com.example.app --json

# CSV (for spreadsheets)
asc builds list --bundle-id com.example.app --csv

# Pipe JSON to jq
asc builds latest --bundle-id com.example.app --json | jq '.buildNumber'
```

## Authentication

### API Key (recommended)
```bash
# Store key in macOS Keychain
asc auth store --key-id KEY_ID --issuer-id ISSUER_ID --key AuthKey_XXXXXXXX.p8

# Or via environment variables
export ASC_KEY_ID=KEY_ID
export ASC_ISSUER_ID=ISSUER_ID
export ASC_PRIVATE_KEY_PATH=~/.appstoreconnect/private_keys/AuthKey_XXXXXXXX.p8
```

### Key file location
Standard paths `asc` checks:
1. `~/.appstoreconnect/private_keys/AuthKey_XXXXXXXX.p8`
2. `./private_keys/AuthKey_XXXXXXXX.p8`
3. Environment variable path

### Create API Key
1. App Store Connect → Users and Access → Integrations → App Store Connect API
2. Generate key with desired role (Admin, Developer, etc.)
3. Download `.p8` file (available only once)
4. Note Key ID and Issuer ID

### Roles
| Role | Access |
|------|--------|
| Admin | Full access |
| App Manager | Apps, builds, metadata |
| Developer | Builds, TestFlight |
| Marketing | Metadata, screenshots |
| Finance | Financial reports |

## Timeouts

```bash
# Set request timeout (seconds)
asc --timeout 120 builds list --bundle-id com.example.app
```

Default timeout varies by operation. Upload operations may need longer timeouts.

## Pagination

Some endpoints return paginated results:
```bash
# Get all results (auto-paginate)
asc builds list --bundle-id com.example.app --paginate

# Limit results
asc builds list --bundle-id com.example.app --limit 10
```

Always use `--paginate` when you need complete results.

## EAS CLI Comparison

| Task | asc CLI | EAS CLI |
|------|---------|---------|
| Build iOS | `xcodebuild` + `asc builds upload` | `eas build --platform ios` |
| Submit | `asc appstore submit` | `eas submit --platform ios` |
| TestFlight | `asc testflight submit` | `eas submit --profile preview` |
| Credentials | Manual cert/profile management | `eas credentials` (managed) |
| Metadata | `asc appstore versions localizations` | Not supported |
| Screenshots | `asc appstore screenshots upload` | Not supported |
| Pricing | `asc iap subscriptions prices` | Not supported |

EAS handles build+submit. `asc` handles everything in App Store Connect.

## Fastlane Comparison

| Task | asc CLI | Fastlane |
|------|---------|----------|
| Build | N/A (use xcodebuild) | `gym` |
| Upload | `asc builds upload` | `deliver` / `pilot` |
| Metadata | `asc appstore versions localizations` | `deliver` |
| Screenshots | `asc appstore screenshots upload` | `snapshot` + `frameit` |
| TestFlight | `asc testflight submit` | `pilot` |
| Signing | `asc certificates/profiles` | `match` |
| Release | `asc appstore submit` | `deliver` |

`asc` is lighter and API-native. Fastlane has broader ecosystem and plugins.

For multi-step workflow automation, see `references/workflows.md`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `401 Unauthorized` | Check API key, key ID, issuer ID. Verify key role has access. |
| `403 Forbidden` | Key role lacks permission for this operation. |
| `404 Not Found` | Check bundle ID, entity IDs. Use `--paginate` for listing. |
| `429 Rate Limited` | Slow down requests. Add delays between batch operations. |
| Timeout | Increase `--timeout`. Upload operations need more time. |
| Empty results | Use `--paginate`. Check filters. Verify API key scope. |

## Related Skills
- `asc-id-resolver` — resolve human names to API IDs
- `asc-signing-setup` — set up API keys and certificates
