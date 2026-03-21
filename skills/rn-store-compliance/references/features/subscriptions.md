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
