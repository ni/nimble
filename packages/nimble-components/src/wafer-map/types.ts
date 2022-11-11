export const WaferColorByOptions = {
    hardBin: 0,
    softBin: 1,
    binType: 2,
    floatValue: 3
} as const;

export type WaferColorByOptions =
    typeof WaferColorByOptions[keyof typeof WaferColorByOptions];

export const Quadrant = {
    bottomLeft: 0,
    bottomRight: 1,
    topLeft: 2,
    topRight: 3
} as const;

export type Quadrant =
    typeof Quadrant[keyof typeof Quadrant];

export const Orientation = {
    top: 1,
    bottom: 2,
    left: 3,
    right: 4,
} as const;

export type Orientation =
    typeof Orientation[keyof typeof Orientation];

export const WaferMapDataType = {
    categorical: 0,
    accumulative: 1
} as const;

export type WaferMapDataType =
    typeof WaferMapDataType[keyof typeof WaferMapDataType];
