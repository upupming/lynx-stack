import type { SnapshotInstance } from '../snapshot.js';

function updateSimpleStyle(
  snapshotInstance: SnapshotInstance,
  elementIndex: number,
  attributeIndex: number,
): void {
  // first time initialization
  if (!(elementIndex in snapshotInstance.__styles_st_len!)) {
    snapshotInstance.__styles![elementIndex] ||= [];
    const n = snapshotInstance.__styles![elementIndex].length;
    for (let i = 0; i < snapshotInstance.__values![attributeIndex].length; i++) {
      const style = snapshotInstance.__values![attributeIndex][i];
      // for conditional style:
      // if conditional satisfies, the style will be an array of encoded style object indices
      // otherwise, the style will be `false`
      if (Array.isArray(style) || !style) {
        snapshotInstance.__styles![elementIndex].push(style || []);
      } else {
        // for dynamic style:
        snapshotInstance.__styles![elementIndex].push(__CreateStyleObject(style));
      }
    }
    __SetStyleObject(snapshotInstance.__elements![elementIndex]!, snapshotInstance.__styles![elementIndex]);

    snapshotInstance.__styles_st_len![elementIndex] = n;
    return;
  }
  const n = snapshotInstance.__styles_st_len![elementIndex]!;
  let hasConditionalStyle = false;
  for (let i = n; i < n + snapshotInstance.__values![attributeIndex].length; i++) {
    let style = snapshotInstance.__values![attributeIndex][i - n];

    if (Array.isArray(style) || !style) {
      snapshotInstance.__styles![elementIndex]![i] = style || [];
      hasConditionalStyle = true;
    } else {
      __UpdateStyleObject(
        snapshotInstance.__styles![elementIndex]![i]!,
        style,
      );
    }
  }
  // The list only changes when there is conditional style
  if (hasConditionalStyle) {
    __SetStyleObject(snapshotInstance.__elements![elementIndex]!, snapshotInstance.__styles![elementIndex]!);
  }
}

export { updateSimpleStyle };
