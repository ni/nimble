import { expose } from 'comlink';

/**
 * MatrixRenderer class is meant to be used within a Web Worker context, 
 * using Comlink to facilitate communication between the main thread and the worker. 
 * The MatrixRenderer class manages a matrix of dies, once an instance of MatrixRenderer is created, 
 * it is exposed to the main thread using Comlink's `expose` method.
 * This setup is used in the wafer-map component to perform heavy computational duties
 */
export class MatrixRenderer {
    public worker!: number;
    public dieMatrix: Uint8Array = Uint8Array.from([]);

    public constructor() {
    }

    public emptyMatrix(): void {
        this.dieMatrix = Uint8Array.from([]);;
    }

    public updateMatrix(
        data: Iterable<number>
    ): void {
        this.dieMatrix = Uint8Array.from(data);
    }
}
expose(MatrixRenderer);