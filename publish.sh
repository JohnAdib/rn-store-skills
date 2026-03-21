#!/usr/bin/env bash
set -e

echo ""
echo "=== rn-store-skills — publish to npm ==="
echo ""

# 1. Validate
echo "Step 1: Validating package..."
node scripts/validate.js

# 2. Show what will be published
echo "Step 2: Package contents preview:"
npm pack --dry-run 2>&1
echo ""

# 3. Confirm
read -p "Publish rn-store-skills@$(node -p "require('./package.json').version") to npm? [y/N] " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Aborted."
  exit 0
fi

# 4. Publish
echo ""
echo "Step 3: Publishing..."
npm publish --access public

echo ""
echo "Done! View at: https://www.npmjs.com/package/rn-store-skills"
echo "Install with: npx skills add npm:rn-store-skills"
echo ""
