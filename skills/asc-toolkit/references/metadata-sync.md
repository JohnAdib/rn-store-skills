# Metadata Sync & Localization

Sync, validate, and translate App Store metadata across all locales.

## Field Reference

### Version-level fields (per release)
| Field | Key | Max chars | Notes |
|-------|-----|----------|-------|
| Description | `description` | 4000 | Full app description |
| What's New | `whatsNew` | 4000 | Release notes |
| Keywords | `keywords` | 100 | Comma-separated, Apple only |
| Support URL | `supportUrl` | — | Required |
| Marketing URL | `marketingUrl` | — | Optional |

### App-level fields (persistent)
| Field | Key | Max chars | Notes |
|-------|-----|----------|-------|
| Name | `name` | 30 | App Store display name |
| Subtitle | `subtitle` | 30 | Below name on store |
| Privacy Policy URL | `privacyPolicyUrl` | — | Required |
| License Agreement URL | `licenseAgreementUrl` | — | Optional |

## Read Metadata

### List version localizations
```bash
asc appstore versions localizations list --version-id VERSION_ID
asc appstore versions localizations list --version-id VERSION_ID --json
```

### List app-level localizations
```bash
asc apps localizations list --bundle-id com.example.app --json
```

### Download as .strings (legacy format)
```bash
asc appstore versions localizations download --version-id VERSION_ID --locale en-US
```

## Update Metadata

### Single locale
```bash
asc appstore versions localizations update \
  --version-id VERSION_ID \
  --locale en-US \
  --description "Your app description here" \
  --whats-new "Bug fixes and improvements" \
  --keywords "keyword1,keyword2,keyword3"
```

### App-level fields
```bash
asc apps localizations update \
  --bundle-id com.example.app \
  --locale en-US \
  --name "My App" \
  --subtitle "The best app ever"
```

### Privacy policy URL
```bash
asc apps localizations update \
  --bundle-id com.example.app \
  --locale en-US \
  --privacy-policy-url "https://example.com/privacy"
```

## Bulk Localization

### Supported locales (37)
```
ar-SA, ca, cs, da, de-DE, el, en-AU, en-CA, en-GB, en-US,
es-ES, es-MX, fi, fr-CA, fr-FR, he, hi, hr, hu, id,
it, ja, ko, ms, nb, nl-NL, pl, pt-BR, pt-PT, ro,
ru, sk, sv, th, tr, uk, vi, zh-Hans, zh-Hant
```

### Translate from primary locale
Strategy: export primary → translate per field → upload per locale.

```bash
# 1. Export primary locale
PRIMARY=$(asc appstore versions localizations list --version-id VERSION_ID --locale en-US --json)

# 2. For each target locale, translate and upload
for LOCALE in de-DE fr-FR ja ko zh-Hans; do
  # Translate (use LLM or translation service)
  TRANSLATED_DESC=$(translate "$PRIMARY_DESC" --to $LOCALE)
  TRANSLATED_WHATS_NEW=$(translate "$PRIMARY_WHATS_NEW" --to $LOCALE)

  # Upload
  asc appstore versions localizations update \
    --version-id VERSION_ID \
    --locale $LOCALE \
    --description "$TRANSLATED_DESC" \
    --whats-new "$TRANSLATED_WHATS_NEW"
done
```

### Translation guidelines
- Use formal tone (Sie/vous/usted, not du/tu/tu)
- Keep brand names untranslated
- Adapt keywords per market (don't just translate — localize)
- Respect character limits (they apply per locale)
- CJK languages typically need fewer characters
- RTL languages (Arabic, Hebrew): test layout rendering

## Character Limit Validation

Before uploading, validate:
```bash
validate_field() {
  local field="$1" value="$2" max="$3"
  local len=${#value}
  if [ $len -gt $max ]; then
    echo "❌ $field: $len/$max chars (over by $((len - max)))"
    return 1
  else
    echo "✅ $field: $len/$max chars"
    return 0
  fi
}

validate_field "name" "$NAME" 30
validate_field "subtitle" "$SUBTITLE" 30
validate_field "keywords" "$KEYWORDS" 100
validate_field "description" "$DESCRIPTION" 4000
validate_field "whatsNew" "$WHATS_NEW" 4000
```

## Metadata from Files

Organize metadata in a directory structure for version control:

```
metadata/
  en-US/
    description.txt
    whats_new.txt
    keywords.txt
  de-DE/
    description.txt
    whats_new.txt
    keywords.txt
```

Upload script:
```bash
for LOCALE_DIR in metadata/*/; do
  LOCALE=$(basename "$LOCALE_DIR")
  DESC=$(cat "$LOCALE_DIR/description.txt" 2>/dev/null || echo "")
  WHATS_NEW=$(cat "$LOCALE_DIR/whats_new.txt" 2>/dev/null || echo "")
  KEYWORDS=$(cat "$LOCALE_DIR/keywords.txt" 2>/dev/null || echo "")

  asc appstore versions localizations update \
    --version-id VERSION_ID \
    --locale $LOCALE \
    ${DESC:+--description "$DESC"} \
    ${WHATS_NEW:+--whats-new "$WHATS_NEW"} \
    ${KEYWORDS:+--keywords "$KEYWORDS"}
done
```

For locale data reference, see `references/locales.md`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Character limit exceeded` | Check field lengths. Keywords = 100, name = 30, description = 4000. |
| Locale not supported | Use exact Apple locale codes (e.g., `zh-Hans` not `zh-CN`). |
| Keywords not indexing | Avoid spaces after commas. Don't repeat app name. Don't use competitor names. |
| Description not saving | Check for invalid characters. Some Unicode chars are rejected. |

## Related Skills
- `asc-whats-new-writer` — generate release notes
- `asc-aso-audit` — keyword optimization
- `asc-submission-health` — metadata completeness check
- `asc-subscription-localize` — subscription display names
