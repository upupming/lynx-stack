import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: path.join(__dirname, './src/env/vitest/index.ts'),
  },
});
