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

export const WaferMapColorScaleMode = {
    linear: 'linear',
    ordinal: 'ordinal'
} as const;

export type WaferMapColorScaleMode =
    typeof WaferMapColorScaleMode[keyof typeof WaferMapColorScaleMode];

export interface WaferMapDie {
    value: string;
    x: number;
    y: number;
}

export interface WaferMapColorScale {
    colors: string[];
    values: string[];
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

export interface DieRenderInfo {
    readonly x: number;
    readonly y: number;
    readonly fillStyle: string;
    readonly opacity: number;
    readonly text: string;
}
