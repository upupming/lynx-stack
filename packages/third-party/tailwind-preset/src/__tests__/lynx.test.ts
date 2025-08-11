// Copyright 2025 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { describe, expect, it, vi } from 'vitest';

import {
  LYNX_PLUGIN_MAP,
  LYNX_UI_PLUGIN_MAP,
  ORDERED_LYNX_UI_PLUGIN_NAMES,
  getReplaceablePlugins,
} from '../core.js';
import type { LynxUIPluginOptionsMap } from '../core.js';
import preset, { createLynxPreset } from '../lynx.js';

const firstUIPlugin = ORDERED_LYNX_UI_PLUGIN_NAMES[0]!;
type FirstUIPluginOptions = LynxUIPluginOptionsMap[typeof firstUIPlugin];

describe('createLynxPreset', () => {
  it('returns a valid Tailwind config structure by default', () => {
    const result = createLynxPreset();
    expect(result).toHaveProperty('plugins');
    expect(result).toHaveProperty('corePlugins');
    expect(result).toHaveProperty('theme');
  });

  it('includes all replaceable plugins by default', () => {
    const result = createLynxPreset();
    const enabled = getReplaceablePlugins();

    for (const pluginName of enabled) {
      const plugin = LYNX_PLUGIN_MAP[pluginName];
      expect(result.plugins).toContain(plugin);
    }
  });

  it('respects the lynxPlugins allowed list', () => {
    const result = createLynxPreset({ lynxPlugins: ['transform'] });
    expect(result.plugins).toContain(LYNX_PLUGIN_MAP.transform);
    expect(result.plugins).not.toContain(LYNX_PLUGIN_MAP.rotate);
  });

  it('merges user theme overrides', () => {
    const result = createLynxPreset({ theme: { zIndex: { foo: '999' } } });
    const zIndex = result.theme?.zIndex as Record<string, string>;
    expect(zIndex['foo']).toBe('999');
  });

  it('invokes console.debug when debug is true', () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    createLynxPreset({ debug: true });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('default export (preset)', () => {
  it('is a valid Tailwind config object', () => {
    expect(preset).toHaveProperty('plugins');
    expect(preset).toHaveProperty('corePlugins');
    expect(preset).toHaveProperty('theme');
  });
});

describe('createLynxPreset - Lynx UI plugin behavior', () => {
  const firstUIPlugin = ORDERED_LYNX_UI_PLUGIN_NAMES[0]!;

  it('includes UI plugin if enabled (true)', () => {
    const spy = Object.assign(vi.fn(), { __isOptionsFunction: true as const });
    const original = LYNX_UI_PLUGIN_MAP[firstUIPlugin];

    // Mock the plugin function
    LYNX_UI_PLUGIN_MAP[firstUIPlugin] = spy;

    createLynxPreset({
      lynxUIPlugins: { [firstUIPlugin]: true },
    });

    expect(spy).toHaveBeenCalledWith({});
    LYNX_UI_PLUGIN_MAP[firstUIPlugin] = original; // restore
  });

  it('includes UI plugin if enabled with options', () => {
    const spy = Object.assign(vi.fn(), { __isOptionsFunction: true as const });
    const original = LYNX_UI_PLUGIN_MAP[firstUIPlugin];
    const mockOptions: FirstUIPluginOptions = { prefixes: ['bar'] };

    LYNX_UI_PLUGIN_MAP[firstUIPlugin] = spy;

    createLynxPreset({
      lynxUIPlugins: { [firstUIPlugin]: mockOptions },
    });

    expect(spy).toHaveBeenCalledWith(mockOptions);
    LYNX_UI_PLUGIN_MAP[firstUIPlugin] = original;
  });

  it('does not include UI plugin if disabled', () => {
    const spy = Object.assign(vi.fn(), { __isOptionsFunction: true as const });
    const original = LYNX_UI_PLUGIN_MAP[firstUIPlugin];

    LYNX_UI_PLUGIN_MAP[firstUIPlugin] = spy;

    createLynxPreset({
      lynxUIPlugins: { [firstUIPlugin]: false },
    });

    expect(spy).not.toHaveBeenCalled();
    LYNX_UI_PLUGIN_MAP[firstUIPlugin] = original;
  });

  it('does not include UI plugin if global UI plugins disabled', () => {
    const spy = Object.assign(vi.fn(), { __isOptionsFunction: true as const });
    const original = LYNX_UI_PLUGIN_MAP[firstUIPlugin];

    LYNX_UI_PLUGIN_MAP[firstUIPlugin] = spy;

    createLynxPreset({ lynxUIPlugins: false });

    expect(spy).not.toHaveBeenCalled();
    LYNX_UI_PLUGIN_MAP[firstUIPlugin] = original;
  });

  it('includes UI plugin when lynxUIPlugins = true (default options)', () => {
    const spy = Object.assign(vi.fn(), { __isOptionsFunction: true as const });
    const original = LYNX_UI_PLUGIN_MAP[firstUIPlugin];

    LYNX_UI_PLUGIN_MAP[firstUIPlugin] = spy;

    createLynxPreset({ lynxUIPlugins: true });

    expect(spy).toHaveBeenCalledWith({});
    LYNX_UI_PLUGIN_MAP[firstUIPlugin] = original;
  });

  it('prints debug info when UI plugin is enabled and debug is true', () => {
    const spy = Object.assign(vi.fn(), { __isOptionsFunction: true as const });
    Object.assign(spy, { __isOptionsFunction: true });

    const original = LYNX_UI_PLUGIN_MAP[firstUIPlugin];
    LYNX_UI_PLUGIN_MAP[firstUIPlugin] = spy;

    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

    createLynxPreset({
      lynxUIPlugins: { [firstUIPlugin]: true },
      debug: true,
    });

    expect(debugSpy).toHaveBeenCalledWith(
      `[Lynx] enabled UI plugin: ${firstUIPlugin}`,
    );
    LYNX_UI_PLUGIN_MAP[firstUIPlugin] = original;
    debugSpy.mockRestore();
  });
});
