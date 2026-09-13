# Iterating and publishing a Studio game

Start from the current source and the creator's decisions. Inspect the affected
entrypoint and systems, implement the requested change, and preserve unrelated
working behavior. A substantial request can justify a substantial edit; do not
turn a small-diff preference into an excuse to leave the requested work partial.

Use the installed tools to keep the game runnable, inspect relevant errors, and
repair failures. Studio performs independent browser review against the exact
candidate. The agent's finish call submits a candidate; it does not prove that
validation, persistence or publication succeeded.

Let the creator try the validated preview. Publishing is a separate creator
action unless the current workflow explicitly authorizes it. Confirm the actual
publication result before saying that players receive an update. Existing play
sessions may remain on an older version until they reload.

Describe what changed and what to try in the same Studio conversation. Do not
require a new game or an external GitHub workflow merely because a change is large.
