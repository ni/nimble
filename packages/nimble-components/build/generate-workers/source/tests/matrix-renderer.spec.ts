import { Remote, expose, transfer, wrap } from 'comlink';
import { MatrixRenderer } from '../matrix-renderer';

describe('MatrixRenderer with MessageChannel', () => {
    let matrixRenderer: Remote<MatrixRenderer>;
    const testData = {
        columnIndexes: [4, 1, 2],
        rowIndexes: [54, 54, 62],
        values: [8.12, 9.0, 0.32]
    };

    beforeEach(async () => {
        const { port1, port2 } = new MessageChannel();
        const worker = new MatrixRenderer();
        expose(worker, port1);
        matrixRenderer = await wrap<MatrixRenderer>(port2);
    });

    // it('updateMatrix should update the dieMatrix', async () => {
    //     await matrixRenderer.updateMatrix(testData);

    //     const updatedMatrix = await matrixRenderer.getMatrix();
    //     expect(updatedMatrix).toEqual({
    //         columnIndexes: Int32Array.from(testData.columnIndexes),
    //         rowIndexes: Int32Array.from(testData.rowIndexes),
    //         values: Float64Array.from(testData.values)
    //     });
    // });

    // it('emptyMatrix should empty the dieMatrix', async () => {
    //     await matrixRenderer.emptyMatrix();

    //     const updatedMatrix = await matrixRenderer.getMatrix();
    //     expect(
    //         updatedMatrix.columnIndexes.length
    //             + updatedMatrix.rowIndexes.length
    //             + updatedMatrix.values.length
    //     ).toEqual(0);
    // });

    // it('calculateYScaledIndex should compute the scaleY index', async () => {
    //     await matrixRenderer.setBases(2, 2);
    //     await matrixRenderer.setScaling(0.5, 0.5);
    //     expect(await matrixRenderer.calculateYScaledIndex(100)).toEqual(72);
    // });

    // it('calculateXScaledIndex should compute the scaleX index', async () => {
    //     await matrixRenderer.setBases(3, 3);
    //     await matrixRenderer.setScaling(1, 1);
    //     expect(await matrixRenderer.calculateXScaledIndex(100)).toEqual(123);
    // });
});

describe('MatrixRenderer with MessageChannel needing canvas context', () => {
    let matrixRenderer: Remote<MatrixRenderer>;
    const testData = {
        columnIndexes: [4, 1, 2],
        rowIndexes: [54, 54, 62],
        values: [8.12, 9.0, 0.32]
    };

    beforeEach(async () => {
        const { port1, port2 } = new MessageChannel();
        const worker = new MatrixRenderer();
        expose(worker, port1);
        matrixRenderer = await wrap<MatrixRenderer>(port2);
        const offscreenCanvas = new OffscreenCanvas(300, 300);
        matrixRenderer.setCanvas(transfer(offscreenCanvas, [offscreenCanvas]));
    });

    it('setCanvasDimensions should set the canvas dimensions', async () => {
        await matrixRenderer.setCanvasDimensions({ width: 500, height: 500 });
        expect(await matrixRenderer.getCanvasDimensions()).toEqual({
            width: 500,
            height: 500
        });
    });

    // it('indexes should be set', async () => {
    //     const typedColumnIndexes = Int32Array.from(testData.columnIndexes);
    //     const typedRowIndexes = Int32Array.from(testData.rowIndexes);

    //     await matrixRenderer.setColumnIndexes(
    //         transfer(typedColumnIndexes, [typedColumnIndexes.buffer])
    //     );
    //     await matrixRenderer.setRowIndexes(
    //         transfer(typedRowIndexes, [typedRowIndexes.buffer])
    //     );

    //     const columnIndexes = await matrixRenderer.columnIndexes;
    //     const rowIndexes = await matrixRenderer.rowIndexes;

    //     expect(columnIndexes).toEqual(Int32Array.from([4, 1, 2]));
    //     expect(rowIndexes).toEqual(Int32Array.from([54, 54, 62]));
    // });

    it('should throw error calling drawWafer if canvas corners are not set', async () => {
        await expectAsync(matrixRenderer.drawWafer()).toBeRejectedWithError(
            'Canvas corners are not set'
        );
    });
});
