import { select } from 'd3-selection';
import {
    zoom,
    ZoomBehavior,
    zoomIdentity,
    ZoomTransform,
    zoomTransform
} from 'd3-zoom';
import type { Dimensions, ZoomHandlerData } from '../types';

/**
 * ZoomHandler deals with user interactions and events like zooming
 */
export class ZoomHandler {
    public onZoom: VoidFunction | undefined;
    private _zoomTransform: ZoomTransform = zoomIdentity;
    private readonly minScale = 1.1;
    private readonly minExtentPoint: [number, number] = [-100, -100];
    private readonly extentPadding = 100;
    private zoomBehavior: ZoomBehavior<Element, unknown>;
    private readonly canvas: HTMLCanvasElement;
    private readonly zoomContainer: HTMLElement;
    private readonly containerDimensions: Dimensions | undefined;
    private readonly canvasLength: number;
    private _renderingFunction: VoidFunction | undefined;
    private _hideHoverDieFunction: VoidFunction | undefined;
    private lastEvent: Event | undefined; 

    public get zoomTransform(): ZoomTransform {
        return this._zoomTransform;
    }

    public constructor( data:ZoomHandlerData) {
        this.canvas=data.canvas;
        this.zoomContainer=data.zoomContainer;
        this.containerDimensions=data.containerDimensions;
        this.canvasLength=data.canvasLength;
        this.zoomBehavior=this.createZoomBehavior();
        this.zoomBehavior(select(this.canvas as Element));
    }

    public set renderingFunction(renderingFunction: VoidFunction) {
        this._renderingFunction = renderingFunction;
    }

    public set hideHoverDieFunction(hideHoverDieFunction: VoidFunction) {
        this._hideHoverDieFunction = hideHoverDieFunction;
    }


    public resetTransform(): void {
        if (this.onZoom === undefined) {
            return;
        }
        const canvasContext = this.canvas.getContext('2d');
        if (canvasContext === null) {
            return;
        }
        this._zoomTransform = zoomIdentity;
        this.clearCanvas(canvasContext, this.canvasLength, this.canvasLength);
        this.scaleCanvas(
            canvasContext,
            zoomIdentity.x,
            zoomIdentity.y,
            zoomIdentity.k
        );
        this.onZoom();
        this.zoomBehavior?.transform(
            select(this.canvas as Element),
            zoomIdentity
        );
    }

    // public reScale(){
    //     if (this._renderingFunction === undefined) {
    //         return;
    //     }
    //     const transform = event.transform;
    //     const canvasContext = this.canvas.getContext('2d');
    //     if (canvasContext === null) {
    //         return;
    //     }
    //     canvasContext.save();
    //     if (transform.k === this.minScale) {
    //         this._zoomTransform = zoomIdentity;
    //         this.clearCanvas(
    //             canvasContext,
    //             this.canvasLength,
    //             this.canvasLength
    //         );
    //         this.scaleCanvas(
    //             canvasContext,
    //             zoomIdentity.x,
    //             zoomIdentity.y,
    //             zoomIdentity.k
    //         );
    //         this._renderingFunction();
    //         zoomBehavior.transform(
    //             select(this.canvas as Element),
    //             zoomIdentity
    //         );
    //     } else {
    //         this._zoomTransform = transform;
    //         this.clearCanvas(
    //             canvasContext,
    //             this.canvasLength * this.zoomTransform.k,
    //             this.canvasLength * this.zoomTransform.k
    //         );
    //         this.scaleCanvas(
    //             canvasContext,
    //             transform.x,
    //             transform.y,
    //             transform.k
    //         );
    //         this._renderingFunction();
    //     }
    //     canvasContext.restore();
    //     this.zoomContainer.setAttribute(
    //         'transform',
    //         this.zoomTransform.toString()
    //     );
    // }

    private createZoomBehavior(): ZoomBehavior<Element, unknown> {
        const zoomBehavior = zoom()
            .scaleExtent([
                1.1,
                this.getZoomMax(
                    this.canvasLength * this.canvasLength,
                    this.containerDimensions!.width
                        * this.containerDimensions!.height
                )
            ])
            .translateExtent([
                this.minExtentPoint,
                [
                    this.canvasLength + this.extentPadding,
                    this.canvasLength + this.extentPadding
                ]
            ])
            .filter((event: Event) => {
                const transform = zoomTransform(this.canvas);
                return transform.k >= this.minScale || event.type === 'wheel';
            })
            .on('zoom', (event: { transform: ZoomTransform }) => {
                if (this._hideHoverDieFunction) {
                    this._hideHoverDieFunction();
                }
                if (this._renderingFunction === undefined) {
                    return;
                }
                const transform = event.transform;
                const canvasContext = this.canvas.getContext('2d');
                if (canvasContext === null) {
                    return;
                }
                canvasContext.save();
                if (transform.k === this.minScale) {
                    this._zoomTransform = zoomIdentity;
                    this.clearCanvas(
                        canvasContext,
                        this.canvasLength,
                        this.canvasLength
                    );
                    this.scaleCanvas(
                        canvasContext,
                        zoomIdentity.x,
                        zoomIdentity.y,
                        zoomIdentity.k
                    );
                    this._renderingFunction();
                    zoomBehavior.transform(
                        select(this.canvas as Element),
                        zoomIdentity
                    );
                } else {
                    this._zoomTransform = transform;
                    this.clearCanvas(
                        canvasContext,
                        this.canvasLength * this.zoomTransform.k,
                        this.canvasLength * this.zoomTransform.k
                    );
                    this.scaleCanvas(
                        canvasContext,
                        transform.x,
                        transform.y,
                        transform.k
                    );
                    this._renderingFunction();
                }
                canvasContext.restore();
                this.zoomContainer.setAttribute(
                    'transform',
                    this.zoomTransform.toString()
                );
            });

        return zoomBehavior;
    }

    private getZoomMax(canvasArea: number, dataArea: number): number {
        return Math.ceil((dataArea / canvasArea) * 100);
    }

    private clearCanvas(
        context: CanvasRenderingContext2D,
        width: number,
        height: number
    ): void {
        context.clearRect(0, 0, width, height);
    }

    private scaleCanvas(
        context: CanvasRenderingContext2D,
        x = 0,
        y = 0,
        scale = 1
    ): void {
        context.translate(x, y);
        context.scale(scale, scale);
    }
}
