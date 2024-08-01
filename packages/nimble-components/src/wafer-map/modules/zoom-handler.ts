import { select } from 'd3-selection';
import { zoom, ZoomTransform } from 'd3-zoom';
import { Observable, type Notifier } from '@microsoft/fast-element';
import type { WaferMap } from '..';

interface ZoomEvent {
    transform: ZoomTransform;
}

/**
 * ZoomHandler deals with user interactions and events like zooming
 */
export class ZoomHandler {
    private readonly scaleExtent: [number, number] = [1, 100];
    private readonly minExtentPoint: [number, number] = [0, 0];
    private readonly wafermapNotifier: Notifier;

    public constructor(private readonly wafermap: WaferMap) {
        this.wafermapNotifier = Observable.getNotifier(this.wafermap);
        this.wafermapNotifier.subscribe(this, 'canvasWidth');
        this.wafermapNotifier.subscribe(this, 'canvasHeight');
    }

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

    public handleChange(source: WaferMap, propertyName: string): void {
        if (
            source === this.wafermap
            && (propertyName === 'canvasWidth' || propertyName === 'canvasHeight')
        ) {
            this.createZoomBehavior();
        }
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
