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
    private values = new Float32Array([
        14.24, 76.43, 44.63, 67.93, 72.71, 79.04, 26.49, 37.79, 59.82, 52.92,
        98.53, 20.83, 62.81
    ]);
    private scaledColIndex = new Float64Array([0, 100, 100, 100, 200, 200, 200, 200, 200, 300, 300, 300, 400]);
    private scaledRowIndex = new Float64Array([200, 200, 100, 300, 200, 100, 0, 300, 400, 200, 100, 300, 200]);

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

    public scaleCanvas(data: { transform: Transform }): void {
        this.context.translate(
            data.transform.x,
            data.transform.y
        );
        this.context.scale(
            data.transform.k,
            data.transform.k
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

    public drawWafer(transform: Transform, dieDimensions: Dimensions): void {

        console.log(transform);

        this.context.restore();

        this.context.save();

        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        this.scaleCanvas({ transform });

        this.context.translate(
            transform.x,
            transform.y
        );

        this.context.scale(
            transform.k,
            transform.k
        );

        for (let i = 0; i < this.scaledColIndex.length; i++) {
            this.context.fillStyle = 'Blue';

            const x = this.scaledColIndex[i]!;
            const y = this.scaledRowIndex[i]!;
            const width = dieDimensions.width;
            const height = dieDimensions.height;
            this.context.fillRect(x, y, width, height);

            const fontSize = Math.floor(height * 0.35);
            this.context.font = `${fontSize}px Arial`;
            this.context.fillStyle = 'White';

            // Calculate the position to center the text in the rectangle
            const textX = x + width / 2;
            let textY = y + height / 2;

            // Check if the value has more than one decimal place
            let formattedValue = parseFloat(this.values[i]!.toFixed(1)) + '...';

            // Adjust text alignment to center
            this.context.textAlign = 'center';
            this.context.textBaseline = 'middle';

            // Draw the formatted value in the center of the rectangle
            this.context.fillText(formattedValue, textX, textY);
        }
        console.log(this);
    }
}
expose(MatrixRenderer);