// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { render } from 'preact';

import { LifecycleConstant, NativeUpdateDataType } from '../lifecycleConstant.js';
import type { FirstScreenData } from '../lifecycleConstant.js';
import { PerformanceTimingFlags, PipelineOrigins, beginPipeline, markTiming } from './performance.js';
import { BackgroundSnapshotInstance, hydrate } from '../backgroundSnapshot.js';
import { runWithForce } from './runWithForce.js';
import { destroyBackground } from '../lifecycle/destroy.js';
import { delayedEvents, delayedPublishEvent } from '../lifecycle/event/delayEvents.js';
import { delayLifecycleEvent, delayedLifecycleEvents } from '../lifecycle/event/delayLifecycleEvents.js';
import { commitPatchUpdate, genCommitTaskId, globalCommitTaskMap } from '../lifecycle/patch/commit.js';
import type { PatchList } from '../lifecycle/patch/commit.js';
import { removeCtxNotFoundEventListener } from '../lifecycle/patch/error.js';
import { runDelayedUiOps } from '../lifecycle/ref/delay.js';
import { reloadBackground } from '../lifecycle/reload.js';
import { CHILDREN } from '../renderToOpcodes/constants.js';
import { __root } from '../root.js';
import { backgroundSnapshotInstanceManager } from '../snapshot.js';
import type { SerializedSnapshotInstance } from '../snapshot.js';
import { destroyWorklet } from '../worklet/destroy.js';

export { runWithForce };

function injectTt(): void {
  const tt = lynxCoreInject.tt;
  tt.OnLifecycleEvent = onLifecycleEvent;
  tt.publishEvent = delayedPublishEvent;
  tt.publicComponentEvent = delayedPublicComponentEvent;
  tt.callDestroyLifetimeFun = () => {
    destroyWorklet();
    destroyBackground();
    removeCtxNotFoundEventListener();
  };
  tt.updateGlobalProps = updateGlobalProps;
  tt.updateCardData = updateCardData;
  tt.onAppReload = reloadBackground;
  tt.processCardConfig = () => {
    // used to updateTheme, no longer rely on this function
  };
}

function onLifecycleEvent([type, data]: [LifecycleConstant, unknown]) {
  const hasRootRendered = CHILDREN in __root;
  // never called `render(<App/>, __root)`
  // happens if user call `root.render()` async
  if (!hasRootRendered) {
    delayLifecycleEvent(type, data);
    return;
  }

  if (__PROFILE__) {
    console.profile(`OnLifecycleEvent::${type}`);
  }

  try {
    onLifecycleEventImpl(type, data);
  } catch (e) {
    lynx.reportError(e as Error);
  }

  if (__PROFILE__) {
    console.profileEnd();
  }
}

function onLifecycleEventImpl(type: LifecycleConstant, data: unknown): void {
  switch (type) {
    case LifecycleConstant.firstScreen: {
      const { root: lepusSide, jsReadyEventIdSwap } = data as FirstScreenData;
      if (__PROFILE__) {
        console.profile('hydrate');
      }
      beginPipeline(true, PipelineOrigins.reactLynxHydrate, PerformanceTimingFlags.reactLynxHydrate);
      markTiming('hydrateParseSnapshotStart');
      const before = JSON.parse(lepusSide) as SerializedSnapshotInstance;
      markTiming('hydrateParseSnapshotEnd');
      markTiming('diffVdomStart');
      const snapshotPatch = hydrate(
        before,
        __root as BackgroundSnapshotInstance,
      );
      if (__PROFILE__) {
        console.profileEnd();
      }
      markTiming('diffVdomEnd');

      // TODO: It seems `delayedEvents` and `delayedLifecycleEvents` should be merged into one array to ensure the proper order of events.
      flushDelayedLifecycleEvents();
      if (delayedEvents) {
        delayedEvents.forEach((args) => {
          const [handlerName, data] = args;
          // eslint-disable-next-line prefer-const
          let [idStr, ...rest] = handlerName.split(':');
          while (jsReadyEventIdSwap[idStr!]) idStr = jsReadyEventIdSwap[idStr!]?.toString();
          try {
            publishEvent([idStr, ...rest].join(':'), data);
          } catch (e) {
            lynx.reportError(e as Error);
          }
        });
        delayedEvents.length = 0;
      }

      lynxCoreInject.tt.publishEvent = publishEvent;
      lynxCoreInject.tt.publicComponentEvent = publicComponentEvent;

      // console.debug("********** After hydration:");
      // printSnapshotInstance(__root as BackgroundSnapshotInstance);
      if (__PROFILE__) {
        console.profile('commitChanges');
      }
      const commitTaskId = genCommitTaskId();
      const patchList: PatchList = {
        patchList: [{ snapshotPatch, id: commitTaskId }],
      };
      const obj = commitPatchUpdate(patchList, { isHydration: true });

      lynx.getNativeApp().callLepusMethod(LifecycleConstant.patchUpdate, obj, () => {
        globalCommitTaskMap.forEach((commitTask, id) => {
          if (id > commitTaskId) {
            return;
          }
          commitTask();
          globalCommitTaskMap.delete(id);
        });
      });
      runDelayedUiOps();
      break;
    }
    case LifecycleConstant.globalEventFromLepus: {
      const [eventName, params] = data as [string, Record<string, any>];
      lynx.getJSModule('GlobalEventEmitter').trigger(eventName, params);
      break;
    }
    case LifecycleConstant.publishEvent: {
      const { handlerName, data: d } = data as { handlerName: string; data: unknown };
      lynxCoreInject.tt.publishEvent(handlerName, d);
      break;
    }
  }
}

let flushingDelayedLifecycleEvents = false;
function flushDelayedLifecycleEvents(): void {
  // avoid stackoverflow
  if (flushingDelayedLifecycleEvents) return;
  flushingDelayedLifecycleEvents = true;
  if (delayedLifecycleEvents) {
    delayedLifecycleEvents.forEach((e) => {
      onLifecycleEvent(e);
    });
    delayedLifecycleEvents.length = 0;
  }
  flushingDelayedLifecycleEvents = false;
}

function publishEvent(handlerName: string, data: unknown) {
  lynxCoreInject.tt.callBeforePublishEvent?.(data);
  const eventHandler = backgroundSnapshotInstanceManager.getValueBySign(
    handlerName,
  );
  if (eventHandler) {
    try {
      (eventHandler as (...args: unknown[]) => void)(data);
    } catch (e) {
      lynx.reportError(e as Error);
    }
  }
}

function publicComponentEvent(_componentId: string, handlerName: string, data: unknown) {
  publishEvent(handlerName, data);
}

function delayedPublicComponentEvent(_componentId: string, handlerName: string, data: unknown) {
  delayedPublishEvent(handlerName, data);
}

function updateGlobalProps(newData: Record<string, any>): void {
  Object.assign(lynx.__globalProps, newData);

  // Our purpose is to make sure SYNC setState inside `emit`'s listeners
  // can be batched with updateFromRoot
  // This is already done because updateFromRoot will consume all dirty flags marked by
  // the setState, and setState's flush will be a noop. No extra diffs will be needed.
  void Promise.resolve().then(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    runWithForce(() => render(__root.__jsx, __root as any));
  });
  lynxCoreInject.tt.GlobalEventEmitter.emit('onGlobalPropsChanged', undefined);
}

function updateCardData(newData: Record<string, any>, options?: Record<string, any>): void {
  const { ['__lynx_timing_flag']: performanceTimingFlag, ...restNewData } = newData;
  if (performanceTimingFlag) {
    lynx.reportError(
      new Error(
        `Received unsupported updateData with \`__lynx_timing_flag\` (value "${performanceTimingFlag}"), the timing flag is ignored`,
      ),
    );
  }
  const { type = NativeUpdateDataType.UPDATE } = options ?? {};
  if (type == NativeUpdateDataType.RESET) {
    lynx.__initData = {};
  }

  // COW when modify `lynx.__initData` to make sure Provider & Consumer works
  lynx.__initData = Object.assign({}, lynx.__initData, restNewData);
  lynxCoreInject.tt.GlobalEventEmitter.emit('onDataChanged', undefined);
}

export { injectTt, flushDelayedLifecycleEvents };
