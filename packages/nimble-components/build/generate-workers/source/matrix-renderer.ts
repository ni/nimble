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
    public values = new Float64Array([14.24, 76.43, 44.63, 67.93, 72.71, 79.04, 26.49, 137.79, 59.82, 52.92,
        98.53, 20.83, 462.81]);
    public scaledColIndex = new Float64Array([0, 100, 100, 100, 200, 200, 200, 200, 200, 300, 300, 300, 400]);
    public scaledRowIndex = new Float64Array([200, 200, 100, 300, 200, 100, 0, 300, 400, 200, 100, 300, 200]);
    public dieDimensions: Dimensions = { width: 100, height: 100 };
    public transform: Transform = { k: 1, x: 0, y: 0 };
    public topLeftCanvasCorner: { x: number, y: number } = { x: 0, y: 0 };
    public bottomRightCanvasCorner: { x: number, y: number } = { x: 500, y: 500 };
    public colors: string[] = ['red', 'yellow', 'green', 'blue', 'purple'];
    public colorsValues = new Float64Array([50, 0, 25, 75, 100]);
    public maxCharactersOnDies: number = 6;
    public isDieLabelHidden: boolean = true;

    private readonly outsideRangeDieColor = 'rgba(218,223,236,1)';
    private readonly fontSizeFactor = 0.8;
    private fontSize = 12;

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
        this.calculateLabelsFontSize(6);
        this.colorsValues.sort((a, b) => a - b);
        this.parseDies();
    }

    public parseDies(): void {
        for (let i = 0; i < this.scaledColIndex.length; i++) {
            const currentDieValue = this.values[i]!;
            if (this.dieHasData(currentDieValue.toString()) === false) { continue; }
            if (this.isValueInRange(currentDieValue)) {
                const nearestValueIndex = this.findNearestValueIndex(currentDieValue);
                this.context.fillStyle = this.colors[nearestValueIndex]!;
            }
            else { this.context.fillStyle = this.outsideRangeDieColor; }
            const x = this.scaledColIndex[i]!;
            const y = this.scaledRowIndex[i]!;
            if (!this.isDieVisible(x, y)) { continue; }
            this.context.fillRect(x, y, this.dieDimensions.width, this.dieDimensions.height);
            if (this.isDieLabelHidden === true) { continue }
            this.addTextOnDie(x, y, i);
        }
    }

    public isValueInRange(value: number): boolean {
        return value >= this.colorsValues[0]! && value <= this.colorsValues[this.colorsValues.length - 1]!;
    }

    public findNearestValueIndex(dieValue: number): number {
        let start = 0;
        let end = this.colorsValues.length - 1;

        while (start <= end) {
            let mid = Math.floor((start + end) / 2);
            if (this.colorsValues[mid] === dieValue) return mid;
            if (this.colorsValues[mid]! < dieValue) start = mid + 1;
            else end = mid - 1;
        }

        return (this.colorsValues[start]! - dieValue) < (dieValue - this.colorsValues[start - 1]!) ? start : start - 1;
    }

    private calculateLabelsFontSize(
        maxCharacters: number
    ): void {
        this.fontSize = Math.min(
            this.dieDimensions.height,
            (this.dieDimensions.width / (Math.max(2, maxCharacters) * 0.5))
            * this.fontSizeFactor
        );
    }

    private dieHasData(dieData: string): boolean {
        return dieData !== null && dieData !== undefined && dieData !== '';
    }

    public addTextOnDie(x: number, y: number, i: number) {
        this.context.font = `${this.fontSize}px sans-serif`;
        this.context.fillStyle = 'White';

        const textX = x + this.dieDimensions.width / 2;
        const textY = y + this.dieDimensions.height / 2;

        let formattedValue = this.formatValue(this.values[i]);

        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(formattedValue, textX, textY);
    }

    public formatValue(value: number | undefined): string {
        if (value === undefined) return '';
        return parseFloat(value.toFixed(1)) + '...';
    }

    public isDieVisible(x: number, y: number): boolean {
        return x >= this.topLeftCanvasCorner.x &&
            x <= this.bottomRightCanvasCorner.x &&
            y >= this.topLeftCanvasCorner.y &&
            y <= this.bottomRightCanvasCorner.y;
    }
}
expose(MatrixRenderer);