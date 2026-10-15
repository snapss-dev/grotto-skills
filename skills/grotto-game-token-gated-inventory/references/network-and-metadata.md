# Grotto network, wallet inventory and NFT metadata

## Network and public services

| Setting | Value |
| --- | --- |
| Network | Grotto Mainnet, an EVM-compatible Avalanche L1 |
| Chain ID | `36463` (hex `0x8e6f`) |
| Public JSON-RPC | `https://subnets.avax.network/thegrotto/mainnet/rpc` |
| Native currency | HERESY, 18 decimals |
| Explorer | `https://subnets.avax.network/thegrotto` |
| Public API origin | `https://api.enterthegrotto.xyz` |
| API endpoint reference | [Live API docs](https://api.enterthegrotto.xyz/docs) |
| Browser SDK | `https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js` |

Confirm the RPC's network with `eth_chainId` before reading a collection:

```http
POST https://subnets.avax.network/thegrotto/mainnet/rpc
Content-Type: application/json

{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}
```

The expected `result` is `"0x8e6f"`. Use `finalized` for Grotto contract reads
to avoid querying unfinalized data. Other collections may live on another chain;
bind an entitlement to its network, standard, contract and token ID.

## Choose the ownership integration

| Launch | Ownership source | Grotto requirements |
| --- | --- | --- |
| Game on its own site, reading a connected wallet directly | On-chain ownership on the collection's network | Public RPC reads and public metadata need no Grotto login or reviewed build. The game owns wallet connection and verification. |
| Published Grotto game, including a supported external client | `grotto.getInventory()` | Authenticated Grotto runtime; `inventory:read` is automatic. A nested external client requires a recognized frame and direct trusted-host handoff. |
| Creator-only Connect hosted game preview | Identity and saves only | Inventory is unavailable. Publish a reviewed Grotto build; a hosted wrapper also needs the supported frame handoff. |

For the SDK path, use [the inventory contract](contract.md). The runtime resolves
the player's private, immutable canonical-plus-verified-linked wallet snapshot.
It is not a public arbitrary-wallet lookup. Loading the SDK on an independent
site does not create a Grotto runtime session. See the
[hosting guide](../../grotto-game-runtime-developer-sdk/references/hosting.md)
and [wrapper prerequisites](../../grotto-hosted-game-github-workflow/references/wrapper.md)
for the required direct trusted-host handoff. Forwarded descriptors alone are
rejected by the public SDK's origin checks.

For direct wallet integration, obtain the collection address and token standard
from the project. For known ERC721 token IDs, read `ownerOf(uint256)`; for ERC1155,
read `balanceOf(address,uint256)` or `balanceOfBatch`. Use an indexer, event history
or the collection's supported enumeration interface to discover token IDs;
ERC721 and ERC1155 do not universally expose a list of every token a wallet owns.
Keep token IDs and balances as exact integer strings or `BigInt`.

For valuable game grants, verify wallet control and ownership on a trusted game
backend. Refresh after transfers and before granting value. Public metadata
describes an item; it does not prove that a player owns it.

## Fetch metadata from the Grotto API

Inventory holdings provide `contractAddress`, `tokenId`, `standard` and an
optional `resource` with `id`, `name` and `image`. That resource is a display
summary. Fetch the full metadata when the game needs descriptions, traits or
asset properties. For NFT holdings, these API reads are available:

| Lookup | URL relative to the API origin | Response |
| --- | --- | --- |
| Registered Grotto asset by collection and token ID | `/api/assets/by-token/{collectionAddress}/{tokenId}` | A flat asset JSON object; no `asset` or `data` wrapper. |
| Registered asset by ID, when `classification` is `asset` and `resource.id` exists | `/api/assets/{assetId}` | The same flat asset JSON object. Other resource classifications need their own API. |
| Collection details | `/api/collections/{collectionAddress}` | Collection-level supplemental metadata; this is not token metadata. |
| Cached NFT metadata | `/api/nft-cache/{collectionAddress}/{tokenId}/metadata` | The cached original metadata JSON, if present. |
| Cached NFT image | `/api/nft-cache/{collectionAddress}/{tokenId}` | Image bytes, if present. |

Publicly visible assets and cached NFT data can be read without a bearer token.
Private or unregistered assets may return `404`; an NFT cache miss also returns
`404` and does not fetch or populate the cache. These lookups do not require a
wallet address. Keep runtime credentials out of public metadata requests.

For example, enrich an ERC1155 or ERC721 holding by its collection and token ID:

```js
const API_ORIGIN = 'https://api.enterthegrotto.xyz';

async function fetchAssetMetadata(holding) {
  if (!['ERC1155', 'ERC721'].includes(holding.standard)) return null;
  const collection = encodeURIComponent(holding.contractAddress.toLowerCase());
  const tokenId = encodeURIComponent(String(holding.tokenId));
  const response = await fetch(
    `${API_ORIGIN}/api/assets/by-token/${collection}/${tokenId}`
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Asset metadata HTTP ${response.status}`);
  const asset = await response.json();
  if (asset.collection_address?.toLowerCase() !== holding.contractAddress.toLowerCase()
      || String(asset.token_id) !== String(holding.tokenId)) {
    throw new Error('Asset metadata does not match the requested NFT');
  }
  return asset;
}
```

Asset records can include `id`, `name`, `description`, `image`, `thumbnail_url`,
`collection_address`, `token_id`, `type`, `properties` and `attributes`. Fields
depend on the asset; missing traits or properties must remain missing. `attributes`
commonly uses `{ "trait_type": "...", "value": "..." }` entries. Preserve trait
names and values rather than inventing a universal Grotto trait schema. The
collection's trait vocabulary and its mapping to playable characters are
project-specific.

Resolve API-relative media paths against the API origin, not the game's site:

```js
const imageUrl = asset.image
  ? new URL(asset.image, 'https://api.enterthegrotto.xyz').href
  : null;
```

Apply the same rule to `thumbnail_url`. Absolute HTTPS URLs already identify
their host. For an `ipfs://` reference, resolve it through your configured HTTPS
IPFS gateway. Render metadata as data and text, with safe media handling.
Public metadata/image reads do not grant access to protected downloads;
`/api/assets/download/{assetId}` is a separate authenticated ownership-gated route.

## When the asset API or cache has no metadata

Read the actual URI from the NFT contract on its configured chain:

- ERC721: call `tokenURI(uint256 tokenId)`.
- ERC1155: call `uri(uint256 tokenId)`. If it contains `{id}`, replace that literal
  with the lowercase, 64-character, zero-padded hexadecimal token ID, without `0x`.

Fetch the resolved document and use its `name`, `description`, `image` and
`attributes`. Support the URI scheme the collection returns, including HTTPS,
IPFS or an inline JSON data URI. Use safe, bounded remote fetches on a backend.
If a contract returns only a relative filename, use the collection's declared
metadata base URL or the registered Grotto asset lookup. Do not resolve it
against the game's site or guess that every collection shares one base URL.

Grotto's published ERC721 launches can serve their documents at
`https://api.enterthegrotto.xyz/api/collections/launches/{launchId}/metadata/{tokenId}.json`
and images at
`https://api.enterthegrotto.xyz/api/collections/launches/{launchId}/images/{tokenId}.png`.
Use the contract's returned URI; a launch ID is not a collection address and
cannot be inferred from one. Other collections can use other URI formats.

If metadata remains unavailable, keep an ownership result separate from display
availability. Offer a fallback image/name and avoid enabling a trait-dependent
character until the required metadata is available. A metadata failure must not
fabricate ownership, traits or a valuable entitlement.
