# Design Rules

## Sign in with Apple UX Violations
**Apple**: 4.8 — Sign in with Apple | **Google**: Google One Tap best practices (equivalent) | **Severity**: REJECTION

If your app offers any third-party social login (Google, Facebook, Twitter/X, etc.), you must also offer Sign in with Apple (SIWA). SIWA must be equally prominent — same size, same screen position priority. Do not re-ask for name or email after SIWA provides them. You must handle "Hide My Email" relay addresses.

### Detect
```bash
# Check if Sign in with Apple is implemented
grep -rnE "(ASAuthorizationAppleIDProvider|ASAuthorizationAppleIDButton|SignInWithApple|apple.?auth|appleAuthentication)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" --include="*.swift" --include="*.m" \
  src/ app/ ios/ 2>/dev/null

# Check for other social login providers (if these exist, SIWA is required)
grep -rnE "(GoogleSignin|LoginManager|facebook.*login|google.*sign.?in|twitter.*auth|LoginButton)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for post-SIWA data requests (violation: asking for name/email after SIWA)
grep -rnE "(apple.*login|appleAuth)[\s\S]{0,500}(ask.?name|enter.?email|email.?input|name.?input)" \
  --include="*.tsx" --include="*.ts" \
  src/ app/ 2>/dev/null

# Check for relay email handling
grep -rnE "privaterelay\.appleid\.com" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check if expo-apple-authentication is installed (Expo projects)
grep -E "(expo-apple-authentication|@invertase/react-native-apple-authentication)" package.json 2>/dev/null

# Check entitlements for SIWA capability
grep -r "com.apple.developer.applesignin" ios/ 2>/dev/null
```

### Fix
1. If you offer Google, Facebook, or any third-party login, add SIWA on the same screen at equal or greater prominence.
2. Use the standard `ASAuthorizationAppleIDButton` (or `expo-apple-authentication`'s `AppleAuthenticationButton`) — do not create a custom-styled button.
3. SIWA should be the first or top button in the login stack. At minimum, same size and visual weight.
4. After SIWA returns credentials, use the `fullName` and `email` from the credential object. Do NOT show a "complete your profile" screen asking for name/email.
5. Handle `privaterelay.appleid.com` email addresses — these are valid. Do not reject them in email validation. Forward emails via Apple's relay service.
6. Add the "Sign in with Apple" capability in Xcode → Signing & Capabilities.
7. For Google: implement Google One Tap / Google Sign-In. It's not required like SIWA, but expected if you offer social login on Android.

### Example Rejection
> Guideline 4.8 — Design: Your app uses a third-party login service but does not offer Sign in with Apple. Apps that use a third-party login service must also offer Sign in with Apple as an equivalent option.

---

## Minimum Functionality / WebView Apps
**Apple**: 4.2 — Minimum Functionality | **Google**: Deceptive behavior — Webview apps | **Severity**: REJECTION

Your app must provide meaningful functionality beyond what a mobile website offers. Apps that are thin wrappers around a WebView, contain fewer than 3 functional screens, or lack a native model layer get rejected. Template-generated apps with no unique content are also rejected.

**Red flags**: single `WKWebView` / `WebView` loading a URL, no offline capability, no local data storage, no push notifications, no native navigation, fewer than 3 meaningful screens, identical to another app in the store (template clone).

### Detect
```bash
# Check for WebView-heavy architecture
grep -rnE "(WKWebView|WebView|react-native-webview|expo-web-browser)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ 2>/dev/null

# Count screens/components — fewer than 3 is a red flag
find src/ app/ screens/ -name "*.tsx" -o -name "*.jsx" 2>/dev/null | wc -l

# Check if app has native features
grep -rnE "(AsyncStorage|MMKV|SQLite|Realm|push.?notification|geolocation|camera|biometric)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for offline support
grep -rnE "(NetInfo|offline|connectivity|cache|@tanstack.*query|persist)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check package.json for native-feature dependencies
grep -E "(react-native-camera|react-native-maps|react-native-push|react-native-biometrics|@react-native-firebase)" \
  package.json 2>/dev/null
```

### Fix
1. If your app is primarily a WebView, add native features that justify a native app:
   - Offline mode with cached content
   - Push notifications
   - Device integration (camera, contacts, biometrics)
   - Native navigation (React Navigation, Expo Router)
   - Local data storage (AsyncStorage, MMKV, SQLite)
2. Ensure your app has a minimum of 3–5 meaningful, distinct screens with real functionality.
3. If you must use WebView for parts of the app, mix it with native screens — a full-native login, settings page, and at least one core feature screen.
4. Add a native splash/onboarding experience.
5. Do not submit apps that are functionally identical to your website with no additional native value.
6. Related rejections: 4.2.1 (ARKit must have compelling AR), 4.2.2 (app is not a marketing vehicle), 4.2.6 (template/clone apps rejected).

### Example Rejection
> Guideline 4.2 — Design — Minimum Functionality: We found that the experience your app provides is not sufficiently different from a mobile browsing experience. Your app is essentially a repackaged website with no native iOS functionality.
