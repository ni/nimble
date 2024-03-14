export interface WaferMapTypedMatrix {
    colIndexes: Uint32Array;
    rowIndexes: Uint32Array;
    values: Float64Array;
}

export interface WaferMapMatrix {
    colIndexes: number[];
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