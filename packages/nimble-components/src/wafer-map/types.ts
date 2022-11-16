export const WaferMapColorBy = {
    hardBin: 'hard-bin',
    softBin: 'soft-bin',
    binType: 'bin-type',
    floatValue: 'float-value'
} as const;

export type WaferMapColorBy =
    typeof WaferMapColorBy[keyof typeof WaferMapColorBy];

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

export const WaferMapDataType = {
    categorical: 'categorical',
    accumulative: 'accumulative'
} as const;

export type WaferMapDataType =
    typeof WaferMapDataType[keyof typeof WaferMapDataType];

export interface WaferMapDie {
    data: string | number;
    x: number;
    y: number;
}

export interface WaferMapColorsScale {
    colors: string[];
    values: string[];
}
