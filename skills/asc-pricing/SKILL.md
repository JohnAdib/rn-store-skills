---
name: asc-pricing
description: >
  Set territory-specific pricing for subscriptions and in-app purchases using
  purchasing power parity strategies. Trigger on: pricing, app pricing, subscription
  pricing, IAP pricing, territory pricing, regional pricing, purchasing power parity,
  PPP, price tiers, price schedule, Google Play pricing.
license: MIT
metadata:
  author: JohnAdib
  version: "1.0.0"
  tags: [app-store-connect, asc, pricing, subscriptions, iap, revenue]
---

# Territory-Specific Pricing

Set regional pricing for subscriptions and in-app purchases.

## Pricing Concepts

### Apple Price Tiers
Apple uses a tier system. Each tier maps to specific prices per territory:
- Tier 0: Free
- Tier 1: $0.99 USD (base)
- Tier 2: $1.99 USD
- ...up to Tier 87: $999.99 USD

### Equalized Pricing
Apple auto-equalizes prices across territories based on exchange rates and tax.
You can override per territory for PPP strategies.

### Custom Price Points
Since 2022, Apple supports 900+ custom price points per territory (not just tiers).

## Inspect Current Pricing

### Subscription pricing
```bash
asc iap subscriptions prices list --subscription-id SUB_ID --json
```

### IAP pricing
```bash
asc iap prices list --iap-id IAP_ID --json
```

### View by territory
```bash
asc iap subscriptions prices list --subscription-id SUB_ID --json | \
  jq '.[] | {territory, price: .customerPrice}'
```

## Set Pricing

### Single territory
```bash
asc iap subscriptions prices set \
  --subscription-id SUB_ID \
  --territory USA \
  --price-point PRICE_POINT_ID
```

### Baseline pricing (recommended approach)
1. Set base price (usually USA)
2. Let Apple equalize other territories
3. Override specific territories for PPP

```bash
# Set base price
asc iap subscriptions prices set \
  --subscription-id SUB_ID \
  --territory USA \
  --price-point PP_499  # $4.99

# Override for lower-income markets
asc iap subscriptions prices set \
  --subscription-id SUB_ID \
  --territory IND \
  --price-point PP_149  # ₹149 (~$1.79)

asc iap subscriptions prices set \
  --subscription-id SUB_ID \
  --territory BRA \
  --price-point PP_999  # R$9.99 (~$1.99)
```

## PPP Strategy

Purchasing Power Parity adjusts prices so the relative cost is similar across economies.

### Tier recommendations by region

| Region | Multiplier | Example ($9.99 base) |
|--------|-----------|---------------------|
| US, Canada, EU, UK, Australia | 1.0x | $9.99 |
| Japan, South Korea | 0.9-1.0x | ¥1,000 / ₩9,900 |
| Brazil, Mexico, Turkey | 0.3-0.5x | R$19.90 / MXN$79 / ₺39.99 |
| India, Indonesia, Vietnam | 0.2-0.3x | ₹249 / Rp49,000 / ₫59,000 |
| Sub-Saharan Africa | 0.2-0.4x | Varies |

### Bulk PPP Update

```bash
# CSV format: territory,pricePointId
# Generate from PPP data, then apply:

while IFS=, read -r TERRITORY PRICE_POINT; do
  asc iap subscriptions prices set \
    --subscription-id SUB_ID \
    --territory "$TERRITORY" \
    --price-point "$PRICE_POINT"
done < pricing.csv
```

### Dry run first
```bash
# Preview changes without applying
while IFS=, read -r TERRITORY PRICE_POINT; do
  echo "Would set $TERRITORY → $PRICE_POINT"
done < pricing.csv
```

## Introductory Offers

### Free trial
```bash
asc iap subscriptions offers create \
  --subscription-id SUB_ID \
  --type FREE_TRIAL \
  --duration ONE_WEEK
```

### Discounted price
```bash
asc iap subscriptions offers create \
  --subscription-id SUB_ID \
  --type PAY_AS_YOU_GO \
  --duration THREE_MONTHS \
  --price-point PP_299
```

### Pay up front
```bash
asc iap subscriptions offers create \
  --subscription-id SUB_ID \
  --type PAY_UP_FRONT \
  --duration ONE_YEAR \
  --price-point PP_4999
```

## Google Play Pricing

### Key Differences

| Aspect | Apple | Google Play |
|--------|-------|-------------|
| Pricing model | Price points/tiers | Exact amounts in local currency |
| Auto-conversion | Equalized pricing | Manual or auto-converted |
| Sub-dollar pricing | Limited tiers | Any amount ≥ minimum |
| Price changes | Immediate or scheduled | Requires user consent for increases |

### Google Play Console / API

```bash
# Set price via Google Play Developer API
# Prices set in micros (1,000,000 = $1.00)
# Example: $4.99 = 4990000 micros
```

### Google Play PPP
Google provides suggested local prices. Access via:
- Play Console → Pricing → "Suggested prices" tab
- monetization.convertRegionPrices API

## Price Change Notifications

### Apple
- Price increases: Apple notifies subscribers, they must consent
- Price decreases: Applied automatically, no notification
- Schedule changes: Can set future effective date

### Google
- All price changes require notification
- Users get 30 days notice for increases
- Users can cancel before new price takes effect

## Revenue Optimization Tips

1. **Start with equalized pricing** — don't leave money on the table in wealthy markets
2. **Apply PPP for growth markets** — India, Brazil, Southeast Asia respond well to local pricing
3. **A/B test pricing** — use different price points for different intro offers
4. **Monitor conversion by territory** — if a market has low conversion, price may be too high
5. **Review quarterly** — exchange rates shift, re-equalize periodically

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Price point not found | List available price points for territory first. |
| Can't set price below minimum | Each territory has a minimum price. Check Apple's schedule. |
| Subscribers not seeing new price | Price changes for existing subscribers require consent flow. |
| Revenue lower than expected | Check territory-level reporting for conversion rates. |

## Related Skills
- `asc-subscription-localize` — display name localization
- `asc-release-flow` — release with pricing changes
- `asc-metadata-sync` — metadata alongside pricing updates
