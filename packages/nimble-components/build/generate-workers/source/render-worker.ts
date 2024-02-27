import { expose } from 'comlink';

export class RenderWorker {
    public worker!: number;
    public dieMatrix: Uint8Array = Uint8Array.from([]);

    public emptyMatrix(): void {
        this.dieMatrix = Uint8Array.from([]);;
    }

    public updateMatrix(
        data: Iterable<number>
    ): void {
        this.dieMatrix = Uint8Array.from(data);
    }
}
const worker = new RenderWorker();
expose(worker);