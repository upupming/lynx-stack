import { cloneElement, Component, render } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { BackgroundSnapshotInstance, hydrate } from '../src/backgroundSnapshot';
import { setupBackgroundDocument, setupDocument } from '../src/document';
import { globalBackgroundSnapshotInstancesToRemove } from '../src/lifecycle/patch/commit';
import {
  deinitGlobalSnapshotPatch,
  initGlobalSnapshotPatch,
  takeGlobalSnapshotPatch,
} from '../src/lifecycle/patch/snapshotPatch';
import { runWithForce } from '../src/lynx/tt';
import {
  SnapshotInstance,
  backgroundSnapshotInstanceManager,
  setupPage,
  snapshotInstanceManager,
  traverseSnapshotInstance,
} from '../src/snapshot';
import { backgroundSnapshotInstanceToJSON, snapshotInstanceToJSON } from './utils/debug.js';
import { globalEnvManager } from './utils/envManager';
import { elementTree } from './utils/nativeMethod';

function randomize(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function collectRawText(root) {
  const collect = [];
  traverseSnapshotInstance(root, si => {
    if (si.type === null) {
      collect.push(si.__values[0]);
    }
  });
  return collect;
}

function collectRawText2(root) {
  const collect = [];

  function traverseFiberElement(fiberElement, callback) {
    const c = fiberElement.children;
    callback(fiberElement);
    if (c) {
      for (const vv of c) {
        traverseFiberElement(vv, callback);
      }
    }
  }

  traverseFiberElement(root, e => {
    if (e.type === 'raw-text') {
      collect.push(e.props.text);
    }
  });
  return collect;
}

describe('document', () => {
  /** @type {SnapshotInstance} */
  let scratch;

  let preToJSON;
  beforeAll(() => {
    globalEnvManager.switchToMainThread();
    setupDocument();
    setupPage(__CreatePage('0', 0));

    preToJSON = SnapshotInstance.prototype.toJSON;
    SnapshotInstance.prototype.toJSON = snapshotInstanceToJSON;
  });

  afterAll(() => {
    SnapshotInstance.prototype.toJSON = preToJSON;
  });

  beforeEach(() => {
    snapshotInstanceManager.clear();
    scratch = document.createElement('root');
  });

  afterEach(() => {
    render(null, scratch);
    elementTree.clear();
    snapshotInstanceManager.clear();
  });

  it('basic - diff', async function() {
    scratch.ensureElements();
    render(
      <view>
        <text>!!!</text>
        <text>{'Hello'}</text>
        <raw-text text={'World'.toLowerCase()} />
      </view>,
      scratch,
    );
    expect(scratch.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <view>
          <text>
            <raw-text
              text="!!!"
            />
          </text>
          <text>
            <raw-text
              text="Hello"
            />
          </text>
          <raw-text
            text="world"
          />
        </view>
      </page>
    `);

    expect([...snapshotInstanceManager.values.keys()]).toMatchInlineSnapshot(`
      [
        -3,
        -4,
        -5,
      ]
    `);

    render(
      <image>
        <text>Hello World</text>
        <text>{'Hello'}</text>
        <text>{'World'}</text>
      </image>,
      scratch,
    );
    expect(scratch.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <image>
          <text>
            <raw-text
              text="Hello World"
            />
          </text>
          <text>
            <raw-text
              text="Hello"
            />
            <raw-text
              text="World"
            />
          </text>
          <text />
        </image>
      </page>
    `);
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_2>
          "Hello"
          "World"
        </__Card__:__snapshot_a94a8_test_2>
      </root>
    `);
    expect([...snapshotInstanceManager.values.keys()]).toMatchInlineSnapshot(`
      [
        -3,
        -6,
        -7,
        -8,
      ]
    `);
  });

  it('basic - update raw-text', async function() {
    scratch.ensureElements();
    const jsx = t => <text>{t}</text>;

    render(jsx('Hello!'), scratch);
    expect(scratch.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <text>
          <raw-text
            text="Hello!"
          />
        </text>
      </page>
    `);
    render(jsx('Hello!!'), scratch);
    expect(scratch.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <text>
          <raw-text
            text="Hello!!"
          />
        </text>
      </page>
    `);
  });

  it('shuffle', async function() {
    scratch.ensureElements();

    const jsx = items => (
      <view>
        <view></view>
        {items.map(key => (
          <view key={key}>
            <text>{key}</text>
          </view>
        ))}
      </view>
    );

    const a = Array.from({ length: 20 }).map((_, i) => `${i}`);

    for (let i = 0; i < 100; i++) {
      const aa = randomize(a);
      render(jsx(aa), scratch);
      const aaa = collectRawText2(scratch.__element_root);
      expect(aa).toStrictEqual(aaa);
    }
  });

  it('real world complex jsx - ResultCell', () => {
    function ResultCell({ result, desc, text, idx = 0 }) {
      /* v8 ignore start */
      return (
        <view class='result-root'>
          {desc && (
            <view class='result-cell'>
              <text class='desc'>{desc}</text>
            </view>
          )}
          <view class='result-cell'>
            {result
              ? (
                <view class='succ'>
                  <text lynx-test-tag={'result' + idx}>
                    {text ? text : 'Succ'}
                  </text>
                </view>
              )
              : (
                <view class='err'>
                  <text lynx-test-tag={'result' + idx}>
                    {text ? text : 'Err'}
                  </text>
                </view>
              )}
          </view>
        </view>
      );
      /* v8 ignore stop */
    }

    scratch.ensureElements();
    render(<ResultCell desc='This is a description' />, scratch);
    expect(scratch.__element_root).toMatchInlineSnapshot(`
      <page
        cssId="default-entry-from-native:0"
      >
        <view
          class="result-root"
        >
          <wrapper>
            <view
              class="result-cell"
            >
              <text
                class="desc"
              >
                <raw-text
                  text="This is a description"
                />
              </text>
            </view>
            <view
              class="err"
            >
              <text
                lynx-test-tag="result0"
              >
                <raw-text
                  text="Err"
                />
              </text>
            </view>
          </wrapper>
          <view
            class="result-cell"
          />
        </view>
      </page>
    `);
  });
});

describe('document - background', () => {
  /** @type {SnapshotInstance} */
  let scratch;

  beforeAll(() => {
    globalEnvManager.switchToMainThread();
    setupBackgroundDocument();
    setupPage(__CreatePage('0', 0));

    BackgroundSnapshotInstance.prototype.toJSON = backgroundSnapshotInstanceToJSON;
  });

  afterAll(() => {
    delete BackgroundSnapshotInstance.prototype.toJSON;
  });

  beforeEach(() => {
    scratch = document.createElement('root');
  });

  afterEach(() => {
    render(null, scratch);
    elementTree.clear();
    backgroundSnapshotInstanceManager.clear();
  });

  it('basic - diff', async function() {
    render(
      <view>
        <text>!!!</text>
        <text>{'Hello'}</text>
        <raw-text text={'World'.toLowerCase()} />
      </view>,
      scratch,
    );
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_9
          0="world"
        >
          "Hello"
        </__Card__:__snapshot_a94a8_test_9>
      </root>
    `);

    expect([...backgroundSnapshotInstanceManager.values.keys()])
      .toMatchInlineSnapshot(`
      [
        1,
        2,
        3,
      ]
    `);

    render(
      <image>
        <text>Hello World</text>
        <text>{'Hello'}</text>
        <text>{'World'}</text>
      </image>,
      scratch,
    );
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_10>
          "Hello"
          "World"
        </__Card__:__snapshot_a94a8_test_10>
      </root>
    `);
    expect([...backgroundSnapshotInstanceManager.values.keys()])
      .toMatchInlineSnapshot(`
        [
          1,
          2,
          3,
          4,
          5,
          6,
        ]
      `);
    expect(globalBackgroundSnapshotInstancesToRemove).toMatchInlineSnapshot(`
      [
        2,
      ]
    `);
  });

  it('basic - update raw-text', async function() {
    const jsx = t => <text>{t}</text>;

    render(jsx('Hello!'), scratch);
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_11>
          "Hello!"
        </__Card__:__snapshot_a94a8_test_11>
      </root>
    `);
    render(jsx('Hello!!'), scratch);
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_11>
          "Hello!!"
        </__Card__:__snapshot_a94a8_test_11>
      </root>
    `);
  });

  it('shuffle', async function() {
    // scratch.ensureElements();

    const jsx = items => (
      <view>
        <view>header</view>
        {items.map(key => (
          <view key={key}>
            <text>{key}</text>
          </view>
        ))}
      </view>
    );

    const a = Array.from({ length: 20 }).map((_, i) => `${i}`);

    for (let i = 0; i < 100; i++) {
      const aa = randomize(a);
      render(jsx(aa), scratch);
      const aaa = collectRawText(scratch);
      expect(aa).toStrictEqual(aaa);
    }
  });

  it('move previous head node into other position during shuffle', async function() {
    // scratch.ensureElements();

    const jsx = items => (
      <view>
        <view>header</view>
        {items.map(key => (
          <view key={key}>
            <text>{key}</text>
          </view>
        ))}
      </view>
    );
    const a = [1, 2, 3, 4];
    render(jsx(a), scratch);
    const aa = [2, 1, 3, 4];
    render(jsx(aa), scratch);
    const aaa = collectRawText(scratch);
    expect(aa).toStrictEqual(aaa);
  });

  const jsx = t => <text className={t}>Hello World</text>;
  it('basic - update removeAttribute', async function() {
    BackgroundSnapshotInstance.prototype.toJSON = backgroundSnapshotInstanceToJSON;

    render(jsx('Hello'), scratch);
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_14
          0="Hello"
        />
      </root>
    `);
    render(jsx(null), scratch);
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_14
          0={null}
        />
      </root>
    `);

    delete BackgroundSnapshotInstance.prototype.toJSON;
  });

  it('basic - update event', async function() {
    BackgroundSnapshotInstance.prototype.toJSON = backgroundSnapshotInstanceToJSON;

    render(jsx(vi.fn()), scratch);
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_14
          0={[MockFunction spy]}
        />
      </root>
    `);

    initGlobalSnapshotPatch();
    render(jsx(vi.fn()), scratch);
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_14
          0={[MockFunction spy]}
        />
      </root>
    `);
    expect(takeGlobalSnapshotPatch()).toMatchInlineSnapshot(`[]`);
    deinitGlobalSnapshotPatch();

    delete BackgroundSnapshotInstance.prototype.toJSON;
  });

  it('runWithForce', async function() {
    BackgroundSnapshotInstance.prototype.toJSON = backgroundSnapshotInstanceToJSON;

    let f = vi.fn();
    const data = {};
    class Pure extends Component {
      shouldComponentUpdate() {
        f();
        return false;
      }
      render() {
        return JSON.stringify(data);
      }
    }

    class App extends Component {
      render() {
        return [JSON.stringify(data), <Pure />];
      }
    }

    render(<App />, scratch);
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        "{}"
        "{}"
      </root>
    `);
    data.someThing = 1;
    runWithForce(() => render(<App />, scratch));
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        "{"someThing":1}"
        "{"someThing":1}"
      </root>
    `);
    expect(f).toBeCalledTimes(0);

    // render again to make sure vnode tree is not broken
    data.someThing = 2;
    render(<App />, scratch);
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        "{"someThing":2}"
        "{"someThing":1}"
      </root>
    `);

    delete BackgroundSnapshotInstance.prototype.toJSON;
  });

  it('lazy', async function() {
    BackgroundSnapshotInstance.prototype.toJSON = backgroundSnapshotInstanceToJSON;
    let txt = 'foo';
    let txt2 = 'bar';

    const C = () => {
      return <view className={txt2} />;
    };

    globalEnvManager.switchToBackground();

    const D = lazy(() => Promise.resolve({ default: C }));
    render(
      <Suspense fallback={<text>{txt}</text>}>
        <D />
      </Suspense>,
      scratch,
    );
    expect(scratch).toMatchInlineSnapshot(`<root />`);

    await Promise.resolve();
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_16>
          "foo"
        </__Card__:__snapshot_a94a8_test_16>
      </root>
    `);

    await Promise.resolve();
    expect(scratch).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_15
          0="bar"
        />
      </root>
    `);
    delete BackgroundSnapshotInstance.prototype.toJSON;
  });

  it('extraProps - should set __extraProps', () => {
    render(cloneElement(<view />, { x: 1 }), scratch);
    expect(scratch.__firstChild.__extraProps).toMatchInlineSnapshot(`
      {
        "x": 1,
      }
    `);
  });
});

describe('document - dual-runtime', () => {
  it('should work with hydrate', () => {
    const jsx = t => (
      <view>
        <text>Hello</text>
        {t.split('').map(key => cloneElement(<text key={key}>{key}</text>, { k: key }))}
      </view>
    );

    setupDocument();
    const root = document.createElement('root');
    render(jsx('World'), root);

    setupBackgroundDocument();
    const backgroundRoot = document.createElement('root');
    render(jsx('World'), backgroundRoot);
    render(jsx('W0rld_'), backgroundRoot);

    BackgroundSnapshotInstance.prototype.toJSON = backgroundSnapshotInstanceToJSON;
    expect(backgroundRoot).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_21>
          <__Card__:__snapshot_a94a8_test_22>
            "W"
          </__Card__:__snapshot_a94a8_test_22>
          <__Card__:__snapshot_a94a8_test_22>
            "0"
          </__Card__:__snapshot_a94a8_test_22>
          <__Card__:__snapshot_a94a8_test_22>
            "r"
          </__Card__:__snapshot_a94a8_test_22>
          <__Card__:__snapshot_a94a8_test_22>
            "l"
          </__Card__:__snapshot_a94a8_test_22>
          <__Card__:__snapshot_a94a8_test_22>
            "d"
          </__Card__:__snapshot_a94a8_test_22>
          <__Card__:__snapshot_a94a8_test_22>
            "_"
          </__Card__:__snapshot_a94a8_test_22>
        </__Card__:__snapshot_a94a8_test_21>
      </root>
    `);
    delete BackgroundSnapshotInstance.prototype.toJSON;

    expect(hydrate(JSON.parse(JSON.stringify(root)), backgroundRoot))
      .toMatchInlineSnapshot(`
        [
          3,
          -64,
          "k",
          "0",
          3,
          -65,
          0,
          "0",
          0,
          "__Card__:__snapshot_a94a8_test_22",
          91,
          0,
          3,
          91,
          "k",
          "_",
          0,
          null,
          92,
          0,
          4,
          92,
          [
            "_",
          ],
          1,
          91,
          92,
          undefined,
          1,
          -61,
          91,
          undefined,
        ]
      `);

    expect(takeGlobalSnapshotPatch()).toMatchInlineSnapshot(`[]`); // empty before init
    initGlobalSnapshotPatch();
    render(jsx('W1rld'), backgroundRoot);
    expect(takeGlobalSnapshotPatch()).toMatchInlineSnapshot(`
      [
        2,
        -61,
        -64,
        2,
        -61,
        91,
        0,
        "__Card__:__snapshot_a94a8_test_22",
        93,
        0,
        3,
        93,
        "k",
        "1",
        0,
        null,
        94,
        0,
        3,
        94,
        0,
        "1",
        1,
        93,
        94,
        undefined,
        1,
        -61,
        93,
        -66,
      ]
    `);

    backgroundSnapshotInstanceManager.getValueBySign(`${backgroundRoot.__firstChild.__firstChild.__id}:__extraProps:k`);
    expect(() => {
      backgroundSnapshotInstanceManager.getValueBySign(
        `${backgroundRoot.__firstChild.__firstChild.__id}:__extraProps:`,
      );
    }).toThrowErrorMatchingInlineSnapshot(`[Error: unreachable]`);
  });

  it('should not emit patch about `undefined` not being `null`', () => {
    const jsx = t => (
      <view>
        <text>Hello</text>
        <text>
          <raw-text text={t} />
        </text>
      </view>
    );

    setupDocument();
    const root = document.createElement('root');
    render(jsx(undefined), root);

    setupBackgroundDocument();
    const backgroundRoot = document.createElement('root');
    render(jsx(undefined), backgroundRoot);

    BackgroundSnapshotInstance.prototype.toJSON = backgroundSnapshotInstanceToJSON;
    expect(backgroundRoot).toMatchInlineSnapshot(`
      <root>
        <__Card__:__snapshot_a94a8_test_19 />
      </root>
    `);
    delete BackgroundSnapshotInstance.prototype.toJSON;

    expect(hydrate(JSON.parse(JSON.stringify(root)), backgroundRoot))
      .toMatchInlineSnapshot(`[]`);
  });
});
