# Kids Category Compliance

## Apple

- [ ] No external links without parental gate (Guideline 1.3)
- [ ] No purchasing opportunities without parental gate (Guideline 1.3)
- [ ] No third-party advertising of any kind (Guideline 1.3)
- [ ] No third-party analytics except those that do not collect IDFA, PII, or location (Guideline 1.3)
- [ ] COPPA and GDPR-K compliance verified (Guideline 5.1.4)
- [ ] No sending PII or device info to third parties (Guideline 5.1.4)
- [ ] Privacy policy (COPPA/GDPR compliant) accessible in-app and on App Store listing (Guideline 5.1.4)
- [ ] "For Kids" / "For Children" metadata reserved — only use if enrolled in Kids Category (Guideline 1.3)
- [ ] No ads in app extensions, widgets, iMessage apps, keyboards, or watchOS components (Guideline 1.3)

## Google Play

- [ ] Enrolled in Designed for Families program (Families Policy)
- [ ] Ads served only through Google Play certified ad networks (Families Policy)
- [ ] No personalized or interest-based advertising to children (Families Policy)
- [ ] No social features without parental controls (Families Policy)
- [ ] No behavioral tracking of children (Families Policy)
- [ ] Login not required unless it provides clear value to the child (Families Policy)
- [ ] All content appropriate for the declared age range (Families Policy)
- [ ] Target age group declared accurately in store listing (Families Policy)

## React Native Notes

- Parental gate implementation: use a math problem or multi-step gesture — Apple rejects simple "Are you over 13?" confirmations
- COPPA-compliant analytics alternatives: Firebase with analytics collection disabled for kids sessions, or self-hosted analytics with no PII
- Remove or gate all `Linking.openURL()` calls behind parental verification
- Strip all ad SDKs from kids builds — even dormant SDK code triggers rejection
- `react-native-age-gate` pattern: render different component trees based on verified age context
- Expo: disable `expo-tracking-transparency` entirely for kids apps — the prompt itself implies tracking
- Test with a clean device — reviewers check for any network calls to ad/analytics endpoints

## Related Rules

- [rules/kids-category.md](../rules/kids-category.md)
- [rules/privacy-policy.md](../rules/privacy-policy.md)
- [rules/coppa-gdpr.md](../rules/coppa-gdpr.md)
