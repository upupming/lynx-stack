import { root } from '@lynx-js/react';

const fn = vi.fn();
if (__MAIN_THREAD__) {
  // Passing value from main thread to background thread
  // use eval to avoid variable name collision
  lynxCoreInject.tt._params.updateData._EXTRACT_STR = eval('_EXTRACT_STR');
}

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
    expect(eval('_EXTRACT_STR').includes(['component', 'WillUnmount'].join('')))
      .toBeTruthy();
  } else {
    expect(fn).not.toBeCalled();
    const arr = eval('_EXTRACT_STR');
    expect(arr.length).toBeGreaterThan(0);
    expect(arr.includes(['component', 'WillUnmount'].join(''))).toBeTruthy();
    expect(arr.includes(['something', 'not existed'].join(''))).toBeFalsy();
    // only strings are extracted
    expect(arr.every((item) => typeof item === 'string')).toBeTruthy();
  }
});
