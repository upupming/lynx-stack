---
"@lynx-js/react": patch
"@lynx-js/react-rsbuild-plugin": patch
"@lynx-js/react-webpack-plugin": patch
"@lynx-js/template-webpack-plugin": patch
"@lynx-js/runtime-wrapper-webpack-plugin": patch
---

Add the experimental `experimental_reEvalJSOnReload` option to re-evaluate the ReactLynx entry on `reloadTemplate` while reusing the existing element tree.

Invalidate main-thread external exports before re-evaluating the entry so reload initializes a fresh runtime while preserving the existing element tree.
