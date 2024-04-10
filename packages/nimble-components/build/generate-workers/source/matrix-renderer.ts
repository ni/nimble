import { expose } from 'comlink';
import type { Dimensions, Transform, WaferMapMatrix, WaferMapTypedMatrix, ColorScale } from './types';

/**
 * MatrixRenderer class is meant to be used within a Web Worker context, 
 * using Comlink to facilitate communication between the main thread and the worker. 
 * The MatrixRenderer class manages a matrix of dies, once an instance of MatrixRenderer is created, 
 * it is exposed to the main thread using Comlink's `expose` method.
 * This setup is used in the wafer-map component to perform heavy computational duties
 */
export class MatrixRenderer {
    public columnIndexes = Int32Array.from([]);
    public rowIndexes = Int32Array.from([]);
    public values = Float64Array.from([]);
    public scaledColumnIndex = Float64Array.from([]);
    public scaledRowIndex = Float64Array.from([]);
    public columnIndexPositions = Int32Array.from([]);
    public canvas!: OffscreenCanvas;
    public context!: OffscreenCanvasRenderingContext2D;
    private scaleX: number = 1;
    private scaleY: number = 1;
    private baseX: number = 1;
    private baseY: number = 1;
    private dieDimensions: Dimensions = { width: 1, height: 1 };
    private transform: Transform = { k: 1, x: 0, y: 0 };
    private topLeftCanvasCorner!: { x: number; y: number; };
    private bottomRightCanvasCorner!: { x: number; y: number; };
    private readonly smallestMarginPossible: number = 20;
    private margin: { top: number; right: number; bottom: number; left: number; } = { top: this.smallestMarginPossible, right: this.smallestMarginPossible, bottom: this.smallestMarginPossible, left: this.smallestMarginPossible };
    private colorValues = Float64Array.from([]);
    private colors: string[] = [];
    private colorIndexes= Int32Array.from([]);

    public calculateScaledColumnIndex(columnIndex: number, margin: number): number{
        return this.scaleX * columnIndex + this.baseX + margin;
    }

    public calculateScaledRowIndex(columnIndex: number, margin: number): number{
        return this.scaleY * columnIndex + this.baseY + margin;
    }

    public calculateColorIndex(value: number): number{
        let index =  -1
        if (this.colorValues.length === 0 || this.colorValues[0]! > value) { return index; }
        for (let i = 0; i < this.colorValues.length; i++) {
            if (value <= this.colorValues[i]!) {
                index = i;
                break;
            }
        }
        return index;
    }

    public setColumnIndexes(columnIndexes: Int32Array): void {
        this.columnIndexes = columnIndexes;
        if (columnIndexes.length === 0 || this.columnIndexes[0] === undefined) { return; }
        const scaledColumnIndex = [this.calculateScaledColumnIndex(this.columnIndexes[0], this.margin.left)];
        const columnPositions = [0];
        let prev = this.columnIndexes[0];
        for (let i = 1; i < this.columnIndexes.length; i++) {
            const xIndex = this.columnIndexes[i];
            if (xIndex && xIndex !== prev) {
                const scaledX = this.calculateScaledColumnIndex(this.columnIndexes[i]!, this.margin.left);
                scaledColumnIndex.push(scaledX);
                columnPositions.push(i);
                prev = xIndex
            }
        }
        this.scaledColumnIndex = Float64Array.from(scaledColumnIndex);
        this.columnIndexPositions = Int32Array.from(columnPositions);
    }

    public setRowIndexes(rowIndexesBuffer: Int32Array): void {
        this.rowIndexes = rowIndexesBuffer;
        this.scaledRowIndex = new Float64Array(this.rowIndexes.length);
        for (let i = 0; i < this.rowIndexes.length; i++) {
            this.scaledRowIndex[i] = this.calculateScaledRowIndex(this.rowIndexes[i]!, this.margin.top);
        }
    }

    public setValues(valuesBuffer: Float64Array): void {
        this.values = valuesBuffer;
        this.colorIndexes = new Int32Array(this.values.length);
        for (let i = 0; i < this.values.length; i++) {
            this.colorIndexes[i] = this.calculateColorIndex(this.values[i]!);
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

    public setColorScale(colorScale: ColorScale): void {
        this.colors = colorScale.map(category => category.color);
        this.colorValues = Float64Array.from(colorScale.map(category => category.value));
    }

    public getMatrix(): WaferMapTypedMatrix {
        return {
            columnIndexes: this.columnIndexes,
            rowIndexes: this.rowIndexes,
            values: this.values
        };
    }

    public emptyMatrix(): void {
        this.columnIndexes = Int32Array.from([]);
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
        this.columnIndexes = Int32Array.from(data.columnIndexes);
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
        if (this.topLeftCanvasCorner === undefined || this.bottomRightCanvasCorner === undefined) { throw new Error('Canvas corners are not set');}
        for (let i = 0; i < this.scaledColumnIndex.length; i++) {
            const scaledX = this.scaledColumnIndex[i]!;
            if (
                !(scaledX >= this.topLeftCanvasCorner.x
                    && scaledX < this.bottomRightCanvasCorner.x)
            ) {
                continue;
            }
            const columnEndIndex = this.columnIndexPositions[i + 1] !== undefined ? this.columnIndexPositions[i + 1]! : this.scaledRowIndex.length;
            for (let columnStartIndex = this.columnIndexPositions[i]!;
                columnStartIndex < columnEndIndex; columnStartIndex++) {
                const scaledY = this.scaledRowIndex[columnStartIndex]!;
                if (
                    !(scaledY >= this.topLeftCanvasCorner.y
                        && scaledY < this.bottomRightCanvasCorner.y)
                ) {
                    continue;
                }
                this.context.fillStyle = this.colors[this.colorIndexes[columnStartIndex]!]!;
                this.context.fillRect(scaledX, scaledY, this.dieDimensions.width, this.dieDimensions.height);
            }
        }
    }
}
expose(MatrixRenderer);