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

// 1. SKILL.md exists
check(fs.existsSync(SKILL_MD), "SKILL.md exists");

// 2. SKILL.md has frontmatter
if (fs.existsSync(SKILL_MD)) {
  const content = fs.readFileSync(SKILL_MD, "utf8");
  check(content.startsWith("---"), "SKILL.md has YAML frontmatter");
  check(content.includes("name:"), "SKILL.md has name field");
  check(content.includes("description:"), "SKILL.md has description field");
}

// 3. References directory exists
check(fs.existsSync(REFS_DIR), "references/ directory exists");

// 4. Required reference files exist
const requiredRefs = [
  "apple-guidelines.md",
  "google-play-guidelines.md",
  "react-native-patterns.md",
  "pre-submission-checklist.md",
  "handling-rejections.md",
];

if (fs.existsSync(REFS_DIR)) {
  for (const ref of requiredRefs) {
    check(
      fs.existsSync(path.join(REFS_DIR, ref)),
      `references/${ref} exists`
    );
  }
}

// 5. README exists
check(fs.existsSync(path.join(ROOT, "README.md")), "README.md exists");

// 6. LICENSE exists
check(fs.existsSync(path.join(ROOT, "LICENSE")), "LICENSE exists");

// 7. No extra SKILL.md files (the single-SKILL.md constraint)
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
check(
  allSkillMds.length === 1,
  `Exactly 1 SKILL.md in package (found ${allSkillMds.length})`
);

console.log("");
if (errors > 0) {
  console.error(`❌❌❌ Validation failed with ${errors} error(s). Fix them before publishing.\n`);
  process.exit(1);
} else {
  console.log("✅✅✅ All checks passed. Ready to publish!\n");
}
