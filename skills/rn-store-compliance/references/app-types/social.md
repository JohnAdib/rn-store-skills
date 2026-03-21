# Social / Messaging / Community Compliance

## Apple

- [ ] Content moderation system to filter objectionable material (Guideline 1.2)
- [ ] Report mechanism accessible from within content with timely responses (Guideline 1.2)
- [ ] Block abusive users functionality (Guideline 1.2)
- [ ] Published support contact visible in-app (Guideline 1.2)
- [ ] Sign in with Apple required if any third-party login offered (Guideline 4.8)
- [ ] Do not re-ask name/email after SIWA — use provided identity token (Guideline 4.8)
- [ ] Account deletion offered if account creation exists (Guideline 5.1.1)
- [ ] Allow access without social login if social is not core feature (Guideline 5.1.1)
- [ ] Privacy policy accessible in-app and on App Store listing (Guideline 5.1.1)

## Google Play

- [ ] Content moderation system with both automated and human review (UGC Policy)
- [ ] User reporting accessible from within the content itself (UGC Policy)
- [ ] Terms of service explicitly prohibiting objectionable content (UGC Policy)
- [ ] Block and mute users functionality (UGC Policy)
- [ ] DMCA/takedown process documented and operational (UGC Policy)
- [ ] Remove illegal content within 24 hours of report (UGC Policy)
- [ ] Account deletion available in-app (Data Deletion Policy)
- [ ] Data Safety section accurate and complete (Data Safety Policy)

## React Native Notes

- `expo-apple-authentication` for SIWA — handles identity token, name, email scoping
- `react-native-apple-authentication` as alternative for bare workflow
- Content moderation: integrate server-side (Perspective API, OpenAI moderation, AWS Rekognition) — never do client-only filtering
- Report UI pattern: contextual menu on content items (long-press or three-dot menu) leading to report flow
- Block/mute: maintain server-side block list, filter in API responses — do not rely on client-side filtering alone
- Account deletion must actually delete data server-side, not just disable the account
- `@invertase/react-native-apple-authentication` supports credential revocation listening

## Related Rules

- [rules/sign-in-with-apple.md](../rules/sign-in-with-apple.md)
- [rules/account-deletion.md](../rules/account-deletion.md)
- [rules/privacy-policy.md](../rules/privacy-policy.md)
- [rules/user-generated-content.md](../rules/user-generated-content.md)
