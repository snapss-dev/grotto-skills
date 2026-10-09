# Setup pass

Grotto's base integration already authenticates the player, checks game access
and creates a scoped `grs_*` runtime session. Browser games receive it through
`grotto:runtime:hello` / `grotto:runtime`; Unreal Windows exchanges Desktop's
private single-use launch ticket for the same runtime authority. Neither adapter
adds a Privy login or wallet-signing step. Native v1 uses only identity, saves,
presence and events. Inventory is a default authenticated runtime scope without
operator setup; optional multiplayer authorization remains separate.

For browser wrappers, preserve the existing credential-recipient checks. The
founder/selected-game descendant exception and legacy `bobert:hello` reply are
compatibility policies for receiving the same scoped session, not a prerequisite
for base SSO. Do not copy that exception into native admission or expand it.
Use the Runtime SDK's [identity](../../grotto-game-runtime-developer-sdk/references/identity-and-boot.md)
and [hosting](../../grotto-game-runtime-developer-sdk/references/hosting.md)
guides, and the hosted-game [wrapper contract](../../grotto-hosted-game-github-workflow/references/wrapper.md)
when the selected adapter is browser-based.

Start with the actual engine/platform, current Studio project or approved game,
release archive if one exists, and existing save schema. For Studio or a browser
game, use the host-supplied SDK session: its game ID is available as
`(await window.GrottoRuntime.ready()).runtime.gameId` if another integration
explicitly needs the public ID. The SDK already binds identity, saves, events
and actions to that session; do not ask the creator for an ID or pass one to
those calls. Never copy or log the whole runtime descriptor or its secret
`sessionId`. A Studio project ID is not the canonical game ID, and an
unpublished project may not have a published game ID yet.

For Unreal Windows, `InitializeGrotto(canonicalGameId)` does need the exact
approved Platform game ID in public build configuration. Obtain it from the
approved game/release record, not from a Studio project ID or a guessed slug.
Reuse the previous adapter and acceptance record when available. An
engine/platform change requires the corresponding implemented adapter;
unsupported native targets stay unsupported.

Read the selected adapter reference, integrate its startup/lifecycle entrypoints,
then exercise the changed behavior with fixture identity first. Keep verified
local play available during admission or network failure. Repeat account rotation,
revocation, relaunch and save-conflict cases when their owners change.

Record the adapter/version, engine/OS/toolchain, archive SHA-256, version/channel,
actual launchPath, save namespace/schema, conflict decision and observed checks.
Distinguish source review, compilation, fixture execution and packaged-game
acceptance. Carry unresolved cases and the next concrete integration step into
the existing project note. A setup pass does not schedule builds, publish,
activate a release, accept licenses or grant a new spending budget.
