# Build Lifecycle Management

Track, monitor, and clean up builds in App Store Connect.

## Find Builds

### Latest build for an app
```bash
asc builds latest --bundle-id com.example.app
```

### List recent builds
```bash
asc builds list --bundle-id com.example.app --limit 10
```

### Filter by platform
```bash
asc builds list --bundle-id com.example.app --platform ios
```

### Get build details
```bash
asc builds info BUILD_ID
```

### JSON output for scripting
```bash
asc builds latest --bundle-id com.example.app --json
```

## Monitor Processing

After upload, builds go through processing (5–30 minutes typically):

```bash
# Check processing state
asc builds latest --bundle-id com.example.app --json | jq '.processingState'
```

States: `PROCESSING` → `VALID` (or `INVALID`/`FAILED`)

### Wait for processing
```bash
# Poll until processed
while true; do
  STATE=$(asc builds latest --bundle-id com.example.app --json | jq -r '.processingState')
  echo "State: $STATE"
  [ "$STATE" = "VALID" ] && break
  [ "$STATE" = "INVALID" ] || [ "$STATE" = "FAILED" ] && echo "Build failed" && exit 1
  sleep 30
done
```

## Distribute Builds

### To TestFlight (internal)
```bash
asc testflight submit BUILD_ID
```

### To TestFlight group (external)
```bash
asc testflight groups add-build --group-id GROUP_ID --build-id BUILD_ID
```

### To App Store
```bash
asc appstore versions create --bundle-id com.example.app --platform ios --version "2.0.0"
asc appstore versions set-build --version-id VERSION_ID --build-id BUILD_ID
```

## Cleanup Old Builds

### List expired/old builds
```bash
asc builds list --bundle-id com.example.app --limit 50 --json | \
  jq '[.[] | select(.expirationDate != null)]'
```

### Expire a build (remove from TestFlight)
```bash
asc builds expire BUILD_ID
```

### Bulk cleanup (dry run)
```bash
asc builds list --bundle-id com.example.app --limit 100 --json | \
  jq -r '.[] | select(.uploadedDate < "2024-01-01") | .id' | \
  while read id; do echo "Would expire: $id"; done
```

### Bulk cleanup (execute)
```bash
asc builds list --bundle-id com.example.app --limit 100 --json | \
  jq -r '.[] | select(.uploadedDate < "2024-01-01") | .id' | \
  while read id; do asc builds expire "$id"; done
```

## EAS Build Status

For Expo/React Native projects using EAS:

```bash
# Check build status
eas build:list --platform ios --status=finished --limit 5

# View specific build
eas build:view BUILD_ID
```

## Build Retention Policy

- TestFlight builds expire after 90 days by default
- Expired builds can't be installed by new testers
- App Store builds are retained indefinitely once submitted
- Processing failures are retained ~30 days

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build stuck in PROCESSING | Wait up to 1 hour. If still stuck, re-upload with incremented build number. |
| Build shows INVALID | Check email from Apple for specific errors. Usually signing or entitlement issues. |
| `--paginate` needed | Use `--paginate` flag when listing many builds to get all results. |
| Can't find build | Verify bundle ID and platform. Builds are scoped per platform. |

## Related Skills
- `asc-xcode-build` — build and upload
- `asc-testflight-ops` — distribute to testers
- `asc-release-flow` — submit to App Store
