#!/usr/bin/env node

/**
 * Pre-publish validation script.
 * Checks that the skill package is well-formed before publishing to npm.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SKILL_DIR = path.join(ROOT, "skills", "rn-store-compliance");
const SKILL_MD = path.join(SKILL_DIR, "SKILL.md");
const REFS_DIR = path.join(SKILL_DIR, "references");

let errors = 0;

function check(condition, msg) {
  if (!condition) {
    console.error(`  ❌ ${msg}`);
    errors++;
  } else {
    console.log(`  ✅ ${msg}`);
  }
}

console.log("\nValidating rn-store-skills package...\n");

// 1. SKILL.md exists and has frontmatter
check(fs.existsSync(SKILL_MD), "SKILL.md exists");

if (fs.existsSync(SKILL_MD)) {
  const content = fs.readFileSync(SKILL_MD, "utf8");
  check(content.startsWith("---"), "SKILL.md has YAML frontmatter");
  check(content.includes("name:"), "SKILL.md has name field");
  check(content.includes("description:"), "SKILL.md has description field");
}

// 2. References directory exists
check(fs.existsSync(REFS_DIR), "references/ directory exists");

// 3. Guidelines directory and files
const GUIDELINES_DIR = path.join(REFS_DIR, "guidelines");
check(fs.existsSync(GUIDELINES_DIR), "references/guidelines/ exists");

const requiredGuidelines = ["apple.md", "google-play.md"];
for (const file of requiredGuidelines) {
  check(
    fs.existsSync(path.join(GUIDELINES_DIR, file)),
    `guidelines/${file} exists`
  );
}

// 4. Rules directory and files
const RULES_DIR = path.join(REFS_DIR, "rules");
check(fs.existsSync(RULES_DIR), "references/rules/ exists");

const requiredRules = [
  "metadata.md",
  "subscriptions.md",
  "privacy.md",
  "design.md",
  "entitlements.md",
  "performance.md",
  "permissions.md",
];
for (const file of requiredRules) {
  check(fs.existsSync(path.join(RULES_DIR, file)), `rules/${file} exists`);
}

// 5. App-types directory and files
const APP_TYPES_DIR = path.join(REFS_DIR, "app-types");
check(fs.existsSync(APP_TYPES_DIR), "references/app-types/ exists");

const requiredAppTypes = [
  "social.md",
  "kids.md",
  "health-fitness.md",
  "games.md",
  "ai.md",
  "crypto-finance.md",
  "vpn.md",
];
for (const file of requiredAppTypes) {
  check(
    fs.existsSync(path.join(APP_TYPES_DIR, file)),
    `app-types/${file} exists`
  );
}

// 6. Features directory and files
const FEATURES_DIR = path.join(REFS_DIR, "features");
check(fs.existsSync(FEATURES_DIR), "references/features/ exists");

const requiredFeatures = ["subscriptions.md", "ugc.md", "macos.md"];
for (const file of requiredFeatures) {
  check(
    fs.existsSync(path.join(FEATURES_DIR, file)),
    `features/${file} exists`
  );
}

// 7. Top-level reference files
const requiredTopLevel = [
  "all-apps.md",
  "react-native.md",
  "pre-submission.md",
  "rejections.md",
];
for (const file of requiredTopLevel) {
  check(fs.existsSync(path.join(REFS_DIR, file)), `references/${file} exists`);
}

// 8. README and LICENSE
check(fs.existsSync(path.join(ROOT, "README.md")), "README.md exists");
check(fs.existsSync(path.join(ROOT, "LICENSE")), "LICENSE exists");

// 9. All SKILL.md files must have valid frontmatter
const allSkillMds = [];
function findSkillMds(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (
      entry.isDirectory() &&
      entry.name !== "node_modules" &&
      entry.name !== ".git"
    ) {
      findSkillMds(full);
    } else if (entry.name === "SKILL.md") {
      allSkillMds.push(full);
    }
  }
}
findSkillMds(ROOT);
check(
  allSkillMds.length >= 1,
  `At least 1 SKILL.md in package (found ${allSkillMds.length})`
);

// 10. Validate every SKILL.md has required frontmatter
for (const skillPath of allSkillMds) {
  const rel = path.relative(ROOT, skillPath);
  const content = fs.readFileSync(skillPath, "utf8");
  check(content.startsWith("---"), `${rel} has YAML frontmatter`);
  check(content.includes("name:"), `${rel} has name field`);
  check(content.includes("description:"), `${rel} has description field`);
  check(content.length > 500, `${rel} is not a stub (>${content.length} bytes)`);
}

console.log("");
if (errors > 0) {
  console.error(
    `❌❌❌ Validation failed with ${errors} error(s). Fix them before publishing.\n`
  );
  process.exit(1);
} else {
  console.log("✅✅✅ All checks passed. Ready to publish!\n");
}
