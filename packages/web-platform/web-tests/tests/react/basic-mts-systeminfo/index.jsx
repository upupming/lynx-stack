// Copyright 2023 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
import { useState, root } from '@lynx-js/react';
function App() {
  const [color] = useState('pink');
  return (
    <view
      id='target'
      main-thread:bindTap={() => {
        'main thread';
        if (SystemInfo.platform === 'web') {
          console.log('hello world');
        }
      }}
      style={{
        height: '100px',
        width: '100px',
        background: color,
      }}
    />
  );
}
root.render(<App />);
