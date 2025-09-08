// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import type { RsbuildPluginAPI, Rspack } from '@rsbuild/core'
import path from 'node:path'

type CacheGroups = Rspack.Configuration extends {
  optimization?: {
    splitChunks?:
      | {
        cacheGroups?: infer P
      }
      | false
      | undefined
  } | undefined
} ? P
  : never

type SplitChunks = Rspack.Configuration extends {
  optimization?: {
    splitChunks?: infer P
  } | undefined
} ? P
  : never

const isPlainObject = (obj: unknown): obj is Record<string, unknown> =>
  obj !== null
  && typeof obj === 'object'
  && Object.prototype.toString.call(obj) === '[object Object]'

export const applySplitChunksRule = (
  api: RsbuildPluginAPI,
): void => {
  // Defaults to `all-in-one`.
  api.modifyRsbuildConfig((config, { mergeRsbuildConfig }) => {
    const userConfig = api.getRsbuildConfig('original')
    if (!userConfig.performance?.chunkSplit?.strategy) {
      return mergeRsbuildConfig(config, {
        performance: {
          chunkSplit: {
            strategy: 'all-in-one',
          },
        },
      })
    }
    return config
  })

  api.modifyBundlerChain((chain, { environment }) => {
    const currentConfig = chain.optimization.splitChunks.values() as Exclude<
      SplitChunks,
      false
    >
    console.log('currentConfig', currentConfig)
    const { output } = api.getNormalizedConfig()
    console.log('output.filename.css', output.filename.css)
    console.log('entries', chain.entryPoints.entries())
    let entrySet = new Set<string>();
    Object.keys(chain.entryPoints.entries()).forEach((entry) => {
      entrySet.add(entry.split('__main-thread')[0]!)
    })
    
    const { config } = environment
    
    const extraGroups: CacheGroups = {}
    
    // add rules for main-thread and background thread css merging
    // entrySet.forEach((entry) => {
    //   extraGroups[`rspeedy-css-merging-${entry}`] = {
    //     name: `.styles-${entry}`,
    //     type: 'css/mini-extract',
    //     chunks: (chunk) => {
    //       console.log('chunk.name', chunk.name)
    //       return chunk.name?.split('__main-thread')[0] === entry
    //     },
    //     enforce: true,
    //   }
    // })
    extraGroups[`rspeedy-css-merging`] = {
      name: (_module: Rspack.Module, chunks: Rspack.Chunk[], _cacheGroupKey: string) => {
        return `.styles-${chunks[0]!.name!.split('__')[0]!.replace('/', '_')}`
      },
      type: 'css/mini-extract',
      chunks: 'all',
      enforce: true,
    }
    
    if (config.performance.chunkSplit.strategy === 'split-by-experience' && isPlainObject(currentConfig)) {
      extraGroups['preact'] = {
        name: 'lib-preact',
        test:
          /node_modules[\\/](.*?[\\/])?(?:preact|preact[\\/]compat|preact[\\/]hooks|preact[\\/]jsx-runtime)[\\/]/,
        priority: 0,
      }
    }
    
    class TestPlugin {
        apply(compiler: Rspack.Compiler) {
          compiler.hooks.compilation.tap('xxxx', (compilation) => {
            
            console.log('compilation.chunkGroups', compilation.chunkGroups);
            compilation.chunkGroups
              .filter((cg) => {
                console.log('cg.name111', cg.name)
                return !cg.isInitial()
              })
              .filter(cg => {
                
                return cg.name !== null && cg.name !== undefined
              })
          })
        }
    }
    
    chain
      .plugin('xxxx')
      .use(TestPlugin)
    
    // .init(() => {
    //   return {
    //     apply(compiler) {
    //       throw new Error('yyyy')
    //       compiler.hooks.compilation.tap('xxxx', (compilation) => {
    //         compilation.chunkGroups
    //           .filter(cg => !cg.isInitial())
    //           .filter(cg => {
    //             console.log('cg.name111', cg.name)
    //             cg.name !== null && cg.name !== undefined
    //           })
    //       })
    //     }
    //   } as Rspack.RspackPluginInstance
    // })

    chain.optimization.splitChunks({
      ...currentConfig,
      cacheGroups: {
        ...currentConfig.cacheGroups,
        ...extraGroups,
      },
    })
  })

  api.modifyRspackConfig((rspackConfig, { environment }) => {
    if (environment.name !== 'lynx') {
      return rspackConfig
    }

    if (!rspackConfig.optimization) {
      return rspackConfig
    }

    if (!rspackConfig.optimization.splitChunks) {
      return rspackConfig
    }

    rspackConfig.optimization.splitChunks.chunks = function chunks(chunk) {
      console.log('chunk', chunk)
      // TODO: support `splitChunks.chunks: 'async'`
      // We don't want main thread to be split
      return !chunk.name?.includes('__main-thread')
    }
    return rspackConfig
  })
}
