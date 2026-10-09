# Integrating standalone fallback or a hosted wrapper

Use [Grotto Game Setup](../../grotto-game-setup/SKILL.md) to select an adapter.
This page describes the browser transport. Unreal Windows receives the same
base runtime authority through Desktop's private launch handoff instead.

## Local fallback for development

During local development, your game may not be embedded in The Grotto player. Provide fallback saves:

```js
function loadLocalSave(defaultState) {
  try {
    const raw = localStorage.getItem('mygame_local_save');
    return raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState;
  } catch {
    return defaultState;
  }
}

function saveLocal(state) {
  try {
    localStorage.setItem('mygame_local_save', JSON.stringify(state));
  } catch {}
}
```

But in production, prefer SDK cloud saves.

## Try the SDK from your own hosted game

In Grotto Studio, choose
[Connect hosted game](https://www.enterthegrotto.xyz/games/hosted-preview),
enter a title and the exact public HTTPS URL of your game, then open the
private preview. This reserves the
game ID without uploading a build. Load the normal Grotto browser SDK in your
game; the preview supplies a short-lived session when the SDK handshakes with
the Grotto player. The creator can test Grotto identity, cloud saves and all
three action review demos at the hosted URL. The demos show game-supplied
identifiers and bounds; they do not fetch live prices, ownership or gas.
Saves remain under the same game ID after publication. The page shows
handshake and identity/save diagnostics. These check the transport and a
temporary save slot, not your game's own save calls or the safety of its code.
When **Save URL** is available, you can update the exact hosted URL after a
deploy and open a new session. Saving the URL revokes the old preview session,
even if the URL text is unchanged.

The hosted preview is for the verified creator only. Its session has only
identity and save scopes. An action request shows a review demo and returns
`failed` with `PREVIEW_ONLY`, without opening a wallet prompt, sending a transaction,
or delivering an asset. It has no transaction hash or receipt status.
It cannot request real player transactions, inventory, scores, multiplayer,
rewards or public play credit.
To make those features eligible for players, publish a reviewed Grotto build.
Real game payments also depend on Grotto's separate payment controls and
real-wallet action canaries.
For a game kept on your own host, the published build may be a small wrapper.
New game payment integrations should use Grotto's typed action review; the
hosted game cannot choose its calldata or wallet signer through that SDK.
Approved legacy builds may retain their separate build-bound transaction relay
as described below.

## Runtime message protocol

The hosted player sends your iframe:

```js
{
  type: 'grotto:runtime',
  runtime: {
    apiBaseUrl: 'https://api.enterthegrotto.xyz/api/game-runtime/v1',
    gameId: 'game-123',
    sessionId: 'grs_...',
    hostOrigin: 'https://www.enterthegrotto.xyz',
    actionPreviewMode: 'review-only', // creator preview only; no payment scope
    expiresAt: '2026-04-25T16:00:00.000Z',
    scopes: ['identity:read', 'save:read', 'save:write']
  }
}
```

The SDK sends this handshake upward:

```js
window.parent.postMessage({ type: 'grotto:runtime:hello' }, '*');
```

Creators using the SDK do not need to implement this manually. When
`GrottoRuntime.ready()` resolves in a hosted preview, the SDK also acknowledges
readiness to the parent so the integration diagnostics can distinguish a loaded
frame from a working SDK handshake.
The trusted host supplies `hostOrigin` for `requestAction()` replies; a game
must not invent or replace it. Hosted wrappers should forward the runtime
descriptor unchanged.

This base handshake is available to games through the player's validated frame
boundary. The existing founder/selected-game descendant exception only affects
which nested frames can receive the session. Legacy `bobert:hello` compatibility
also returns the same scoped `grs_*` credential with `tokenType: grotto-runtime`.
Neither grants a platform bearer or wallet authority. Preserve the recipient
policy; a wrapper does not enable the exception for another game.

### Existing legacy transaction relay

Some existing approved games use `bobert:tx` alongside `bobert:hello`. Keep
that route working for the exact approved game build and frame origin. It is a
compatibility protocol, not a new `GrottoRuntime.requestAction()` type or a
creator self-service permission. Grotto rechecks the moderator-approved target
address and four-byte selector policy for the current build before each relay
send. A changed build or revoked policy fails closed. The legacy Web Privy
confirmation remains part of that route; the runtime session alone never
authorizes a send. A target and selector allowlist does not prove the effects
of arbitrary calldata, so do not describe that prompt as a verified pay/receive
review. Do not forward a platform account bearer, broaden the frame recipient
set, or silently translate a `bobert:tx` call into a typed SDK action.
Plan new payment flows around the typed action API and its result states.

Every ordinary published game runtime includes `inventory:read` without operator setup.
Creator-only hosted preview intentionally omits it.
`multiplayer:join` remains optional and requires platform enablement for the exact game ID.

## Advanced: GitHub-hosted game client workflow

For quick updates, version control, CI tests, preview deploys, Railway/Vercel hosted clients, and small Grotto iframe wrappers, use:

```text
grotto-hosted-game-github-workflow
```

Runtime SDK still handles identity/save/event APIs. The specialist skill explains how to keep the real game client in GitHub and upload only a tiny Grotto wrapper that forwards `grotto:runtime:hello` and `grotto:runtime` between The Grotto player and the hosted iframe.
