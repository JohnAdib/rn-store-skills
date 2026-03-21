# Privacy Rules

## Requiring Unnecessary Personal Data
**Apple**: 5.1.1 — Data Collection and Storage | **Google**: Data minimization policy | **Severity**: REJECTION

Only require data directly relevant to your app's core functionality. Making non-essential fields required in registration or onboarding triggers rejection. Context matters: a fitness app can require gender and DOB; a notes app cannot require phone number.

**Commonly flagged required fields**: phone number, gender, marital status, date of birth, home address, employer, income, social security number, government ID.

### Detect
```bash
# Find registration/onboarding/profile forms
grep -rnE "(register|signup|sign.?up|onboard|profile|create.?account)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ 2>/dev/null

# Check for form validation that makes fields required
grep -rnE "(required|isRequired|validate|yup\.string\(\)\.required|z\.string\(\))" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Look for specific sensitive field names
grep -rnE "(phone.?number|gender|date.?of.?birth|dob|birth.?date|marital|address|zip.?code|postal)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ 2>/dev/null

# Check for form schemas (Yup, Zod) with required sensitive fields
grep -rnE "(phone|gender|dob|birthDate|address).*required" \
  --include="*.tsx" --include="*.ts" \
  src/ app/ 2>/dev/null
```

### Fix
1. Make every non-essential field optional. Add "Optional" label or "(optional)" text next to the field.
2. Add a "Skip" button on onboarding screens that collect personal data.
3. If collecting data for personalization, explain why inline:
   - "We use your birthday to recommend age-appropriate content" (next to the field)
4. Move non-essential data collection to a later profile-editing step, not initial registration.
5. Only block form submission on fields truly required for core functionality (email for account creation, for example).
6. Document your data justification — Apple may ask during review why you collect each field.

### Example Rejection
> Guideline 5.1.1 — Legal — Privacy: Your app requires users to provide personal information (phone number, date of birth) that is not necessary for the app's core functionality. Please make these fields optional.

---

## Missing Privacy Manifest (PrivacyInfo.xcprivacy)
**Apple**: 5.1.1 — Data Collection and Storage (Spring 2024+) | **Google**: Data Safety section (equivalent) | **Severity**: REJECTION

Starting Spring 2024, Apple requires a `PrivacyInfo.xcprivacy` file in your app bundle if you use any "Required Reason APIs." Third-party SDKs must also include their own privacy manifests. Google's equivalent is the Data Safety section in Google Play Console — it must accurately reflect your actual data collection.

### Required Reason API Categories

| Category | API Examples | Example Reason Code |
|----------|-------------|-------------------|
| File timestamp APIs | `NSFileCreationDate`, `NSFileModificationDate`, `NSURLContentModificationDateKey` | `DDA9.1` — display to user |
| System boot time APIs | `systemUptime`, `mach_absolute_time`, `ProcessInfo.systemUptime` | `35F9.1` — measure elapsed time |
| Disk space APIs | `volumeAvailableCapacityKey`, `volumeAvailableCapacityForImportantUsageKey` | `E174.1` — check before writing |
| User defaults APIs | `UserDefaults` (NSUserDefaults) | `CA92.1` — access within app |

### Detect
```bash
# Check if PrivacyInfo.xcprivacy exists
find ios/ -name "PrivacyInfo.xcprivacy" 2>/dev/null

# Check if it's included in the Xcode project's Copy Bundle Resources
grep -r "PrivacyInfo" ios/*.xcodeproj/project.pbxproj 2>/dev/null

# Scan for Required Reason APIs in your code
grep -rnE "(UserDefaults|NSUserDefaults|NSFileCreationDate|NSFileModificationDate|systemUptime|mach_absolute_time|volumeAvailableCapacity)" \
  --include="*.swift" --include="*.m" --include="*.mm" --include="*.h" \
  ios/ 2>/dev/null

# Check React Native code — UserDefaults is used by AsyncStorage, MMKV, etc.
grep -E "(async-storage|mmkv|react-native-default-preference)" package.json 2>/dev/null

# Check third-party SDK privacy manifests
find ios/Pods -name "PrivacyInfo.xcprivacy" 2>/dev/null | head -20
```

### Fix
1. Create `ios/[YourApp]/PrivacyInfo.xcprivacy` with the following minimal structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>NSPrivacyTracking</key>
  <false/>
  <key>NSPrivacyTrackingDomains</key>
  <array/>
  <key>NSPrivacyCollectedDataTypes</key>
  <array/>
  <key>NSPrivacyAccessedAPITypes</key>
  <array>
    <dict>
      <key>NSPrivacyAccessedAPIType</key>
      <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
      <key>NSPrivacyAccessedAPITypeReasons</key>
      <array>
        <string>CA92.1</string>
      </array>
    </dict>
  </array>
</dict>
</plist>
```

2. Add the file to Xcode → your app target → Build Phases → Copy Bundle Resources.
3. Add entries for each Required Reason API category your app (or its dependencies) uses.
4. If using `@react-native-async-storage/async-storage` or `react-native-mmkv`, you need the UserDefaults category (`CA92.1`).
5. Update `NSPrivacyCollectedDataTypes` to match what you declare in App Store Connect's privacy nutrition labels.
6. If `NSPrivacyTracking` is `true`, you must also use App Tracking Transparency (ATT) framework.
7. Run `pod update` to pull latest SDK versions that include their own privacy manifests.
8. For Google Play: complete the Data Safety section in Google Play Console. It must match your actual data collection — inconsistencies trigger review flags.

### Example Rejection
> ITMS-91053: Missing API declaration — Your app's code references Required Reason API categories that require a privacy manifest: NSPrivacyAccessedAPICategoryUserDefaults. Add the required reasons to your app's PrivacyInfo.xcprivacy file.
