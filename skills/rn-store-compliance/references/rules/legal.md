# Legal Compliance Rules

## GDPR — EU General Data Protection Regulation
**Apple**: 5.1 — Privacy | **Google**: User data policy — EU requirements | **Severity**: REJECTION / FINE

Apps distributed in the EU must comply with GDPR. Both Apple and Google enforce GDPR-aligned requirements during review. Violations trigger rejection and can result in fines up to 4% of annual global revenue from EU regulators.

### Detect
```bash
# Check if app collects personal data
grep -rnE "(email|phone|name|address|location|userId|user_id|analytics|tracking)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for consent mechanism before data collection
grep -rnE "(consent|gdpr|opt.?in|cookie.?banner|privacy.?consent|data.?consent)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for data deletion capability
grep -rnE "(delete.?account|delete.?data|erase|right.?to.?delete|data.?removal)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for analytics/tracking SDKs that collect EU user data
grep -E "(analytics|firebase|amplitude|mixpanel|segment|facebook|google-analytics)" \
  package.json 2>/dev/null

# Check if app targets EU (locale/territory checks)
grep -rnE "(en-GB|de-DE|fr-FR|es-ES|it-IT|nl-NL|EUR|europe)" \
  --include="*.tsx" --include="*.ts" --include="*.json" \
  src/ app/ 2>/dev/null
```

### Fix
1. **Consent before collection**: Show a consent dialog before collecting any personal data. Pre-checked boxes are NOT valid consent under GDPR.
2. **Right to delete**: Implement in-app account/data deletion (see Account Deletion rule below).
3. **Right to export**: Provide data portability — user can request a copy of their data.
4. **Privacy policy**: Must explain what data is collected, why, how long it's stored, and who it's shared with. Must be available before data collection starts.
5. **Data minimization**: Only collect data necessary for the app's core function.
6. **Analytics SDKs**: Configure Firebase/Amplitude/Mixpanel to anonymize IP addresses for EU users. Use consent mode for Google Analytics.
7. **Data Processing Agreement (DPA)**: Have DPAs with all third-party services that process EU user data (Firebase, Sentry, analytics providers all offer DPAs).
8. **React Native**: Use `@react-native-community/geolocation` or `expo-location` with `region` check to apply GDPR logic only for EU users, or apply globally (simpler).

### Example Rejection
> Guideline 5.1 — Legal — Privacy: Your app collects user data without providing a mechanism for users to request deletion of their personal information, as required by applicable data protection laws.

---

## CCPA / CPRA — California Consumer Privacy Act
**Apple**: 5.1 — Privacy | **Google**: User data policy — US state requirements | **Severity**: REJECTION

Apps available in the US with California users must comply with CCPA/CPRA if the developer meets revenue or data volume thresholds. Even if you're below thresholds, implementing CCPA is best practice and prevents future issues.

### Detect
```bash
# Check for "Do Not Sell" or "Do Not Share" UI
grep -rnE "(do.?not.?sell|do.?not.?share|ccpa|cpra|opt.?out|privacy.?rights)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for data sale or sharing with third parties
grep -rnE "(share.*data|sell.*data|third.?party|data.?broker|ad.?network)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. Add a "Do Not Sell or Share My Personal Information" link in Settings or Privacy section.
2. If using ad SDKs (AdMob, Facebook Ads), implement a consent/opt-out mechanism.
3. Privacy policy must include a CCPA section listing: categories of data collected, purpose, and third parties data is shared with.
4. Respond to data deletion and access requests within 45 days.
5. For React Native: add a privacy settings screen with toggles for optional data collection (analytics, personalization, advertising).

### Example Rejection
> Your app appears to share user data with advertising networks but does not provide users with an option to opt out of data sharing as required by applicable privacy laws.

---

## DMA — EU Digital Markets Act
**Apple**: Store terms (EU) | **Google**: EU compliance | **Severity**: COMPLIANCE REQUIRED

The DMA affects apps distributed in the EU, particularly regarding payment processing and app distribution. Apple now allows alternative payment processors and alternative app marketplaces in the EU.

### Detect
```bash
# Check if app is distributed in EU
grep -rnE "(EU|europe|EEA|GDPR|DMA)" \
  --include="*.json" --include="*.ts" --include="*.tsx" \
  . 2>/dev/null

# Check for alternative payment implementation
grep -rnE "(StoreKit.*External|ExternalPurchase|alternative.?payment|external.?link)" \
  --include="*.tsx" --include="*.ts" --include="*.swift" --include="*.m" \
  src/ app/ ios/ 2>/dev/null
```

### Fix
1. **Alternative payments (iOS EU)**: If using Apple's External Purchase Link entitlement (StoreKit External Purchase API), you must still display Apple's required disclosure sheet before redirecting users.
2. **Apple commission**: External purchases in EU still incur a reduced commission (currently ~17% for most developers). Factor this into pricing.
3. **Google Play**: Alternative billing in EU via User Choice Billing program. Service fee reduction applies.
4. **Default browser/email**: iOS 17+ in EU allows users to set default browser and email. Ensure your app respects `SFSafariViewController` and `MFMailComposeViewController` defaults.
5. **Sideloading**: iOS 17.4+ in EU allows alternative app marketplaces. If distributing outside App Store, you must still meet Apple's notarization requirements.
6. Most React Native apps should: keep using standard IAP, add EU-specific alternative payment option if desired, and ensure compliance with the jurisdiction's specific requirements.

### Example Rejection
> Your app uses the External Purchase Link entitlement but does not display the required Apple disclosure sheet before redirecting users to an external purchase page.

---

## COPPA — Children's Online Privacy Protection Act
**Apple**: 1.3 — Kids Category + 5.1.4 | **Google**: Families policy | **Severity**: REJECTION

Apps directed at children under 13 (or under 16 in EU) must comply with COPPA and similar laws. Both stores have strict enforcement — Kids Category apps face the highest scrutiny.

### Detect
```bash
# Check if app is in Kids category or targets children
grep -rnE "(kids|child|children|minor|parental|family|educational|toddler|preschool)" \
  --include="*.json" --include="*.tsx" --include="*.ts" \
  app.json fastlane/ 2>/dev/null

# Check for analytics/tracking SDKs (banned in kids apps)
grep -E "(firebase-analytics|amplitude|mixpanel|segment|facebook|google-analytics|appsflyer|adjust|branch)" \
  package.json 2>/dev/null

# Check for advertising SDKs
grep -E "(admob|google-mobile-ads|facebook-ads|unity-ads|applovin|ironsource)" \
  package.json 2>/dev/null

# Check for external links (need parental gate in kids apps)
grep -rnE "(Linking\.openURL|WebView|SafariView|InAppBrowser)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for data collection
grep -rnE "(email|phone|name|address|location|birthday)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. **No behavioral advertising**: Remove all ad SDKs that serve behavioral/targeted ads. Only contextual ads are permitted.
2. **No analytics on children**: Remove or disable analytics SDKs, or use child-safe alternatives (Apple's built-in App Analytics is OK).
3. **Parental gate**: Any link that exits the app must be behind a parental gate (e.g., math problem, multi-gesture).
4. **Minimal data collection**: Do not collect personal data from children. No account creation, no email, no name.
5. **No social features**: No chat, messaging, photo sharing, or UGC in kids apps.
6. **No push notifications**: Avoid push for kids apps, or implement parental consent mechanism.
7. **Privacy policy for children**: Must specifically address children's data practices.
8. **Google Families program**: If targeting children on Google Play, enroll in the Designed for Families program and meet all additional requirements.
9. Cross-reference: see `app-types/kids.md` for full Kids Category checklist.

### Example Rejection
> Guideline 1.3 — Safety — Kids Category: Your Kids Category app includes third-party analytics (Firebase Analytics) which is not appropriate for apps directed at children.

---

## Account Deletion Requirement
**Apple**: 5.1.1(v) — Account Deletion | **Google**: Account deletion policy | **Severity**: REJECTION

If your app allows account creation, it MUST allow account deletion from within the app. This has been required since June 2022 (Apple) and December 2023 (Google). The deletion must be easy to find, not buried in a maze of screens.

### Detect
```bash
# Check for account creation flows
grep -rnE "(createAccount|signUp|register|SignUp|Register|createUser)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for account deletion flows
grep -rnE "(deleteAccount|delete.?account|remove.?account|deactivate|close.?account)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for deletion API endpoint
grep -rnE "(DELETE.*account|delete.*user|/api.*delete|account.*destroy)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check Settings/Profile screens for deletion option
grep -rnE "(settings|profile|account)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ screens/ 2>/dev/null
```

### Fix
1. Add "Delete Account" option in Settings or Account/Profile screen — must be reachable within 2-3 taps.
2. Show a confirmation dialog before deletion (but don't add unnecessary friction).
3. Clearly explain what will be deleted (data, purchases, subscriptions).
4. If the user has an active subscription, inform them it must be cancelled separately via the store.
5. Complete deletion within 14 days (Apple's expectation).
6. Delete data from all backend systems, including third-party services (analytics, crash reporting, CRM).
7. **Do NOT**: require users to email support, call a phone number, visit a website, or go through a multi-step survey to delete their account.
8. **Do NOT**: rename "Delete" to "Deactivate" and keep the data — if the user requests deletion, data must be actually deleted.
9. If using Firebase Auth:
   ```tsx
   import auth from '@react-native-firebase/auth';
   await auth().currentUser?.delete();
   ```
10. If using a custom backend: call your deletion API, then sign the user out locally.

### Example Rejection
> Guideline 5.1.1(v) — Legal — Privacy: Your app supports account creation but does not include a mechanism for users to delete their account within the app.

---

## Export Compliance (Encryption)
**Apple**: Export Compliance (ECCN) | **Google**: Export laws | **Severity**: BLOCKS SUBMISSION

When submitting a build to App Store Connect, you must answer export compliance questions about encryption. Most React Native apps use HTTPS (which is encryption) and must declare this. Getting this wrong blocks TestFlight distribution and store submission.

### Detect
```bash
# Check if ITSAppUsesNonExemptEncryption is set in Info.plist
grep -A1 "ITSAppUsesNonExemptEncryption" ios/*/Info.plist 2>/dev/null

# Check for encryption libraries
grep -E "(crypto|encryption|aes|rsa|openssl|libsodium|react-native-crypto)" \
  package.json 2>/dev/null

# Check for custom encryption code
grep -rnE "(AES|RSA|encrypt|decrypt|cipher|CryptoKit|CommonCrypto)" \
  --include="*.tsx" --include="*.ts" --include="*.swift" --include="*.m" \
  src/ app/ ios/ 2>/dev/null

# Check app.json / app.config for Expo export compliance
grep -A5 "hasUserTrackingPermission\|ITSAppUsesNonExemptEncryption" \
  app.json app.config.js app.config.ts 2>/dev/null
```

### Fix
1. **Most React Native apps**: Add to `Info.plist`:
   ```xml
   <key>ITSAppUsesNonExemptEncryption</key>
   <false/>
   ```
   This is correct if your app ONLY uses HTTPS (standard TLS) for network calls — HTTPS is exempt from export compliance reporting.

2. **If you use custom encryption** (AES for local encryption, RSA for key exchange, end-to-end encryption):
   - Set `ITSAppUsesNonExemptEncryption` to `YES`
   - You must either: (a) obtain a CCATS classification from the US BIS, or (b) self-classify under an exemption (most common: TSU exception for mass-market software)
   - File an annual self-classification report with BIS and ENC

3. **Expo**: Set in `app.json`:
   ```json
   {
     "expo": {
       "ios": {
         "infoPlist": {
           "ITSAppUsesNonExemptEncryption": false
         }
       }
     }
   }
   ```

4. Setting this key avoids the manual compliance dialog every time you submit a build to App Store Connect or distribute via TestFlight.

### Example Rejection
> Your build cannot be distributed until export compliance information is provided. Navigate to App Store Connect → TestFlight → select the build → Provide Export Compliance Information.

---

## EULA / Terms of Service
**Apple**: 5.x — Legal | **Google**: Developer Distribution Agreement | **Severity**: REJECTION (if missing for subscriptions)

Apps with subscriptions or significant terms MUST have accessible Terms of Service. Apple provides a standard EULA that applies by default, but apps with custom terms need a custom EULA.

### Detect
```bash
# Check for Terms/EULA links in the app
grep -rnE "(terms|eula|tos|terms.?of.?service|terms.?of.?use|end.?user)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check if URLs are set
grep -rnE "https?://.*/(terms|tos|eula|legal)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check fastlane/metadata for terms mentions
grep -riE "(terms|eula|tos)" fastlane/metadata/ 2>/dev/null
```

### Fix
1. **No subscriptions, simple app**: Apple's standard EULA is sufficient. No action needed unless you have special terms.
2. **With subscriptions**: Terms of Use link MUST appear on every paywall screen AND in the app description. See `rules/subscriptions.md`.
3. **Custom EULA**: Upload in App Store Connect → App Information → License Agreement. This replaces Apple's standard EULA.
4. Terms must cover: auto-renewal terms, cancellation policy, refund policy, data usage, prohibited conduct, limitation of liability.
5. Both Terms and Privacy Policy must be accessible from within the app (Settings screen) and from the store listing.
6. Links must resolve to a live, accessible page — not 404, not behind a login.

### Example Rejection
> Guideline 3.1.2 — Business: Your app offers auto-renewing subscriptions but the Terms of Use are not accessible from within the app.

---

## Age Rating Accuracy
**Apple**: 2.3.7 — Age Rating | **Google**: Content rating (IARC) | **Severity**: REJECTION

Both stores require honest age/content rating questionnaire completion. Under-rating your app to reach a wider audience leads to rejection. Over-rating is less risky but may reduce visibility.

### Detect
```bash
# Check for content that affects age rating
grep -rnE "(violence|blood|gore|alcohol|drug|gambling|sexual|nude|horror|profanity|mature)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for UGC features (raises age rating)
grep -rnE "(chat|message|comment|post|share|community|social|forum)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for WebView (unrestricted web access raises rating)
grep -rnE "(WebView|WKWebView|react-native-webview)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for gambling/loot box mechanics
grep -rnE "(loot|gacha|spin|lottery|bet|wager|casino|slot)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. **Apple**: Complete the age rating questionnaire in App Store Connect honestly. New ratings as of July 2025: 4+, 9+, 12+, 13+, 16+, 17+, 18+. Updated questionnaire required by January 31, 2026.
2. **Google**: Complete the IARC content rating questionnaire in Play Console.
3. Features that raise the age rating:
   - UGC / social features → likely 16+ or 18+ (Apple), Teen+ (Google)
   - Unrestricted web browsing via WebView → 17+ (Apple)
   - Gambling or simulated gambling → 17+/18+
   - Alcohol/drug references → 12+/17+ depending on context
4. Third-party SDKs can affect rating: Facebook SDK adds social features, ad SDKs may show mature ads.
5. If your content rating changes, you must update the questionnaire before resubmitting.
6. Do not attempt to hide features from reviewers to get a lower rating — Apple tests thoroughly.

### Example Rejection
> Guideline 2.3.7 — Performance: Your app's age rating does not reflect the level of user-generated content available. Please update the Content Descriptions to reflect that your app includes unrestricted web access and user-generated content.

---

## Gambling and Loot Box Regulations
**Apple**: 5.3 — Gaming, Gambling, Lotteries | **Google**: Gambling policy | **Severity**: REJECTION / LEGAL

Real-money gambling requires licenses per jurisdiction. Loot boxes (paid randomized rewards) must disclose odds before purchase. Several countries have specific laws.

### Detect
```bash
# Check for gambling-related code
grep -rnE "(gamble|casino|slot|poker|bet|wager|lottery|jackpot|roulette|blackjack)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for loot box / gacha mechanics
grep -rnE "(loot.?box|gacha|random.?reward|mystery.?box|crate|pack.?opening|pull|spin|chest)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for odds disclosure
grep -rnE "(odds|probability|chance|rate|drop.?rate|rarity)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. **Real-money gambling**: Requires valid gambling license for every jurisdiction you operate in. Implement geo-fencing. Age verification (21+ in US, varies by country). Apple requires "organization" developer account, not individual.
2. **Loot boxes / gacha**:
   - **Apple**: Must disclose odds of each item type BEFORE purchase (3.1.1).
   - **China**: Must disclose exact drop rates for each item.
   - **Belgium**: Paid loot boxes banned entirely — disable or remove for Belgium.
   - **Japan**: Kompu Gacha (combining gacha items) is banned.
   - **Netherlands**: Paid loot boxes may constitute gambling — legal uncertainty, consider disabling.
3. **Simulated gambling** (no real money): Allowed but affects age rating (17+). Must clearly state no real money is involved.
4. Disclose odds in a clearly visible location BEFORE the purchase flow — not in Terms of Service.
5. In-game currencies purchased with real money that are then used for randomized rewards still count as paid loot boxes.

### Example Rejection
> Guideline 5.3 — Legal: Your app includes paid random item mechanics (loot boxes) but does not disclose the odds of receiving each type of item prior to purchase.

---

## Regional Legal Requirements
**Apple**: 5 — Legal | **Google**: Local laws policy | **Severity**: REJECTION / REMOVAL

Different countries have specific legal requirements. Apps distributed globally must comply with the strictest applicable law or implement per-region logic.

### Key Regions

| Region | Law | Key Requirement |
|--------|-----|----------------|
| EU | GDPR | Consent, deletion, portability, DPO |
| California | CCPA/CPRA | "Do Not Sell" opt-out |
| China | PIPL + DST | Data localization, AI licensing, banned AI terms |
| Brazil | LGPD | Consent, deletion, DPO, data portability |
| India | DPDP Act 2023 | Consent, grievance officer, children's data |
| Russia | Data Localization | Store Russian user data on Russian servers |
| South Korea | PIPA | Separate consent for each data type, encryption |
| Japan | APPI | Consent for cross-border data transfer |

### Fix
1. **Simplest approach**: Apply the strictest standard (GDPR) globally. This covers most regional requirements.
2. **Per-region logic**: Use device locale or IP-based geolocation to apply region-specific consent flows:
   ```tsx
   import * as Localization from 'expo-localization';
   const isEU = ['DE', 'FR', 'IT', 'ES', 'NL', ...].includes(Localization.region);
   ```
3. **China**: See `rules/metadata.md` for banned AI terms. Data must be stored on servers in mainland China if processing data of Chinese users at scale.
4. **Russia**: If you have significant Russian users, data must be stored on servers physically located in Russia.
5. Consult legal counsel for apps distributed in regulated industries (finance, health, gambling) in specific regions.
6. Cross-reference: see `rules/metadata.md` (China AI terms), `app-types/crypto-finance.md` (financial regulations).

### Example Rejection
> Your app is distributed in China but references AI services (ChatGPT, OpenAI) that are not licensed for operation in mainland China. Remove these references or exclude the China storefront.
