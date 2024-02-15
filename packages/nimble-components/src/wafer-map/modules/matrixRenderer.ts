import * as Comlink from 'comlink';
import type { WaferMap } from '..';
import { HoverDieOpacity } from '../types';
import { workerCode } from '../workers/renderWorker';
import type { RenderWorker } from '../../../build/generate-workers/dist/esm/renderWorker';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class MatrixRenderer {
    private readonly baseMarginPercentage = 0.04;
    private _containerWidth = 0;
    private _containerHeight = 0;
    private _horizontalScale = { a: 0, b: 0 };
    private _verticalScale = { a: 0, b: 0 };
    private _invertedHorizontalScale = { a: 0, b: 0 };
    private _invertedVerticalScale = { a: 0, b: 0 };
    private _dieDimensions = { width: 0, height: 0 };
    private _margin = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    private canvasSet = false;

    private readonly workerOne!: Comlink.Remote<RenderWorker>;

    public constructor(private readonly wafermap: WaferMap) {
        const blob = new Blob([workerCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        this.workerOne = Comlink.wrap<RenderWorker>(new Worker(url));
    }

    public get containerWidth(): number {
        return this._containerWidth;
    }

    public get containerHeight(): number {
        return this._containerHeight;
    }

    public get invertedHorizontalScale(): { a: number, b: number } {
        return this._invertedHorizontalScale;
    }

    public get invertedVerticalScale(): { a: number, b: number } {
        return this._invertedVerticalScale;
    }

    public get margin(): {
        top: number,
        right: number,
        bottom: number,
        left: number
    } {
        return this._margin;
    }

    public async renderMatrix(): Promise<void> {
        await this.restoreContext();
        await this.saveContext();
        await this.clearCanvas();
        await this.scaleCanvas();
        this.prepareDies();
        await this.renderDiesFromMatrix();
        await this.renderText();
        this.renderHover();
    }

    public async rerenderMatrix(): Promise<void> {
        await this.restoreContext();
        await this.saveContext();
        await this.clearCanvas();
        await this.scaleCanvas();
        await this.renderDies();
        await this.renderText();
        this.renderHover();
    }

    public renderHover(): void {
        this.wafermap.hoverWidth = this._dieDimensions.width * this.wafermap.transform.k;
        this.wafermap.hoverHeight = this._dieDimensions.height * this.wafermap.transform.k;
        this.wafermap.hoverOpacity = this.wafermap.hoverDie === undefined
            ? HoverDieOpacity.hide
            : HoverDieOpacity.show;
        this.wafermap.hoverTransform = this.calculateHoverTransform();
    }

    public async setCanvasDimensions(
        width: number,
        height: number
    ): Promise<void> {
        if (this.canvasSet) {
            await this.workerOne.setCanvasDimensions({
                width,
                height
            });
        }
    }

    public async setCanvas(): Promise<void> {
        if (!this.canvasSet) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            const offscreenOne = this.wafermap.canvasOne.transferControlToOffscreen();
            await this.workerOne.setCanvas(
                Comlink.transfer(offscreenOne, [
                    offscreenOne as unknown as Transferable
                ])
            );
            this.canvasSet = true;
        }
    }

    private async renderDies(): Promise<void> {
        if (this.canvasSet) {
            await this.workerOne.renderDies();
        }
    }

    private async renderText(): Promise<void> {
        if (this.canvasSet) {
            await this.workerOne.renderText();
        }
    }

    private async clearCanvas(): Promise<void> {
        if (this.canvasSet) {
            await this.workerOne.clearCanvas();
        }
    }

    private calculateHoverTransform(): string {
        if (this.wafermap.hoverDie !== undefined) {
            const scaledX = this._horizontalScale.a
                + this._horizontalScale.b * this.wafermap.hoverDie.x;
            const scaledY = this._verticalScale.a
                + this._verticalScale.b * this.wafermap.hoverDie.y;
            const transformedPoint = this.wafermap.transform.apply([
                scaledX + this._margin.left,
                scaledY + this._margin.top
            ]);
            return `translate(${transformedPoint[0]}, ${transformedPoint[1]})`;
        }
        return '';
    }

    private async scaleCanvas(): Promise<void> {
        if (this.canvasSet) {
            await this.workerOne.scaleCanvas({
                transform: this.wafermap.transform
            });
        }
    }

    private async saveContext(): Promise<void> {
        if (this.canvasSet) {
            await this.workerOne.saveContext();
        }
    }

    private async restoreContext(): Promise<void> {
        if (this.canvasSet) {
            await this.workerOne.restoreContext();
        }
    }

    private prepareDies(): void {
        const canvasDimensions = {
            width: this.wafermap.canvasWidth,
            height: this.wafermap.canvasHeight
        };
        const canvasDiameter = Math.min(
            canvasDimensions.width,
            canvasDimensions.height
        );
        const canvasMargin = {
            top: (canvasDimensions.height - canvasDiameter) / 2,
            right: (canvasDimensions.width - canvasDiameter) / 2,
            bottom: (canvasDimensions.height - canvasDiameter) / 2,
            left: (canvasDimensions.width - canvasDiameter) / 2
        };
        const baseMargin = {
            top: canvasDiameter * this.baseMarginPercentage,
            right: canvasDiameter * this.baseMarginPercentage,
            bottom: canvasDiameter * this.baseMarginPercentage,
            left: canvasDiameter * this.baseMarginPercentage
        };
        this._margin = {
            top: baseMargin.top + canvasMargin.top,
            right: baseMargin.right + canvasMargin.right,
            bottom: baseMargin.bottom + canvasMargin.bottom,
            left: baseMargin.left + canvasMargin.left
        };
        const containerDimensions = {
            width:
                canvasDimensions.width - this._margin.left - this._margin.right,
            height:
                canvasDimensions.height - this._margin.top - this._margin.bottom
        };
        this._containerHeight = containerDimensions.height;
        this._containerWidth = containerDimensions.width;

        const containerDiameter = Math.min(
            containerDimensions.width,
            containerDimensions.height
        );
        let minPoint;
        let maxPoint;
        // const radius = containerDiameter / 2;
        if (
            !(
                !this.wafermap.validity.invalidGridDimensions
                && typeof this.wafermap.gridMinX === 'number'
                && typeof this.wafermap.gridMinY === 'number'
                && typeof this.wafermap.gridMaxX === 'number'
                && typeof this.wafermap.gridMaxY === 'number'
            )
        ) {
            const firstRow = this.wafermap.dieTable.get(0)!;
            minPoint = {
                x: firstRow.colIndex,
                y: firstRow?.rowIndex
            };
            maxPoint = {
                x: firstRow?.colIndex,
                y: firstRow?.rowIndex
            };

            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (
                let index = 0, length = this.wafermap.dieTable.numRows;
                index < length;
                index++
            ) {
                const tableRow = this.wafermap.dieTable.get(index)!;
                if (tableRow.colIndex < minPoint?.x) {
                    minPoint.x = tableRow.colIndex;
                }
                if (tableRow.colIndex > maxPoint.x) {
                    maxPoint.x = tableRow.colIndex;
                }
                if (tableRow.rowIndex < minPoint.y) {
                    minPoint.y = tableRow.rowIndex;
                }
                if (tableRow.rowIndex > maxPoint.y) {
                    maxPoint.y = tableRow.rowIndex;
                }
            }
        } else {
            minPoint = { x: this.wafermap.gridMinX, y: this.wafermap.gridMinY };
            maxPoint = { x: this.wafermap.gridMaxX, y: this.wafermap.gridMaxY };
        }
        const range = {
            x: minPoint.x,
            y: maxPoint.x + 1
        };
        const domain = {
            x: 0,
            y: containerDiameter
        };
        this._horizontalScale = {
            a: (range.x * domain.y - range.y * domain.x) / (range.x - range.y),
            b: (domain.x - domain.y) / (range.x - range.y)
        };
        this._invertedHorizontalScale = {
            a: -this._horizontalScale.a / this._horizontalScale.b,
            b: 1 / this._horizontalScale.b
        };
        range.x = minPoint.y - 1;
        range.y = maxPoint.y;
        domain.x = containerDiameter;
        domain.y = 0;
        this._verticalScale = {
            a: (range.x * domain.y - range.y * domain.x) / (range.x - range.y),
            b: (domain.x - domain.y) / (range.x - range.y)
        };
        this._invertedVerticalScale = {
            a: -this._verticalScale.a / this._verticalScale.b,
            b: 1 / this._verticalScale.b
        };
        this._dieDimensions = {
            width: Math.abs(this._horizontalScale.b),
            height: Math.abs(this._verticalScale.b)
        };
    }

    private async renderDiesFromMatrix(): Promise<void> {
        const transformedCanvasMinPoint = this.wafermap.transform.invert([
            0, 0
        ]);
        const transformedCanvasMaxPoint = this.wafermap.transform.invert([
            this.wafermap.canvasWidth,
            this.wafermap.canvasHeight
        ]);
        transformedCanvasMinPoint[0] -= this._dieDimensions.width;
        transformedCanvasMinPoint[1] -= this._dieDimensions.height;
        await this.workerOne.updateRenderConfig({
            margin: this._margin,
            verticalScale: this._verticalScale,
            horizontalScale: this._horizontalScale,
            dieDimensions: this._dieDimensions,
            colorCategories: this.wafermap.colorCategories,
            transform: this.wafermap.transform,
            yLimits: {
                min: transformedCanvasMinPoint[1],
                max: transformedCanvasMaxPoint[1]
            },
            xLimits: {
                min: transformedCanvasMinPoint[0],
                max: transformedCanvasMaxPoint[0]
            }
        });
        const colBuffer = this.wafermap.dieTable
            .getChild('colIndex')!
            .toArray();
        const rowBuffer = this.wafermap.dieTable
            .getChild('rowIndex')!
            .toArray();
        const valueBuffer = this.wafermap.dieTable.getChild('value')!.toArray();
        await this.workerOne.setBuffers({
            colIndex: Comlink.transfer(colBuffer, [colBuffer.buffer]),
            rowIndex: Comlink.transfer(rowBuffer, [rowBuffer.buffer]),
            value: Comlink.transfer(valueBuffer, [valueBuffer.buffer])
        });
        await this.workerOne.renderDies();
    }
}
