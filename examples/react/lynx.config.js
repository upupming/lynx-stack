import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';

const enableBundleAnalysis = !!process.env['RSPEEDY_BUNDLE_ANALYSIS'];

export default defineConfig({
  plugins: [
    pluginReactLynx(),
    pluginQRCode({
      schema(url) {
        // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
        return `${url}?fullscreen=true`;
      },
    }),
  ],
  performance: {
    profile: enableBundleAnalysis,
    chunkSplit: {
      strategy: 'split-by-experience'
    },
  },
  // output: {
  //   inlineScripts: false
  // },
  // tools: {
  //   rspack: {
  //     optimization: {
  //       runtimeChunk: {
  //         name: entrypoint => {
  //           if (entrypoint.name.includes('main-thread')) {
  //             return ''
  //           }
  //           return entrypoint.name
  //         }
  //       }
  //     }
  //   }
  // }
});
