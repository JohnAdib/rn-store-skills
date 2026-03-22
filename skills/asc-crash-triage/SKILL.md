---
name: asc-crash-triage
description: >
  Triage TestFlight crashes, beta feedback, and performance diagnostics from
  App Store Connect. Trigger on: crash report, crash triage, TestFlight crash,
  beta feedback, app crash, crash log, performance diagnostics, hang diagnostics,
  disk write diagnostics, symbolication, dSYM.
license: MIT
metadata:
  author: JohnAdib
  version: "1.0.0"
  tags: [app-store-connect, asc, crashes, diagnostics, testflight, debugging]
---

# Crash Triage

Analyze TestFlight crashes, beta feedback, and performance diagnostics.

## Fetch Crash Reports

### List crash groups
```bash
asc crashes list --bundle-id com.example.app --json
```

### Filter by build
```bash
asc crashes list --bundle-id com.example.app --build-number 42 --json
```

### Get crash details
```bash
asc crashes info CRASH_GROUP_ID --json
```

### Crash data includes
- Exception type and code
- Crashed thread backtrace
- Device model and OS version
- App version and build number
- Crash count and affected device count

## Beta Feedback

### List feedback
```bash
asc testflight feedback list --bundle-id com.example.app --json
```

### Filter by build
```bash
asc testflight feedback list --bundle-id com.example.app --build-number 42 --json
```

### Feedback includes
- Tester comments
- Screenshots (if attached)
- Device info
- App state at time of feedback

## Performance Diagnostics

### Hang diagnostics
```bash
asc diagnostics hangs --bundle-id com.example.app --json
```

### Disk write diagnostics
```bash
asc diagnostics disk-writes --bundle-id com.example.app --json
```

### Launch diagnostics
```bash
asc diagnostics launches --bundle-id com.example.app --json
```

## Triage Workflow

### 1. Prioritize by impact
```bash
# Sort crashes by occurrence count
asc crashes list --bundle-id com.example.app --json | \
  jq 'sort_by(-.count) | .[:10] | .[] | {exception: .exceptionType, count, devices: .deviceCount}'
```

### 2. Group by type
- **EXC_BAD_ACCESS**: Memory access violation. Null pointer, use-after-free, buffer overflow.
- **EXC_CRASH (SIGABRT)**: Assertion failure, unhandled exception, forced termination.
- **EXC_BREAKPOINT**: Swift runtime trap. Force unwrap nil, array out of bounds.
- **Watchdog**: App took too long (launch, background task). Main thread blocked.
- **OOM**: Out of memory. Memory leak, large allocation.

### 3. Analyze by device/OS
```bash
asc crashes info CRASH_GROUP_ID --json | \
  jq '.instances | group_by(.deviceModel) | .[] | {device: .[0].deviceModel, count: length}'
```

## Symbolication

Crash logs need symbolication to show readable function names.

### Upload dSYMs
```bash
# Find dSYMs in archive
find build/MyApp.xcarchive -name "*.dSYM"

# Upload to App Store Connect
asc dsyms upload --bundle-id com.example.app --file MyApp.app.dSYM.zip
```

### Hermes symbolication (React Native)
```bash
# Hermes bytecode source maps
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output /dev/null \
  --sourcemap-output sourcemap.js.map

# Upload source map to crash reporting service
```

### EAS Build dSYMs
```bash
# Download dSYMs from EAS
eas build:list --platform ios --json | jq '.[0].artifacts.buildUrl'
# dSYMs are included in the build artifacts
```

## React Native Crash Patterns

| Crash pattern | Likely cause | Fix |
|--------------|-------------|-----|
| `RCTFatalException` | Unhandled JS exception in release | Add error boundary, fix the JS error |
| `EXC_BAD_ACCESS in hermes` | Hermes engine crash | Update Hermes, check for known issues |
| `SIGABRT in libc++` | Native module crash | Check native module compatibility |
| `Watchdog timeout on launch` | Slow JS bundle load | Reduce bundle size, use lazy loading |
| OOM on image-heavy screens | Image memory not released | Use `FastImage`, limit concurrent loads |
| `NSInvalidArgumentException` | Wrong type passed to native | Check bridge data types |

## Sentry Integration

For more detailed crash reporting with React Native:

```bash
# Install Sentry
npx expo install @sentry/react-native

# Upload source maps
npx sentry-cli releases files VERSION upload-sourcemaps \
  --dist BUILD_NUMBER \
  --rewrite sourcemap.js.map
```

Sentry provides:
- Real-time crash alerts
- JS + native unified stack traces
- Release health tracking
- Performance monitoring
- User context and breadcrumbs

## Bugsnag Integration

```bash
npx expo install @bugsnag/react-native

# Upload source maps
npx bugsnag-source-maps upload-react-native \
  --api-key YOUR_KEY \
  --platform ios \
  --source-map sourcemap.js.map \
  --bundle main.jsbundle
```

## Output Formats

Most `asc` crash commands support:
```bash
--json          # Machine-readable JSON
--csv           # Spreadsheet-friendly
# (default)     # Human-readable table
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Unsymbolicated crashes | Upload dSYMs. Check UUID matches with `dwarfdump --uuid`. |
| No crash data | Crashes appear after ~24h. Check build is distributed. |
| Missing JS stack trace | Upload Hermes source maps. Check source map generation. |
| `--paginate` needed | Use for apps with many crash groups. |

## Related Skills
- `asc-build-lifecycle` — check build status
- `asc-testflight-ops` — manage beta testing
- `rn-store-compliance` — prevent crashes from performance issues
