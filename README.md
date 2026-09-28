# Grotto Skills

Public skill repository for The Grotto developer ecosystem.

This repo is intentionally simple: each skill lives under `skills/<skill-name>/` with a `SKILL.md` entry point plus optional `templates/`, `references/`, and `assets/`.

Game development covers design, production, architecture, levels, combat,
progression, controls, art, animation, audio, accessibility, playtesting and safe
iteration. Platform integrations cover runtime services, ownership gates and
explicitly external hosting. Start with the decision you need to make; there is
no requirement to load the whole collection.

## Use skills as recurring workflows

A skill is a development practice you return to as the game evolves. Each
router states when to repeat it, what context to bring and what to carry forward.
Its `references/workflow.md` gives a focused cycle with domain-specific decisions,
verification and a reusable record. Detailed implementation and repair references
remain available inside that cycle.

Start with the last pass's decisions and evidence when available. Choose one
question, develop it, test the actual result, then retain the updated decisions,
observations and next question in an existing project note or handoff. Revisit
level design when controller assumptions change; revisit input recovery when
new actions appear; replay the saved seed corpus when generation rules change.
Do the checks relevant to the current change rather than rerunning every guide.

One request runs one focused pass. The record makes the next pass useful without
scheduling builds, spending a new budget or publishing automatically.

## Included skills

<!-- generated-skill-catalog:start -->

## Game development



### Three.js worlds

Path: `skills/grotto-3d-scene-builder/SKILL.md`

Develop Three.js game scenes through recurring spatial, controller, model and rendering-cost passes using the installed Studio foundation.

Outcome: A readable 3D world with coherent cameras, collision and model placement.

Repeat: For each scene or model batch, and when camera, controller, collision or rendering changes.

Carry forward: Spatial and collision conventions, model bindings and measured representative scene baselines.

### Combat and enemy behavior

Path: `skills/grotto-combat-and-enemies/SKILL.md`

Develop combat and enemy behavior in repeated encounter passes covering attack rules, telegraphs, decisions, navigation and player readability.

Outcome: Predictable hit rules and enemies with readable, purposeful behavior.

Repeat: For each enemy or encounter, and after attack, camera, movement or damage changes.

Carry forward: Attack phase contracts, enemy-role decisions and reproducible encounter cases.

### Core game design

Path: `skills/grotto-core-of-gaming/SKILL.md`

Develop and revisit a game’s player fantasy, core loop, meaningful choices and learning rhythm through repeated playtest-led design passes.

Outcome: A clear player fantasy, meaningful choices and a complete playable loop.

Repeat: After testing the core loop, or when verbs, goals, challenge or progression change.

Carry forward: A concise loop description, design hypotheses, observed player choices and the next experiment.

### Cross-device controls

Path: `skills/grotto-cross-device-controls/SKILL.md`

Maintain desktop and touch controls through recurring action-map, layout, multitouch and input-recovery passes as mechanics evolve.

Outcome: Keyboard, pointer and touch actions that recover cleanly after interruptions.

Repeat: Whenever player actions, camera framing, HUD layout or device support changes.

Carry forward: Action bindings, device coverage, layout constraints and interruption replay cases.

### Character animation

Path: `skills/grotto-game-animation/SKILL.md`

Iterate character animation through recurring asset, state-transition, timing and interruption passes at gameplay scale.

Outcome: Stable pivots, responsive transitions and frame-rate-independent clips.

Repeat: When clips, sprite sheets, movement states, facing or interruption rules change.

Carry forward: An animation-state map, timing decisions, asset bindings and interruption scenarios.

### Game architecture

Path: `skills/grotto-game-architecture/SKILL.md`

Evolve game state, simulation timing and lifecycle ownership through planned system passes, with repeatable pause, restart and loading checks.

Outcome: One owner for game state, consistent timing and clean restart lifecycles.

Repeat: When a system, state transition, asynchronous task or restart path changes.

Carry forward: An ownership map, transition decisions and reproducible lifecycle scenarios.

### Art direction and asset planning

Path: `skills/grotto-game-art-direction/SKILL.md`

Maintain a game’s visual direction through recurring representative asset reviews, budget planning and integration at gameplay scale.

Outcome: A consistent visual direction and a verified, budgeted asset set.

Repeat: At each asset batch or milestone, and when camera, palette or visual scope changes.

Carry forward: A visual-system decision sheet, asset provenance and an updated asset plan.

### Game audio

Path: `skills/grotto-game-audio/SKILL.md`

Iterate a game’s cue map, mix and browser playback lifecycle through recurring audio passes that respect creator intent and run budget.

Outcome: Intentional sound with working mute, startup, mixing and teardown.

Repeat: When game events, audio assets, mix priorities or playback lifecycle change.

Carry forward: The cue map, mix priorities, mute behavior and browser playback test cases.

### Game feel and feedback

Path: `skills/grotto-game-feel-juice/SKILL.md`

Refine game responsiveness and feedback through repeated hypothesis-driven tuning passes on movement, combat and rewards.

Outcome: Responsive actions and readable effects that fit the intended style.

Repeat: After movement, combat, reward or feedback changes, and when playtests reveal weak response.

Carry forward: Parameter snapshots, feedback priorities and comparable action/recovery test cases.

### Playtesting and performance

Path: `skills/grotto-game-playtest/SKILL.md`

Run repeatable browser playtest and performance passes, preserving scenarios and findings across milestones, devices and revisions.

Outcome: Reproducible findings from actual play, recovery and measured performance.

Repeat: Before a milestone or release, and after changes to the playable loop or recovery paths.

Carry forward: A scenario suite, evidence-linked findings, measured baselines and the next review scope.

### Game production and iteration

Path: `skills/grotto-game-production/SKILL.md`

Run a recurring Studio production cycle: review the current build, choose the next risk or milestone, develop a playable slice and carry playtest evidence forward.

Outcome: A scoped playable slice, clear risks and an evidence-backed iteration plan.

Repeat: At each milestone, after a playtest, or when scope and priorities change.

Carry forward: The scope decision, tested build revision, findings and one next learning question.

### Game UI and accessibility

Path: `skills/grotto-game-ui-accessibility/SKILL.md`

Evolve HUDs, menus and accessible interactions through recurring task, device, focus and assist-setting reviews.

Outcome: Menus and game information usable across input, motion and audio preferences.

Repeat: After adding a player task, changing the HUD or menus, or introducing new input and assist settings.

Carry forward: A task/input matrix, focus rules, assist-setting decisions and reproducible access checks.

### Level design and pacing

Path: `skills/grotto-level-design/SKILL.md`

Iterate authored levels through layout, mechanic teaching, pacing and observed traversal or puzzle playtests.

Outcome: Readable spaces, purposeful encounters and reachable recovery paths.

Repeat: For each new level, or after changes to movement, encounters, checkpoints or teaching.

Carry forward: A route and teaching plan, pacing notes, observed failure points and replay scenarios.

### Phaser 2D games

Path: `skills/grotto-phaser-2d-builder/SKILL.md`

Build and evolve a Studio Phaser game through repeated scene, physics, input and asset integration passes using the installed foundation.

Outcome: A working 2D game with deliberate scenes, physics and state ownership.

Repeat: For each new 2D capability, scene or asset batch, and after changes to physics or input.

Carry forward: Scene and physics decisions, asset bindings and a small playable regression route.

### Pixel art and raster assets

Path: `skills/grotto-pixel-art-assets/SKILL.md`

Produce and integrate pixel art through repeatable asset batches with consistent palette, scale, anchors and actual gameplay inspection.

Outcome: Consistent, readable sprites and textures connected to real asset files.

Repeat: For each sprite or tile batch, and when palette, camera scale or asset technique changes.

Carry forward: Palette and scale conventions, reproducible asset recipes and integration/provenance notes.

### Procedural worlds

Path: `skills/grotto-procedural-generation/SKILL.md`

Evolve seeded worlds through recurring generator, validity and fairness passes with retained seeds and explicit generator revisions.

Outcome: Reproducible worlds validated against the actual movement rules.

Repeat: When generation rules, movement assumptions, content pools or difficulty change.

Carry forward: Generator/version decisions, seed coverage, validity constraints and failing seed cases.

### Progression and balance

Path: `skills/grotto-progression-and-balance/SKILL.md`

Tune progression through recurring scenario-based passes on resource flows, unlocks, player choices and saved-state compatibility.

Outcome: Useful unlocks and resource rules tuned against representative play.

Repeat: When rewards, costs, unlocks, difficulty or saved progression change.

Carry forward: A parameter snapshot, scenario results, reward invariants and the next balance hypothesis.

### Safe game updates

Path: `skills/grotto-studio-game-updates/SKILL.md`

Run a repeatable Studio update cycle that preserves game identity, save compatibility, review evidence and publication history.

Outcome: A verified update that preserves game identity and existing progress.

Repeat: For each requested game update, save-schema change or rollback decision.

Carry forward: The change decision, save migration checks, accepted revision and verified publication state.

## Platform integrations



### Runtime SDK

Path: `skills/grotto-game-runtime-developer-sdk/SKILL.md`

Maintain Grotto identity, saves, scores and capability-scoped services through recurring integration and contract-verification passes.

Outcome: Trusted identity, version-aware cloud saves and capability-scoped services.

Repeat: When a service contract, SDK usage, save schema or capability requirement changes.

Carry forward: Service requirements, save-version decisions and contract/recovery cases.

### Token-gated inventory

Path: `skills/grotto-game-token-gated-inventory/SKILL.md`

Maintain optional ownership gates through repeated entitlement, freshness and failure-case reviews when game content or inventory requirements change.

Outcome: Ownership gates that handle missing capabilities and stale inventory safely.

Repeat: When gated content, entitlement rules, caching or platform inventory contracts change.

Carry forward: Non-secret gate definitions, freshness rules and reproducible entitlement test cases.

### External hosting and GitHub

Path: `skills/grotto-hosted-game-github-workflow/SKILL.md`

Run recurring release and rollback workflows for explicitly external hosted game clients with a trusted Grotto runtime wrapper.

Outcome: A durable external game client with a secure runtime wrapper and release checks.

Repeat: For each authorized external client release, wrapper change or rollback.

Carry forward: Client/wrapper revisions, origin decisions, release evidence and verified rollback state.

<!-- generated-skill-catalog:end -->

Public SDK URL:

```html
<script src="https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js"></script>
```

Public Grotto skills page:

https://www.enterthegrotto.xyz/skills

Live Grotto API docs:

https://api.enterthegrotto.xyz/docs

This repository publishes complete skill packages. Keep each skill folder, including references and templates, when installing or sharing it. A raw SKILL.md alone is only the entrypoint. The generated relevance manifest identifies each version and the SHA-256 of every resource.

Studio's minimal-start experiment uses a separate documentation-only projection
of this release: skill routers and Markdown capability references. Template files
remain preserved in the public package for history and compatibility, but Studio
builds neither advertise nor retrieve them. Capability references describe APIs
and design choices without supplying a ready-made game.

## Repository layout

```text
skills/
  grotto-game-runtime-developer-sdk/
    SKILL.md
    references/
      sdk-contract.md
    templates/
      minimal-runtime-game.html
assets/
  grotto-game-runtime-developer-sdk/
    grotto-runtime-sdk-ad-redo.png
  grotto-game-token-gated-inventory/
    grotto-game-token-gated-inventory-ad.png
    grotto-game-token-gated-inventory-ad.svg
  grotto-hosted-game-github-workflow/
    grotto-hosted-game-github-workflow-ad.png
    grotto-hosted-game-github-workflow-ad.svg
relevance/
  manifest.json
```

## Contributing

Open a pull request to add or update a skill. Keep skills creator-facing, practical, and free of private credentials.

Discovery display names, collection, stage, expected outcomes, `repeat_when`,
`inputs` and `carry_forward` live in each skill's metadata alongside its version.
Maintain the workflow reference and these fields together when a skill's cycle
changes.

Run `npm test` before opening the PR. The zero-dependency validator checks the
manifest, generated README catalog, frontmatter, relationships, links, template
syntax, resource hashes, and credential-shaped values. Run npm run generate:readme after a content or discovery change; it generates both the manifest and README from the skill folders. Edit names, descriptions and tags in SKILL.md; keep selective symptom phrases and reference-only exceptions in relevance/routing.json. Bump the skill version whenever its content changes.

### Safety rules

- Do not commit API keys, bearer tokens, Privy secrets, Railway/Vercel tokens, `gst_*`, or `grs_*` values.
- Redact secrets as `[REDACTED]`.
- Prefer runnable examples and explicit security notes.
- Keep Grotto identity/session guidance clear: games should not trust wallet/user IDs supplied by client-side code.
- Treat optional inventory/multiplayer scopes as explicit per-game platform capabilities.
- Treat `roomId=public` as routing only and atomically consume each multiplayer ticket `jti` once.

## PR watch

This repo is watched for pull requests by Bob/Hermes so skill contributions can be triaged quickly.

## Evaluate a change

The package tests run the frame-clock and seeded-world recipes as code. They
also check the generated catalog and references. These checks establish
specific invariants; they do not establish that an agent makes a better game.

Use the scenarios in [evals/scenarios.json](evals/scenarios.json) for independent
forward tests. Give the agent the request, the skill package and any raw fixture;
do not reveal the expected answer. Record revision, model/configuration,
resources read, completion/cost/time, observable failures and actual browser
evidence. Compare the same scenarios and settings across revisions, and retain
failures. Human playtest judgment is needed for style, readability and fun.

Scenarios with `followUpRequests` are sequential workflow evaluations. Feed each
pass's actual build and iteration record into the next request. Retain failures
and compare decisions, carried evidence and observable behavior across passes;
do not fabricate a successful earlier pass to make the follow-up look complete.

Studio separately runs a creator-request routing benchmark and guarded
retrieval/protocol tests. Selection accuracy, working recipes, actual generated
game behavior and production activation are different evidence.

## Publish and verify

Publish the complete folder tree and generated manifest together. Deploy a
reader that supports references before publishing routed guides. Schema 2 adds
versions and resource hashes; current Studio readers use their bundled release
when a remote is legacy, older, invalid or initially unavailable. Runs pin one
release so pagination and later references cannot silently change underneath
them.

After publishing, run node scripts/check-public-release.mjs. It compares the
public manifest and every advertised resource against this checkout. A source
merge or a matching version label alone is insufficient.
