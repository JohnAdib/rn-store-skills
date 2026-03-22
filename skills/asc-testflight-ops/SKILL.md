---
name: asc-testflight-ops
description: >
  Orchestrate TestFlight distribution — manage groups, testers, builds, and
  What to Test notes. Trigger on: TestFlight, beta testing, beta distribution,
  test group, beta tester, internal testing, external testing, What to Test,
  beta app review, TestFlight invite.
license: MIT
metadata:
  author: JohnAdib
  version: "1.0.0"
  tags: [app-store-connect, asc, testflight, beta, testing, distribution]
---

# TestFlight Operations

Manage TestFlight distribution: groups, testers, builds, and testing notes.

## Groups

### List groups
```bash
asc testflight groups list --bundle-id com.example.app
```

### Create a group
```bash
asc testflight groups create \
  --bundle-id com.example.app \
  --name "Beta Testers" \
  --public-link-enabled true
```

### Internal vs External groups
- **Internal**: Team members in App Store Connect. No beta review required. Up to 100 testers.
- **External**: Anyone with email/public link. Requires beta review on first build. Up to 10,000 testers.

## Testers

### List testers in a group
```bash
asc testflight testers list --group-id GROUP_ID
```

### Add testers
```bash
# By email
asc testflight testers add \
  --group-id GROUP_ID \
  --email "tester@example.com" \
  --first-name "Jane" \
  --last-name "Doe"
```

### Add testers in bulk (CSV)
```bash
# CSV format: email,firstName,lastName
asc testflight testers add-csv \
  --group-id GROUP_ID \
  --file testers.csv
```

### Remove a tester
```bash
asc testflight testers remove --group-id GROUP_ID --tester-id TESTER_ID
```

## Build Distribution

### Assign build to group
```bash
asc testflight groups add-build \
  --group-id GROUP_ID \
  --build-id BUILD_ID
```

### Auto-distribute to internal testers
```bash
asc testflight submit --bundle-id com.example.app --build-number latest
```

### Set What to Test notes
```bash
asc testflight localizations update \
  --build-id BUILD_ID \
  --locale en-US \
  --what-to-test "Please test the new checkout flow and report any payment issues."
```

### Multi-locale testing notes
```bash
for locale in en-US de-DE ja-JP; do
  asc testflight localizations update \
    --build-id BUILD_ID \
    --locale $locale \
    --what-to-test "$(cat notes/$locale.txt)"
done
```

## Beta App Review

External groups require beta review:
- First build to any external group triggers review
- Subsequent builds to same group usually skip review
- Major changes may re-trigger review
- Review typically takes < 24 hours

### Check review status
```bash
asc testflight beta-review list --bundle-id com.example.app
```

## Public Links

### Enable for a group
```bash
asc testflight groups update \
  --group-id GROUP_ID \
  --public-link-enabled true \
  --public-link-limit 1000
```

### Disable
```bash
asc testflight groups update \
  --group-id GROUP_ID \
  --public-link-enabled false
```

## Export Current Configuration

Dump current TestFlight state for documentation:
```bash
# All groups
asc testflight groups list --bundle-id com.example.app --json > tf-groups.json

# All testers
asc testflight testers list --bundle-id com.example.app --paginate --json > tf-testers.json
```

## EAS + TestFlight

For Expo projects, combine EAS Build with TestFlight:

```bash
# Build and auto-submit to TestFlight
eas build --platform ios --profile preview --auto-submit
```

`eas.json`:
```json
{
  "build": {
    "preview": {
      "ios": {
        "buildConfiguration": "Release",
        "distribution": "internal"
      }
    }
  },
  "submit": {
    "preview": {
      "ios": {
        "ascAppId": "1234567890"
      }
    }
  }
}
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Testers not receiving invite | Check spam. Tester must accept via TestFlight app. |
| Build not available to group | Ensure build is assigned to group and processing complete. |
| Beta review rejected | Check email for details. Common: crashes, incomplete features. |
| Public link not working | Verify link is enabled and tester limit not reached. |
| `--paginate` needed | Use for groups with many testers to get complete list. |
| Build expired | TestFlight builds expire after 90 days. Upload new build. |

## Related Skills
- `asc-build-lifecycle` — track build processing
- `asc-release-flow` — App Store submission after testing
- `asc-crash-triage` — analyze TestFlight crash reports
