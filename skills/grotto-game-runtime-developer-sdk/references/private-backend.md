# Connect an existing game backend

Use this browser integration when the game keeps its own database, save routes,
economy or gameplay server. Embedded players reuse Grotto identity without a
second Privy login or platform account bearer. The Unreal plugin keeps its bearer
private and exposes native API methods; this browser credential handoff is not
a new native plugin method.

## Authenticate each protected request

1. Launch through a supported Grotto player and wait for the browser SDK in
   background work. Obtain the runtime bearer from `client.runtime.sessionId`.
2. Send it only to the game's trusted HTTPS backend in `Authorization: Bearer`.
3. On every protected request, that backend verifies it at the fixed
   `GET https://api.enterthegrotto.xyz/api/game-runtime/v1/session/me` endpoint.
4. Require `authenticated: true`, the backend's configured canonical `gameId`,
   the route's required scopes, a future valid `expiresAt`, and `purpose: 'play'`.
5. Derive the player from the verified canonical `player.walletAddress`.
   Store/query data under that verified game/player pair and apply the game's
   own authorization and gameplay validation.

`grs_*` is opaque; do not decode it as a JWT or invent a signing key. Do not
choose the verification URL, expected game or required scopes from a client
request. Reject other games, revoked/expired sessions, preview purposes, missing
purpose, malformed responses and verification outages. Preview sessions can test
Grotto saves but cannot authorize production writes to a private game backend.
A successful identity lookup does not validate submitted game state.

Example server verifier using built-in `fetch`:

```js
async function verifyGrottoPlayer(authorization, expectedGameId, requiredScopes = ['identity:read']) {
  const match = /^Bearer (grs_[A-Za-z0-9_-]{16,256})$/.exec(authorization || '');
  const deny = (status, message) => Object.assign(new Error(message), { status });
  if (!match) throw deny(401, 'Grotto runtime session required');
  let response;
  try {
    response = await fetch('https://api.enterthegrotto.xyz/api/game-runtime/v1/session/me', {
      headers: { Authorization: `Bearer ${match[1]}`, Accept: 'application/json' },
      redirect: 'error', signal: AbortSignal.timeout(5000),
    });
  } catch {
    throw deny(503, 'Grotto identity verification unavailable');
  }
  if (!response.ok) {
    throw deny(response.status === 401 || response.status === 403 ? 401 : 503,
      'Grotto identity verification failed');
  }
  const me = await response.json().catch(() => null);
  const expiresAt = Date.parse(me?.expiresAt || '');
  const wallet = me?.player?.walletAddress;
  if (me?.authenticated !== true || me.gameId !== expectedGameId || me.purpose !== 'play'
      || !Number.isFinite(expiresAt) || expiresAt <= Date.now()
      || !Array.isArray(me.scopes) || !requiredScopes.every(scope => me.scopes.includes(scope))
      || typeof wallet !== 'string' || !/^0x[a-f0-9]{40}$/.test(wallet)) {
    throw deny(403, 'This runtime cannot access the game backend');
  }
  // Return only the public principal, never the echoed sessionId or bearer.
  return { gameId: me.gameId, playerId: wallet };
}
```

Pass the expected game ID and scopes from server-owned route configuration.
Catch the verifier's status at your HTTP boundary; preserve `503` during an
upstream outage and grant no access. Client wallet/user/game IDs never replace
verification. Do not cache a successful lookup into a long-lived login that
outlives Grotto revocation.

## Browser and database setup

Configure your backend's CORS for the actual game client origin, required
methods and `Authorization`/`Content-Type` headers, including preflight.
Use a fixed project-owned backend URL. Do not forward the bearer to unrelated
vendors, put it in a WebSocket URL, or persist/log it. Account change/logout must
stop the previous client's autosave and pending hydration; reacquire the SDK
client after the trusted host supplies the new session.

Keep database/service-role credentials on the game server. Directly accessible
databases must also deny unverified client writes; a protected HTTP route does
not secure a second public database write path. Schema, score validation, spend
rules and conflict decisions remain the project's responsibility.

Verify accepted play, wrong game, missing scope, hosted/native preview, missing
purpose, expiry, revocation and verification outage with local fixtures before
enabling valuable writes. Never fabricate a successful principal from a client
payload or a failed upstream request.
