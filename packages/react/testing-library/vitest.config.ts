import { defineConfig, mergeConfig } from 'vitest/config';
import { createVitestConfig } from './dist/vitest.config';

const defaultConfig = await createVitestConfig({
  runtimePkgName: '@lynx-js/react',
});
const config = defineConfig({
  test: {
    name: 'react/testing-library',
  },
  plugins: [
    {
      enforce: 'post',
      name: 'enforce-preact-alias',
      config(config) {
        // config.test ||= {}
        // config.test.server ||= {}
        // config.test.server.deps ||= {}
        // config.test.server.deps.inline = ['@byted-lynx/react', '@lynx-js/react', '@hongzhiyuan/preact']
        if (Array.isArray(config.resolve!.alias)) {
          config.resolve!.alias.forEach(alias => {
            if (String(alias.find).startsWith('/^preact')) {
              alias.replacement = alias.replacement.replace(/\.js$/, '.mjs')
            }
          })
        }
      },
      // transform(code, id, options) {
      //   //  避免 sourcemap warning
      //   // https://github.com/vanilla-extract-css/vanilla-extract/issues/699
      //   return {
      //     code,
      //     map: {
      //       mappings: ''
      //     }
      //   }
      // },
    }

  ]
});

export default mergeConfig(defaultConfig, config);
