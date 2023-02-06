import { select } from 'd3-selection';
import {
    zoom,
    ZoomBehavior,
    zoomIdentity,
    ZoomTransform,
    zoomTransform
} from 'd3-zoom';
import type { WaferMap } from '..';

export interface ZoomEvent {
    transform: ZoomTransform;
}

/**
 * ZoomHandler deals with user interactions and events like zooming
 */
export class ZoomHandler extends EventTarget {
    private zoomTransform: ZoomTransform = zoomIdentity;
    private readonly minScale = 1.1;
    private readonly minExtentPoint: [number, number] = [-100, -100];
    private readonly extentPadding = 100;
    private readonly zoomBehavior: ZoomBehavior<Element, unknown>;
    private readonly renderingFunction: VoidFunction;
    private lastEvent: ZoomEvent | undefined;

    public constructor(private readonly wafermap:WaferMap) {
        super();
        this.zoomBehavior = this.createZoomBehavior();
        this.zoomBehavior(select(this.wafermap.canvas as Element));
        this.renderingFunction = () => {
            wafermap.renderer!.drawWafer();
        };
    }

    public resetTransform(): void {
        const canvasContext = this.wafermap.canvas.getContext('2d');
        if (canvasContext === null) {
            return;
        }
        this.zoomTransform = zoomIdentity;
        this.clearCanvas(canvasContext, this.wafermap.canvasSideLength, this.wafermap.canvasSideLength);
        this.scaleCanvas(
            canvasContext,
            zoomIdentity.x,
            zoomIdentity.y,
            zoomIdentity.k
        );
        this.rescale();
        this.zoomBehavior?.transform(
            select(this.wafermap.canvas as Element),
            zoomIdentity
        );
    }

    private rescale(): void {
        console.log('rescale');
        if (this.lastEvent === undefined) {
            return;
        }
        const transform = this.lastEvent.transform;
        const canvasContext = this.wafermap.canvas.getContext('2d');
        if (canvasContext === null) {
            return;
        }
        // console.log(transform);
        canvasContext.save();
        if (transform.k === this.minScale) {
            console.log('tranform minscale');
            this.zoomTransform = zoomIdentity;
            this.clearCanvas(
                canvasContext,
                this.wafermap.canvasSideLength,
                this.wafermap.canvasSideLength
            );
            this.scaleCanvas(
                canvasContext,
                zoomIdentity.x,
                zoomIdentity.y,
                zoomIdentity.k
            );
            this.zoomBehavior.transform(
                select(this.wafermap.canvas as Element),
                zoomIdentity
            );
            // this.wafermap.transform = this.zoomTransform;
            // this.renderingFunction();
            // this.wafermap.render();
            // this.wafermap.queueRender();
        } else {
            this.zoomTransform = transform;
            this.clearCanvas(
                canvasContext,
                this.wafermap.canvasSideLength * this.zoomTransform.k,
                this.wafermap.canvasSideLength * this.zoomTransform.k
            );
            this.scaleCanvas(
                canvasContext,
                transform.x,
                transform.y,
                transform.k
            );
            // this.wafermap.transform = this.zoomTransform;
            // this.renderingFunction();
            // this.wafermap.render();
            // this.wafermap.queueRender();
        }

        // this.wafermap.render();
        // this.wafermap.queueRender();
        
        // canvasContext.restore();
        // this.wafermap.zoomContainer.setAttribute(
        //     'transform',
        //     this.zoomTransform.toString()
        // );

        // console.log(this.zoomTransform);
        this.wafermap.transform = this.zoomTransform;
        // this.wafermap.queueRender();
    }

    private createZoomBehavior(): ZoomBehavior<Element, unknown> {
        const zoomBehavior = zoom()
            .scaleExtent([
                1.1,
                this.getZoomMax(
                    this.wafermap.canvasSideLength * this.wafermap.canvasSideLength,
                    this.wafermap.dataManager!.containerDimensions.width
                        * this.wafermap.dataManager!.containerDimensions.height
                )
            ])
            .translateExtent([
                this.minExtentPoint,
                [
                    this.wafermap.canvasSideLength + this.extentPadding,
                    this.wafermap.canvasSideLength + this.extentPadding
                ]
            ])
            .filter((event: Event) => {
                // console.log('filter events ------>', event);
                const transform = zoomTransform(this.wafermap.canvas);
                // console.log('transform ----->', transform);
                const filterEval = transform.k >= this.minScale || event.type === 'wheel';
                // console.log('eval ---->', filterEval)
                return filterEval;
            })
            .on('zoom', (event: ZoomEvent) => {
                // console.log('---------------- zoom -------------');
                if(this.wafermap.renderQueued) return;
                // if(false) return;
                else {

                    this.lastEvent = event;

                    this.dispatchEvent(
                        new CustomEvent('before-zoom', { detail: { event } })
                    );

                    this.rescale();

                    this.dispatchEvent(
                        new CustomEvent('after-zoom', { detail: { event } })
                    );

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
