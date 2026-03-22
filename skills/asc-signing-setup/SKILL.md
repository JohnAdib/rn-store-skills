---
name: asc-signing-setup
description: >
  Set up and manage iOS/macOS code signing — bundle IDs, capabilities, certificates,
  and provisioning profiles via asc CLI. Trigger on: code signing, certificate,
  provisioning profile, bundle ID, capability, entitlement, signing identity,
  Fastlane match, EAS credentials, certificate rotation, expired certificate.
license: MIT
metadata:
  author: JohnAdib
  version: "1.0.0"
  tags: [app-store-connect, asc, signing, certificates, profiles, capabilities]
---

# Code Signing Setup

Manage bundle IDs, capabilities, certificates, and provisioning profiles.

## Bundle IDs

### Create
```bash
asc bundle-ids create --name "My App" --identifier com.example.app --platform ios
```

### List
```bash
asc bundle-ids list
asc bundle-ids list --json  # for scripting
```

### Find by identifier
```bash
asc bundle-ids list --filter-identifier com.example.app
```

## Capabilities

### List capabilities for a bundle ID
```bash
asc bundle-ids capabilities BUNDLE_ID
```

### Enable a capability
```bash
asc bundle-ids capabilities enable BUNDLE_ID --capability PUSH_NOTIFICATIONS
asc bundle-ids capabilities enable BUNDLE_ID --capability SIGN_IN_WITH_APPLE
asc bundle-ids capabilities enable BUNDLE_ID --capability IN_APP_PURCHASE
```

### Common capabilities
| Capability key | Description |
|---------------|-------------|
| `PUSH_NOTIFICATIONS` | APNs push |
| `SIGN_IN_WITH_APPLE` | Sign in with Apple |
| `IN_APP_PURCHASE` | IAP / subscriptions |
| `ASSOCIATED_DOMAINS` | Universal links, webcredentials |
| `APP_GROUPS` | Shared container between extensions |
| `HEALTHKIT` | HealthKit access |
| `MAPS` | MapKit |
| `SIRIKIT` | Siri intents |
| `ACCESS_WIFI_INFORMATION` | Wi-Fi info (requires justification) |
| `NETWORK_EXTENSIONS` | VPN, content filter |

## Certificates

### Generate a CSR (Certificate Signing Request)
```bash
# Generate private key + CSR
openssl req -new -newkey rsa:2048 -nodes \
  -keyout signing.key -out signing.csr \
  -subj "/emailAddress=you@example.com/CN=Your Name/C=US"
```

### Create a certificate
```bash
# Distribution certificate (App Store + Ad Hoc)
asc certificates create --type IOS_DISTRIBUTION --csr signing.csr

# Development certificate
asc certificates create --type IOS_DEVELOPMENT --csr signing.csr

# Developer ID (macOS distribution outside App Store)
asc certificates create --type DEVELOPER_ID_APPLICATION --csr signing.csr
```

### List certificates
```bash
asc certificates list
asc certificates list --json
```

### Download a certificate
```bash
asc certificates download CERT_ID --output cert.cer
```

### Install to keychain
```bash
security import signing.key -k ~/Library/Keychains/login.keychain-db
security import cert.cer -k ~/Library/Keychains/login.keychain-db
```

### Certificate types
| Type | Use |
|------|-----|
| `IOS_DEVELOPMENT` | Development builds |
| `IOS_DISTRIBUTION` | App Store + Ad Hoc |
| `MAC_APP_DISTRIBUTION` | Mac App Store |
| `MAC_INSTALLER_DISTRIBUTION` | Mac App Store (PKG signing) |
| `DEVELOPER_ID_APPLICATION` | macOS outside App Store |
| `DEVELOPER_ID_INSTALLER` | macOS PKG outside App Store |

## Provisioning Profiles

### Create
```bash
# App Store distribution profile
asc profiles create \
  --name "My App Store Profile" \
  --type IOS_APP_STORE \
  --bundle-id BUNDLE_ID \
  --certificate-id CERT_ID

# Development profile
asc profiles create \
  --name "My Dev Profile" \
  --type IOS_APP_DEVELOPMENT \
  --bundle-id BUNDLE_ID \
  --certificate-id CERT_ID \
  --device-ids DEVICE_1,DEVICE_2
```

### List
```bash
asc profiles list
asc profiles list --filter-profile-type IOS_APP_STORE
```

### Download
```bash
asc profiles download PROFILE_ID --output profile.mobileprovision
```

### Install
```bash
cp profile.mobileprovision ~/Library/MobileDevice/Provisioning\ Profiles/
```

### Profile types
| Type | Use |
|------|-----|
| `IOS_APP_DEVELOPMENT` | Dev builds on registered devices |
| `IOS_APP_STORE` | App Store distribution |
| `IOS_APP_ADHOC` | Ad Hoc distribution |
| `MAC_APP_STORE` | Mac App Store |
| `MAC_APP_DEVELOPMENT` | macOS development |
| `MAC_DIRECT` | Developer ID distribution |

## Certificate Rotation

When a certificate expires (annual):
1. Generate new CSR
2. Create new certificate
3. Create new provisioning profiles referencing new cert
4. Update CI/CD secrets
5. Old certificate continues working until expiry

```bash
# Check expiry dates
asc certificates list --json | jq '.[] | {name, expirationDate}'
```

## EAS Credentials Alternative

For Expo/React Native, EAS manages signing automatically:

```bash
# Setup credentials interactively
eas credentials

# Build with managed signing
eas build --platform ios --profile production
```

EAS stores certs and profiles in Expo's cloud. No manual management needed.

## Fastlane Match Alternative

```ruby
# Matchfile
git_url("https://github.com/your-org/certificates")
type("appstore")
app_identifier("com.example.app")
```

```bash
# Sync certificates
fastlane match appstore
fastlane match development
```

Match stores certs/profiles in a git repo or Google Cloud Storage.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `No signing certificate found` | Run `security find-identity -v -p codesigning` to check installed certs. |
| Certificate count limit reached | Revoke unused certs first. Apple limits to 3 distribution certs. |
| Profile doesn't include device | Regenerate profile with device added, or use `asc devices register`. |
| `Provisioning profile doesn't match` | Bundle ID in profile must match app's bundle identifier exactly. |
| Expired certificate | Generate new CSR, create new cert, regenerate profiles. |

## Related Skills
- `asc-xcode-build` — use signing for builds
- `asc-notarization` — Developer ID for macOS
- `rn-store-compliance` — entitlements compliance checks
