# App Completeness Rules

## Missing Demo Account for Review
**Apple**: 2.1 — App Completeness | **Google**: Store listing requirements | **Severity**: REJECTION

If your app requires login, you MUST provide a demo account in the App Review notes. The account must be pre-populated with realistic data, have all premium features unlocked (if behind paywall), and not require 2FA or external verification.

### Detect
```bash
# Check if app has login/authentication
grep -rnE "(login|signIn|sign.?in|auth|authenticate|LogIn|SignIn)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ 2>/dev/null

# Check for 2FA / MFA that might block reviewers
grep -rnE "(two.?factor|2fa|mfa|otp|verification.?code|sms.?code|authenticator)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for social-only login (no email/password option)
grep -rnE "(GoogleSignin|FacebookLogin|AppleAuth)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for paywall / premium features
grep -rnE "(premium|pro|subscribe|paywall|upgrade|locked|gated)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. Create a dedicated demo account before submission:
   - Username: `demo@yourapp.com` (or similar)
   - Password: a simple, non-expiring password
   - Pre-populate with realistic content (not empty states)
   - Unlock all premium/subscription features on this account
2. Add credentials in App Store Connect → App Review Information → Notes for Reviewer:
   ```
   Demo Account:
   Email: demo@yourapp.com
   Password: DemoPass123!

   This account has Premium features unlocked for testing.
   To test the subscription flow, navigate to Settings > Subscription.
   ```
3. If 2FA is required: either disable it for the demo account, or provide the 2FA seed/backup codes in the review notes.
4. If login is social-only (Google/Apple/Facebook), also implement email/password login for the demo account, OR provide detailed instructions for how to create an account.
5. Test the demo account before every submission — credentials expire, sessions get invalidated, passwords get rotated.
6. If using Firebase Auth: create the demo user in Firebase Console, not through the app registration flow (to avoid triggering verification emails).

### Example Rejection
> Guideline 2.1 — Performance — App Completeness: We were unable to review your app as it requires login credentials. Please provide a demo account in the App Review notes.

---

## Features Hidden Behind Paywall During Review
**Apple**: 2.1 — App Completeness | **Google**: App review policy | **Severity**: REJECTION

Apple reviewers must be able to access ALL app features. If features are behind a subscription or IAP, the demo account must have them unlocked, or you must provide sandbox IAP testing instructions.

### Detect
```bash
# Check for subscription gates
grep -rnE "(isSubscribed|isPremium|isPro|hasPurchased|entitlement|subscription.?status)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for feature gates
grep -rnE "(feature.?locked|premium.?only|upgrade.?required|purchase.?required)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for IAP / subscription products
grep -rnE "(productId|purchaseProduct|requestSubscription|getSubscriptions)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. **Option A (recommended)**: Grant the demo account full premium access server-side. Add a flag on your backend that bypasses the subscription check for the demo account.
2. **Option B**: Provide sandbox IAP testing instructions in review notes:
   ```
   To test premium features:
   1. Sign out of your personal Apple ID in Settings > Media & Purchases
   2. Use Sandbox account: sandbox@test.com / TestPass123!
   3. Navigate to Settings > Subscription > Subscribe
   4. Complete the sandbox purchase (no real charge)
   ```
3. **Option C**: Temporarily unlock all features for the review build (using a build flag), then remove the flag for the production release. ⚠️ Risky — if Apple notices different behavior between builds, it can trigger a deeper review.
4. Document ALL premium features and how to access them in the review notes.
5. If your app has multiple subscription tiers, unlock the highest tier on the demo account.

### Example Rejection
> Guideline 2.1 — Performance: We were unable to access premium features in your app. Please provide a demo account with premium features unlocked or provide instructions for testing in-app purchases.

---

## Placeholder and Incomplete Content
**Apple**: 2.1 — App Completeness | **Google**: Minimum functionality policy | **Severity**: REJECTION

Any visible placeholder content — Lorem ipsum text, stock photo placeholders, empty states that should have data, "coming soon" labels, or debug information — triggers rejection. The app must feel complete and production-ready.

### Detect
```bash
# Check for Lorem ipsum and placeholder text
grep -rniE "(lorem ipsum|dolor sit amet|placeholder|dummy|sample|test data|coming soon|under construction|TODO|FIXME|HACK)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" --include="*.json" \
  src/ app/ 2>/dev/null

# Check for debug/test labels
grep -rniE "(debug|test|staging|dev|development|beta|alpha|prototype)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null | grep -viE "(import|require|package|node_modules|\.test\.|\.spec\.|__test__|__mock__)"

# Check for placeholder images
find assets/ src/ -iname "*placeholder*" -o -iname "*dummy*" -o -iname "*sample*" 2>/dev/null

# Check for incomplete navigation (screens that go nowhere)
grep -rnE "(navigation\.navigate.*TODO|console\.log.*not.?implemented|alert.*coming)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for hardcoded test URLs
grep -rnE "(localhost|127\.0\.0\.1|10\.0\.2\.2|staging\.|dev\.|test\.)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null | grep -v "node_modules" | grep -v "__tests__"
```

### Fix
1. Replace all Lorem ipsum with real content — even if it's simple, it must be real.
2. Remove all "Coming Soon", "Under Construction", and "TODO" labels from the UI.
3. Remove debug/test/staging labels and environment indicators from the production build.
4. Ensure all navigation destinations exist and are functional — no buttons that lead nowhere.
5. Populate empty states with realistic data or show proper empty state UI ("No items yet. Tap + to add one.").
6. Remove all `console.log`, `console.warn` statements from production (use a Babel plugin):
   ```json
   // babel.config.js
   plugins: [
     ["transform-remove-console", { exclude: ["error"] }]
   ]
   ```
7. Replace hardcoded localhost/staging URLs with production endpoints.
8. Test on a fresh install — cached data may hide empty states during your testing.

### Example Rejection
> Guideline 2.1 — Performance — App Completeness: Your app includes placeholder content ("Lorem ipsum") on the About screen and a "Coming Soon" label on the Reports tab. Please ensure all content is final.

---

## Backend Services Unavailable During Review
**Apple**: 2.1 — App Completeness | **Google**: App functionality policy | **Severity**: REJECTION

Apple reviews apps 24/7, including weekends and holidays. If your backend is down during review, the app appears broken and gets rejected. Staging servers with limited uptime, expired API keys, and rate-limited free tiers are common causes.

### Detect
```bash
# Check API base URL configuration
grep -rnE "(baseURL|BASE_URL|API_URL|apiUrl|endpoint)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" --include="*.env*" \
  src/ app/ 2>/dev/null

# Check for environment-specific configs
grep -rnE "(staging|development|production).*url" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" --include="*.env*" \
  src/ app/ 2>/dev/null

# Check for free-tier services that might hit limits
grep -E "(firebase|supabase|heroku|render|railway|planetscale|neon|vercel)" \
  package.json 2>/dev/null
```

### Fix
1. Point the submission build to production servers (not staging/dev).
2. Ensure backend services have 99.9%+ uptime during the review period (typically 1-7 days after submission).
3. If using free-tier hosting (Heroku, Render, Railway): free tiers often sleep after inactivity — upgrade to a paid tier or implement keep-alive pings during the review period.
4. Check that API keys, tokens, and certificates used in the release build are not expired.
5. Implement graceful error handling — if the backend is temporarily down, show a retry option, not a crash or blank screen.
6. If your backend requires VPN or IP whitelisting, add Apple's review team IP ranges or disable IP restrictions during review.
7. Test the exact build you're submitting against production APIs before uploading.
8. Include backend status information in review notes if applicable:
   ```
   Note: This app requires an internet connection. Our backend services are available 24/7
   at api.yourapp.com. If you experience connectivity issues, please try again or contact
   us at dev@yourapp.com.
   ```

### Example Rejection
> Guideline 2.1 — Performance: Your app was unable to load content during our review. The app displayed an error "Unable to connect to server" on the home screen. Please ensure your backend services are operational and resubmit.

---

## Inadequate App Review Notes
**Apple**: 2.1 | **Google**: N/A (less structured) | **Severity**: REJECTION (indirect)

Poor or missing review notes lead to reviewers being unable to test your app, which results in rejection. Good review notes prevent misunderstandings and speed up the review process.

### Fix
1. Always include in App Review notes:
   - Demo account credentials (if login required)
   - How to access non-obvious features
   - How to test IAP/subscription flows (sandbox accounts)
   - Any required hardware (Bluetooth device, specific location, etc.)
   - If features require specific conditions (e.g., "To test the alarm feature, set an alarm 2 minutes in the future")
2. If your app uses location: specify a location the reviewer should use, or note that the app works with any location.
3. If your app requires external hardware (BLE device, smart home device): provide a video demo in the review notes or App Store Connect attachments.
4. Keep notes concise but complete — reviewers process hundreds of apps. Make it easy.
5. Example good review notes:
   ```
   Demo Account: demo@app.com / Pass123!
   (Premium features are unlocked on this account)

   Key flows to test:
   1. Home > Search > tap any result > "Add to Cart" > Checkout
   2. Profile > Settings > Notifications (toggle on/off)
   3. Camera tab > Scan any barcode (or use camera to photograph any text)

   The app requires internet connection. Backend is live 24/7.
   Location features work with any location.
   ```

### Example Rejection
> Guideline 2.1 — Performance: We were unable to complete the review of your app because the demo account credentials provided in the review notes did not work. Please provide valid credentials and resubmit.
