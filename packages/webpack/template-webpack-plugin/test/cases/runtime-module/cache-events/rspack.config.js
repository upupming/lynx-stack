import { RuntimeGlobals } from '@lynx-js/webpack-runtime-globals';
import { ChunkLoadingWebpackPlugin } from '@lynx-js/chunk-loading-webpack-plugin';

import { LynxEncodePlugin, LynxTemplatePlugin } from '../../../../src';

/** @type {import('webpack').Configuration} */
export default {
  target: 'node',
  output: {
    filename: '[name].js',
    chunkLoading: 'lynx',
  },
  optimization: {
    moduleIds: 'named',
    splitChunks: {
      chunks: () => true,
      cacheGroups: {
        'lib-common': {
          test: /lib-common/,
          priority: 0,
          name: 'lib-common',
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new ChunkLoadingWebpackPlugin(),
    new LynxTemplatePlugin({ filename: 'main.tasm' }),
    (compiler) => {
      compiler.hooks.thisCompilation.tap('test', compilation => {
        compilation.hooks.runtimeRequirementInTree.for(
          compiler.webpack.RuntimeGlobals.ensureChunkHandlers,
        ).tap('test', (_, set) => {
          set.add(RuntimeGlobals.lynxCacheEventsSetupList);
          set.add(RuntimeGlobals.lynxCacheEvents);
        });
      });
    },
    new LynxEncodePlugin(),
  ],
};
