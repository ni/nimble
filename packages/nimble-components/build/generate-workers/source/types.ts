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

export interface Transform {
    k: number;
    x: number;
    y: number;
}

export interface Dimensions {
    width: number;
    height: number;
}

export interface Margin {
    readonly top: number;
    readonly right: number;
    readonly bottom: number;
    readonly left: number;
}
export interface IColorScaleMarker {
    color: string;
    value: number;
}

export type ColorScale = IColorScaleMarker[];

export interface State {
    containerDimensions: Dimensions | undefined;
    dieDimensions: Dimensions | undefined;
    margin: Margin | undefined;
    verticalCoefficient: number | undefined;
    horizontalCoefficient: number | undefined;
    horizontalConstant: number | undefined;
    verticalConstant: number | undefined;
    labelsFontSize: number | undefined;
    colorScale: ColorScale | undefined;
}
