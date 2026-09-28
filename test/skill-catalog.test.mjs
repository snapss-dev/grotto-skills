import assert from "node:assert/strict";
import test from "node:test";

import {
  catalogEnd,
  catalogStart,
  isJavaScriptPath,
  isRepositoryTextPath,
  parseSkillFrontmatter,
  renderCatalog,
  skillTitle,
  withGeneratedCatalog
} from "../scripts/skill-catalog.mjs";

test("repository scans all supported JavaScript module extensions", () => {
  for (const path of ["template.js", "validator.mjs", "config.cjs"]) {
    assert.equal(isJavaScriptPath(path), true, path);
    assert.equal(isRepositoryTextPath(path), true, path);
  }

  assert.equal(isJavaScriptPath("component.ts"), false);
  assert.equal(isRepositoryTextPath("asset.png"), false);
});

test("catalog titles preserve developer abbreviations", () => {
  assert.equal(skillTitle("grotto-game-runtime-developer-sdk"), "Grotto Game Runtime Developer SDK");
  assert.equal(skillTitle("grotto-hosted-game-github-workflow"), "Grotto Hosted Game GitHub Workflow");
  assert.equal(skillTitle("grotto-core-of-gaming"), "Grotto Core of Gaming");
  assert.equal(skillTitle("grotto-game-token-gated-inventory"), "Grotto Game Token-Gated Inventory");
});

test("generated catalog is deterministic and replaces only its marked region", () => {
  const manifest = {
    skills: [{
      name: "grotto-example-sdk",
      path: "skills/grotto-example-sdk/SKILL.md",
      summary: "Example summary."
    }]
  };
  const input = `before\n${catalogStart}\nstale\n${catalogEnd}\nafter\n`;
  const output = withGeneratedCatalog(input, manifest);

  assert.equal(output, `before\n${renderCatalog(manifest)}\nafter\n`);
  assert.equal(withGeneratedCatalog(output, manifest), output);
});

test("frontmatter parser extracts identity and relationship contracts", () => {
  const parsed = parseSkillFrontmatter(`---
name: grotto-example
description: "Example skill."
version: 1.0.0
license: MIT
metadata:
  hermes:
    tags: [grotto, sdk]
    related_skills: [grotto-other]
---
# Example
`);

  assert.deepEqual(parsed, {
    name: "grotto-example",
    description: "Example skill.",
    tags: ["grotto", "sdk"],
    relatedSkills: ["grotto-other"],
    displayName: null,
    category: null,
    stage: null,
    outcome: null,
    version: '1.0.0',
    hasVersion: true,
    hasLicense: true
  });
});

test("catalog groups creator workflows separately from platform integrations", () => {
  const source = `---\nname: grotto-example\ndescription: Example.\nlicense: MIT\nmetadata:\n  version: 1.0.0\n  display_name: Example workflow\n  category: game-development\n  stage: design\n  outcome: A playable first scope.\n---\n`;
  const parsed = parseSkillFrontmatter(source);
  assert.equal(parsed.displayName, "Example workflow");
  assert.equal(parsed.category, "game-development");
  assert.equal(parsed.stage, "design");
  assert.equal(parsed.outcome, "A playable first scope.");
  const output = renderCatalog({ skills: [
    { name: "grotto-example", title: parsed.displayName, category: parsed.category, summary: "Example.", path: "skills/grotto-example/SKILL.md", outcome: parsed.outcome },
    { name: "grotto-runtime", title: "Runtime", category: "platform-integration", summary: "Connect.", path: "skills/grotto-runtime/SKILL.md" },
  ] });
  assert.match(output, /## Game development[\s\S]*### Example workflow/);
  assert.match(output, /## Platform integrations[\s\S]*### Runtime/);
  assert.match(output, /Outcome: A playable first scope/);
});

test("frontmatter parser rejects unstructured skill files", () => {
  assert.throws(() => parseSkillFrontmatter("# Missing frontmatter"), /missing YAML frontmatter/);
});
