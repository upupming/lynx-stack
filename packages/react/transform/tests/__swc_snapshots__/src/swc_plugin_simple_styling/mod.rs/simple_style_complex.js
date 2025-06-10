import * as ReactLynx from "@lynx-js/react";
import { SimpleStyleSheet } from '@lynx-js/react';
const styles = {
    static1: {
        27: '100px',
        26: '100px'
    },
    static2: {
        7: 'blue',
        22: 'green'
    },
    static3: {
        44: 'center',
        24: 'flex'
    },
    conditional1: {
        21: '1px',
        11: 'red',
        118: 'solid'
    },
    conditional2: {
        20: '1px',
        10: 'red',
        117: 'solid'
    },
    conditional3: {
        19: '1px',
        9: 'red',
        116: 'solid'
    },
    conditional4: {
        19: '2px',
        9: 'blue',
        116: 'dashed'
    },
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
    __SimpleStyleInject("db4cf10", "width", "100px");
    __SimpleStyleInject("356935a", "height", "100px");
    __SimpleStyleInject("fa2e1f7", "background-color", "blue");
    __SimpleStyleInject("9cdf81d", "color", "green");
    __SimpleStyleInject("91a8701", "text-align", "center");
    __SimpleStyleInject("75816ca", "display", "flex");
    snapshotInstance.__styles[1] = [
        "db4cf10",
        "356935a",
        "fa2e1f7",
        "9cdf81d",
        "91a8701",
        "75816ca"
    ];
    __AppendElement(el, el1);
    return [
        el,
        el1
    ];
}, [
    (snapshot, index, oldValue)=>ReactLynx.updateEvent(snapshot, index, oldValue, 0, "bindEvent", "tap", ''),
    (snapshot)=>ReactLynx.updateSimpleStyle(snapshot, 1, 1)
], null, undefined, globDynamicComponentEntry);
function ComponentWithSimpleStyle({ condition1, condition2, condition3, dynamicStyleArgs }) {
    return <__snapshot_da39a_test_1 values={[
        1,
        [
            condition1 && [
                "e734863",
                "81b9601",
                "b692b3c"
            ],
            styles.dynamic(...dynamicStyleArgs),
            condition2 && [
                "84d5022",
                "6bffc6e",
                "005f2ef"
            ],
            condition3 ? [
                "2d662a9",
                "e747b32",
                "a8be028"
            ] : [
                "1fad3eb",
                "f71c730",
                "3cefb4b"
            ]
        ]
    ]}/>;
}
