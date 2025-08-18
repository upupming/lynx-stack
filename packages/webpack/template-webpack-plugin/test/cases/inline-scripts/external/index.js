/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
/// <reference types="vitest/globals" />

import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

it('should have correct chunk content', async () => {
  const { foo } = await import(
    /* webpackChunkName: 'foo:main-thread' */
    './foo.js'
  );
  expect(foo()).toBe(42);

  const fooBackground = await import(
    /* webpackChunkName: 'foo:background' */
    './foo.js'
  );
  expect(fooBackground.foo()).toBe(42);
});

it('manifest only contains /app-service.js', async () => {
  const tasmJSONPath = resolve(__dirname, '.rspeedy/async/foo/tasm.json');
  expect(existsSync(tasmJSONPath)).toBeTruthy();

  const content = await readFile(tasmJSONPath, 'utf-8');
  const { sourceContent, manifest } = JSON.parse(content);
  const output = resolve(__dirname, 'foo:background.rspack.bundle.js');
  expect(existsSync(output));

  const outputContent = await readFile(output, 'utf-8');
  expect(outputContent).toContain(['function', 'foo()'].join(' '));

  expect(sourceContent).toHaveProperty('appType', 'DynamicComponent');

  expect(manifest).not.toHaveProperty('/foo:background.rspack.bundle.js');
  expect(manifest).toHaveProperty('/app-service.js');

  expect(manifest['/app-service.js']).toContain(
    `lynx.requireModuleAsync(\"/foo:background.rspack.bundle.js\")`,
  );

  expect(manifest['/app-service.js']).not.toContain(
    `module.exports=;`,
  );
});
