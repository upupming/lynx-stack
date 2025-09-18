---
"@lynx-js/template-webpack-plugin": minor
"@lynx-js/react-rsbuild-plugin": minor
---

**BREAKING CHANGE:** Remove the `enableParallelElement` and `pipelineSchedulerConfig` options.

Since the thread element resolution is still in experimental stage and may have stability risks, it will be disabled by default after this change.
