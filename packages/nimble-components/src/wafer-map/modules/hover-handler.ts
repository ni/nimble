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

    public toggleHoverDie(show: boolean, x = 0, y = 0): void {
        if (show) {
            this.rect.setAttribute('transform', `translate(${x},${y})`);
            this.rect.setAttribute('opacity', '0.7');
        } else {
            this.rect.setAttribute('opacity', '0');
            this._lastSelectedDie = undefined;
        }
    }

    public createHoverDie(): void {
        this.rect.setAttribute('opacity', '0');
        this.rect.setAttribute('pointer-events', 'none');

        if (this.dataManager) {
            this.rect.setAttribute(
                'width',
                `${
                    this.dataManager.dieDimensions.width
                    * this.zoomHandler.zoomTransform.k
                }`
            );
            this.rect.setAttribute(
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

        // get color for current mouse position to verify that mouse is hovering over a die.
        const canvasContext = this.canvas.getContext('2d');
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
            const transformedPoint = this.zoomHandler.zoomTransform.apply([
                this.dataManager.horizontalScale(x)
                    + this.dataManager.margin.left,
                this.dataManager.verticalScale(y) + this.dataManager.margin.top
            ]);
            this.toggleHoverDie(true, transformedPoint[0], transformedPoint[1]);
        } else {
            this.toggleHoverDie(false);
        }
    }

    public mouseout(): void {
        if (this.removeMouseEvents()) {
            return;
        }
        this.toggleHoverDie(false);
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
        const x = xRoundFunction(
            this.dataManager.horizontalScale.invert(
                xPosition - this.dataManager.margin.left
            )
        );
        const y = yRoundFunction(
            this.dataManager.verticalScale.invert(
                yPosition - this.dataManager.margin.top
            )
        );
        return { x, y };
    }
}
