import { zoom, ZoomTransform } from 'd3-zoom';
import type { WaferMap } from '..';
import { HoverDieOpacity, PointCoordinates, WaferMapDie, WaferMapQuadrant } from '../types';

/**
 * HoverHandler deals with user interactions and events like hovering
 */
export class HoverHandler {
    private _lastSelectedDie: WaferMapDie | undefined;

    public get lastSelectedDie(): WaferMapDie | undefined {
        return this._lastSelectedDie;
    }

    public constructor(private readonly wafermap: WaferMap) {
    }

    public mousemove(event: MouseEvent): void {
        if (this.removeMouseEvents()) {
            return;
        }

        const mousePosition: PointCoordinates = {
            x: event.offsetX,
            y: event.offsetY
        };

        if (!this.hoversOverDie(mousePosition)) {
            return;
        }

        // get original mouse position in case we are in zoom.
        const invertedPoint = this.wafermap.transform.invert([
            mousePosition.x,
            mousePosition.y
        ]);

        const dieCoordinates = this.calculateDieCoordinates({
            x: invertedPoint[0],
            y: invertedPoint[1]
        });

        const selectedDie = this.wafermap.dataManager!.getWaferMapDie(dieCoordinates);
        if (this._lastSelectedDie === selectedDie) {
            return;
        }
        this._lastSelectedDie = selectedDie;
        if (selectedDie) {
            const scaledX = this.wafermap.dataManager!.horizontalScale(dieCoordinates.x);
            const scaledY = this.wafermap.dataManager!.verticalScale(dieCoordinates.y);
            if (scaledX === undefined || scaledY === undefined) {
                return;
            }
            const transformedPoint = this.wafermap.transform.apply([
                scaledX + this.wafermap.dataManager!.margin.left,
                scaledY + this.wafermap.dataManager!.margin.top
            ]);
            this.wafermap.hoverTransform = `translate(${transformedPoint[0]}, ${transformedPoint[1]})`;

            this.showHoverDie();
        } else {
            this.hideHoverDie();
        }
    }

    public mouseout(_event: MouseEvent): void {
        if (this.removeMouseEvents()) {
            return;
        }
        this.hideHoverDie();
    }

    private calculateDieCoordinates(mousePosition: PointCoordinates): PointCoordinates {
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
        const x = xRoundFunction(this.wafermap.dataManager!.horizontalScale.invert(
            mousePosition.x - this.wafermap.dataManager!.margin.left
        ));
        const y = yRoundFunction(this.wafermap.dataManager!.verticalScale.invert(
            mousePosition.y - this.wafermap.dataManager!.margin.top
        ));
        return { x, y };
    }

    private hoversOverDie(mousePosition: PointCoordinates): boolean {
        const canvasContext = this.wafermap.canvas.getContext('2d', { willReadFrequently: true });
        if (canvasContext === null) {
            return false;
        }
        const rgba = canvasContext.getImageData(mousePosition.x, mousePosition.y, 1, 1).data;

        let rgbaSum = 0;
        for (const color of rgba) {
            rgbaSum += color;
        }
        return rgbaSum > 0;
    }

    private showHoverDie(): void {
        this.wafermap.hoverOpacity = HoverDieOpacity.opaque;
    }

    private hideHoverDie(): void {
        this.wafermap.hoverOpacity = HoverDieOpacity.transparent;
    }

    private removeMouseEvents(): boolean {
        const dieSize = this.wafermap.dataManager!.containerDimensions.width
            * this.wafermap.dataManager!.containerDimensions.height
            * (this.wafermap.transform.k || 1);
        return dieSize < 15;
    }
}