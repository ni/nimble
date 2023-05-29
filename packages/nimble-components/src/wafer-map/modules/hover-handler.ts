import type { WaferMap } from '..';
// import { PointCoordinates, WaferMapQuadrant } from '../types';

/**
 * HoverHandler deals with user interactions and events like hovering
 */
export class HoverHandler {
    public constructor(private readonly wafermap: WaferMap) {}

    public mousemove(): void {}

    public mouseout(_event: MouseEvent): void {
        this.wafermap.hoverDie = undefined;
    }

    private calculateDieCoordinates(): void {}

    private hoversOverDie(): void {}
}
