import type { Remote } from 'comlink';
import { createMatrixRenderer } from '../modules/matrix-renderer';
import type { RenderWorker } from '../../../build/generate-workers/dist/esm/source/render-worker';

describe('MatrixRenderer worker:', () => {
    let remoteWorker: Remote<RenderWorker>;

    beforeEach(async () => {
        // Directly create a RenderWorker instance using the new utility function
        remoteWorker = await createMatrixRenderer();
    });

    it('updateMatrix should update the dieMatrix', async () => {
        const testData: Iterable<number> = [4, 5, 6];
        await remoteWorker.updateMatrix(testData);
        const resolvedDieMatrix = await remoteWorker.dieMatrix;
        expect(Array.from(resolvedDieMatrix)).toEqual(
            Array.from(Uint8Array.from(testData))
        );
    });

    it('emptyMatrix should empty the dieMatrix', async () => {
        const testData: Iterable<number> = [4, 5, 6];
        await remoteWorker.updateMatrix(testData);
        await remoteWorker.emptyMatrix();
        const resolvedDieMatrix = await remoteWorker.dieMatrix;
        expect(resolvedDieMatrix.length).toEqual(0);
    });
});
