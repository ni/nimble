import type { Remote } from 'comlink';
import { createMatrixRenderer } from '../modules/worker-renderer';
import type { MatrixRenderer } from '../../../build/generate-workers/dist/esm/source/matrix-renderer';

describe('MatrixRenderer worker:', () => {
    let remoteWorker: Remote<MatrixRenderer>;

    beforeEach(async () => {
        remoteWorker = await createMatrixRenderer();
    });

    it('updateMatrix should update the dieMatrix', async () => {
        const testData = [4, 5, 6];
        await remoteWorker.updateMatrix(testData);
        const resolvedDieMatrix = await remoteWorker.dieMatrix;
        expect(Array.from(resolvedDieMatrix)).toEqual(
            Array.from(Uint8Array.from(testData))
        );
    });

    it('emptyMatrix should empty the dieMatrix', async () => {
        const testData = [4, 5, 6];
        await remoteWorker.updateMatrix(testData);
        await remoteWorker.emptyMatrix();
        const resolvedDieMatrix = await remoteWorker.dieMatrix;
        expect(resolvedDieMatrix.length).toEqual(0);
    });
});
