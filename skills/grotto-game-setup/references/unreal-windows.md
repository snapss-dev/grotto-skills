# Unreal Windows adapter

The bundled `assets/unreal/GrottoRuntime` is a Windows x64 runtime C++ plugin.
Copy that folder into `<Project>/Plugins/`, enable GrottoRuntime in the `.uproject`,
and add `GrottoRuntime` to a C++ game module's dependencies. Build with the
project's installed Unreal/MSVC tools. Other native engines/platforms have no adapter.

At GameInstance startup, get **GrottoRuntimeSubsystem**, bind **OnSessionChanged**
and **OnResponse**, then call **InitializeGrotto(canonicalGameId)** exactly once.
The expected game ID is public build configuration. Do not configure a player,
ticket, token, Privy app secret or wallet. Gameplay begins immediately; network
completion never gates input or level creation.

Desktop verifies the complete install tree and asks Platform to admit the
exact archive SHA-256, version and channel in Distribution's published,
scan-filtered catalog. It passes a single JSON frame through inherited stdin.
Select the actual `<Project>/Binaries/Win64/<Project>-Win64-Shipping.exe` as the
approved build's launchPath: bootstrap executables that discard inherited stdin
cannot authenticate. Do not substitute a named pipe URL/argument or save-file
handoff. Packaged-game acceptance must verify that launchPath retains the pipe.

The plugin accepts the production HTTPS API origin. Non-Shipping builds also
accept an exact `http://127.0.0.1:<port>` fixture server. WinHTTP verifies TLS,
disables redirects, bounds bodies and uses worker threads. No Privy library,
general account API or signing interface runs in the game.

Native v1 receives the base `identity:read`, `save:read`, `save:write`,
`presence:write` and `events:write` scopes. Browser inventory/multiplayer
allowlists do not add capabilities to this adapter. Desktop and Platform reuse
the existing authenticated account snapshot and runtime APIs; this is an engine
transport adapter for base SSO, not a separate identity system.

## Blueprint flow

- **Authenticated**: `GetPlayer()` returns public canonical ID, name and avatar.
  Load the desired slot with `ReadSave(slot, requestId)`. Apply hydration only if
  local progress has not changed in the meantime.
- `WriteSave(slot, baseVersion, stateJson, requestId)` writes an object/array
  against the version returned by the server. A 409 response contains
  `serverVersion` and `serverState`; keep both versions and ask the game/player
  to choose or merge. Do not overwrite using a guessed version.
- `SendEvent(type, payloadJson, requestId)` sends bounded JSON object events.
  Outcomes/rewards remain server-authoritative. Heartbeat runs every 30 seconds;
  it extends idle expiry within the backend's fixed absolute lifetime.
- **Offline** includes standalone launch, signed-out Desktop, missing/expired
  ticket, interrupted exchange, server failure, logout and launcher death.
  Clear account UI/hydration work on the event. Continue local gameplay using
  `ReadLocalSave`/`WriteLocalSave`; no automatic cloud merge/upload occurs.
- **EndSession** clears identity and ends the game session. Subsystem shutdown
  calls it too. An account change requires a new game process and fresh Desktop
  admission; InitializeGrotto cannot replace identity in an existing process.

Local saves use `Saved/Grotto/<gameId>/<canonicalPlayerId>/<slot>.json` only while
authenticated, and a separate `offline` namespace otherwise. Do not import old
unscoped caches. Never serialize `GetSessionState` callbacks as credentials;
the plugin deliberately keeps its token out of reflection and response events.

## Contract harness and acceptance

The monorepo contract harness runs with fixture identity, no real login and
outbound network denied:

```
cd services/platform
node scripts/run-test-tier.js hermetic src/tests/native-game-launch.test.js
```

Desktop's automatically discovered `tests/native-game-launch.test.ts` exercises
admission, account rotation, process pipes and cleanup. `assets/example/` has a
small Unreal project and a local fixture runner for the real compiled plugin.
The harness is evidence of the adapter contract, not native marketplace approval.

Copy `assets/example` into a local project folder and the plugin into its
`Plugins/GrottoRuntime`. Build the example with the installed engine's Build
script, then cook/stage it with `RunUAT BuildCookRun` for Win64 Development and
the `/Engine/Maps/Entry` map. Run:

```
node contract-harness.mjs <actual-packaged-game.exe>
```

The runner verifies authenticated saves/conflicts/events/end, closed-pipe
offline launch, standalone launch without a pipe, authenticated pipe loss, and
wrong-game frame refusal before exchange (including a failing example exit status).
The example also reads public `[GrottoContractFixture] Scenario=...` config
from Game.ini and writes `Saved/grotto-contract-receipt.json` containing only
scenario and pass/fail. A failing check exits nonzero. Use this receipt for
Shipping builds with logs disabled and Desktop's empty-argument launch path;
never put credentials in fixture config. Scenario config is test-only.
For an authorized signed-in acceptance run, set the public `GameId`,
`ExpectedPlayerId` and a fresh `SaveSlot` in the same fixture section before
packaging. `GameId` must be the server-assigned test game ID; `ExpectedPlayerId`
only checks the resulting public player identity and grants no access. A fresh
slot keeps repeat tests from overwriting existing progress. Keep
`Scenario=authenticated`, so an offline fallback fails authenticated acceptance.
For an Editor game run, append the example's `.uproject` and use
`UnrealEditor-Cmd.exe`. Shipping intentionally rejects the loopback fixture;
its authenticated acceptance needs the real production-origin service in an
authorized integration environment.

Verify authenticated launch without another login, signed-out/standalone/offline
launch, account switch/logout, wrong/expired/replayed tickets, conflict handling,
interrupted exchange, launcher/game crash and relaunch. Record engine/OS/toolchain,
exact packaged build hash and actual launchPath. Compilation alone does not
establish gameplay, distribution scanning, installation or Shipping acceptance.
Package release games so engine config/logs/saves are written to the normal
Windows user save directory, outside the verified install tree. Development's
default project-relative Saved folder can invalidate that tree. Check a second
launch after saving; keep the launcher's integrity checks enabled.

Native code runs as the Windows user. This pipe isolates launcher authority
from game code; it does not sandbox third-party executables from same-user
files/processes. A hostile game can exfiltrate its own scoped bearer, so backend
scope checks, current build approval, launcher leases and revocation stay
authoritative. Valuable state and wallet consent require separate server/host
authorization.
