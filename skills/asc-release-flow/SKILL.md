---
name: asc-release-flow
description: >
  End-to-end release workflows for TestFlight beta distribution and App Store
  submission. Trigger on: release, submit to App Store, app release, TestFlight
  release, phased release, staged rollout, version release, distribute build,
  app store submission, EAS Submit.
license: MIT
metadata:
  author: JohnAdib
  version: "1.0.0"
  tags: [app-store-connect, asc, release, testflight, app-store, distribution]
---

# Release Flow

End-to-end TestFlight and App Store release workflows.

## Quick Release (Single Command)

### TestFlight only
```bash
asc testflight submit --bundle-id com.example.app --build-number latest
```

### App Store
```bash
asc appstore submit --bundle-id com.example.app --build-number latest --version "2.0.0"
```

## Manual Release Sequence

### Step 1: Verify Build
```bash
asc builds latest --bundle-id com.example.app --json
# Confirm: processingState = VALID
```

### Step 2: Create Version
```bash
asc appstore versions create \
  --bundle-id com.example.app \
  --platform ios \
  --version "2.0.0"
```

### Step 3: Set Build
```bash
asc appstore versions set-build \
  --version-id VERSION_ID \
  --build-id BUILD_ID
```

### Step 4: Complete Metadata
Ensure all required fields are filled:
- Version description (What's New)
- Screenshots for all required sizes
- App preview videos (optional)
- Localizations for target markets

```bash
# Upload What's New
asc appstore versions localizations update \
  --version-id VERSION_ID \
  --locale en-US \
  --whats-new "Bug fixes and performance improvements"
```

### Step 5: Answer Compliance Questions
```bash
# Export compliance (most apps with HTTPS)
asc appstore versions update \
  --version-id VERSION_ID \
  --uses-non-exempt-encryption false
```

### Step 6: Submit for Review
```bash
asc appstore review-submissions create --version-id VERSION_ID
```

### Step 7: Monitor Review
```bash
asc appstore review-submissions list --bundle-id com.example.app
```

Review states: `WAITING_FOR_REVIEW` → `IN_REVIEW` → `APPROVED` / `REJECTED`

## Phased Release (iOS)

Roll out gradually over 7 days to catch issues early:

```bash
asc appstore versions update \
  --version-id VERSION_ID \
  --phased-release true
```

Phased release schedule:
| Day | Percentage |
|-----|-----------|
| 1 | 1% |
| 2 | 2% |
| 3 | 5% |
| 4 | 10% |
| 5 | 20% |
| 6 | 50% |
| 7 | 100% |

Pause phased release:
```bash
asc appstore phased-releases pause --version-id VERSION_ID
```

Resume:
```bash
asc appstore phased-releases resume --version-id VERSION_ID
```

Release to all immediately:
```bash
asc appstore phased-releases complete --version-id VERSION_ID
```

## Google Play Staged Rollout (Comparison)

Google Play uses percentage-based staged rollouts:

```bash
# Using Google Play Developer API / bundletool
# Set rollout percentage
# 0.5%, 1%, 2%, 5%, 10%, 20%, 50%, 100%
```

Key differences from Apple:
- Manual percentage control (not fixed 7-day schedule)
- Can set any percentage at any time
- Halt stops all new installs immediately
- Can increase but not decrease percentage

## EAS Submit Alternative

```bash
# Submit to App Store Connect
eas submit --platform ios --latest

# Submit to Google Play
eas submit --platform android --latest
```

Configure in `eas.json`:
```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "1234567890",
        "appleTeamId": "XXXXXXXXXX"
      },
      "android": {
        "track": "production",
        "releaseStatus": "draft"
      }
    }
  }
}
```

## Platform-Specific Notes

| Platform | Upload format | Submission notes |
|----------|--------------|-----------------|
| iOS | .ipa | Standard review, ~24-48h average |
| macOS | .pkg | Separate review queue, often longer |
| tvOS | .ipa | Same as iOS but tvOS-specific guidelines |
| visionOS | .ipa | Spatial computing review criteria |

## Pre-Submission Checklist

Before submitting, verify:
- [ ] Build processed successfully (`VALID` state)
- [ ] Version string is correct and incremented
- [ ] All localizations complete
- [ ] Screenshots uploaded for all required sizes
- [ ] Export compliance answered
- [ ] Content rights declared
- [ ] Age rating configured
- [ ] Privacy policy URL set
- [ ] App Review notes added (if needed)

For policy compliance, see `rn-store-compliance` skill.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Version already exists` | Can't reuse version strings. Increment version. |
| Review rejection | See `rn-store-compliance/references/rejections.md` for response guide. |
| Build not selectable | Build must be in `VALID` state and not expired. |
| `Missing compliance` | Answer encryption question via ASC or Info.plist. |

## Related Skills
- `asc-submission-health` — preflight technical readiness
- `asc-testflight-ops` — TestFlight distribution
- `asc-metadata-sync` — metadata management
- `rn-store-compliance` — policy compliance checks
