import { WaferMap } from '..';
import { MatrixRenderer } from '../modules/matrix-renderer';

// Sometimes methods from render worker become bugged after being built, bundled and copied to a different location
// with these tests we ensure they behave as expected after this process
describe('MatrixRenderer worker:', () => {
    const wafermap = new WaferMap();
    let renderer = new MatrixRenderer(wafermap);
    beforeEach(() => {
        renderer = new MatrixRenderer(wafermap);
    });

    it('emptyMatrix() should empty the dieMatrix', async () => {
        renderer.workerOne.dieMatrix = Promise.resolve(Uint8Array.from([1, 2, 3]));
        await renderer.workerOne.emptyMatrix();
        const resolvedDieMatrix = await renderer.workerOne.dieMatrix as Uint8Array;
        expect(resolvedDieMatrix.length).toEqual(0);
    });

    it('updateMatrix should update the dieMatrix correctly', async () => {
        const testData: Iterable<number> = [4, 5, 6];
        await renderer.workerOne.updateMatrix(testData);
        expect(renderer.workerOne.dieMatrix).toEqual(Promise.resolve(Uint8Array.from(testData)));
    });
});
