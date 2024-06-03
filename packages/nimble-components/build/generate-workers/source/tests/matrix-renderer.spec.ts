import { Remote, expose, transfer, wrap } from 'comlink';
import { MatrixRenderer } from '../matrix-renderer';

describe('MatrixRenderer with MessageChannel needing canvas context', () => {
    let matrixRenderer: Remote<MatrixRenderer>;
    const testData = {
        columnIndices: [4, 1, 2],
        rowIndices: [54, 54, 62],
        values: [8.12, 9.0, 0.32]
    };

    beforeEach(async () => {
        const { port1, port2 } = new MessageChannel();
        const worker = new MatrixRenderer();
        expose(worker, port1);
        matrixRenderer = await wrap<MatrixRenderer>(port2);
        const offscreenCanvas = new OffscreenCanvas(300, 300);
        matrixRenderer.setCanvas(transfer(offscreenCanvas, [offscreenCanvas]));
        await matrixRenderer.setRenderConfig({
            dieDimensions: {
                width: 10,
                height: 10
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
        await matrixRenderer.setTransformConfig({
            transform: {
                k: 1,
                x: 1,
                y: 1
            },
            topLeftCanvasCorner: {
                x: 0,
                y: 0
            },
            bottomRightCanvasCorner: {
                x: 0,
                y: 0
            }
        });
    });

    it('setCanvasDimensions should set the canvas dimensions', async () => {
        await matrixRenderer.setCanvasDimensions({ width: 500, height: 500 });
        expect(await matrixRenderer.getCanvasDimensions()).toEqual({
            width: 500,
            height: 500
        });
    });

    it('scaled Indices should be computed', async () => {
        const typedColumnIndices = Int32Array.from(testData.columnIndices);
        const typedRowIndices = Int32Array.from(testData.rowIndices);

        await matrixRenderer.setColumnIndices(typedColumnIndices);
        await matrixRenderer.setRowIndices(typedRowIndices);

        const scaledColumnIndex = await matrixRenderer.scaledColumnIndices;
        const scaledRowIndex = await matrixRenderer.scaledRowIndices;

        expect(scaledColumnIndex).toEqual(Float64Array.from([4, 1, 2]));
        expect(scaledRowIndex).toEqual(Float64Array.from([54, 54, 62]));
    });
});
