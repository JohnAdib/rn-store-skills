# Entitlements & Capabilities Rules

## Unused or Unjustified Entitlements
**Apple**: 2.4.5 — Hardware Compatibility / 2.5.4 — Multitasking | **Google**: Foreground service types policy (Android 14+) | **Severity**: REJECTION

Declare only the entitlements and capabilities your app actively uses. Apple requests written justification for entitlements that appear unused during review. On Android 14+, foreground service type declarations must match actual service behavior — mismatches cause rejection.

**Commonly flagged Apple entitlements**: `com.apple.developer.networking.server`, `com.apple.security.files.downloads.read-write`, `com.apple.security.temporary-exception.*`, `com.apple.developer.healthkit`, `com.apple.developer.applesignin`

**Valid Android foreground service types**: `camera`, `connectedDevice`, `dataSync`, `health`, `location`, `mediaPlayback`, `mediaProjection`, `microphone`, `phoneCall`, `remoteMessaging`, `shortService`, `specialUse`, `systemExempted`

### Detect
```bash
# List all iOS entitlements
find ios/ -name "*.entitlements" -exec echo "=== {} ===" \; -exec cat {} \; 2>/dev/null

# Parse entitlements with plutil (macOS)
find ios/ -name "*.entitlements" -exec plutil -p {} \; 2>/dev/null

# Check which capabilities are enabled in Xcode project
grep -E "(com\.apple\.developer\.|aps-environment|healthkit|applesignin|icloud|push)" \
  ios/*.xcodeproj/project.pbxproj 2>/dev/null

# Verify HealthKit usage — if entitlement exists, code must use it
grep -rnE "(HKHealthStore|HealthKit|@react-native-community/health)" \
  --include="*.tsx" --include="*.ts" --include="*.swift" --include="*.m" \
  src/ app/ ios/ 2>/dev/null

# Verify Push Notification usage
grep -rnE "(registerForRemoteNotifications|UNUserNotificationCenter|messaging\(\)|expo-notifications)" \
  --include="*.tsx" --include="*.ts" --include="*.swift" --include="*.m" \
  src/ app/ ios/ 2>/dev/null

# Check Android foreground service declarations
grep -A5 "foregroundServiceType" android/app/src/main/AndroidManifest.xml 2>/dev/null

# Check for foreground services in code
grep -rnE "(startForeground|ForegroundService|foreground.?service)" \
  --include="*.java" --include="*.kt" --include="*.ts" --include="*.tsx" \
  android/ src/ 2>/dev/null
```

### Fix
1. For each entitlement in your `.entitlements` file, verify the corresponding code actually uses that capability.
2. Remove unused capabilities in Xcode → Signing & Capabilities tab (this removes entitlement keys automatically).
3. If you need an entitlement that Apple questions, prepare a written justification for App Review notes explaining the specific feature.
4. Common React Native culprit: installing a library that adds a capability (e.g., `react-native-health` adds HealthKit) and then removing the library but not the entitlement.
5. For Android: in `AndroidManifest.xml`, declare only the foreground service types you actually use:
   ```xml
   <service
     android:name=".MyService"
     android:foregroundServiceType="location|microphone" />
   ```
6. Remove `tools:node="merge"` from services that inject unwanted foreground service types via third-party libraries.

### Example Rejection
> Guideline 2.4.5 — Performance: Your app declares the HealthKit entitlement but does not appear to use any HealthKit functionality. Please remove unused entitlements or explain how this capability is used.

---

## Unused Background Modes
**Apple**: 2.5 — Software Requirements / 2.5.4 — Background execution | **Google**: Background execution limits | **Severity**: REJECTION

Only declare `UIBackgroundModes` your app actually uses. Libraries often add background modes automatically during `pod install` or linking. Every declared mode must have corresponding runtime code that exercises it. Apple verifies during review.

**UIBackgroundModes values**: `audio`, `location`, `voip`, `external-accessory`, `bluetooth-central`, `bluetooth-peripheral`, `fetch`, `remote-notification`, `processing`

### Detect
```bash
# Check Info.plist for declared background modes
/usr/libexec/PlistBuddy -c "Print :UIBackgroundModes" ios/*/Info.plist 2>/dev/null

# Alternative: grep for background modes
grep -A20 "UIBackgroundModes" ios/*/Info.plist 2>/dev/null

# Verify audio background mode usage
grep -rnE "(AVAudioSession|expo-av|react-native-track-player|react-native-audio)" \
  --include="*.tsx" --include="*.ts" --include="*.swift" --include="*.m" \
  src/ app/ ios/ package.json 2>/dev/null

# Verify location background mode usage
grep -rnE "(startUpdatingLocation|allowsBackgroundLocationUpdates|expo-location.*background|react-native-background-geolocation)" \
  --include="*.tsx" --include="*.ts" --include="*.swift" --include="*.m" \
  src/ app/ ios/ package.json 2>/dev/null

# Verify fetch background mode usage
grep -rnE "(BGAppRefreshTask|performFetchWithCompletionHandler|setMinimumBackgroundFetchInterval|react-native-background-fetch)" \
  --include="*.tsx" --include="*.ts" --include="*.swift" --include="*.m" \
  src/ app/ ios/ package.json 2>/dev/null

# Verify remote-notification background mode (silent push)
grep -rnE "(didReceiveRemoteNotification.*fetchCompletionHandler|content-available|silent.*push)" \
  --include="*.swift" --include="*.m" --include="*.ts" --include="*.tsx" \
  ios/ src/ 2>/dev/null

# Check Android background task declarations
grep -E "(WorkManager|JobScheduler|AlarmManager|BackgroundFetch)" \
  --include="*.java" --include="*.kt" --include="*.ts" --include="*.tsx" -r \
  android/ src/ 2>/dev/null
```

### Fix
1. Open `ios/[YourApp]/Info.plist` and remove any `UIBackgroundModes` entry your app does not use.
2. Common offenders in React Native projects:
   - `audio` added by `expo-av` or `react-native-sound` even if you only play short sounds (not background audio)
   - `location` added by mapping libraries when you only need foreground location
   - `fetch` added by background sync libraries you installed but never configured
   - `remote-notification` is needed for silent push — keep it if using push notifications with `content-available: 1`
3. After removing modes, rebuild and test that foreground features still work.
4. For Android: use `WorkManager` for deferrable background work instead of persistent services. Android 12+ restricts foreground service launch from background.
5. If Apple asks about a background mode, provide specific justification: "Background audio is used for the music playback feature on the Now Playing screen."

### Example Rejection
> Guideline 2.5.4 — Performance: Your app declares support for audio in the UIBackgroundModes key in your Info.plist, but we were unable to find this functionality in your app during review. Remove unused background modes.
