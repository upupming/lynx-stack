const env = {
  name: 'lynxEnv',
  transformMode: 'web',
  async setup(global) {
    const { LynxEnv } = await import(
      '@lynx-js/test-environment'
    );
    const lynxEnv = new LynxEnv();
    global.lynxEnv = lynxEnv;

    return {
      teardown(global) {
        delete global.lynxEnv;
      },
    };
  },
};

export default env;
