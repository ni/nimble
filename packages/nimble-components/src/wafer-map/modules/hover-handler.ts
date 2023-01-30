import { ScaleBand, scaleQuantile, ScaleQuantile, ScaleQuantize, scaleQuantize } from 'd3-scale';
import type { WaferMap } from '..';
import { WaferMapDie, WaferMapQuadrant } from '../types';
import type { DataManager } from './data-manager';
import type { ZoomHandler } from './zoom-handler';

/**
 * HoverHandler deals with user interactions and events like hovering
 */
export class HoverHandler {
    private _lastSelectedDie: WaferMapDie | undefined;

    public get lastSelectedDie(): WaferMapDie | undefined {
        return this._lastSelectedDie;
    }

    public constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly rect: HTMLElement,
        private readonly zoomHandler: ZoomHandler,
        private readonly dataManager: DataManager,
        private readonly quadrant: WaferMapQuadrant
    ) {}

    public toggleHoverDie(hoverDie: HTMLElement, show: boolean, x = 0, y = 0): void {
        if (show) {
            hoverDie.setAttribute('transform', `translate(${x},${y})`);
            hoverDie.style.opacity = '1';
            hoverDie.style.outlineWidth = '2px';
        } else {
            hoverDie.style.opacity = '0';
            hoverDie.style.outlineWidth = '0px';
            this._lastSelectedDie = undefined;
        }
    }

    public createHoverDie(hoverDie: HTMLElement): void {
        hoverDie.style.opacity = '0';
        hoverDie.style.outlineWidth = '0px';
        hoverDie.setAttribute('pointer-events', 'none');

        if (this.dataManager) {
            hoverDie.setAttribute(
                'width',
                `${
                    this.dataManager.dieDimensions.width
                    * this.zoomHandler.zoomTransform.k
                }`
            );
            hoverDie.setAttribute(
                'height',
                `${
                    this.dataManager.dieDimensions.height
                    * this.zoomHandler.zoomTransform.k
                }`
            );
        }
    }

    public mousemove(event: MouseEvent): void {
        if (this.removeMouseEvents()) {
            return;
        }

        // Get mouse position
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        // debugger;
        // get color for current mouse position to verify that mouse is hovering over a die.
        const canvasContext = (event.target as WaferMap).canvas.getContext('2d', { willReadFrequently: true });
        if (canvasContext === null) {
            return;
        }

        const rgbSum = this.getRGBSum(canvasContext, mouseX, mouseY);
        if (rgbSum <= 0) {
            return;
        }

        // get original mouse position in case we are in zoom.
        const invertedPoint = this.zoomHandler.zoomTransform.invert([
            mouseX,
            mouseY
        ]);
        const { x, y } = this.calculateDiePositionNumbers(
            invertedPoint[0],
            invertedPoint[1]
        );

        // find die by x and y.
        const selectedDie = this.dataManager.getWaferMapDie(x, y);
        if (this._lastSelectedDie === selectedDie) {
            return;
        }
        this._lastSelectedDie = selectedDie;
        if (selectedDie) {
            const scaledX = this.dataManager.horizontalScale(x);
            const scaledY = this.dataManager.verticalScale(y);
            if (scaledX === undefined || scaledY === undefined) {
                return;
            }
            const transformedPoint = this.zoomHandler.zoomTransform.apply([
                scaledX + this.dataManager.margin.left,
                scaledY + this.dataManager.margin.top
            ]);
            this.toggleHoverDie((event.target as WaferMap).rect, true, transformedPoint[0], transformedPoint[1]);
        } else {
            this.toggleHoverDie((event.target as WaferMap).rect, false);
        }
    }

    public mouseout(event: MouseEvent): void {
        if (this.removeMouseEvents()) {
            return;
        }
        this.toggleHoverDie((event.target as WaferMap).rect, false);
    }

    private getRGBSum(
        canvasContext: CanvasRenderingContext2D,
        mouseX: number,
        mouseY: number
    ): number {
        const col = canvasContext.getImageData(mouseX, mouseY, 1, 1).data;
        // if sum of rgb==0 then not hovering on die
        let rgbSum = 0;
        if (col[0]) {
            rgbSum += col[0];
        }
        if (col[1]) {
            rgbSum += col[1];
        }
        if (col[2]) {
            rgbSum += col[2];
        }
        return rgbSum;
    }

    private removeMouseEvents(): boolean {
        const dieSize = this.dataManager.containerDimensions.width
            * this.dataManager.containerDimensions.height
            * (this.zoomHandler.zoomTransform.k || 1);
        return dieSize < 15;
    }

    private calculateDiePositionNumbers(
        xPosition: number,
        yPosition: number
    ): { x: number, y: number } {
        const axisLocation = this.quadrant;
        const xRoundFunction = axisLocation === WaferMapQuadrant.bottomLeft
            || axisLocation === WaferMapQuadrant.topLeft
            ? Math.floor
            : Math.ceil;
        const yRoundFunction = axisLocation === WaferMapQuadrant.topLeft
            || axisLocation === WaferMapQuadrant.topRight
            ? Math.floor
            : Math.ceil;
        // go to x and y scale to get the x,y values of the die.
        const x = xRoundFunction(this.scaleBandInvert(this.dataManager.horizontalScale)(
            xPosition - this.dataManager.margin.left
        ));
        const y = yRoundFunction(this.scaleBandInvert(this.dataManager.verticalScale)(
            yPosition - this.dataManager.margin.top
        ));
        return { x, y };
    }

    private scaleBandInvert(scale: ScaleBand<number>): ScaleQuantile<number, number> {
        const domain = scale.domain();
        const range = scale.range();
        if (range[0] > range[1]) {
            domain.reverse();
        }
        return scaleQuantile().domain(range).range(domain);
    }
}
