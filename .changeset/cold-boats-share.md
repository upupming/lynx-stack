---
"@lynx-js/chunk-loading-webpack-plugin": patch
"@lynx-js/template-webpack-plugin": patch
"@lynx-js/webpack-runtime-globals": patch
---

Add `lynxCacheEventsSetupList` and `lynxCacheEvents` to RuntimeGlobals. It will be used to cache native events until the BTS chunk is fully loaded, and replay them when the BTS chunk is ready.
