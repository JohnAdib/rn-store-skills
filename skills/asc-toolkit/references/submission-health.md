# Submission Health Check

Verify App Store Connect technical readiness before submitting for review.

**Scope**: This skill checks ASC technical requirements (builds, metadata fields, screenshots).
For policy compliance (guidelines, rejection rules), use `rn-store-compliance`.

## Preflight Checklist

### 1. Build Status
```bash
# Verify build is processed and valid
BUILD=$(asc builds latest --bundle-id com.example.app --json)
echo "$BUILD" | jq '{processingState, version, buildNumber}'
```

Required: `processingState` = `VALID`

### 2. Version Created
```bash
asc appstore versions list --bundle-id com.example.app --json | \
  jq '.[] | select(.versionString == "2.0.0")'
```

Required: version exists with correct string.

### 3. Build Assigned to Version
```bash
asc appstore versions info VERSION_ID --json | jq '.build'
```

Required: build ID is set.

### 4. Export Compliance
```bash
asc appstore versions info VERSION_ID --json | jq '.usesNonExemptEncryption'
```

If not answered, set it:
```bash
asc appstore versions update --version-id VERSION_ID --uses-non-exempt-encryption false
```

Most apps using only HTTPS qualify as exempt.

### 5. Content Rights
Declare if app contains third-party content:
```bash
asc appstore versions update --version-id VERSION_ID --content-rights-declaration DOES_NOT_USE_THIRD_PARTY_CONTENT
```

### 6. Version Metadata

Required fields per locale:
| Field | Max chars | Required |
|-------|----------|----------|
| Description | 4000 | Yes |
| What's New | 4000 | Yes (updates) |
| Keywords | 100 | Yes |
| Support URL | — | Yes |
| Marketing URL | — | No |

```bash
# Check locale completeness
asc appstore versions localizations list --version-id VERSION_ID --json | \
  jq '.[] | {locale, description: (.description | length > 0), whatsNew: (.whatsNew | length > 0)}'
```

### 7. App-Level Localizations

Required per locale:
| Field | Max chars | Required |
|-------|----------|----------|
| Name | 30 | Yes |
| Subtitle | 30 | No (recommended) |
| Privacy Policy URL | — | Yes |

```bash
asc apps localizations list --bundle-id com.example.app --json | \
  jq '.[] | {locale, name, privacyPolicyUrl}'
```

### 8. Screenshots

Required per device type per locale:
| Device | Size | Required |
|--------|------|----------|
| iPhone 6.7" | 1290x2796 | Yes |
| iPhone 6.5" | 1284x2778 | Yes (or 6.7") |
| iPad Pro 12.9" | 2048x2732 | If universal |
| iPad Pro 13" | 2064x2752 | If iPad app |

```bash
# Check screenshot sets
asc appstore screenshots list --version-id VERSION_ID --json | \
  jq 'group_by(.deviceType) | .[] | {device: .[0].deviceType, count: length}'
```

Minimum: 1 screenshot per required device. Maximum: 10 per device per locale.

### 9. Age Rating

Must be configured in App Information:
```bash
asc apps info --bundle-id com.example.app --json | jq '.ageRatingDeclaration'
```

### 10. App Category

Must be set:
```bash
asc apps info --bundle-id com.example.app --json | jq '.primaryCategory'
```

## Automated Preflight Script

```bash
#!/bin/bash
BUNDLE="com.example.app"
VERSION="2.0.0"

echo "=== Submission Preflight ==="

# Build check
BUILD_STATE=$(asc builds latest --bundle-id $BUNDLE --json | jq -r '.processingState')
[ "$BUILD_STATE" = "VALID" ] && echo "✅ Build valid" || echo "❌ Build: $BUILD_STATE"

# Version check
VER_ID=$(asc appstore versions list --bundle-id $BUNDLE --json | \
  jq -r ".[] | select(.versionString == \"$VERSION\") | .id")
[ -n "$VER_ID" ] && echo "✅ Version $VERSION exists" || echo "❌ Version $VERSION not found"

# Metadata check
if [ -n "$VER_ID" ]; then
  LOCS=$(asc appstore versions localizations list --version-id $VER_ID --json)
  EMPTY=$(echo "$LOCS" | jq '[.[] | select(.description == "" or .description == null)] | length')
  [ "$EMPTY" = "0" ] && echo "✅ All descriptions filled" || echo "❌ $EMPTY locales missing description"
fi

echo "=== Done ==="
```

## Common Submission Errors

| Error | Fix |
|-------|-----|
| `ENTITY_ERROR.ATTRIBUTE.REQUIRED` | Missing required metadata field. Check which field. |
| `Missing screenshot for device` | Upload screenshots for all required device sizes. |
| `Build is not in a valid state` | Wait for processing or re-upload. |
| `Export compliance not answered` | Set `usesNonExemptEncryption` on version. |
| `Privacy policy URL required` | Set on app-level localizations. |
| `Invalid binary` | Signing, entitlement, or binary format issues. See `asc-xcode-build`. |

## Related Skills
- `rn-store-compliance` — policy compliance and rejection prevention
- `asc-release-flow` — submit after preflight passes
- `asc-metadata-sync` — manage metadata programmatically
- `asc-screenshots` — automate screenshot generation
