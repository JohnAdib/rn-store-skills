---
name: asc-whats-new-writer
description: >
  Generate localized App Store and Google Play release notes from git log,
  bullet points, or free text. Trigger on: release notes, What's New, changelog,
  app update notes, version notes, write release notes, localized release notes,
  Google Play release notes.
license: MIT
metadata:
  author: JohnAdib
  version: "1.0.0"
  tags: [app-store-connect, asc, release-notes, localization, changelog]
---

# What's New Writer

Generate engaging, localized release notes for App Store and Google Play.

## Input Sources

### From git log
```bash
# Commits since last tag
git log v1.9.0..HEAD --oneline --no-merges
```

### From conventional commits
```bash
# Parse feat/fix/chore
git log v1.9.0..HEAD --oneline --no-merges | \
  grep -E "^[a-f0-9]+ (feat|fix|perf|refactor):"
```

### From bullet points
Pass raw bullet points and the skill will rewrite them.

### From free text
Describe changes in plain language and the skill will format them.

## Output Structure

Classify changes into categories:
- **New**: New features users can see/use
- **Improved**: Enhancements to existing features
- **Fixed**: Bug fixes that affected users

Focus on **user benefits**, not technical changes. Skip internal refactors.

## Character Limits

### Apple App Store
| Constraint | Limit |
|-----------|-------|
| What's New field | 4000 chars max |
| Visible without "more" | ~500-1500 chars (varies by device) |
| Recommended length | 500-800 chars |

### Google Play
| Constraint | Limit |
|-----------|-------|
| Release notes | 500 chars per locale |
| Recommended length | 300-500 chars |

Google Play is much shorter — write concise notes first, then expand for Apple.

## Writing Guidelines

1. **Lead with the biggest improvement** — what users care about most
2. **Use active voice** — "Added dark mode" not "Dark mode has been added"
3. **Be specific** — "Photos load 3x faster" not "Performance improvements"
4. **Skip jargon** — "Smoother scrolling" not "Reduced JS thread blocking"
5. **Include emoji sparingly** — one per category header at most
6. **End with a call to action** — "Update now" or "Let us know what you think"

## Template

```
What's New in v2.0:

New
- [Main new feature with user benefit]
- [Secondary feature]

Improved
- [Enhancement with measurable improvement]
- [UX improvement]

Fixed
- [Bug fix that users noticed]
- [Crash fix]
```

## Multi-Locale Generation

### Workflow
1. Write primary locale (en-US) release notes
2. Translate to target locales with tone adaptation
3. Verify character limits per locale
4. Upload via `asc-metadata-sync`

### Tone by locale
- **Japanese (ja)**: Polite/humble (です/ます form), concise
- **German (de-DE)**: Formal (Sie), precise technical language
- **French (fr-FR)**: Formal (vous), elegant phrasing
- **Korean (ko)**: Formal (합니다), respectful tone
- **Chinese (zh-Hans)**: Concise, practical language
- **Arabic (ar-SA)**: Formal, RTL consideration

### Upload localized notes
```bash
for LOCALE in en-US de-DE fr-FR ja ko zh-Hans; do
  asc appstore versions localizations update \
    --version-id VERSION_ID \
    --locale $LOCALE \
    --whats-new "$(cat release-notes/$LOCALE.txt)"
done
```

## Google Play Release Notes

Google Play uses a different API but same content strategy:

```bash
# Using bundletool / Google Play Developer API
# release-notes/$LOCALE.txt must be ≤ 500 chars
```

Or via Fastlane:
```ruby
# Fastfile
lane :upload_metadata do
  supply(
    track: "production",
    release_status: "completed",
    metadata_path: "./metadata/android"
  )
end
```

Fastlane metadata structure:
```
metadata/android/
  en-US/
    changelogs/
      default.txt    # ≤ 500 chars
```

## Conventional Commits → Release Notes

Map commit types to user-facing categories:

| Commit type | Release note category | Include? |
|------------|----------------------|----------|
| `feat:` | New | Yes |
| `fix:` | Fixed | Yes (if user-facing) |
| `perf:` | Improved | Yes |
| `refactor:` | — | No (internal) |
| `chore:` | — | No (internal) |
| `docs:` | — | No (internal) |
| `test:` | — | No (internal) |
| `ci:` | — | No (internal) |

## Related Skills
- `asc-metadata-sync` — upload release notes to ASC
- `asc-release-flow` — full release workflow
- `asc-aso-audit` — keyword opportunities in release notes
