import { expose } from 'comlink';
import type {
    Dimensions,
    State,
    Transform,
    TransformData,
    WaferMapMatrix,
    WaferMapTypedMatrix
} from './types';

/**
 * MatrixRenderer class is meant to be used within a Web Worker context,
 * using Comlink to facilitate communication between the main thread and the worker.
 * The MatrixRenderer class manages a matrix of dies, once an instance of MatrixRenderer is created,
 * it is exposed to the main thread using Comlink's `expose` method.
 * This setup is used in the wafer-map component to perform heavy computational duties
 */
export class MatrixRenderer {
    public values = Float64Array.from([]);
    public scaledColumnIndex = Float64Array.from([]);
    public scaledRowIndex = Float64Array.from([]);
    public columnIndexPositions = Int32Array.from([]);
    public canvas!: OffscreenCanvas;
    public context!: OffscreenCanvasRenderingContext2D;
    private state: State = {
        containerDimensions: undefined,
        dieDimensions: undefined,
        margin: undefined,
        verticalCoefficient: undefined,
        horizontalCoefficient: undefined,
        horizontalConstant: undefined,
        verticalConstant: undefined,
        labelsFontSize: undefined,
        colorScale: undefined
    };
    private transformData: TransformData = {
        transform: undefined,
        topLeftCanvasCorner: undefined,
        bottomRightCanvasCorner: undefined
    };

    public calculateHorizontalScaledIndex(columnIndex: number): number {
        return this.state.horizontalCoefficient! * columnIndex + this.state.horizontalConstant! + this.state.margin!.left;
    }

    public calculateVerticalScaledIndex(rowIndex: number): number {
        return this.state.verticalCoefficient! * rowIndex + this.state.verticalConstant! + this.state.margin!.top;
    }

    public setColumnIndexes(columnIndexes: Int32Array): void {
        if (columnIndexes.length === 0 || columnIndexes[0] === undefined) {
            return;
        }
        const scaledColumnIndex = [
            this.calculateHorizontalScaledIndex(columnIndexes[0])
        ];
        const columnPositions = [0];
        let prev = columnIndexes[0];
        for (let i = 1; i < columnIndexes.length; i++) {
            const xIndex = columnIndexes[i];
            if (xIndex && xIndex !== prev) {
                const scaledX = this.calculateHorizontalScaledIndex(
                    columnIndexes[i]!
                );
                scaledColumnIndex.push(scaledX);
                columnPositions.push(i);
                prev = xIndex;
            }
        }
        this.scaledColumnIndex = Float64Array.from(scaledColumnIndex);
        this.columnIndexPositions = Int32Array.from(columnPositions);
    }

    public setRowIndexes(rowIndexes: Int32Array): void {
        this.scaledRowIndex = new Float64Array(rowIndexes.length);
        for (let i = 0; i < rowIndexes.length; i++) {
            this.scaledRowIndex[i] = this.calculateVerticalScaledIndex(
                rowIndexes[i]!
            );
        }
    }

    public setState(state: State): void {
        this.state = state;
    }

    public setTransformData(transformData: TransformData): void {
        this.transformData = transformData;
    }

    public setCanvas(canvas: OffscreenCanvas): void {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
    }

    public scaleCanvas(): void {
        this.context.translate(this.transformData.transform!.x, this.transformData.transform!.y);
        this.context.scale(this.transformData.transform!.k, this.transformData.transform!.k);
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
        if (
            this.transformData.topLeftCanvasCorner === undefined
            || this.transformData.bottomRightCanvasCorner === undefined
        ) {
            throw new Error('Canvas corners are not set');
        }
        for (let i = 0; i < this.scaledColumnIndex.length; i++) {
            const scaledX = this.scaledColumnIndex[i]!;
            if (
                !(
                    scaledX >= this.transformData.topLeftCanvasCorner.x
                    && scaledX < this.transformData.bottomRightCanvasCorner.x
                )
            ) {
                continue;
            }

            // columnIndexPositions is used to get chunks to determine the start and end index of the column, it looks something like [0, 1, 4, 9, 12]
            // This means that the first column has a start index of 0 and an end index of 1, the second column has a start index of 1 and an end index of 4, and so on
            // scaledRowIndex is used when we reach the end of the columnIndexPositions, when columnIndexPositions is [0, 1, 4, 9, 12], scaledRowIndex is 13
            const columnEndIndex = this.columnIndexPositions[i + 1] !== undefined
                ? this.columnIndexPositions[i + 1]!
                : this.scaledRowIndex.length;
            for (
                let columnStartIndex = this.columnIndexPositions[i]!;
                columnStartIndex < columnEndIndex;
                columnStartIndex++
            ) {
                const scaledY = this.scaledRowIndex[columnStartIndex]!;
                if (
                    !(
                        scaledY >= this.transformData.topLeftCanvasCorner.y
                        && scaledY < this.transformData.bottomRightCanvasCorner.y
                    )
                ) {
                    continue;
                }
                // Fill style is temporary green for all dies, will be replaced with a color based on the value of the die in a future implementation
                this.context.fillStyle = 'Green';
                this.context.fillRect(
                    scaledX,
                    scaledY,
                    this.state.dieDimensions!.width,
                    this.state.dieDimensions!.height
                );
            }
        }
    }
}
expose(MatrixRenderer);
