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

---

## Account Deletion Not Available
**Apple**: 5.1.1(v) — Account Deletion | **Google**: Account deletion policy | **Severity**: REJECTION

If your app supports account creation, you MUST provide account deletion within the app. This rule has been strictly enforced since 2022. Telling users to "email support to delete your account" is explicitly rejected.

### Detect
```bash
# Check for account creation
grep -rnE "(createAccount|signUp|register|createUser|RegisterScreen)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for account deletion
grep -rnE "(deleteAccount|delete.?account|remove.?account|AccountDeletion|DeactivateAccount)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check Settings/Profile for deletion option
grep -rnE "(Settings|Profile|Account).*Screen" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ 2>/dev/null
```

### Fix
1. Add a "Delete Account" button in Settings or Profile — reachable within 2-3 taps from the home screen.
2. Show a confirmation dialog explaining what will be deleted.
3. If user has an active subscription, inform them to cancel it separately.
4. Process deletion within 14 days.
5. Delete data from ALL backend systems including third-party services.
6. Do NOT gate deletion behind: emailing support, calling a phone number, visiting a website, completing a survey, or waiting on hold.
7. See `rules/legal.md` for full account deletion requirements including GDPR data deletion.

### Example Rejection
> Guideline 5.1.1(v) — Legal — Privacy: Your app supports account creation but does not provide a mechanism for users to initiate account deletion within the app.

---

## Mandatory Login Gate for Non-Essential Features
**Apple**: 4.0 — Design | **Google**: Functionality policy | **Severity**: REJECTION

Requiring login before users can browse or access basic content leads to rejection. Users should be able to explore the app's value before being asked to create an account.

### Detect
```bash
# Check if login screen is the first screen
grep -rnE "(initialRouteName|InitialRoute|firstScreen|RootNavigator)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for authentication guards on all routes
grep -rnE "(isAuthenticated|isLoggedIn|requireAuth|authGuard|ProtectedRoute)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for guest/anonymous access
grep -rnE "(guest|anonymous|skip|browse.?without|continue.?without)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. Allow users to browse content, view the main screens, and understand the app's value without requiring login.
2. Gate login only for personalized features (saving items, posting content, purchasing).
3. Add a "Skip" or "Browse as Guest" option on the login screen.
4. If your app truly requires authentication for all features (e.g., messaging app, banking app), explain this clearly and provide a demo or preview mode.
5. Exception: apps where login IS the core feature (banking, personal health records, enterprise tools) can require immediate login — but provide the demo account in review notes.

### Example Rejection
> Guideline 4.0 — Design: Your app requires users to create an account before they can access any content. Please allow users to browse the app's content without requiring registration.
