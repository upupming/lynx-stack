import { globalPipelineOptions } from './impl.js';

enum MainThreadPerformanceTimingKeys {
  update_diff_vdom_start,
  update_diff_vdom_end,
  parse_changes_start,
  parse_changes_end,
  patch_changes_start,
  patch_changes_end,
}

function markMainThreadTiming(
  timestampKey: MainThreadPerformanceTimingKeys,
  force?: boolean,
): void {
  if (globalPipelineOptions && (force || globalPipelineOptions.needTimestamps)) {
    lynx.performance?._markTiming?.(globalPipelineOptions.pipelineID, MainThreadPerformanceTimingKeys[timestampKey]);
  }
}

/**
 * @internal
 */
export { MainThreadPerformanceTimingKeys, markMainThreadTiming };
/**
 * @internal
 */
export { globalPipelineOptions, beginPipeline, setPipeline } from './impl.js';
