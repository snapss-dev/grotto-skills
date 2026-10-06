---
name: grotto-game-setup
description: "Connect a game to Grotto player identity, cloud saves and events using the adapter for its engine; use for initial setup or a change of engine or launch target."
license: MIT
metadata:
  display_name: "Grotto Game Setup"
  category: platform-integration
  stage: connect
  outcome: "An engine-appropriate runtime connection with explicit offline and session recovery behavior."
  repeat_when: "When the engine, target platform, runtime contract or launch packaging changes."
  inputs: "Engine, platform, canonical Grotto game ID, release archive and existing save schema."
  carry_forward: "Adapter choice, exact build identity and tested account/save lifecycle cases."
  version: 0.1.0
  author: The Grotto
  hermes:
    tags: [grotto, setup, unreal, windows, identity, runtime-sdk, cloud-saves, native]
    related_skills: [grotto-game-runtime-developer-sdk]
---

# Grotto Game Setup

Choose the adapter from the actual runtime, not the game's marketing label.
For a new or changed integration, use the [setup pass](references/workflow.md)
to carry build identity and observed recovery behavior into the next iteration.

| Target | Adapter |
| --- | --- |
| Browser JavaScript, Three.js, or the maintained WebGL wrapper | Use the existing [Runtime SDK](../grotto-game-runtime-developer-sdk/SKILL.md) and its engine/hosting references. |
| Unreal C++ / Blueprint, Windows x64 | Read [Unreal Windows](references/unreal-windows.md); copy the bundled [GrottoRuntime plugin](assets/unreal/GrottoRuntime/GrottoRuntime.uplugin). |
| Native Unity, Godot, custom C++, macOS, Linux, consoles or mobile | Unsupported until a native adapter and platform acceptance checks exist. Do not wrap browser postMessage/localStorage APIs or invent a second Privy login. |

Keep startup playable without network readiness. Authenticated native identity
comes from Desktop's private launch ticket, exchanged for one account/game/build
session. Platform credentials and wallet authorization remain with Desktop.
Never put a ticket or bearer in arguments, environment variables, URLs, logs,
Blueprint properties, save files or source configuration.

Record the selected adapter, build hash/version/channel, save schema, offline
namespace, conflict decisions and observed verification. Re-run the relevant
launch/account/save cases when those contracts change. This skill does not
authorize publication, release activation, engine installation or spending.
