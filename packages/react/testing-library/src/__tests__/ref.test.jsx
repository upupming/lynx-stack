import { createRef, Component, useState } from '@lynx-js/react';
import { render } from '..';
import { expect } from 'vitest';
import { act } from 'preact/test-utils';

describe('component ref', () => {
  it('basic', async () => {
    const ref1 = vi.fn();
    const ref2 = createRef();
    const ref3 = vi.fn();
    const ref4 = createRef();
    let _setShow;

    class Child extends Component {
      name = 'child';
      render() {
        return <view />;
      }
    }

    function App() {
      const [show, setShow] = useState(true);
      _setShow = setShow;

      return <Comp show={show} />;
    }

    class Comp extends Component {
      name = 'comp';
      render() {
        return this.props.show && (
          <view>
            <Child ref={ref1} />
            <Child ref={ref2} />
            <view ref={ref3} />
            <view ref={ref4} />
          </view>
        );
      }
    }

    render(<App />);
    expect(elementTree).toMatchInlineSnapshot(`
      <page>
        <view>
          <wrapper>
            <view />
            <view />
          </wrapper>
          <view
            has-react-ref="true"
          />
          <view
            has-react-ref="true"
          />
        </view>
      </page>
    `);
    expect(ref1).toBeCalledWith(expect.objectContaining({
      name: 'child',
    }));
    expect(ref2.current).toHaveProperty('name', 'child');
    expect(ref3.mock.calls).toMatchInlineSnapshot(`
      [
        [
          NodesRef {
            "_nodeSelectToken": {
              "identifier": "3",
              "type": 2,
            },
            "_selectorQuery": {},
          },
        ],
      ]
    `);
    expect(ref4.current).toMatchInlineSnapshot(`
      NodesRef {
        "_nodeSelectToken": {
          "identifier": "4",
          "type": 2,
        },
        "_selectorQuery": {},
      }
    `);

    act(() => {
      _setShow(false);
    });
    expect(ref3).toHaveBeenCalledWith(null);
    expect(ref4.current).toBeNull();
  });
});
