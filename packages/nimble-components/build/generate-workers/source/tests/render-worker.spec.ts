import * as Comlink from 'comlink';
import { RenderWorker } from '../render-worker';

describe('RenderWorker', () => {
    let worker: RenderWorker;

    beforeEach(() => {
        spyOn(Comlink, 'expose');
        worker = new RenderWorker();
    });

    it('emptyMatrix() should empty the dieMatrix', () => {
        worker.dieMatrix = Uint8Array.from([1, 2, 3]);
        worker.emptyMatrix();
        expect(worker.dieMatrix.length).toEqual(0);
    });

    it('updateMatrix(data: Iterable<number>) should update the dieMatrix correctly', () => {
        const testData: Iterable<number> = [4, 5, 6];
        worker.updateMatrix(testData);
        expect(worker.dieMatrix).toEqual(Uint8Array.from(testData));
    });
    
    it('should expose the worker via Comlink upon creation', () => {
        expect(Comlink.expose).toHaveBeenCalledWith(worker);
    });
});
