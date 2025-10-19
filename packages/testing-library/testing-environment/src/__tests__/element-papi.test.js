import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  lynxTestingEnv.reset();
  lynxTestingEnv.switchToMainThread();
});

describe('element PAPI', () => {
  it('__RemoveElement should work', () => {
    const view = __CreateView(0);
    expect(view).toMatchInlineSnapshot(`<view />`);
    const childViews = Array.from({ length: 6 }, (_, i) => {
      const childView = __CreateView(
        view.$$uiSign,
      );
      __AppendElement(view, childView);
      __SetID(childView, `child-${i}`);
      return childView;
    });
    expect(view).toMatchInlineSnapshot(`
      <view>
        <view
          id="child-0"
        />
        <view
          id="child-1"
        />
        <view
          id="child-2"
        />
        <view
          id="child-3"
        />
        <view
          id="child-4"
        />
        <view
          id="child-5"
        />
      </view>
    `);
    __RemoveElement(view, childViews[0]);
    __RemoveElement(view, childViews[4]);
    expect(view).toMatchInlineSnapshot(`
      <view>
        <view
          id="child-1"
        />
        <view
          id="child-2"
        />
        <view
          id="child-3"
        />
        <view
          id="child-5"
        />
      </view>
    `);
  });
  /*
Element Template:

Input:

<view className="view" style={`background-color: red; width: ${w};`} id={id1} bindtap={handle1}>
  <text className="text" id={id2} bindtap={handle2}>Hello, ReactLynx, {hello0}</text>
  <A/>
  <text {...textProps}>Hello, ReactLynx, {hello1}</text>
</view>

Output:

const template = {
  "type": "view",
  "attributes": [
    [
      "class",
      {
        "type": "value",
        "value": "view"
      }
    ],
    [
      "style",
      {
        "type": "attrSlot",
        "slotIndex": 0
      }
    ],
    [
      "id",
      {
        "type": "attrSlot",
        "slotIndex": 1
      }
    ],
    [
      "bindtap",
      {
        "type": "attrSlot",
        "slotIndex": 2
      }
    ]
  ],
  "children": [
    {
      "type": "text",
      "attributes": [
        [
          "class",
          {
            "type": "value",
            "value": "text"
          }
        ],
        [
          "id",
          {
            "type": "attrSlot",
            "slotIndex": 3
          }
        ],
        [
          "bindtap",
          {
            "type": "attrSlot",
            "slotIndex": 4
          }
        ]
      ],
      "children": [
        {
          "type": "raw-text",
          "value": "Hello, ReactLynx, "
        },
        {
          "type": "elementSlot",
          "slotIndex": 0
        }
      ]
    },
    {
      "type": "elementSlot",
      "slotIndex": 1
    },
    {
      "type": "text",
      "attributes": [
        [
          "spread",
          {
            "type": "attrSlot",
            "slotIndex": 5
          }
        ]
      ],
      "children": [
        {
          "type": "raw-text",
          "value": "Hello, ReactLynx, "
        },
        {
          "type": "elementSlot",
          "slotIndex": 2
        }
      ]
    }
  ]
}
  
Usage:

<template
  $0={hello0}
  $1={<A/>}
  $2={hello1}
  
  values={
    [
      `background-color: red; width: ${w};`,
      id1,
      handle1,
      id2,
      handle2,
      textProps
    ]
  }
/>

  
  */
  it('__CreateTemplateElement should work', () => {
    const template = __CreateTemplateElement({
      'type': 'view',
      'attributes': [
        [
          'class',
          {
            'type': 'value',
            'value': 'view',
          },
        ],
        [
          'style',
          {
            'type': 'attrSlot',
            'slotIndex': 0,
          },
        ],
        [
          'id',
          {
            'type': 'attrSlot',
            'slotIndex': 1,
          },
        ],
        [
          'bindtap',
          {
            'type': 'attrSlot',
            'slotIndex': 2,
          },
        ],
      ],
      'children': [
        {
          'type': 'text',
          'attributes': [
            [
              'class',
              {
                'type': 'value',
                'value': 'text',
              },
            ],
            [
              'id',
              {
                'type': 'attrSlot',
                'slotIndex': 3,
              },
            ],
            [
              'bindtap',
              {
                'type': 'attrSlot',
                'slotIndex': 4,
              },
            ],
          ],
          'children': [
            {
              'type': 'raw-text',
              'value': 'Hello, ReactLynx, ',
            },
            {
              'type': 'elementSlot',
              'slotIndex': 0,
            },
          ],
        },
        {
          'type': 'elementSlot',
          'slotIndex': 1,
        },
        {
          'type': 'text',
          'attributes': [
            [
              'spread',
              {
                'type': 'attrSlot',
                'slotIndex': 5,
              },
            ],
          ],
          'children': [
            {
              'type': 'raw-text',
              'value': 'Hello, ReactLynx, ',
            },
            {
              'type': 'elementSlot',
              'slotIndex': 2,
            },
          ],
        },
      ],
    }, 0);
    expect(template.root).toMatchInlineSnapshot(`
      <view
        class="view"
      >
        <text
          class="text"
        >
          Hello, ReactLynx, 
          <slot
            index="0"
          />
        </text>
        <slot
          index="1"
        />
        <text>
          Hello, ReactLynx, 
          <slot
            index="2"
          />
        </text>
      </view>
    `);
    expect(template.slots).toMatchInlineSnapshot(`
      [
        <slot
          index="0"
        />,
        <slot
          index="1"
        />,
        <slot
          index="2"
        />,
      ]
    `)
    expect(template.attrSlots).toMatchInlineSnapshot(`
      [
        [
          <view
            class="view"
          >
            <text
              class="text"
            >
              Hello, ReactLynx, 
              <slot
                index="0"
              />
            </text>
            <slot
              index="1"
            />
            <text>
              Hello, ReactLynx, 
              <slot
                index="2"
              />
            </text>
          </view>,
          [
            "style",
            {
              "slotIndex": 0,
              "type": "attrSlot",
            },
          ],
        ],
        [
          <view
            class="view"
          >
            <text
              class="text"
            >
              Hello, ReactLynx, 
              <slot
                index="0"
              />
            </text>
            <slot
              index="1"
            />
            <text>
              Hello, ReactLynx, 
              <slot
                index="2"
              />
            </text>
          </view>,
          [
            "id",
            {
              "slotIndex": 1,
              "type": "attrSlot",
            },
          ],
        ],
        [
          <view
            class="view"
          >
            <text
              class="text"
            >
              Hello, ReactLynx, 
              <slot
                index="0"
              />
            </text>
            <slot
              index="1"
            />
            <text>
              Hello, ReactLynx, 
              <slot
                index="2"
              />
            </text>
          </view>,
          [
            "bindtap",
            {
              "slotIndex": 2,
              "type": "attrSlot",
            },
          ],
        ],
        [
          <text
            class="text"
          >
            Hello, ReactLynx, 
            <slot
              index="0"
            />
          </text>,
          [
            "id",
            {
              "slotIndex": 3,
              "type": "attrSlot",
            },
          ],
        ],
        [
          <text
            class="text"
          >
            Hello, ReactLynx, 
            <slot
              index="0"
            />
          </text>,
          [
            "bindtap",
            {
              "slotIndex": 4,
              "type": "attrSlot",
            },
          ],
        ],
        [
          <text>
            Hello, ReactLynx, 
            <slot
              index="2"
            />
          </text>,
          [
            "spread",
            {
              "slotIndex": 5,
              "type": "attrSlot",
            },
          ],
        ],
      ]
    `)
    
    const elementSlot0 = document.createTextNode('hello0')
    const elementSlot1 = document.createTextNode('A')
    const elementSlot2 = document.createTextNode('hello1')
    template.updateSlot(0, elementSlot0)
    template.updateSlot(1, elementSlot1)
    template.updateSlot(2, elementSlot2)
    expect(template.root).toMatchInlineSnapshot(`
      <view
        class="view"
      >
        <text
          class="text"
        >
          Hello, ReactLynx, 
          hello0
        </text>
        A
        <text>
          Hello, ReactLynx, 
          hello1
        </text>
      </view>
    `)
    
    const attrSlot0 = `background-color: red; width: ${'100px'};`
    const attrSlot1 = "id1"
    const attrSlot2 = "handle1"
    const attrSlot3 = "id2"
    const attrSlot4 = "handle2"
    template.updateAttrSlot(0, attrSlot0)
    template.updateAttrSlot(1, attrSlot1)
    template.updateAttrSlot(2, attrSlot2)
    template.updateAttrSlot(3, attrSlot3)
    template.updateAttrSlot(4, attrSlot4)
    
    expect(template.root).toMatchInlineSnapshot(`
      <view
        bindtap="handle1"
        class="view"
        id="id1"
        style="background-color: red; width: 100px;"
      >
        <text
          bindtap="handle2"
          class="text"
          id="id2"
        >
          Hello, ReactLynx, 
          hello0
        </text>
        A
        <text>
          Hello, ReactLynx, 
          hello1
        </text>
      </view>
    `)
    
  });
});
