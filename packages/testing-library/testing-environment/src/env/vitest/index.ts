import { builtinEnvironments } from 'vitest/environments';
import { LynxTestingEnvironment } from '@lynx-js/testing-environment';

const env = {
  name: 'lynxTestingEnvironment',
  transformMode: 'web',
  async setup(global) {
    const fakeGlobal: {
      jsdom?: any;
    } = {};
    await builtinEnvironments.jsdom.setup(fakeGlobal, {});
    global.jsdom = fakeGlobal.jsdom;

    const lynxTestingEnvironment = new LynxTestingEnvironment();
    global.lynxTestingEnvironment = lynxTestingEnvironment;

    return {
      teardown(global) {
        delete global.lynxTestingEnvironment;
        delete global.jsdom;
      },
    };
  },
};

export default env;
