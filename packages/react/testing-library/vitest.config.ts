import { defineConfig } from 'vitest/config';
import { vitestTestingLibraryPlugin } from './dist/plugins';

export default defineConfig({
  plugins: [
    vitestTestingLibraryPlugin({
      runtimePkgName: '@lynx-js/react',
    }),
  ],
});
