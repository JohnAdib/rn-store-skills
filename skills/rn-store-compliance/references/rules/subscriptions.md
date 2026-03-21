# Subscription & In-App Purchase Rules

## Missing Terms of Use and Privacy Policy Links in Paywall
**Apple**: 3.1.2 — Subscriptions | **Google**: Billing policy — Subscription transparency | **Severity**: REJECTION

Every in-app subscription screen must display: subscription title, duration, price, a tappable Privacy Policy link, and a tappable Terms of Use link. Both links must open and load. This is separate from the store listing requirement — the paywall UI itself must contain these links.

### Detect
```bash
# Find paywall/subscription UI components
grep -rnE "(paywall|subscribe|subscription|premium|upgrade|pro)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ components/ 2>/dev/null

# Check if those files contain terms/privacy links
grep -rnE "(terms|privacy|policy|tos|eula)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ components/ 2>/dev/null

# Check for hardcoded URLs to terms/privacy
grep -rnE "https?://.*/(terms|privacy|tos|eula)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. Add tappable links to the bottom of every paywall/subscription screen:
   ```tsx
   <Text onPress={() => Linking.openURL('https://yourapp.com/terms')}>
     Terms of Use
   </Text>
   <Text onPress={() => Linking.openURL('https://yourapp.com/privacy')}>
     Privacy Policy
   </Text>
   ```
2. Links must be visible without scrolling — place them near the subscribe button.
3. Both links must open in Safari/Chrome (or an in-app browser) and return a valid page.
4. If you support multiple locales, the links should resolve to localized pages or at minimum English.
5. Also add these links to the app description in App Store Connect and Google Play Console.

### Example Rejection
> Guideline 3.1.2 — Business: We noticed that your app's subscription purchase screen does not display links to the Terms of Use and Privacy Policy prior to purchase.

---

## Misleading Pricing Display
**Apple**: 3.1.2 — Subscriptions | **Google**: Deceptive behavior policy — Misleading claims | **Severity**: REJECTION

The actual billed amount must be the most visually prominent price on the subscription screen. Calculated per-day or per-month equivalents derived from an annual plan must be visually subordinate. Free trial callouts must not overshadow the post-trial charge.

### Detect
```bash
# Find pricing display components
grep -rnE "(price|cost|per.?month|per.?year|per.?week|per.?day|\/mo|\/yr|annual|monthly|trial|free)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ components/ 2>/dev/null

# Look for text styling that might indicate visual hierarchy issues
grep -rnE "(fontSize|fontWeight|opacity|color).*price" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for "free" prominently displayed near pricing
grep -rnE "free|no.?charge|\$0|trial" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ 2>/dev/null
```

### Fix
1. Make the total billed amount the **largest, boldest, highest-contrast** text:
   - GOOD: **$49.99/year** with smaller "(just $4.17/mo)" underneath
   - BAD: **$4.17/mo** with tiny "billed annually at $49.99"
2. If offering a free trial, the post-trial price must be clearly visible:
   - GOOD: "7-day free trial, then **$9.99/month**"
   - BAD: "**START FREE TRIAL**" with price hidden in fine print
3. Never use strikethrough pricing unless the original price was actually charged to real users at that rate.
4. Introductory pricing must clearly show what the renewal price will be.
5. Do not animate or auto-dismiss pricing information.

### Example Rejection
> Guideline 3.1.2 — Business: Your app's subscription screen presents pricing in a misleading manner. The prominently displayed price ($2.08/week) does not match the actual charge ($108.99/year). The billed price must be the most prominent.

---

## Digital Content Without Platform IAP
**Apple**: 3.1.1 — In-App Purchase | **Google**: Google Play Billing policy | **Severity**: REJECTION

All digital goods, content unlocks, subscriptions, and consumables must use Apple In-App Purchase (iOS) and Google Play Billing (Android). You cannot use Stripe, PayPal, Braintree, or any third-party payment processor for digital content. You cannot use license keys, promo codes entered manually, or QR codes to unlock digital features.

**Exemptions**: Physical goods, real-world services (ride-sharing, food delivery, event tickets), person-to-person services, and reader apps (with approved entitlement — Netflix, Spotify, etc.).

### Detect
```bash
# Check for third-party payment SDKs used for digital content
grep -rnE "(stripe|paypal|braintree|paddle|chargebee|recurly|square)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  --include="*.json" \
  src/ app/ package.json 2>/dev/null

# Check package.json for payment-related dependencies
grep -E "(stripe|paypal|braintree|paddle)" package.json 2>/dev/null

# Check for react-native-iap or RevenueCat (correct approach)
grep -E "(react-native-iap|react-native-purchases|@revenuecat)" package.json 2>/dev/null

# Check for license key / promo code unlock patterns
grep -rnE "(license.?key|promo.?code|redeem|activation.?code|unlock.?code)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for Restore Purchases — required by Apple
grep -rnE "(restore|restorePurchases|restore.?purchase)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. Implement `react-native-iap` or RevenueCat (`react-native-purchases`) for all digital purchases.
2. Remove any Stripe/PayPal integration that processes digital content payments (keep it for physical goods if applicable).
3. Add a "Restore Purchases" button — Apple requires this for all apps with non-consumable IAP or subscriptions.
4. If your app has loot boxes or randomized paid items, disclose the odds of each item type before purchase.
5. Do not link out to a website for purchasing digital content (no "buy on our website" links).
6. For consumables (coins, gems, credits), implement server-side receipt validation to prevent fraud.

### Example Rejection
> Guideline 3.1.1 — Business: We found that your app uses a mechanism other than the App Store's in-app purchase API to unlock features or content. Specifically, your app uses Stripe to process subscription payments for digital content.
