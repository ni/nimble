import { Remote, expose, transfer, wrap } from 'comlink';
import { MatrixRenderer } from '../matrix-renderer';

describe('MatrixRenderer with MessageChannel', () => {
    let matrixRenderer: Remote<MatrixRenderer>;

    beforeEach(async () => {
        const { port1, port2 } = new MessageChannel();
        const worker = new MatrixRenderer();
        expose(worker, port1);
        matrixRenderer = await wrap<MatrixRenderer>(port2);
        await matrixRenderer.setRenderConfig({
            containerDimensions: undefined,
            dieDimensions: undefined,
            margin: {
                top: 20,
                right: 0,
                bottom: 0,
                left: 20
            },
            verticalCoefficient: 0.5,
            horizontalCoefficient: 1,
            horizontalConstant: 3,
            verticalConstant: 2,
            labelsFontSize: undefined,
            colorScale: undefined
        });
    });

    it('calculateVerticalScaledIndex should compute the vertical scaled index', async () => {
        expect(await matrixRenderer.calculateVerticalScaledIndex(100)).toEqual(
            72
        );
    });

    it('calculateHorizontalScaledIndex should compute the horizontal scaled index', async () => {
        expect(
            await matrixRenderer.calculateHorizontalScaledIndex(100)
        ).toEqual(123);
    });
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
        await matrixRenderer.setRenderConfig({
            containerDimensions: undefined,
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
            labelsFontSize: undefined,
            colorScale: undefined
        });
        await matrixRenderer.setTransformConfig({
            transform: {
                k: 1,
                x: 1,
                y: 1
            },
            topLeftCanvasCorner: undefined,
            bottomRightCanvasCorner: undefined
        });
    });

    it('setCanvasDimensions should set the canvas dimensions', async () => {
        await matrixRenderer.setCanvasDimensions({ width: 500, height: 500 });
        expect(await matrixRenderer.getCanvasDimensions()).toEqual({
            width: 500,
            height: 500
        });
    });

    it('scaled indexes should be computed', async () => {
        const typedColumnIndexes = Int32Array.from(testData.columnIndexes);
        const typedRowIndexes = Int32Array.from(testData.rowIndexes);

        await matrixRenderer.setColumnIndexes(typedColumnIndexes);
        await matrixRenderer.setRowIndexes(typedRowIndexes);

        const scaledColumnIndex = await matrixRenderer.scaledColumnIndex;
        const scaledRowIndex = await matrixRenderer.scaledRowIndex;

        expect(scaledColumnIndex).toEqual(Float64Array.from([4, 1, 2]));
        expect(scaledRowIndex).toEqual(Float64Array.from([54, 54, 62]));
    });

    it('should throw error calling drawWafer if canvas corners are not set', async () => {
        await expectAsync(matrixRenderer.drawWafer()).toBeRejectedWithError(
            'Canvas corners are not set'
        );
    });
});
