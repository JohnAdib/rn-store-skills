# Crypto / Finance / Trading Compliance

## Apple

- [ ] Organization enrollment required — individual developer accounts will be rejected (Guideline 3.1.3)
- [ ] No on-device crypto mining — cloud mining display only is permitted (Guideline 3.1.5(b))
- [ ] Crypto exchanges must hold valid licenses in every jurisdiction served (Guideline 3.1.5(a))
- [ ] ICOs, futures, and securities trading: from established financial institutions only (Guideline 3.1.5(a))
- [ ] No offering cryptocurrency as reward for completing tasks (Guideline 3.1.5(b))
- [ ] No binary options trading apps (Guideline 3.2)
- [ ] CFD and FOREX apps must be properly licensed in served jurisdictions (Guideline 3.2)
- [ ] Loan apps: APR must not exceed 36%, repayment period > 60 days, terms clearly disclosed (Guideline 3.2)
- [ ] Banking and financial services: legal entity enrollment required (Guideline 3.2)
- [ ] NFTs purchased via IAP if they unlock content/features; external purchase links not permitted (except US) (Guideline 3.1.1)
- [ ] NFT browsing/viewing permitted without IAP, but no external purchase buttons (except US) (Guideline 3.1.1)

## Google Play

- [ ] Financial services apps must comply with local regulations in every jurisdiction served (Financial Services Policy)
- [ ] Crypto apps require proper licenses and registrations (Financial Services Policy)
- [ ] No deceptive financial claims — no guaranteed returns or misleading profit projections (Financial Services Policy)
- [ ] Loan apps: APR must be disclosed upfront, no predatory terms or hidden fees (Personal Loans Policy)
- [ ] Trading apps: risk disclaimers required and visible before first trade (Financial Services Policy)
- [ ] Content rating must reflect financial complexity and risk exposure (Content Rating Policy)

## React Native Notes

- Organization account ($99/yr Apple, $25 Google) required before development begins — cannot switch from individual to org mid-review
- Apple organization enrollment requires D-U-N-S number — apply early, takes 5-30 business days
- Financial data security: use `react-native-encrypted-storage` for sensitive data, never `AsyncStorage`
- SSL pinning: implement via `react-native-ssl-pinning` or `TrustKit` native module — financial apps are high-value targets for MITM
- Jailbreak/root detection: `react-native-jail-monkey` or `freeRASP` — financial apps should warn or restrict on compromised devices
- Biometric auth: `react-native-biometrics` or `expo-local-authentication` for transaction confirmation
- For NFT display: render metadata and images only — do not embed wallet connection or purchase flows in iOS builds (except US)
- WebView restrictions: Apple rejects financial apps that are just WebView wrappers around a web trading platform

## Related Rules

- [rules/organization-account.md](../rules/organization-account.md)
- [rules/in-app-purchases.md](../rules/in-app-purchases.md)
- [rules/data-encryption.md](../rules/data-encryption.md)
- [rules/financial-services.md](../rules/financial-services.md)
