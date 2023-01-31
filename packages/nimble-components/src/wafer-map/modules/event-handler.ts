import type { WaferMap } from '..';
import type { WaferMapDie, HoverHandlerData } from '../types';
import type { ZoomHandlerData } from './zoom-handler';
import { ZoomHandler } from './zoom-handler';

export interface EventHandlerData {
    zoomHandlerData: ZoomHandlerData;
    hoverHandlerData: HoverHandlerData;
    eventCallbacks: EventCallbacks;
    wafermap: WaferMap;
}

export interface EventCallbacks {
    dieSelected: (die: WaferMapDie) => void;
}

/**
 * EventHandler deals with user interactions and events
 */
export class EventHandler {
    private readonly zoomHandler: ZoomHandler;

    public constructor(private readonly eventHandlerData: EventHandlerData) {
        this.zoomHandler = new ZoomHandler(eventHandlerData.zoomHandlerData);

        // TODO HoverHandler - initialization

        // TODO HoverHandler -  create a hoverDie element

        this.attachEvents(eventHandlerData.wafermap);
    }

    public resetZoomTransform(): void {
        this.zoomHandler.resetTransform();
    }

    public get selectedDie(): WaferMapDie | undefined {
        // TODO HoverHandler - return the last selected die when called

        return undefined;
    }

    private attachEvents(waferMap: WaferMap): void {
        waferMap.onmousemove = () => {
            // TODO HoverHandler - mousemove(e) callback
        };
        waferMap.onmouseout = () => {
            // TODO HoverHandler - mouseout() callback
        };
        this.zoomHandler.onBeforeZoom = () => {
            // TODO HoverHandler - toggle hoverDie with false
        };
        this.zoomHandler.onAfterZoom = () => {
            // TODO HoverHandler - set new transfrom from event.transform
            // TODO HoverHandler - create a new hoverDie
        };

        // Wafermap callbacks
        // TODO HoverHandler - configure the callback to be fired from HoverHandler when a new die is selected
    }
}
