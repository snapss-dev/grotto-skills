# Player-reviewed Grotto actions

Use `grotto.requestAction(action)` when a game wants the player to buy a
marketplace listing, mint an asset, or buy a crowdfund token. The game supplies
only a Grotto resource identifier and, where relevant, a quantity and exact
base-unit bounds. Grotto resolves the contract and builds the transaction in
the trusted player host. Never ask the game to collect a wallet signature or
send raw calldata.

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
fall back to its own wallet request. `requestAction` is available only during
a Grotto launch with a transaction-capable host and an exact registered game
origin. Without `transactions:request` in the runtime scope list, it returns
`failed` with `ACTION_UNAVAILABLE` immediately, before opening any wallet UI.
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
`state: 'confirmed'` or grant a durable purchase from a local mock. To test a
real quote, Grotto confirmation and wallet send, launch the game inside an
authenticated, transaction-capable Grotto player frame from that game's
registered origin. Loading the SDK script on a standalone hosted page does not
grant Grotto auth or transaction authority. A verified creator can instead
[connect a hosted game](hosting.md#try-the-sdk-from-your-own-hosted-game) for a
private, no-upload preview of Grotto identity and cloud saves. That preview
cannot request transactions; a reviewed Grotto build is required for player
actions.

Grotto displays its own confirmation with the actual asset or token, spend,
recipient, fees and simulation result. The game cannot replace that review or
silently authorize a transaction. The host keeps the account token and wallet
signer; the game receives only its existing game-scoped runtime session and an
action result. Player-controlled amounts must be decimal strings, never
JavaScript numbers, to preserve exact base units. The game cannot supply a
contract target, selector, calldata, arbitrary value transfer, recipient or
approval allowance.

`confirmed` means the transaction receipt succeeded, not that an indexer has
already reflected ownership. `submitted` means a hash exists but the final
chain outcome is pending. `unknown` means the wallet may have broadcast a
transaction without returning its hash. Neither state means the purchase is
complete, and neither is safe to retry automatically. Resolve entitlement from
Grotto's authoritative state before granting a durable in-game reward. A
request can also reject with `ACTION_OUTCOME_UNKNOWN` if the host does not
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
