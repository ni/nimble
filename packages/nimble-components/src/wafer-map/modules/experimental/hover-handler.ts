import type { WaferMap } from '../..';
import { PointCoordinates, WaferMapOriginLocation } from '../../types';
import { DataManager } from './data-manager';

/**
 * HoverHandler deals with user interactions and events like hovering
 */
export class HoverHandler {
    public constructor(private readonly wafermap: WaferMap) {}

    /**
     * @internal
     */
    public connect(): void {
        this.wafermap.addEventListener('mousemove', this.onMouseMove);
        this.wafermap.addEventListener('mouseout', this.onMouseOut);
    }

    /**
     * @internal
     */
    public disconnect(): void {
        this.wafermap.removeEventListener('mousemove', this.onMouseMove);
        this.wafermap.removeEventListener('mouseout', this.onMouseOut);
    }

    /**
     * @internal
     * keep public for testing until data manager refactor
     */
    public readonly onMouseMove = (event: MouseEvent): void => {
        if (this.wafermap.diesTable === undefined) {
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
    };

    private readonly onMouseOut = (_event: MouseEvent): void => {
        this.wafermap.hoverDie = undefined;
    };

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
