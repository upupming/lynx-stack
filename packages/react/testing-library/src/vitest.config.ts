import { defineConfig, type ViteUserConfig } from 'vitest/config';
import { vitestTestingLibraryPlugin } from './plugins/index.js';
export interface TestingLibraryOptions {
  /**
   * The package name of the ReactLynx runtime package.
   *
   * @default `@lynx-js/react`
   */
  runtimePkgName?: string;
}
export async function createVitestConfig(options?: TestingLibraryOptions): Promise<ViteUserConfig> {
  return defineConfig({
    plugins: [
      vitestTestingLibraryPlugin(options),
    ],
  });
}
