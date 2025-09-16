import { useCallback, useEffect, useRef, useState } from '@lynx-js/react';

import './App.css';
import type { NodesRef } from '@lynx-js/types';

import arrow from './assets/arrow.png';
import lynxLogo from './assets/lynx-logo.png';
import reactLynxLogo from './assets/react-logo.png';

export function App() {
  const [alterLogo, setAlterLogo] = useState(false);

  useEffect(() => {
    console.info('Hello, ReactLynx');
  }, []);

  const onTap = useCallback(() => {
    'background-only';
    setAlterLogo(prevAlterLogo => !prevAlterLogo);
  }, []);
  const ref = useRef<NodesRef>(null)
  const [title, setTitle] = useState('React');

  return (
    <view bindtap={() => {
      // setTitle("REACT")
      ref.current?.setNativeProps({
        text: 'New text set by setNativeProps',
      }).exec();
    }}>
      <view className='Background' />
      <view className='App'>
        <view className='Banner'>
          <view className='Logo' bindtap={onTap}>
            {alterLogo
              ? <image src={reactLynxLogo} className='Logo--react' />
              : <image src={lynxLogo} className='Logo--lynx' />}
          </view>
          <text className='Title' ref={(_ref) => {
            ref.current = _ref
          }}>{title}</text>
          <text className='Subtitle'>on Lynx</text>
        </view>
        <view className='Content'>
          <image src={arrow} className='Arrow' />
          <text className='Description'>Tap the logo and have fun!</text>
          <text className='Hint'>
            Edit<text
              style={{
                fontStyle: 'italic',
                color: 'rgba(255, 255, 255, 0.85)',
              }}
            >
              {' src/App.tsx '}
            </text>
            to see updates!
          </text>
        </view>
        <view style={{ flex: "1" }}></view>
      </view>
    </view>
  );
}
