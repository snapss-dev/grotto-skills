# Integrating standalone fallback or a hosted wrapper

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

## Runtime message protocol

The hosted player sends your iframe:

```js
{
  type: 'grotto:runtime',
  runtime: {
    apiBaseUrl: 'https://api.enterthegrotto.xyz/api/game-runtime/v1',
    gameId: 'game-123',
    sessionId: 'grs_...',
    expiresAt: '2026-04-25T16:00:00.000Z',
    scopes: ['identity:read', 'save:read', 'save:write', 'presence:write', 'events:write']
  }
}
```

The SDK sends this handshake upward:

```js
window.parent.postMessage({ type: 'grotto:runtime:hello' }, '*');
```

Creators using the SDK do not need to implement this manually.

Optional `inventory:read` and `multiplayer:join` scopes appear only for games explicitly enabled by
the platform operator.

## Advanced: GitHub-hosted game client workflow

For quick updates, version control, CI tests, preview deploys, Railway/Vercel hosted clients, and small Grotto iframe wrappers, use:

```text
grotto-hosted-game-github-workflow
```

Runtime SDK still handles identity/save/event APIs. The specialist skill explains how to keep the real game client in GitHub and upload only a tiny Grotto wrapper that forwards `grotto:runtime:hello` and `grotto:runtime` between The Grotto player and the hosted iframe.
