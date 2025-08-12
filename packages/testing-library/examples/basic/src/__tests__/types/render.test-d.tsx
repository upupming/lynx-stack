import '@testing-library/jest-dom';
import { expect, test } from 'vitest';
import { render } from '@lynx-js/react/testing-library';

test('render', () => {
  const Comp = () => {
    return <text>Hello</text>;
  };

  const { container, unmount } = render(<Comp />, {
    wrapper: ({ children }) => {
      return <view>{children}</view>;
    },
  });

  expect(container).toBeInTheDocument();

  unmount();
});
