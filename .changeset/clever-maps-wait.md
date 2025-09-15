---
"@lynx-js/template-webpack-plugin": minor
"@lynx-js/react-rsbuild-plugin": minor
---

**BREAKING CHANGE:** Change default value of `enableParallelElement` to `false` beacuse thread element resolution is still in experimental stage and may have stability risks.

Note you should mannually enable `enableParallelElement` to `true` if you use a lower version of rspeedy without issues and want to keep enable it for performance boost.
