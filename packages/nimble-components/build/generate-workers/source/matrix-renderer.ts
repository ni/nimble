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
    public colIndexes: Int32Array = Int32Array.from([]);
    public rowIndexes: Int32Array = Int32Array.from([]);
    public values = new Float64Array([]);
    public scaledColIndex = new Float64Array([]);
    public scaledRowIndex = new Float64Array([]);
    public colIndexPositions: Int32Array = Int32Array.from([]);
    public canvas!: OffscreenCanvas;
    public context!: OffscreenCanvasRenderingContext2D;
    private scaleX: number = 1;
    private scaleY: number = 1;
    private baseX: number = 1;
    private baseY: number = 1;
    private dieDimensions: Dimensions = { width: 1, height: 1};
    private transform: Transform = { k: 1, x: 0, y: 0 };
    private topLeftCanvasCorner: { x: number; y: number; } = { x: 0, y: 0};
    private bottomRightCanvasCorner: { x: number; y: number; } = { x: 500, y: 500 };
    private margin: { top: number; right: number; bottom: number; left: number; } = { top: 20, right: 20, bottom: 20, left: 20};

    public setColIndexes(colIndexesBuffer: Int32Array): void {
        this.colIndexes = colIndexesBuffer;
        const scaledColIndex = [this.scaleX * this.colIndexes[0]! + this.baseX + this.margin.left];
        const colPosition = [0];
        let prev = this.colIndexes[0];
        for (let i = 1, length = this.colIndexes.length; i < length; i++) {
            const xIndex = this.colIndexes[i];
            if (xIndex && xIndex !== prev) {
                const scaledX = this.scaleX * this.colIndexes[i]! + this.baseX + this.margin.left;
                scaledColIndex.push(scaledX);
                colPosition.push(i);
                prev = xIndex
            }
        }
        this.scaledColIndex = Float64Array.from(scaledColIndex);
        this.colIndexPositions = Int32Array.from(colPosition);
    }

    public setRowIndexes(rowIndexesBuffer: Int32Array): void {
        this.rowIndexes = rowIndexesBuffer;
        this.scaledRowIndex = new Float64Array(this.rowIndexes.length);
        for (let i = 0; i < this.rowIndexes.length; i++) {
            this.scaledRowIndex[i] = this.scaleY * this.rowIndexes[i]! + this.baseY + this.margin.top;
        }
    }

    public setMargin(margin: { top: number, right: number, bottom: number, left: number }): void {
        this.margin = margin;
    }

    public setCanvasCorners(topLeft: { x: number, y: number }, bottomRight: { x: number, y: number }): void {
        this.topLeftCanvasCorner = topLeft;
        this.bottomRightCanvasCorner = bottomRight;
    }

    public setDiesDimensions(data: Dimensions): void {
        this.dieDimensions = { width: data.width, height: data.height };
    }

    public setScaling(scaleX: number, scaleY: number): void {
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }

    public setBases(baseX: number, baseY: number): void {
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

    public getMatrix(): WaferMapTypedMatrix {
        return {
            colIndexes: this.colIndexes,
            rowIndexes: this.rowIndexes,
            values: this.values
        };
    }

    public emptyMatrix(): void {
        this.colIndexes = Int32Array.from([]);
        this.rowIndexes = Int32Array.from([]);
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
        this.colIndexes = Int32Array.from(data.colIndexes);
        this.rowIndexes = Int32Array.from(data.rowIndexes);
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
        for (let i = 0; i < this.scaledColIndex.length; i++) {
            const scaledX = this.scaledColIndex[i]!;
            if (
                scaledX >= this.topLeftCanvasCorner.x
                && scaledX < this.bottomRightCanvasCorner.x
            ) {
                for (let j = this.colIndexPositions[i]!,
                    length = this.colIndexPositions[i + 1] !== undefined ? this.colIndexPositions[i + 1]! : this.scaledRowIndex.length;
                    j < length; j++) {
                    const scaledY = this.scaledRowIndex[j]!;
                    if (
                        scaledY >= this.topLeftCanvasCorner.y
                        && scaledY < this.bottomRightCanvasCorner.y
                    ) {
                        this.context.fillStyle = 'Green';
                        this.context.fillRect(scaledX, scaledY, this.dieDimensions.width, this.dieDimensions.height);
                    }
                }
            }
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