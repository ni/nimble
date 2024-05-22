import { expose } from 'comlink';
import type {
    Dimensions,
    RenderConfig,
    Transform,
    TransformConfig,
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
    private renderConfig: RenderConfig = {
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

    private transformConfig: TransformConfig = {
        transform: undefined,
        topLeftCanvasCorner: undefined,
        bottomRightCanvasCorner: undefined
    };

    public calculateHorizontalScaledIndex(columnIndex: number): number {
        return (
            this.renderConfig.horizontalCoefficient! * columnIndex
            + this.renderConfig.horizontalConstant!
            + this.renderConfig.margin!.left
        );
    }

    public calculateVerticalScaledIndex(rowIndex: number): number {
        return (
            this.renderConfig.verticalCoefficient! * rowIndex
            + this.renderConfig.verticalConstant!
            + this.renderConfig.margin!.top
        );
    }

    public setColumnIndexes(columnIndexes: Int32Array): void {
        if (columnIndexes.length === 0 || columnIndexes[0] === undefined) {
            return;
        }
        if (
            this.renderConfig.horizontalCoefficient === undefined
            || this.renderConfig.horizontalConstant === undefined
            || this.renderConfig.margin === undefined
        ) {
            throw new Error(
                'Horizontal coefficient, constant or margin is not set'
            );
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
        if (
            this.renderConfig.verticalCoefficient === undefined
            || this.renderConfig.verticalConstant === undefined
            || this.renderConfig.margin === undefined
        ) {
            throw new Error(
                'Vertical coefficient, constant or margin is not set'
            );
        }
        this.scaledRowIndex = new Float64Array(rowIndexes.length);
        for (let i = 0; i < rowIndexes.length; i++) {
            this.scaledRowIndex[i] = this.calculateVerticalScaledIndex(
                rowIndexes[i]!
            );
        }
    }

    public setRenderConfig(renderConfig: RenderConfig): void {
        this.renderConfig = renderConfig;
    }

    public setTransformConfig(transformData: TransformConfig): void {
        this.transformConfig = transformData;
    }

    public setCanvas(canvas: OffscreenCanvas): void {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
    }

    public scaleCanvas(): void {
        if (this.transformConfig.transform === undefined) {
            throw new Error('Transform is not set');
        }
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
        if (
            this.transformConfig.topLeftCanvasCorner === undefined
            || this.transformConfig.bottomRightCanvasCorner === undefined
        ) {
            throw new Error('Canvas corners are not set');
        }
        if (this.renderConfig.dieDimensions === undefined) {
            throw new Error('Die dimensions are not set');
        }
        for (let i = 0; i < this.scaledColumnIndex.length; i++) {
            const scaledX = this.scaledColumnIndex[i]!;
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
                        scaledY >= this.transformConfig.topLeftCanvasCorner.y
                        && scaledY < this.transformConfig.bottomRightCanvasCorner.y
                    )
                ) {
                    continue;
                }
                // Fill style is temporary green for all dies, will be replaced with a color based on the value of the die in a future implementation
                this.context.fillStyle = 'Green';
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
