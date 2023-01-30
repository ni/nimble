import type { WaferMap } from '..';
import type {WaferMapDie, EventHandlerData } from '../types';
import { ZoomHandler } from './zoom-handler';

/**
 * EventHandler deals with user interactions and events
 */
export class EventHandler {
    private readonly zoomHandler: ZoomHandler;
    
    public constructor(
        private readonly eventHandlerData:EventHandlerData,
    ) {
        
        this.zoomHandler = new ZoomHandler(eventHandlerData.zoomHandlerData);
    
        // HoverHandler - initialization

        // HoverHandler -  create a hoverDie element

    }

    public attachEvents(waferMap: WaferMap): void {
        waferMap.onmousemove = (e: MouseEvent) => {
            // HoverHandler - mousemove(e) callback
        };
        waferMap.onmouseout = () => {
            // HoverHandler - mouseout() callback
        };
        this.zoomHandler.onZoom=(event)=>{
            
            // HoverHandler - toggle hoverDie with false

            this.zoomHandler.reScale();

            // HoverHandler - set new transfrom from event.transform

            // HoverHandler - create a new hoverDie
        };

        //Wafermap callbacks
        // HoverHandler - configure the callback to be fired from HoverHandler when a new die is selected
    }

    public resetZoomTransform(): void {
        this.zoomHandler.resetTransform();
    }

    public get lastSelectedDie(): WaferMapDie | undefined {

        // HoverHandler - return the last selected die when called
        
        return undefined;
    }
}
