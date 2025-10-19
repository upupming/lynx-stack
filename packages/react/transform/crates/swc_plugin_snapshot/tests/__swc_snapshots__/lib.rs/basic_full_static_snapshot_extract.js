import * as ReactLynx from "@lynx-js/react";
const __snapshot_da39a_test_1 = ReactLynx.createSnapshot("__snapshot_da39a_test_1", function() {
    const pageId = ReactLynx.__pageId;
    const el = __CreateView(pageId);
    __SetClasses(el, "view");
    const el1 = __CreateText(pageId);
    __SetClasses(el1, "text");
    __AppendElement(el, el1);
    const el2 = __CreateRawText("Hello, ReactLynx, ");
    __AppendElement(el1, el2);
    const el3 = __CreateWrapperElement(pageId);
    __AppendElement(el1, el3);
    const el4 = __CreateWrapperElement(pageId);
    __AppendElement(el, el4);
    const el5 = __CreateText(pageId);
    __AppendElement(el, el5);
    const el6 = __CreateRawText("Hello, ReactLynx, ");
    __AppendElement(el5, el6);
    const el7 = __CreateWrapperElement(pageId);
    __AppendElement(el5, el7);
    return [
        el,
        el1,
        el2,
        el3,
        el4,
        el5,
        el6,
        el7
    ];
}, [
    function(ctx) {
        if (ctx.__elements) {
            __SetInlineStyles(ctx.__elements[0], ctx.__values[0]);
        }
    },
    function(ctx) {
        if (ctx.__elements) {
            __SetID(ctx.__elements[0], ctx.__values[1]);
        }
    },
    (snapshot, index, oldValue)=>ReactLynx.updateEvent(snapshot, index, oldValue, 0, "bindEvent", "tap", ''),
    function(ctx) {
        if (ctx.__elements) {
            __SetID(ctx.__elements[1], ctx.__values[3]);
        }
    },
    (snapshot, index, oldValue)=>ReactLynx.updateEvent(snapshot, index, oldValue, 1, "bindEvent", "tap", ''),
    (snapshot, index, oldValue)=>ReactLynx.updateSpread(snapshot, index, oldValue, 5)
], [
    [
        ReactLynx.__DynamicPartSlotV2,
        3
    ],
    [
        ReactLynx.__DynamicPartSlotV2,
        4
    ],
    [
        ReactLynx.__DynamicPartSlotV2,
        7
    ]
], undefined, globDynamicComponentEntry, [
    5
]);
<__snapshot_da39a_test_1 values={[
    `background-color: red; width: ${w};`,
    id1,
    1,
    id2,
    1,
    {
        ...textProps,
        __spread: true
    }
]} $0={hello0} $1={<A/>} $2={hello1}/>;
