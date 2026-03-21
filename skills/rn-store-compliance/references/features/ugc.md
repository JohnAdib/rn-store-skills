# User-Generated Content / Moderation

Feature checklist for any app with user-generated content, social features, or community interaction.

---

## Apple (Guidelines 1.1, 1.2)

- [ ] Content moderation: filter objectionable material (auto or manual)
- [ ] Report mechanism for offensive content
- [ ] Block abusive users
- [ ] Published support contact info
- [ ] NSFW from web: hidden by default, opt-in via website
- [ ] No random anonymous chat (Chatroulette-style)
- [ ] No anonymous bullying or hot-or-not voting mechanics
- [ ] No apps primarily for pornographic content
- [ ] Creator apps: age restriction for content exceeding base rating
- [ ] No defamatory/discriminatory content
- [ ] Consent for recording user activity
- [ ] User consent for data collection
- [ ] ATT for cross-app tracking
- [ ] Push notifications: not required for core features, opt-in for marketing

## Google Play

- [ ] Content moderation (automated + human review for flagged)
- [ ] User reporting accessible within content
- [ ] Terms of service prohibiting objectionable content
- [ ] Block/mute users
- [ ] DMCA/takedown request process
- [ ] Remove illegal content within 24 hours
- [ ] Content rating reflects UGC capabilities
- [ ] No personalized ads to children if kids may access

## React Native Notes

**Content moderation approach:**
- Server-side moderation is non-negotiable. Client-side filtering alone won't pass review.
- Use moderation APIs (OpenAI Moderation, AWS Rekognition, Google Cloud Vision) for automated screening.
- Implement a human review queue for flagged content.

**Report UI pattern:**
- Every piece of UGC needs a report action (three-dot menu, long press, or dedicated button).
- Report flow: reason selection → optional details → confirmation → server submission.
- Apple reviewers will look for this. If they can't find it, rejection.

**Block/mute implementation:**
- Block must prevent the blocked user's content from appearing anywhere in the blocker's view.
- Mute is content-level; block is user-level. Implement both.
- Persist block list server-side, not just local storage.

**Common pitfalls:**
- No moderation at all — guaranteed rejection from both stores.
- Report button buried too deep — reviewer can't find it, rejection.
- Allowing anonymous chat without moderation — Apple will reject.
- Not updating content rating questionnaire to reflect UGC capabilities.
- Missing ATT prompt when third-party analytics SDKs track users.
