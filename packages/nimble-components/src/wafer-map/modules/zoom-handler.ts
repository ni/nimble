import { select } from 'd3-selection';
import {
    zoom,
    ZoomBehavior,
    zoomIdentity,
    ZoomTransform,
    zoomTransform
} from 'd3-zoom';
import type { WaferMap } from '..';

interface ZoomEvent {
    transform: ZoomTransform;
}

/**
 * ZoomHandler deals with user interactions and events like zooming
 */
export class ZoomHandler {
    private zoomTransform: ZoomTransform = zoomIdentity;
    private readonly minScale = 1.1;
    private readonly minExtentPoint: [number, number] = [-100, -100];
    private readonly extentPadding = 100;
    private readonly zoomBehavior: ZoomBehavior<Element, unknown>;

    public constructor(private readonly wafermap: WaferMap) {
        this.zoomBehavior = this.createZoomBehavior();
        this.zoomBehavior(select(this.wafermap.canvas as Element));
    }

    private rescale(event: ZoomEvent): void {
        const transform = event.transform;
        if (transform.k === this.minScale) {
            this.zoomTransform = zoomIdentity;
            this.zoomBehavior.transform(
                select(this.wafermap.canvas as Element),
                zoomIdentity
            );
        } else {
            this.zoomTransform = transform;
        }

        this.wafermap.transform = this.zoomTransform;
    }

    private createZoomBehavior(): ZoomBehavior<Element, unknown> {
        const zoomBehavior = zoom()
            .scaleExtent([
                1.1,
                this.getZoomMax(
                    this.wafermap.canvas.width * this.wafermap.canvas.height,
                    this.wafermap.dataManager!.containerDimensions.width
                        * this.wafermap.dataManager!.containerDimensions.height
                )
            ])
            .translateExtent([
                this.minExtentPoint,
                [
                    this.wafermap.canvas.width + this.extentPadding,
                    this.wafermap.canvas.height + this.extentPadding
                ]
            ])
            .filter((event: Event) => {
                const transform = zoomTransform(this.wafermap.canvas);
                const filterEval = transform.k >= this.minScale || event.type === 'wheel';
                return filterEval;
            })
            .on('zoom', (event: ZoomEvent) => {
                // D3 will automatically remove existing handlers when adding new ones
                // See: https://github.com/d3/d3-zoom/blob/v3.0.0/README.md#zoom_on
                this.rescale(event);
            });

        return zoomBehavior;
    }

    private getZoomMax(canvasArea: number, dataArea: number): number {
        return Math.ceil((dataArea / canvasArea) * 100);
    }
}
