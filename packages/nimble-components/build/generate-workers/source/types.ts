export interface Transform {
    k: number;
    x: number;
    y: number;
}

export interface Dimensions {
    width: number;
    height: number;
}

export interface Position {
    x: number;
    y: number;
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

export interface RenderConfig {
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

export interface TransformConfig {
    transform: Transform | undefined;
    topLeftCanvasCorner: Position | undefined;
    bottomRightCanvasCorner: Position | undefined;
}
