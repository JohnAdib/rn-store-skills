# Copyright & Intellectual Property — Media Rules

## Unlicensed Images and Photos
**Apple**: 5.2 — Intellectual Property | **Google**: Impersonation & IP policy | **Severity**: REJECTION

Using images without proper licensing — stock photos without a license, images from Google search, screenshots of other apps, or copyrighted illustrations — triggers rejection. This includes app icons, onboarding screens, marketing screenshots, and in-app content.

### Detect
```bash
# Find all image assets in the project
find src/ app/ assets/ ios/ android/ -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" -o -name "*.gif" -o -name "*.svg" \) 2>/dev/null

# Check for stock photo watermarks in filenames
find . -type f -iname "*shutterstock*" -o -iname "*istock*" -o -iname "*getty*" -o -iname "*unsplash*" -o -iname "*pexels*" -o -iname "*stock*" 2>/dev/null

# Check for placeholder/dummy image URLs in code
grep -rnE "(placeholder\.com|placehold\.it|picsum\.photos|via\.placeholder|dummyimage)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for hardcoded image URLs (potential hotlinked copyrighted content)
grep -rnE "https?://.*\.(jpg|jpeg|png|gif|webp)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. Use only images you own, have licensed, or that are under permissive licenses (Creative Commons CC0, Unsplash License, Pexels License).
2. Keep a `LICENSES.md` or `assets/ATTRIBUTION.md` file listing every third-party image with source and license type.
3. Replace placeholder images with original content before submission.
4. Do not use screenshots of competitor apps in your app or store listing.
5. Do not hotlink images from other websites — host your own copies of licensed images.
6. For AI-generated images: you generally own the output, but if the prompt references a specific artist's style or copyrighted character, the output may infringe. Avoid prompts like "in the style of [specific artist]."
7. App icon must be original — do not use stock icons, emojis, or system icons as your app icon.

### Example Rejection
> Guideline 5.2 — Legal — Intellectual Property: Your app includes images that appear to be used without proper authorization. Please provide documentation of your rights to use these images or replace them with original content.

---

## Unlicensed Music and Audio
**Apple**: 5.2 — Intellectual Property | **Google**: IP policy — Music/audio | **Severity**: REJECTION / REMOVAL

Using copyrighted music (background music, sound effects from commercial libraries without license, podcast clips, or recognizable songs) in your app or app preview video causes rejection. Apple and Google both use automated content recognition (similar to YouTube's ContentID) for app preview videos.

### Detect
```bash
# Find all audio files in the project
find . -type f \( -name "*.mp3" -o -name "*.wav" -o -name "*.aac" -o -name "*.m4a" -o -name "*.ogg" -o -name "*.flac" \) 2>/dev/null

# Check for audio playback code
grep -rnE "(Audio|Sound|expo-av|react-native-sound|react-native-track-player|AVAudioPlayer|MediaPlayer)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for streaming URLs (potential copyrighted streams)
grep -rnE "https?://.*\.(mp3|m3u8|mp4|aac|ogg)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for app preview videos
find fastlane/ -name "*.mp4" -o -name "*.mov" 2>/dev/null
```

### Fix
1. Use only royalty-free music and sound effects with proper licensing:
   - **Free options**: freesound.org (CC0), incompetech.com (CC BY), YouTube Audio Library
   - **Paid options**: Epidemic Sound, Artlist, AudioJungle (verify license covers mobile app distribution)
2. Keep proof of license for every audio file. Store license PDFs in your project repo.
3. For app preview videos: Apple rejects videos with copyrighted background music. Use royalty-free music or no music.
4. If your app plays user-selected music (e.g., from Apple Music or Spotify), use the official SDK — do not play content from unauthorized sources.
5. Sound effects from commercial libraries (e.g., SFX packs) must have a license that explicitly covers mobile app distribution.
6. If your app is a music player, implement DRM and respect content provider agreements.

### Example Rejection
> Guideline 5.2 — Legal — Intellectual Property: Your app preview video contains copyrighted music. App preview audio must be licensed for use or be original content.

---

## Unlicensed Video Content
**Apple**: 5.2 — Intellectual Property | **Google**: IP policy — Video | **Severity**: REJECTION / REMOVAL

Embedding or streaming copyrighted video content (movie clips, TV show excerpts, YouTube videos without permission, or screen recordings of other apps) causes rejection and potential legal action.

### Detect
```bash
# Find video files in the project
find . -type f \( -name "*.mp4" -o -name "*.mov" -o -name "*.avi" -o -name "*.mkv" \) 2>/dev/null

# Check for video playback / streaming code
grep -rnE "(Video|react-native-video|expo-video|expo-av|AVPlayer|ExoPlayer|VideoView)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for YouTube/Vimeo embed URLs
grep -rnE "(youtube\.com|youtu\.be|vimeo\.com|dailymotion)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for streaming URLs
grep -rnE "https?://.*\.(m3u8|mpd|mp4)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. Only embed video content you own or have distribution rights for.
2. For YouTube embeds: use the official YouTube IFrame API or `react-native-youtube-iframe` — this respects creator settings and content policies.
3. Do not download or cache YouTube/Vimeo videos locally — this violates their ToS.
4. If your app is a video platform, implement DMCA takedown procedures (see User-Uploaded Content below).
5. Screen recordings of competitor apps or other apps on the store are not permitted in your app or store listing.
6. If using video tutorials, ensure all visible third-party content is properly licensed or falls under fair use (narrow — do not assume).

### Example Rejection
> Guideline 5.2 — Legal — Intellectual Property: Your app streams video content that appears to be copyrighted material distributed without authorization. Please provide proof of licensing or remove the content.

---

## Font Licensing Violations
**Apple**: 5.2 — Intellectual Property | **Google**: IP policy | **Severity**: REJECTION

Bundling commercial fonts (Google Fonts are free, but many typefaces like Helvetica Neue, San Francisco outside Apple platforms, Proxima Nova, Gotham require paid licenses) without a proper license that covers mobile app embedding triggers rejection.

### Detect
```bash
# Find all font files in the project
find . -type f \( -name "*.ttf" -o -name "*.otf" -o -name "*.woff" -o -name "*.woff2" \) 2>/dev/null

# Check React Native font configuration
grep -rnE "(fontFamily|@font-face|expo-font|react-native-asset)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" --include="*.css" \
  src/ app/ 2>/dev/null

# Check for commercial font names in code
grep -rniE "(proxima.?nova|gotham|futura|avenir|helvetica|arial|times.?new|calibri|gill.?sans|din|circular|SF.?Pro)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check react-native.config.js or package.json for font asset linking
grep -rE "assets.*font" react-native.config.js package.json 2>/dev/null
```

### Fix
1. **Google Fonts**: All free for mobile app embedding — safe to use. Use `expo-font` or link via `react-native.config.js`.
2. **System fonts**: Use platform defaults (`System` on iOS, `Roboto` on Android) — always safe.
3. **Commercial fonts**: Purchase an "App" or "Mobile App" license — "Desktop" and "Web" licenses do NOT cover mobile app embedding.
4. Keep font license files in your repo (`assets/fonts/LICENSE-[FontName].txt`).
5. When using `expo-google-fonts`, these are all safe — the Expo package handles Google Fonts which are OFL/Apache-2 licensed.
6. Do not extract fonts from other apps or websites — even if the font looks free.
7. Apple's San Francisco font may only be used in Apple platform apps (iOS, macOS, watchOS, tvOS) — do not bundle it in Android builds.

### Example Rejection
> Guideline 5.2 — Legal — Intellectual Property: Your app includes the font "Proxima Nova" which requires a commercial license for mobile app distribution. Please provide proof of licensing or replace the font.

---

## User-Uploaded Copyrighted Content (DMCA / Notice-and-Takedown)
**Apple**: 5.2 + 1.2 | **Google**: IP policy + UGC policy | **Severity**: REJECTION / REMOVAL

If your app allows users to upload or share content (photos, videos, music, documents), you must have a process to handle copyright infringement claims. Both Apple and Google require DMCA compliance for apps hosting user content.

### Detect
```bash
# Check for file upload functionality
grep -rnE "(upload|ImagePicker|DocumentPicker|launchImageLibrary|launchCamera|expo-image-picker|expo-document-picker)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for content sharing features
grep -rnE "(share|post|publish|upload.*image|upload.*video|upload.*file)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check if DMCA/copyright policy exists
grep -riE "(dmca|copyright.*notice|takedown|intellectual.?property)" \
  --include="*.md" --include="*.txt" --include="*.html" \
  . 2>/dev/null
```

### Fix
1. Create a DMCA / Copyright Policy page accessible from your app and website.
2. Designate a DMCA agent and register with the US Copyright Office (if operating in the US).
3. Implement a content reporting mechanism — users must be able to flag copyrighted content.
4. Respond to takedown notices within 24-48 hours.
5. Implement a repeat infringer policy (three strikes).
6. For music apps: do not allow users to upload copyrighted songs. Implement audio fingerprinting or manual review.
7. For image/video platforms: implement automated content matching if at scale, or manual review for smaller apps.
8. Include copyright policy link in your Terms of Service.

### Example Rejection
> Guideline 5.2 — Legal — Intellectual Property: Your app allows users to share content but does not include a mechanism for reporting copyright violations or a copyright policy.

---

## Open Source License Violations
**Apple**: 5.2 — Intellectual Property | **Google**: IP policy | **Severity**: REJECTION (rare) / LEGAL RISK

Using open source libraries without complying with their license terms can trigger rejection (rare from Apple/Google) but more commonly leads to legal action from license holders. GPL-licensed code in App Store apps is a known conflict area.

### Detect
```bash
# Check for GPL-licensed dependencies
grep -rnE "GPL|AGPL|LGPL|SSPL" node_modules/*/LICENSE* node_modules/*/package.json 2>/dev/null | head -30

# List all dependency licenses
npx license-checker --summary 2>/dev/null

# Check for MIT/Apache/BSD (safe) vs GPL (problematic)
npx license-checker --production --failOn "GPL-2.0;GPL-3.0;AGPL-3.0" 2>/dev/null

# Check native dependencies
find ios/Pods -name "LICENSE*" -exec grep -l "GPL" {} \; 2>/dev/null
```

### Fix
1. **MIT, Apache 2.0, BSD, ISC**: Safe for App Store / Play Store. Include attribution in an "Acknowledgements" or "Licenses" screen if required by the license.
2. **GPL-2.0, GPL-3.0**: Problematic for App Store. Apple's DRM is considered incompatible with GPLv2/v3 by many legal interpretations. Replace GPL dependencies with permissively-licensed alternatives.
3. **LGPL**: Generally safe if you dynamically link (which React Native does via node_modules). Keep the LGPL library as a separate module.
4. **AGPL**: Avoid entirely in mobile apps — requires source code disclosure for network use.
5. Add a "Licenses" or "Open Source" screen in your app Settings showing all third-party library attributions:
   ```bash
   # Generate license list
   npx react-native-oss-license --json > licenses.json
   ```
6. Use `react-native-oss-license` or manually maintain a third-party notices file.
7. Run `npx license-checker --production` before every release to catch new problematic licenses.

### Example Rejection
> Your app includes code licensed under GPL-3.0 which may conflict with App Store distribution terms. Please ensure all included code is properly licensed for distribution through the App Store.

---

## AI-Generated Content IP Issues
**Apple**: 5.2 + 4.1 | **Google**: AI-generated content policy | **Severity**: REJECTION

AI-generated images, text, or media in your app or store listing may raise IP concerns if the output resembles copyrighted works. Both stores increasingly scrutinize AI-generated content.

### Detect
```bash
# Check for AI image generation SDKs
grep -rnE "(openai|dall-e|stable.?diffusion|midjourney|replicate|hugging.?face|stability.?ai)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" --include="*.json" \
  src/ app/ package.json 2>/dev/null

# Check for AI-generated asset indicators in filenames
find assets/ -iname "*generated*" -o -iname "*ai_*" -o -iname "*dalle*" -o -iname "*midjourney*" 2>/dev/null
```

### Fix
1. Do not use AI-generated images that depict real people (deepfakes) — instant rejection on both stores.
2. AI-generated app icons are generally fine if they don't resemble existing copyrighted characters or trademarks.
3. If your app generates AI content for users, add a disclaimer: "Content is AI-generated and may not be accurate."
4. Do not claim AI-generated content is human-created in your store listing.
5. If AI generates realistic images of people, add visible watermarks or metadata indicating AI generation (Google requires "provenance signals" for realistic AI media).
6. For app preview videos: AI-generated footage is acceptable if it doesn't depict copyrighted content or real people without consent.
7. Store screenshots must show actual app functionality — do not use AI-generated mockups as screenshots.

### Example Rejection
> Guideline 5.2 — Legal: Your app generates realistic images of identifiable individuals without their consent. AI-generated content depicting real people requires explicit permission from the individuals shown.
