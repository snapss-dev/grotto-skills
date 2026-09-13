# Building or reviewing the hosted client and wrapper

## Pattern

1. Real game client lives in GitHub.
2. Client deploys to Railway/Vercel/Netlify/Cloudflare Pages over HTTPS.
3. Host auto-deploys from `main` or release tags.
4. Grotto upload is only a tiny `index.html` wrapper.
5. Wrapper iframes the hosted client and forwards Grotto runtime messages.

Benefits: fast updates, PR review, test gates, preview deploys, rollback, and fewer full zip uploads to Grotto.

## Repo layout

```text
my-grotto-game/
  package.json
  src/
  public/
  tests/
  wrapper/index.html
```

## Hosted client requirements

```html
<script src="https://api.enterthegrotto.xyz/sdk/grotto-game-runtime.v1.js"></script>
```

```js
const grotto = await GrottoRuntime.ready({ timeoutMs: 10000 });
const player = await grotto.getPlayer();
const save = await grotto.loadSave('default', DEFAULT_STATE);
startGame({ player, state: save.state });
```

The hosted URL must be HTTPS.

Optional inventory and multiplayer APIs are not enabled by the wrapper or client. The exact
published Grotto game ID must be allowlisted by the platform operator before a newly launched
runtime session receives `inventory:read` or `multiplayer:join`.

## Grotto wrapper

Upload this as the root `index.html` in the Grotto game zip.

```html
<!doctype html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>My Grotto Game</title>
<style>html,body,#game{width:100%;height:100%;margin:0;border:0;overflow:hidden;background:#050510}</style>
</head><body>
<iframe id="game" title="My Grotto Game" sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups" allow="fullscreen; autoplay; clipboard-read; clipboard-write; gamepad"></iframe>
<script>
const REMOTE_GAME_URL = 'https://my-game.up.railway.app';
const REMOTE_GAME_ORIGIN = new URL(REMOTE_GAME_URL).origin;
const iframe = document.getElementById('game');
const params = new URLSearchParams(location.search);
params.set('embedded', 'grotto');
iframe.src = `${REMOTE_GAME_URL}/?${params}`;
addEventListener('message', (event) => {
  const msg = event.data;
  if (!msg || typeof msg !== 'object') return;
  if (msg.type === 'grotto:runtime:hello' && event.source === iframe.contentWindow) {
    parent.postMessage({ type: 'grotto:runtime:hello' }, '*');
  }
  if (msg.type === 'grotto:runtime' && event.source === parent) {
    iframe.contentWindow?.postMessage(msg, REMOTE_GAME_ORIGIN);
  }
});
</script></body></html>
```

Only forward `grotto:runtime` from the wrapper's parent and only accept
`grotto:runtime:hello` from the hosted iframe. Never copy the `grs_*` session into the hosted URL,
query string, logs, analytics, localStorage, or build artifacts.
