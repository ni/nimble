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
    dieDimensions: Dimensions;
    margin: Margin;
    verticalCoefficient: number;
    horizontalCoefficient: number;
    horizontalConstant: number;
    verticalConstant: number;
    labelsFontSize: number;
    colorScale: ColorScale;
}

export interface TransformConfig {
    transform: Transform;
    topLeftCanvasCorner: Position;
    bottomRightCanvasCorner: Position;
}
