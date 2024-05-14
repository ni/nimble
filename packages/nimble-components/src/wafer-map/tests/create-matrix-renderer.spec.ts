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

    it('scaled indexes should be computed', async () => {
        const offscreenCanvas = new OffscreenCanvas(300, 300);
        const typedColumnIndexes = Int32Array.from(testData.columnIndexes);
        const typedRowIndexes = Int32Array.from(testData.rowIndexes);

        await matrixRenderer.setCanvas(
            transfer(offscreenCanvas, [offscreenCanvas])
        );
        await matrixRenderer.setCanvasDimensions({
            width: 300,
            height: 300
        });
        await matrixRenderer.setState({
            containerDimensions: undefined,
            dieDimensions: undefined,
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            verticalCoefficient: 1,
            horizontalCoefficient: 1,
            horizontalConstant: 0,
            verticalConstant: 0,
            labelsFontSize: undefined,
            colorScale: undefined
        });

        await matrixRenderer.setColumnIndexes(typedColumnIndexes);
        await matrixRenderer.setRowIndexes(typedRowIndexes);

        const scaledColumnIndex = await matrixRenderer.scaledColumnIndex;
        const scaledRowIndex = await matrixRenderer.scaledRowIndex;

        expect(scaledColumnIndex).toEqual(Float64Array.from([4, 1, 2]));
        expect(scaledRowIndex).toEqual(Float64Array.from([54, 54, 62]));
    });
});
