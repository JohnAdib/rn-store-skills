# ASO Audit

App Store Optimization audit for Apple App Store and Google Play.

## Phase 1: Offline Checks

Run these checks against current metadata without external tools.

### 1. Keyword Field Utilization

Apple allows 100 chars for keywords. Check usage:

```bash
KEYWORDS=$(asc appstore versions localizations list --version-id VERSION_ID --locale en-US --json | \
  jq -r '.keywords')
echo "Keywords: ${#KEYWORDS}/100 chars"
```

Rules:
- Use all 100 characters
- Comma-separated, no spaces after commas
- Don't repeat words already in app name or subtitle
- Don't include category names (Apple indexes them automatically)
- Don't use competitor brand names (policy violation)

### 2. Field Utilization Score

| Field | Max | Check |
|-------|-----|-------|
| App Name | 30 | Use 25-30 chars. Include primary keyword. |
| Subtitle | 30 | Use 20-30 chars. Include secondary keyword. |
| Keywords | 100 | Use 95-100 chars. No wasted space. |
| Description | 4000 | First 3 lines visible. Front-load keywords. |

### 3. Keyword Waste Detection

Check for common waste patterns:
- **Duplicate words**: Words in name/subtitle repeated in keywords
- **Spaces after commas**: `word1, word2` wastes chars vs `word1,word2`
- **Plural forms**: Apple indexes singular+plural, so don't use both
- **Articles/prepositions**: "the", "a", "for", "with" waste space
- **Category terms**: "app", "application", "game" are auto-indexed

```bash
# Quick waste check
KEYWORDS="keyword1,keyword2,keyword3"
NAME="My App Name"
SUBTITLE="Best App Ever"

# Find duplicates between keywords and name/subtitle
for word in $(echo "$NAME $SUBTITLE" | tr ' ' '\n' | tr '[:upper:]' '[:lower:]'); do
  echo "$KEYWORDS" | tr ',' '\n' | tr '[:upper:]' '[:lower:]' | \
    grep -w "$word" && echo "⚠️  '$word' duplicated in keywords and name/subtitle"
done
```

### 4. Cross-Locale Gaps

Check which locales are missing metadata:
```bash
asc appstore versions localizations list --version-id VERSION_ID --json | \
  jq '.[] | {locale, hasDesc: (.description | length > 0), hasKeywords: (.keywords | length > 0)}' | \
  jq 'select(.hasDesc == false or .hasKeywords == false)'
```

### 5. Missing Fields

```bash
asc apps localizations list --bundle-id com.example.app --json | \
  jq '.[] | select(.subtitle == null or .subtitle == "") | .locale'
```

## Phase 2: Competitive Analysis

### Keyword Research Strategy

1. **Seed keywords**: Core terms describing your app
2. **Competitor keywords**: What top competitors rank for
3. **Long-tail keywords**: Specific phrases with lower competition
4. **Localized keywords**: Market-specific terms (not translations)

### Per-Market Keyword Strategy

Don't just translate keywords — localize them:

| Market | Strategy |
|--------|----------|
| US (en-US) | Broadest terms, highest competition |
| UK (en-GB) | British English variants (colour, favourite) |
| Germany (de-DE) | Compound words (Aufgabenverwaltung vs task management) |
| Japan (ja) | Katakana for English terms, kanji for native concepts |
| Brazil (pt-BR) | Portuguese-specific terms, not European Portuguese |
| China (zh-Hans) | Simplified Chinese, local app terminology |

### Metadata Scoring

Score each locale 0-100:

| Criteria | Points |
|----------|--------|
| Name uses 25+ chars | 15 |
| Subtitle filled | 15 |
| Keywords use 90+ chars | 20 |
| Description > 1000 chars | 15 |
| Keywords don't duplicate name | 15 |
| No wasted characters | 10 |
| Screenshots have captions | 10 |

## Google Play ASO

### Key Differences from Apple

| Aspect | Apple | Google Play |
|--------|-------|-------------|
| Keyword field | Dedicated 100-char field | No keyword field — indexes from title, short desc, full desc |
| Title length | 30 chars | 30 chars |
| Short description | Subtitle (30 chars) | Short description (80 chars) |
| Full description | 4000 chars | 4000 chars |
| Keyword density | N/A | 2-3% recommended in description |

### Google Play Optimization

- **Title**: Include primary keyword naturally
- **Short description (80 chars)**: Dense with keywords, compelling CTA
- **Full description**: Use keywords 3-5 times naturally. First 1-2 sentences are critical.
- **No keyword stuffing**: Google penalizes obvious stuffing
- **Update regularly**: Fresh descriptions signal active maintenance

## Audit Report Template

```
=== ASO Audit Report ===
App: [Name]
Date: [Date]

📊 Field Utilization
- Name: [X]/30 chars ([percentage]%)
- Subtitle: [X]/30 chars ([percentage]%)
- Keywords: [X]/100 chars ([percentage]%)
- Description: [X]/4000 chars

⚠️ Issues Found
- [Duplicated keywords in name/keywords field]
- [Empty subtitles for X locales]
- [Spaces after commas in keywords]

✅ Recommendations
- [Add subtitle for all locales]
- [Remove duplicate words from keywords]
- [Fill remaining keyword space with long-tail terms]

📈 Locale Coverage
- [X]/37 locales with complete metadata
- Missing: [list of incomplete locales]
```

## Related Skills
- `asc-metadata-sync` — update metadata after audit
- `asc-whats-new-writer` — optimize release notes
- `asc-screenshots` — screenshot optimization
