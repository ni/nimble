import type { WaferMap } from '..';
import { PointCoordinates, WaferMapOriginLocation } from '../types';
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

    private readonly onMouseMove = (event: MouseEvent): void => {
        if (this.wafermap.diesTable !== undefined) {
            return;
        }
        const mousePosition: PointCoordinates = {
            x: event.offsetX,
            y: event.offsetY
        };

        if (!this.hoversOverDie(this.wafermap, mousePosition)) {
            this.wafermap.hoverDie = undefined;
            return;
        }
        // get original mouse position in case we are in zoom.
        const invertedPoint = this.wafermap.transform.invert([
            mousePosition.x,
            mousePosition.y
        ]);

        const dieCoordinates = this.calculateDieCoordinates(this.wafermap, {
            x: invertedPoint[0],
            y: invertedPoint[1]
        });
        if (dieCoordinates === undefined) {
            this.wafermap.hoverDie = undefined;
            return;
        }

        if (this.wafermap.dataManager instanceof DataManager) {
            this.wafermap.hoverDie = this.wafermap.dataManager.getWaferMapDie(dieCoordinates);
        }
    };

    private readonly onMouseOut = (_event: MouseEvent): void => {
        this.wafermap.hoverDie = undefined;
    };

    private calculateDieCoordinates(
        wafermap: WaferMap,
        mousePosition: PointCoordinates
    ): PointCoordinates | undefined {
        if (wafermap.dataManager instanceof DataManager) {
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
        return undefined;
    }

    private hoversOverDie(
        wafermap: WaferMap,
        mousePosition: PointCoordinates
    ): boolean {
        const rgba = wafermap.canvasContext.getImageData(
            mousePosition.x,
            mousePosition.y,
            1,
            1
        ).data;
        let rgbaSum = 0;
        for (const color of rgba) {
            rgbaSum += color;
        }
        return rgbaSum > 0;
    }
}
