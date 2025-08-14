---
"@lynx-js/react-rsbuild-plugin": minor
---

Support cache events when chunk splitting is enabled.

When `performance.chunkSplit.strategy` is not `all-in-one`, we will cache native events until the BTS chunk is fully loaded, and replay them when the BTS chunk is ready.
