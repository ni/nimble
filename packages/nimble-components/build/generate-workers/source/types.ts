export interface WaferMapTypedMatrix {
    columnIndexes: Int32Array;
    rowIndexes: Int32Array;
    values: Float64Array;
}

export interface WaferMapMatrix {
    columnIndexes: number[];
    rowIndexes: number[];
    values: number[];
}

export interface Transform{
    k: number;
    x: number;
    y: number;
}

export interface Dimensions{
    width: number;
    height: number;
}

interface IColorScaleMarker {
    color: string;
    value: number;
}

export type ColorScale = IColorScaleMarker[];