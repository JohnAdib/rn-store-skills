# Permission Rules

## Over-Requesting Permissions
**Apple**: 5.1 — Privacy — Data Use and Sharing | **Google**: Permissions policy | **Severity**: REJECTION

Requesting permissions your app does not use triggers rejection on both stores. In React Native, third-party libraries inject permissions into `Info.plist` (iOS) and `AndroidManifest.xml` (Android) via their own manifest entries — you inherit permissions you never asked for.

### Detect
```bash
# List all iOS permission usage descriptions (every NS*UsageDescription key)
grep -E "UsageDescription" ios/*/Info.plist 2>/dev/null

# Parse Info.plist for all permission keys
/usr/libexec/PlistBuddy -c "Print" ios/*/Info.plist 2>/dev/null | grep -E "UsageDescription"

# Check merged Android manifest for all permissions
cat android/app/build/intermediates/merged_manifests/release/AndroidManifest.xml 2>/dev/null | grep "uses-permission"

# If merged manifest not available, check source manifest + library manifests
grep -r "uses-permission" android/app/src/main/AndroidManifest.xml 2>/dev/null
grep -rn "uses-permission" node_modules/*/android/src/main/AndroidManifest.xml 2>/dev/null | head -20

# Check Expo config for permissions
grep -A20 "permissions" app.json app.config.js app.config.ts 2>/dev/null
```

### Fix
1. For each permission in `Info.plist`, verify your app actually uses the corresponding API. Remove keys for unused permissions.
2. For Android, block library-injected permissions in your `AndroidManifest.xml`:
   ```xml
   <uses-permission android:name="android.permission.RECORD_AUDIO" tools:node="remove" />
   <uses-permission android:name="android.permission.READ_PHONE_STATE" tools:node="remove" />
   ```
   Add `xmlns:tools="http://schemas.android.com/tools"` to the `<manifest>` tag.
3. For Expo managed workflow, use the `permissions` array in `app.json` to explicitly list only needed permissions (Android). For iOS, only include the `infoPlist` keys you need.
4. After fixing, rebuild and re-check the merged manifest to confirm removed permissions are gone.
5. Common RN libraries that inject unwanted permissions:
   - `react-native-camera` → adds Camera, Microphone, Storage
   - `react-native-contacts` → adds Contacts
   - `expo-location` → adds Fine/Coarse Location even if you only need coarse

### Example Rejection
> Guideline 5.1 — Legal — Privacy: Your app requests permission to access the microphone but does not appear to use microphone functionality. Please remove the NSMicrophoneUsageDescription key from your Info.plist.

---

## Vague Permission Rationale Strings
**Apple**: 5.1.1 — Data Collection and Storage | **Google**: Permissions best practices | **Severity**: REJECTION

Every `NS*UsageDescription` string in `Info.plist` must explain the **specific feature** that requires the permission. Generic strings like "This app needs camera access" get rejected. Apple reviewers read these strings and reject vague or misleading ones.

### Detect
```bash
# Read all permission rationale strings
grep -B1 -A1 "UsageDescription" ios/*/Info.plist 2>/dev/null

# Check for vague patterns
grep -E "UsageDescription" ios/*/Info.plist 2>/dev/null | grep -iE "(needs|requires|uses|wants|access to)"

# Check Expo infoPlist overrides
grep -A30 "infoPlist" app.json app.config.js app.config.ts 2>/dev/null
```

**Rejected examples** (too vague):
- "This app needs camera access"
- "Camera is required"
- "We need your location"
- "Allow access to photos"

**Approved examples** (specific):
- "Used to scan barcodes for price comparison in the Scanner tab"
- "Your location is used to show nearby restaurants on the Map screen"
- "Access to your photo library lets you upload a profile picture"

### Fix
1. Rewrite every `NS*UsageDescription` value to include:
   - **What feature** uses the permission (name the specific screen or action)
   - **Why** it needs the data (what the user gets in return)
2. Format: "[Feature name] uses [permission] to [user benefit]"
3. Keep strings user-friendly — these appear in the system dialog that users see.
4. Do not include the app name (the system dialog already shows it).
5. Do not be deceptive — the string must match actual usage.
6. Localize permission strings for every supported locale.

### Example Rejection
> Guideline 5.1.1 — Legal — Privacy: Your app's purpose string for NSCameraUsageDescription does not sufficiently explain the use of the camera. Please update the string to clearly describe why the app needs this access.

---

## Background Location Without Justification
**Apple**: 5.1 — Privacy | **Google**: Background location policy | **Severity**: REJECTION

Background location access faces extra scrutiny on both stores. Google manually reviews every background location request — weak justification leads to high rejection rates. Apple requires `NSLocationAlwaysAndWhenInUseUsageDescription` and expects visible background location indicators.

### Detect
```bash
# iOS: check for background location permission keys
grep -E "(NSLocationAlwaysAndWhenInUseUsageDescription|NSLocationAlwaysUsageDescription)" \
  ios/*/Info.plist 2>/dev/null

# iOS: check for background location mode
grep -A5 "UIBackgroundModes" ios/*/Info.plist 2>/dev/null | grep "location"

# Android: check for background location permission
grep -E "ACCESS_BACKGROUND_LOCATION" \
  android/app/src/main/AndroidManifest.xml 2>/dev/null

# Check code for background location usage
grep -rnE "(startMonitoringSignificantLocationChanges|allowsBackgroundLocationUpdates|requestAlwaysAuthorization|ACCESS_BACKGROUND_LOCATION)" \
  --include="*.tsx" --include="*.ts" --include="*.swift" --include="*.m" --include="*.java" --include="*.kt" \
  src/ app/ ios/ android/ 2>/dev/null

# Check for background geolocation libraries
grep -E "(react-native-background-geolocation|expo-location.*background|expo-task-manager)" \
  package.json 2>/dev/null
```

### Fix
1. First, determine if you truly need **background** location. Most apps only need foreground location. If you only need location while the app is open, use `When In Use` only.
2. If background location is required:
   - Write a clear justification in App Store Connect review notes explaining the specific feature.
   - Write a clear justification in Google Play Console's Permissions Declaration Form.
   - Add a pre-permission explanation screen in the app (before the system dialog) explaining why background location is needed.
   - Both strings (`NSLocationWhenInUseUsageDescription` and `NSLocationAlwaysAndWhenInUseUsageDescription`) must clearly describe the background usage.
3. Google requires: submit a short video showing the feature that uses background location. The video must demonstrate clear user-facing value.
4. Apple requires: your app must show the blue status bar indicator when using background location, or use significant location change monitoring.
5. Consider alternatives: geofencing (uses less battery and is less scrutinized), significant location changes (lower precision, less review friction), or foreground-only with a notification that keeps the app alive.

### Example Rejection
> Your app requests background location access but the submitted justification does not demonstrate a clear user-facing feature that requires continuous location tracking. Please provide additional justification or switch to foreground-only location access.

---

## Permissions Requested at Wrong Time
**Apple**: 5.1 — Privacy | **Google**: Permissions best practices | **Severity**: REJECTION

Requesting all permissions on first launch — before the user has context for why — triggers rejection. Permissions must be contextual: request camera when the user taps "Scan Barcode," not during onboarding. Both stores call this "just-in-time" permissions.

### Detect
```bash
# Check app entry point / initialization for permission requests
grep -rnE "(requestPermission|request\(PERMISSIONS|PermissionsAndroid\.request|requestAuthorization|requestAccess)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/App.tsx app/_layout.tsx app/index.tsx src/index.tsx 2>/dev/null

# Check for bulk permission requests at startup
grep -rnE "(requestMultiple|requestAll|checkMultiplePermissions)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for permission requests in useEffect with empty deps (runs on mount)
grep -B5 -A5 "requestPermission" \
  --include="*.tsx" --include="*.ts" \
  src/App.tsx app/_layout.tsx 2>/dev/null
```

### Fix
1. Move every permission request to the point where the user initiates the feature that needs it:
   - Camera → when user taps "Take Photo" or "Scan"
   - Location → when user taps "Find Nearby" or opens the map
   - Notifications → after onboarding, or after first meaningful action
   - Contacts → when user taps "Invite Friends"
2. Add a pre-permission explanation screen (custom UI, not the system dialog) that explains the value before triggering the system prompt:
   ```
   [Icon: Camera]
   "Scan product barcodes to compare prices instantly"
   [Allow Camera Access] [Not Now]
   ```
3. If the user denies, provide graceful degradation — show the feature with a "permission needed" message and a way to open Settings.
4. Never request permissions in `App.tsx` mount, `_layout.tsx` mount, or splash screen.
5. Push notification permission is the exception — it can be asked during onboarding if you explain the value, but best practice is still to delay until the user has experienced the app.

### Example Rejection
> Guideline 5.1 — Legal — Privacy: Your app requests multiple permissions at launch before the user has accessed the features that require them. Permission requests should be contextual and occur at the time the user accesses the relevant feature.

---

## Common React Native Permission Keys Reference

| iOS Info.plist Key | Android Permission | When Needed |
|---|---|---|
| `NSCameraUsageDescription` | `android.permission.CAMERA` | Photo/video capture, barcode scanning, AR |
| `NSMicrophoneUsageDescription` | `android.permission.RECORD_AUDIO` | Voice recording, video with audio, voice chat |
| `NSPhotoLibraryUsageDescription` | `android.permission.READ_MEDIA_IMAGES` | Selecting photos from gallery |
| `NSPhotoLibraryAddUsageDescription` | `android.permission.WRITE_EXTERNAL_STORAGE` | Saving photos/videos to gallery |
| `NSLocationWhenInUseUsageDescription` | `android.permission.ACCESS_FINE_LOCATION` | Maps, nearby search, geotagging |
| `NSLocationAlwaysAndWhenInUseUsageDescription` | `android.permission.ACCESS_BACKGROUND_LOCATION` | Geofencing, fitness tracking, navigation |
| `NSContactsUsageDescription` | `android.permission.READ_CONTACTS` | Contact sync, invite friends |
| `NSCalendarsUsageDescription` | `android.permission.READ_CALENDAR` | Event creation, scheduling |
| `NSFaceIDUsageDescription` | `android.permission.USE_BIOMETRIC` | Biometric authentication |
| `NSMotionUsageDescription` | `android.permission.ACTIVITY_RECOGNITION` | Step counting, fitness tracking |
| `NSBluetoothAlwaysUsageDescription` | `android.permission.BLUETOOTH_CONNECT` | BLE device pairing, wearables |
| `NSUserTrackingUsageDescription` | `com.google.android.gms.permission.AD_ID` | Ad tracking (ATT required on iOS 14.5+) |
| `NSSpeechRecognitionUsageDescription` | `android.permission.RECORD_AUDIO` | Voice-to-text, speech recognition |
| `NSAppleMusicUsageDescription` | N/A | Access Apple Music library |
| `NSHealthShareUsageDescription` | `android.permission.BODY_SENSORS` | Read health data (HealthKit / Health Connect) |
