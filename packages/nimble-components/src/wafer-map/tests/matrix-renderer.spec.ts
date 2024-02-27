import { WaferMap } from '..';
import { MatrixRenderer } from '../modules/matrix-renderer';

describe('MatrixRenderer worker:', () => {
    const wafermap = new WaferMap();
    let renderer: MatrixRenderer;
    beforeEach(() => {
        renderer = new MatrixRenderer(wafermap);
    });

    it('updateMatrix should update the dieMatrix correctly', async () => {
        const testData: Iterable<number> = [4, 5, 6];
        await renderer.workerOne.updateMatrix(testData);
        const resolvedDieMatrix = await renderer.workerOne.dieMatrix;
        expect(Array.from(resolvedDieMatrix)).toEqual(
            Array.from(Uint8Array.from(testData))
        );
    });

    it('emptyMatrix should empty the dieMatrix', async () => {
        const testData: Iterable<number> = [4, 5, 6];
        await renderer.workerOne.updateMatrix(testData);
        await renderer.workerOne.emptyMatrix();
        const resolvedDieMatrix = await renderer.workerOne.dieMatrix;
        expect(resolvedDieMatrix.length).toEqual(0);
    });
});
