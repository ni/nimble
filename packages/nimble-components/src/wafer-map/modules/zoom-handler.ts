import { select } from 'd3-selection';
import {
    zoom,
    ZoomBehavior,
    zoomIdentity,
    ZoomTransform,
    zoomTransform
} from 'd3-zoom';
import type { Dimensions } from '../types';

/**
 * ZoomHandler deals with user interactions and events like zooming
 */
export class ZoomHandler {
    private _zoomTransform: ZoomTransform = zoomIdentity;
    private readonly minScale = 1.1;
    private readonly minExtentPoint: [number, number] = [-100, -100];
    private readonly extentPadding = 100;
    private zoomBehavior: ZoomBehavior<Element, unknown> | undefined;
    private _renderingFunction: ((_: number) => void) | undefined;
    private _hideHoverDieFunction: VoidFunction | undefined;

    public get zoomTransform(): ZoomTransform {
        return this._zoomTransform;
    }

    public constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly zoomContainer: HTMLElement,
        private readonly containerDimensions: Dimensions,
        private readonly canvasDimensions: Readonly<Dimensions>,
    ) {}

    public set renderingFunction(renderingFunction: (_: number) => void) {
        this._renderingFunction = renderingFunction;
    }

    public set hideHoverDieFunction(hideHoverDieFunction: VoidFunction) {
        this._hideHoverDieFunction = hideHoverDieFunction;
    }

    public attachZoomBehavior(): void {
        this.zoomBehavior = this.createZoomBehavior();
        this.zoomBehavior(select(this.canvas as Element));
    }

    public resetTransform(): void {
        if (this._renderingFunction === undefined) {
            return;
        }
        const canvasContext = this.canvas.getContext('2d');
        if (canvasContext === null) {
            return;
        }
        this._zoomTransform = zoomIdentity;
        this.clearCanvas(canvasContext, this.canvasDimensions);
        this.scaleCanvas(canvasContext, zoomIdentity);
        this._renderingFunction(zoomIdentity.k);
        this.zoomBehavior?.transform(
            select(this.canvas as Element),
            zoomIdentity
        );
    }

    private readonly zoomEventHandler = (event: { transform: ZoomTransform, target: ZoomBehavior<Element, unknown> }): void => {
        if (this._hideHoverDieFunction) {
            this._hideHoverDieFunction();
        }
        if (this._renderingFunction === undefined) {
            return;
        }
        // debugsger;
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
                this.canvasDimensions
            );
            this.scaleCanvas(
                canvasContext,
                zoomIdentity
            );
            this._renderingFunction(zoomIdentity.k);
            event.target.transform(
                select(this.canvas as Element),
                zoomIdentity
            );
        } else {
            this._zoomTransform = transform;
            this.clearCanvas(
                canvasContext,
                {
                    width: this.canvasDimensions.width * this.zoomTransform.k,
                    height: this.canvasDimensions.height * this.zoomTransform.k
                }
            );
            this.scaleCanvas(
                canvasContext,
                transform
            );
            this._renderingFunction(transform.k);
        }
        canvasContext.restore();
        this.zoomContainer.setAttribute(
            'transform',
            this.zoomTransform.toString()
        );
    };

    private createZoomBehavior(): ZoomBehavior<Element, unknown> {
        const zoomBehavior = zoom()
            .scaleExtent([
                1.1,
                this.getZoomMax(
                    this.canvasDimensions.width * this.canvasDimensions.height,
                    this.containerDimensions.width
                        * this.containerDimensions.height
                )
            ])
            .translateExtent([
                this.minExtentPoint,
                [
                    this.canvasDimensions.width + this.extentPadding,
                    this.canvasDimensions.height + this.extentPadding
                ]
            ])
            .filter((event: Event) => {
                const transform = zoomTransform(this.canvas);
                return transform.k >= this.minScale || event.type === 'wheel';
            })
            .on('zoom', this.zoomEventHandler);

        return zoomBehavior;
    }

    private getZoomMax(canvasArea: number, dataArea: number): number {
        return Math.ceil((dataArea / canvasArea) * 100);
    }

    private clearCanvas(
        context: CanvasRenderingContext2D,
        canvasDimensions: Readonly<Dimensions>,
    ): void {
        context.clearRect(0, 0, canvasDimensions.width, canvasDimensions.height);
    }

    private scaleCanvas(
        context: CanvasRenderingContext2D,
        transform: ZoomTransform
    ): void {
        context.translate(transform.x, transform.y);
        context.scale(transform.k, transform.k);
    }
}
