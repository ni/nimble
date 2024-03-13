import { expose } from 'comlink';
import type { Dimensions, Transform, WaferMapMatrix, WaferMapTypedMatrix } from './types';

/**
 * MatrixRenderer class is meant to be used within a Web Worker context, 
 * using Comlink to facilitate communication between the main thread and the worker. 
 * The MatrixRenderer class manages a matrix of dies, once an instance of MatrixRenderer is created, 
 * it is exposed to the main thread using Comlink's `expose` method.
 * This setup is used in the wafer-map component to perform heavy computational duties
 */
export class MatrixRenderer {
    private colIndexes: Uint8Array = Uint8Array.from([]);
    private rowIndexes: Uint8Array = Uint8Array.from([]);
    private canvas!: OffscreenCanvas;
    private context!: OffscreenCanvasRenderingContext2D;
    private values = new Float32Array([]);
    private scaledColIndex = new Float64Array([]);
    private scaledRowIndex = new Float64Array([]);
    private dieDimensions: Dimensions = { width: 1, height: 1 };
    private transform: Transform = { k: 1, x: 0, y: 0 };
    private topLeftCanvasCorner: { x: number, y: number } = { x: 0, y: 0 };
    private bottomRightCanvasCorner: { x: number, y: number } = { x: 500, y: 500 };
    public setTopLeftCanvasCorner(topLeftCanvasCorner: { x: number, y: number }): void {
        this.topLeftCanvasCorner = topLeftCanvasCorner;
    }

    public setBottomRightCanvasCorner(bottomRightCanvasCorner: { x: number, y: number }): void {
        this.bottomRightCanvasCorner = bottomRightCanvasCorner;
    }

    public setColIndexes(colIndexes: Uint8Array): void {
        this.colIndexes = colIndexes;
    }

    public setRowIndexes(rowIndexes: Uint8Array): void {
        this.rowIndexes = rowIndexes;
    }

    public setValues(values: Float32Array): void {
        this.values = values;
    }

    public setScaledColIndex(scaledColIndex: Float64Array): void {
        this.scaledColIndex = scaledColIndex;
    }

    public setScaledRowIndex(scaledRowIndex: Float64Array): void {
        this.scaledRowIndex = scaledRowIndex;
    }
    public setDieDimensions(dieDimensions: Dimensions): void {
        this.dieDimensions = dieDimensions;
    }

    public setTransform(transform: Transform): void {
        this.transform = transform;
    }

    public setCanvas(canvas: OffscreenCanvas): void {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
    }

    public getMatrix(): WaferMapTypedMatrix {
        return {
            colIndexes: this.colIndexes,
            rowIndexes: this.rowIndexes,
            values: this.values
        };
    }

    public emptyMatrix(): void {
        this.colIndexes = Uint8Array.from([]);
        this.rowIndexes = Uint8Array.from([]);
        this.values = Float32Array.from([]);
    }

    private scaleCanvas(): void {
        this.context.translate(
            this.transform.x,
            this.transform.y
        );
        this.context.scale(
            this.transform.k,
            this.transform.k
        );
    }

    public updateMatrix(
        data: WaferMapMatrix
    ): void {
        this.colIndexes = Uint8Array.from(data.colIndexes);
        this.rowIndexes = Uint8Array.from(data.rowIndexes);
        this.values = Float32Array.from(data.values);
    }

    public setCanvasDimensions(data: Dimensions): void {
        this.canvas.width = data.width;
        this.canvas.height = data.height;
    }

    private clearCanvas(): void {
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    public drawWafer(): void {
        this.context.restore();
        this.context.save();
        this.clearCanvas();
        this.scaleCanvas();

        for (let i = 0; i < this.scaledColIndex.length; i++) {
            this.context.fillStyle = 'Blue';
            const x = this.scaledColIndex[i]!;
            const y = this.scaledRowIndex[i]!;
            if (!this.isDieVisible(x, y)) { continue; }
            this.context.fillRect(x, y, this.dieDimensions.width, this.dieDimensions.height);
            this.addTextOnDie(x, y, i);
        }
    }

    private formatValue(value: number | undefined): string {
        if (value === undefined) return '';
        return parseFloat(value.toFixed(1)) + '...';
    }

    private addTextOnDie(x: number, y: number, i: number) {
        const fontSize = Math.floor(this.dieDimensions.height * 0.35);
        this.context.font = `${fontSize}px Arial`;
        this.context.fillStyle = 'White';

        const textX = x + this.dieDimensions.width / 2;
        const textY = y + this.dieDimensions.height / 2;

        let formattedValue = this.formatValue(this.values[i]);

        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(formattedValue, textX, textY);
    }

    private isDieVisible(x: number, y: number): boolean {
        return x >= this.topLeftCanvasCorner.x &&
            x <= this.bottomRightCanvasCorner.x &&
            y >= this.topLeftCanvasCorner.y &&
            y <= this.bottomRightCanvasCorner.y;
    }
}
expose(MatrixRenderer);