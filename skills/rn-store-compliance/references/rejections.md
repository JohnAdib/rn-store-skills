# Handling App Store and Play Store Rejections

Guide for responding to rejections from Apple App Store and Google Play Store.

---

## General Principles

1. **Read the rejection message carefully** — it cites specific guideline numbers
2. **Fix only the cited issues** — don't make unrelated changes that could trigger additional review flags
3. **Be specific in your response** — explain exactly what you changed and where
4. **Be professional** — factual and courteous, even if you disagree
5. **Respond promptly** — delays can cause additional issues

---

## Apple App Store Rejections

### Understanding the Rejection

Apple rejections come through App Store Connect and include:
- The specific guideline number(s) violated (e.g., "Guideline 2.1 - Performance")
- A description of the issue
- Sometimes screenshots showing the problem
- Sometimes a request for additional information

### Resolution Center

1. Log in to App Store Connect → Activity → select the rejected build
2. Read the full rejection details in the Resolution Center
3. Reply in the Resolution Center with:
   - What you changed to fix the issue
   - Where in the app the fix is (specific screens/flows)
   - If applicable, how the reviewer can verify the fix
4. Resubmit the binary

### Common Apple Rejection Responses

**Guideline 2.1 (App Completeness / Crashes)**:
"We identified and fixed the crash that occurred in [specific flow]. The issue was caused by
[root cause]. We've added error handling and tested on [devices/OS versions]. Please see
[specific screen] to verify the fix."

**Guideline 2.3 (Metadata)**:
"We've updated our [screenshots/description/metadata] to accurately reflect the current
app functionality. Specifically, we [describe changes]. All screenshots are now taken from
the submitted build."

**Guideline 3.1.1 (IAP)**:
"We've implemented Apple In-App Purchase for all digital content purchases. The [specific feature]
now uses StoreKit/IAP instead of [previous payment method]. External payment links have been
removed from [specific locations]."

**Guideline 5.1 (Privacy)**:
"We've updated our privacy policy to accurately reflect all data collection. We've added the
required [ATT prompt / PrivacyInfo.xcprivacy / Privacy Nutrition Labels] declarations. Specifically:
[list what was added/changed]."

### Appealing an Apple Rejection

If you believe the rejection is incorrect:
1. First, reply in the Resolution Center explaining why you believe the app complies
2. If unresolved, request a phone call with App Review through the Resolution Center
3. Final escalation: **App Review Board** — submit an appeal at
   `https://developer.apple.com/contact/app-store/?topic=appeal`
4. The App Review Board's decision is final

**Tips for successful appeals:**
- Reference the specific guideline and explain how your app complies
- Provide examples of similar approved apps (not competitors, but category peers)
- Include screenshots or screen recordings showing the flow in question
- Be factual, not emotional

---

## Google Play Store Rejections

### Understanding the Rejection

Google rejections come through the Play Console and include:
- The specific policy violated
- A description of the issue
- Sometimes a deadline to fix

### Types of Google Enforcement

1. **Pre-publication rejection**: App update rejected before going live
2. **Post-publication warning**: App is live but you must fix an issue by a deadline
3. **Post-publication removal**: App removed from the store immediately
4. **Account warning**: Multiple violations, risking account suspension

### Responding to Rejections

1. Log in to Play Console → select the app → Policy status
2. Read the specific policy citation and description
3. Make the required changes
4. Resubmit with a detailed description of changes in the "What's new" and/or the submission notes

### Policy Appeal Process

If you believe the rejection is incorrect:
1. Use the **Policy Appeal Form** in Play Console (Policy status → Appeal)
2. Explain clearly why your app complies with the cited policy
3. Include specific evidence (screenshots, code references)
4. Appeals take **7-14 business days** — plan accordingly
5. Google's decision on the appeal is typically final, but you can submit additional appeals
   with new information

### Common Google Play Rejection Responses

**Deceptive Behavior**:
"We've updated the app to ensure all functionality matches our store listing description.
Specifically, we [removed/modified] the [feature] that was flagged. Our screenshots have been
updated to reflect the current app version."

**Data Safety**:
"We've updated our Data Safety section to accurately declare all data collection. We added
declarations for [specific SDKs/data types]. Our privacy policy has been updated to match
at [URL]."

**Target SDK**:
"We've updated our targetSdkVersion to [version] and tested all functionality against
Android [version]. All deprecated API usages have been replaced with their modern equivalents."

**Permissions**:
"We've removed the [permission] that was flagged as unnecessary. We've added runtime
permission rationale for [remaining permissions], explaining to users why each is needed
before the system dialog appears."

---

## Prevention Strategies

### Before Every Submission

1. Run through the [Pre-Submission Checklist](pre-submission-checklist.md)
2. Test on real devices (not just simulator/emulator)
3. Have someone unfamiliar with the app test the core flows
4. Review all metadata for accuracy
5. Check that all third-party SDKs are up to date and compliant

### Tracking Rejections

Keep a log of past rejections with:
- Date
- Store (Apple / Google)
- Guideline/policy cited
- Root cause
- Fix applied
- Time to resolution

This helps identify patterns and prevent repeat rejections.

### Common Patterns to Watch

- **First submission**: Most likely to be rejected — be extra thorough
- **Major updates**: Feature additions trigger more scrutiny than bug fixes
- **Holiday season**: Review times are longer around Nov-Dec; submit early
- **Policy updates**: Both stores update policies regularly; re-read before major submissions
- **Reviewer subjectivity**: Different reviewers may flag different things; if a borderline
  feature passes once, it might not pass next time
