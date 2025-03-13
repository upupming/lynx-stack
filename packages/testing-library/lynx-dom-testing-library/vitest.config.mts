import { createRequire } from 'module';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url)
export default defineConfig({
  test: {
    globals: true,
    environment: require.resolve('@lynx-js/lynx-dom/env/vitest'),
    exclude: [
      'types/__tests__/**',
      'dist/**',
      'node_modules/**',
    ],
  },
});
