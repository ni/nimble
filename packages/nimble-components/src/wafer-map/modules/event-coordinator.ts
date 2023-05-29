import type { WaferMapDie } from '../types';
import type { WaferMap } from '..';
// import { ZoomHandler } from './zoom-handler';
// import { HoverHandler } from './hover-handler';

export interface EventCoordinatorCallbacks {
    dieSelected: (die: WaferMapDie) => void;
}

/**
 * EventCoordinator deals with user interactions and events
 */
export class EventCoordinator {
    public constructor(private readonly wafermap: WaferMap) {
    }

    public detachEvents(): void {
    }

    private readonly onWheelMove = (event: Event): void => {
        event.preventDefault();
    };

    private readonly onMouseMove = (): void => {
    };

    private readonly onMouseOut = (): void => {

    };

    private attachEvents(): void {}
}
