# Multi-Step Workflow Automation

Common multi-step `asc` workflows for CI/CD pipelines and automation scripts.

## Full Release Workflow

```bash
#!/bin/bash
set -e

BUNDLE="com.example.app"
VERSION="2.0.0"

echo "🚀 Release $BUNDLE v$VERSION"

# 1. Wait for build processing
echo "⏳ Waiting for build..."
while true; do
  STATE=$(asc builds latest --bundle-id $BUNDLE --json | jq -r '.processingState')
  [ "$STATE" = "VALID" ] && break
  [ "$STATE" = "INVALID" ] || [ "$STATE" = "FAILED" ] && echo "❌ Build failed" && exit 1
  sleep 30
done
BUILD_ID=$(asc builds latest --bundle-id $BUNDLE --json | jq -r '.id')
echo "✅ Build ready: $BUILD_ID"

# 2. Create version
echo "📝 Creating version..."
asc appstore versions create --bundle-id $BUNDLE --platform ios --version "$VERSION"
VERSION_ID=$(asc appstore versions list --bundle-id $BUNDLE --json | \
  jq -r ".[] | select(.versionString == \"$VERSION\") | .id")

# 3. Assign build
asc appstore versions set-build --version-id $VERSION_ID --build-id $BUILD_ID

# 4. Set compliance
asc appstore versions update --version-id $VERSION_ID --uses-non-exempt-encryption false

# 5. Submit
asc appstore review-submissions create --version-id $VERSION_ID
echo "✅ Submitted for review"
```

## TestFlight Distribution Workflow

```bash
#!/bin/bash
set -e

BUNDLE="com.example.app"
GROUP_NAME="Beta Testers"

# 1. Get latest build
BUILD_ID=$(asc builds latest --bundle-id $BUNDLE --json | jq -r '.id')

# 2. Find group
GROUP_ID=$(asc testflight groups list --bundle-id $BUNDLE --json | \
  jq -r ".[] | select(.name == \"$GROUP_NAME\") | .id")

# 3. Add build to group
asc testflight groups add-build --group-id $GROUP_ID --build-id $BUILD_ID

# 4. Set testing notes
asc testflight localizations update \
  --build-id $BUILD_ID \
  --locale en-US \
  --what-to-test "$(cat TESTING_NOTES.md)"

echo "✅ Build distributed to $GROUP_NAME"
```

## Metadata Update Workflow

```bash
#!/bin/bash
set -e

BUNDLE="com.example.app"
VERSION_ID="$1"
METADATA_DIR="./metadata"

# Update all locales from files
for LOCALE_DIR in $METADATA_DIR/*/; do
  LOCALE=$(basename "$LOCALE_DIR")
  echo "📝 Updating $LOCALE..."

  DESC=$(cat "$LOCALE_DIR/description.txt" 2>/dev/null || true)
  WHATS_NEW=$(cat "$LOCALE_DIR/whats_new.txt" 2>/dev/null || true)
  KEYWORDS=$(cat "$LOCALE_DIR/keywords.txt" 2>/dev/null || true)

  asc appstore versions localizations update \
    --version-id $VERSION_ID \
    --locale $LOCALE \
    ${DESC:+--description "$DESC"} \
    ${WHATS_NEW:+--whats-new "$WHATS_NEW"} \
    ${KEYWORDS:+--keywords "$KEYWORDS"}
done

echo "✅ All locales updated"
```

## CI/CD Integration

### GitHub Actions

```yaml
- name: Upload to App Store Connect
  env:
    ASC_KEY_ID: ${{ secrets.ASC_KEY_ID }}
    ASC_ISSUER_ID: ${{ secrets.ASC_ISSUER_ID }}
    ASC_PRIVATE_KEY: ${{ secrets.ASC_PRIVATE_KEY }}
  run: |
    echo "$ASC_PRIVATE_KEY" > AuthKey.p8
    export ASC_PRIVATE_KEY_PATH=AuthKey.p8
    asc builds upload --file build/MyApp.ipa
    rm AuthKey.p8
```

### Environment Variables

```bash
# Required for all asc commands
ASC_KEY_ID        # API Key ID
ASC_ISSUER_ID     # Issuer ID from App Store Connect
ASC_PRIVATE_KEY_PATH  # Path to .p8 key file

# Optional
ASC_TIMEOUT       # Request timeout in seconds
```

## Error Handling

```bash
# Retry with backoff
retry() {
  local max=3 delay=5 attempt=1
  while [ $attempt -le $max ]; do
    "$@" && return 0
    echo "Attempt $attempt/$max failed. Retrying in ${delay}s..."
    sleep $delay
    delay=$((delay * 2))
    attempt=$((attempt + 1))
  done
  echo "❌ Failed after $max attempts"
  return 1
}

retry asc builds upload --file build/MyApp.ipa
```

## Dry Run Pattern

For destructive operations, preview before executing:

```bash
# Preview
asc builds list --bundle-id $BUNDLE --limit 100 --json | \
  jq -r '.[] | select(.uploadedDate < "2024-01-01") | "Would expire: \(.id) (\(.buildNumber))"'

# Execute (after review)
asc builds list --bundle-id $BUNDLE --limit 100 --json | \
  jq -r '.[] | select(.uploadedDate < "2024-01-01") | .id' | \
  while read id; do asc builds expire "$id"; done
```
