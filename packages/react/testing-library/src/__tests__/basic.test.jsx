import { render, fireEvent, act, vi } from '..';
import { useEffect, useState } from 'preact/hooks';
import { renderToString } from '../../../runtime/lib/renderToOpcodes';

test('basic', async () => {
  const A = () => {
    return (
      <text>A</text>
    )
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
      <view className="view" style={`background-color: red; width: ${w};`} id={id1} bindtap={handle1}>
        <text className="text" id={id2} bindtap={handle2}>Hello, ReactLynx, {hello0}</text>
        <A/>
        <text {...textProps}>Hello, ReactLynx, {hello1}</text>
      </view>
    )
  }
  const { container } = render(<Comp />, {
    enableMainThread: true,
    enableBackgroundThread: true
  });
  expect(container).toMatchInlineSnapshot(`
    <page>
      <view
        class="view"
        id="id1"
        style="background-color: red; width: 100px;"
      >
        <text
          class="text"
          id="id2"
        >
          Hello, ReactLynx, 
          <wrapper>
            hello0
          </wrapper>
        </text>
        <wrapper>
          <text>
            A
          </text>
        </wrapper>
        <text
          class="text"
          style="font-size: 10px;"
        >
          Hello, ReactLynx, 
          <wrapper>
            hello1
          </wrapper>
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
        class="view"
        id="id1"
        style="background-color: red; width: 200px;"
      >
        <text
          class="text"
          id="id2"
        >
          Hello, ReactLynx, 
          <wrapper>
            hello0-1
          </wrapper>
        </text>
        <wrapper>
          <text>
            A
          </text>
        </wrapper>
        <text
          class="text-1"
          style="font-size: 10px; color: red;"
        >
          Hello, ReactLynx, 
          <wrapper>
            hello1-1
          </wrapper>
        </text>
      </view>
    </page>
  `)
  
});
