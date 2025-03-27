import type { RslibConfig } from '@rslib/core';
import { defineConfig } from '@rslib/core';

const config: RslibConfig = defineConfig(
  {
    lib: [{
      source: {
        entry: {
          index: `./src/**`,
        },
      },
      output: {
        distPath: {
          root: `./lib`,
        },
        cleanDistPath: false,
      },
      format: 'esm',
      syntax: 'es2021',
      bundle: false,
    }],
  },
);

export default config;
