---
name: asc-subscription-localize
description: >
  Bulk-localize subscription and in-app purchase display names and descriptions
  across all App Store locales. Trigger on: subscription localization, IAP display name,
  in-app purchase translation, subscription group localization, product localization,
  localize purchases, RevenueCat sync.
license: MIT
metadata:
  author: JohnAdib
  version: "1.0.0"
  tags: [app-store-connect, asc, subscriptions, iap, localization, revenuecat]
---

# Subscription & IAP Localization

Bulk-localize subscription and in-app purchase display names across 37 App Store locales.

## Supported Locales (37)

```
ar-SA, ca, cs, da, de-DE, el, en-AU, en-CA, en-GB, en-US,
es-ES, es-MX, fi, fr-CA, fr-FR, he, hi, hr, hu, id,
it, ja, ko, ms, nb, nl-NL, pl, pt-BR, pt-PT, ro,
ru, sk, sv, th, tr, uk, vi, zh-Hans, zh-Hant
```

## Workflow

### 1. Resolve IDs

```bash
# List subscriptions
asc iap subscriptions list --bundle-id com.example.app --json

# List subscription groups
asc iap subscription-groups list --bundle-id com.example.app --json

# List non-subscription IAPs
asc iap list --bundle-id com.example.app --json
```

### 2. Check Existing Localizations

```bash
# Subscription localizations
asc iap subscriptions localizations list --subscription-id SUB_ID --json

# Subscription group localizations
asc iap subscription-groups localizations list --group-id GROUP_ID --json
```

### 3. Create Missing Localizations

```bash
# For a subscription
asc iap subscriptions localizations create \
  --subscription-id SUB_ID \
  --locale de-DE \
  --name "Premium Monatlich" \
  --description "Alle Premium-Funktionen, monatlich abgerechnet"

# For a subscription group
asc iap subscription-groups localizations create \
  --group-id GROUP_ID \
  --locale de-DE \
  --name "Premium" \
  --custom-intro "Wählen Sie Ihren Plan"
```

### 4. Bulk Create for All Locales

```bash
SUB_ID="your-subscription-id"

# Check which locales already exist
EXISTING=$(asc iap subscriptions localizations list --subscription-id $SUB_ID --json | \
  jq -r '.[].locale')

ALL_LOCALES="ar-SA ca cs da de-DE el en-AU en-CA en-GB es-ES es-MX fi fr-CA fr-FR he hi hr hu id it ja ko ms nb nl-NL pl pt-BR pt-PT ro ru sk sv th tr uk vi zh-Hans zh-Hant"

for LOCALE in $ALL_LOCALES; do
  if echo "$EXISTING" | grep -q "^$LOCALE$"; then
    echo "⏭️  $LOCALE already exists"
  else
    # Translate name and description for this locale
    NAME=$(translate "Monthly Premium" --to $LOCALE)
    DESC=$(translate "All premium features, billed monthly" --to $LOCALE)

    asc iap subscriptions localizations create \
      --subscription-id $SUB_ID \
      --locale $LOCALE \
      --name "$NAME" \
      --description "$DESC"
    echo "✅ Created $LOCALE"
  fi
done
```

### 5. Verify
```bash
asc iap subscriptions localizations list --subscription-id $SUB_ID --json | \
  jq '[.[].locale] | sort'
```

## Display Name Best Practices

| Do | Don't |
|----|-------|
| Match what user sees in app | Use technical product IDs |
| Include billing period | Leave period ambiguous |
| Use localized currency terms | Use USD-specific language |
| Keep under 30 chars | Write paragraphs |

Examples:
- "Premium Monthly" / "Premium Monatlich" / "プレミアム（月額）"
- "Pro Annual" / "Pro Annuel" / "Pro 年額"

## Subscription Group Names

Group name appears in the subscription management sheet. Localize it:

```bash
asc iap subscription-groups localizations create \
  --group-id GROUP_ID \
  --locale ja \
  --name "プレミアムプラン" \
  --custom-intro "プランをお選びください"
```

## Non-Subscription IAP Localization

Same pattern for consumables and non-consumables:

```bash
asc iap localizations create \
  --iap-id IAP_ID \
  --locale de-DE \
  --name "100 Münzen" \
  --description "Paket mit 100 Spielmünzen"
```

## RevenueCat Catalog Sync

If using RevenueCat alongside App Store Connect, keep catalogs aligned.

### Audit mode (read-only)
Compare ASC products with RevenueCat offerings:

```bash
# Export ASC subscriptions
asc iap subscriptions list --bundle-id com.example.app --json > asc-subs.json

# Compare with RevenueCat dashboard products
# Look for: missing products, mismatched IDs, price discrepancies
```

### Reconciliation checklist
1. Every ASC subscription/IAP has a matching RevenueCat product
2. Product identifiers match exactly
3. Subscription group structure is mirrored in RevenueCat offerings
4. Introductory offers are configured in both systems

### Safety rules
- Always audit first, never blind-write
- Never delete products (only create missing ones)
- Confirm with user before any writes
- RevenueCat product IDs must match ASC product IDs exactly

For detailed RevenueCat integration patterns, see `references/revenuecat.md`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Locale already exists | Check existing first. Use update instead of create. |
| Invalid locale code | Use exact Apple codes (e.g., `zh-Hans` not `zh-CN`). |
| Name too long | Subscription display names: 30 chars max. |
| Group name not showing | Localization must match user's device locale. |

## Related Skills
- `asc-metadata-sync` — app-level metadata localization
- `asc-pricing` — territory-specific pricing
- `asc-aso-audit` — keyword optimization for IAP names
