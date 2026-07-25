---
applyTo: "Cargo.toml,Cargo.lock,packages/web-platform/web-core/scripts/wasm-bindgen,packages/web-platform/web-core/scripts/dotslash-config.json"
---

When updating the Rust `wasm-bindgen`, `js-sys`, or `web-sys` dependency family, keep the checked-in DotSlash `wasm-bindgen` CLI manifest in `packages/web-platform/web-core/scripts/wasm-bindgen` aligned with the locked `wasm-bindgen` crate version. Regenerate that manifest with the command shown in its file header, using the new release tag, so the downloaded CLI binary schema matches the Rust-generated wasm schema on all CI platforms.
