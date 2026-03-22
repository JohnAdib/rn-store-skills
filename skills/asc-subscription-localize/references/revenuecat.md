# RevenueCat Catalog Sync

Keep App Store Connect subscriptions/IAPs aligned with RevenueCat offerings.

## Audit Mode (Read-Only)

Always audit before making changes.

### 1. Export ASC Catalog

```bash
# All subscriptions
asc iap subscriptions list --bundle-id com.example.app --json > asc-subscriptions.json

# All subscription groups
asc iap subscription-groups list --bundle-id com.example.app --json > asc-groups.json

# All non-subscription IAPs
asc iap list --bundle-id com.example.app --json > asc-iaps.json
```

### 2. Export RevenueCat Catalog

Via RevenueCat REST API:
```bash
curl -H "Authorization: Bearer $RC_API_KEY" \
  "https://api.revenuecat.com/v2/projects/$RC_PROJECT_ID/products" \
  > rc-products.json

curl -H "Authorization: Bearer $RC_API_KEY" \
  "https://api.revenuecat.com/v2/projects/$RC_PROJECT_ID/offerings" \
  > rc-offerings.json
```

### 3. Compare

```bash
# ASC product IDs
ASC_IDS=$(jq -r '.[].productId' asc-subscriptions.json | sort)

# RevenueCat product IDs (Apple platform)
RC_IDS=$(jq -r '.items[] | select(.app_id == "app_apple_xxx") | .store_identifier' rc-products.json | sort)

# Missing from RevenueCat
comm -23 <(echo "$ASC_IDS") <(echo "$RC_IDS")

# Missing from ASC
comm -13 <(echo "$ASC_IDS") <(echo "$RC_IDS")
```

## Reconciliation Checklist

| Check | Action |
|-------|--------|
| ASC product missing from RC | Create product in RevenueCat |
| RC product missing from ASC | Verify product exists in ASC; may be IAP vs subscription mismatch |
| Product ID mismatch | Product IDs must match exactly between systems |
| Group structure mismatch | RC offerings should mirror ASC subscription groups |
| Intro offer mismatch | Verify trial/offer configuration matches |
| Price mismatch | RevenueCat reads prices from Apple; verify in RC dashboard |

## Create Missing Products in RevenueCat

```bash
# For each missing product
curl -X POST \
  -H "Authorization: Bearer $RC_API_KEY" \
  -H "Content-Type: application/json" \
  "https://api.revenuecat.com/v2/projects/$RC_PROJECT_ID/products" \
  -d '{
    "store_identifier": "com.example.app.premium_monthly",
    "app_id": "app_apple_xxx",
    "type": "subscription"
  }'
```

## Safety Rules

1. **Always audit first** — never blind-write
2. **Never delete products** — only create missing ones
3. **Confirm with user** before any write operations
4. **Product IDs must match exactly** — case-sensitive
5. **Test in sandbox** — verify purchases work end-to-end after sync

## Common Mismatches

| Symptom | Cause | Fix |
|---------|-------|-----|
| Purchases not restoring | Product ID mismatch | Verify exact match |
| Wrong offering shown | Group mapping wrong | Align RC offerings with ASC groups |
| Trial not applying | Intro offer not configured in RC | Add offer in RC dashboard |
| Purchase succeeds but no entitlement | Product not linked to entitlement | Map product → entitlement in RC |
