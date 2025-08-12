import '@testing-library/jest-dom';
import { describe, expect, vi } from 'vitest';
import { render, screen } from '../..';

import './style1.css';
import './style2.css?common';
import style3 from './style3.module.css';

describe('CSS', () => {
  it('should render a component with CSS styles object', () => {
    const TestComponent = () => <text style={{ color: 'red', fontSize: '20px', flex: 1 }}>Hello World</text>;

    const { container } = render(<TestComponent />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <text
        style="color:red;font-size:20px;flex:1"
      >
        Hello World
      </text>
    `);
  });
  it('should render a component with CSS styles string', () => {
    const TestComponent = () => <text style='color: red; font-size: 20px; flex: 1;'>Hello World</text>;

    const { container } = render(<TestComponent />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <text
        style="color: red; font-size: 20px; flex: 1;"
      >
        Hello World
      </text>
    `);
  });
  it('should render a component with CSS module styles object', () => {
    expect(style3.baz).toMatchInlineSnapshot(`"_baz_60dbcc"`);

    const TestComponent = () => <text style={style3.baz}>Hello World</text>;

    const { container } = render(<TestComponent />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <text
        style="_baz_60dbcc"
      >
        Hello World
      </text>
    `);
  });
});
