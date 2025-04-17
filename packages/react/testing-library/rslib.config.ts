import { defineConfig, type rsbuild } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2022',
      dts: false,
      bundle: true,
      source: {
        entry: {
          'pure': './src/pure.jsx',
        },
      },
      output: {
        externals: [
          /@lynx-js\/react/,
          /\.\.\/\.\.\/runtime\/lib/,
          /preact/,
        ],
      },
    },
    {
      format: 'esm',
      syntax: 'es2022',
      dts: false,
      bundle: false,
      source: {
        entry: {
          'index': './src/index.jsx',
          'vitest.config': './src/vitest.config.js',
          'vitest-global-setup': './src/vitest-global-setup.js',
        },
      },
      output: {
        externals: [
          /@lynx-js\/react/,
          /\.\.\/\.\.\/runtime\/lib/,
        ],
      },
    },
  ],
  tools: {
    rspack(config) {
      config.module!.rules!.push({
        test: /\.jsx$/,
        use: [
          {
            loader: require.resolve('./loaders/jsx-loader'),
          },
        ],
      });
    },
  },
});
