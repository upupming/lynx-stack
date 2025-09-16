import '@lynx-js/preact-devtools';
import '@lynx-js/react/debug';
import { root } from '@lynx-js/react';

import { App } from './App-list.jsx';
// import { App } from './App-jsx.jsx';
// import { App } from './App.jsx';


if (__BACKGROUND__) {
	console.log('lynx.getNativeApp().callLepusMethod', lynx.getNativeApp().callLepusMethod)
	const oldOnLifecycleEvent = lynxCoreInject.tt.OnLifecycleEvent
	lynxCoreInject.tt.OnLifecycleEvent = (...args) => {
		console.log('OnLifecycleEvent', ...args)
		oldOnLifecycleEvent(...args)
	}
} else {
	console.log('globalThis.rLynxChange', globalThis.rLynxChange, typeof globalThis.rLynxChange)
	const oldRLynxChange = globalThis.rLynxChange
	globalThis.rLynxChange = (...args) => {
		console.log('rLynxChange', JSON.stringify(args, null, 2))
		oldRLynxChange(...args)
	}

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

			if (api === '__UpdateListCallbacks') {
				console.log('__UpdateListCallbacks', ...args)
				globalThis.__UpdateListCallbacks_Args = args
			}

			return old(...args);
		};
	});
}


root.render(
  <App />,
);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
