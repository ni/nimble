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
    public colIndexes: Uint8Array = Uint8Array.from([]);
    public rowIndexes: Uint8Array = Uint8Array.from([]);
    public canvas!: OffscreenCanvas;
    public context!: OffscreenCanvasRenderingContext2D;
    public values = new Float32Array([]);
    public scaledColIndex = new Float32Array([]);
    public scaledRowIndex = new Float32Array([]);
    public dieDimensions: Dimensions = { width: 1, height: 1 };
    public transform: Transform = { k: 1, x: 0, y: 0 };
    public topLeftCanvasCorner: { x: number, y: number } = { x: 0, y: 0 };
    public bottomRightCanvasCorner: { x: number, y: number } = { x: 500, y: 500 };

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

    public scaleCanvas(): void {
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

    public clearCanvas(): void {
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

    public formatValue(value: number | undefined): string {
        if (value === undefined) return '';
        return parseFloat(value.toFixed(1)) + '...';
    }

    public addTextOnDie(x: number, y: number, i: number) {
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

    public isDieVisible(x: number, y: number): boolean {
        return x >= this.topLeftCanvasCorner.x &&
            x <= this.bottomRightCanvasCorner.x &&
            y >= this.topLeftCanvasCorner.y &&
            y <= this.bottomRightCanvasCorner.y;
    }
}
expose(MatrixRenderer);