---
applyTo: "packages/webpack/externals-loading-webpack-plugin/**"
---

Keep `ExternalsLoadingPlugin` focused on consuming finalized `externals` maps and generating runtime loading code. Do not bake project-specific preset expansion or filesystem-backed dev serving into this low-level plugin; those concerns belong in higher-level Rsbuild integrations such as `pluginExternalBundle`. It is acceptable for this low-level plugin to resolve a relative `bundlePath` against the runtime `publicPath`, because that stays within generic bundler/runtime behavior instead of Rspeedy-specific URL inference.

Keep synchronous section evaluation tied to module imports rather than runtime startup; prefetching a bundle must not eagerly execute its section before preceding initialization imports. Preserve host-injected exports and writable cached values, defer shared-section aliases without triggering their primary loader during startup, and keep asynchronous external behavior unchanged. Test actual execution order with the source plugin, including a component external imported after a local initializer.
