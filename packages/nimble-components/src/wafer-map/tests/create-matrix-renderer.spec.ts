import { transfer, type Remote } from 'comlink';
import { createMatrixRenderer } from '../modules/create-matrix-renderer';
import type { MatrixRenderer } from '../../../build/generate-workers/dist/esm/source/matrix-renderer';

describe('MatrixRenderer worker', () => {
    let matrixRenderer: Remote<MatrixRenderer>;
    let terminate: () => void;
    const testData = {
        columnIndexes: [4, 1, 2],
        rowIndexes: [54, 54, 62],
        values: [8.12, 9.0, 0.32]
    };

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
        await matrixRenderer.updateMatrix(testData);
        const resolvedDieMatrix = await matrixRenderer.getMatrix();

        expect(resolvedDieMatrix.columnIndexes).toEqual(
            Int32Array.from(testData.columnIndexes)
        );
        expect(resolvedDieMatrix.rowIndexes).toEqual(
            Int32Array.from(testData.rowIndexes)
        );
        expect(resolvedDieMatrix.values).toEqual(
            Float64Array.from(testData.values)
        );
    });

    it('emptyMatrix should empty the dieMatrix', async () => {
        await matrixRenderer.updateMatrix(testData);
        await matrixRenderer.emptyMatrix();
        const resolvedDieMatrix = await matrixRenderer.getMatrix();
        expect(
            resolvedDieMatrix.columnIndexes.length
                + resolvedDieMatrix.rowIndexes.length
                + resolvedDieMatrix.values.length
        ).toEqual(0);
    });

    it('indexes should be set', async () => {
        const offscreenCanvas = new OffscreenCanvas(300, 300);
        await matrixRenderer.setCanvas(
            transfer(offscreenCanvas, [
                offscreenCanvas as unknown as Transferable
            ])
        );

        const typedColumnIndexes = Int32Array.from(testData.columnIndexes);
        const typedRowIndexes = Int32Array.from(testData.rowIndexes);

        await matrixRenderer.setColumnIndexes(
            transfer(typedColumnIndexes, [typedColumnIndexes.buffer])
        );
        await matrixRenderer.setRowIndexes(
            transfer(typedRowIndexes, [typedRowIndexes.buffer])
        );

        const columnIndexes = await matrixRenderer.columnIndexes;
        const rowIndexes = await matrixRenderer.rowIndexes;

        expect(columnIndexes).toEqual(Int32Array.from([4, 1, 2]));
        expect(rowIndexes).toEqual(Int32Array.from([54, 54, 62]));
    });
});
