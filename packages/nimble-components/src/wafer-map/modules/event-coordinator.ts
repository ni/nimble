import type { WaferMapDie } from '../types';
import type { WaferMap } from '..';
import { HoverHandler } from './hover-handler';

export interface EventCoordinatorCallbacks {
    dieSelected: (die: WaferMapDie) => void;
}

/**
 * EventCoordinator deals with user interactions and events
 */
export class EventCoordinator {
    private readonly hoverHandler: HoverHandler;

    public constructor(private readonly wafermap: WaferMap) {
        this.hoverHandler = new HoverHandler(wafermap);

        this.attachEvents();
    }

    public detachEvents(): void {
        this.wafermap.removeEventListener('mousemove', this.onMouseMove);
        this.wafermap.removeEventListener('mouseout', this.onMouseOut);
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

    private attachEvents(): void {
        this.wafermap.addEventListener('mousemove', this.onMouseMove);
        this.wafermap.addEventListener('mouseout', this.onMouseOut);
    }
}