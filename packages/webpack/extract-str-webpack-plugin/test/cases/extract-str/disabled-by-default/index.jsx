import { root } from '@lynx-js/react';

const fn = vi.fn();

function App() {
  fn();
  return (
    <view>
      <text>Hello, world!</text>
    </view>
  );
}

it('should call render function', () => {
  expect(fn).not.toBeCalled();
  root.render(
    <page>
      <App />
    </page>,
  );
  if (__JS__) {
    expect(fn).toBeCalled();
    expect(() => eval('_EXTRACT_STR')).toThrow(
      '_EXTRACT_STR is not defined',
    );
  } else {
    expect(fn).not.toBeCalled();
    expect(() => eval('_EXTRACT_STR')).toThrow(
      '_EXTRACT_STR is not defined',
    );
  }
});
