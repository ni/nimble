import { fromArrow } from 'arquero';
import type { WaferMap } from '../..';
import { PointCoordinates, WaferMapOriginLocation } from '../../types';

/**
 * HoverHandler deals with user interactions and events like hovering
 */
export class HoverHandler {
    public constructor(private readonly wafermap: WaferMap) {}

    public mousemove(event: MouseEvent): void {
        if (this.wafermap.diesTable === undefined) {
            this.wafermap.hoverDie = undefined;
            return;
        }
        // get original mouse position in case we are in zoom.
        const invertedPoint = this.wafermap.transform.invert([
            event.offsetX,
            event.offsetY
        ]);

        // does not work yet until data manager will parse diesTable
        const dieCoordinates = this.calculateDieCoordinates(this.wafermap, {
            x: invertedPoint[0],
            y: invertedPoint[1]
        });
        const table = fromArrow(this.wafermap.diesTable);

        const indices = table.filter((row: { colIndex: number, rowIndex: number }) => row.colIndex === dieCoordinates.x && row.rowIndex === dieCoordinates.y).indices();

        this.wafermap.hoverDie = indices.length > 0 ? { index: indices[0]!, x: dieCoordinates.x, y: dieCoordinates.y } : undefined;
    }

    public mouseout(): void {
        this.wafermap.hoverDie = undefined;
    }

    private calculateDieCoordinates(
        wafermap: WaferMap,
        mousePosition: PointCoordinates
    ): PointCoordinates {
        const originLocation = wafermap.originLocation;
        const xRoundFunction = originLocation === WaferMapOriginLocation.bottomLeft
            || originLocation === WaferMapOriginLocation.topLeft
            ? Math.floor
            : Math.ceil;
        const yRoundFunction = originLocation === WaferMapOriginLocation.bottomLeft
            || originLocation === WaferMapOriginLocation.bottomRight
            ? Math.floor
            : Math.ceil;
        // go to x and y scale to get the x,y values of the die.
        const x = xRoundFunction(
            wafermap.dataManager.invertedHorizontalScale(
                mousePosition.x - wafermap.dataManager.margin.left
            )
        );
        const y = yRoundFunction(
            wafermap.dataManager.invertedVerticalScale(
                mousePosition.y - wafermap.dataManager.margin.top
            )
        );
        return { x, y };
    }
}
