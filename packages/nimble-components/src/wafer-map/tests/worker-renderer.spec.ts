import type { Remote } from 'comlink';
import { createMatrixRenderer } from '../modules/worker-renderer';
import type { MatrixRenderer } from '../../../build/generate-workers/dist/esm/source/matrix-renderer';

describe('MatrixRenderer worker:', () => {
    let matrixRenderer: Remote<MatrixRenderer>;

    beforeEach(async () => {
        matrixRenderer = await createMatrixRenderer();
    });

    it('updateMatrix should update the dieMatrix', async () => {
        const testData = [4, 5, 6];
        await matrixRenderer.updateMatrix(testData);
        const resolvedDieMatrix = await matrixRenderer.dieMatrix;
        expect(Array.from(resolvedDieMatrix)).toEqual(
            Array.from(Uint8Array.from(testData))
        );
    });

    it('emptyMatrix should empty the dieMatrix', async () => {
        const testData = [4, 5, 6];
        await matrixRenderer.updateMatrix(testData);
        await matrixRenderer.emptyMatrix();
        const resolvedDieMatrix = await matrixRenderer.dieMatrix;
        expect(resolvedDieMatrix.length).toEqual(0);
    });
});
