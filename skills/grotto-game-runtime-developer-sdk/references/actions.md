# Player-reviewed Grotto actions

Use `grotto.requestAction(action)` when a game wants the player to buy a
marketplace listing, mint an asset, or buy a crowdfund token. The game supplies
only a Grotto resource identifier and, where relevant, a quantity and exact
base-unit bounds. Grotto resolves the contract and builds the transaction in
the trusted player host. Never ask the game to collect a wallet signature or
send raw calldata.
The call takes no game ID; the trusted runtime session already identifies the
game. Do not make the creator paste an ID into Studio to wire this action.

```js
const grotto = await window.GrottoRuntime.ready();

const result = await grotto.requestAction({
  type: 'marketplace.buyListing',
  listingHash: '0x' + listingHashHex, // 32-byte listing hash
  maxPriceWei: '1000000000000000000', // optional, exact base units
});

if (result.state === 'confirmed') {
  // The chain receipt succeeded. Refresh Grotto inventory or entitlement
  // before granting a durable in-game asset.
} else if (result.state === 'submitted') {
  // A transaction hash exists but its receipt is pending or timed out.
  // Show a pending state and check the final result before retrying.
} else if (result.state === 'unknown') {
  // The wallet outcome could not be determined, possibly after broadcast.
  // Check wallet activity and Grotto entitlement before trying again.
} else if (result.state === 'unfulfilled') {
  // The transaction mined, but Grotto could not prove asset delivery.
  // Gas may have been spent; grant no reward and check wallet activity.
} else if (result.state === 'recovered') {
  // This hash belongs to an earlier request recovered after interruption.
  // Do not treat it as a new purchase or grant a second reward.
} else if (result.state === 'rejected') {
  // The player dismissed Grotto's confirmation.
} else if (result.error?.code === 'PREVIEW_ONLY') {
  // The private creator preview showed a review demo. No payment or asset exists.
} else {
  // Quote, simulation, chain, wallet or transaction failure.
  console.warn(result.error?.message);
}
```

Supported actions:

```js
await grotto.requestAction({
  type: 'marketplace.buyListing',
  listingHash: '0x...',
  maxPriceWei: '...', // optional positive decimal string
});

await grotto.requestAction({
  type: 'collection.mint',
  assetId: 'asset-...', // Grotto marketplace asset ID
  quantity: 1,          // integer from 1 to 50
  maxTotalWei: '...',   // optional nonnegative decimal string; '0' requires a free mint
});

await grotto.requestAction({
  type: 'crowdfund.buy',
  tokenAddress: '0x...', // Grotto crowdfund token contract
  spendWei: '...',       // required positive decimal string
  minTokensOut: '...',   // optional positive decimal string
});
```

The host may decline an action when a verified, enforceable bound cannot be
established. A game must handle that as an unavailable purchase rather than
fall back to its own wallet request. A real `requestAction` purchase is available
only during a Grotto launch with a transaction-capable host, an exact registered
game origin, and `transactions:request` in the runtime scope list. Without that
scope outside creator preview, it returns `failed` with `ACTION_UNAVAILABLE`
immediately, before opening any wallet UI.
Grotto's game, action and global payment controls can also pause real quotes;
the scope is necessary but does not promise that a purchase is available.
Handle an unavailable action in the game UI without asking for raw wallet
calldata or repeatedly opening a payment request.
Before operators widen a real game's permits, each available action needs a
small real-wallet purchase and recovery check. The creator preview, mock result
and simulated browser journey do not activate payments or prove that a real
wallet send and receipt path works.
The initial mint lane requires a verified priced ERC-1155 target, so a
zero-price cap currently returns unavailable.
The current Desktop game host returns `failed` with
`ACTION_UNSUPPORTED_ON_DESKTOP` immediately; it does not open a wallet prompt
for typed actions. Offer the player the same game in Grotto Web if they want
to complete that action.

## Develop without uploading a build

A standalone local page or creator-hosted page can render and test its own
purchase button and a **clearly labeled mock preview** without a Grotto wallet.
For example, route the button through a small game-owned adapter:

```js
async function requestPurchase(action) {
  if (window.top === window) {
    renderLocalActionPreview(action); // Your game's local, non-signing mock UI.
    return { mode: 'preview', message: 'No transaction was sent' };
  }
  const grotto = await window.GrottoRuntime.ready();
  return grotto.requestAction(action);
}
```

Keep mock outcomes in a separate type or state. Never return a fake
`state: 'confirmed'` from a running game or grant a durable purchase from a
local mock. In a local unit test, you can inject a fake confirmed result to
exercise the success UI; keep that fixture out of the deployed game and never
send it to a reward backend as payment proof. To test a
real quote, Grotto confirmation and wallet send, launch the game inside an
authenticated, transaction-capable Grotto player frame from that game's
registered origin. Loading the SDK script on a standalone hosted page does not
grant Grotto auth or transaction authority. A verified creator can instead
[connect a hosted game](hosting.md#try-the-sdk-from-your-own-hosted-game) for a
private, no-upload preview of Grotto identity, cloud saves and the action
review screen. In that preview the SDK sends the same typed action request to
the trusted Grotto host. The demo shows the game-supplied resource and bounds,
not a live price, balance, NFT or token output. It returns `failed` with
`PREVIEW_ONLY`, never `confirmed` or a transaction hash or receipt. No quote,
wallet or transaction is opened, and no asset is delivered. A reviewed Grotto
build is required for real player actions. Do not grant rewards from the demo.

For real typed actions, the trusted Grotto host displays a compact confirmation
of what the player pays and receives. It identifies the requesting game. When
trusted metadata is available, the review can include the exact NFT image,
token and collection links, and an indicative USD estimate from a fresh source
for a known asset. Missing metadata or a price estimate must stay missing
rather than become a guessed asset or value. Network fees and other technical
details remain available separately.

The three current typed actions use native-value payments and do not ask for a
token allowance. If a future action needs an approval, the review must describe
that approval separately from the purchase or transfer.

For a real typed action, Grotto authenticates the game session and records a
payment intent before asking the player's wallet to send. The game cannot
replace the review, choose wallet confirmation behavior, or supply arbitrary
contract calldata. The separate shared Web review for platform transactions
is off by default and also needs working browser storage and Web Locks. When
available, Grotto can use it for selected verified transfers, approvals,
marketplace, mint, crowdfund, auction, Game Pass, Summit BOB, and platform
payment flows. Paid Game Pass V2 self-mints need factory proof; older and free
mints retain Privy confirmation. Opaque or unsupported calls also keep the
Privy wallet prompt; external wallets keep their provider prompt. A failed
verified review blocks before signing. This does not make every contract call
reviewable.

Direct ICTT bridge calls keep wallet-native confirmation. If a provider does
not return a clear result after a possible send, check wallet and bridge
activity before retrying; that path cannot promise exactly one outbound send.

The legacy WrathTank `bobert:tx` route remains gated by its exact build, frame
origin and moderator policy. The current Web v1 relay accepts immutable game
content origins; Bob's Petroleum's external hosted origin is not eligible
today, although its SSO handshake works. When eligible, the relay uses Web
Privy confirmation and remains separate from `requestAction()`. A current-state
simulation and optional USD estimate cannot guarantee a future
chain outcome, asset delivery, or resale value. An unresolved payment may need
recovery in the Grotto host; do not automatically submit another action. The
shared Web hold covers tabs and reloads in one browser profile, while typed
actions use a separate account ledger across devices.

The host keeps the account token and wallet signer; the game receives only its
existing game-scoped runtime session and an action result. Player-controlled
amounts must be decimal strings, never JavaScript numbers, to preserve exact
base units. The game cannot supply a contract target, selector, calldata,
arbitrary value transfer, recipient or approval allowance.

`confirmed` means the transaction receipt succeeded, not that an indexer has
already reflected ownership. `submitted` means a hash exists but the final
chain outcome is pending. `unknown` means the wallet may have broadcast a
transaction without returning its hash. Neither state means the purchase is
complete, and neither is safe to retry automatically. A result has `ok: true`
only for verified `confirmed` delivery; `submitted` has `ok: false` even with a
hash. Never grant a reward from `ok` or a hash alone: check
`state === 'confirmed'` and Grotto's authoritative entitlement. A request can
also reject with `ACTION_OUTCOME_UNKNOWN` if the host does not
answer; show the same pending/recheck guidance.
`unfulfilled` means the transaction mined successfully but expected token or
NFT delivery was not proven, such as a crowdfund buy refunded at graduation.
The player may have paid network gas. Grant no game reward and explain the
unfulfilled result separately from a reverted transaction.
`recovered` reports the success or revert of a **previous** request after an
interruption. Its hash is not a new purchase for the current button press.
Deduplicate by transaction hash and authoritative entitlement before granting
anything. A previously submitted hash may also still be pending; a repeated
request must not trigger a second payment while that status is unresolved.

A page outside Grotto could imitate a client-side result. For valuable game
rewards, verify the receipt and resulting ownership on your server through
trusted Grotto or chain data. Never accept the game's own claim that an action
was confirmed as proof of payment.
