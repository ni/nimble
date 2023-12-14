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
    private readonly zoomHandler;
    private readonly hoverHandler;
    public constructor(private readonly wafermap: WaferMap) {
        this.zoomHandler = new ZoomHandler(wafermap);
        this.hoverHandler = new HoverHandler(wafermap);
    }

    public attachEvents(): void {
        this.zoomHandler.createZoomBehavior();
        this.wafermap.addEventListener('mousemove', this.onMouseMove);
        this.wafermap.addEventListener('mouseout', this.onMouseOut);
        this.wafermap.canvas.addEventListener('wheel', this.onWheelMove, {
            passive: false
        });
    }

    public detachEvents(): void {
        this.wafermap.removeEventListener('mousemove', this.onMouseMove);
        this.wafermap.removeEventListener('mouseout', this.onMouseOut);
        this.wafermap.canvas.removeEventListener('wheel', this.onWheelMove);
    }

    private readonly onWheelMove = (event: Event): void => {
        event.preventDefault();
    };

    private readonly onMouseMove = (event: MouseEvent): void => {
        this.hoverHandler.mousemove(event);
    };

    private readonly onMouseOut = (): void => {
        this.hoverHandler.mouseout();
    };
}
