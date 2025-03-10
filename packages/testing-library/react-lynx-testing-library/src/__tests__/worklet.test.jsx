import { describe, expect, vi } from 'vitest';
import { fireEvent, render } from '..';
import { runOnBackground, useMainThreadRef } from '@lynx-js/react';

describe('worklet', () => {
  it('main-thread script should work', async () => {
    const cb = vi.fn();
    const Comp = () => {
      return (
        <view
          main-thread:bindtap={(e) => {
            'main thread';
            cb(e);
          }}
        >
          <text>Hello Main Thread Script</text>
        </view>
      );
    };
    const { container } = render(<Comp />, {
      enableMainThread: true,
      enableBackgroundThread: false,
    });
    expect(container).toMatchInlineSnapshot(`
      <page
        cssId="__Card__:0"
      >
        <view
          event={
            {
              "bindEvent:tap": {
                "type": "worklet",
                "value": {
                  "_c": {
                    "cb": [MockFunction spy],
                  },
                  "_wkltId": "15ab:test:1",
                  "_workletType": "main-thread",
                },
              },
            }
          }
        >
          <text>
            <raw-text
              text="Hello Main Thread Script"
            />
          </text>
        </view>
      </page>
    `);
    fireEvent.tap(container.children[0], {
      key: 'value',
    });
    expect(cb).toBeCalledTimes(1);
    expect(cb.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "eventName": "tap",
            "key": "value",
          },
        ],
      ]
    `);
  });
  it('main-thread script should not throw when enable background thread', async () => {
    vi.spyOn(lynx.getNativeApp(), 'callLepusMethod');
    const callLepusMethodCalls = lynx.getNativeApp().callLepusMethod.mock.calls;
    expect(callLepusMethodCalls).toMatchInlineSnapshot(`[]`);

    globalThis.cb = vi.fn();
    const mainThreadFn = () => {
      'main thread';
      console.log('main thread');
      globalThis.cb();
    };

    const Comp = () => {
      return (
        <view
          main-thread:bindtap={mainThreadFn}
        >
          <text>Hello Main Thread Script</text>
        </view>
      );
    };
    const { container } = render(<Comp />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });

    expect(callLepusMethodCalls).toMatchInlineSnapshot(`
      [
        [
          "rLynxChange",
          {
            "data": "{"snapshotPatch":[3,-2,0,{"_wkltId":"15ab:test:2","_workletType":"main-thread","_execId":1}]}",
            "patchOptions": {
              "commitTaskId": 3,
              "isHydration": true,
              "pipelineOptions": {
                "needTimestamps": true,
                "pipelineID": "pipelineID",
              },
              "reloadVersion": 0,
            },
          },
          [Function],
        ],
      ]
    `);
    expect(container).toMatchInlineSnapshot(`
      <page
        cssId="__Card__:0"
      >
        <view
          event={
            {
              "bindEvent:tap": {
                "type": "worklet",
                "value": {
                  "_execId": 1,
                  "_wkltId": "15ab:test:2",
                  "_workletType": "main-thread",
                },
              },
            }
          }
        >
          <text>
            <raw-text
              text="Hello Main Thread Script"
            />
          </text>
        </view>
      </page>
    `);
    fireEvent.tap(container.children[0], {
      key: 'value',
    });
    expect(globalThis.cb).toBeCalledTimes(1);
    expect(globalThis.cb.mock.calls).toMatchInlineSnapshot(`
      [
        [],
      ]
    `);
    vi.resetAllMocks();
  });
  it.only('main-thread script should not update MTS function when enable background', async () => {
    vi.spyOn(lynx.getNativeApp(), 'callLepusMethod');
    const callLepusMethodCalls = lynx.getNativeApp().callLepusMethod.mock.calls;
    expect(callLepusMethodCalls).toMatchInlineSnapshot(`[]`);

    globalThis.cb = vi.fn();
    const mainThreadFn = (e) => {
      'main thread';
      console.log('main thread');
      globalThis.cb(e);
    };

    const Comp = (props) => {
      const {
        onClick,
      } = props;

      return (
        <view
          bindtap={e => {
            if (onClick) {
              onClick(e);
            }
          }}
          main-thread:bindtap={(e) => {
            'main thread';
            if (props['main-thread:onClick']) {
              props['main-thread:onClick'](e);
            }
          }}
        >
          <text>Hello Main Thread Script</text>
        </view>
      );
    };
    const { container } = render(<Comp main-thread:onClick={mainThreadFn} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });

    expect(callLepusMethodCalls).toMatchInlineSnapshot(`
      [
        [
          "rLynxChange",
          {
            "data": "{"snapshotPatch":[3,-2,1,{"_c":{"props":{"main-thread:onClick":{"_wkltId":"15ab:test:3"}}},"_wkltId":"15ab:test:4","_execId":1}]}",
            "patchOptions": {
              "commitTaskId": 2,
              "isHydration": true,
              "pipelineOptions": {
                "needTimestamps": true,
                "pipelineID": "pipelineID",
              },
              "reloadVersion": 0,
            },
          },
          [Function],
        ],
      ]
    `);
    expect(container).toMatchInlineSnapshot(`
      <page
        cssId="__Card__:0"
      >
        <view
          event={
            {
              "bindEvent:tap": {
                "type": "worklet",
                "value": {
                  "_c": {
                    "props": {
                      "main-thread:onClick": {
                        "_wkltId": "15ab:test:3",
                      },
                    },
                  },
                  "_execId": 1,
                  "_wkltId": "15ab:test:4",
                  "_workletType": "main-thread",
                },
              },
            }
          }
        >
          <text>
            <raw-text
              text="Hello Main Thread Script"
            />
          </text>
        </view>
      </page>
    `);
    fireEvent.tap(container.children[0], {
      key: 'value',
    });
    expect(globalThis.cb).toBeCalledTimes(1);
    expect(globalThis.cb.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "eventName": "tap",
            "key": "value",
          },
        ],
      ]
    `);
    vi.resetAllMocks();
  });

  it.only('bug', () => {
    vi.spyOn(lynx.getNativeApp(), 'callLepusMethod');
    const callLepusMethodCalls = lynx.getNativeApp().callLepusMethod.mock.calls;
    expect(callLepusMethodCalls).toMatchInlineSnapshot(`[]`);

    globalThis.cb = vi.fn();
    const mainThreadFn = (e) => {
      'main thread';
      console.log('main thread');
      globalThis.cb(e);
    };

    const List = (props) => {
      return (
        <view
          main-thread:bindscroll={e => {
            'main thread';
            if (props['main-thread:onScroll']) {
              props['main-thread:onScroll'](e);
            }
          }}
        >
        </view>
      );
    };

    const { container } = render(
      <List main-thread:onScroll={mainThreadFn}></List>,
      {
        enableMainThread: true,
        enableBackgroundThread: true,
      },
    );

    expect(container).toMatchInlineSnapshot(`
      <page
        cssId="__Card__:0"
      >
        <view
          event={
            {
              "bindEvent:scroll": {
                "type": "worklet",
                "value": {
                  "_c": {
                    "props": {
                      "main-thread:onScroll": {
                        "_wkltId": "15ab:test:5",
                      },
                    },
                  },
                  "_execId": 1,
                  "_wkltId": "15ab:test:6",
                  "_workletType": "main-thread",
                },
              },
            }
          }
        />
      </page>
    `);

    expect(callLepusMethodCalls).toMatchInlineSnapshot(`
      [
        [
          "rLynxChange",
          {
            "data": "{"snapshotPatch":[3,-2,0,{"_c":{"props":{"main-thread:onScroll":{"_wkltId":"15ab:test:5"}}},"_wkltId":"15ab:test:6","_execId":1}]}",
            "patchOptions": {
              "commitTaskId": 5,
              "isHydration": true,
              "pipelineOptions": {
                "needTimestamps": true,
                "pipelineID": "pipelineID",
              },
              "reloadVersion": 0,
            },
          },
          [Function],
        ],
      ]
    `);

    const list = container.children[0];
    fireEvent.scroll(list, {
      info: {
        detail: {
          scrollTop: 100,
          scrollLeft: 0,
        },
      },
    });
    expect(globalThis.cb).toBeCalledTimes(1);
  });

  it('runOnBackground works', async () => {
    vi.spyOn(lynx.getNativeApp(), 'callLepusMethod');
    const callLepusMethodCalls = lynx.getNativeApp().callLepusMethod.mock.calls;
    expect(callLepusMethodCalls).toMatchInlineSnapshot(`[]`);

    const cb = vi.fn();
    const Comp = () => {
      return (
        <view
          main-thread:bindtap={(e) => {
            'main thread';
            runOnBackground(() => {
              console.log('run on background');
              cb();
            })();
          }}
        >
          <text>Hello Main Thread Script</text>
        </view>
      );
    };
    const { container } = render(<Comp />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    expect(callLepusMethodCalls).toMatchInlineSnapshot(`
      [
        [
          "rLynxChange",
          {
            "data": "{"snapshotPatch":[3,-2,0,{"_wkltId":"15ab:test:5","_jsFn":{"_jsFn1":{"_jsFnId":2}},"_execId":1}]}",
            "patchOptions": {
              "commitTaskId": 9,
              "isHydration": true,
              "pipelineOptions": {
                "needTimestamps": true,
                "pipelineID": "pipelineID",
              },
              "reloadVersion": 0,
            },
          },
          [Function],
        ],
      ]
    `);
    expect(container).toMatchInlineSnapshot(`
      <page
        cssId="__Card__:0"
      >
        <view
          event={
            {
              "bindEvent:tap": {
                "type": "worklet",
                "value": {
                  "_execId": 1,
                  "_jsFn": {
                    "_jsFn1": {
                      "_jsFnId": 2,
                    },
                  },
                  "_wkltId": "15ab:test:5",
                  "_workletType": "main-thread",
                },
              },
            }
          }
        >
          <text>
            <raw-text
              text="Hello Main Thread Script"
            />
          </text>
        </view>
      </page>
    `);
    fireEvent.tap(container.children[0], {
      key: 'value',
    });
    expect(cb).toBeCalledTimes(1);
    expect(cb.mock.calls).toMatchInlineSnapshot(`
      [
        [],
      ]
    `);
    vi.resetAllMocks();
  });

  it('worklet ref should work', async () => {
    vi.spyOn(lynx.getNativeApp(), 'callLepusMethod');
    const callLepusMethodCalls = lynx.getNativeApp().callLepusMethod.mock.calls;
    expect(callLepusMethodCalls).toMatchInlineSnapshot(`[]`);
    globalThis.cb = vi.fn();
    const Comp = () => {
      const ref = useMainThreadRef(null);
      const num = useMainThreadRef(0);

      const handleTap = () => {
        'main thread';
        ref.current?.setStyleProperty('background-color', 'blue');
        num.current = 100;
        globalThis.cb(num.current);
      };

      return (
        <view
          main-thread:ref={ref}
          main-thread:bindtap={handleTap}
          style={{ width: '300px', height: '300px' }}
        >
          <text>Hello main thread ref</text>
        </view>
      );
    };

    const { container } = render(<Comp />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });

    expect(container).toMatchInlineSnapshot(`
      <page
        cssId="__Card__:0"
      >
        <view
          event={
            {
              "bindEvent:tap": {
                "type": "worklet",
                "value": {
                  "_c": {
                    "num": {
                      "_wvid": 2,
                    },
                    "ref": {
                      "_wvid": 1,
                    },
                  },
                  "_execId": 1,
                  "_wkltId": "15ab:test:6",
                  "_workletType": "main-thread",
                },
              },
            }
          }
          has-react-ref={true}
          style="width:300px;height:300px"
        >
          <text>
            <raw-text
              text="Hello main thread ref"
            />
          </text>
        </view>
      </page>
    `);
    expect(callLepusMethodCalls).toMatchInlineSnapshot(`
      [
        [
          "rLynxChange",
          {
            "data": "{"workletRefInitValuePatch":[[1,null],[2,0]]}",
            "patchOptions": {
              "commitTaskId": 11,
              "pipelineOptions": {
                "needTimestamps": true,
                "pipelineID": "pipelineID",
              },
              "reloadVersion": 0,
            },
          },
          [Function],
        ],
        [
          "rLynxChange",
          {
            "data": "{"snapshotPatch":[3,-2,0,{"_wvid":1},3,-2,1,{"_c":{"ref":{"_wvid":1},"num":{"_wvid":2}},"_wkltId":"15ab:test:6","_execId":1}]}",
            "patchOptions": {
              "commitTaskId": 12,
              "isHydration": true,
              "pipelineOptions": {
                "needTimestamps": true,
                "pipelineID": "pipelineID",
              },
              "reloadVersion": 0,
            },
          },
          [Function],
        ],
      ]
    `);
    fireEvent.tap(container.children[0], {
      key: 'value',
    });
    expect(globalThis.cb).toBeCalledTimes(1);
    expect(globalThis.cb.mock.calls).toMatchInlineSnapshot(`
      [
        [
          100,
        ],
      ]
    `);
  });
});
