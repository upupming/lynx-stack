---
"@lynx-js/react-rsbuild-plugin": patch
---

Throw error when `extractStr` is `true` and `chunkSplit.strategy` is not `all-in-one` since extracted string of different entries cannot be safely shared in a common chunk.
