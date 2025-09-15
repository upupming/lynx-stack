import { useState} from '@lynx-js/react'
export function App() {
	const initListVal = Array(60).fill(0).map((v, i) => i);
	const [listVal, _setListVal] = useState(initListVal);
	// setListVal = _setListVal;
	// const showMask = true;

	return (
		<view
			style={{
				width: '100vw',
				height: '100vh',
			}}
		>
			{
				<list
					style={{
						width: '100%',
						height: '100%',
					}}
				>
					{listVal.map((v) => {
						return (
							<list-item item-key={`${v}`} key={v} full-span>
								<view>
									<text>{v}</text>
								</view>
							</list-item>
						);
					})}
				</list>
			}
		</view>
	);
}
