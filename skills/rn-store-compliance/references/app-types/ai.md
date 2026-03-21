# AI / Generative AI Compliance

## Apple

- [ ] China distribution: remove all references to ChatGPT, OpenAI, GPT, Gemini, Claude, Anthropic, Midjourney, DALL-E (DST Guideline 5)
- [ ] China distribution: suppress AI functionality entirely or obtain MIIT generative AI license (DST Guideline 5)
- [ ] No false or misleading claims about AI capabilities (Guideline 1.4)
- [ ] Medical AI features must include disclaimers that AI is not a substitute for professional advice (Guideline 1.4.1)
- [ ] All AI features documented in App Review notes — explain what the AI does and how (Review Submission)
- [ ] Do not use AI brand names (GPT, ChatGPT, Gemini, etc.) in your app name unless you are the brand owner (Guideline 2.3.7)
- [ ] Content moderation required for all AI-generated output — filter harmful/illegal content (Guideline 1.2)
- [ ] Disclose AI data processing in privacy policy — what inputs are processed, where, and by whom (Guideline 5.1.1)
- [ ] Obtain user consent before processing user inputs through AI services (Guideline 5.1.1)
- [ ] AI features, credits, and token packs sold via IAP (Guideline 3.1.1)

## Google Play

- [ ] AI-generated content must not violate content policies — same rules as human-created content (Content Policy)
- [ ] Realistic AI images/video/audio of real people require provenance signals: watermarks or metadata (AI Content Policy)
- [ ] Disclose AI usage prominently in store description if AI is a core feature (Store Listing Policy)
- [ ] AI decisions affecting users may trigger regulatory requirements (transparency, appeal rights) (AI Policy)
- [ ] No AI for deceptive content — deepfakes for fraud, impersonation, or misinformation prohibited (Deceptive Behavior Policy)

## React Native Notes

- API key security: NEVER embed AI service keys in the JS bundle — they are trivially extractable via `react-native-decompiler` or Hermes bytecode inspection
- Pattern: proxy all AI calls through your backend; backend holds the API key
- `react-native-dotenv` does NOT protect keys — env vars are baked into the bundle at build time
- Content moderation wrapper: run AI responses through a moderation endpoint (OpenAI Moderation API, Perspective API) before displaying to user
- Consent modal: present before first AI interaction — explain what data is sent, to which service, and retention policy
- For China builds: use build flavors or runtime config to disable AI features — `Platform.constants` or a feature flag service
- IAP for AI credits: use consumable IAP via `react-native-iap` — track credit balance server-side, not client-side
- Expo Config Plugins can conditionally include/exclude AI-related native modules per build variant

## Related Rules

- [rules/api-key-security.md](../rules/api-key-security.md)
- [rules/in-app-purchases.md](../rules/in-app-purchases.md)
- [rules/privacy-policy.md](../rules/privacy-policy.md)
- [rules/china-distribution.md](../rules/china-distribution.md)
