// import { fixupConfigRules } from '@eslint/compat';
import js from '@eslint/js';
// import preactJsx from 'eslint-config-preact';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import ts from 'typescript-eslint';

// console.log('preactJsx', preactJsx)

export default [
  { languageOptions: { globals: globals.browser } },
  js.configs.recommended,
  ...ts.configs.recommended,
  // ...fixupConfigRules([
  //   preactJsx,
  // ]),
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  { ignores: ['dist/'] },
];
