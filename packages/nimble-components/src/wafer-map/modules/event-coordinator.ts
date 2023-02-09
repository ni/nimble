import type { WaferMapDie } from '../types';
import { ZoomHandler } from './zoom-handler';
import type { WaferMap } from '..';

export interface EventCoordinatorCallbacks {
    dieSelected: (die: WaferMapDie) => void;
}

/**
 * EventCoordinator deals with user interactions and events
 */
export class EventCoordinator {
    private readonly zoomHandler: ZoomHandler;

    public constructor(private readonly wafermap: WaferMap) {
        this.zoomHandler = new ZoomHandler(wafermap);

        // TODO HoverHandler - initialization

        // TODO HoverHandler -  create a hoverDie element

        this.attachEvents();
    }

    public get selectedDie(): WaferMapDie | undefined {
        // TODO HoverHandler - return the last selected die when called

        return undefined;
    }

    public detachEvents(): void {
        this.wafermap.removeEventListener('mousemove', this.onMouseMove);
        this.wafermap.removeEventListener('mouseout', this.onMouseOut);
        this.wafermap.canvas.removeEventListener('wheel', this.onWheelMove);
    }

    private readonly onWheelMove = (event: Event): void => {
        event.preventDefault();
    };

    private readonly onMouseMove = (): void => {
        // TODO HoverHandler - mousemove(e) callback
    };

    private readonly onMouseOut = (): void => {
        // TODO HoverHandler - mouseout() callback
    };

    private attachEvents(): void {
        this.wafermap.addEventListener('mousemove', this.onMouseMove);
        this.wafermap.addEventListener('mouseout', this.onMouseOut);
        this.wafermap.canvas.addEventListener('wheel', this.onWheelMove, {
            passive: false
        });

        // Wafermap callbacks
        // TODO HoverHandler - configure the callback to be fired from HoverHandler when a new die is selected
    }
}
