import type { WaferMap } from '..';
import {
    PointCoordinates,
    WaferMapDie,
    WaferMapOriginLocation
} from '../types';

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

        const dieCoordinates = this.calculateDieCoordinates(this.wafermap, {
            x: invertedPoint[0],
            y: invertedPoint[1]
        });

        this.wafermap.hoverDie = this.getWaferMapDie(dieCoordinates);
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
            ? Math.ceil
            : Math.floor;
        // go to x and y scale to get the x,y values of the die.
        const x = xRoundFunction(
            wafermap.matrixRenderer.invertedHorizontalScale.a
                + wafermap.matrixRenderer.invertedHorizontalScale.b
                    * (mousePosition.x - wafermap.matrixRenderer.margin.left)
        );
        const y = yRoundFunction(
            wafermap.matrixRenderer.invertedVerticalScale.a
                + wafermap.matrixRenderer.invertedVerticalScale.b
                    * (mousePosition.y - wafermap.matrixRenderer.margin.top)
        );
        return { x, y };
    }

    private getWaferMapDie(
        dieCoordinates: PointCoordinates
    ): WaferMapDie | undefined {
        const colBuffer = this.wafermap.dieTable
            .getChild('colIndex')!
            .toArray();
        const rowBuffer = this.wafermap.dieTable
            .getChild('rowIndex')!
            .toArray();
        const colIndex = colBuffer.indexOf(dieCoordinates.x);
        if (colIndex === -1) {
            return undefined;
        }
        for (
            let index = colIndex;
            dieCoordinates.x === colBuffer[index]!;
            index++
        ) {
            const rowIndex = rowBuffer[index]!;
            if (rowIndex === dieCoordinates.y) {
                const row = this.wafermap.dieTable.get(index);
                return {
                    x: row!.colIndex,
                    y: row!.rowIndex,
                    value: `${row!.value}`
                };
            }
        }
        return undefined;
    }
}
