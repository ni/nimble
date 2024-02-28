import { Remote, expose, wrap } from 'comlink';
import { MatrixRenderer } from '../matrix-renderer';

describe('MatrixRenderer with MessageChannel', () => {
    let matrixRenderer: Remote<MatrixRenderer>;

    beforeEach(async () => {
        const { port1, port2 } = new MessageChannel();
        const worker = new MatrixRenderer();
        expose(worker, port1);
        matrixRenderer = await wrap<MatrixRenderer>(port2);
    });

    it('updateMatrix should update the dieMatrix', async () => {
        const testData: Iterable<number> = [4, 5, 6];
        await matrixRenderer.updateMatrix(testData);

        const updatedMatrix = await matrixRenderer.dieMatrix;
        expect(updatedMatrix).toEqual(Uint8Array.from(testData));
    });

    it('emptyMatrix should empty the dieMatrix', async () => {
        await matrixRenderer.emptyMatrix();

        const updatedMatrix = await matrixRenderer.dieMatrix;
        expect(updatedMatrix.length).toEqual(0);
    });
});
