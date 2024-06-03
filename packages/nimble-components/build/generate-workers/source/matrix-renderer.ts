import { expose } from 'comlink';
import type { Dimensions, RenderConfig, TransformConfig } from './types';

/**
 * MatrixRenderer class is meant to be used within a Web Worker context,
 * using Comlink to facilitate communication between the main thread and the worker.
 * The MatrixRenderer class manages a matrix of dies, once an instance of MatrixRenderer is created,
 * it is exposed to the main thread using Comlink's `expose` method.
 * This setup is used in the wafer-map component to perform heavy computational duties
 */
export class MatrixRenderer {
    public values = Float64Array.from([]);
    public scaledColumnIndices = Float64Array.from([]);
    public scaledRowIndices = Float64Array.from([]);
    public columnIndicesPositions = Int32Array.from([]);
    public colorIndices = Int32Array.from([]);
    public canvas!: OffscreenCanvas;
    public context!: OffscreenCanvasRenderingContext2D;
    private colors: string[] = [];
    private colorValues = Float64Array.from([]);
    private readonly outsideRangeDieColor = 'rgba(218,223,236,1)';
    private readonly fontSizeFactor = 0.8;
    private renderConfig: RenderConfig = {
        dieDimensions: {
            width: 0,
            height: 0
        },
        margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        verticalCoefficient: 1,
        horizontalCoefficient: 1,
        horizontalConstant: 0,
        verticalConstant: 0,
        labelsFontSize: 0,
        colorScale: []
    };

    private transformConfig: TransformConfig = {
        transform: {
            k: 1,
            x: 0,
            y: 0
        },
        topLeftCanvasCorner: {
            x: 0,
            y: 0
        },
        bottomRightCanvasCorner: {
            x: 0,
            y: 0
        }
    };

    private calculateHorizontalScaledIndices(columnIndex: number): number {
        return (
            this.renderConfig.horizontalCoefficient! * columnIndex
            + this.renderConfig.horizontalConstant!
            + this.renderConfig.margin!.left
        );
    }

    private calculateVerticalScaledIndices(rowIndex: number): number {
        return (
            this.renderConfig.verticalCoefficient! * rowIndex
            + this.renderConfig.verticalConstant!
            + this.renderConfig.margin!.top
        );
    }

    private calculateColorIndex(value: number): number {
        let index = -1;
        if (this.colorValues.length === 0 || this.colorValues[0]! >= value) {
            return index;
        }
        for (let i = 0; i < this.colorValues.length; i++) {
            if (value <= this.colorValues[i]!) {
                index = i;
                break;
            }
        }
        return index;
    }

    public setColumnIndices(columnIndices: Int32Array): void {
        if (columnIndices.length === 0 || columnIndices[0] === undefined) {
            return;
        }
        const scaledColumnIndex = [
            this.calculateHorizontalScaledIndices(columnIndices[0])
        ];
        const columnPositions = [0];
        let prev = columnIndices[0];
        for (let i = 1; i < columnIndices.length; i++) {
            const xIndex = columnIndices[i];
            if (xIndex && xIndex !== prev) {
                const scaledX = this.calculateHorizontalScaledIndices(
                    columnIndices[i]!
                );
                scaledColumnIndex.push(scaledX);
                columnPositions.push(i);
                prev = xIndex;
            }
        }
        this.scaledColumnIndices = Float64Array.from(scaledColumnIndex);
        this.columnIndicesPositions = Int32Array.from(columnPositions);
    }

    public setRowIndices(rowIndices: Int32Array): void {
        this.scaledRowIndices = new Float64Array(rowIndices.length);
        for (let i = 0; i < rowIndices.length; i++) {
            this.scaledRowIndices[i] = this.calculateVerticalScaledIndices(
                rowIndices[i]!
            );
        }
    }

    public setValues(valuesBuffer: Float64Array): void {
        this.values = valuesBuffer;
        this.colorIndices = new Int32Array(this.values.length);
        for (let i = 0; i < this.values.length; i++) {
            this.colorIndices[i] = this.calculateColorIndex(this.values[i]!);
        }
    }

    public setRenderConfig(renderConfig: RenderConfig): void {
        this.renderConfig = renderConfig;
        this.colors = renderConfig.colorScale.map(category => category.color);
        this.colorValues = Float64Array.from(
            renderConfig.colorScale.map(category => category.value)
        );
    }

    public setTransformConfig(transformData: TransformConfig): void {
        this.transformConfig = transformData;
    }

    public setCanvas(canvas: OffscreenCanvas): void {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
    }

    public scaleCanvas(): void {
        this.context.translate(
            this.transformConfig.transform.x,
            this.transformConfig.transform.y
        );
        this.context.scale(
            this.transformConfig.transform.k,
            this.transformConfig.transform.k
        );
    }

    public setCanvasDimensions(data: Dimensions): void {
        this.canvas.width = data.width;
        this.canvas.height = data.height;
    }

    public getCanvasDimensions(): Dimensions {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }

    public clearCanvas(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public drawWafer(): void {
        this.context.restore();
        this.context.save();
        this.clearCanvas();
        this.scaleCanvas();
        for (let i = 0; i < this.scaledColumnIndices.length; i++) {
            const scaledX = this.scaledColumnIndices[i]!;
            if (
                !(
                    scaledX >= this.transformConfig.topLeftCanvasCorner.x
                    && scaledX < this.transformConfig.bottomRightCanvasCorner.x
                )
            ) {
                continue;
            }

            // columnIndexPositions is used to get chunks to determine the start and end index of the column, it looks something like [0, 1, 4, 9, 12]
            // This means that the first column has a start index of 0 and an end index of 1, the second column has a start index of 1 and an end index of 4, and so on
            // scaledRowIndices is used when we reach the end of the columnIndexPositions, when columnIndexPositions is [0, 1, 4, 9, 12], scaledRowIndices is 13
            const columnEndIndex = this.columnIndicesPositions[i + 1] !== undefined
                ? this.columnIndicesPositions[i + 1]!
                : this.scaledRowIndices.length;
            for (
                let columnStartIndex = this.columnIndicesPositions[i]!;
                columnStartIndex < columnEndIndex;
                columnStartIndex++
            ) {
                const scaledY = this.scaledRowIndices[columnStartIndex]!;
                if (
                    !(
                        scaledY >= this.transformConfig.topLeftCanvasCorner.y
                        && scaledY < this.transformConfig.bottomRightCanvasCorner.y
                    )
                ) {
                    continue;
                }
                // Fill style is temporary green for all dies, will be replaced with a color based on the value of the die in a future implementation
                this.context.fillStyle = this.colors[this.colorIndices[columnStartIndex]!]
                    ?? this.outsideRangeDieColor;
                this.context.fillRect(
                    scaledX,
                    scaledY,
                    this.renderConfig.dieDimensions.width,
                    this.renderConfig.dieDimensions.height
                );
            }
        }
    }
}
expose(MatrixRenderer);
