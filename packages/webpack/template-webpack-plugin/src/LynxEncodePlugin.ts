// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import type { Compiler } from 'webpack';

import { LynxTemplatePlugin } from './LynxTemplatePlugin.js';

// https://github.com/web-infra-dev/rsbuild/blob/main/packages/core/src/types/config.ts#L1029
type InlineChunkTestFunction = (params: {
  size: number;
  name: string;
}) => boolean;
type InlineChunkTest = RegExp | InlineChunkTestFunction;
type InlineChunkConfig = boolean | InlineChunkTest | {
  enable?: boolean | 'auto';
  test: InlineChunkTest;
};

/**
 * The options for LynxEncodePluginOptions
 *
 * @public
 */
export interface LynxEncodePluginOptions {
  inlineScripts?: InlineChunkConfig | undefined;
  lynxCoreInjectCache?: boolean | undefined;
}

/**
 * LynxEncodePlugin
 *
 * @public
 */
export class LynxEncodePlugin {
  /**
   * The stage of the beforeEncode hook.
   */
  static BEFORE_ENCODE_STAGE = 256;
  /**
   * The stage of the encode hook.
   */
  static ENCODE_STAGE = 256;
  /**
   * The stage of the beforeEmit hook.
   */
  static BEFORE_EMIT_STAGE = 256;
  constructor(protected options?: LynxEncodePluginOptions | undefined) {}

  /**
   * `defaultOptions` is the default options that the {@link LynxEncodePlugin} uses.
   *
   * @example
   * `defaultOptions` can be used to change part of the option and keep others as the default value.
   *
   * ```js
   * // webpack.config.js
   * import { LynxEncodePlugin } from '@lynx-js/template-webpack-plugin'
   * export default {
   *   plugins: [
   *     new LynxEncodePlugin({
   *       ...LynxEncodePlugin.defaultOptions,
   *       enableRemoveCSSScope: true,
   *     }),
   *   ],
   * }
   * ```
   *
   * @public
   */
  static defaultOptions: Readonly<Required<LynxEncodePluginOptions>> = Object
    .freeze<Required<LynxEncodePluginOptions>>({
      inlineScripts: true,
      // TODO: fix that `true` not working with no chunk splitting
      lynxCoreInjectCache: true,
    });
  /**
   * The entry point of a webpack plugin.
   * @param compiler - the webpack compiler
   */
  apply(compiler: Compiler): void {
    new LynxEncodePluginImpl(
      compiler,
      Object.assign({}, LynxEncodePlugin.defaultOptions, this.options),
    );
  }
}

export class LynxEncodePluginImpl {
  name = 'LynxEncodePlugin';

  constructor(
    compiler: Compiler,
    options: Required<LynxEncodePluginOptions>,
  ) {
    this.options = options;

    const isDev = process.env['NODE_ENV'] === 'development'
      || compiler.options.mode === 'development';

    compiler.hooks.thisCompilation.tap(this.name, compilation => {
      const templateHooks = LynxTemplatePlugin.getLynxTemplatePluginHooks(
        compilation,
      );

      const inlinedAssets = new Set<string>();

      const { Compilation } = compiler.webpack;
      compilation.hooks.processAssets.tap({
        name: this.name,

        // `PROCESS_ASSETS_STAGE_REPORT` is the last stage of the `processAssets` hook.
        // We need to run our asset deletion after this stage to ensure all assets have been processed.
        // E.g.: upload source-map to sentry.
        stage: Compilation.PROCESS_ASSETS_STAGE_REPORT + 1,
      }, () => {
        inlinedAssets.forEach((name) => {
          compilation.deleteAsset(name);
        });
        inlinedAssets.clear();
      });

      templateHooks.beforeEncode.tapPromise({
        name: this.name,
        stage: LynxEncodePlugin.BEFORE_ENCODE_STAGE,
      }, async (args) => {
        const { encodeData } = args;
        const { manifest } = encodeData;

        const [inlinedManifest, externalManifest] = Object.entries(
          manifest,
        )
          .reduce(
            ([inlined, external], [name, content]) => {
              const assert = compilation.getAsset(name);
              const shouldInline = this.#shouldInlineScript(
                name,
                assert!.source.size(),
              );

              if (shouldInline) {
                inlined[name] = content;
              } else {
                external[name] = content;
              }
              return [inlined, external];
            },
            [{}, {}] as [Record<string, string>, Record<string, string>],
          );

        if (this.options.lynxCoreInjectCache) {
          const lynxCoreInjectCacheScriptName = 'lynx-core-inject-cache.js';
          const require = createRequire(import.meta.url);
          const lynxCoreInjectCacheScript = await fs.readFile(
            require.resolve('../static/' + lynxCoreInjectCacheScriptName),
            'utf-8',
          );
          let backgroundScriptName = '';
          const backgroundScriptRegex = /^.*background(?:\.[A-Fa-f0-9]*)?\.js$/;
          for (const name of Object.keys(manifest)) {
            if (backgroundScriptRegex.test(name)) {
              backgroundScriptName = name;
              break;
            }
          }
          if (backgroundScriptName === '') {
            compilation.errors.push(
              new compiler.webpack.WebpackError(
                `LynxEncodePlugin: ${lynxCoreInjectCacheScriptName} is not injected because no background script found.`,
              ),
            );
          } else {
            inlinedManifest[lynxCoreInjectCacheScriptName] = lynxCoreInjectCacheScript.replace(
              'background.js',
              // TODO: any better way to get the background script export path?
              path.posix.basename(backgroundScriptName),
            );
          }
        }

        let publicPath = '/';
        if (typeof compilation?.outputOptions.publicPath === 'function') {
          compilation.errors.push(
            new compiler.webpack.WebpackError(
              '`publicPath` as a function is not supported yet.',
            ),
          );
        } else {
          publicPath = compilation?.outputOptions.publicPath ?? '/';
        }

        if (!isDebug() && !isDev && !isRsdoctor()) {
          [
            encodeData.lepusCode.root,
            ...encodeData.lepusCode.chunks,
            ...Object.keys(inlinedManifest).map(name => ({ name })),
            ...encodeData.css.chunks,
          ]
            .filter(asset => asset !== undefined)
            .forEach(asset => inlinedAssets.add(asset.name));
        }

        encodeData.manifest = {
          // `app-service.js` is the entry point of a template.
          // All the initial chunks will be loaded **synchronously**.
          //
          // ```
          // manifest: {
          //   '/app-service.js': `
          //     lynx.requireModule('async-chunk1')
          //     lynx.requireModule('async-chunk2')
          //     lynx.requireModule('inlined-initial-chunk1')
          //     lynx.requireModule('inlined-initial-chunk2')
          //     lynx.requireModuleAsync('external-initial-chunk1')
          //     lynx.requireModuleAsync('external-initial-chunk2')
          //   `,
          //   'inlined-initial-chunk1': `<content>`,
          //   'inlined-initial-chunk2': `<content>`,
          // },
          // ```
          '/app-service.js': [
            this.#appServiceBanner(),
            Object.keys(externalManifest).map(name =>
              `lynx.requireModuleAsync('${
                this.#formatJSName(name, publicPath)
              }')`
            ).join(','),
            ';module.exports=',
            Object.keys(inlinedManifest).map(name =>
              `lynx.requireModule('${
                this.#formatJSName(name, '/')
              }',globDynamicComponentEntry?globDynamicComponentEntry:'__Card__')`
            ).join(','),
            ';',
            this.#appServiceFooter(),
          ].join(''),
          ...Object.fromEntries(
            Object.entries(inlinedManifest).map(([name, content]) => [
              this.#formatJSName(name, '/'),
              content,
            ]),
          ),
        };

        return args;
      });

      templateHooks.encode.tapPromise({
        name: this.name,
        stage: LynxEncodePlugin.ENCODE_STAGE,
      }, async (args) => {
        const { encodeOptions } = args;

        const { getEncodeMode } = await import('@lynx-js/tasm');

        const encode = getEncodeMode();

        const { buffer, lepus_debug } = await Promise.resolve(
          encode(encodeOptions),
        );

        return { buffer, debugInfo: lepus_debug };
      });
    });
  }

  #APP_SERVICE_NAME = '/app-service.js';
  #appServiceBanner(): string {
    const loadScriptBanner = `(function(){'use strict';function n({tt}){`;
    const amdBanner =
      `tt.define('${this.#APP_SERVICE_NAME}',function(e,module,_,i,l,u,a,c,s,f,p,d,h,v,g,y,lynx){`;

    return loadScriptBanner + amdBanner;
  }
  #appServiceFooter(): string {
    const loadScriptFooter = `}return{init:n}})()`;

    const amdFooter = `});return tt.require('${this.#APP_SERVICE_NAME}');`;

    return amdFooter + loadScriptFooter;
  }

  #formatJSName(name: string, publicPath: string): string {
    return publicPath + name;
  }

  #shouldInlineScript(name: string, size: number): boolean {
    const inlineConfig = this.options.inlineScripts;

    if (inlineConfig instanceof RegExp) {
      return inlineConfig.test(name);
    }

    if (typeof inlineConfig === 'function') {
      return inlineConfig({ size, name });
    }

    if (typeof inlineConfig === 'object') {
      if (inlineConfig.enable === false) return false;
      if (inlineConfig.test instanceof RegExp) {
        return inlineConfig.test.test(name);
      }
      return inlineConfig.test({ size, name });
    }

    return inlineConfig !== false;
  }

  protected options: Required<LynxEncodePluginOptions>;
}

export function isDebug(): boolean {
  if (!process.env['DEBUG']) {
    return false;
  }

  const values = process.env['DEBUG'].toLocaleLowerCase().split(',');
  return [
    'rspeedy',
    '*',
    'rspeedy:*',
    'rspeedy:template',
  ].some((key) => values.includes(key));
}

export function isRsdoctor(): boolean {
  return process.env['RSDOCTOR'] === 'true';
}
