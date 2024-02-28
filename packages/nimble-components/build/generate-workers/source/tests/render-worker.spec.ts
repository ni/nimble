import { RenderWorker } from '../render-worker';

describe('RenderWorker', () => {
    let worker: RenderWorker;

    beforeEach(() => {
        worker = new RenderWorker();
    });

    it('emptyMatrix should empty the dieMatrix', () => {
        worker.dieMatrix = Uint8Array.from([1, 2, 3]);
        worker.emptyMatrix();
        expect(worker.dieMatrix.length).toEqual(0);
    });

    it('updateMatrix should update the dieMatrix', () => {
        const testData: Iterable<number> = [4, 5, 6];
        worker.updateMatrix(testData);
        expect(worker.dieMatrix).toEqual(Uint8Array.from(testData));
    });
});
