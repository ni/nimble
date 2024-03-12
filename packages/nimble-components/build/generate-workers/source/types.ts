export interface WaferMapTypedMatrix {
    colIndexes: Uint8Array;
    rowIndexes: Uint8Array;
    values: Float32Array;
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