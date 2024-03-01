import { wrap, Remote } from 'comlink';
import { workerCode } from '../workers/matrix-renderer';
import type { MatrixRenderer } from '../../../build/generate-workers/dist/esm/source/matrix-renderer';

let url: string;

/**
 * Asynchronously creates and returns a Remote<MatrixRenderer> instance.
 * This function simplifies the process of creating and accessing MatrixRenderer instances.
 */
export const createMatrixRenderer = async (): Promise<{
    matrixRenderer: Remote<MatrixRenderer>,
    terminate: () => void
}> => {
    if (url === undefined) {
        const blob = new Blob([workerCode], { type: 'text/javascript' });
        url = URL.createObjectURL(blob);
    }
    const worker = new Worker(url);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const RemoteMatrixRenderer = wrap<new() => MatrixRenderer>(worker);
    const matrixRenderer = await new RemoteMatrixRenderer();
    const terminate = (): void => worker.terminate();
    return {
        matrixRenderer,
        terminate
    };
};
