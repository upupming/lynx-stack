import * as ReactLynx from "@lynx-js/react";
import { SimpleStyleSheet } from '@lynx-js/react';
const styles = {
    conditional1: {
        21: '1px',
        11: 'red',
        118: 'solid'
    },
    conditional2: {
        20: '1px',
        10: 'red',
        117: 'solid'
    }
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
function ComponentWithSimpleStyle({ condition1, condition2 }) {
    return <__snapshot_da39a_test_1 values={[
        1,
        [
            condition1 && [
                "e734863",
                "81b9601",
                "b692b3c"
            ],
            condition2 && [
                "84d5022",
                "6bffc6e",
                "005f2ef"
            ]
        ],
        [
            condition1 && [
                "e734863",
                "81b9601",
                "b692b3c"
            ],
            condition2 && [
                "84d5022",
                "6bffc6e",
                "005f2ef"
            ]
        ]
    ]}/>;
}
