import type { WaferMap } from '..';
import type { WaferMapDie, HoverHandlerData } from '../types';
import type { ZoomHandlerData } from './zoom-handler';
import { ZoomHandler } from './zoom-handler';

export interface EventCoordinatorData {
    zoomHandlerData: ZoomHandlerData;
    hoverHandlerData: HoverHandlerData;
    eventCoordinatorCallbacks: EventCoordinatorCallbacks;
    wafermap: WaferMap;
}

export interface EventCoordinatorCallbacks {
    dieSelected: (die: WaferMapDie) => void;
}

/**
 * EventCoordinator deals with user interactions and events
 */
export class EventCoordinator {
    private readonly zoomHandler: ZoomHandler;

    public constructor(
        private readonly eventCoordinatorData: EventCoordinatorData
    ) {
        this.zoomHandler = new ZoomHandler(
            eventCoordinatorData.zoomHandlerData
        );

        // TODO HoverHandler - initialization

        // TODO HoverHandler -  create a hoverDie element

        this.attachEvents();
    }

    public resetZoomTransform(): void {
        this.zoomHandler.resetTransform();
    }

    public get selectedDie(): WaferMapDie | undefined {
        // TODO HoverHandler - return the last selected die when called

        return undefined;
    }

    public detachEvents(): void {
        this.eventCoordinatorData.wafermap.removeEventListener(
            'mousemove',
            this.onMouseMove
        );
        this.eventCoordinatorData.wafermap.removeEventListener(
            'mouseout',
            this.onMouseOut
        );
        this.eventCoordinatorData.wafermap.canvas.removeEventListener(
            'wheel',
            this.onWheelMove
        );
        this.zoomHandler.removeEventListener(
            'before-zoom',
            this.beforeZoom as EventListener
        );
        this.zoomHandler.removeEventListener(
            'after-zoom',
            this.afterZoom as EventListener
        );
    }

    private readonly onWheelMove = (event: Event): void => {
        event.preventDefault();
    };

    private readonly beforeZoom = (): void => {
        // TODO HoverHandler - toggle hoverDie with false
    };

    private readonly afterZoom = (): void => {
        // TODO HoverHandler - set new transfrom from event.transform
        // TODO HoverHandler - create a new hoverDie
    };

    private readonly onMouseMove = (): void => {
        // TODO HoverHandler - mousemove(e) callback
    };

    private readonly onMouseOut = (): void => {
        // TODO HoverHandler - mouseout() callback
    };

    private attachEvents(): void {
        this.eventCoordinatorData.wafermap.addEventListener(
            'mousemove',
            this.onMouseMove
        );
        this.eventCoordinatorData.wafermap.addEventListener(
            'mouseout',
            this.onMouseOut
        );
        this.eventCoordinatorData.wafermap.canvas.addEventListener(
            'wheel',
            this.onWheelMove,
            {
                passive: false
            }
        );
        this.zoomHandler.addEventListener(
            'before-zoom',
            this.beforeZoom as EventListener
        );
        this.zoomHandler.addEventListener(
            'after-zoom',
            this.afterZoom as EventListener
        );

        // Wafermap callbacks
        // TODO HoverHandler - configure the callback to be fired from HoverHandler when a new die is selected
    }
}
