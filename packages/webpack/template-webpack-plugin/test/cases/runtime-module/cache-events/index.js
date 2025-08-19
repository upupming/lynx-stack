/// <reference types="vitest/globals" />

import { add } from './lib-common.js';

it('should have `__webpack_require__.__cache_events__`', () => {
  expect(add(1, 2)).toBe(3);
  expect(__webpack_require__['__cache_events__']).toBeTruthy();
  expect(__webpack_require__['__cache_events__']['setupList'].length).toBe(2);
  expect(
    __webpack_require__['__cache_events__']['setupList'].map((item) =>
      item.name
    ),
  ).toEqual(['ttMethod', 'performanceEvent']);
  expect(__webpack_require__['__cache_events__']['loaded']).toBe(true);
  expect(__webpack_require__['__cache_events__']['cachedActions'].length).toBe(
    0,
  );
});
