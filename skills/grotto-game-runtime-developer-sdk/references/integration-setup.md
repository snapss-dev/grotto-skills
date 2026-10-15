# Grotto integration setup

Start here when an agent is given [the skills page](https://www.enterthegrotto.xyz/skills).
These guides provide the shared platform settings and contracts. Obtain the
game's engine, hosted URL, collection addresses, save schema and gameplay rules
from its project; do not ask the creator to locate Grotto's public APIs, SDK,
chain settings or response formats.

## Choose a launch path

| Target | What works | Start with |
| --- | --- | --- |
| Studio browser game | Installed runtime helpers; authenticated services in the Grotto player. The authoring canvas starts locally. | [Runtime SDK](../../grotto-game-runtime-developer-sdk/SKILL.md) |
| Uploaded HTML/ZIP game | Include the official SDK, keep `index.html` at the ZIP root, and launch the reviewed build through Grotto. | [Identity and boot](../../grotto-game-runtime-developer-sdk/references/identity-and-boot.md), then [packaging](../../grotto-game-runtime-developer-sdk/references/packaging.md) |
| HTTPS client, creator preview | Connect hosted game reserves its game ID and tests identity/saves without uploading a build. Preview sessions cannot grant player inventory, scores, rooms or payments. | [Hosted preview](../../grotto-game-runtime-developer-sdk/references/hosting.md#try-the-sdk-from-your-own-hosted-game) |
| Published external client inside a wrapper | Requires a host-recognized frame/origin and a direct trusted-host SDK handoff. A reviewed wrapper and forwarded messages alone do not establish that transport. | [Wrapper prerequisites](../../grotto-hosted-game-github-workflow/references/wrapper.md) |
| Independent website reading connected-wallet NFTs | Public chain ownership and metadata reads need no Grotto login. The game owns wallet verification. | [Network and metadata](../../grotto-game-token-gated-inventory/references/network-and-metadata.md) |
| Unreal Windows x64 | Bundled native beta adapter, compatible Desktop/Platform release, and approved exact archive. | [Game Setup](../../grotto-game-setup/SKILL.md) and [Unreal Windows](../../grotto-game-setup/references/unreal-windows.md) |
| Other native engines/platforms | No maintained native adapter. Compatible browser/WebGL exports use the browser path. | [Supported adapters](../../grotto-game-setup/SKILL.md) |

For browser clients outside Studio, load
`https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js`. The runtime API
base is `https://api.enterthegrotto.xyz/api/game-runtime/v1`; route calls use
the scoped `grs_*` bearer supplied by the trusted host. Loading the script on
an independent site does not authenticate a player. Start rendering/input
before calling `GrottoRuntime.ready()` in background work.

Most SDK calls need no game ID. If another system needs it, read
`client.runtime.gameId` after launch or the authorized saved-game/preview record
as explained in [identity and boot](../../grotto-game-runtime-developer-sdk/references/identity-and-boot.md).
Copy only the public ID, never the secret session descriptor. A Studio project
ID is a different identifier.

## Connect the required service

| Need | Complete reference |
| --- | --- |
| Cloud saves, slot/size limits, conflicts, local fallback and scores | [Saves and scores](../../grotto-game-runtime-developer-sdk/references/saves-and-scores.md) |
| Keep an existing game backend/database without another player login | [Private backend verification](../../grotto-game-runtime-developer-sdk/references/private-backend.md) |
| Chain ID/RPC, holdings, NFT metadata, images and traits | [Network and metadata](../../grotto-game-token-gated-inventory/references/network-and-metadata.md) and [inventory contract](../../grotto-game-token-gated-inventory/references/contract.md) |
| Free Grotto-managed rooms, presence, shared state, conflicts and limits | [Managed rooms](../../grotto-game-runtime-developer-sdk/references/capabilities.md#grotto-hosted-multiplayer) |
| External authoritative realtime server | [Ticket verification and prerequisites](../../grotto-hosted-game-github-workflow/references/capabilities.md) |
| Purchases, minting, tips and registered operations | [Reviewed actions](../../grotto-game-runtime-developer-sdk/references/actions.md) |
| TypeScript method/response types | [SDK contract](../../grotto-game-runtime-developer-sdk/references/sdk-contract.md) |
| HTTP endpoints, scope requirements and error recovery | [API and errors](../../grotto-game-runtime-developer-sdk/references/api-and-errors.md) |
| External deploys, embedding headers, acceptance and rollback | [Wrapper](../../grotto-hosted-game-github-workflow/references/wrapper.md) and [delivery](../../grotto-hosted-game-github-workflow/references/delivery.md) |

Ordinary published browser sessions receive identity, saves, events, inventory
and `rooms:join`. External-server `multiplayer:join` requires platform policy
for the exact game ID. Real payments also require a transaction-capable Web host,
the exact registered frame origin, the advertised action and current payment
controls. Preview success does not activate these features. Read received
scopes and handle unavailable capabilities while local play continues.
The Unreal plugin exposes its documented native methods; browser method names
are not native adapter methods.

## Finish the integration

Verify the chosen launch path, an authenticated identity/save round trip,
refresh after a real progress change, slow hydration, offline/reconnect, save
conflict, expiry and account change. For wrappers, prove the direct trusted-host
handoff with the actual hosted frame; `postMessage` string matches are insufficient.
Check requested optional capabilities separately and report their exact
prerequisites. Payment fixtures, real payment activation and actual player
purchases establish different things.

Keep credentials out of URLs, logs, analytics, saves and committed artifacts.
Grotto authenticates accounts and stores/synchronizes data. A score submission,
shared-room update or cloud save does not validate custom gameplay or authorize
a valuable reward. Implement that authority in the game's trusted backend.
