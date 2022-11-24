export const WaferMapQuadrant = {
    bottomLeft: 'bottom-left',
    bottomRight: 'bottom-right',
    topLeft: 'top-left',
    topRight: 'top-right'
} as const;

export const HighlightedValuesSets = [
    [0, 1, 2 ,3],
    [4, 5, 6 ,7],
    [1, 5, 7 ,15],
    [0, 2, 7 ,10]
];

export const WafermapDiesSet:WaferMapDie[] = [
    {x:0, y:0, value:100},
    {x:0, y:1, value:50},
    {x:0, y:2, value:12},
    {x:0, y:3, value:99},
    {x:1, y:0, value:78},
    {x:1, y:1, value:88},
    {x:1, y:2, value:68},
    {x:1, y:3, value:99},
    {x:2, y:0, value:99},
    {x:2, y:1, value:80},
    {x:2, y:2, value:99},
    {x:2, y:3, value:100},
    {x:3, y:0, value:40},
    {x:3, y:1, value:10},
    {x:3, y:2, value:15},
    {x:3, y:3, value:30},
]

export const WaferMapColorsScaleSets:WaferMapColorsScale[]=[
    {
        colors:['red', 'orange', 'green'],
        values:[1, 50, 100]
    }
]

export type WaferMapQuadrant =
    typeof WaferMapQuadrant[keyof typeof WaferMapQuadrant];

export const WaferMapOrientation = {
    top: 'top',
    bottom: 'bottom',
    left: 'left',
    right: 'right'
} as const;

export type WaferMapOrientation =
    typeof WaferMapOrientation[keyof typeof WaferMapOrientation];

export const WaferMapColorsScaleMode = {
    linear: 'linear',
    ordinal: 'ordinal'
} as const;

export type WaferMapColorsScaleMode =
    typeof WaferMapColorsScaleMode[keyof typeof WaferMapColorsScaleMode];

export interface WaferMapDie {
    value: number;
    x: number;
    y: number;
}

export interface WaferMapColorsScale {
    colors: string[];
    values: number[];
}

export interface Dimensions {
    readonly width: number;
    readonly height: number;
}

export interface Margin {
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly left: number;
}
