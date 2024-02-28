import { wrap, Remote } from 'comlink';
import { workerCode } from '../workers/render-worker';
import type { RenderWorker } from '../../../build/generate-workers/dist/esm/source/render-worker';

/**
 * Asynchronously creates and returns a Remote<RenderWorker> instance.
 * This function simplifies the process of creating and accessing RenderWorker instances.
 */
export const createMatrixRenderer = async (): Promise<Remote<RenderWorker>> => {
    const blob = new Blob([workerCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const RemoteMatrixRenderer = wrap<new() => RenderWorker>(new Worker(url));
    const instance = await new RemoteMatrixRenderer();
    return instance;
};
