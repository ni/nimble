import type { ZoomTransform } from "d3-zoom";
import type { RenderingModule } from "./modules/rendering";

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
    // The metadata field is not used by the wafer-map and is only for optionally storing arbitrary metadata.
    metadata?: unknown;
}

export interface WaferMapColorScale {
    colors: string[];
    values: string[];
}

export interface ZoomHandlerData{
    canvas: HTMLCanvasElement,
    zoomContainer: HTMLElement,
    containerDimensions: Dimensions,
    canvasLength:number,
    renderModule:RenderingModule
}

export interface ZoomEvent{
    zoomtransform: ZoomTransform
}

export interface EventHandlerData{
    zoomHandlerData:ZoomHandlerData
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
    readonly text: string;
}
