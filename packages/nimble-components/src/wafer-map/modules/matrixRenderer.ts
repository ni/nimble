import type { WaferMap } from '..';
import { HoverDieOpacity } from '../types';
import { RenderWorker } from './renderWorker';

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
    private matrixSent: { [key: number]: boolean } = {};

    private readonly workerCode = `
    ${RenderWorker.toString()}
    const renderWorker = new RenderWorker();
    self.onmessage = function(e) {
        if (renderWorker[e.data.method] !== undefined) {
            renderWorker[e.data.method](e.data);
        } else {
            console.log('unknown method: ' + e.data.method);
        }
    };`;

    private readonly worker: Worker;

    public constructor(private readonly wafermap: WaferMap) {
        const blob = new Blob([this.workerCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        this.worker = new Worker(url);
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

    public prepareDies(): void {
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
            width: canvasDimensions.width - this._margin.left - this._margin.right,
            height: canvasDimensions.height - this._margin.top - this._margin.bottom
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
        if (!(!this.wafermap.validity.invalidGridDimensions
            && typeof this.wafermap.gridMinX === 'number'
            && typeof this.wafermap.gridMinY === 'number'
            && typeof this.wafermap.gridMaxX === 'number'
            && typeof this.wafermap.gridMaxY === 'number')) {
            minPoint = { x: this.wafermap.dieMatrix[0]!.xIndex, y: this.wafermap.dieMatrix[0]!.yIndexes[0]! };
            maxPoint = { x: this.wafermap.dieMatrix[0]!.xIndex, y: this.wafermap.dieMatrix[0]!.yIndexes[0]! };

            for (const dieRow of this.wafermap.dieMatrix) {
                if (dieRow.xIndex < minPoint.x) {
                    minPoint.x = dieRow.xIndex;
                }
                if (dieRow.xIndex > maxPoint.x) {
                    maxPoint.x = dieRow.xIndex;
                }
                // eslint-disable-next-line @typescript-eslint/prefer-for-of
                for (let index = 0; index < dieRow.yIndexes.length; index++) {
                    const y = dieRow.yIndexes[index]!;
                    if (y < minPoint.y) {
                        minPoint.y = y;
                    }
                    if (y > maxPoint.y) {
                        maxPoint.y = y;
                    }
                }
            }
        } else {
            minPoint = { x: this.wafermap.gridMinX, y: this.wafermap.gridMinY };
            maxPoint = { x: this.wafermap.gridMaxX, y: this.wafermap.gridMaxY };
        }
        const range = {
            x: minPoint.x,
            y: (maxPoint.x + 1)
        };
        const domain = {
            x: 0,
            y: containerDiameter
        };
        this._horizontalScale = {
            a: (range.x * domain.y - range.y * domain.x)
                / (range.x - range.y),
            b: (domain.x - domain.y)
                / (range.x - range.y)
        };
        this._invertedHorizontalScale = {
            a: -this._horizontalScale.a / this._horizontalScale.b,
            b: 1 / this._horizontalScale.b
        };
        range.x = (minPoint.y - 1);
        range.y = maxPoint.y;
        domain.x = containerDiameter;
        domain.y = 0;
        this._verticalScale = {
            a: (range.x * domain.y - range.y * domain.x)
                / (range.x - range.y),
            b: (domain.x - domain.y)
                / (range.x - range.y)
        };
        this._invertedVerticalScale = {
            a: -this._verticalScale.a / this._verticalScale.b,
            b: 1 / this._verticalScale.b
        };
        this._dieDimensions = {
            width: Math.abs(this._horizontalScale.b),
            height: Math.abs(this._verticalScale.b)
        };
        this.renderMatrix();
    }

    public renderMatrix(): void {
        this.restoreContext();
        this.saveContext();
        this.clearCanvas();
        this.scaleCanvas();
        this.renderDiesFromMatrix();
        this.renderHover();
    }

    public renderHover(): void {
        this.wafermap.hoverWidth = this._dieDimensions.width
            * this.wafermap.transform.k;
        this.wafermap.hoverHeight = this._dieDimensions.height
            * this.wafermap.transform.k;
        this.wafermap.hoverOpacity = this.wafermap.hoverDie === undefined
            ? HoverDieOpacity.hide
            : HoverDieOpacity.show;
        this.wafermap.hoverTransform = this.calculateHoverTransform();
    }

    public setCanvasDimensions(width: number, height: number): void {
        if (this.canvasSet) {
            this.worker.postMessage(
                {
                    method: 'setCanvasDimensions',
                    width,
                    height
                }
            );
        }
    }

    public setCanvas(): void {
        if (!this.canvasSet) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
            const offscreen = this.wafermap.canvas.transferControlToOffscreen();
            this.worker.postMessage(
                {
                    method: 'setCanvas',
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    canvas: offscreen
                },
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                [offscreen]
            );
            this.canvasSet = true;
        }
    }

    private clearCanvas(): void {
        if (this.canvasSet) {
            this.worker.postMessage(
                {
                    method: 'clearCanvas',
                }
            );
        }
    }

    private calculateHoverTransform(): string {
        if (this.wafermap.hoverDie !== undefined) {
            const scaledX = this._horizontalScale.a + this._horizontalScale.b * this.wafermap.hoverDie.x;
            const scaledY = this._verticalScale.a + this._verticalScale.b * this.wafermap.hoverDie.y;
            const transformedPoint = this.wafermap.transform.apply([
                scaledX + this._margin.left,
                scaledY + this._margin.top
            ]);
            return `translate(${transformedPoint[0]}, ${transformedPoint[1]})`;
        }
        return '';
    }

    private scaleCanvas(): void {
        if (this.canvasSet) {
            this.worker.postMessage(
                {
                    method: 'scaleCanvas',
                    transform: this.wafermap.transform
                }
            );
        }
    }

    private saveContext(): void {
        if (this.canvasSet) {
            this.worker.postMessage(
                {
                    method: 'saveContext'
                }
            );
        }
    }

    private restoreContext(): void {
        if (this.canvasSet) {
            this.worker.postMessage(
                {
                    method: 'restoreContext'
                }
            );
        }
    }

    private renderDiesFromMatrix(): void {
        const transformedCanvasMinPoint = this.wafermap.transform.invert([
            0, 0
        ]);
        const transformedCanvasMaxPoint = this.wafermap.transform.invert([
            this.wafermap.canvasWidth,
            this.wafermap.canvasHeight
        ]);
        transformedCanvasMinPoint[0] -= this._dieDimensions.width;
        transformedCanvasMinPoint[1] -= this._dieDimensions.height;
        this.worker.postMessage(
            {
                method: 'updateRenderConfig',
                margin: this._margin,
                verticalScale: this._verticalScale,
                dieDimensions: this._dieDimensions,
                colorCategories: this.wafermap.colorCategories,
                transform: this.wafermap.transform,
                limits: {
                    min: transformedCanvasMinPoint[1],
                    max: transformedCanvasMaxPoint[1]
                }
            }
        );
        const dieMatrix = this.wafermap.dieMatrix;
        for (const diesRow of dieMatrix) {
            const scaledX = this._horizontalScale.a + this._horizontalScale.b * diesRow.xIndex + this._margin.right;
            if (
                scaledX >= transformedCanvasMinPoint[0]
                && scaledX < transformedCanvasMaxPoint[0]
            ) {
                const yIndexes = new Int32Array(diesRow.yIndexes.length);
                yIndexes.set(diesRow.yIndexes);
                const values = new Float32Array(diesRow.values.length);
                values.set(diesRow.values);
                if (this.matrixSent[diesRow.xIndex] === undefined) {
                    this.worker.postMessage(
                        {
                            method: 'render',
                            xIndex: diesRow.xIndex,
                            scaledX,
                            yBuffer: yIndexes,
                            valueBuffer: values
                        },
                        [yIndexes.buffer, values.buffer]
                    );
                    this.matrixSent[diesRow.xIndex] = true;
                } else {
                    this.worker.postMessage(
                        {
                            method: 'render',
                            xIndex: diesRow.xIndex,
                            scaledX,
                        },
                    );
                }
            }
        }
    }
}