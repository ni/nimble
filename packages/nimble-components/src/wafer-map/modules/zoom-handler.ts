import { select } from 'd3-selection';
import {
    zoom,
    ZoomBehavior,
    zoomIdentity,
    ZoomTransform,
    zoomTransform
} from 'd3-zoom';
import type { Dimensions, ZoomEvent, ZoomHandlerData } from '../types';

/**
 * ZoomHandler deals with user interactions and events like zooming
 */
export class ZoomHandler {
    /*
     * This "event" is triggered when the user zooms the wafer map.
     * This is just a callback function since it can only have one subscriber right now.
     */
    public onZoom: ((event: ZoomEvent) => void) | undefined;

    private zoomTransform: ZoomTransform = zoomIdentity;
    private readonly minScale = 1.1;
    private readonly minExtentPoint: [number, number] = [-100, -100];
    private readonly extentPadding = 100;
    private readonly zoomBehavior: ZoomBehavior<Element, unknown>;
    private readonly canvas: HTMLCanvasElement;
    private readonly zoomContainer: HTMLElement;
    private readonly containerDimensions: Dimensions | undefined;
    private readonly canvasLength: number;
    private readonly renderingFunction: VoidFunction;
    private lastEvent: ZoomEvent | undefined;

    public constructor(data: ZoomHandlerData) {
        this.canvas = data.canvas;
        this.zoomContainer = data.zoomContainer;
        this.containerDimensions = data.containerDimensions;
        this.canvasLength = data.canvasLength;
        this.zoomBehavior = this.createZoomBehavior();
        this.zoomBehavior(select(this.canvas as Element));
        this.renderingFunction = () => {
            data.renderModule.drawWafer();
        };
    }

    public resetTransform(): void {
        if (this.onZoom === undefined) {
            return;
        }
        const canvasContext = this.canvas.getContext('2d');
        if (canvasContext === null) {
            return;
        }
        this.zoomTransform = zoomIdentity;
        this.clearCanvas(canvasContext, this.canvasLength, this.canvasLength);
        this.scaleCanvas(
            canvasContext,
            zoomIdentity.x,
            zoomIdentity.y,
            zoomIdentity.k
        );
        this.rescale();
        this.zoomBehavior?.transform(
            select(this.canvas as Element),
            zoomIdentity
        );
    }

    public rescale(): void {
        if (this.lastEvent === undefined) {
            return;
        }
        const transform = this.lastEvent.transform;
        const canvasContext = this.canvas.getContext('2d');
        if (canvasContext === null) {
            return;
        }
        canvasContext.save();
        if (transform.k === this.minScale) {
            this.zoomTransform = zoomIdentity;
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
            this.renderingFunction();
            this.zoomBehavior.transform(
                select(this.canvas as Element),
                zoomIdentity
            );
        } else {
            this.zoomTransform = transform;
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
            this.renderingFunction();
        }
        canvasContext.restore();
        this.zoomContainer.setAttribute(
            'transform',
            this.zoomTransform.toString()
        );
    }

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
            .on('zoom', (event: ZoomEvent) => {
                this.lastEvent = event;
                if (this.onZoom !== undefined) {
                    this.onZoom(event);
                }
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
