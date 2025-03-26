---
"@lynx-js/extract-str-webpack-plugin": patch
"@lynx-js/react-rsbuild-plugin": patch
---

feat: support extractStr to reuse variables and reduce bundle size

```js
pluginReactLynx({
  extractStr: true,
  // Or you can customize the min length of the string to be extracted (default: 20)
  // extractStr: {
  //   strLength: 20,
  // },
}),
```
