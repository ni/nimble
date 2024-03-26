import { transfer, type Remote } from 'comlink';
import { createMatrixRenderer } from '../modules/create-matrix-renderer';
import type { MatrixRenderer } from '../../../build/generate-workers/dist/esm/source/matrix-renderer';

describe('MatrixRenderer worker', () => {
    let matrixRenderer: Remote<MatrixRenderer>;
    let terminate: () => void;
    const testData = {
        colIndexes: [4, 1, 2],
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
        await matrixRenderer.updateMatrix(testData);
        await matrixRenderer.emptyMatrix();
        const resolvedDieMatrix = await matrixRenderer.getMatrix();
        expect(
            resolvedDieMatrix.colIndexes.length
            + resolvedDieMatrix.rowIndexes.length
            + resolvedDieMatrix.values.length
        ).toEqual(0);
    });

    it('indexes should be scaled', async () => {
        await matrixRenderer.updateMatrix(testData);
        const offscreenCanvas = new OffscreenCanvas(300, 300);
        await matrixRenderer.setCanvas(
            transfer(offscreenCanvas, [
                offscreenCanvas as unknown as Transferable
            ])
        );

        await matrixRenderer.setDiesDimensions({ width: 10, height: 10 });
        await matrixRenderer.setCanvasCorners({ x: 0, y: 0 }, { x: 500, y: 500 });
        await matrixRenderer.setScaling(2, 2);
        await matrixRenderer.setBases(2, 2);
        await matrixRenderer.setCanvasCorners({ x: 0, y: 0 }, { x: 500, y: 500 });
        await matrixRenderer.setMargin({ top: 10, right: 10, bottom: 10, left: 10 });
        await matrixRenderer.setTransform({ k: 1, x: 0, y: 0 });
        await matrixRenderer.drawWafer();

        const scaledColIndexes = await matrixRenderer.scaledColIndex;
        const scaledRowIndexes = await matrixRenderer.scaledRowIndex;

        expect(scaledColIndexes).toEqual(Float64Array.from([20, 14, 16]));
        expect(scaledRowIndexes).toEqual(Float64Array.from([120, 120, 136]));
    });
});
