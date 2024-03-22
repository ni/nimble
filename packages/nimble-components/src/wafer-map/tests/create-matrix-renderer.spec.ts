import type { Remote } from 'comlink';
import { createMatrixRenderer } from '../modules/create-matrix-renderer';
import type { MatrixRenderer } from '../../../build/generate-workers/dist/esm/source/matrix-renderer';

describe('MatrixRenderer worker', () => {
    let matrixRenderer: Remote<MatrixRenderer>;
    let terminate: () => void;

    beforeEach(async () => {
        const result = await createMatrixRenderer();
        matrixRenderer = result.matrixRenderer;
        terminate = result.terminate;
    });

    afterEach(() => {
        terminate();
        matrixRenderer = undefined!;
    });

    it('updateMatrix should update the dieMatrix', async () => {
        const testData = {
            colIndexes: [1, 2, 3],
            rowIndexes: [4, 5, 6],
            values: [8.1, 9.2, 10.32]
        };
        await matrixRenderer.updateMatrix(testData);
        const resolvedDieMatrix = await matrixRenderer.getMatrix();

        expect(resolvedDieMatrix.colIndexes).toEqual(
            Uint32Array.from(testData.colIndexes)
        );
        expect(resolvedDieMatrix.rowIndexes).toEqual(
            Uint32Array.from(testData.rowIndexes)
        );
        expect(resolvedDieMatrix.values).toEqual(
            Float64Array.from(testData.values)
        );
    });

    it('emptyMatrix should empty the dieMatrix', async () => {
        const testData = {
            colIndexes: [4, 1, 2],
            rowIndexes: [54, 54, 62],
            values: [8.12, 9.0, 0.32]
        };
        await matrixRenderer.updateMatrix(testData);
        await matrixRenderer.emptyMatrix();
        const resolvedDieMatrix = await matrixRenderer.getMatrix();
        expect(
            resolvedDieMatrix.colIndexes.length
                + resolvedDieMatrix.rowIndexes.length
                + resolvedDieMatrix.values.length
        ).toEqual(0);
    });
});
