# React Native Specific Compliance Patterns

RN/Expo-specific compliance issues. Read alongside the relevant `rules/` files for detection patterns and fixes.

---

## Apple-Specific React Native Checks

### Permissions in Info.plist

Every permission must have a specific, user-facing description in `ios/[AppName]/Info.plist`.

**Rejected** (too vague):
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to your camera</string>
```

**Approved** (specific):
```xml
<key>NSCameraUsageDescription</key>
<string>Used to scan barcodes for price comparison</string>
```

Common permission keys:
| Permission Key | When Needed |
|---------------|-------------|
| `NSCameraUsageDescription` | Camera (photos, video, QR scanning) |
| `NSPhotoLibraryUsageDescription` | Reading photos from library |
| `NSPhotoLibraryAddUsageDescription` | Saving photos to library |
| `NSLocationWhenInUseUsageDescription` | Location while app is open |
| `NSLocationAlwaysAndWhenInUseUsageDescription` | Background location |
| `NSMicrophoneUsageDescription` | Audio recording |
| `NSContactsUsageDescription` | Accessing contacts |
| `NSCalendarsUsageDescription` | Accessing calendar |
| `NSFaceIDUsageDescription` | Face ID authentication |
| `NSMotionUsageDescription` | Accelerometer/gyroscope |
| `NSBluetoothAlwaysUsageDescription` | Bluetooth access |
| `NSUserTrackingUsageDescription` | App Tracking Transparency |

Remove permissions for features you don't use. Third-party libraries often add permissions to Info.plist that your app doesn't need. Audit after adding any dependency.

See `rules/permissions.md` for detection patterns and full reference table.

### App Transport Security (ATS)

Don't disable ATS globally:
```xml
<!-- DON'T DO THIS -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

Use per-domain exceptions for specific APIs that don't support HTTPS:
```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSExceptionDomains</key>
    <dict>
        <key>legacy-api.example.com</key>
        <dict>
            <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
            <true/>
        </dict>
    </dict>
</dict>
```

Metro bundler `localhost` exceptions are OK in dev but must not be in production Info.plist.

### Minimum iOS Version

- iOS 16+ is safe minimum deployment target as of 2026
- React Native 0.73+ requires iOS 15.1 minimum
- React Native 0.76+ requires iOS 16.0 minimum
- Check Podfile: `platform :ios, '16.0'`
- Expo: set `expo.ios.deploymentTarget` in `app.json`

### Sign in with Apple

**Required** if app offers any third-party login (Google, Facebook, Twitter, etc.).

Implementation:
- `@invertase/react-native-apple-authentication`
- `expo-apple-authentication` (Expo managed)
- Firebase Auth with Apple provider

See `rules/design.md` for SIWA violation patterns and detection.

### Push Notifications

- Must use APNS; app must function without notifications enabled
- Don't gate core functionality on notification permissions
- Request permission at appropriate time, not first launch

RN libraries:
- `@react-native-firebase/messaging` (FCM → APNS bridge)
- `expo-notifications` (Expo managed)
- `notifee`

### Universal Links / Deep Links

- `apple-app-site-association` file must be valid JSON at `/.well-known/apple-app-site-association`
- Served over HTTPS, no `.json` extension, `Content-Type: application/json`
- `appID` must match team ID + bundle ID
- Test: `https://app-site-association.cdn-apple.com/a/v1/yourdomain.com`

---

## Google-Specific React Native Checks

### Permissions in AndroidManifest.xml

Remove unused permissions from third-party libraries:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"
        tools:node="remove" />
</manifest>
```

Check merged manifest: `android/app/build/intermediates/merged_manifest/`

Background location (`ACCESS_BACKGROUND_LOCATION`) requires extra Play Console justification — high rejection rate.

### ProGuard / R8

Enable for release builds in `android/app/build.gradle`:
```groovy
buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

Ensure keep rules for RN bridge methods, native modules, JSON serialization, and reflection-based libs. Missing keep rules = runtime crashes only in release builds.

### App Signing

- Use **Play App Signing** — Google manages signing key
- For Expo: `eas credentials` manages this automatically
- Store upload keystore securely

### Deep Links / App Links

- `assetlinks.json` at `https://yourdomain.com/.well-known/assetlinks.json`
- SHA256 fingerprint must match signing certificate (Play App Signing fingerprint, not upload key)
- Test: `adb shell am start -a android.intent.action.VIEW -d "https://yourdomain.com/path"`

---

## Common React Native Rejection Patterns

### 1. Expo Go vs Standalone Build
Submit standalone builds (`eas build`), never Expo Go.

### 2. JavaScript Bundle Errors
White screen on launch → instant rejection. Verify bundle exists in binary.
See `rules/performance.md` for detection commands.

### 3. Hermes Engine Crashes
Hermes behaves differently from JSC in release builds — Intl, regex, BigInt differences.
See `rules/performance.md` for details.

### 4. Native Module Compatibility
Check compatibility before upgrading RN. Use `npx react-native-community/cli doctor`.

### 5. Splash Screen Duration
Over 3-5 seconds → Apple rejects for poor UX. Use `expo-splash-screen` with explicit hide timing.

### 6. WebView-Heavy Apps
See `rules/design.md` for minimum functionality requirements.

### 7. Over-Requesting Permissions
See `rules/permissions.md` for detection and just-in-time patterns.

### 8. Missing Offline Handling
Use `@react-native-community/netinfo`. Show clear offline state, cache essential data.

### 9. Deep Link Crashes
Validate all parameters. Test from: cold start, background, other apps, Safari/Chrome, notifications.

### 10. Large App Size
See `rules/performance.md` for size reduction strategies.

---

## AI / Generative AI Features

See `app-types/ai.md` for the complete AI app compliance checklist.

Key points:
- Apple: consent modal before sending data to AI services (specify provider, data types, purpose)
- Google: AI-generated content must not violate content policies, realistic media needs provenance signals
- China: banned terms across all locales if distributing to China storefront

---

## Age Ratings

### Apple
- New age ratings effective July 2025: 13+, 16+, 18+ (added to existing 4+, 9+, 12+, 17+)
- Updated questionnaire required by January 31, 2026
- UGC/social/unrestricted web → likely 16+ or 18+

### Google
- IARC questionnaire in Play Console, answer honestly
- Designed for Families program has additional requirements
- Disclose UGC capabilities — affects rating

### React Native Considerations
- Third-party SDKs can affect age rating (Facebook SDK → social questions)
- WebView content subject to rating
- Gambling/loot box mechanics require specific disclosures
