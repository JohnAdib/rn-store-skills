#!/usr/bin/env node

/**
 * Pre-publish validation script.
 * Checks that the skill package is well-formed before publishing to npm.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");

let errors = 0;
let warnings = 0;

function check(condition, msg) {
  if (!condition) {
    console.error(`  ❌ ${msg}`);
    errors++;
  } else {
    console.log(`  ✅ ${msg}`);
  }
}

function warn(condition, msg) {
  if (!condition) {
    console.warn(`  ⚠️  ${msg}`);
    warnings++;
  }
}

console.log("\nValidating rn-store-skills package...\n");

// ── 1. Root files ──────────────────────────────────────────────
console.log("Root files:");
check(fs.existsSync(path.join(ROOT, "README.md")), "README.md exists");
check(fs.existsSync(path.join(ROOT, "LICENSE")), "LICENSE exists");

// ── 2. rn-store-compliance skill ───────────────────────────────
console.log("\nrn-store-compliance:");
const COMPLIANCE_DIR = path.join(SKILLS_DIR, "rn-store-compliance");
const COMPLIANCE_MD = path.join(COMPLIANCE_DIR, "SKILL.md");
const REFS_DIR = path.join(COMPLIANCE_DIR, "references");

check(fs.existsSync(COMPLIANCE_MD), "SKILL.md exists");

if (fs.existsSync(COMPLIANCE_MD)) {
  const content = fs.readFileSync(COMPLIANCE_MD, "utf8");
  check(content.startsWith("---"), "SKILL.md has YAML frontmatter");
  check(content.includes("name:"), "SKILL.md has name field");
  check(content.includes("description:"), "SKILL.md has description field");
  check(content.length > 500, `SKILL.md is not a stub (${content.length} bytes)`);
}

check(fs.existsSync(REFS_DIR), "references/ directory exists");

// Guidelines
const GUIDELINES_DIR = path.join(REFS_DIR, "guidelines");
check(fs.existsSync(GUIDELINES_DIR), "references/guidelines/ exists");
for (const file of ["apple.md", "google-play.md"]) {
  check(fs.existsSync(path.join(GUIDELINES_DIR, file)), `guidelines/${file} exists`);
}

// Rules
const RULES_DIR = path.join(REFS_DIR, "rules");
check(fs.existsSync(RULES_DIR), "references/rules/ exists");
for (const file of [
  "metadata.md",
  "subscriptions.md",
  "privacy.md",
  "design.md",
  "entitlements.md",
  "performance.md",
  "permissions.md",
  "copyright-media.md",
  "legal.md",
  "ota-updates.md",
  "app-completeness.md",
]) {
  check(fs.existsSync(path.join(RULES_DIR, file)), `rules/${file} exists`);
}

// App types
const APP_TYPES_DIR = path.join(REFS_DIR, "app-types");
check(fs.existsSync(APP_TYPES_DIR), "references/app-types/ exists");
for (const file of [
  "social.md",
  "kids.md",
  "health-fitness.md",
  "games.md",
  "ai.md",
  "crypto-finance.md",
  "vpn.md",
]) {
  check(fs.existsSync(path.join(APP_TYPES_DIR, file)), `app-types/${file} exists`);
}

// Features
const FEATURES_DIR = path.join(REFS_DIR, "features");
check(fs.existsSync(FEATURES_DIR), "references/features/ exists");
for (const file of ["subscriptions.md", "ugc.md", "macos.md"]) {
  check(fs.existsSync(path.join(FEATURES_DIR, file)), `features/${file} exists`);
}

// Top-level reference files
for (const file of ["all-apps.md", "react-native.md", "pre-submission.md", "rejections.md"]) {
  check(fs.existsSync(path.join(REFS_DIR, file)), `references/${file} exists`);
}

// ── 3. asc-toolkit skill ──────────────────────────────────────
console.log("\nasc-toolkit:");
const TOOLKIT_DIR = path.join(SKILLS_DIR, "asc-toolkit");
const TOOLKIT_MD = path.join(TOOLKIT_DIR, "SKILL.md");
const TOOLKIT_REFS = path.join(TOOLKIT_DIR, "references");

check(fs.existsSync(TOOLKIT_MD), "SKILL.md exists");

if (fs.existsSync(TOOLKIT_MD)) {
  const content = fs.readFileSync(TOOLKIT_MD, "utf8");
  check(content.startsWith("---"), "SKILL.md has YAML frontmatter");
  check(content.includes("name:"), "SKILL.md has name field");
  check(content.includes("description:"), "SKILL.md has description field");
  check(content.length > 500, `SKILL.md is not a stub (${content.length} bytes)`);
}

check(fs.existsSync(TOOLKIT_REFS), "references/ directory exists");

const requiredToolkitRefs = [
  "xcode-build.md",
  "build-lifecycle.md",
  "notarization.md",
  "signing-setup.md",
  "release-flow.md",
  "testflight-ops.md",
  "submission-health.md",
  "metadata-sync.md",
  "locales.md",
  "whats-new-writer.md",
  "subscription-localize.md",
  "revenuecat.md",
  "aso-audit.md",
  "screenshots.md",
  "crash-triage.md",
  "pricing.md",
  "cli-usage.md",
  "cli-workflows.md",
  "id-resolver.md",
];

for (const file of requiredToolkitRefs) {
  const fp = path.join(TOOLKIT_REFS, file);
  check(fs.existsSync(fp), `references/${file} exists`);
  if (fs.existsSync(fp)) {
    const size = fs.statSync(fp).size;
    check(size > 100, `references/${file} is not empty (${size} bytes)`);
  }
}

// ── 4. Validate all SKILL.md frontmatter ──────────────────────
console.log("\nFrontmatter validation:");
const allSkillMds = [];
function findSkillMds(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".git") {
      findSkillMds(full);
    } else if (entry.name === "SKILL.md") {
      allSkillMds.push(full);
    }
  }
}
findSkillMds(ROOT);

check(allSkillMds.length === 2, `Exactly 2 SKILL.md files found (found ${allSkillMds.length})`);

for (const skillPath of allSkillMds) {
  const rel = path.relative(ROOT, skillPath);
  const content = fs.readFileSync(skillPath, "utf8");

  check(content.startsWith("---"), `${rel} has YAML frontmatter`);
  check(content.includes("name:"), `${rel} has name field`);
  check(content.includes("description:"), `${rel} has description field`);

  // Description length check
  const descMatch = content.match(/description:\s*>\n([\s\S]*?)(?=\n---|\n[a-z])/);
  if (descMatch) {
    const desc = descMatch[1].split("\n").map((l) => l.trim()).filter(Boolean).join(" ");
    warn(desc.length <= 300, `${rel} description is ${desc.length} chars (recommended ≤300)`);
    check(desc.length <= 1024, `${rel} description within 1024 char limit`);
  }

  // No non-standard fields
  warn(!content.includes("license:"), `${rel} has non-standard 'license' field — consider removing`);
  warn(
    !content.includes("metadata:"),
    `${rel} has non-standard 'metadata' field — consider removing`
  );
}

// ── Summary ───────────────────────────────────────────────────
console.log("");
if (errors > 0) {
  console.error(
    `❌❌❌ Validation failed with ${errors} error(s). Fix them before publishing.\n`
  );
  process.exit(1);
} else if (warnings > 0) {
  console.log(`✅ All checks passed with ${warnings} warning(s). Ready to publish!\n`);
} else {
  console.log("✅✅✅ All checks passed. Ready to publish!\n");
}
