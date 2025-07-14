import {
  render,
  getQueriesForElement,
  act,
} from '@lynx-js/react/testing-library';
import { expectLogsAndClear, log } from './expectLogs';
import { useState } from '@lynx-js/react';

function Hello({ name }) {
  const items = [1, 2, 3].map(item => {
    log(`recomputing ${item}`);
    return <div key={item}>Item {item}</div>;
  });
  return (
    <div>
      Hello<b>{name}</b>
      {items}
    </div>
  );
}

test('hello', () => {
  let setName;
  const Comp = () => {
    const [name, _setName] = useState('World');
    setName = _setName;
    return <Hello name={name} />;
  };

  let { container } = render(<Comp />);

  expect(container).toMatchInlineSnapshot(`
    <page>
      <div>
        Hello
        <b>
          World
        </b>
        <wrapper>
          <div>
            Item 
            <wrapper>
              1
            </wrapper>
          </div>
          <div>
            Item 
            <wrapper>
              2
            </wrapper>
          </div>
          <div>
            Item 
            <wrapper>
              3
            </wrapper>
          </div>
        </wrapper>
      </div>
    </page>
  `);

  expectLogsAndClear(['recomputing 1', 'recomputing 2', 'recomputing 3']);

  act(() => {
    setName('Universe');
  });

  expect(container).toMatchInlineSnapshot(`
    <page>
      <div>
        Hello
        <b>
          Universe
        </b>
        <wrapper>
          <div>
            Item 
            <wrapper>
              1
            </wrapper>
          </div>
          <div>
            Item 
            <wrapper>
              2
            </wrapper>
          </div>
          <div>
            Item 
            <wrapper>
              3
            </wrapper>
          </div>
        </wrapper>
      </div>
    </page>
  `);

  expectLogsAndClear(
    [],
  );
});
