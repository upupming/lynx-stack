// @ts-nocheck
export * from '../dist/index.d.ts';
import { ElementTree, LynxTestingEnvironment } from '../dist/index.d.ts';

declare global {
  var lynxTestingEnvironment: LynxTestingEnvironment;
  var elementTree: ElementTree;

  function onInjectBackgroundThreadGlobals(globals: any): void;
  function onInjectMainThreadGlobals(globals: any): void;
  function onSwitchedToBackgroundThread(): void;
  function onSwitchedToMainThread(): void;
  function onResetLynxTestingEnvironment(): void;
  function onInitWorkletRuntime(): void;
}
