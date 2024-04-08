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