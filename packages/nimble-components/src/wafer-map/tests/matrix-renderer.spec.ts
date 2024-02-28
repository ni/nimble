import { Remote, expose, wrap } from 'comlink';
import { WaferMap } from '..';
import { MatrixRenderer } from '../modules/matrix-renderer';
import type { RenderWorker } from '../../../build/generate-workers/dist/esm/source/render-worker';

describe('MatrixRenderer worker:', () => {
    let renderer: MatrixRenderer;
    let messageChannel: MessageChannel;
    let remoteWorker: Remote<RenderWorker>;

    beforeEach(() => {
        const wafermap = new WaferMap();
        renderer = new MatrixRenderer(wafermap);

        messageChannel = new MessageChannel();
        expose(renderer.workerOne, messageChannel.port1);
        remoteWorker = wrap(messageChannel.port2);
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

    afterEach(() => {
        messageChannel.port1.close();
        messageChannel.port2.close();
    });
});
