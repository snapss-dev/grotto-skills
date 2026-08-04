import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";

import {
  isJavaScriptPath,
  loadJson,
  manifestPath,
  markdownLinkErrors,
  parseSkillFrontmatter,
  readmePath,
  repoRoot,
  repositoryTextFiles,
  withGeneratedCatalog
} from "./skill-catalog.mjs";

const failures = [];
const manifest = loadJson(manifestPath);
const externalSkills = new Set(loadJson(join(repoRoot, "relevance", "external-related-skills.json")).skills);

if (!Array.isArray(manifest.skills) || manifest.skills.length === 0) {
  failures.push("relevance/manifest.json must contain a non-empty skills array");
}

const manifestNames = new Set();
const manifestPaths = new Set();
for (const skill of manifest.skills ?? []) {
  if (!skill || typeof skill !== "object") {
    failures.push("manifest skills must be objects");
    continue;
  }
  for (const field of ["name", "path", "summary", "inject"]) {
    if (typeof skill[field] !== "string" || skill[field].trim() === "") {
      failures.push(`manifest skill ${skill.name ?? "<unknown>"} needs ${field}`);
    }
  }
  if (manifestNames.has(skill.name)) failures.push(`duplicate manifest skill ${skill.name}`);
  if (manifestPaths.has(skill.path)) failures.push(`duplicate manifest path ${skill.path}`);
  manifestNames.add(skill.name);
  manifestPaths.add(skill.path);

  const expectedPath = `skills/${skill.name}/SKILL.md`;
  if (skill.path !== expectedPath) failures.push(`${skill.name} path must be ${expectedPath}`);
  const absolutePath = join(repoRoot, skill.path);
  let frontmatter;
  try {
    frontmatter = parseSkillFrontmatter(readFileSync(absolutePath, "utf8"), skill.path);
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
    continue;
  }
  if (frontmatter.name !== skill.name) failures.push(`${skill.path} frontmatter name must be ${skill.name}`);
  if (!frontmatter.description) failures.push(`${skill.path} needs a description`);
  if (!frontmatter.hasVersion) failures.push(`${skill.path} needs a version`);
  if (!frontmatter.hasLicense) failures.push(`${skill.path} needs a license`);

  const manifestTags = [...new Set(Array.isArray(skill.tags) ? skill.tags : [])].sort();
  const frontmatterTags = [...new Set(frontmatter.tags)].sort();
  if (JSON.stringify(manifestTags) !== JSON.stringify(frontmatterTags)) {
    failures.push(`${skill.name} tags differ between manifest and SKILL.md`);
  }
  for (const related of frontmatter.relatedSkills) {
    if (!manifestNames.has(related) && !externalSkills.has(related)) {
      // A later manifest entry may not have been visited yet; rechecked below.
      failures.push(`${skill.name} references unknown related skill ${related}`);
    }
  }
}

// Re-evaluate related skills after all manifest names are known.
for (let index = failures.length - 1; index >= 0; index -= 1) {
  const match = failures[index].match(/ references unknown related skill (.+)$/);
  if (match && manifestNames.has(match[1])) failures.splice(index, 1);
}

const skillDirectories = readdirSync(join(repoRoot, "skills"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const extraDirectories = skillDirectories.filter((name) => !manifestNames.has(name));
const missingDirectories = [...manifestNames].filter((name) => !skillDirectories.includes(name));
if (extraDirectories.length) failures.push(`skills missing from manifest: ${extraDirectories.join(", ")}`);
if (missingDirectories.length) failures.push(`manifest skills missing directories: ${missingDirectories.join(", ")}`);

const readme = readFileSync(readmePath, "utf8");
if (withGeneratedCatalog(readme, manifest) !== readme) {
  failures.push("README skill catalog is stale; run npm run generate:readme");
}

const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:gst|grs|sk)_[A-Za-z0-9_-]{20,}\b/,
  /\bBearer\s+[A-Za-z0-9._~-]{24,}\b/i
];
for (const path of repositoryTextFiles()) {
  const source = readFileSync(path, "utf8");
  failures.push(...markdownLinkErrors(path, source));
  for (const pattern of secretPatterns) {
    if (pattern.test(source)) failures.push(`${relative(repoRoot, path)} contains a credential-shaped value`);
  }
  if (isJavaScriptPath(path)) {
    const check = spawnSync(process.execPath, ["--check", path], { encoding: "utf8" });
    if (check.status !== 0) failures.push(`${relative(repoRoot, path)} fails node --check: ${check.stderr.trim()}`);
  }
}

if (failures.length) {
  console.error(`Skill validation failed:\n${failures.map((failure) => `  - ${failure}`).join("\n")}`);
  process.exit(1);
}

console.log(`Skill validation OK: ${manifest.skills.length} manifest entries, ${skillDirectories.length} skill directories.`);
