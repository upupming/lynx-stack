// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import type { Compiler } from '@rspack/core';
import { BannerPlugin, DefinePlugin } from '@rspack/core';

import type { ExtractStrConfig } from '@lynx-js/react/transform';
import { transformBundleResultSync } from '@lynx-js/react/transform';

/**
 * The options for ExtractStrWebpackPlugin
 *
 * @public
 */
interface ExtractStrWebpackPluginOptions {
  /**
   * The chunk names to be considered as main thread chunks.
   */
  mainThreadChunks?: string[] | undefined;
  /**
   * The chunk names to be considered as background thread chunks.
   */
  backgroundChunks?: string[] | undefined;
  /**
   * Merge same string literals in JS and Lepus to reduce output bundle size.
   * Set to `false` to disable.
   *
   * @defaultValue false
   */
  extractStr?: Partial<ExtractStrConfig> | boolean;
}

/**
 * ExtractStrWebpackPlugin allows using ReactLynx with webpack
 *
 * @example
 * ```js
 * // webpack.config.js
 * import { ExtractStrWebpackPlugin } from '@lynx-js/extract-str-webpack-plugin'
 * export default {
 *   plugins: [new ExtractStrWebpackPlugin()],
 * }
 * ```
 *
 * @public
 */
class ExtractStrWebpackPlugin {
  constructor(
    private readonly options?: ExtractStrWebpackPluginOptions | undefined,
  ) {}

  /**
   * `defaultOptions` is the default options that the {@link ExtractStrWebpackPlugin} uses.
   *
   * @public
   */
  static defaultOptions: Readonly<Required<ExtractStrWebpackPluginOptions>> =
    Object
      .freeze<Required<ExtractStrWebpackPluginOptions>>({
        mainThreadChunks: [],
        backgroundChunks: [],
        extractStr: false,
      });

  /**
   * The entry point of a webpack plugin.
   * @param compiler - the webpack compiler
   */
  apply(compiler: Compiler): void {
    const options = Object.assign(
      {},
      ExtractStrWebpackPlugin.defaultOptions,
      this.options,
    );

    if (options.extractStr) {
      new BannerPlugin({
        banner: `var _EXTRACT_STR;
__EXTRACT_STR_FLAG__(_EXTRACT_STR = lynxCoreInject.tt._params.updateData._EXTRACT_STR, _EXTRACT_STR);`,
        raw: true,
        entryOnly: true,
        // Inject runtime wrapper for all `.js` but not `main-thread.js` and `main-thread.[hash].js`.
        test: /^(?!.*main-thread(?:\.[A-Fa-f0-9]*)?\.js$).*\.js$/,
        stage: -256,
      }).apply(compiler);
    }

    new DefinePlugin({
      __EXTRACT_STR__: JSON.stringify(Boolean(options.extractStr)),
    }).apply(compiler);

    compiler.hooks.thisCompilation.tap(this.constructor.name, compilation => {
      if (options.extractStr) {
        compilation.hooks.processAssets.tap(
          {
            name: this.constructor.name,
            stage:
              compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
          },
          (assets) => {
            const entryIdx2selectStrVec: Record<
              number,
              string[]
            > = {};
            const DEFAULT_STR_LENGTH = 20;
            const jsAssets = Object.keys(assets).filter(name =>
              name.endsWith('.js')
            );
            jsAssets.forEach(
              (key) => {
                const entryIdx = options.mainThreadChunks?.findIndex(
                  (chunkName) => key.includes(chunkName),
                );
                if (entryIdx !== undefined && entryIdx !== -1) {
                  const result = transformBundleResultSync(
                    assets[key]!.source().toString(),
                    {
                      filename: key,
                      pluginName: 'main-thread-transformBundleResult',
                      sourcemap: true,
                      sourceFileName: key,
                      extractStr: {
                        strLength: typeof options.extractStr === 'boolean'
                          ? DEFAULT_STR_LENGTH
                          : options.extractStr.strLength ?? DEFAULT_STR_LENGTH,
                      },
                      minify: compiler.options.optimization.minimize ?? false,
                    },
                  );
                  if (result.errors.length > 0) {
                    result.errors.forEach(
                      error =>
                        compilation.errors.push(
                          new compiler.webpack.WebpackError(
                            `transformBundleResult of main-thread file ${key} failed: ${
                              error.detail ?? error.text
                            }`,
                          ),
                        ),
                    );
                  }
                  if (result.warnings.length > 0) {
                    result.warnings.forEach(
                      warning =>
                        compilation.warnings.push(
                          new compiler.webpack.WebpackError(
                            `transformBundleResult of main-thread file ${key} warning: ${
                              warning.detail ?? warning.text
                            }`,
                          ),
                        ),
                    );
                  }
                  if (result.selectStrVec) {
                    entryIdx2selectStrVec[entryIdx] = result.selectStrVec;

                    compilation.updateAsset(
                      key,
                      new compiler.webpack.sources.SourceMapSource(
                        result.code,
                        key,
                        result.map!,
                        assets[key]!.source(),
                        assets[key]!.map()!,
                      ),
                    );
                  }
                }
              },
            );
            jsAssets.forEach((key) => {
              const entryIdx = options.backgroundChunks?.findIndex(
                (chunkName) => (
                  new RegExp(
                    chunkName
                      // escape
                      .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
                      // replace `[.*]` (such as [contenthash:8]) with `.*`
                      .replace(/\\\[.*?\\\]/g, '.*'),
                  ).test(key)
                ),
              );
              if (
                entryIdx !== undefined && entryIdx !== -1
                && entryIdx2selectStrVec[entryIdx]
              ) {
                const result = transformBundleResultSync(
                  assets[key]!.source().toString(),
                  {
                    filename: key,
                    pluginName: 'background-transformBundleResult',
                    sourcemap: true,
                    sourceFileName: key,
                    extractStr: {
                      strLength: typeof options.extractStr === 'boolean'
                        ? DEFAULT_STR_LENGTH
                        : options.extractStr.strLength ?? DEFAULT_STR_LENGTH,
                      extractedStrArr: entryIdx2selectStrVec[entryIdx],
                    },
                    minify: compiler.options.optimization.minimize ?? false,
                  },
                );
                if (result.errors.length > 0) {
                  result.errors.forEach(
                    error =>
                      compilation.errors.push(
                        new compiler.webpack.WebpackError(
                          `transformBundleResult of background file ${key} error: ${
                            error.detail ?? error.text
                          }`,
                        ),
                      ),
                  );
                }
                if (result.warnings.length > 0) {
                  result.warnings.forEach(
                    warning =>
                      compilation.warnings.push(
                        new compiler.webpack.WebpackError(
                          `transformBundleResult of background file ${key} warning: ${
                            warning.detail ?? warning.text
                          }`,
                        ),
                      ),
                  );
                }
                compilation.updateAsset(
                  key,
                  new compiler.webpack.sources.SourceMapSource(
                    result.code,
                    key,
                    result.map!,
                    assets[key]!.source(),
                    assets[key]!.map()!,
                  ),
                );
              }
            });
          },
        );
      }
    });
  }
}

export { ExtractStrWebpackPlugin };
export type { ExtractStrWebpackPluginOptions };
