import type { WaferMap } from '..';
import type { PointCoordinates } from '../types';
import { WaferMapQuadrant } from '../types';

/**
 * HoverHandler deals with user interactions and events like hovering
 */
export class HoverHandler {
    public constructor(private readonly wafermap: WaferMap) {}

    public mousemove(event: MouseEvent): void {
        const mousePosition: PointCoordinates = {
            x: event.offsetX,
            y: event.offsetY
        };

        // get original mouse position in case we are in zoom.
        const invertedPoint = this.wafermap.transform.invert([
            mousePosition.x,
            mousePosition.y
        ]);

        const dieCoordinates = this.calculateDieCoordinates({
            x: invertedPoint[0],
            y: invertedPoint[1]
        });

        this.wafermap.hoverDie = this.wafermap.dataManager!.getWaferMapDie(dieCoordinates);
    }

    public mouseout(_event: MouseEvent): void {
        this.wafermap.hoverDie = undefined;
    }

    private calculateDieCoordinates(
        mousePosition: PointCoordinates
    ): PointCoordinates {
        const axisLocation = this.wafermap.quadrant;
        const xRoundFunction = axisLocation === WaferMapQuadrant.bottomLeft
            || axisLocation === WaferMapQuadrant.topLeft
            ? Math.floor
            : Math.ceil;
        const yRoundFunction = axisLocation === WaferMapQuadrant.topLeft
            || axisLocation === WaferMapQuadrant.topRight
            ? Math.floor
            : Math.ceil;
        // go to x and y scale to get the x,y values of the die.
        const x = xRoundFunction(
            this.wafermap.dataManager!.invertedHorizontalScale(
                mousePosition.x - this.wafermap.dataManager!.margin.left
            )
        );
        const y = yRoundFunction(
            this.wafermap.dataManager!.invertedVerticalScale(
                mousePosition.y - this.wafermap.dataManager!.margin.top
            )
        );
        return { x, y };
    }
}
