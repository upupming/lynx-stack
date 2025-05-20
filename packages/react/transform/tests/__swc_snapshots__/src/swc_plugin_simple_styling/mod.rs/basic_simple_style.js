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
    dynamic: (color, size)=>({
            8: color,
            35: size
        })
};
const __snapshot_da39a_test_1 = ReactLynx.createSnapshot("__snapshot_da39a_test_1", function(snapshotInstance) {
    const pageId = ReactLynx.__pageId;
    const el = __CreateView(pageId);
    __SimpleStyleInject("db4cf10", "width", "100px");
    __SimpleStyleInject("356935a", "height", "100px");
    __SimpleStyleInject("fa2e1f7", "background-color", "blue");
    __SimpleStyleInject("9cdf81d", "color", "green");
    __SimpleStyleInject("91a8701", "text-align", "center");
    __SimpleStyleInject("75816ca", "display", "flex");
    __SimpleStyleInject("f61f6f2", "border-left-style", "solid");
    __SimpleStyleInject("bad68fd", "border-left-width", "1px");
    snapshotInstance.__dy_init = [
        {
            118: null,
            21: null,
            11: null
        },
        {
            115: null,
            18: null
        },
        {
            117: null,
            10: null,
            20: null
        }
    ];
    snapshotInstance.__dy_styles = snapshotInstance.__dy_init.map(__CreateStyleObject);
    __SetStyleObject(el, [
        "db4cf10",
        "356935a",
        "fa2e1f7",
        "9cdf81d",
        "91a8701",
        "75816ca",
        "f61f6f2",
        "bad68fd",
        ...snapshotInstance.__dy_styles
    ]);
    return [
        el
    ];
}, [
    function(ctx) {
        if (ctx.__elements) {
            ReactLynx.updateSimpleStyle(ctx, ctx.__values[0]);
        }
    }
], null, undefined, globDynamicComponentEntry);
function ComponentWithSimpleStyle({ condition1, condition2, dynamicStyleArgs }) {
    return <__snapshot_da39a_test_1 values={[
        [
            condition1 && styles.conditional1,
            styles.dynamic(...dynamicStyleArgs),
            condition2 && styles.conditional2
        ]
    ]}/>;
}
