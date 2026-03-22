# Xcode Build & Archive

Build, archive, and export iOS/macOS apps for App Store Connect upload.

## iOS Workflow

### 1. Archive

```bash
xcodebuild archive \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -archivePath build/MyApp.xcarchive \
  -destination "generic/platform=iOS" \
  DEVELOPMENT_TEAM=XXXXXXXXXX
```

For Expo/React Native projects using `.xcodeproj`:
```bash
xcodebuild archive \
  -project ios/MyApp.xcodeproj \
  -scheme MyApp \
  -archivePath build/MyApp.xcarchive \
  -destination "generic/platform=iOS"
```

### 2. Export IPA

Create `ExportOptions.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>app-store-connect</string>
  <key>destination</key>
  <string>upload</string>
  <key>signingStyle</key>
  <string>automatic</string>
  <key>teamID</key>
  <string>XXXXXXXXXX</string>
</dict>
</plist>
```

Export:
```bash
xcodebuild -exportArchive \
  -archivePath build/MyApp.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/export
```

### 3. Upload

```bash
asc builds upload --file build/export/MyApp.ipa
```

Or via `xcrun`:
```bash
xcrun altool --upload-app -f build/export/MyApp.ipa \
  -t ios --apiKey KEY_ID --apiIssuer ISSUER_ID
```

## macOS Workflow

### Archive
```bash
xcodebuild archive \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -archivePath build/MyApp.xcarchive \
  -destination "generic/platform=macOS"
```

### Export PKG
ExportOptions.plist for macOS App Store:
```xml
<dict>
  <key>method</key>
  <string>app-store-connect</string>
  <key>destination</key>
  <string>upload</string>
  <key>installerSigningCertificate</key>
  <string>3rd Party Mac Developer Installer</string>
</dict>
```

macOS requires `.pkg` (not `.app`). ICNS icon format required (not PNG).

### Upload
```bash
asc builds upload --file build/export/MyApp.pkg --platform macos
```

## EAS Build Alternative

For React Native / Expo projects, EAS Build handles everything:

```bash
# iOS production build
eas build --platform ios --profile production

# Submit to App Store Connect
eas submit --platform ios
```

`eas.json` profile:
```json
{
  "build": {
    "production": {
      "ios": {
        "buildConfiguration": "Release",
        "image": "latest"
      }
    }
  }
}
```

## Fastlane Alternative

```ruby
# Fastfile
lane :build_ios do
  gym(
    scheme: "MyApp",
    export_method: "app-store",
    output_directory: "build",
    output_name: "MyApp.ipa"
  )
  upload_to_app_store(skip_metadata: true, skip_screenshots: true)
end
```

## Build Number Requirements

Build numbers must be unique per version per platform. Increment on every upload.

```bash
# Check latest build number
asc builds latest --bundle-id com.example.app --json | jq '.buildNumber'

# Expo: auto-increment
eas build --auto-submit --platform ios
```

For manual increment in Xcode:
```bash
agvtool next-version -all
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `No signing certificate` | Check `security find-identity -v -p codesigning`. Install cert from Apple Developer portal. |
| `Provisioning profile doesn't match` | Use automatic signing or regenerate profile. See `asc-signing-setup`. |
| `ITMS-90XXX upload error` | Usually icon/asset issues. Check `asc builds upload` error output. |
| `Build number already used` | Increment `CFBundleVersion`. Each upload needs unique build number. |
| `Missing compliance info` | Add `ITSAppUsesNonExemptEncryption` to Info.plist. |
| `Hermes bytecode missing` | Ensure `hermes_enabled => true` in Podfile for release builds. |
| `JS bundle not found` | Run `npx react-native bundle` before archiving, or verify build phase scripts. |

## Platform Notes

| Platform | Archive format | Upload format | Method |
|----------|---------------|---------------|--------|
| iOS | .xcarchive | .ipa | `app-store-connect` |
| macOS | .xcarchive | .pkg | `app-store-connect` |
| tvOS | .xcarchive | .ipa | `app-store-connect` |
| visionOS | .xcarchive | .ipa | `app-store-connect` |

## Related Skills
- `asc-signing-setup` — certificates, profiles, bundle IDs
- `asc-build-lifecycle` — track build processing and cleanup
- `asc-release-flow` — distribute after upload
