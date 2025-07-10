// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import type { RsbuildPluginAPI } from '@rsbuild/core'
import { pluginBabel } from '@rsbuild/plugin-babel'

const ReactCompilerConfig = {
  target: '17', // '17' | '18' | '19'
}

export function applyReactCompiler(
  api: RsbuildPluginAPI,
): void | Promise<void> {
  return pluginBabel({
    include: /\.(?:jsx|tsx)$/,
    babelLoaderOptions(opts) {
      opts.plugins?.unshift([
        'babel-plugin-react-compiler',
        ReactCompilerConfig,
      ])
    },
  }).setup(api)
}
