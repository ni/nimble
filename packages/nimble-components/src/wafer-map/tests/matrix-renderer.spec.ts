import { WaferMap } from '..';
import { MatrixRenderer } from '../modules/matrix-renderer';

describe('MatrixRenderer worker:', () => {
    const wafermap = new WaferMap();
    let renderer: MatrixRenderer;

    beforeEach(() => {
        renderer = new MatrixRenderer(wafermap);
    });

    it('updateMatrix should update the dieMatrix', async () => {
        const testData: Iterable<number> = [4, 5, 6];
        const worker = renderer.workerOne;
        await worker.updateMatrix(testData);
        const resolvedDieMatrix = await worker.dieMatrix;
        expect(Array.from(resolvedDieMatrix)).toEqual(
            Array.from(Uint8Array.from(testData))
        );
    });

    it('emptyMatrix should empty the dieMatrix', async () => {
        const testData: Iterable<number> = [4, 5, 6];
        const worker = renderer.workerOne;
        await worker.updateMatrix(testData);
        await worker.emptyMatrix();
        const resolvedDieMatrix = await worker.dieMatrix;
        expect(resolvedDieMatrix.length).toEqual(0);
    });
});
