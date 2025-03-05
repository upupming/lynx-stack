import { defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: './src/**',
    },
  },
  lib: [
    {
      bundle: false,
      format: 'esm',
      syntax: 'es2021',
      // TODO: enable this after types are fixed
      dts: true,
    },
    {
      bundle: false,
      format: 'cjs',
      syntax: 'es2021',
    },
  ],
});
