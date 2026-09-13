# Save migration and recovery

Keep root `index.html`, stable game identity and the installed runtime helpers.
Version the game's save schema, provide defaults for newly added fields, and
migrate older state without deleting existing progression. Use representative
old saves to check the changed loading path, including missing or malformed fields.

Cloud hydration runs in the background. Merge late saved state with progress
made during startup; do not replace current progress blindly. Use `createAutosave`
or preserve `baseVersion` on manual saves. A conflict requires reconciliation,
not repeated unconditional writes. Read the Runtime SDK skill's
[saves and scores](../../grotto-game-runtime-developer-sdk/references/saves-and-scores.md)
when changing the persistence integration.

A code rollback does not necessarily roll back saved data. Before restoring an
older candidate through the available version workflow, check whether it can
read saves produced by the newer schema. Validate and publish the recovered
candidate through the same current workflow, and confirm the actual result.
Do not promise instant rollback, perpetual version retention or zero broken loads.
