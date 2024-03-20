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
    public colIndexes: Uint32Array = Uint32Array.from([]);
    public rowIndexes: Uint32Array = Uint32Array.from([]);
    public canvas!: OffscreenCanvas;
    public context!: OffscreenCanvasRenderingContext2D;
    public values = new Float64Array([]);
    public scaledColIndex = new Float64Array([]);
    public scaledRowIndex = new Float64Array([]);
    private scaleX: number = 1;
    private scaleY: number = 1;
    private baseX: number = 1;
    private baseY: number = 1;
    public dieDimensions: Dimensions = { width: 1, height: 1 };
    public transform: Transform = { k: 1, x: 0, y: 0 };
    public topLeftCanvasCorner: { x: number, y: number } = { x: 0, y: 0 };
    public bottomRightCanvasCorner: { x: number, y: number } = { x: 500, y: 500 };

    public setScaling(scaleX: number, scaleY: number, baseX: number, baseY: number): void {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        this.baseX = baseX;
        this.baseY = baseY;
    }

    public setTransform(transform: Transform): void {
        this.transform = transform;
    }

    public setCanvas(canvas: OffscreenCanvas): void {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
    }

    private scaleIndexes(): void {
        this.scaledColIndex = new Float64Array(this.colIndexes.map((colIndex) => colIndex * this.scaleX + this.baseX));
        this.scaledRowIndex = new Float64Array(this.rowIndexes.map((rowIndex) => rowIndex * this.scaleY + this.baseY));
    }

    public getMatrix(): WaferMapTypedMatrix {
        return {
            colIndexes: this.colIndexes,
            rowIndexes: this.rowIndexes,
            values: this.values
        };
    }

    public emptyMatrix(): void {
        this.colIndexes = Uint32Array.from([]);
        this.rowIndexes = Uint32Array.from([]);
        this.values = Float64Array.from([]);
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
        console.log('updateMatrix');
        this.colIndexes = Uint32Array.from(data.colIndexes);
        this.rowIndexes = Uint32Array.from(data.rowIndexes);
        this.values = Float64Array.from(data.values);
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
        this.scaleIndexes();
        console.log(this.scaledColIndex, this.scaledRowIndex);
        for (let i = 0; i < this.scaledColIndex.length; i++) {
            // the fillStyle will be changed in a future pr
            this.context.fillStyle = 'Red';
            const x = this.scaledColIndex[i]!;
            const y = this.scaledRowIndex[i]!;
             if (!this.isDieVisible(x, y)) { continue; }
            this.context.fillRect(x, y, this.dieDimensions.width, this.dieDimensions.height);
        }
    }

    public isDieVisible(x: number, y: number): boolean {
        return x >= this.topLeftCanvasCorner.x &&
            x <= this.bottomRightCanvasCorner.x &&
            y >= this.topLeftCanvasCorner.y &&
            y <= this.bottomRightCanvasCorner.y;
    }
}
expose(MatrixRenderer);