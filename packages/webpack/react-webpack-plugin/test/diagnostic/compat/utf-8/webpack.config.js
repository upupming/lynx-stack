import path from 'node:path';
import { ReactWebpackPlugin } from '../../../../src'

/** @type {import('webpack').Configuration} */
export default {
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  jsx: true,
                },
              },
            },
          },
          {
            loader: ReactWebpackPlugin.loaders.BACKGROUND,
            options: {
              compat: {}
            }
          },
          path.resolve(__dirname, '../../../remove-background-only-loader.js'),
        ],
      },
    ],
  },
  plugins: [new ReactWebpackPlugin()],
}
