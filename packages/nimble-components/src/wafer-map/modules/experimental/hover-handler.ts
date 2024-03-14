import type ColumnTable from 'arquero/dist/types/table/column-table';
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
        if (dieCoordinates === undefined) {
            this.wafermap.hoverDie = undefined;
            return;
        }
        const table = this.wafermap.columnTable.params({
            dieCoordinates
        }) as ColumnTable;

        const indices = table
            .filter(
                (
                    row: { colIndex: number, rowIndex: number },
                    params: { dieCoordinates: { x: number, y: number } }
                ) => row.colIndex === params.dieCoordinates.x
                    && row.rowIndex === params.dieCoordinates.y
            )
            .indices();

        this.wafermap.hoverDie = indices.length > 0
            ? {
                index: indices[0]!,
                x: dieCoordinates.x,
                y: dieCoordinates.y
            }
            : undefined;
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
