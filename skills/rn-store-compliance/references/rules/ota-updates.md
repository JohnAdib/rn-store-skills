# OTA (Over-the-Air) Update Rules

## CodePush / Expo Updates Scope Violation
**Apple**: 3.3.2 — Executable Code / 2.5.2 — Software Requirements | **Google**: Device and Network Abuse policy | **Severity**: REJECTION / REMOVAL

React Native's ability to push JavaScript updates without going through app review is powerful but strictly limited. Apple allows OTA updates for **bug fixes and minor improvements** only. Adding new features, changing app behavior, or bypassing review via OTA is a violation that can result in app removal and developer account termination.

### What's Allowed via OTA
- Bug fixes (crash fixes, logic errors, typos)
- Minor UI adjustments (spacing, colors, text changes)
- Asset updates (images, translations, configuration)
- Performance improvements
- A/B test variations (within existing feature scope)

### What's NOT Allowed via OTA
- New features or screens
- New in-app purchase products or subscription tiers
- Changes to the app's primary purpose or core functionality
- Adding new permissions or capabilities
- Adding new third-party SDKs (requires native rebuild)
- Unlocking hidden features that weren't reviewed
- Circumventing content restrictions (e.g., enabling gambling in a non-gambling app)
- Changing the app to serve a different audience or market

### Detect
```bash
# Check for CodePush integration
grep -rnE "(codePush|code-push|CodePush|react-native-code-push|appcenter.*codepush)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" --include="*.json" \
  src/ app/ package.json 2>/dev/null

# Check for Expo Updates
grep -rnE "(expo-updates|Updates\.checkForUpdateAsync|Updates\.fetchUpdateAsync|EAS Update)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" --include="*.json" \
  src/ app/ package.json app.json 2>/dev/null

# Check for custom OTA mechanisms
grep -rnE "(hot.?reload|remote.?bundle|dynamic.?bundle|bundle.?download|remote.?config.*feature)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check CodePush deployment configuration
grep -rnE "(DeploymentKey|codePushDeploymentKey|stagingKey|productionKey)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" --include="*.plist" \
  src/ app/ ios/ android/ 2>/dev/null

# Check for feature flags that could enable hidden features via OTA
grep -rnE "(feature.?flag|remote.?config|launch.?darkly|split\.io|flagsmith|unleash)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" --include="*.json" \
  src/ app/ package.json 2>/dev/null
```

### Fix
1. **Establish an OTA policy**: Document what types of changes can go through OTA vs requiring a store submission.
2. **CodePush best practices**:
   - Use `Staging` deployment for internal testing, `Production` for live users.
   - Set `installMode: codePush.InstallMode.ON_NEXT_RESTART` for non-critical updates.
   - Use `mandatoryInstallMode` only for critical bug fixes.
   - Enable rollback: CodePush automatically rolls back if the update crashes.
   - Keep updates small — large updates suggest feature changes.
3. **Expo Updates best practices**:
   - Pin `runtimeVersion` in `app.json` — this ensures OTA updates are only applied to compatible native builds.
   - Use channels (`production`, `staging`) to control rollout.
   - Use `expo-updates` `checkForUpdateAsync()` — don't force-update without user awareness.
4. **Feature flags**: Remote config (Firebase Remote Config, LaunchDarkly) for enabling/disabling features is OK, but the features must already exist in the reviewed binary. You cannot use feature flags to enable functionality that wasn't present during review.
5. **What to submit to the store** (requires new binary):
   - Any change that adds new native modules or updates native dependencies
   - New screens or features
   - Permission changes
   - New SDK integrations
   - Significant UI overhauls

### Example Rejection
> Guideline 2.5.2 — Performance: Your app's content or behavior has changed significantly since its last review in a way that was not apparent during the review process. Apps may not download or install executable code by any mechanism other than the App Store, except for legitimate bug fixes.

---

## Hidden Feature Activation
**Apple**: 2.3.1 — Accurate Metadata / 3.3.2 | **Google**: Deceptive behavior | **Severity**: REMOVAL

Shipping features that are hidden during review and activated later (via remote config, date-based triggers, or OTA updates) is treated as deliberately deceiving the review process. This carries the most severe penalty — app removal and potential account termination.

### Detect
```bash
# Check for date/time-based feature activation
grep -rnE "(Date\.now|new Date).*enable|launch.?date|go.?live|activate.?after|enable.?after" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for geo-fencing that hides features from Cupertino reviewers
grep -rnE "(cupertino|sunnyvale|apple.?park|review.?mode|is.?review|app.?review)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for server-driven feature toggles
grep -rnE "(feature.?toggle|feature.?gate|remote.?enable|server.?config.*visible)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. **Never** implement review detection (checking for Apple IP ranges, Cupertino location, or specific device configurations).
2. **Never** use date-based triggers to enable features after review approval.
3. All features in the binary must be accessible during review. If a feature requires special setup, provide instructions in App Review notes.
4. Remote config for A/B testing is fine — but all variants must be within the scope of what was reviewed.
5. If you need to launch a feature on a specific date, submit the update to the store in advance with a manual release date (not auto-release).

### Example Rejection
> Your app appears to include hidden functionality that was not available during the review process. Specifically, features activated via remote configuration were not accessible to our review team. This is a violation of the App Store Review Guidelines.

---

## Excessive Update Frequency
**Apple**: 2.5.2 | **Google**: N/A (less strict) | **Severity**: WARNING

Pushing OTA updates too frequently (multiple times per day) or pushing large updates (suggesting feature changes rather than bug fixes) can attract Apple's attention and trigger a re-review.

### Detect
```bash
# Check CodePush release frequency (if using appcenter CLI)
appcenter codepush deployment history Production -a <owner>/<app> 2>/dev/null | head -20

# Check Expo Updates release history
eas update:list --branch production 2>/dev/null | head -20

# Check update payload size
grep -rnE "(bundleSize|updateSize|downloadSize)" \
  --include="*.tsx" --include="*.ts" \
  src/ app/ 2>/dev/null
```

### Fix
1. Batch bug fixes into periodic OTA releases (weekly or bi-weekly) rather than pushing every individual fix.
2. Keep OTA update bundles small (< 5MB). Large bundles suggest feature changes.
3. Use staged rollouts — push to 10% of users first, then expand if stable.
4. Monitor crash-free rate after each OTA update before pushing to 100%.
5. For significant changes, submit a proper store update instead of trying to push via OTA.
6. Document your OTA update history — if Apple asks, you should be able to explain what each update contained.

### Example Rejection
> Guideline 2.5.2 — Performance: We've noticed that your app frequently updates its executable content outside of the App Store update mechanism. Please ensure that over-the-air updates are limited to bug fixes and do not introduce new features or change app functionality.
