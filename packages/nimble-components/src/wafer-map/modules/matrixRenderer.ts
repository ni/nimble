import type { WaferMap } from '..';
import { RenderWorker } from './renderWorker';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class MatrixRenderer {
    private readonly baseMarginPercentage = 0.04;
    private _containerWidth = 0;
    private _containerHeight = 0;

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

    public renderMatrix(): void {
        if (!this.canvasSet) {
            this.setCanvas();
            this.canvasSet = true;
        }
        this.saveContext();
        this.clearCanvas();
        this.scaleCanvas();
        this.renderDiesFromMatrix();
        this.restoreContext();
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

    private setCanvas(): void {
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
        const margin = {
            top: baseMargin.top + canvasMargin.top,
            right: baseMargin.right + canvasMargin.right,
            bottom: baseMargin.bottom + canvasMargin.bottom,
            left: baseMargin.left + canvasMargin.left
        };
        const containerDimensions = {
            width: canvasDimensions.width - margin.left - margin.right,
            height: canvasDimensions.height - margin.top - margin.bottom
        };
        this._containerHeight = containerDimensions.height;
        this._containerWidth = containerDimensions.width;

        const containerDiameter = Math.min(
            containerDimensions.width,
            containerDimensions.height
        );
        // const radius = containerDiameter / 2;
        if (!(!this.wafermap.validity.invalidGridDimensions
            && typeof this.wafermap.gridMinX === 'number'
            && typeof this.wafermap.gridMinY === 'number'
            && typeof this.wafermap.gridMaxX === 'number'
            && typeof this.wafermap.gridMaxY === 'number')) {
            return;
        }
        const range = {
            x: this.wafermap.gridMinX,
            y: (this.wafermap.gridMaxX + 1)
        };
        const domain = {
            x: 0,
            y: containerDiameter
        };
        const horizontalScale = {
            a: (range.x * domain.y - range.y * domain.x)
                / (range.x - range.y),
            b: (domain.x - domain.y)
                / (range.x - range.y)
        };
        range.x = (this.wafermap.gridMinY - 1);
        range.y = this.wafermap.gridMaxY;
        domain.x = containerDiameter;
        domain.y = 0;
        const verticalScale = {
            a: (range.x * domain.y - range.y * domain.x)
                / (range.x - range.y),
            b: (domain.x - domain.y)
                / (range.x - range.y)
        };
        const dieDimensions = {
            width: Math.abs(horizontalScale.b),
            height: Math.abs(verticalScale.b)
        };
        const transformedCanvasMinPoint = this.wafermap.transform.invert([
            0, 0
        ]);
        const transformedCanvasMaxPoint = this.wafermap.transform.invert([
            this.wafermap.canvas.width,
            this.wafermap.canvas.height
        ]);
        transformedCanvasMinPoint[0] -= dieDimensions.width;
        transformedCanvasMinPoint[1] -= dieDimensions.height;
        this.worker.postMessage(
            {
                method: 'updateRenderConfig',
                margin,
                verticalScale,
                dieDimensions,
                limits: {
                    min: transformedCanvasMinPoint[1],
                    max: transformedCanvasMaxPoint[1]
                }
            }
        );
        const dieMatrix = this.wafermap.dieMatrix;
        for (const diesRow of dieMatrix) {
            const scaledX = horizontalScale.a + horizontalScale.b * diesRow.xIndex + margin.right;
            if (
                scaledX >= transformedCanvasMinPoint[0]
                && scaledX < transformedCanvasMaxPoint[0]
            ) {
                const yIndexes = diesRow.yIndexes;
                if (this.matrixSent[diesRow.xIndex] === undefined) {
                    this.worker.postMessage(
                        {
                            method: 'render',
                            xIndex: diesRow.xIndex,
                            scaledX,
                            buffer: yIndexes,
                        },
                        [yIndexes.buffer]
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