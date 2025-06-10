import * as ReactLynx from "@lynx-js/react";
import { SimpleStyleSheet } from '@lynx-js/react';
const styles = {
    dynamic: (color, size)=>({
            8: color,
            35: size
        })
};
const __snapshot_da39a_test_1 = ReactLynx.createSnapshot("__snapshot_da39a_test_1", function(snapshotInstance) {
    const pageId = ReactLynx.__pageId;
    const el = __CreateView(pageId);
    __SetClasses(el, "root");
    const el1 = __CreateView(pageId);
    snapshotInstance.__styles_st_len = [];
    snapshotInstance.__styles = [];
    snapshotInstance.__styles[1] = [];
    __AppendElement(el, el1);
    const el2 = __CreateView(pageId);
    snapshotInstance.__styles[2] = [];
    __AppendElement(el, el2);
    return [
        el,
        el1,
        el2
    ];
}, [
    (snapshot, index, oldValue)=>ReactLynx.updateEvent(snapshot, index, oldValue, 0, "bindEvent", "tap", ''),
    (snapshot)=>ReactLynx.updateSimpleStyle(snapshot, 1, 1),
    (snapshot)=>ReactLynx.updateSimpleStyle(snapshot, 2, 2)
], null, undefined, globDynamicComponentEntry);
function ComponentWithSimpleStyle({ dynamicStyleArgs }) {
    return <__snapshot_da39a_test_1 values={[
        1,
        [
            styles.dynamic(...dynamicStyleArgs)
        ],
        [
            styles.dynamic(...dynamicStyleArgs)
        ]
    ]}/>;
}
