# VPN / Networking Compliance

## Apple

- [ ] Must use NEVPNManager API — no custom VPN protocol implementations outside the Network Extension framework (Guideline 5.4)
- [ ] Organization enrollment required — individual accounts cannot distribute VPN apps (Guideline 5.4)
- [ ] Must not collect or log user activity data through the VPN connection (Guideline 5.4)
- [ ] Cannot use VPN capability to block ads or modify ad behavior (Guideline 5.4)
- [ ] Cannot redirect user traffic for monetization purposes (Guideline 5.4)
- [ ] Cannot sell, share, or monetize user data collected through VPN (Guideline 5.4)
- [ ] Clear statement of what data is collected must be shown before VPN access is granted (Guideline 5.4)
- [ ] Privacy policy required in-app and on App Store listing (Guideline 5.1.1)

## Google Play

- [ ] VPN apps must not manipulate ads or interfere with ad delivery (VPN Policy)
- [ ] Must not redirect or manipulate user traffic for monetization (VPN Policy)
- [ ] Must comply with local VPN regulations in served jurisdictions (VPN Policy)
- [ ] All data collection must be disclosed in Data Safety section (Data Safety Policy)
- [ ] Privacy policy required and linked in store listing (Privacy Policy Requirement)

## React Native Notes

- NEVPNManager requires a native module — no pure JS VPN implementation exists for iOS
- `react-native-vpn-manager` wraps NEVPNManager for IKEv2/IPSec protocols
- For OpenVPN: use `react-native-openvpn` or build a custom native module wrapping `NetworkExtension`
- Network Extension entitlement must be added in Xcode and provisioning profile — this requires organization account
- VPN on-demand rules must be configured in the native layer — cannot be set from JS
- Android: use `VpnService` API — requires `android.permission.BIND_VPN_SERVICE` in `AndroidManifest.xml`
- Apple review for VPN apps is stricter and slower — expect 2-4 week review times; provide detailed review notes explaining VPN purpose
- Content blocker VPN apps (DNS-level ad blocking) will be rejected by Apple — do not submit
- Organization account ($99/yr Apple) requires D-U-N-S number — plan 2-4 weeks for enrollment before submission

## Related Rules

- [rules/organization-account.md](../rules/organization-account.md)
- [rules/privacy-policy.md](../rules/privacy-policy.md)
- [rules/data-collection.md](../rules/data-collection.md)
