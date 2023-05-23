import type { WaferMap } from '..';
import { PointCoordinates, WaferMapQuadrant } from '../types';

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

        this.wafermap.hoverDie = this.wafermap.dataManager!.getWaferMapDie(dieCoordinates);
    }

    public mouseout(event: MouseEvent): void {
        const wafermap = event.target as WaferMap;
        wafermap.hoverDie = undefined;
    }

    private calculateDieCoordinates(
        wafermap: WaferMap,
        mousePosition: PointCoordinates
    ): PointCoordinates {
        const axisLocation = wafermap.quadrant;
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
            wafermap.dataManager!.invertedHorizontalScale(
                mousePosition.x - wafermap.dataManager!.margin.left
            )
        );
        const y = yRoundFunction(
            wafermap.dataManager!.invertedVerticalScale(
                mousePosition.y - wafermap.dataManager!.margin.top
            )
        );
        return { x, y };
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
