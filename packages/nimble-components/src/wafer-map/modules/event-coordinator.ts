import type { WaferMapDie } from '../types';
import { ZoomHandler } from './zoom-handler';
import type { WaferMap } from '..';
import { HoverHandler } from './hover-handler';

export interface EventCoordinatorCallbacks {
    dieSelected: (die: WaferMapDie) => void;
}

/**
 * EventCoordinator deals with user interactions and events
 */
export class EventCoordinator {
    private readonly zoomHandler: ZoomHandler;
    private readonly hoverHandler: HoverHandler;

    public constructor(wafermap: WaferMap) {
        this.zoomHandler = new ZoomHandler(wafermap);
        this.hoverHandler = new HoverHandler();

        this.attachEvents(wafermap);
    }

    public updateEvents(wafermap: Readonly<WaferMap>): void {
        this.zoomHandler.updateZoomBehavior(wafermap);
        this.attachEvents(wafermap);
    }

    public detachEvents(wafermap: Readonly<WaferMap>): void {
        wafermap.removeEventListener('mousemove', this.onMouseMove);
        wafermap.removeEventListener('mouseout', this.onMouseOut);
        wafermap.canvas.removeEventListener('wheel', this.onWheelMove);
    }

    private readonly onWheelMove = (event: Event): void => {
        event.preventDefault();
    };

    private readonly onMouseMove = (event: MouseEvent): void => {
        this.hoverHandler.mousemove(event);
    };

    private readonly onMouseOut = (event: MouseEvent): void => {
        this.hoverHandler.mouseout(event);
    };

    private attachEvents(wafermap: Readonly<WaferMap>): void {
        wafermap.addEventListener('mousemove', this.onMouseMove);
        wafermap.addEventListener('mouseout', this.onMouseOut);
        wafermap.canvas.addEventListener('wheel', this.onWheelMove, {
            passive: false
        });
    }
}
