import { render, fireEvent, act } from '..';
import { useEffect, useState } from 'preact/hooks';
import { renderToString } from '../../../runtime/lib/renderToOpcodes';
import { __page } from '../../../runtime/lib/snapshot';
import { jsx } from '../../../runtime/jsx-runtime/index.js';
import { prettyFormatSnapshotPatch } from '../../../runtime/lib/debug/formatPatch';
import { expect, vi } from 'vitest';

test('basic', async () => {
  vi.spyOn(lynxTestingEnv.backgroundThread.lynxCoreInject.tt, 'OnLifecycleEvent');
  const onLifecycleEventCalls = lynxTestingEnv.backgroundThread.lynxCoreInject.tt.OnLifecycleEvent.mock.calls;
  vi.spyOn(lynx.getNativeApp(), 'callLepusMethod');
  const callLepusMethodCalls = lynx.getNativeApp().callLepusMethod.mock.calls;

  const A = () => {
    return jsx('et1', {});
  };

  let setW, setId1, setId2, setHandle1, setHandle2, setHello0, setHello1, setTextProps;

  function Comp() {
    const [w, _setW] = useState('100px');
    const [id1, _setId1] = useState('id1');
    const [id2, _setId2] = useState('id2');
    const [handle1, _setHandle1] = useState('handle1');
    const [handle2, _setHandle2] = useState('handle2');
    const [hello0, _setHello0] = useState('hello0');
    const [hello1, _setHello1] = useState('hello1');
    const [textProps, _setTextProps] = useState({
      className: 'text',
      style: 'font-size: 10px;',
    });
    setW = _setW;
    setId1 = _setId1;
    setId2 = _setId2;
    setHandle1 = _setHandle1;
    setHandle2 = _setHandle2;
    setHello0 = _setHello0;
    setHello1 = _setHello1;
    setTextProps = _setTextProps;

    return (
      jsx('et2', {
        values: [
          `background-color: red; width: ${w};`,
          id1,
          handle1,
          id2,
          handle2,
          {
            ...textProps,
            // __spread: true,
          },
        ],
        $0: hello0,
        $1: /* @__PURE__ */ __vite_ssr_import_0__.jsx(A, {}),
        $2: hello1,
      })
    );
  }
  const { container } = render(<Comp />, {
    enableMainThread: true,
    enableBackgroundThread: true,
  });
  expect(container).toMatchInlineSnapshot(`
    <page>
      <view
        bindtap="handle1"
        class="view"
        id="id1"
        style="background-color: red; width: 100px;"
      >
        <text
          bindtap="handle2"
          class="text"
          id="id2"
        >
          Hello, ReactLynx, 
          hello0
        </text>
        <text>
          A
        </text>
        <text
          classname="text"
          style="font-size: 10px;"
        >
          Hello, ReactLynx, 
          hello1
        </text>
      </view>
    </page>
  `);

  act(() => {
    setHello0('hello0-1');
    setHello1('hello1-1');
    setTextProps({
      className: 'text-1',
      style: 'font-size: 10px; color: red;',
    });
    setW('200px');
  });
  expect(container).toMatchInlineSnapshot(`
    <page>
      <view
        bindtap="handle1"
        class="view"
        id="id1"
        style="background-color: red; width: 200px;"
      >
        <text
          bindtap="handle2"
          class="text"
          id="id2"
        >
          Hello, ReactLynx, 
          hello0-1
        </text>
        <text>
          A
        </text>
        <text
          classname="text-1"
          style="font-size: 10px; color: red;"
        >
          Hello, ReactLynx, 
          hello1-1
        </text>
      </view>
    </page>
  `);

  onLifecycleEventCalls[0][0][1].root = JSON.stringify(
    JSON.parse(onLifecycleEventCalls[0][0][1].root),
    null,
    2,
  );
  expect(onLifecycleEventCalls).toMatchInlineSnapshot(`
    [
      [
        [
          "rLynxFirstScreen",
          {
            "jsReadyEventIdSwap": {},
            "root": "{
      "id": -1,
      "type": "root",
      "children": [
        {
          "id": -2,
          "type": "et2",
          "values": [
            "background-color: red; width: 100px;",
            "id1",
            "handle1",
            "id2",
            "handle2",
            {
              "className": "text",
              "style": "font-size: 10px;"
            }
          ],
          "children": [
            {
              "id": -4,
              "type": null,
              "values": [
                "hello0"
              ],
              "__slotIndex": 0
            },
            {
              "id": -3,
              "type": "et1",
              "__slotIndex": 1
            },
            {
              "id": -5,
              "type": null,
              "values": [
                "hello1"
              ],
              "__slotIndex": 2
            }
          ],
          "__slotIndex": 0
        }
      ]
    }",
          },
        ],
      ],
    ]
  `);

  for (const call of callLepusMethodCalls) {
    const snapshotPatch = JSON.parse(call[1]['data']).patchList[0].snapshotPatch;
    const formattedSnapshotPatch = prettyFormatSnapshotPatch(snapshotPatch);
    call[1]['data'] = JSON.stringify(
      {
        ...JSON.parse(call[1]['data']),
        patchList: [{ snapshotPatch: formattedSnapshotPatch }],
      },
      null,
      2,
    );
  }
  expect(callLepusMethodCalls).toMatchInlineSnapshot(`
                  [
                    [
                      "rLynxChange",
                      {
                        "data": "{
                    "patchList": [
                      {
                        "snapshotPatch": []
                      }
                    ]
                  }",
                        "patchOptions": {
                          "isHydration": true,
                          "pipelineOptions": {
                            "dsl": "reactLynx",
                            "needTimestamps": true,
                            "pipelineID": "pipelineID",
                            "pipelineOrigin": "reactLynxHydrate",
                            "stage": "hydrate",
                          },
                          "reloadVersion": 0,
                        },
                      },
                      [Function],
                    ],
                    [
                      "rLynxChange",
                      {
                        "data": "{
                    "patchList": [
                      {
                        "snapshotPatch": [
                          {
                            "op": "SetAttribute",
                            "id": -2,
                            "dynamicPartIndex": 0,
                            "value": "background-color: red; width: 200px;"
                          },
                          {
                            "op": "SetAttribute",
                            "id": -2,
                            "dynamicPartIndex": 5,
                            "value": {
                              "className": "text-1",
                              "style": "font-size: 10px; color: red;"
                            }
                          },
                          {
                            "op": "SetAttribute",
                            "id": -4,
                            "dynamicPartIndex": 0,
                            "value": "hello0-1"
                          },
                          {
                            "op": "SetAttribute",
                            "id": -5,
                            "dynamicPartIndex": 0,
                            "value": "hello1-1"
                          }
                        ]
                      }
                    ]
                  }",
                        "patchOptions": {
                          "pipelineOptions": {
                            "dsl": "reactLynx",
                            "needTimestamps": true,
                            "pipelineID": "pipelineID",
                            "pipelineOrigin": "reactLynxHydrate",
                            "stage": "hydrate",
                          },
                          "reloadVersion": 0,
                        },
                      },
                      [Function],
                    ],
                  ]
                `);
});
