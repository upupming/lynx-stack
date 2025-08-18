<view className="parent">
          <view className="child"/>
          <view className="child"/>
        </view>;
<view className="parent">
          <internal-slot><view className="child">
          </view></internal-slot>
          <internal-slot><view className="child">
          </view></internal-slot>
        </view>;
<view className="parent">
          <internal-slot><view className="child">{[].map(()=>null)}</view></internal-slot>
          <internal-slot><view className="child">{[].map(()=>null)}</view></internal-slot>
        </view>;
