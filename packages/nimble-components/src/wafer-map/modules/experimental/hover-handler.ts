import type { WaferMap } from '../..';
import {
    PointCoordinates,
    WaferMapOriginLocation,
    WaferRequiredTypeMap
} from '../../types';

/**
 * HoverHandler deals with user interactions and events like hovering
 */
export class HoverHandler<T extends WaferRequiredTypeMap> {
    public constructor(private readonly wafermap: WaferMap<T>) {}

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
        if (!this.wafermap.isExperimentalRenderer()) {
            return;
        }
        // get original mouse position in case we are in zoom.
        const invertedPoint = this.wafermap.transform.invert([
            event.offsetX,
            event.offsetY
        ]);

        // does not work yet until data manager will parse diesTable
        const dieCoordinates = this.calculateDieCoordinates({
            x: invertedPoint[0],
            y: invertedPoint[1]
        });
        const colIndex = this.wafermap
            .diesTable!.getChild('colIndex')!
            .toArray() as Int32Array;
        const rowIndex = this.wafermap
            .diesTable!.getChild('rowIndex')!
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
    ): PointCoordinates {
        const originLocation = this.wafermap.originLocation;
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
            this.wafermap.dataManager.invertedHorizontalScale(
                mousePosition.x - this.wafermap.dataManager.margin.left
            )
        );
        const y = yRoundFunction(
            this.wafermap.dataManager.invertedVerticalScale(
                mousePosition.y - this.wafermap.dataManager.margin.top
            )
        );
        return { x, y };
    }
}
