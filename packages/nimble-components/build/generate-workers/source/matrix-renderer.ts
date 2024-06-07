/* eslint-disable @typescript-eslint/member-ordering */
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
        gridMinX: 0,
        gridMaxX: 0,
        gridMinY: 0,
        gridMaxY: 0,
        labelsFontSize: 0,
        colorScale: [],
        dieLabelsSuffix: '',
        maxCharacters: 0
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

    private isDieInGrid(x: number, y: number): boolean {
        return (
            x >= this.renderConfig.gridMinX
            && x <= this.renderConfig.gridMaxX
            && y >= this.renderConfig.gridMinY
            && y <= this.renderConfig.gridMaxY
        );
    }

    private calculateHorizontalScaledIndices(columnIndex: number): number {
        return (
            this.renderConfig.horizontalCoefficient * columnIndex
            + this.renderConfig.horizontalConstant
            + this.renderConfig.margin.left
        );
    }

    private calculateVerticalScaledIndices(rowIndex: number): number {
        return (
            this.renderConfig.verticalCoefficient * rowIndex
            + this.renderConfig.verticalConstant
            + this.renderConfig.margin.top
        );
    }

    private findColorIndex(value: number): number {
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

    public setMatrixData(
        columnIndices: Int32Array,
        rowIndices: Int32Array,
        valuesBuffer: Float64Array
    ): void {
        const scaledColumnIndex = [];
        const columnPositions = [];
        const scaledRowIndices = [];
        const values = [];
        const colorIndices = [];
        let prevXIndex;
        let dieCount = 0;
        for (let i = 0; i < columnIndices.length; i++) {
            const xIndex = columnIndices[i]!;
            const yIndex = rowIndices[i]!;
            if (this.isDieInGrid(xIndex, yIndex)) {
                if (xIndex !== prevXIndex) {
                    scaledColumnIndex.push(
                        this.calculateHorizontalScaledIndices(xIndex)
                    );
                    columnPositions.push(dieCount);
                    prevXIndex = xIndex;
                }
                scaledRowIndices.push(
                    this.calculateVerticalScaledIndices(yIndex)
                );
                const value = valuesBuffer[i]!;
                values.push(value);
                colorIndices.push(this.findColorIndex(value));
                dieCount++;
            }
        }
        this.scaledColumnIndices = Float64Array.from(scaledColumnIndex);
        this.columnIndicesPositions = Int32Array.from(columnPositions);
        this.scaledRowIndices = Float64Array.from(scaledRowIndices);
        this.values = Float64Array.from(values);
        this.colorIndices = Int32Array.from(colorIndices);
    }

    public setRenderConfig(renderConfig: RenderConfig): void {
        this.renderConfig = renderConfig;
        this.colors = renderConfig.colorScale.map(marker => marker.color);
        this.colorValues = Float64Array.from(
            renderConfig.colorScale.map(marker => marker.value)
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

    public drawText(): void {
        this.context.font = `${this.renderConfig.labelsFontSize.toString()}px sans-serif`;
        this.context.fillStyle = '#ffffff';
        this.context.textAlign = 'center';
        this.context.lineCap = 'butt';
        const approximateTextHeight = this.context.measureText('M');

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
                let label = `${this.values[columnStartIndex]}${this.renderConfig.dieLabelsSuffix}`;
                if (label.length >= this.renderConfig.maxCharacters) {
                    label = `${label.substring(0, this.renderConfig.maxCharacters)}…`;
                }
                this.context.fillText(
                    label,
                    scaledX + this.renderConfig.dieDimensions.width / 2,
                    scaledY
                        + this.renderConfig.dieDimensions.height / 2
                        + approximateTextHeight.width / 2,
                    this.renderConfig.dieDimensions.width * this.fontSizeFactor
                );
            }
        }
    }
}
expose(MatrixRenderer);
