# Google Play Store Guidelines

Complete reference for Google Play Store policies relevant to React Native apps.
Policy references match Google's official documentation at https://play.google.com/about/developer-content-policy/

---

## Content Policies

### Restricted Content

Google Play prohibits apps containing:
- Hate speech or content promoting discrimination based on race, ethnicity, religion,
  disability, age, nationality, veteran status, sexual orientation, or gender
- Graphic violence or content that glorifies violence
- Bullying or harassment — apps must not facilitate targeting individuals
- Sexual content — no pornography; dating apps must have appropriate content ratings
- Dangerous activities — apps must not encourage self-harm, substance abuse, or dangerous stunts
- Tobacco and alcohol — apps facilitating sale must implement age verification
- Cannabis — apps must comply with local laws and restrict to legal jurisdictions

### User-Generated Content (UGC)

Apps with UGC must implement:
- Content moderation system (automated filtering + human review for flagged content)
- User reporting mechanism accessible from within the content
- Terms of service that prohibit objectionable content
- Ability to block or mute users
- A process for handling DMCA/takedown requests

Google enforces stricter timelines for content removal than Apple — illegal content must be
removed within 24 hours of report.

### Intellectual Property

- Don't impersonate other apps, brands, or entities
- Don't use another app's icon, name, or branding to confuse users
- Respect trademark and copyright — Google acts on DMCA notices quickly
- Fan apps must clearly indicate they are unofficial

### Privacy and Security

- Must have a valid, accessible privacy policy linked in the Play Store listing AND within the app
- Must declare all data collection in the Data Safety section of the Play Console
- Must handle personal data securely (HTTPS for transit, encryption at rest for sensitive data)
- Must comply with applicable privacy laws (GDPR, CCPA, etc.)
- Apps targeting children must comply with the Families Policy (see below)
- Must not collect data beyond what is necessary for the app's stated functionality
- Must delete user data upon request (account deletion requirement)

### Account Deletion Requirement

Apps that allow account creation MUST:
- Offer in-app account deletion (not just "email us to delete")
- Delete associated data or clearly explain data retention policies
- Complete deletion within a reasonable timeframe
- Provide the account deletion option without requiring login (for users who forgot credentials,
  offer a web-based option)

### Deceptive Behavior

- Don't misrepresent app functionality in the listing or through notifications
- No hidden features that aren't described in the store listing
- No misleading install prompts ("Your phone is infected! Install now!")
- No fake system notifications or warnings
- Don't impersonate system UI elements
- No clickjacking or UI manipulation to trick users into unintended actions

### Ads Policy

If the app shows ads:
- Ads can't be deceptive, misleading, or disruptive
- Can't cover content without a clear, visible close button
- Full-screen interstitial ads must have a close button visible within 1 second (games) or immediately (non-games)
- Ads must not interfere with navigation or app functionality
- No ads in lock screen, system notifications, or outside the app context
- Must comply with Google's Families Ads Program if targeting children
- Ad content must be appropriate for the app's content rating

---

## Technical Requirements

### Target SDK Version

- **As of August 2025**: Must target Android 15 (API level 35)
- New apps and updates that don't meet this will be rejected
- React Native: update `targetSdkVersion` in `android/app/build.gradle`:

```groovy
android {
    defaultConfig {
        targetSdkVersion 35
    }
}
```

- Expo: update `expo.android.targetSdkVersion` in `app.json`:

```json
{
  "expo": {
    "android": {
      "targetSdkVersion": 35
    }
  }
}
```

### Android App Bundle (AAB)

- New apps MUST be published as AAB, not APK
- AAB enables Google to optimize delivery per device (smaller downloads)
- React Native: `cd android && ./gradlew bundleRelease`
- Expo: `eas build --platform android` (produces AAB by default)
- Existing apps can still submit APK updates, but AAB is strongly recommended

### 64-bit Support

- All native code must include 64-bit libraries (`arm64-v8a`, `x86_64`)
- React Native handles this by default for JS/Hermes code
- Custom native modules with C/C++ code must be built for both 32-bit and 64-bit
- Check `android/app/build.gradle` for ABI filters — don't exclude 64-bit architectures

### 16 KB Memory Page Size

- Apps targeting Android 15+ using native libraries (NDK / `.so` files) should ensure
  compatibility with 16 KB memory page size (up from 4 KB)
- React Native's built-in native code is already compatible
- Custom native modules or prebuilt `.so` files may need to be recompiled with updated
  alignment settings
- Test on Android 15 emulator or device to verify

### Google Play Billing Library

- Apps with in-app purchases must use Google Play Billing Library v7+
- React Native: `react-native-iap` wraps the billing library — keep it updated
- RevenueCat handles this automatically
- Alternative payment systems are allowed in the EU (DMA compliance) and specific countries,
  but Google Play Billing must still be offered as an option in most cases
- Subscription offers, introductory prices, and grace periods must follow billing library APIs

### Foreground Service Types

Starting Android 14+ (API 34):
- Must declare a valid `foregroundServiceType` for every foreground service
- Undeclared foreground services will crash at runtime
- Valid types: `camera`, `connectedDevice`, `dataSync`, `health`, `location`, `mediaPlayback`,
  `mediaProjection`, `microphone`, `phoneCall`, `remoteMessaging`, `shortService`,
  `specialUse`, `systemExempted`
- Each type requires corresponding permissions
- Don't declare types you don't use — Google reviews these

### Photo and Video Permissions

Starting Android 14+ (API 34):
- `READ_MEDIA_VISUAL_USER_SELECTED` permission for partial photo access
- Apps should support partial media access (user selects specific photos)
- Don't just request `READ_EXTERNAL_STORAGE` — it's deprecated for media access

### Notification Permissions

Starting Android 13+ (API 33):
- `POST_NOTIFICATIONS` is a runtime permission — must request it explicitly
- Can't show notifications without user granting this permission
- Request at an appropriate time, not immediately on first launch
- Explain why notifications are valuable before requesting

---

## Store Listing & Metadata

### App Title and Description

- Title: max 30 characters. Must accurately represent the app
- Short description: max 80 characters
- Full description: max 4,000 characters
- No keyword stuffing or irrelevant terms
- No unverifiable superlative claims ("best", "#1", "fastest") unless backed by independent verification
- No misleading claims about functionality
- Must be available in at least one language

### Screenshots and Graphics

- Must accurately represent the app's current version
- No misleading imagery or doctored screenshots
- Feature graphic (1024x500) is required
- Phone screenshots are required; tablet screenshots required if app supports tablets
- No excessive text overlays that obscure actual app UI
- Screenshots should show real app screens, not marketing mockups with minimal app visibility

### Content Rating

- Complete the IARC content rating questionnaire honestly
- Inaccurate ratings can lead to app removal or suspension
- Ratings are recalculated with each update — answer the questionnaire again if content changes
- Common mistake: not disclosing UGC capabilities, which affects the rating

### Data Safety Section

Declare all data types collected, organized by:
- **Data collected**: What types (name, email, location, device ID, etc.)
- **Purpose**: Why it's collected (app functionality, analytics, advertising, etc.)
- **Sharing**: Whether it's shared with third parties and who
- **Encryption**: Whether data is encrypted in transit
- **Deletion**: Whether users can request deletion

This must include data from ALL third-party SDKs:
- Firebase — device identifiers, crash logs, analytics events
- Sentry — crash data, device info, breadcrumbs
- Facebook SDK — device ID, usage data (potentially advertising ID)
- Google Analytics — usage data, device info
- Ad networks (AdMob, etc.) — advertising ID, device info, interaction data
- OneSignal / FCM — device tokens, notification interaction

The Data Safety section must match your privacy policy. Discrepancies will be flagged.

### Closed Testing Requirement

Before first production release:
- Must run a closed testing track (internal or closed)
- Must have at least **12 testers** who have opted in
- Testers must be active for at least **14 consecutive days**
- This requirement applies to new developer accounts since November 2023
- Existing apps updating don't need to redo this
- Use Google Play Console's internal testing track for fastest setup

---

## Families Policy

Apps targeting children (Designed for Families program):
- Must comply with all applicable children's privacy laws (COPPA, GDPR-K)
- Ads must use Google Play certified ad networks
- No personalized or interest-based advertising to children
- Must not include social features without parental controls
- No behavioral tracking of children
- Login must not be required unless it provides clear value
- App content must be appropriate for the declared age range
- Must declare the target age group accurately

---

## Enforcement and Suspension

Google's enforcement actions, in order of severity:
1. **Warning** — policy violation flagged, must fix within a deadline
2. **Rejection** — app update rejected, must fix and resubmit
3. **Removal** — app removed from Play Store, can be republished after fixing
4. **Suspension** — app and/or developer account suspended
5. **Termination** — developer account permanently terminated

Key differences from Apple:
- Google is faster to auto-detect and act on policy violations
- Google uses automated scanning more heavily
- Repeat violations escalate faster to suspension/termination
- Developer account suspension affects ALL apps under that account
- Google provides a policy appeal process but timelines are longer (7-14 business days)
