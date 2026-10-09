# Grotto Runtime SDK Contract

This is the intended public browser API exposed by `https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js`.

## Version compatibility

The `v1` SDK URL and `version: 1` action messages are major contracts. This
skill's `1.x.y` version tracks guide content and does not change either
protocol. Compatible v1 updates may add optional methods, fields or failure
codes, but keep existing argument shapes, base-unit meanings and result states.
Handle unknown failure codes as unavailable; do not parse message text or
assume a missing capability is present. New transaction kinds need an explicit
negotiated capability or a new action message version. Breaking changes to an
existing action or result require a parallel v2 SDK/protocol, with the v1 path
kept available during migration. Never fall back to raw wallet calldata when
a typed action is unavailable.

`ok: true` is reserved for `state: 'confirmed'` after verified delivery.
`submitted` carries a pending hash with `ok: false` and no error. Use the state
and authoritative entitlement, never `ok` or a hash alone, to grant durable
game value.

## Global

```ts
declare global {
  interface Window {
    GrottoRuntime: GrottoRuntimeGlobal;
  }
}
```

## Types

```ts
type GrottoRuntimeConfig = {
  actionTypes?: readonly string[]; // registered-user tips require 'user.tip'
  apiBaseUrl: string;
  gameId: string;
  sessionId: string;
  expiresAt?: string;
  expiresIn?: number;
  scopes: string[];
  hostOrigin?: string; // exact Grotto top-level host origin, supplied by host
  actionHost?: 'desktop'; // Desktop reports typed actions unsupported for now
  actionPreviewMode?: 'review-only'; // creator preview shows review UI without a payment
};

type GrottoPlayerSession = {
  sessionId?: string;
  gameId: string;
  authenticated: boolean;
  player: {
    id: string;
    walletAddress?: string | null;
    displayName?: string | null;
    avatar?: string | null;
  };
  scopes: string[];
  expiresAt?: string;
};

type GrottoSave<T = unknown> = {
  slot: string;
  version: number;
  updatedAt?: string;
  state: T;
};

type GrottoInventoryHolding = {
  contractAddress: `0x${string}`;
  balance: string; // exact base-unit decimal; parse with BigInt
  classification: string;
  resource: { id?: string | null; name?: string | null; image?: string | null } | null;
} & (
  | { standard: 'ERC1155' | 'ERC721'; tokenId: string }
  | { standard: 'ERC20'; tokenId: null; decimals: number | null; symbol: string | null }
);

type GrottoRuntimeInventory = {
  gameId: string;
  playerId: `0x${string}`;
  holdings: GrottoInventoryHolding[];
  summary: { walletsChecked: number; holdings: number; totalBalance: string };
  partial: false;
  checkedAt: string; // response time, not guaranteed chain-read time
};

type GrottoMultiplayerTicket = {
  available: true;
  provider: string;
  roomId: 'public';
  token: string;
  tokenType: 'Bearer';
  gameId: string;
  audience: string;
  expiresAt: string;
  expiresIn: number;
};

type GrottoMultiplayerUnavailable = {
  available: false;
  message: 'Multiplayer runtime tokens are not enabled yet.';
};

type GrottoLeaderboardEntry = {
  rank: number;
  wallet: `0x${string}`;
  score: number;
  meta?: Record<string, unknown> | null;
  updatedAt: string;
};

type GrottoAutosaveOptions<T> = {
  slot?: string;
  defaultState: T;
  getState: () => T;
  applyState?: (state: T) => void;
  intervalMs?: number;
  onSaved?: (save: GrottoSave<T>) => void;
  onError?: (error: unknown) => void;
  onConflict?: (conflict: unknown) => void;
};

type GrottoAutosave = {
  start: () => Promise<void>;
  stop: () => void;
  markDirty: () => void;
  flush: () => Promise<boolean>;
};

type GrottoAction =
  | { type: 'marketplace.buyListing'; listingHash: `0x${string}`; maxPriceWei?: string }
  | { type: 'collection.mint'; assetId: string; quantity: number; maxTotalWei?: string }
  | { type: 'crowdfund.buy'; tokenAddress: `0x${string}`; spendWei: string; minTokensOut?: string }
  | { type: 'user.tip'; username: string; amountWei: string };

type GrottoActionResultBase = {
  type: 'grotto:action:result';
  version: 1;
  requestId: string;
};

type GrottoActionResult = GrottoActionResultBase & (
  | { ok: true; state: 'confirmed'; txHash: `0x${string}`; receiptStatus: 'success'; error?: never }
  | { ok: false; state: 'submitted'; txHash: `0x${string}`; receiptStatus: 'pending'; error?: never }
  | { ok: false; state: 'unknown' | 'unfulfilled' | 'recovered' | 'rejected' | 'failed';
      txHash?: `0x${string}`; receiptStatus?: 'success' | 'reverted' | 'pending';
      error: { code: string; message: string } }
);
```

## API

```ts
type GrottoRuntimeClient = {
  runtime: GrottoRuntimeConfig;
  getPlayer: () => Promise<GrottoPlayerSession>;
  loadSave: <T>(slot: string, defaultState: T) => Promise<GrottoSave<T>>;
  save: <T>(slot: string, state: T, options?: { baseVersion?: number }) => Promise<GrottoSave<T>>;
  deleteSave: (slot: string) => Promise<{ success: true }>;
  event: (type: string, payload?: Record<string, unknown>) => Promise<{ success: true }>;
  submitScore: (
    score: number,
    options?: { board?: string; meta?: Record<string, unknown> }
  ) => Promise<{ success: true }>;
  leaderboard: (
    options?: { board?: string; limit?: number }
  ) => Promise<{ gameId?: string; board: string; entries: GrottoLeaderboardEntry[] }>;
  heartbeat: () => Promise<{ success: true; expiresAt?: string }>;
  getInventory: () => Promise<GrottoRuntimeInventory>;
  getMultiplayerToken: (
    options?: { room?: 'public' }
  ) => Promise<GrottoMultiplayerTicket | GrottoMultiplayerUnavailable>;
  requestAction: (action: GrottoAction) => Promise<GrottoActionResult>;
  createAutosave: <T>(options: GrottoAutosaveOptions<T>) => GrottoAutosave;
};

type GrottoRuntimeGlobal = {
  ready: (options?: { timeoutMs?: number }) => Promise<GrottoRuntimeClient>;
};
```

## Capability invariants

- `inventory:read` is available to ordinary published game runtimes without operator setup.
  Persisted published-game sessions with older scope lists also receive it on rehydration.
  Creator-only hosted previews have identity and save scopes only. Inventory returns all indexed
  contracts; the game matches its own contract/token definitions.
- `multiplayer:join` requires per-game server-owned policy, rechecked on session rehydration and
  use so removing its opt-in takes effect without trusting an old scope.
- The canonical-plus-linked verified-wallet snapshot is private and immutable for the session.
- Heartbeat renews idle expiry but never the hard 24-hour absolute lifetime.
- `getInventory()` returns exact decimal strings and fails unless pagination is complete.
- `getMultiplayerToken()` accepts no routing choice other than optional literal `public`; request a
  fresh ticket on every connect/reconnect and handle the `available: false` union.
- A hosted creator preview may advertise `actionPreviewMode: 'review-only'` while its session has
  identity and save scopes only. A typed `requestAction()` shows a Grotto review demo and returns
  `ok: false`, `state: 'failed'`, `error.code: 'PREVIEW_ONLY'`, without `txHash` or `receiptStatus`.
  It neither quotes nor sends a transaction and cannot prove an entitlement.
