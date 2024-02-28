import { Remote, expose, wrap } from 'comlink';
import { MatrixRenderer } from '../matrix-renderer';

describe('MatrixRenderer with MessageChannel', () => {
    let wrappedWorker: Remote<MatrixRenderer>;

    beforeEach(async () => {
        const { port1, port2 } = new MessageChannel();
        const worker = new MatrixRenderer();
        expose(worker, port1);
        wrappedWorker = await wrap<MatrixRenderer>(port2);
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
