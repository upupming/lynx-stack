// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runInNewContext } from 'node:vm';

import { rspack } from '@rspack/core';
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  rstest,
} from '@rstest/core';

import { ExternalsLoadingPlugin } from '../src/index.js';

const external = (name: string, url = 'component.bundle') => ({
  libraryName: name,
  url,
  async: false,
  mainThread: { sectionPath: 'component' },
  background: { sectionPath: 'component' },
});

describe('synchronous external import order', () => {
  let directory: string;
  const sources = new Map<string, string>();

  beforeAll(async () => {
    directory = await fs.mkdtemp(
      path.join(os.tmpdir(), 'lynx-external-order-'),
    );
    await new Promise<void>((resolve, reject) => {
      const compiler = rspack({
        mode: 'development',
        context: path.join(__dirname, 'fixtures', 'import-order'),
        entry: Object.fromEntries(
          ['main-thread', 'background'].map(layer => [layer, {
            import: './index.js',
            layer,
          }]),
        ),
        output: { path: directory, filename: '[name].js', publicPath: '' },
        optimization: { concatenateModules: false },
        plugins: [
          new ExternalsLoadingPlugin({
            mainThreadLayer: 'main-thread',
            backgroundLayer: 'background',
            externals: {
              component: external('Component'),
              'component-alias': external('Alias'),
              unused: external('Unused', 'unused.bundle'),
            },
          }),
        ],
      });
      compiler.run((error, stats) => {
        compiler.close(closeError => {
          if (error) reject(error);
          else if (closeError) reject(closeError);
          else if (stats?.hasErrors()) reject(new Error(stats.toString()));
          else resolve();
        });
      });
    });
    for (const layer of ['main-thread', 'background']) {
      sources.set(
        layer,
        await fs.readFile(path.join(directory, `${layer}.js`), 'utf8'),
      );
    }
  });

  afterAll(async () => {
    if (directory) await fs.rm(directory, { recursive: true, force: true });
  });

  it.each(['main-thread', 'background'])(
    'defers section evaluation until import on %s',
    (layer) => {
      const state = { ready: false, events: [] as string[] };
      const component = { run: () => state.events.push('run') };
      const fetchBundle = rstest.fn((url: string) => ({
        wait: () => ({ code: 0, url }),
      }));
      const loadScript = rstest.fn(() => {
        expect(state.ready).toBe(true);
        state.events.push('load');
        return component;
      });
      const globals: Record<string, unknown> = {};
      runInNewContext(sources.get(layer)!, {
        __externalOrder: state,
        lynx: {
          fetchBundle,
          loadScript,
          [Symbol.for('__LYNX_EXTERNAL_GLOBAL__')]: globals,
        },
        __LoadStyleSheet: () => null,
      });
      expect(state.events).toEqual(['init', 'load', 'run', 'run']);
      expect(fetchBundle).toHaveBeenCalledTimes(2);
      expect(loadScript).toHaveBeenCalledTimes(1);
      expect(globals['Component']).toBe(component);
      expect(globals['Alias']).toBe(component);
      expect(Object.getOwnPropertyDescriptor(globals, 'Component')?.writable)
        .toBe(true);
    },
  );

  it.each(['main-thread', 'background'])(
    'preserves host exports and entry-time injection on %s',
    (layer) => {
      for (const inject of [false, true]) {
        const state = {
          ready: false,
          events: [] as string[],
          inject: undefined as object | undefined,
        };
        const component = { run: () => state.events.push('injected') };
        if (inject) state.inject = component;
        const loadScript = rstest.fn();
        const globals: Record<string, unknown> = inject
          ? {}
          : { Component: component };
        runInNewContext(sources.get(layer)!, {
          __externalOrder: state,
          lynx: {
            fetchBundle: (url: string) => ({ wait: () => ({ code: 0, url }) }),
            loadScript,
            [Symbol.for('__LYNX_EXTERNAL_GLOBAL__')]: globals,
          },
          __LoadStyleSheet: () => null,
        });
        expect(loadScript).not.toHaveBeenCalled();
        expect(state.events).toEqual(['init', 'injected', 'injected']);
        expect(globals['Component']).toBe(component);
        expect(globals['Alias']).toBe(component);
      }
    },
  );
});
