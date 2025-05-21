import '@testing-library/jest-dom';
import { expect, it } from 'vitest';
import { render, screen, waitForElementToBeRemoved, waitSchedule } from '@lynx-js/react/testing-library';
import { Suspense, lazy } from '@lynx-js/react';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

function Fallback() {
  debugger
  return <text>loading...</text>;
}

function LazyComponentLoader({ url }) {
  const ExternalComponent = lazy(async () => {
    debugger
    const ans = await import(url, {
      with: {
        type: 'component',
      },
    });
    debugger
    return ans;
    // return Fallback
  });
  const InternalComponent = lazy(() => import('./LazyComponent'));

  return (
    <view>
      <view>
        <Suspense fallback={<Fallback />}>
          <ExternalComponent />
        </Suspense>
      </view>
      <view>
        <Suspense fallback={<Fallback />}>
          <InternalComponent />
        </Suspense>
      </view>
    </view>
  );
}

export function App({ url }) {
  return (
    <view>
      <LazyComponentLoader url={url}></LazyComponentLoader>
    </view>
  );
}

// describe('lazy bundle', () => {

it.only('should render lazy component in main-thread', async () => {
  const { container } = render(
    <App url={require.resolve('./LazyComponent.jsx')} />,
    {
      enableMainThread: true,
      enableBackgroundThread: false,
    }
  );

  expect(container.firstChild).toMatchInlineSnapshot(`
    <view>
      <view>
        <view>
          <text>
            Hello from LazyComponent
          </text>
        </view>
        <view>
          <text>
            Hello from LazyComponent
          </text>
        </view>
      </view>
    </view>
  `);

  // await waitForElementToBeRemoved(() => screen.getByText('loading...'));

  // expect(container.firstChild).toMatchInlineSnapshot(`
  //     <view>
  //       <text>
  //         Hello from LazyComponent
  //       </text>
  //       <text>
  //         Hello from LazyComponent
  //       </text>
  //     </view>
  //   `);
});
// });
