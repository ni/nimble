import type { WaferMap } from '..';
import type { RenderingModule } from './rendering';
import type { Dimensions, WaferMapDie, WaferMapQuadrant, ZoomHandlerData, EventHandlerData } from '../types';
import { HoverHandler } from './hover-handler';
import { ZoomHandler } from './zoom-handler';

/**
 * EventHandler deals with user interactions and events
 */
export class EventHandler {
    private readonly zoomHandler: ZoomHandler;
    private readonly hoverHandler: HoverHandler;

    public constructor(
        private readonly eventHandlerData:EventHandlerData,
    ) {
        
        this.zoomHandler = new ZoomHandler(eventHandlerData.zoomHandlerData);
    
        this.hoverHandler = new HoverHandler(eventHandlerData.hoverHandlerData);

        this.hoverHandler.createHoverDie();
    }

    public attachEvents(waferMap: WaferMap): void {
        waferMap.onmousemove = (e: MouseEvent) => {
            this.hoverHandler.mousemove(e);
        };
        waferMap.onmouseout = () => {
            this.hoverHandler.mouseout();
        };
        this.zoomHandler.onZoom=(event)=>{
            this.hoverHandler.toggleHoverDie(false);
            this.zoomHandler.reScale();
            this.hoverHandler.transform=event.transform;
            this.hoverHandler.createHoverDie();
        };
    }

    public resetZoomTransform(): void {
        this.zoomHandler.resetTransform();
    }

    public get lastSelectedDie(): WaferMapDie | undefined {
        return this.hoverHandler.lastSelectedDie;
    }
}
