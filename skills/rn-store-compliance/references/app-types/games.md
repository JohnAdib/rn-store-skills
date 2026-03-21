# Games / Gambling Compliance

## Apple

- [ ] All in-game currency, items, and content purchased via IAP — no external payment links (Guideline 3.1.1)
- [ ] Loot boxes and gacha mechanics must disclose odds before purchase (Guideline 3.1.1)
- [ ] IAP currencies must not expire (Guideline 3.1.1)
- [ ] Restore Purchases mechanism required for non-consumable IAP and subscriptions (Guideline 3.1.1)
- [ ] Game enemies must not target a specific race, culture, government, or real entity (Guideline 5.3)
- [ ] Gambling and betting apps must hold valid licenses in every jurisdiction served (Guideline 5.3.3)
- [ ] Lottery apps permitted only from the lottery organization itself (Guideline 5.3.3)
- [ ] Age rating must honestly reflect violence, language, and mature content (Guideline 5.3)

## Google Play

- [ ] Real-money gambling requires valid gambling license per jurisdiction (Real-Money Gambling Policy)
- [ ] Geo-restrictions enforced — block users in unlicensed jurisdictions (Real-Money Gambling Policy)
- [ ] Loot box odds must be disclosed before purchase (Monetization Policy)
- [ ] Contests and sweepstakes require published official rules (Contests Policy)
- [ ] No content encouraging dangerous bets or challenges (Gambling Policy)
- [ ] Game ads must be appropriate for the declared content rating (Ad Policy)

## React Native Notes

- `react-native-iap` (v12+) for cross-platform IAP — handles consumables, non-consumables, and subscriptions
- `expo-in-app-purchases` deprecated — use `react-native-iap` or `react-native-purchases` (RevenueCat) instead
- Loot box odds UI: render odds table in a modal before the purchase button becomes active — Apple reviewers verify this flow
- Restore Purchases: must be a visible button (not buried in settings) — common rejection reason
- For gacha/loot mechanics: log all odds server-side for audit compliance
- `react-native-purchases` (RevenueCat) simplifies receipt validation, entitlement management, and cross-platform subscription state
- Gambling apps: cannot use Expo Go or development builds in production — Apple requires native binary review
- Age gating: implement at app launch for gambling apps — cannot rely on store age restrictions alone

## Related Rules

- [rules/in-app-purchases.md](../rules/in-app-purchases.md)
- [rules/subscriptions.md](../rules/subscriptions.md)
- [rules/age-rating.md](../rules/age-rating.md)
