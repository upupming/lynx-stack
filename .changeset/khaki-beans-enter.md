---
"@lynx-js/testing-environment": patch
---

Fix `GlobalEventEmitter` type definition, the `emit(eventName: string, data: unknown)` function should recevie an array typed `data` and pass as param list of listeners.
