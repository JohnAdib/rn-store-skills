# macOS / Mac App Store

Platform-specific checklist for apps targeting macOS via the Mac App Store.

---

## Apple (Guidelines 2.4.5, 4.2)

- [ ] Appropriately sandboxed
- [ ] Only appropriate macOS APIs for modifying other apps' data
- [ ] Entitlements match actual functionality (Apple asks for justification)
- [ ] Packaged/submitted via Xcode; no third-party installers
- [ ] Self-contained single bundle (no external dependencies)
- [ ] No auto-launch at startup without user consent
- [ ] No spawning background processes after quit
- [ ] No auto-adding Dock/desktop icons
- [ ] No downloading standalone apps/kexts/code
- [ ] No requesting root/setuid privileges
- [ ] No license screens; no license keys; no custom copy protection
- [ ] Updates via Mac App Store only
- [ ] Must run on currently shipping macOS version
- [ ] All localizations in single bundle
- [ ] Public APIs only
- [ ] Privacy policy required
- [ ] IPv6 functional
- [ ] Metadata focused on macOS experience
- [ ] No Apple device images in app icon

## Commonly Flagged macOS Entitlements

| Entitlement | Notes |
|---|---|
| `com.apple.security.network.server` | Justify server functionality in review notes |
| `com.apple.security.network.client` | Standard, usually fine |
| `com.apple.security.files.downloads.read-only` | Justify why Downloads access is needed |
| `com.apple.security.files.user-selected.read-write` | Standard for file pickers |
| `com.apple.security.temporary-exception.*` | Extra scrutiny — provide strong justification or expect rejection |

Every entitlement you request must have a corresponding feature. Apple reviews entitlements against actual app behavior. Unused entitlements get flagged.

## Google Play

Not applicable — macOS apps don't ship on Google Play. If you need a desktop distribution for non-Apple platforms, consider Electron or a web app.

## React Native Notes

**React Native for macOS (`react-native-macos`):**
- Microsoft-maintained fork. Separate from `react-native` core.
- Not all RN libraries support macOS. Audit every dependency.
- Native modules need macOS-specific implementations.

**Mac Catalyst (alternative approach):**
- Build your iOS RN app, enable Mac Catalyst in Xcode.
- Less work than `react-native-macos` but you get an iPad-style app on Mac.
- Some iOS APIs unavailable on Catalyst. Test thoroughly.

**Sandboxing with native modules:**
- Every native module that accesses files, network, or hardware needs corresponding entitlements.
- Native modules using `NSTask`, `Process`, or shell commands will break sandboxing.
- Audit native module source code for filesystem access patterns before submission.

**Common pitfalls:**
- Requesting entitlements you don't actually use — rejection.
- Native modules that spawn background processes — rejection.
- Not testing on actual macOS hardware (simulators miss real sandboxing issues).
- Forgetting that Mac App Store updates must go through the store, not custom update mechanisms.
- Using temporary exception entitlements without strong justification.
