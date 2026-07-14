# Grotto Runtime SDK Contract

This is the intended public browser API exposed by `https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js`.

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
  apiBaseUrl: string;
  gameId: string;
  sessionId: string;
  expiresAt?: string;
  expiresIn?: number;
  scopes: string[];
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
  standard: 'ERC1155' | 'ERC721';
  contractAddress: `0x${string}`;
  tokenId: string;
  balance: string; // exact base-unit decimal; parse with BigInt
  classification: string;
  resource: { id?: string | null; name?: string | null; image?: string | null } | null;
};

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
  createAutosave: <T>(options: GrottoAutosaveOptions<T>) => GrottoAutosave;
};

type GrottoRuntimeGlobal = {
  ready: (options?: { timeoutMs?: number }) => Promise<GrottoRuntimeClient>;
};
```

## Capability invariants

- `inventory:read` and `multiplayer:join` appear only on newly launched sessions for exact game IDs
  enabled by server-owned policy. That policy is checked again on session rehydration and every
  capability use, so removing an opt-in takes effect without trusting an old scope.
- The canonical-plus-linked verified-wallet snapshot is private and immutable for the session.
- Heartbeat renews idle expiry but never the hard 24-hour absolute lifetime.
- `getInventory()` returns exact decimal strings and fails unless pagination is complete.
- `getMultiplayerToken()` accepts no routing choice other than optional literal `public`; request a
  fresh ticket on every connect/reconnect and handle the `available: false` union.
