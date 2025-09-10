import '@lynx-js/preact-devtools';
import '@lynx-js/react/debug';
import { root } from '@lynx-js/react';

import { App } from './App.jsx';

if (__LEPUS__) {
  const api = [
    '__CreatePage',
    '__CreateElement',
    '__CreateWrapperElement',
    '__CreateText',
    '__CreateImage',
    '__CreateView',
    '__CreateRawText',
    '__CreateList',
    '__AppendElement',
    '__InsertElementBefore',
    '__RemoveElement',
    '__ReplaceElement',
    '__FirstElement',
    '__LastElement',
    '__NextElement',
    '__GetPageElement',
    '__GetTemplateParts',
    '__AddDataset',
    '__SetDataset',
    '__GetDataset',
    '__SetAttribute',
    '__GetAttributes',
    '__GetAttributeByName',
    '__GetAttributeNames',
    '__SetClasses',
    '__SetCSSId',
    '__AddInlineStyle',
    '__SetInlineStyles',
    '__AddEvent',
    '__SetID',
    '__GetElementUniqueID',
    '__GetTag',
    '__FlushElementTree',
    '__UpdateListCallbacks',
    '__OnLifecycleEvent',
    '__QueryComponent',
    '__SetGestureDetector',
  ];

  let count = 0;
  api.forEach((api) => {
    const old = globalThis[api];
    globalThis[api] = (...args: any[]) => {
      console.log(`API ${++count}: ${api}`, ...args);
      lynx.performance.profileStart(api, {
        args: {
          args: JSON.stringify(args),
        }
      });
      let ans = old(...args);
      lynx.performance.profileEnd();
      return ans;
    };
  });
}

root.render(
  <App />,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
