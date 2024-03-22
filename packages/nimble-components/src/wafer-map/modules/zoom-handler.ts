import { select } from 'd3-selection';
import { zoom, ZoomTransform } from 'd3-zoom';
import type { WaferMap } from '..';
import type { WaferRequiredTypeMap } from '../types';

interface ZoomEvent {
    transform: ZoomTransform;
}

/**
 * ZoomHandler deals with user interactions and events like zooming
 */
export class ZoomHandler<T extends WaferRequiredTypeMap> {
    private readonly scaleExtent: [number, number] = [1, 100];
    private readonly minExtentPoint: [number, number] = [0, 0];

    public constructor(private readonly wafermap: WaferMap<T>) {}

    /**
     * @internal
     */
    public connect(): void {
        this.createZoomBehavior();
        this.wafermap.addEventListener('wheel', this.onWheelMove, {
            passive: false
        });
    }

    /**
     * @internal
     */
    public disconnect(): void {
        zoom().on('zoom', null)(select(this.wafermap as Element));
        this.wafermap.removeEventListener('wheel', this.onWheelMove);
    }

    private createZoomBehavior(): void {
        zoom()
            .scaleExtent(this.scaleExtent)
            .translateExtent([
                this.minExtentPoint,
                [this.wafermap.canvasWidth, this.wafermap.canvasHeight]
            ])
            .on('zoom', (event: ZoomEvent) => {
                // D3 will automatically remove existing handlers when adding new ones
                // See: https://github.com/d3/d3-zoom/blob/v3.0.0/README.md#zoom_on
                this.wafermap.transform = event.transform;
            })(select(this.wafermap as Element));
    }

    private readonly onWheelMove = (event: Event): void => {
        event.preventDefault();
    };
}
