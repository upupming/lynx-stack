import { render, fireEvent, act, vi } from '..';
import { useEffect, useState } from 'preact/hooks';
import { renderToString } from '../../../runtime/lib/renderToOpcodes';
import { __page } from '../../../runtime/lib/snapshot';
import { jsx } from '../../../runtime/jsx-runtime/index.js';

test('basic', async () => {
  const A = () => {
    return jsx("et1", {})
  }
  
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
          __spread: true
        }
      ],
      $0: hello0,
      $1: /* @__PURE__ */ __vite_ssr_import_0__.jsx(A, {}),
      $2: hello1
    })
    )
  }
  const { container } = render(<Comp />, {
    enableMainThread: true,
    enableBackgroundThread: true
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
          spread="[object Object]"
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
          spread="[object Object]"
        >
          Hello, ReactLynx, 
          hello1-1
        </text>
      </view>
    </page>
  `)
  
});
