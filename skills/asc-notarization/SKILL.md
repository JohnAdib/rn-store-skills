---
name: asc-notarization
description: >
  Archive, export, and notarize macOS apps for distribution outside the App Store
  using Developer ID signing. Trigger on: notarization, notarize, Developer ID,
  staple, macOS distribution, DMG, PKG notarize, xcrun notarytool, Gatekeeper.
license: MIT
metadata:
  author: JohnAdib
  version: "1.0.0"
  tags: [app-store-connect, asc, macos, notarization, developer-id]
---

# macOS Notarization

Notarize macOS apps for distribution outside the Mac App Store via Developer ID.

## Prerequisites
- Developer ID Application certificate (for code signing)
- Developer ID Installer certificate (for PKG signing)
- App Store Connect API key or Apple ID credentials
- Xcode 13+ (for `notarytool`)

## Workflow: Archive → Export → Notarize → Staple

### 1. Archive
```bash
xcodebuild archive \
  -workspace MyApp.xcworkspace \
  -scheme MyApp \
  -archivePath build/MyApp.xcarchive \
  -destination "generic/platform=macOS"
```

### 2. Export with Developer ID
Create `ExportOptions.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>developer-id</string>
  <key>signingCertificate</key>
  <string>Developer ID Application</string>
  <key>teamID</key>
  <string>XXXXXXXXXX</string>
</dict>
</plist>
```

```bash
xcodebuild -exportArchive \
  -archivePath build/MyApp.xcarchive \
  -exportOptionsPlist ExportOptions.plist \
  -exportPath build/export
```

### 3. Package for Distribution

**ZIP** (simplest):
```bash
ditto -c -k --keepParent "build/export/MyApp.app" "build/MyApp.zip"
```

**DMG**:
```bash
hdiutil create -volname "MyApp" -srcfolder "build/export/MyApp.app" \
  -ov -format UDZO "build/MyApp.dmg"
codesign --sign "Developer ID Application: Your Name (TEAM_ID)" "build/MyApp.dmg"
```

**PKG** (installer):
```bash
productbuild --component "build/export/MyApp.app" /Applications \
  --sign "Developer ID Installer: Your Name (TEAM_ID)" "build/MyApp.pkg"
```

### 4. Submit for Notarization

Using `notarytool` (recommended, Xcode 13+):
```bash
xcrun notarytool submit build/MyApp.zip \
  --key AuthKey_XXXXXXXX.p8 \
  --key-id KEY_ID \
  --issuer ISSUER_ID \
  --wait
```

Using `asc` CLI:
```bash
asc notarization submit --file build/MyApp.zip
```

Using Apple ID:
```bash
xcrun notarytool submit build/MyApp.zip \
  --apple-id "you@example.com" \
  --team-id TEAM_ID \
  --password "@keychain:AC_PASSWORD" \
  --wait
```

### 5. Check Status
```bash
xcrun notarytool info SUBMISSION_ID \
  --key AuthKey_XXXXXXXX.p8 --key-id KEY_ID --issuer ISSUER_ID
```

### 6. View Log (on failure)
```bash
xcrun notarytool log SUBMISSION_ID \
  --key AuthKey_XXXXXXXX.p8 --key-id KEY_ID --issuer ISSUER_ID
```

### 7. Staple the Ticket
```bash
xcrun stapler staple "build/export/MyApp.app"
# or for DMG/PKG:
xcrun stapler staple "build/MyApp.dmg"
xcrun stapler staple "build/MyApp.pkg"
```

Stapling embeds the notarization ticket so users can install offline without Gatekeeper calling Apple.

## Electron App Notarization

For Electron apps, use `@electron/notarize`:
```js
const { notarize } = require('@electron/notarize');

await notarize({
  appPath: 'path/to/MyApp.app',
  appleApiKey: '~/.appstoreconnect/private_keys/AuthKey_XXXX.p8',
  appleApiKeyId: 'KEY_ID',
  appleApiIssuer: 'ISSUER_ID',
});
```

Or via `electron-builder` config:
```json
{
  "mac": {
    "notarize": true,
    "identity": "Developer ID Application: Your Name (TEAM_ID)"
  }
}
```

## Hardened Runtime

Required for notarization. Enable in Xcode or via entitlements:
```xml
<key>com.apple.security.cs.allow-jit</key>
<true/>
<key>com.apple.security.cs.allow-unsigned-executable-memory</key>
<true/>
```

Common entitlements for Electron/Node apps:
- `com.apple.security.cs.allow-jit` — JIT compilation
- `com.apple.security.cs.disable-library-validation` — loading unsigned frameworks
- `com.apple.security.device.audio-input` — microphone access

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `The signature of the binary is invalid` | Ensure hardened runtime is enabled. Re-sign with `--options runtime`. |
| `The binary uses an SDK older than 10.9` | Rebuild targeting macOS 10.9+. |
| `The executable does not have the hardened runtime enabled` | Add `--options runtime` to `codesign` command. |
| Notarization times out | Processing can take 5-15 minutes. Use `--wait` flag. |
| Staple fails | App must be notarized first. Check notarization status. |
| `spctl --assess` rejects | Run `spctl --assess --verbose build/export/MyApp.app` for details. |

## Verify Notarization
```bash
# Check if app is properly notarized
spctl --assess --verbose "build/export/MyApp.app"

# Check staple
xcrun stapler validate "build/export/MyApp.app"
```

## Related Skills
- `asc-signing-setup` — certificates and provisioning
- `asc-xcode-build` — build and archive
