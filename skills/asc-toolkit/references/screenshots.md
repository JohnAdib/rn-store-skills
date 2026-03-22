# Screenshot Pipeline

Automate screenshot capture, framing, and upload for both stores.

## Required Screenshot Sizes

### Apple App Store
| Device | Resolution | Required |
|--------|-----------|----------|
| iPhone 6.7" (15 Pro Max) | 1290x2796 | Yes |
| iPhone 6.5" (14 Plus) | 1284x2778 | Yes (or 6.7") |
| iPhone 5.5" (8 Plus) | 1242x2208 | Optional (legacy) |
| iPad Pro 12.9" (6th gen) | 2048x2732 | If universal app |
| iPad Pro 13" (M4) | 2064x2752 | If iPad app |

- Min 1, max 10 screenshots per device per locale
- Supported formats: PNG, JPEG
- No alpha channel for JPEG

### Google Play
| Device type | Resolution | Required |
|------------|-----------|----------|
| Phone | 1080x1920 to 1440x2560 | Yes (2-8) |
| 7" tablet | 1200x1920 | If tablet app |
| 10" tablet | 1800x2560 | If tablet app |

- Min 2, max 8 screenshots per device type per locale
- Supported formats: PNG, JPEG (24-bit, no alpha)
- Max 8MB per image

## Capture Methods

### Method 1: Xcode Simulator + simctl

```bash
# Boot simulator
xcrun simctl boot "iPhone 15 Pro Max"

# Take screenshot
xcrun simctl io booted screenshot screenshot.png

# With status bar override (clean)
xcrun simctl status_bar booted override \
  --time "9:41" \
  --batteryState charged \
  --batteryLevel 100 \
  --cellularMode active \
  --cellularBars 4

xcrun simctl io booted screenshot --type png screenshot_clean.png
```

### Method 2: XCTest UI Tests

```swift
// ScreenshotTests.swift
import XCTest

class ScreenshotTests: XCTestCase {
    let app = XCUIApplication()

    override func setUp() {
        continueAfterFailure = false
        app.launch()
    }

    func testHomeScreen() {
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    func testDetailScreen() {
        app.buttons["itemCell"].firstMatch.tap()
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.lifetime = .keepAlways
        add(attachment)
    }
}
```

Run for multiple devices:
```bash
for DEVICE in "iPhone 15 Pro Max" "iPad Pro (12.9-inch) (6th generation)"; do
  xcodebuild test \
    -workspace MyApp.xcworkspace \
    -scheme MyApp \
    -destination "platform=iOS Simulator,name=$DEVICE" \
    -testPlan Screenshots \
    -resultBundlePath "results/$DEVICE"
done
```

### Method 3: Fastlane Snapshot

```ruby
# Snapfile
devices([
  "iPhone 15 Pro Max",
  "iPhone 14 Plus",
  "iPad Pro (12.9-inch) (6th generation)"
])

languages(["en-US", "de-DE", "ja", "fr-FR"])
scheme("MyApp")
output_directory("./screenshots")
clear_previous_screenshots(true)
```

```bash
fastlane snapshot
```

### Method 4: Detox (React Native)

```js
// e2e/screenshots.test.js
describe('Screenshots', () => {
  it('home screen', async () => {
    await device.takeScreenshot('01_home');
  });

  it('detail screen', async () => {
    await element(by.id('itemCell')).tap();
    await device.takeScreenshot('02_detail');
  });
});
```

## Framing

Add device frames and captions to raw screenshots.

### Fastlane Frameit
```bash
fastlane frameit silver  # or black, gold
```

Configure `Framefile.json`:
```json
{
  "default": {
    "title": { "font": "./fonts/SF-Pro.otf", "color": "#000000" },
    "background": "#FFFFFF",
    "padding": 50
  }
}
```

### Manual with ImageMagick
```bash
# Add caption above screenshot
convert screenshot.png \
  -gravity North \
  -font Helvetica-Bold \
  -pointsize 72 \
  -annotate +0+50 "Your Amazing Feature" \
  framed_screenshot.png
```

## Upload to App Store Connect

```bash
# Upload all screenshots for a locale
for FILE in screenshots/en-US/*.png; do
  asc appstore screenshots upload \
    --version-id VERSION_ID \
    --device-type IPHONE_67 \
    --locale en-US \
    --file "$FILE"
done
```

### Device type identifiers
| Device | ASC identifier |
|--------|---------------|
| iPhone 6.7" | `IPHONE_67` |
| iPhone 6.5" | `IPHONE_65` |
| iPhone 5.5" | `IPHONE_55` |
| iPad Pro 12.9" | `IPAD_PRO_129` |
| iPad Pro 13" | `IPAD_PRO_13` |

## Multi-Locale Pipeline

```bash
LOCALES="en-US de-DE ja fr-FR"
DEVICES="iPhone 15 Pro Max"

for LOCALE in $LOCALES; do
  for DEVICE in $DEVICES; do
    # 1. Set simulator locale
    xcrun simctl spawn booted defaults write -g AppleLanguages -array "$LOCALE"

    # 2. Capture screenshots
    xcodebuild test -scheme Screenshots -destination "name=$DEVICE"

    # 3. Frame
    fastlane frameit

    # 4. Upload
    asc appstore screenshots upload \
      --version-id VERSION_ID \
      --locale $LOCALE \
      --device-type IPHONE_67 \
      --file "screenshots/$LOCALE/*.png"
  done
done
```

## Google Play Screenshot Upload

Via Fastlane Supply:
```ruby
lane :upload_screenshots do
  supply(
    skip_upload_apk: true,
    skip_upload_metadata: true,
    images_path: "./screenshots/android"
  )
end
```

Directory structure:
```
screenshots/android/
  en-US/
    phoneScreenshots/
    sevenInchScreenshots/
    tenInchScreenshots/
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Wrong resolution | Check device pixel resolution, not point resolution. |
| Alpha channel error | Save as JPEG or flatten PNG to remove alpha. |
| Upload order wrong | Screenshots display in upload order. Delete and re-upload in correct order. |
| Status bar cluttered | Use `simctl status_bar override` for clean status bar. |

## Related Skills
- `asc-submission-health` — verify screenshot completeness
- `asc-metadata-sync` — manage screenshot captions
- `asc-aso-audit` — screenshot optimization strategy
