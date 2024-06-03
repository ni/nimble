import { transfer, type Remote } from 'comlink';
import { createMatrixRenderer } from '../modules/create-matrix-renderer';
import type { MatrixRenderer } from '../../../build/generate-workers/dist/esm/source/matrix-renderer';

describe('MatrixRenderer worker', () => {
    let matrixRenderer: Remote<MatrixRenderer>;
    let terminate: () => void;
    const testData = {
        columnIndices: [4, 1, 2],
        rowIndices: [54, 54, 62],
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

    it('scaled Indices should be computed', async () => {
        const offscreenCanvas = new OffscreenCanvas(300, 300);
        const typedColumnIndices = Int32Array.from(testData.columnIndices);
        const typedRowIndices = Int32Array.from(testData.rowIndices);

        await matrixRenderer.setCanvas(
            transfer(offscreenCanvas, [offscreenCanvas])
        );
        await matrixRenderer.setCanvasDimensions({
            width: 300,
            height: 300
        });
        await matrixRenderer.setRenderConfig({
            dieDimensions: {
                width: 0,
                height: 0
            },
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
            labelsFontSize: 0,
            colorScale: [],
            dieLabelsSuffix: '',
            maxCharacters: 0
        });

        await matrixRenderer.setColumnIndices(typedColumnIndices);
        await matrixRenderer.setRowIndices(typedRowIndices);

        const scaledColumnIndex = await matrixRenderer.scaledColumnIndices;
        const scaledRowIndex = await matrixRenderer.scaledRowIndices;

        expect(scaledColumnIndex).toEqual(Float64Array.from([4, 1, 2]));
        expect(scaledRowIndex).toEqual(Float64Array.from([54, 54, 62]));
    });
});
