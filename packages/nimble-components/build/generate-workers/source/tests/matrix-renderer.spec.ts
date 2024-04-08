import { Remote, expose, transfer, wrap } from 'comlink';
import { MatrixRenderer } from '../matrix-renderer';

describe('MatrixRenderer with MessageChannel', () => {
    let matrixRenderer: Remote<MatrixRenderer>;
    const testData = { columnIndexes: [4, 1, 2], rowIndexes: [54, 54, 62], values: [8.12, 9.0, 0.32] };

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
                columnIndexes: Int32Array.from(testData.columnIndexes),
                rowIndexes: Int32Array.from(testData.rowIndexes),
                values: Float64Array.from(testData.values)
            }
        );
    });

    it('emptyMatrix should empty the dieMatrix', async () => {
        await matrixRenderer.emptyMatrix();

        const updatedMatrix = await matrixRenderer.getMatrix();
        expect(updatedMatrix.columnIndexes.length
            + updatedMatrix.rowIndexes.length
            + updatedMatrix.values.length).toEqual(0);
    });

    it('indexes should be set', async () => {
        const offscreenCanvas = new OffscreenCanvas(300, 300);
        matrixRenderer.setCanvas(
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