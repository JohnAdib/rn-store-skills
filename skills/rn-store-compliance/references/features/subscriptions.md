# Subscriptions / IAP / Loot Boxes

Feature checklist — any app type can have subscriptions or in-app purchases.

---

## Apple (Guidelines 3.1.1, 3.1.2)

- [ ] All digital content unlocks use Apple IAP (no Stripe for digital goods)
- [ ] Subscription provides ongoing value, 7-day minimum duration
- [ ] Purchase screen clearly describes what user gets
- [ ] Billed amount most prominent (not calculated monthly price)
- [ ] Free trial: clearly identifies duration and post-trial charges
- [ ] App description includes Terms of Use / EULA link
- [ ] App description includes Privacy Policy link
- [ ] Privacy Policy URL set in App Store Connect
- [ ] In-app subscription screen shows: title, length, price, Privacy Policy link, Terms of Use link
- [ ] Loot boxes/gacha disclose odds before purchase
- [ ] In-game currencies don't expire
- [ ] Restore Purchases mechanism exists
- [ ] All IAP items complete, visible, and functional
- [ ] Seamless upgrade/downgrade between tiers
- [ ] Not removing paid functionality when switching to subscription model
- [ ] Not charging for OS capabilities
- [ ] Not forcing ratings/reviews

## Google Play

- [ ] Uses Google Play Billing Library v7+
- [ ] Subscription info in Data Safety section
- [ ] Alternative billing available in EU (DMA) but Play Billing still primary
- [ ] Subscription terms clearly disclosed
- [ ] Free trial terms visible before signup
- [ ] Refund policy accessible
- [ ] No deceptive pricing

## React Native Notes

**Libraries:**
- `react-native-iap` — cross-platform IAP/subscription handling
- `expo-in-app-purchases` — Expo managed workflow option
- RevenueCat SDK — server-side receipt validation, cross-platform entitlements

**StoreKit 2 vs StoreKit 1:**
- StoreKit 2 is the modern API (async/await, JWS-signed transactions). Preferred for new apps.
- StoreKit 1 still works but Apple is steering toward SK2.
- `react-native-iap` v12+ supports StoreKit 2. Check your version.

**Common pitfalls:**
- Forgetting Restore Purchases button — instant rejection.
- Using Stripe/PayPal for digital content — instant rejection. Physical goods and services are fine.
- Not testing sandbox purchases on real devices before submission.
- Subscription screen missing required links (privacy policy, terms).
- Play Billing Library version too old — Google rejects outdated versions.

---

## Auto-Renewal Disclosure (Required Legal Text)

### Apple
Subscription screens must include this disclosure (or equivalent) near the subscribe button:
- "Payment will be charged to your Apple ID account at confirmation of purchase."
- "Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period."
- "Your account will be charged for renewal within 24 hours prior to the end of the current period."
- "You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase."

### Google Play
- "Your subscription will automatically renew and your payment method will be charged at the start of each billing period."
- "You can cancel anytime in Google Play Store > Subscriptions."

Both stores: the disclosure must be visible without scrolling — not buried in fine print.

---

## Subscription Management Link

### Apple
Include a tappable link to Apple's subscription management page:
```tsx
import { Linking, Platform } from 'react-native';

const openSubscriptionManagement = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('https://apps.apple.com/account/subscriptions');
    // Or deep link: itms-apps://apps.apple.com/account/subscriptions
  }
};
```
Place this in Settings screen and/or subscription management UI.

### Google Play
```tsx
const openPlaySubscriptions = () => {
  if (Platform.OS === 'android') {
    Linking.openURL('https://play.google.com/store/account/subscriptions');
  }
};
```

---

## Cancellation UX

- [ ] Cancellation instructions clearly visible in Settings / Account / Subscription screen
- [ ] No dark patterns — do not hide the cancel option, require multi-step confirmations, or use confusing language
- [ ] Do not show misleading "Are you sure?" flows that make it hard to cancel
- [ ] After cancellation, clearly show when access expires
- [ ] Apple: you cannot cancel subscriptions programmatically — you must link to Apple's subscription management
- [ ] Google: you can cancel via Play Billing API server-side, but the standard approach is linking to Play Store subscription settings

---

## Grace Period and Billing Retry

### Apple
- Apple has automatic billing retry for 60 days after a failed payment
- Grace period (optional, enable in App Store Connect): keeps subscription active for 6 or 16 days during billing retry
- Enable grace period in App Store Connect → Subscriptions → Billing Grace Period
- Your app should check `Transaction.expirationDate` and `Transaction.revocationDate` in StoreKit 2

### Google Play
- Grace period: configurable (3, 7, 14, or 30 days) in Play Console
- Account hold: after grace period expires, subscription enters hold for up to 30 days
- Your app should handle `SUBSCRIPTION_ON_HOLD` state — show "update payment method" message

### React Native Implementation
```tsx
// StoreKit 2 via react-native-iap v12+
import { getAvailablePurchases, purchaseUpdatedListener } from 'react-native-iap';

// Listen for transaction updates (renewals, expirations, revocations)
purchaseUpdatedListener(async (purchase) => {
  // Validate receipt server-side
  // Check subscription status including grace period
});
```

### RevenueCat
RevenueCat handles grace period and billing retry automatically:
- `CustomerInfo.entitlements` reflects active entitlement during grace period
- Webhooks: `BILLING_ISSUE_DETECTED`, `SUBSCRIPTION_PAUSED`, `EXPIRATION`
- Check `subscriberInfo.entitlements.active` — it accounts for grace period

---

## Family Sharing

### Apple
- [ ] Enable Family Sharing for subscriptions in App Store Connect (optional)
- [ ] If enabled, check entitlements for family members using StoreKit 2 `Transaction.ownershipType`
- [ ] `Transaction.ownershipType == .familyShared` indicates access via family sharing
- [ ] Family organizer manages the subscription — individual family members cannot cancel

### Google Play
- [ ] Family Library not available for subscriptions on Google Play
- [ ] Only one-time purchases can be shared via Family Library

---

## Offer Codes and Promo Codes

### Apple
- [ ] Offer codes: create in App Store Connect → Subscriptions → Offer Codes
- [ ] One-time use or multi-use codes
- [ ] Redeem via `presentCodeRedemptionSheet()` in StoreKit 2
- [ ] React Native: `react-native-iap` supports `presentCodeRedemptionSheetIOS()`

### Google Play
- [ ] Promo codes: create in Play Console → Monetize → Products → Promo codes
- [ ] Limited to 500 codes per quarter per app
- [ ] Redeem via Play Store or deep link

---

## Price Increase Consent

### Apple (StoreKit 2)
- If you raise the price of an existing subscription, Apple requires user consent
- Price increases < 50% AND < $5 (or equivalent): Apple auto-consents if user is on auto-renew
- Price increases above thresholds: Apple shows consent dialog, subscription cancelled if user doesn't accept within 60 days
- Listen for price consent messages:
```tsx
// StoreKit 2 Message listener
import { Message } from 'StoreKit';
// In react-native-iap, handle price consent via purchase update listener
```

### Google Play
- Google notifies users of price increases automatically
- Users have 30 days to accept; subscription cancelled if declined
- Implement `onPriceChangeConfirmationResult` callback

---

## Subscription Upgrade / Downgrade

### Apple
- [ ] Upgrade: immediate, prorated refund for remaining time on current plan
- [ ] Downgrade: takes effect at next renewal date
- [ ] Crossgrade (same tier, different duration): treated as upgrade or downgrade depending on value
- [ ] Implement `Product.SubscriptionInfo.UpgradePolicy` handling in StoreKit 2

### Google Play
- [ ] Proration modes: `IMMEDIATE_WITH_TIME_PRORATION`, `IMMEDIATE_AND_CHARGE_PRORATED_PRICE`, `DEFERRED`, etc.
- [ ] Set proration mode when calling `launchBillingFlow` for upgrade/downgrade
- [ ] `react-native-iap`: pass `prorationModeAndroid` parameter

---

## Introductory Offer Eligibility

- [ ] Check eligibility BEFORE displaying offer pricing — don't show introductory price to ineligible users
- [ ] Apple: `Product.subscription.isEligibleForIntroOffer` (StoreKit 2)
- [ ] Google: `SubscriptionOfferDetails.pricingPhases` — check if free trial phase exists for this user
- [ ] RevenueCat: `offerings.current.availablePackages[0].product.introPrice` — RevenueCat handles eligibility
- [ ] Displaying intro offer to ineligible users is misleading and can trigger rejection under 3.1.2
