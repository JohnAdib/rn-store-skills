# Health / Fitness / Medical Compliance

## Apple

- [ ] Medical apps must disclose data sources and methodology for accuracy claims (Guideline 1.4.1)
- [ ] Cannot claim sensor-only diagnostics — no x-ray, blood pressure, glucose, or SpO2 from phone sensors alone (Guideline 1.4.1)
- [ ] Include reminders for users to consult a doctor — do not replace professional medical advice (Guideline 1.4.1)
- [ ] Drug dosage databases sourced only from approved entities (FDA, EMA, etc.) (Guideline 1.4.1)
- [ ] HealthKit data must not be used for advertising, marketing, or data mining (Guideline 5.1.3)
- [ ] Must not write false or fabricated data to HealthKit (Guideline 5.1.3)
- [ ] Must not store personal health data in iCloud — use on-device or encrypted server storage (Guideline 5.1.3)
- [ ] Health research apps require informed consent and ethics board (IRB) approval (Guideline 5.1.3)
- [ ] Must be a legal entity (not individual developer) for regulated medical fields (Guideline 1.4.1)

## Google Play

- [ ] Health claims must be evidence-based with citations (Health Policy)
- [ ] Medical apps require proper disclaimers visible before use (Health Policy)
- [ ] Health Connect integration follows data sharing rules — request only necessary data types (Health Connect Policy)
- [ ] No selling health data to third parties (Health Policy)
- [ ] Health data must be encrypted in transit and at rest (Health Policy)
- [ ] Content rating reflects health-related content accurately (Content Rating Policy)

## React Native Notes

- `react-native-health` for HealthKit (iOS) — request only the data types you actually need; over-requesting triggers review flags
- `react-native-health-connect` for Health Connect (Android) — requires declaring permissions in `AndroidManifest.xml`
- `expo-health` (Expo SDK 50+) for cross-platform HealthKit/Health Connect access
- HealthKit entitlement must be added in Xcode — cannot be configured purely through RN config
- Health data storage: never persist raw health data in AsyncStorage or MMKV — use encrypted storage (`react-native-encrypted-storage`)
- For research apps: implement consent flow with `react-native-informed-consent` pattern — capture signature, date, version
- Apple requires HealthKit usage description strings even if you only read (not write) data
- Organization account required for medical apps on both stores

## Related Rules

- [rules/healthkit.md](../rules/healthkit.md)
- [rules/privacy-policy.md](../rules/privacy-policy.md)
- [rules/data-encryption.md](../rules/data-encryption.md)
