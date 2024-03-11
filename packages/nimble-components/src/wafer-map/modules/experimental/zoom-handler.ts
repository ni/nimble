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
        zoom()
            .scaleExtent(this.scaleExtent)
            .translateExtent([
                this.minExtentPoint,
                [
                    this.wafermap.canvasWidth,
                    this.wafermap.canvasHeight
                ]
            ])
            .on('zoom', (event: ZoomEvent) => {
                this.wafermap.transform = event.transform;
            })(select(this.wafermap as Element));
    }

    public removeZoomBehavior(): void {
        zoom().on('zoom', null)(select(this.wafermap as Element));
    }
}
