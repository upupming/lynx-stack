---
"@lynx-js/webpack-runtime-globals": patch
"@lynx-js/cache-events-webpack-plugin": patch
---

Add `lynxCacheEventsSetupList` and `lynxCacheEvents` to RuntimeGlobals. It will be used to cache Lynx native events until the BTS chunk is fully loaded, and replay them when the BTS chunk is ready.
