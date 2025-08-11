// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import type { Rspack } from '@rsbuild/core'
import { assertType, describe, test } from 'vitest'

import type { Config } from '../../src/index.js'

describe('Config - Output', () => {
  type Output = Config['output']

  test('empty', () => {
    assertType<Output>(void 0)
    assertType<Output>({})
  })

  test('output.assetPrefix', () => {
    assertType<Output>({
      assetPrefix: 'https://example.com',
    })
  })

  test('output.cleanDistPath', () => {
    assertType<Output>({
      cleanDistPath: true,
    })
  })

  test('output.copy', () => {
    assertType<Output>({
      copy: [],
    })

    assertType<Output>({
      copy: [
        'assets',
        { from: 'foo' },
        { from: 'foo', to: 'bar' },
        {
          from: 'baz',
          to(pathData) {
            return pathData.context
          },
        },
      ],
    })
  })

  test('output.cssModules', () => {
    assertType<Output>({
      cssModules: {
        auto: true,
      },
    })

    assertType<Output>({
      cssModules: {
        auto: false,
      },
    })

    assertType<Output>({
      cssModules: {
        auto: /module/,
      },
    })

    assertType<Output>({
      cssModules: {
        auto(filename) {
          return !filename.includes('node_modules')
        },
      },
    })

    assertType<Output>({
      cssModules: {
        exportLocalsConvention: 'asIs',
      },
    })

    assertType<Output>({
      cssModules: {
        exportGlobals: false,
      },
    })

    assertType<Output>({
      cssModules: {
        exportGlobals: true,
      },
    })

    assertType<Output>({
      cssModules: {
        exportLocalsConvention: 'dashesOnly',
      },
    })

    assertType<Output>({
      cssModules: {
        localIdentName: '[hash:7]',
      },
    })
  })

  test('output.dataUriLimit', () => {
    assertType<Output>({
      dataUriLimit: 0,
    })

    assertType<Output>({
      dataUriLimit: Number.MAX_SAFE_INTEGER,
    })
  })

  test('output.distPath', () => {
    assertType<Output>({
      distPath: {
        root: 'foo',
      },
    })

    assertType<Output>({
      distPath: {
        css: 'foo',
      },
    })

    assertType<Output>({
      distPath: {
        cssAsync: 'foo',
      },
    })

    assertType<Output>({
      distPath: {
        image: 'foo',
      },
    })

    assertType<Output>({
      distPath: {
        font: 'foo',
      },
    })
  })

  test('output.filename', () => {
    assertType<Output>({
      filename: '[id].js',
    })

    assertType<Output>({
      filename: {
        js: '[id].js',
      },
    })

    assertType<Output>({
      filename: {
        js: (pathData, assetInfo) => {
          assertType<string | undefined>(pathData.filename)
          assertType<string | undefined>(pathData.hash)
          assertType<Rspack.AssetInfo | undefined>(assetInfo)
          return pathData.filename + '.js'
        },
      },
    })

    assertType<Output>({
      filename: {
        css: '[id].css',
      },
    })

    assertType<Output>({
      filename: {
        css: (pathData, assetInfo) => {
          assertType<string | undefined>(pathData.filename)
          assertType<string | undefined>(pathData.hash)
          assertType<Rspack.AssetInfo | undefined>(assetInfo)
          return pathData.filename + '.css'
        },
      },
    })

    assertType<Output>({
      filename: {
        svg: '[id].svg',
      },
    })

    assertType<Output>({
      filename: {
        svg: (pathData, assetInfo) => {
          assertType<string | undefined>(pathData.filename)
          assertType<string | undefined>(pathData.hash)
          assertType<Rspack.AssetInfo | undefined>(assetInfo)
          return pathData.filename + '.svg'
        },
      },
    })

    assertType<Output>({
      filename: {
        font: '[id].font.ttf',
      },
    })

    assertType<Output>({
      filename: {
        font: (pathData, assetInfo) => {
          assertType<string | undefined>(pathData.filename)
          assertType<string | undefined>(pathData.hash)
          assertType<Rspack.AssetInfo | undefined>(assetInfo)
          return pathData.filename + '.font.ttf'
        },
      },
    })

    assertType<Output>({
      filename: {
        image: '[id].image[ext]',
      },
    })

    assertType<Output>({
      filename: {
        image: (pathData, assetInfo) => {
          assertType<string | undefined>(pathData.filename)
          assertType<string | undefined>(pathData.hash)
          assertType<Rspack.AssetInfo | undefined>(assetInfo)
          return pathData.filename + '.image[ext]'
        },
      },
    })

    assertType<Output>({
      filename: {
        media: '[id].media[ext]',
      },
    })

    assertType<Output>({
      filename: {
        media: (pathData, assetInfo) => {
          assertType<string | undefined>(pathData.filename)
          assertType<string | undefined>(pathData.hash)
          assertType<Rspack.AssetInfo | undefined>(assetInfo)
          return pathData.filename + '.media[ext]'
        },
      },
    })

    assertType<Output>({
      filename: {
        wasm: '[id].wasm',
      },
    })

    assertType<Output>({
      filename: {
        // @ts-expect-error wasm does not support function
        wasm: () => 'foo',
      },
    })

    assertType<Output>({
      filename: {
        assets: '[id].assets[ext]',
      },
    })

    assertType<Output>({
      filename: {
        assets: (pathData, assetInfo) => {
          assertType<string | undefined>(pathData.filename)
          assertType<string | undefined>(pathData.hash)
          assertType<Rspack.AssetInfo | undefined>(assetInfo)
          return pathData.filename + '.assets[ext]'
        },
      },
    })
  })

  test('output.filenameHash', () => {
    assertType<Output>({
      filenameHash: 'fullhash',
    })
    assertType<Output>({
      filenameHash: 'fullhash:8',
    })
    assertType<Output>({
      filenameHash: 'chunkhash:8',
    })
    assertType<Output>({
      filenameHash: false,
    })
    assertType<Output>({
      filenameHash: true,
    })
  })

  test('output.inlineScripts', () => {
    assertType<Output>({
      inlineScripts: true,
    })
    assertType<Output>({
      inlineScripts: false,
    })
    assertType<Output>({
      inlineScripts: /[\\/]background\.\w+\.js$/,
    })
    assertType<Output>({
      inlineScripts: ({ size }) => {
        return size < 10 * 1000
      },
    })
    assertType<Output>({
      inlineScripts: {
        enable: 'auto',
        test: /[\\/]background\.\w+\.js$/,
      },
    })
    assertType<Output>({
      inlineScripts: {
        enable: true,
        test: /[\\/]background\.\w+\.js$/,
      },
    })
  })

  test('output.legalComments', () => {
    assertType<Output>({
      legalComments: 'inline',
    })
    assertType<Output>({
      legalComments: 'linked',
    })
    assertType<Output>({
      legalComments: 'none',
    })

    assertType<Output>({
      // @ts-expect-error testing error
      legalComments: 'foo',
    })
  })

  test('output.sourceMap', () => {
    assertType<Output>({
      sourceMap: true,
    })

    assertType<Output>({
      sourceMap: false,
    })

    assertType<Output>({
      sourceMap: {
        js: 'cheap-module-source-map',
      },
    })

    assertType<Output>({
      sourceMap: {
        js: false,
      },
    })

    assertType<Output>({
      sourceMap: {
        // @ts-expect-error should reject non-devtool value.
        js: 'foo-bar',
      },
    })
  })
})
