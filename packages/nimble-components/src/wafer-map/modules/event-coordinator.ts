import type { WaferMapDie } from '../types';
import { ZoomHandler } from './zoom-handler';
import type { WaferMap } from '..';
import { HoverHandler } from './hover-handler';
import { HoverHandler as ExperimentalHoverHandler } from './experimental/hover-handler';

export interface EventCoordinatorCallbacks {
    dieSelected: (die: WaferMapDie) => void;
}

/**
 * EventCoordinator deals with user interactions and events
 */
export class EventCoordinator {
    private readonly zoomHandler;
    private readonly stableHoverHandler;
    private readonly experimentalHoverHandler;
    private hoverHandler: HoverHandler | ExperimentalHoverHandler;
    public constructor(private readonly wafermap: WaferMap) {
        this.zoomHandler = new ZoomHandler(wafermap);
        this.stableHoverHandler = new HoverHandler(wafermap);
        this.experimentalHoverHandler = new ExperimentalHoverHandler(wafermap);
        this.hoverHandler = this.stableHoverHandler;
    }

    public setStrategy(): void {
        this.hoverHandler = this.wafermap.diesTable === undefined
            ? this.stableHoverHandler
            : this.experimentalHoverHandler;
    }

    public attachEvents(): void {
        this.zoomHandler.createZoomBehavior();
        this.wafermap.addEventListener('mousemove', this.onMouseMove);
        this.wafermap.addEventListener('mouseout', this.onMouseOut);
        this.wafermap.addEventListener('wheel', this.onWheelMove, {
            passive: false
        });
    }

    public detachEvents(): void {
        this.wafermap.removeEventListener('mousemove', this.onMouseMove);
        this.wafermap.removeEventListener('mouseout', this.onMouseOut);
        this.wafermap.removeEventListener('wheel', this.onWheelMove);
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
