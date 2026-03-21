# Apple App Store Review Guidelines

Complete reference for Apple App Store Review Guidelines relevant to React Native apps.
Guideline numbers match Apple's official numbering at https://developer.apple.com/app-store/review/guidelines/

---

## Quick Index

| # | Guideline | Key Risk |
|---|-----------|----------|
| 1.1 | Objectionable Content | UGC needs filter + report + block |
| 1.1.1-1.1.7 | Specific Content Types | Defamatory, violent, sexual, religious, false info |
| 1.2 | User Safety | No dangerous behavior encouragement |
| 1.3 | Kids Category | No ads, analytics, external links without parental gate |
| 1.4 | Physical Harm | Medical disclaimers, no unqualified dosage info |
| 1.5 | Developer Info | Accurate contact info required |
| 1.6 | Data Security | Secure data handling |
| 1.7 | Criminal Activity | Must report to authorities |
| 2.1 | App Completeness | No placeholders, crashes, or beta labels |
| 2.2 | Beta Testing | TestFlight only, no beta references in store |
| 2.3 | Accurate Metadata | Screenshots match app, no keyword stuffing |
| 2.3.1 | Metadata Text | No competitor names, accurate description |
| 2.3.4 | Previews | Video previews = screen capture only |
| 2.3.7 | Age Rating | Complete questionnaire honestly |
| 2.3.12 | What's New | Describe actual changes |
| 2.4 | Hardware Compatibility | Graceful degradation, iPad orientation |
| 2.4.5 | macOS Sandbox | Entitlements must match functionality |
| 2.5 | Software Requirements | iOS 26 SDK required (April 2026+) |
| 2.5.1 | Public APIs Only | No private frameworks |
| 2.5.6 | IPv6 | Must work on IPv6-only networks |
| 3.1.1 | In-App Purchase | Digital goods MUST use Apple IAP |
| 3.1.2 | Subscriptions | ToS + PP links, clear pricing, 7-day minimum |
| 3.1.3 | Other Payments | Reader apps, physical goods, person-to-person |
| 3.2 | Business Issues | No bait-and-switch, no forced ratings |
| 4.0 | Design Quality | Native feel, safe areas, dark mode |
| 4.1 | Copycats | Original design required |
| 4.2 | Minimum Functionality | More than a website wrapper |
| 4.2.1-4.2.7 | Sub-rules | ARKit, marketing, self-contained, templates |
| 4.3 | Spam | No duplicate/template apps |
| 4.4 | Extensions | Keyboard, Safari extension rules |
| 4.5 | Apple Services | SIWA, Maps, HealthKit, HomeKit |
| 4.5.4 | Push Notifications | Not required, no spam, opt-in |
| 4.5.6 | Apple Emoji | Unicode OK |
| 4.7 | HTML5 Games | Must have meaningful native functionality |
| 4.8 | Sign in with Apple | REQUIRED if any social login offered |
| 4.9 | Apple Pay | Recurring payment disclosure |
| 4.10 | OS Capabilities | Don't charge for OS features |
| 5.1 | Privacy | Policy required, consent required, data minimization |
| 5.1.1 | Data Collection | PrivacyInfo.xcprivacy, Privacy Nutrition Labels |
| 5.1.2 | Data Use/Sharing | No repurposing without consent |
| 5.1.3 | HealthKit | No ads/marketing with health data |
| 5.1.4 | Kids Privacy | COPPA/GDPR compliance |
| 5.1.5 | Location Services | Purpose string required |
| 5.2 | Intellectual Property | Trademarks, copyright, Apple branding |
| 5.2.5 | Apple Trademarks | No device names in app name/icon |
| 5.3 | Gambling | Licensed per jurisdiction, disclose loot box odds |
| 5.4 | VPN Apps | NEVPNManager, organization account |
| 5.5 | MDM | Enterprise/education only |
| 5.6 | Developer Conduct | No review manipulation, respond within 14 days |

---

## 1. Safety (Guidelines 1.x)

### 1.1 Objectionable Content

Apps with user-generated content (UGC) must include all three:
- Content filtering or moderation (automated or manual)
- A reporting mechanism for offensive content
- The ability to block abusive users

If the app has any social features — comments, profiles, chat, photo/video sharing, forums —
all three are required. Missing even one will cause rejection.

Apps must not include content that is offensive, insensitive, upsetting, intended to disgust,
in exceptionally poor taste, or simply creepy. This includes content targeting specific
nationalities, ethnicities, or other groups.

### 1.2 User Safety

Apps must not encourage dangerous behavior. Specifically:
- Health/fitness apps must include disclaimers that they are not a substitute for medical advice
- Apps that encourage excessive consumption of alcohol, drug use, or risky physical activities
  will be rejected
- Emergency service apps must include real emergency contact information

### 1.3 Kids Category

If targeting children under 13:
- No third-party analytics or advertising SDKs that aren't certified for children
- Must comply with COPPA (Children's Online Privacy Protection Act)
- No links out of the app without a parental gate
- No login requirement unless it provides clear value to the child
- No behavioral advertising
- Data collection must be minimal and clearly disclosed to parents
- Must not include links to external websites, social media, or purchasing opportunities
  without age verification

### 1.4 Physical Harm

- Medical apps must clearly disclaim they are not FDA-approved (unless they actually are)
- Don't provide dosage calculators without proper disclaimers
- Apps that could present a physical safety risk (e.g., using the phone while driving) must
  include appropriate warnings
- SOS/emergency features must connect to actual emergency services

### 1.5 Developer Information

- The developer name and contact info must be accurate and visible in the app and on the
  store listing
- A valid support URL is required
- Apps must have a working contact mechanism (email, support form, etc.)

---

## 2. Performance (Guidelines 2.x)

### 2.1 App Completeness

The app must be a finished product:
- No placeholder content ("Lorem ipsum", stock images used as real content)
- No broken links or buttons that do nothing
- No "coming soon" sections or empty features
- TestFlight/beta labels must be removed from all UI text and assets
- The app must not crash on launch or during any core user flows
- All features shown in screenshots must be functional
- Demo/test accounts must be provided to App Review if login is required

### 2.2 Beta Testing

- Don't reference "beta", "test", "preview", or "demo" in the App Store version
- Don't include TestFlight-specific UI or references
- The App Store version must be the final, production-ready build

### 2.3 Accurate Metadata

- Screenshots must reflect the actual app experience on the device size shown
- Don't show features that don't exist in the current version
- The app description must match actual functionality — no aspirational language
- Don't include competitor names or irrelevant keywords in metadata
- App name must not include generic terms like "best" or pricing info
- Category selection must accurately reflect the app's primary function
- What's New text should describe actual changes in this version

### 2.4 Hardware Compatibility

- If the app requires specific hardware (camera, GPS, ARKit, NFC), handle gracefully when
  hardware is unavailable — show a clear message, don't crash
- Use `UIRequiredDeviceCapabilities` in Info.plist to prevent installation on incompatible devices
- Test on devices without the required hardware to verify graceful degradation
- iPad apps must support both orientations unless there's a compelling reason not to

### 2.5 Software Requirements

- Target the current or previous iOS SDK
- **As of April 2026, submissions must use iOS 26 SDK or later**
- Use a React Native CLI or Expo SDK version that supports the required minimum
- Don't use deprecated APIs without fallbacks
- Support the latest two major iOS versions at minimum

---

## 3. Business (Guidelines 3.x)

### 3.1.1 In-App Purchase (IAP)

**The most common rejection reason in this category.**

All digital goods and services MUST use Apple IAP:
- Subscriptions to digital content
- Premium features or feature unlocks
- Virtual currency, in-game items, loot boxes
- One-time purchases for digital content (e.g., additional filters, themes)

Physical goods and real-world services CAN use external payment:
- Physical merchandise (Stripe, etc.)
- Ride-sharing, food delivery, hotel bookings
- Real-world event tickets
- Person-to-person payments (e.g., Venmo-style)

**Never** link to an external website for purchasing digital content. Even mentioning that
content can be purchased elsewhere has caused rejections.

React Native implementation:
- `react-native-iap` — most popular, wraps StoreKit
- `expo-in-app-purchases` — Expo's built-in module
- RevenueCat — managed service, handles receipt validation

### 3.1.2 Subscriptions

Must clearly show:
- The price in the user's local currency
- The subscription duration (weekly, monthly, yearly)
- What happens when the subscription ends (access revoked, downgraded, etc.)
- Free trial details: when billing starts, how to cancel before being charged

Required elements on subscription screens:
- Link to Apple's subscription management page (`https://apps.apple.com/account/subscriptions`)
- Terms of Service link
- Privacy Policy link
- Clear disclosure of auto-renewal

Free trials must:
- Disclose the price that will be charged after the trial
- Make cancellation instructions clear
- Not auto-subscribe without explicit user consent

### 3.1.3 Reader Apps

Reader apps (Netflix, Spotify, Kindle-style) may:
- Link to their website for account creation
- Allow users to access previously purchased content

Reader apps must NOT:
- Include in-app purchase buttons for content
- Link directly to a purchase page on their website (allowed only for account creation)

### 3.2 Other Business Model Issues

- Don't create an app that is essentially a website wrapped in a WebView with no native
  functionality — it must provide value beyond the mobile website
- Free apps cannot lock all content behind a paywall on first launch without offering a
  meaningful free experience
- Don't artificially inflate download size or ratings
- Bait-and-switch tactics (free download but everything locked) will be rejected
- Multi-app developers: don't create apps that primarily exist to cross-promote other apps

---

## 4. Design (Guidelines 4.x)

### 4.0 Design Quality

The app must feel native and polished:
- Use proper safe area insets (`SafeAreaView` in React Native)
- Support Dynamic Type where possible (text should scale with system settings)
- Handle dark mode if the system supports it (at least don't break in dark mode)
- Use system UI conventions (swipe to go back, pull to refresh where expected)
- No pixelated or stretched images
- Consistent visual language throughout the app
- Text must be readable — sufficient contrast, appropriate font sizes

### 4.1 Copycats

- Don't clone another app's UI or functionality — bring your own design
- Don't use another company's trademarks, branding, or trade dress without written permission
- Don't mimic Apple's built-in apps in a confusing way

### 4.2 Minimum Functionality

The app must do something useful:
- Single-feature apps are fine if the feature is substantive and well-executed
- WebView-only apps will be rejected unless they add meaningful native features on top
- Apps that are primarily marketing material for a company will be rejected
- Calculator/flashlight/tip-calculator style apps are generally rejected unless they offer
  something significantly unique

### 4.3 Spam

- Don't submit multiple apps that are essentially the same with different themes, data sets,
  or minor variations (template apps)
- Don't duplicate built-in iOS functionality without significant added value
- Don't submit an app that is a repackaged version of another developer's app

### 4.5 Apple Sites and Services

If using Apple services, follow each service's specific guidelines:
- **Sign in with Apple**: REQUIRED if you offer any third-party social login (Google, Facebook,
  Twitter, etc.). Must be offered as a login option alongside other providers. Must use the
  Apple-provided UI button style.
- **Apple Maps**: Use MapKit for maps functionality on iOS
- **HealthKit**: Must explain data usage clearly, can't use health data for advertising
- **HomeKit**: Must support user-initiated control
- **SiriKit / App Intents**: Follow the specific interaction patterns

### 4.7 HTML5 Games/Apps

- Apps that are just HTML5/web content in a native wrapper will be rejected
- There must be meaningful native functionality beyond the WebView
- Performance must be comparable to native apps

---

## 5. Legal (Guidelines 5.x)

### 5.1 Privacy

Apps must include a privacy policy:
- The privacy policy link must work and be accessible from within the app AND on the store listing
- Must be in plain language, not just legal boilerplate
- Must accurately describe what data is collected, how it's used, and who it's shared with
- Must request user permission before collecting personal data
- Must not collect data unrelated to the app's core functionality

#### App Tracking Transparency (ATT)

If using IDFA or tracking users across apps/websites owned by other companies:
- Must show the ATT prompt before any tracking occurs
- Use `react-native-tracking-transparency` or `expo-tracking-transparency`
- Don't gate app functionality on the user accepting tracking
- Don't incentivize users to allow tracking ("allow tracking for bonus coins")
- The ATT purpose string must clearly explain what data is collected and how it's used

#### PrivacyInfo.xcprivacy

Required manifest file declaring all privacy-related API usage:
- Must declare reasons for accessing APIs: UserDefaults, file timestamp APIs, disk space APIs,
  system boot time, active keyboard APIs, user defaults
- React Native apps should audit ALL native modules (including transitive dependencies) for
  API usage that requires declaration
- Common React Native libraries that need declarations: AsyncStorage, RNFS, react-native-device-info
- Xcode will warn about missing declarations during build

#### Privacy Nutrition Labels

Must accurately declare all data collection in App Store Connect:
- This includes data collected by ALL third-party SDKs, not just your own code
- Common React Native SDKs to audit:
  - Firebase (Analytics, Crashlytics, Remote Config) — collects device ID, crash data, usage data
  - Sentry — collects crash data, device info
  - Amplitude / Mixpanel / Segment — collects usage analytics, device info
  - Facebook SDK — collects device ID, usage data, potentially advertising data
  - Google Sign-In — collects email, name, profile picture
  - OneSignal / FCM — collects device tokens, notification interaction data
- Under-declaring will cause rejection; over-declaring is safer than under-declaring

### 5.1.2 Data Use and Sharing

- Data collected for one purpose can't be repurposed without consent
- Don't share user data with data brokers
- Third-party SDKs that share data must be disclosed
- Financial and health data have additional restrictions on sharing

### 5.2 Intellectual Property

- Don't use copyrighted content (music, images, text) without proper licensing
- Don't include Apple's proprietary icons, UI elements, or trademarks
- Open source license compliance — if using GPL libraries, your distribution must comply

### 5.3 Gaming, Gambling, Lotteries

- Real-money gambling requires specific licenses per jurisdiction
- Must implement geo-restrictions for gambling features
- Loot boxes and gacha mechanics must disclose odds of each item/tier
- Contests and sweepstakes must have official rules and eligibility requirements

### 5.4 VPN Apps

- Must use `NEVPNManager` API
- Can't harvest or sell user data
- Must clearly explain what data is routed through the VPN
- VPN profile installation must be user-initiated

### 5.6 Developer Code of Conduct

- Don't manipulate ratings or reviews (incentivized reviews, review farms)
- Don't use misleading marketing or fake social proof
- Respond to App Review communications within 14 days
- Don't attempt to deceive the review process (hidden features, different behavior during review)
- Use `SKStoreReviewController` for requesting reviews — don't build custom review prompts
  that redirect to the App Store
