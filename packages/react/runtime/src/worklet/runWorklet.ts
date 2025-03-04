// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import type { JsFnHandle, Worklet } from '@lynx-js/react/worklet-runtime/bindings';
import { WorkletEvents } from '@lynx-js/react/worklet-runtime/bindings';

import { onPostWorkletCtx } from './ctx.js';
import { enableRunOnBackground } from './functionality.js';
import { lynxWorkletJsImpl } from './jsImpl.js';
/**
 * transform args of `runOnJS()`.
 *
 * @internal
 */
export function transformToWorklet(obj: Function): JsFnHandle {
  const impl = lynxWorkletJsImpl();
  const id = impl ? ++impl._workletJsFnLastId : 0;
  if (typeof obj !== 'function') {
    // We save the error message in the object, so that we can throw it later when the function is called on the main thread.
    return {
      _jsFnId: id,
      _error: `Argument of runOnBackground should be a function, but got [${typeof obj}] instead`,
    };
  }
  return {
    _jsFnId: id,
    _fn: obj,
  };
}

/**
 * `runOnMainThread` allows triggering main thread functions on the main thread asynchronously.
 * @param fn - The main thread functions to be called.
 * @returns A function. Calling which with the arguments to be passed to the main thread function to trigger it on the main thread.
 * @public
 */
export function runOnMainThread<Fn extends (...args: any[]) => any>(fn: Fn): (...args: Parameters<Fn>) => void {
  if (__LEPUS__) {
    throw new Error('runOnMainThread can only be used on the background thread.');
  }
  const impl = lynxWorkletJsImpl();
  if (!impl) {
    throw new Error('runOnMainThread requires Lynx sdk version 2.14.');
  }
  return (...params: any[]): void => {
    onPostWorkletCtx(fn as any as Worklet);
    lynx.getCoreContext!().dispatchEvent({
      type: WorkletEvents.runWorkletCtx,
      data: JSON.stringify({
        worklet: fn,
        params,
      }),
    });
  };
}

/**
 * `runOnBackground` allows triggering js functions on the js context asynchronously.
 * @param f - The js function to be called.
 * @returns A function. Calling which with the arguments to be passed to the js function to trigger it on the js context.
 * @public
 */
export function runOnBackground<Fn extends (...args: any[]) => any>(f: Fn): (...args: Parameters<Fn>) => void {
  if (!enableRunOnBackground()) {
    throw new Error('runOnBackground requires Lynx sdk version 2.16.');
  }
  if (__JS__) {
    throw new Error('runOnBackground can only be used on the main thread.');
  }
  const obj = f as any as JsFnHandle;
  if (obj._error) {
    throw new Error(obj._error);
  }
  return (...params: any[]): void => {
    if (lynx.getJSContext) {
      lynx.getJSContext().dispatchEvent({
        type: WorkletEvents.runOnBackground,
        data: JSON.stringify({
          obj: {
            _jsFnId: obj._jsFnId,
            _execId: obj._execId!,
          },
          params,
        }),
      });
    }
  };
}
