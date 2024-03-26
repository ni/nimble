import { Remote, expose, transfer, wrap } from 'comlink';
import { MatrixRenderer } from '../matrix-renderer';

describe('MatrixRenderer with MessageChannel', () => {
    let matrixRenderer: Remote<MatrixRenderer>;
    const testData = { colIndexes: [4, 1, 2], rowIndexes: [54, 54, 62], values: [8.12, 9.0, 0.32] };

    beforeEach(async () => {
        const { port1, port2 } = new MessageChannel();
        const worker = new MatrixRenderer();
        expose(worker, port1);
        matrixRenderer = await wrap<MatrixRenderer>(port2);
    });

    it('updateMatrix should update the dieMatrix', async () => {
        await matrixRenderer.updateMatrix(testData);

        const updatedMatrix = await matrixRenderer.getMatrix();
        expect(updatedMatrix).toEqual(
            {
                colIndexes: Int32Array.from(testData.colIndexes),
                rowIndexes: Int32Array.from(testData.rowIndexes),
                values: Float64Array.from(testData.values)
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

    it('indexes should be scaled', async () => {
        await matrixRenderer.updateMatrix(testData);
        const offscreenCanvas = new OffscreenCanvas(300, 300);
        matrixRenderer.setCanvas(
            transfer(offscreenCanvas, [
                offscreenCanvas as unknown as Transferable
            ])
        );

        matrixRenderer.setDiesDimensions({ width: 10, height: 10 });
        matrixRenderer.setCanvasCorners({ x: 0, y: 0 }, { x: 500, y: 500 });
        matrixRenderer.setScaling(2, 2);
        matrixRenderer.setBases(2, 2);
        matrixRenderer.setCanvasCorners({ x: 0, y: 0 }, { x: 500, y: 500 });
        matrixRenderer.setMargin({ top: 10, right: 10, bottom: 10, left: 10 });
        matrixRenderer.setTransform({ k: 1, x: 0, y: 0 });
        matrixRenderer.drawWafer();

        const scaledColIndexes = await matrixRenderer.scaledColIndex;
        const scaledRowIndexes = await matrixRenderer.scaledRowIndex;

        expect(scaledColIndexes).toEqual(Float64Array.from([20, 14, 16]));
        expect(scaledRowIndexes).toEqual(Float64Array.from([120, 120, 136]));
    });
});
