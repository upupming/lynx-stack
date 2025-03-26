import { defineProject } from 'vitest/config';
import type { UserWorkspaceConfig } from 'vitest/config';

const config: UserWorkspaceConfig = defineProject({
  test: {
    name: 'webpack/extract-str',
    setupFiles: [
      '@lynx-js/vitest-setup/setup.ts',
      'test/setup-env.js',
    ],
  },
});

export default config;
