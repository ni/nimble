export const WaferMapQuadrant = {
    bottomLeft: 'bottom-left',
    bottomRight: 'bottom-right',
    topLeft: 'top-left',
    topRight: 'top-right'
} as const;

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
    width: number;
    height: number;
}

export interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
