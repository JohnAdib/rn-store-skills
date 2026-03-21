# React Native Specific Compliance Patterns

These are compliance issues and rejection patterns specific to React Native and Expo apps.
They apply in addition to the general Apple and Google guidelines.

---

## Apple-Specific React Native Checks

### Permissions in Info.plist

Every permission your app requests must have a clear, user-facing description string in
`ios/[AppName]/Info.plist`. The string must explain **specifically why** the app needs it.

**Will cause rejection** (too vague):
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs access to your camera</string>
```

**Will pass review** (specific):
```xml
<key>NSCameraUsageDescription</key>
<string>Used to scan barcodes for price comparison</string>
```

Common permission keys for React Native apps:
| Permission Key | When Needed |
|---------------|-------------|
| `NSCameraUsageDescription` | Camera access (photos, video, QR scanning) |
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

**Important**: Remove permissions for features you don't use. Third-party libraries often
add permissions to Info.plist that your app doesn't need. Audit `Info.plist` after adding
any new dependency.

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

If you need HTTP exceptions (e.g., for a local dev server or a specific API that doesn't
support HTTPS), declare them per-domain:
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

React Native's Metro bundler: ATS exceptions for `localhost` are acceptable during
development but must not be in the production build's Info.plist.

### Minimum iOS Version

- iOS 16+ is a safe minimum deployment target as of 2026
- React Native 0.73+ requires iOS 15.1 minimum
- React Native 0.76+ requires iOS 16.0 minimum
- Check your Podfile: `platform :ios, '16.0'`
- Expo: set `expo.ios.deploymentTarget` in `app.json`

### Sign in with Apple

**Required** if your app offers any third-party login (Google, Facebook, Twitter, GitHub, etc.).

Implementation options:
- `@invertase/react-native-apple-authentication` — most popular
- `expo-apple-authentication` — for Expo managed workflow
- Firebase Auth with Apple provider

Requirements:
- Must be displayed as a login option alongside other providers
- Must use Apple's official button style (dark, light, or outline)
- Must handle the "Hide My Email" relay properly
- Must handle the case where the user previously signed in but revoked access

### Push Notifications

- Must use APNS (Apple Push Notification service)
- The app must function without push notifications enabled — don't gate core functionality
  on notification permissions
- Don't use push notifications purely for marketing without explicit user consent
- Use proper entitlements: `aps-environment` in the entitlements file
- Request notification permission at an appropriate time (not immediately on first launch)
- Handle notification payloads gracefully — malformed payloads must not crash the app

React Native libraries:
- `@react-native-firebase/messaging` (FCM → APNS bridge)
- `expo-notifications` (Expo managed)
- `react-native-push-notification` / `notifee`

### Background Modes

Only declare background modes you actually use in Info.plist:

```xml
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>      <!-- Only if playing audio in background -->
    <string>location</string>   <!-- Only if tracking location in background -->
    <string>fetch</string>      <!-- Only if doing background fetch -->
    <string>remote-notification</string> <!-- Only if processing silent push -->
</array>
```

**Common rejection cause**: Libraries that add background modes automatically. Check that
each declared mode is actually used. Remove unused ones.

### Universal Links / Deep Links

If implementing deep links on iOS:
- The `apple-app-site-association` (AASA) file must be valid JSON
- Must be served over HTTPS from your domain at `/.well-known/apple-app-site-association`
- Must not have a `.json` extension
- Must be served with `Content-Type: application/json`
- The `appID` in the AASA file must match your team ID + bundle ID
- Test with Apple's validation tool: `https://app-site-association.cdn-apple.com/a/v1/yourdomain.com`

---

## Google-Specific React Native Checks

### Permissions in AndroidManifest.xml

Only request permissions you actually use. Third-party libraries often add permissions via
their own `AndroidManifest.xml` that merge into your app.

Remove unused permissions explicitly:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Remove permissions added by libraries that you don't need -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"
        tools:node="remove" />
    <uses-permission android:name="android.permission.RECORD_AUDIO"
        tools:node="remove" />
</manifest>
```

Check merged manifest: `android/app/build/intermediates/merged_manifest/` after building.

**Background location** (`ACCESS_BACKGROUND_LOCATION`) requires:
- Extra justification in the Play Console
- A separate permission request after foreground location is granted
- Clear user-facing explanation of why background location is needed
- Google reviews these manually — rejection rate is high if justification is weak

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

Ensure keep rules exist for:
- React Native bridge methods
- Any native modules you use
- JSON serialization classes (Gson, Moshi)
- Libraries that use reflection

Missing keep rules = runtime crashes that only appear in release builds. Always test the
release build on a real device before submitting.

### App Signing

- Use **Play App Signing** — Google manages your signing key
- You keep the upload key locally for signing builds you submit
- If you lose your upload key, contact Google Play support with identity verification
- Store the upload keystore securely — version control it encrypted or use a secret manager
- For Expo: `eas credentials` manages this automatically

### Crash Rate and ANR Monitoring

Google monitors app health metrics:
- **Crash rate**: Keep below **1.09%** (user-perceived crash rate)
- **ANR rate**: Keep below **0.47%** (Application Not Responding rate)

Exceeding these thresholds results in:
- Reduced visibility in Play Store search
- Warning badge on the store listing
- Potential removal if sustained

Common React Native crash sources:
- Hermes engine bugs (especially with certain Intl operations)
- Native module crashes (null pointer exceptions in Java/Kotlin)
- OOM (Out of Memory) on low-end devices
- Race conditions during app cold start
- Unhandled promise rejections in release builds

Common ANR sources:
- Synchronous native bridge calls blocking the UI thread
- Large JSON parsing on the main thread
- Database operations on the main thread
- Network calls on the main thread (should use async)

### Deep Links / App Links

For Android deep links:
- Digital Asset Links file (`assetlinks.json`) must be valid JSON
- Served from `https://yourdomain.com/.well-known/assetlinks.json`
- The SHA256 fingerprint must match your app's signing certificate
- For Play App Signing, use the Play Console's provided fingerprint (not your upload key's)
- Test with: `adb shell am start -a android.intent.action.VIEW -d "https://yourdomain.com/path"`

---

## Common React Native Rejection Patterns

These are the 10 patterns that most frequently cause React Native app rejections:

### 1. Expo Go vs Standalone Build

**Problem**: Submitting an Expo Go build instead of a standalone build.
**Fix**: Always use `eas build --platform ios` and `eas build --platform android` for store
submissions. Never submit the Expo Go app.

### 2. JavaScript Bundle Errors

**Problem**: JS bundle not included in the binary → white screen on launch → instant rejection.
**Fix**: Verify the bundle is present:
- iOS: Check `ios/main.jsbundle` exists in the Xcode project
- Android: Run `npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle`
- Expo: `eas build` handles this automatically

### 3. Hermes Engine Crashes

**Problem**: Hermes (default in RN 0.70+) has bugs that only appear in release builds.
**Fix**: Test release builds thoroughly on both platforms. Common Hermes issues:
- `Intl` API differences from JavaScriptCore
- Certain regex patterns that work in JSC but crash in Hermes
- BigInt support differences

### 4. Native Module Compatibility

**Problem**: After upgrading React Native, native modules crash because they're incompatible
with the new architecture.
**Fix**: Before upgrading, check compatibility of all native modules. Use
`npx react-native-community/cli doctor` and check each module's changelog/issues.

### 5. Splash Screen Duration

**Problem**: Splash screen displayed for too long (>3-5 seconds) → Apple rejects for poor UX.
**Fix**: Load only essential data during splash. Use `expo-splash-screen` or
`react-native-splash-screen` with explicit hide timing. Defer non-critical initialization.

### 6. WebView-Heavy Apps

**Problem**: Most of the app is WebView content → both stores reject for not providing
native value.
**Fix**: Implement core screens natively. Use WebView only for specific content that must
be web-rendered (e.g., terms of service, blog posts). The majority of the app's
functionality should be native React Native screens.

### 7. Over-Requesting Permissions

**Problem**: Requesting all permissions on first launch or requesting permissions the app
doesn't clearly need.
**Fix**: Request permissions just-in-time — only when the user is about to use the feature
that needs the permission. Show a pre-permission explanation screen before the system dialog.

### 8. Missing Offline Handling

**Problem**: App shows blank screen or crashes when offline.
**Fix**: Implement offline detection (`@react-native-community/netinfo`). Show a clear
offline state UI. Cache essential data for offline access where possible. Queue mutations
to sync when back online.

### 9. Deep Link Crashes

**Problem**: Deep links crash the app on cold start or when passed malformed URLs.
**Fix**: Validate all deep link parameters. Handle missing/malformed parameters gracefully.
Test deep links from: cold start, background, other apps, Safari/Chrome, notifications.
Use try/catch around deep link parameter parsing.

### 10. Large App Size

**Problem**: App bundle exceeds 200MB or download size is unreasonably large.
**Fix**:
- Enable Hermes (reduces JS bundle size)
- Use ProGuard/R8 on Android
- Use App Thinning on iOS (bitcode, slicing)
- Move large assets to on-demand resources or dynamic feature modules
- Compress images, use WebP format
- Remove unused native architectures from the build

---

## AI / Generative AI Features

If the app uses AI or generative AI features (ChatGPT, Gemini, Claude, Stable Diffusion,
local LLMs, image generation, voice cloning, etc.):

### Apple Requirements

- Must disclose the AI service provider used
- If sharing personal data with external AI services, show a consent modal BEFORE any data
  is sent. The modal must specify:
  - Which AI service provider(s)
  - What data types are being shared
  - Purpose of the data sharing
- AI-generated content that is user-facing must be moderated
- Don't generate content that impersonates real people
- AI-generated images should not be presented as real photographs without disclosure
- Apps using generative AI for chat/conversation must have content safety measures

### Google Requirements

- AI-generated content must not violate any content policies (same rules as human-created content)
- Apps generating realistic images/video/audio of real people must include provenance signals
  (e.g., watermarks, metadata indicating AI generation)
- Must disclose AI usage prominently in the app description if AI is a core feature
- AI-powered features that make decisions affecting users (credit, hiring, etc.) may have
  additional regulatory requirements depending on jurisdiction
- Apps must not use AI to generate deceptive content (deepfakes for fraud, etc.)

---

## Age Ratings

### Apple

- New age ratings effective July 2025: **13+, 16+, 18+** (in addition to existing 4+, 9+, 12+, 17+)
- Developers must complete the updated age rating questionnaire by January 31, 2026
- Apps with UGC, social features, or unrestricted web access will likely be rated **16+ or 18+**
- Incorrect age ratings can result in app removal
- The rating questionnaire is in App Store Connect and must be completed for each version

### Google

- Use the IARC (International Age Rating Coalition) questionnaire in Play Console
- Answer honestly — incorrect ratings can lead to app removal
- The rating is recalculated with each content change
- Apps in the **Designed for Families** program have additional requirements:
  - Content must be appropriate for children
  - Ads must use Google Play certified ad networks
  - No social features without parental controls
  - Must comply with the Families Policy

### React Native Considerations

- Third-party SDKs can affect your age rating (e.g., including Facebook SDK may trigger
  social/sharing questions)
- WebView content is subject to age rating — if your app can display arbitrary web content,
  the rating will be higher
- UGC moderation quality affects rating — better moderation → potentially lower rating
- Gambling/loot box mechanics require specific disclosures in both questionnaires
