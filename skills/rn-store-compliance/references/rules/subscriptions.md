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

---

## Dark-Pattern Cancellation UX
**Apple**: 3.1.2 — Subscriptions | **Google**: Subscriptions policy — Cancellation | **Severity**: REJECTION

Making it difficult for users to find cancellation instructions or understand how to cancel their subscription triggers rejection. Both stores increasingly enforce transparent cancellation UX.

### Detect
```bash
# Check for cancel/unsubscribe mentions in the app
grep -rnE "(cancel|unsubscribe|end.?subscription|stop.?subscription)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for subscription management screen
grep -rnE "(manage.?subscription|subscription.?settings|subscription.?status)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ 2>/dev/null

# Check for Apple/Google subscription management deep links
grep -rnE "(apps\.apple\.com/account/subscriptions|play\.google\.com/store/account/subscriptions)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. Include clear cancellation instructions in Settings or Account screen.
2. Add a direct link to Apple's subscription management page (`https://apps.apple.com/account/subscriptions`) and Google's (`https://play.google.com/store/account/subscriptions`).
3. Do NOT: require users to email support, call a number, or navigate through more than 2-3 taps to find cancellation info.
4. Do NOT: use confusing language ("pause" when you mean "cancel"), multi-step confirmation flows designed to frustrate, or countdown timers.
5. After cancellation, clearly show: "Your subscription is active until [date]. After that, you will lose access to premium features."
6. If you show a retention offer (discount to stay), it must have a clear "No thanks, cancel" option that actually cancels.

### Example Rejection
> Guideline 3.1.2 — Business: Your app does not provide users with a clear mechanism to manage or cancel their subscription. Please include subscription management instructions and a link to the platform's subscription settings.

---

## Missing Auto-Renewal Disclaimer
**Apple**: 3.1.2 — Subscriptions | **Google**: Subscriptions policy — Transparency | **Severity**: REJECTION

Failing to display the required auto-renewal disclaimer text near the subscribe button is one of the most common subscription-related rejections. This is separate from the Terms/Privacy links — both are required.

### Detect
```bash
# Check paywall screens for auto-renewal text
grep -rnE "(auto.?renew|automatically.?renew|renewal|billed.?at|charged.?at|cancel.?at.?least)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ components/ 2>/dev/null

# Check for required disclosure elements near subscribe buttons
grep -rnE "(subscribe|purchase|start.?trial|get.?premium|go.?pro)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ 2>/dev/null
```

### Fix
1. Add auto-renewal disclaimer text BELOW (or very near) the subscribe button. Must be visible without scrolling.
2. Required information in the disclaimer:
   - The subscription auto-renews
   - The renewal price and frequency
   - How to cancel (at least 24 hours before end of current period)
   - That cancellation takes effect at end of current period
3. Example text:
   ```
   $9.99/month. Auto-renews monthly. Cancel anytime in your device's
   subscription settings at least 24 hours before renewal. Your account
   will be charged within 24 hours before the end of the current period.
   ```
4. The text must be legible — minimum ~10pt font, sufficient contrast, not hidden in a scrollable area below the fold.
5. For free trials, add: "Free trial for 7 days, then $9.99/month."

### Example Rejection
> Guideline 3.1.2 — Business: Your app's subscription screen does not clearly disclose that the subscription auto-renews and the terms of renewal. Please add auto-renewal disclosure text near the subscribe button.

---

## Price Increase Without User Consent
**Apple**: 3.1.2 — Subscriptions | **Google**: Subscriptions policy — Price changes | **Severity**: REJECTION / SUBSCRIPTION CANCELLED

Raising subscription prices without proper user notification and consent flow violates store policies. Both Apple and Google have specific mechanisms for handling price increases.

### Detect
```bash
# Check for price change handling code
grep -rnE "(price.?change|price.?increase|price.?update|priceChange|PriceIncreaseConsent)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for StoreKit 2 Message handling (iOS price consent)
grep -rnE "(Message|messages|paymentQueueRestoreCompletedTransactionsFinished|SKPaymentTransactionObserver)" \
  --include="*.tsx" --include="*.ts" --include="*.swift" --include="*.m" \
  src/ app/ ios/ 2>/dev/null
```

### Fix
1. **Apple**: When you change a subscription price in App Store Connect:
   - Small increases (< 50% AND < $5): Apple auto-consents on behalf of users. Users are notified but don't need to take action.
   - Large increases: Apple shows consent dialog. Users have 60 days to accept. If they don't accept, their subscription is cancelled at the end of the current period.
   - Your app should listen for `Message.messages` in StoreKit 2 to display price consent sheets.
2. **Google Play**: Users are notified of price changes. They have 30 days to opt in. If they don't, the subscription cancels.
3. Implement price change handling:
   ```tsx
   // react-native-iap: listen for price consent events
   // Display Apple's price consent sheet when triggered
   ```
4. Notify users in-app before the price change takes effect — don't rely solely on the platform's notification.
5. Consider grandfathering existing subscribers at the old price to reduce churn.

### Example Rejection
> Your app increased subscription prices without implementing the required price consent mechanism. Existing subscribers must be notified and given the option to accept the new price or cancel.
