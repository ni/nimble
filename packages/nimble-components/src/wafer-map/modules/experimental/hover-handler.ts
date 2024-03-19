import type { WaferMap } from '../..';
import { PointCoordinates, WaferMapOriginLocation } from '../../types';
import { DataManager } from './data-manager';

/**
 * HoverHandler deals with user interactions and events like hovering
 */
export class HoverHandler {
    public constructor(private readonly wafermap: WaferMap) {}

    public mousemove(event: MouseEvent): void {
        if (this.wafermap.columnTable === undefined) {
            this.wafermap.hoverDie = undefined;
            return;
        }
        // get original mouse position in case we are in zoom.
        const invertedPoint = this.wafermap.transform.invert([
            event.offsetX,
            event.offsetY
        ]);
        const dieCoordinates = this.calculateDieCoordinates({
            x: invertedPoint[0],
            y: invertedPoint[1]
        });
        const colIndex = this.wafermap.diesTable
            .getChild('colIndex')!
            .toArray() as Int32Array;
        const rowIndex = this.wafermap.diesTable
            .getChild('rowIndex')!
            .toArray() as Int32Array;

        // will replace iterating with arquero filtering after fixing errors
        for (let i = 0; i < colIndex.length; i++) {
            if (
                colIndex[i] === dieCoordinates.x
                && rowIndex[i] === dieCoordinates.y
            ) {
                this.wafermap.hoverDie = {
                    index: i,
                    x: dieCoordinates.x,
                    y: dieCoordinates.y
                };
                return;
            }
        }
        this.wafermap.hoverDie = undefined;
    }

    public mouseout(): void {
        this.wafermap.hoverDie = undefined;
    }

    private calculateDieCoordinates(
        mousePosition: PointCoordinates
    ): PointCoordinates | undefined {
        if (this.wafermap.dataManager instanceof DataManager) {
            const originLocation = this.wafermap.originLocation;
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
                this.wafermap.dataManager.horizontalScale.invert(
                    mousePosition.x - this.wafermap.dataManager.margin.left
                )
            );
            const y = yRoundFunction(
                this.wafermap.dataManager.verticalScale.invert(
                    mousePosition.y - this.wafermap.dataManager.margin.top
                )
            );
            return { x, y };
        }
        return undefined;
    }
}
