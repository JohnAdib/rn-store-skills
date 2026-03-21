# Performance Rules

## Crash Rate Threshold Exceeded
**Apple**: 2.1 — App Completeness | **Google**: Android Vitals thresholds | **Severity**: REJECTION

Apple rejects apps that crash during review — a single crash during the review session can trigger rejection. Google monitors post-launch: user-perceived crash rate must stay below 1.09%, ANR (Application Not Responding) rate below 0.47%. Exceeding these thresholds triggers warnings, reduced visibility, and potential removal.

**Common React Native crash sources**:
- Hermes engine edge-case bugs in release builds
- Native module null pointer exceptions (accessing `.bridge` after teardown)
- OOM on low-end Android devices (2GB RAM, many background apps)
- Race conditions during cold start (JS bundle not loaded when native module calls arrive)
- Unhandled promise rejections (treated as crashes in some configurations)

**Common ANR sources (Android)**:
- Synchronous native bridge calls blocking the main thread
- Large JSON parsing on the UI thread (`JSON.parse` of multi-MB payloads)
- SQLite/Realm DB operations on the main thread
- Synchronous `AsyncStorage.getItem` calls during initialization

### Detect
```bash
# Check if error boundary is implemented
grep -rnE "(ErrorBoundary|componentDidCatch|getDerivedStateFromError|error.?boundary)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for unhandled promise rejection handler
grep -rnE "(setGlobalHandler|onUnhandledRejection|RejectionTracking)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for crash reporting SDK
grep -E "(sentry|crashlytics|bugsnag|instabug|@sentry/react-native|@react-native-firebase/crashlytics)" \
  package.json 2>/dev/null

# Check for synchronous heavy operations
grep -rnE "(JSON\.parse|JSON\.stringify)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for main-thread DB operations
grep -rnE "(getItem|setItem|multiGet|SQLite\.openDatabase)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null
```

### Fix
1. Wrap your root component in an `ErrorBoundary` that catches JS exceptions and shows a fallback UI instead of crashing.
2. Install `@sentry/react-native` or `@react-native-firebase/crashlytics` to monitor crash-free rate before submission.
3. Set a global unhandled promise rejection handler:
   ```ts
   // In your app entry point
   global.ErrorUtils?.setGlobalHandler((error, isFatal) => {
     // Log to Sentry/Crashlytics, show fallback UI if fatal
   });
   ```
4. Move large JSON parsing off the main thread (use `InteractionManager.runAfterInteractions` or a worker).
5. Test the RELEASE build on real low-end devices — debug builds hide many crash vectors.
6. Test on the oldest OS version you support. Apple reviewers often test on older devices.
7. For Android ANR: move all DB and file I/O to async operations. Use `requestAnimationFrame` or `InteractionManager` to defer heavy work until after transitions.

### Example Rejection
> Guideline 2.1 — Performance — App Completeness: We discovered one or more bugs in your app during review. Your app crashed on launch on iPad running iOS 17.4.

---

## JavaScript Bundle Missing or Invalid
**Apple**: 2.1 — App Completeness | **Google**: Crash policy | **Severity**: REJECTION

A white screen on launch is an instant rejection. This happens when the JavaScript bundle is not included in the release binary, the bundle contains syntax errors only visible in production mode, or the bundle path is misconfigured.

### Detect
```bash
# Check if iOS JS bundle exists (required for release builds)
ls -la ios/main.jsbundle 2>/dev/null

# Check if Android JS bundle exists
ls -la android/app/src/main/assets/index.android.bundle 2>/dev/null

# Check if Hermes bytecode is being used (look for .hbc files)
find ios/ android/ -name "*.hbc" 2>/dev/null

# Check build configuration for bundle commands
grep -rnE "(react-native bundle|BUNDLE_COMMAND|bundleInRelease)" \
  ios/*.xcodeproj/project.pbxproj android/app/build.gradle 2>/dev/null

# Check app.json / app.config.js for bundle configuration
grep -E "(jsEngine|hermesEnabled)" app.json app.config.js app.config.ts 2>/dev/null

# For Expo: check eas.json build profiles
cat eas.json 2>/dev/null | grep -A10 "production"
```

### Fix
1. For bare React Native, ensure the bundle step runs before archive:
   ```bash
   npx react-native bundle \
     --platform ios \
     --dev false \
     --entry-file index.js \
     --bundle-output ios/main.jsbundle \
     --assets-dest ios
   ```
2. For Android, verify `bundleInRelease` is not set to `false` in `android/app/build.gradle`.
3. For Expo / EAS Build: use `eas build --profile production` which handles bundling automatically. Do not manually manage the bundle.
4. After building, install the release build on a device and verify it launches past the splash screen.
5. If using Hermes, ensure `hermes-engine` is the correct version for your React Native version. Mismatches produce invalid bytecode.
6. Test on a fresh device/simulator with no prior app data to catch bundle-loading issues masked by cached state.

### Example Rejection
> Guideline 2.1 — Performance: Your app displayed a blank white screen on launch and did not load any content. Please resolve this issue and resubmit.

---

## Hermes Engine Release-Only Crashes
**Apple**: 2.1 — App Completeness | **Google**: Crash policy | **Severity**: REJECTION

Hermes (the default JS engine in React Native 0.70+) behaves differently from JavaScriptCore (JSC) in edge cases. Code that works in debug mode (which may use JSC or Hermes debug) can crash in release builds compiled with Hermes bytecode.

**Known Hermes differences**:
- `Intl` API: limited locale support without polyfills (`Intl.DateTimeFormat`, `Intl.NumberFormat`)
- Regex: certain lookbehind patterns and Unicode property escapes unsupported in older Hermes
- `BigInt`: not supported in Hermes (throws at parse time)
- `WeakRef` / `FinalizationRegistry`: limited or missing
- Proxy: partially supported — some traps behave differently
- `eval()`: disabled by default in Hermes

### Detect
```bash
# Check if Hermes is enabled
grep -E "(hermes|hermesEnabled|jsEngine)" \
  app.json app.config.js android/app/build.gradle ios/Podfile 2>/dev/null

# Check for Intl usage (needs polyfill with Hermes)
grep -rnE "(Intl\.|toLocaleString|toLocaleDateString|DateTimeFormat|NumberFormat|Collator)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for BigInt usage (unsupported in Hermes)
grep -rnE "(BigInt|[0-9]+n\b)" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check for eval usage (disabled in Hermes)
grep -rnE "\beval\s*\(" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  src/ app/ 2>/dev/null

# Check if Intl polyfill is installed
grep -E "(intl|@formatjs|intl-pluralrules|intl-numberformat|intl-datetimeformat)" \
  package.json 2>/dev/null
```

### Fix
1. Always test the **release** build, not debug. Debug may use JSC or Hermes debug mode, which differs from production bytecode.
   ```bash
   # iOS release build
   npx react-native run-ios --mode Release
   # Android release build
   npx react-native run-android --variant release
   ```
2. Install Intl polyfills if using `Intl` APIs:
   ```bash
   npm install @formatjs/intl-datetimeformat @formatjs/intl-numberformat @formatjs/intl-pluralrules @formatjs/intl-getcanonicallocales @formatjs/intl-locale
   ```
   Import polyfills at the top of your entry file (before other imports).
3. Replace `BigInt` usage with a library like `big-integer` or `bignumber.js`.
4. Replace `eval()` with alternatives (`JSON.parse`, template functions, etc.).
5. Test regex patterns in Hermes specifically — use the Hermes REPL or a release build to verify.
6. Check third-party libraries for Hermes compatibility before adding them — some libraries use unsupported JS features.

### Example Rejection
> Guideline 2.1 — Performance: Your app crashed when attempting to format a date on the Settings screen. (Underlying cause: Intl.DateTimeFormat not available in Hermes without polyfill.)

---

## Excessive App Size
**Apple**: 2.1 — App Completeness | **Google**: App size policy | **Severity**: WARNING / REJECTION

Apps over 200MB on cellular download trigger Apple warnings. Excessively large apps get rejected or face reduced discoverability. Google Play has a 150MB APK limit (AAB can be larger with dynamic delivery, but base APK matters). Common React Native bloat sources: unused native architectures, uncompressed images, bundled debug assets, fat third-party SDKs.

### Detect
```bash
# Check IPA/AAB size after build
ls -lh *.ipa *.aab 2>/dev/null

# Check for large assets in the project
find src/ app/ assets/ ios/ android/ -type f -size +1M 2>/dev/null | head -20

# Check if Hermes is enabled (reduces bundle size)
grep -E "(hermes|hermesEnabled)" app.json android/app/build.gradle ios/Podfile 2>/dev/null

# Check if ProGuard/R8 is enabled for Android
grep -E "(minifyEnabled|proguard|R8)" android/app/build.gradle 2>/dev/null

# Check for unused architectures in iOS
grep -E "(EXCLUDED_ARCHS|VALID_ARCHS)" ios/*.xcodeproj/project.pbxproj 2>/dev/null

# Check image assets for optimization opportunities
find assets/ src/ -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" 2>/dev/null | head -20

# Check native dependency sizes
du -sh ios/Pods/*/Frameworks/*.framework 2>/dev/null | sort -rh | head -10
du -sh android/app/build/intermediates/merged_native_libs 2>/dev/null
```

### Fix
1. **Enable Hermes** — reduces JS bundle size by 30-50% and improves startup time.
2. **Enable ProGuard/R8** for Android in `android/app/build.gradle`:
   ```gradle
   buildTypes {
     release {
       minifyEnabled true
       shrinkResources true
       proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
     }
   }
   ```
3. **Enable App Thinning** for iOS — set `ENABLE_BITCODE = YES` (Xcode 14 and earlier), ensure asset catalogs are used for images.
4. **Convert images to WebP** — 25-35% smaller than PNG with equivalent quality:
   ```bash
   npx sharp-cli -i assets/image.png -o assets/image.webp --format webp --quality 80
   ```
5. **Remove unused architectures** — strip `x86_64` and `i386` from release builds (simulator-only archs).
6. **Audit native dependencies** — remove unused pods/gradle dependencies. Each SDK adds to binary size.
7. Use `npx react-native-bundle-visualizer` to identify the largest modules in your JS bundle.
8. For Android, use Android App Bundle (AAB) instead of APK — Google generates optimized APKs per device.

### Example Rejection
> Your app's binary size is 287MB, which exceeds the recommended limit. Please reduce app size by removing unnecessary resources and optimizing assets.
