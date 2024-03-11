import { select } from 'd3-selection';
import {
    zoom,
    ZoomTransform
} from 'd3-zoom';
import type { WaferMap } from '../..';

interface ZoomEvent {
    transform: ZoomTransform;
}

/**
 * ZoomHandler deals with user interactions and events like zooming
 */
export class ZoomHandler {
    private readonly scaleExtent: [number, number] = [1, 100];
    private readonly minExtentPoint: [number, number] = [0, 0];

    public constructor(private readonly wafermap: WaferMap) {}

    public createZoomBehavior(): void {
        const zoomBehavior = zoom()
            .scaleExtent(this.scaleExtent)
            .translateExtent([
                this.minExtentPoint,
                [
                    this.wafermap.canvasWidth,
                    this.wafermap.canvasHeight
                ]
            ])
            .on('zoom', (event: ZoomEvent) => {
                // D3 will automatically remove existing handlers when adding new ones
                // See: https://github.com/d3/d3-zoom/blob/v3.0.0/README.md#zoom_on
                this.wafermap.transform = event.transform;
            });

        zoomBehavior(select(this.wafermap as Element));
    }
}
