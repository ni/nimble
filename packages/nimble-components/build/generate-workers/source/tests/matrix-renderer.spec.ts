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
        const testData = { colIndexes: [4, 1, 2], rowIndexes: [54, 54, 62], values: [8.12, 9.0, 0.32] };
        await matrixRenderer.updateMatrix(testData);

        const updatedMatrix = await matrixRenderer.getMatrix();
        expect(updatedMatrix).toEqual(
            {
                colIndexes: Uint8Array.from(testData.colIndexes),
                rowIndexes: Uint8Array.from(testData.rowIndexes),
                values: Float32Array.from(testData.values)
            }
        );
    });

    it('emptyMatrix should empty the dieMatrix', async () => {
        await matrixRenderer.emptyMatrix();

        const updatedMatrix = await matrixRenderer.getMatrix();
        expect(updatedMatrix.colIndexes.length
            + updatedMatrix.rowIndexes.length
            + updatedMatrix.values.length).toEqual(0);
    });
});
