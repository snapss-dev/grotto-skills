import assert from "node:assert/strict";
import test from "node:test";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";

import {
  catalogEnd,
  catalogStart,
  buildManifest,
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
    repeatWhen: null,
    inputs: null,
    carryForward: null,
    version: '1.0.0',
    hasVersion: true,
    hasLicense: true
  });
});

test("catalog groups creator workflows separately from platform integrations", () => {
  const source = `---\nname: grotto-example\ndescription: Example.\nlicense: MIT\nmetadata:\n  version: 1.0.0\n  display_name: Example workflow\n  category: game-development\n  stage: design\n  outcome: A playable first scope.\n  repeat_when: After a playtest.\n  inputs: Current build and findings.\n  carry_forward: Tested decisions and the next question.\n---\n`;
  const parsed = parseSkillFrontmatter(source);
  assert.equal(parsed.displayName, "Example workflow");
  assert.equal(parsed.category, "game-development");
  assert.equal(parsed.stage, "design");
  assert.equal(parsed.outcome, "A playable first scope.");
  assert.equal(parsed.repeatWhen, "After a playtest.");
  assert.equal(parsed.inputs, "Current build and findings.");
  assert.equal(parsed.carryForward, "Tested decisions and the next question.");
  const output = renderCatalog({ skills: [
    { name: "grotto-example", title: parsed.displayName, category: parsed.category, summary: "Example.", path: "skills/grotto-example/SKILL.md", outcome: parsed.outcome, repeatWhen: parsed.repeatWhen, carryForward: parsed.carryForward },
    { name: "grotto-runtime", title: "Runtime", category: "platform-integration", summary: "Connect.", path: "skills/grotto-runtime/SKILL.md" },
  ] });
  assert.match(output, /## Game development[\s\S]*### Example workflow/);
  assert.match(output, /## Platform integrations[\s\S]*### Runtime/);
  assert.match(output, /Outcome: A playable first scope/);
  assert.match(output, /Repeat: After a playtest/);
  assert.match(output, /Carry forward: Tested decisions and the next question/);
});

test("frontmatter parser rejects unstructured skill files", () => {
  assert.throws(() => parseSkillFrontmatter("# Missing frontmatter"), /missing YAML frontmatter/);
});

test("publication rejects incomplete workflow context or an empty cycle reference", t => {
  const root = mkdtempSync(join(tmpdir(), 'grotto-workflow-catalog-'));
  t.after(() => { assert.equal(dirname(root), resolve(tmpdir())); rmSync(root, { recursive: true, force: true }); });
  mkdirSync(join(root, 'relevance'));
  mkdirSync(join(root, 'skills/grotto-example/references'), { recursive: true });
  writeFileSync(join(root, 'relevance/routing.json'), '{}');
  const routerPath = join(root, 'skills/grotto-example/SKILL.md');
  const cyclePath = join(root, 'skills/grotto-example/references/workflow.md');
  const source = `---\nname: grotto-example\ndescription: Develop a loop.\nlicense: MIT\nmetadata:\n  version: 1.0.0\n  display_name: Loop workflow\n  category: game-development\n  stage: design\n  outcome: A tested loop.\n  repeat_when: After a playtest.\n  inputs: Current build and findings.\n  carry_forward: The next hypothesis.\n---\n# Loop\n`;
  writeFileSync(routerPath, source);
  writeFileSync(cyclePath, '# Repeatable cycle\n');
  assert.equal(buildManifest(root).skills[0].repeatWhen, 'After a playtest.');
  writeFileSync(routerPath, source.replace('  inputs: Current build and findings.\n', ''));
  assert.throws(() => buildManifest(root), /repeat, input and carry-forward/);
  writeFileSync(routerPath, source.replace('The next hypothesis.', 'x'.repeat(241)));
  assert.throws(() => buildManifest(root), /repeat, input and carry-forward/);
  writeFileSync(routerPath, source);
  writeFileSync(cyclePath, '');
  assert.throws(() => buildManifest(root), /workflow reference/);
});
