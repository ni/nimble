import { Remote, expose, wrap } from 'comlink';
import { RenderWorker } from '../render-worker';

describe('RenderWorker with MessageChannel', () => {
    let wrappedWorker: Remote<RenderWorker>;

    beforeEach(async () => {
        const { port1, port2 } = new MessageChannel();
        const worker = new RenderWorker();
        expose(worker, port1);
        wrappedWorker = await wrap<RenderWorker>(port2);
    });

    it('updateMatrix should update the dieMatrix', async () => {
        const testData: Iterable<number> = [4, 5, 6];
        await wrappedWorker.updateMatrix(testData);

        const updatedMatrix = await wrappedWorker.dieMatrix;
        expect(updatedMatrix).toEqual(Uint8Array.from(testData));
    });

    it('emptyMatrix should empty the dieMatrix', async () => {
        await wrappedWorker.emptyMatrix();

        const updatedMatrix = await wrappedWorker.dieMatrix;
        expect(updatedMatrix.length).toEqual(0);
    });
});
