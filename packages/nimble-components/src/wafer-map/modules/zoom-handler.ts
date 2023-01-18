import { select } from 'd3-selection';
import {
    zoom,
    ZoomBehavior,
    zoomIdentity,
    ZoomTransform,
    zoomTransform
} from 'd3-zoom';
import type { DataManager } from './data-manager';

/**
 * ZoomHandler deals with user interactions and events like zooming
 */
export class ZoomHandler {
    public transform: ZoomTransform | undefined;
    public zoomTransform: ZoomTransform = zoomIdentity;

    private readonly minScale = 1.1;
    private readonly minExtentPoint: [number, number] = [-100, -100];
    private readonly extentPadding = 100;
    private _renderingFunction: VoidFunction | undefined;
    private _hideHoverDieFunction: VoidFunction | undefined;

    public constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly zoomContainer: HTMLElement,
        private readonly dataManager: DataManager,
    ) {}

    public set renderingFunction(renderingFunction: VoidFunction) {
        this._renderingFunction = renderingFunction;
    }

    public set hideHoverDieFunction(hideHoverDieFunction: VoidFunction) {
        this._hideHoverDieFunction = hideHoverDieFunction;
    }

    public attachZoomBehavior(): void {
        const zoomBehavior = this.createZoomBehavior();
        zoomBehavior(select(this.canvas as Element));
    }

    private createZoomBehavior(): ZoomBehavior<Element, unknown> {
        this.canvas.addEventListener('wheel', event => event.preventDefault());
        if (this.dataManager === undefined) return zoom();
        const zoomBehavior = zoom()
            .scaleExtent([
                1.1,
                this.getZoomMax(
                    this.canvas.width * this.canvas.height,
                    this.dataManager.containerDimensions.width
                        * this.dataManager.containerDimensions.height
                )
            ])
            .translateExtent([
                this.minExtentPoint,
                [
                    this.canvas.width + this.extentPadding,
                    this.canvas.height + this.extentPadding
                ]
            ])
            .filter((event: Event) => {
                this.transform = zoomTransform(this.canvas);
                return (
                    this.transform.k >= this.minScale || event.type === 'wheel'
                );
            })
            .on('zoom', (event: { transform: ZoomTransform }) => {
                if (this._hideHoverDieFunction) this._hideHoverDieFunction();
                if (this.dataManager === undefined) return;
                if (this._renderingFunction === undefined) return;
                this.transform = event.transform;
                const canvasContext = this.canvas.getContext('2d');
                if (canvasContext === null) return;
                canvasContext.save();
                if (this.transform.k === this.minScale) {
                    this.zoomTransform = zoomIdentity;
                    this.clearCanvas(
                        canvasContext,
                        this.canvas.width,
                        this.canvas.height
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
                    this.zoomTransform = this.transform;
                    this.clearCanvas(
                        canvasContext,
                        this.canvas.width * this.zoomTransform.k,
                        this.canvas.height * this.zoomTransform.k
                    );
                    this.scaleCanvas(
                        canvasContext,
                        this.transform.x,
                        this.transform.y,
                        this.transform.k
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
