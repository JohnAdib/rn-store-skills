# Metadata Rules

## Competitor Platform References
**Apple**: 2.3.1 — Accurate Metadata | **Google**: Metadata policy — Misleading claims | **Severity**: REJECTION

App Store listing must not reference competing platforms. Apple rejects mentions of Android/Google Play. Google rejects mentions of Apple/iOS.

### Detect
```bash
# Scan app.json, package.json, and all localization files for competitor terms
grep -riE "android|google play|samsung|galaxy store|huawei|appgallery|amazon appstore|windows store|\.apk|sideload" \
  app.json package.json ios/**/*.strings ios/**/*.stringsdict 2>/dev/null

# Google side — scan for Apple/iOS references in Android metadata
grep -riE "iphone|ipad|ios|app store|apple|itunes" \
  android/app/src/main/res/values*/strings.xml 2>/dev/null

# Check fastlane metadata directories
grep -riE "android|google play|samsung|galaxy store|iphone|ipad|ios|app store" \
  fastlane/metadata/ 2>/dev/null
```

### Fix
1. Replace platform-specific terms with generic alternatives:
   - "Also available on Android" → "Available on multiple platforms"
   - "Transfer from your iPhone" → "Transfer from your previous device"
   - "Download from the App Store" → "Download our app"
2. Use separate metadata files per store — never share copy between Apple and Google listings.
3. Audit all locales. Translators often add platform references that don't exist in the source language.

### Example Rejection
> Guideline 2.3.1 — Performance: Your app's metadata references other mobile platforms, which is not appropriate for the App Store.

---

## Apple Trademark Violations
**Apple**: 5.2.5 — Apple Trademarks | **Google**: N/A (Apple-specific) | **Severity**: REJECTION

Do not use Apple product names (iPhone, iPad, Mac, iCloud, Apple Watch, AirPods, etc.) in your app name, subtitle, or description. Do not use Apple device silhouettes in your app icon. Do not show unauthorized 3D device renders in screenshots.

### Detect
```bash
# Scan app name and metadata for Apple product names
grep -riE "\b(iphone|ipad|ipod|mac|macbook|imac|icloud|airpods|apple watch|apple tv|homepod|siri|facetime|airdrop)\b" \
  app.json ios/**/*.strings fastlane/metadata/en-US/ 2>/dev/null

# Check app display name in app.json
grep -iE "\"(displayName|name)\".*\".*\b(iphone|ipad|mac)\b" app.json 2>/dev/null

# Check Info.plist bundle display name
grep -A1 "CFBundleDisplayName" ios/*/Info.plist 2>/dev/null
```

### Fix
1. Replace Apple product names with generic terms:
   - "iPhone Cleaner" → "Phone Cleaner"
   - "For iPad" → "For Tablet" or remove entirely
   - "Sync with iCloud" → "Cloud sync" or "Sync with your cloud"
2. Remove device silhouettes from app icon — use abstract shapes instead.
3. Screenshots may show your app running on a device, but do not superimpose 3D device renders unless you use Apple-provided marketing assets per their guidelines.
4. "Apple", "iOS", and product names can appear in body text when factually describing compatibility, but not in the app name or subtitle.

### Example Rejection
> Guideline 5.2.5 — Legal: Your app name or metadata includes Apple trademark "iPhone" without authorization. App names may not include Apple product names.

---

## China Storefront AI References
**Apple**: 5 — Legal (Chinese DST Regulations) | **Google**: N/A (Apple China storefront) | **Severity**: REJECTION (China only)

China's Deep Synthesis Technology regulations ban references to unlicensed foreign AI services across ALL App Store metadata visible in the China storefront. This applies to every locale — not just `zh-Hans` — because Chinese users can switch their device language.

**Banned terms**: ChatGPT, GPT-4, GPT-4o, GPT-3, OpenAI, Gemini, Bard, Claude, Anthropic, Midjourney, DALL-E, DALL·E, Copilot (AI context), Stable Diffusion (cloud), Whisper (OpenAI), Sora

### Detect
```bash
# Scan ALL locale metadata — not just Chinese
grep -riE "chatgpt|gpt-[34]|gpt4|openai|gemini|bard|claude|anthropic|midjourney|dall-?e|dall·e|copilot|stable.?diffusion|whisper|sora" \
  fastlane/metadata/ app.json ios/**/*.strings 2>/dev/null

# Check if China storefront is included in distribution
grep -riE "CHN|china|156" fastlane/ ios/ 2>/dev/null
```

### Fix
1. **Option A — Remove references**: Strip all banned AI terms from metadata across every locale. Replace with generic terms ("AI-powered", "intelligent assistant").
2. **Option B — Exclude China**: Remove China (CHN / 156) from your App Store Connect territory list in App Store distribution settings.
3. **Option C — Get licensed**: Obtain MIIT (Ministry of Industry and Information Technology) filing/license for your AI service in China. This is the hardest path.
4. Check that in-app strings visible at launch also do not contain banned terms — Apple reviews runtime UI for China.

### Example Rejection
> Guideline 5 — Legal: Your app includes references to ChatGPT/OpenAI which are not licensed for operation in China. Please remove these references or exclude the China storefront.

---

## App Preview Device Frames
**Apple**: 2.3.4 — App Previews | **Google**: N/A (Apple-specific) | **Severity**: REJECTION

App preview **videos** must be screen captures only — no device bezels, frames, or borders overlaid on the video. Static **screenshots** CAN include device frames. This is a common confusion.

### Detect
```bash
# Check for app preview video files in fastlane
find fastlane/metadata -name "*.mp4" -o -name "*.mov" 2>/dev/null

# Check for device frame assets that might be composited onto videos
find . -iname "*device*frame*" -o -iname "*bezel*" -o -iname "*mockup*" 2>/dev/null
```
- Manual check: open each preview video and verify no device chrome appears around the edges.

### Fix
1. Re-record previews as pure screen captures using Xcode Simulator → File → Record Screen, or QuickTime Player mirroring a physical device.
2. Do not use third-party tools that add device frames to videos (e.g., Rotato, AppLaunchpad video mode).
3. Static screenshots are unaffected — you can still use device frames on those.
4. Preview videos must also be between 15–30 seconds long.

### Example Rejection
> Guideline 2.3.4 — Performance: Your app preview includes device images/bezels that are not permitted. App previews should only use captured footage of the app.

---

## Missing Subscription Metadata
**Apple**: 3.1.2 — Subscriptions | **Google**: Billing policy — Subscription transparency | **Severity**: REJECTION

Apps with subscriptions must include Privacy Policy URL, Terms of Service/EULA link in App Store Connect, AND in the app description across all locales. Google requires subscription disclosures in the Data Safety section.

### Detect
```bash
# Check app description for required links
grep -riE "(terms|privacy|eula|tos|policy)" \
  fastlane/metadata/*/description.txt 2>/dev/null

# Check if Privacy Policy URL is set in app.json or expo config
grep -iE "privacyPolicyUrl|privacy" app.json app.config.js app.config.ts 2>/dev/null

# Check for subscription/IAP product definitions
grep -riE "subscription|iap|in.app|purchase|premium|pro" \
  app.json ios/**/*.storekit android/**/BillingClient* 2>/dev/null
```

### Fix
1. Add to the **bottom of every locale's app description**:
   ```
   Terms of Use: https://yourapp.com/terms
   Privacy Policy: https://yourapp.com/privacy
   ```
2. Set Privacy Policy URL in App Store Connect → App Information → Privacy Policy URL.
3. If using a custom EULA, add it under App Store Connect → App Information → License Agreement.
4. Google Play Console: fill Data Safety section accurately, include subscription details in the store listing.
5. Ensure links are live and accessible (not 404, not behind a login).

### Example Rejection
> Guideline 3.1.2 — Business: Your app offers auto-renewing subscriptions but the App Store description does not include links to the Terms of Use and Privacy Policy.
