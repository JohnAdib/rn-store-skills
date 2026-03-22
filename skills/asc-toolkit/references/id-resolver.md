# ID Resolver

Map human-friendly names to App Store Connect API identifiers.

## Why This Matters

Most `asc` commands require internal IDs (e.g., `1234567890`), not human names.
This skill shows how to resolve names → IDs for all major entity types.

## App ID

```bash
# From bundle identifier
asc apps list --filter-bundle-id com.example.app --json | jq '.[0].id'

# From app name (partial match)
asc apps list --json | jq '.[] | select(.name | test("MyApp"; "i")) | {id, name, bundleId}'

# List all apps
asc apps list --paginate --json
```

## Build ID

```bash
# Latest build
asc builds latest --bundle-id com.example.app --json | jq '.id'

# Specific build number
asc builds list --bundle-id com.example.app --json | \
  jq '.[] | select(.buildNumber == "42") | .id'

# By version string
asc builds list --bundle-id com.example.app --json | \
  jq '.[] | select(.version == "2.0.0") | {id, buildNumber}'
```

## Version ID

```bash
# List versions
asc appstore versions list --bundle-id com.example.app --json

# Specific version
asc appstore versions list --bundle-id com.example.app --json | \
  jq '.[] | select(.versionString == "2.0.0") | .id'

# Current live version
asc appstore versions list --bundle-id com.example.app --json | \
  jq '.[] | select(.appStoreState == "READY_FOR_DISTRIBUTION") | .id'
```

## TestFlight Group ID

```bash
# List groups
asc testflight groups list --bundle-id com.example.app --json

# By name
asc testflight groups list --bundle-id com.example.app --json | \
  jq '.[] | select(.name == "Beta Testers") | .id'
```

## Tester ID

```bash
# By email
asc testflight testers list --bundle-id com.example.app --paginate --json | \
  jq '.[] | select(.email == "tester@example.com") | .id'

# All testers in a group
asc testflight testers list --group-id GROUP_ID --json
```

## Bundle ID (entity)

```bash
# List registered bundle IDs
asc bundle-ids list --json

# By identifier
asc bundle-ids list --filter-identifier com.example.app --json | jq '.[0].id'
```

## Certificate ID

```bash
asc certificates list --json | jq '.[] | {id, name, type: .certificateType, expiry: .expirationDate}'
```

## Profile ID

```bash
asc profiles list --json | jq '.[] | {id, name, type: .profileType}'

# By name
asc profiles list --json | jq '.[] | select(.name | test("Distribution"; "i")) | .id'
```

## Review Submission ID

```bash
asc appstore review-submissions list --bundle-id com.example.app --json | jq '.[0].id'
```

## Subscription / IAP IDs

```bash
# Subscriptions
asc iap subscriptions list --bundle-id com.example.app --json | \
  jq '.[] | {id, productId: .productId, name}'

# Subscription groups
asc iap subscription-groups list --bundle-id com.example.app --json

# Non-subscription IAPs
asc iap list --bundle-id com.example.app --json
```

## Batch Resolution Script

```bash
#!/bin/bash
# Resolve all IDs for an app
BUNDLE="com.example.app"

echo "=== ID Resolution for $BUNDLE ==="

APP_ID=$(asc apps list --filter-bundle-id $BUNDLE --json | jq -r '.[0].id')
echo "App ID: $APP_ID"

BUILD_ID=$(asc builds latest --bundle-id $BUNDLE --json | jq -r '.id')
echo "Latest Build ID: $BUILD_ID"

VERSION_ID=$(asc appstore versions list --bundle-id $BUNDLE --json | jq -r '.[0].id')
echo "Latest Version ID: $VERSION_ID"

echo ""
echo "TestFlight Groups:"
asc testflight groups list --bundle-id $BUNDLE --json | jq -r '.[] | "  \(.name): \(.id)"'
```

## Google Play Equivalent

Google Play uses different identifiers:
- **Package name** (bundle ID equivalent): `com.example.app`
- **Version code** (build number equivalent): integer, monotonically increasing
- **Track**: `internal`, `alpha`, `beta`, `production`

```bash
# Google Play Developer API uses package name directly
# No separate "app ID" resolution needed
```

## Tips

- Always use `--paginate` when searching — truncated results may miss your target
- Use `--json` + `jq` for reliable parsing
- Cache IDs in shell variables for multi-step workflows
- Bundle IDs are case-sensitive

## Related Skills
- `asc-cli-usage` — general CLI reference
- `asc-build-lifecycle` — build management
- `asc-testflight-ops` — TestFlight management
