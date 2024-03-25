import { transfer, type Remote } from 'comlink';
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
        const colIndexes = Int32Array.from([1, 2, 3]);
        const rowIndexes = Int32Array.from([4, 5, 6]);
        const values = Float64Array.from([8.1, 9.2, 10.32]);
        await matrixRenderer.setColIndexes(
            transfer(colIndexes, [colIndexes.buffer])
        );
        await matrixRenderer.setRowIndexes(
            transfer(rowIndexes, [rowIndexes.buffer])
        );
        await matrixRenderer.setValues(transfer(values, [values.buffer]));
        const resolvedDieMatrix = await matrixRenderer.getMatrix();

        expect(resolvedDieMatrix.colIndexes).toEqual(colIndexes);
        expect(resolvedDieMatrix.rowIndexes).toEqual(rowIndexes);
        expect(resolvedDieMatrix.values).toEqual(values);
    });

    it('emptyMatrix should empty the dieMatrix', async () => {
        const colIndexes = Int32Array.from([4, 1, 2]);
        const rowIndexes = Int32Array.from([54, 54, 62]);
        const values = Float64Array.from([8.12, 9.0, 0.32]);
        await matrixRenderer.setColIndexes(
            transfer(colIndexes, [colIndexes.buffer])
        );
        await matrixRenderer.setRowIndexes(
            transfer(rowIndexes, [rowIndexes.buffer])
        );
        await matrixRenderer.setValues(transfer(values, [values.buffer]));
        await matrixRenderer.emptyMatrix();
        const resolvedDieMatrix = await matrixRenderer.getMatrix();
        expect(
            resolvedDieMatrix.colIndexes.length
                + resolvedDieMatrix.rowIndexes.length
                + resolvedDieMatrix.values.length
        ).toEqual(0);
    });
});
