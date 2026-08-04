import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const repoRoot = fileURLToPath(new URL("../", import.meta.url));
export const manifestPath = join(repoRoot, "relevance", "manifest.json");
export const readmePath = join(repoRoot, "README.md");
export const catalogStart = "<!-- generated-skill-catalog:start -->";
export const catalogEnd = "<!-- generated-skill-catalog:end -->";

const titleTokens = new Map([
  ["grotto", "Grotto"],
  ["sdk", "SDK"],
  ["github", "GitHub"],
  ["html5", "HTML5"],
  ["webgl", "WebGL"]
]);

export function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

export function skillTitle(name) {
  return name
    .split("-")
    .map((token) => titleTokens.get(token) ?? `${token.slice(0, 1).toUpperCase()}${token.slice(1)}`)
    .join(" ")
    .replace(/\bOf\b/g, "of")
    .replace(/\bToken Gated\b/g, "Token-Gated");
}

export function renderCatalog(manifest) {
  const entries = manifest.skills.map((skill) => [
    `### ${skillTitle(skill.name)}`,
    "",
    `Path: \`${skill.path}\``,
    "",
    skill.summary
  ].join("\n"));

  return `${catalogStart}\n\n${entries.join("\n\n")}\n\n${catalogEnd}`;
}

export function withGeneratedCatalog(readme, manifest) {
  const start = readme.indexOf(catalogStart);
  const end = readme.indexOf(catalogEnd);
  if (start === -1 || end === -1 || end < start) {
    throw new Error("README is missing the generated skill catalog markers");
  }

  return `${readme.slice(0, start)}${renderCatalog(manifest)}${readme.slice(end + catalogEnd.length)}`;
}

function parseInlineList(value) {
  const match = value.match(/^\[(.*)]$/);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((entry) => entry.trim().replace(/^['"]|['"]$/g, ""))
    .filter(Boolean);
}

export function parseSkillFrontmatter(source, sourcePath = "SKILL.md") {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${sourcePath} is missing YAML frontmatter`);

  const frontmatter = match[1];
  const topLevel = (key) => {
    const value = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]?.trim();
    return value?.replace(/^['"]|['"]$/g, "") ?? null;
  };
  const inlineList = (key) => {
    const value = frontmatter.match(new RegExp(`^\\s+${key}:\\s*(\\[.*])$`, "m"))?.[1]?.trim();
    return value ? parseInlineList(value) : [];
  };

  return {
    name: topLevel("name"),
    description: topLevel("description"),
    tags: inlineList("tags"),
    relatedSkills: inlineList("related_skills"),
    hasVersion: /^\s*version:\s*\S+/m.test(frontmatter),
    hasLicense: /^license:\s*\S+/m.test(frontmatter)
  };
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const repositoryTextExtension = /\.(?:cjs|html|js|json|md|mjs|ya?ml)$/i;
const javaScriptExtension = /\.(?:cjs|js|mjs)$/i;

export function isRepositoryTextPath(path) {
  return repositoryTextExtension.test(path);
}

export function isJavaScriptPath(path) {
  return javaScriptExtension.test(path);
}

export function repositoryTextFiles(root = repoRoot) {
  return walk(root)
    .filter((path) => !path.includes(`${join(root, ".git")}/`))
    .filter(isRepositoryTextPath);
}

export function markdownLinkErrors(path, source) {
  const errors = [];
  for (const match of source.matchAll(/!?\[[^\]]*]\(([^)]+)\)/g)) {
    const target = match[1].trim().split(/\s+['"]/)[0];
    if (!target || target.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    const cleanTarget = target.split("#")[0];
    if (!cleanTarget) continue;
    const resolved = resolve(dirname(path), decodeURIComponent(cleanTarget));
    if (!existsSync(resolved)) {
      errors.push(`${relative(repoRoot, path)} links to missing ${cleanTarget}`);
    }
  }
  return errors;
}
