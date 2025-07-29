// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

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

        let [inlinedManifest, externalManifest] = Object.entries(
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
          
        inlinedManifest['cache-script.js'] = `
(function(){
  'use strict';
  var g = (new Function('return this;'))();
  function __init_card_bundle__(lynxCoreInject) {
    g.__bundle__holder = undefined;
    var globDynamicComponentEntry = g.globDynamicComponentEntry || '__Card__';
    var tt = lynxCoreInject.tt;
    tt.define("cache-script.js", function(require, module, exports, __Card,setTimeout,setInterval,clearInterval,clearTimeout,NativeModules,tt,console,__Component,__ReactLynx,nativeAppId,__Behavior,LynxJSBI,lynx,window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,__WebSocket__,webkit,Reporter,print,global,requestAnimationFrame,cancelAnimationFrame) {
    
      ;(() => {
        const tt = lynxCoreInject.tt;
        console.log('hello from cache script', tt)
        let cachedCalls = [];
        
        console.log('g', g);
        console.log('this', this);
        console.log('tt.addInternalEventListener', tt.addInternalEventListener);
        console.log('tt.removeInternalEventListenersCallbacks', tt.removeInternalEventListenersCallbacks);
        
        // tt.OnLifecycleEvent = (...args) => {
        //   console.log('OnLifecycleEvent', ...args);
        //   cachedCalls.push({
        //     type: 'OnLifecycleEvent',
        //     args,
        //   });
        // }
        // tt.publishEvent = (...args) => {
        //   console.log('publishEvent', ...args);
        // }
        
        console.log('tt', tt.constructor.name);
        
        if (tt.constructor.name !== 'TTApp') {
          const methodsToMock = [
            'OnLifecycleEvent',
            'publishEvent',
            'publicComponentEvent',
            'callDestroyLifetimeFun',
            'updateGlobalProps',
            'updateCardData',
            'onAppReload',
            'processCardConfig'
          ]
          
          methodsToMock.forEach(methodName => {
            tt[methodName] = (...args) => {
              cachedCalls.push({
                type: methodName,
                args,
              });
            }
          })
        }
          
        
        // this.addInternalEventListener(
        //   ContextProxyType.CoreContext,
        //   MessageEventType.ON_NATIVE_APP_READY,
        //   () => {
        //     this.onNativeAppReady();
        //   }
        // );
        // this.addInternalEventListener(
        //   ContextProxyType.CoreContext,
        //   MessageEventType.NOTIFY_GLOBAL_PROPS_UPDATED,
        //   (event: MessageEvent) => {
        //     this.updateGlobalProps(event.data);
        //   }
        // );
        // this.addInternalEventListener(
        //   ContextProxyType.CoreContext,
        //   MessageEventType.ON_LIFECYCLE_EVENT,
        //   (event: MessageEvent) => {
        //     this.OnLifecycleEvent(event.data);
        //   }
        // );
        // this.addInternalEventListener(
        //   ContextProxyType.CoreContext,
        //   MessageEventType.ON_APP_FIRST_SCREEN,
        //   () => {
        //     this.onAppFirstScreen();
        //   }
        // );
        // this.addInternalEventListener(
        //   ContextProxyType.CoreContext,
        //   MessageEventType.ON_DYNAMIC_JS_SOURCE_PREPARED,
        //   (event: MessageEvent) => {
        //     nativeGlobal.loadDynamicComponent(this, event.data);
        //   }
        // );
        // this.addInternalEventListener(
        //   ContextProxyType.CoreContext,
        //   MessageEventType.ON_APP_ENTER_FOREGROUND,
        //   () => {
        //     this.onAppEnterForeground();
        //   }
        // );
        // this.addInternalEventListener(
        //   ContextProxyType.CoreContext,
        //   MessageEventType.ON_APP_ENTER_BACKGROUND,
        //   () => {
        //     this.onAppEnterBackground();
        //   }
        // );
        
        // // TTApp
        // protected addInternalEventListeners() {
        //   super.addInternalEventListeners();
        //   this.addInternalEventListener(
        //     ContextProxyType.CoreContext,
        //     MessageEventType.ON_COMPONENT_ACTIVITY,
        //     (event: MessageEvent) => {
        //       const [
        //         action,
        //         component_id,
        //         parent_component_id,
        //         path,
        //         entry_name,
        //         data,
        //       ] = event.data;
        //       let params = undefined;
        //       if (action === ComponentLifecycleState.created && data !== undefined) {
        //         params = {
        //           initData: data,
        //           entryName: entry_name,
        //           parentId: parent_component_id,
        //         };
        //       }
        //       this.onComponentActivity(action, component_id, path, params);
        //       // When a component detached, call ForceGcOnJSThread to clear dirty
        //       // JSIObjectWrapper. This may not only clear JSIObjectWrapper created by
        //       // this component, but all of the dirty JSIObjectWrapper can be cleared.
        //       //
        //       // There is a mutex inside ForceGcOnJSThread, which may cause main thread
        //       // waiting for ForceGcOnJSThread.
        //       // see: #8680
        //       if (action === ComponentLifecycleState.detached) {
        //         this.forceGcJSIObjectWrapper();
        //       }
        //     }
        //   );
        //   this.addInternalEventListener(
        //     ContextProxyType.CoreContext,
        //     MessageEventType.ON_COMPONENT_SELECTOR_CHANGED,
        //     (event: MessageEvent) => {
        //       const [componentId, data] = event.data;
        //       this.onComponentInstanceChanged(componentId, data);
        //     }
        //   );
        //   this.addInternalEventListener(
        //     ContextProxyType.CoreContext,
        //     MessageEventType.ON_COMPONENT_PROPERTIES_CHANGED,
        //     (event: MessageEvent) => {
        //       const [componentId, properties] = event.data;
        //       this.onComponentPropertiesChanged(componentId, properties);
        //     }
        //   );
        //   this.addInternalEventListener(
        //     ContextProxyType.CoreContext,
        //     MessageEventType.ON_COMPONENT_DATA_SET_CHANGED,
        //     (event: MessageEvent) => {
        //       const [componentId, dataSet] = event.data;
        //       this.onComponentDatasetChanged(componentId, dataSet);
        //     }
        //   );
        // }
        
        tt.__removeInternalEventListeners();
        
        const eventsToMock = [
          '__OnNativeAppReady',
          '__NotifyGlobalPropsUpdated',
          '__OnLifecycleEvent',
          '__OnAppFirstScreen',
          '__OnDynamicJSSourcePrepared',
          '__OnAppEnterForeground',
          '__OnAppEnterBackground',
        ]
        const ttEventsToMock = [
          '__OnComponentActivity',
          '__OnComponentSelectorChanged',
          '__OnComponentPropertiesChanged',
          '__OnComponentDataSetChanged'
        ]
        const eventToMethod = {
          '__OnNativeAppReady': 'onNativeAppReady',
          '__NotifyGlobalPropsUpdated': 'updateGlobalProps',
          '__OnLifecycleEvent': 'OnLifecycleEvent',
          '__OnAppFirstScreen': 'onAppFirstScreen',
          '__OnDynamicJSSourcePrepared': 'loadDynamicComponent',
          '__OnAppEnterForeground': 'onAppEnterForeground',
          '__OnAppEnterBackground': 'onAppEnterBackground',
        }
        const ttEventToMethod = {
          '__OnComponentActivity': 'onComponentActivity',
          '__OnComponentSelectorChanged': 'onComponentSelectorChanged',
          '__OnComponentPropertiesChanged': 'onComponentPropertiesChanged',
          '__OnComponentDataSetChanged': 'onComponentDataSetChanged',
        }
        const cachedEvents = [];
        eventsToMock.forEach(eventName => {
          tt.addInternalEventListener(0, eventName, (...args) => {
            cachedEvents.push({
              eventName,
              args,
            });
          })
        })
        const ttCachedEvents = [];
        ttEventsToMock.forEach(eventName => {
          tt.addInternalEventListener(0, eventName, (...args) => {
            ttCachedEvents.push({
              eventName,
              args,
            });
          })
        })
          
        
        tt.onBackgroundThreadReady = () => {
          console.log('onBackgroundThreadReady')
          
          // replay cachedCalls
          cachedCalls.forEach(call => {
            console.log('replay calls', call.type, call.args);
            tt[call.type](...call.args);
          })
            
          // register correct event listeners
          cachedEvents.forEach(event => {
            console.log('register event listener', event.eventName);
            tt.addInternalEventListener(0, event.eventName, (...args) => {
              console.log('dispatch event', event.eventName, args);
              tt[eventToMethod[event.eventName]](args[0].data);
            })
          })
          
          
          // replay cachedEvents
          cachedEvents.forEach(event => {
            console.log('replay events', event.eventName, event.args);
            // lynx.getJSContext().dispatchEvent({
            //   type: event.eventName,
            //   data: event.args,
            // })
            tt[eventToMethod[event.eventName]](event.args[0].data);
          })
          
          // register correct event listeners
          ttCachedEvents.forEach(event => {
            console.log('register event listener', event.eventName);
            tt.addInternalEventListener(0, event.eventName, (...args) => {
              console.log('dispatch event', event.eventName, args);
              if (event.eventName === '__OnComponentActivity') {
                const [
                  action,
                  component_id,
                  parent_component_id,
                  path,
                  entry_name,
                  data,
                ] = args[0].data;
                let params = undefined;
                if (action === "created" && data !== undefined) {
                  params = {
                    initData: data,
                    entryName: entry_name,
                    parentId: parent_component_id,
                  };
                }
                tt.onComponentActivity(action, component_id, path, params);
                // When a component detached, call ForceGcOnJSThread to clear dirty
                // JSIObjectWrapper. This may not only clear JSIObjectWrapper created by
                // this component, but all of the dirty JSIObjectWrapper can be cleared.
                //
                // There is a mutex inside ForceGcOnJSThread, which may cause main thread
                // waiting for ForceGcOnJSThread.
                // see: #8680
                if (action === "detached") {
                  tt.forceGcJSIObjectWrapper();
                } 
                
                return
              }
              tt[ttEventToMethod[event.eventName]](...args[0].data);
            })
          })
          
          // replay cachedEvents
          ttCachedEvents.forEach(event => {
            console.log('replay events', event.eventName, event.args);
            if (event.eventName === '__OnComponentActivity') {
              const [
                action,
                component_id,
                parent_component_id,
                path,
                entry_name,
                data,
              ] = event.args[0].data;
              let params = undefined;
              if (action === "created" && data !== undefined) {
                params = {
                  initData: data,
                  entryName: entry_name,
                  parentId: parent_component_id,
                };
              }
              tt.onComponentActivity(action, component_id, path, params);
              // When a component detached, call ForceGcOnJSThread to clear dirty
              // JSIObjectWrapper. This may not only clear JSIObjectWrapper created by
              // this component, but all of the dirty JSIObjectWrapper can be cleared.
              //
              // There is a mutex inside ForceGcOnJSThread, which may cause main thread
              // waiting for ForceGcOnJSThread.
              // see: #8680
              if (action === "detached") {
                tt.forceGcJSIObjectWrapper();
              }
              return
            }
            tt[ttEventToMethod[event.eventName]](...args[0].data);
          })
        }
      })();
      
    });
    return tt.require("cache-script.js");
  };
  if (g && g.bundleSupportLoadScript){
    var res = {init: __init_card_bundle__};
    g.__bundle__holder = res;
    return res;
  } else {
    __init_card_bundle__({"tt": tt});
  };
})();

        `;
        
        inlinedManifest = {
          // 保证防在最前面
          'cache-script.js': inlinedManifest['cache-script.js'],
          ...inlinedManifest,
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
