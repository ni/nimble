import { wrap, Remote } from 'comlink';
import type { WaferMap } from '..';
import { workerCode } from '../workers/render-worker';
import type { RenderWorker } from '../../../build/generate-workers/dist/esm/source/render-worker';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class MatrixRenderer {
    private static workerInstance: Remote<RenderWorker> | null = null;

    public constructor(private readonly wafermap: WaferMap) { }

    private static createWorker(): Remote<RenderWorker> {
        const blob = new Blob([workerCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        return wrap<RenderWorker>(new Worker(url));
    }

    public get workerOne(): Remote<RenderWorker> {
        if (MatrixRenderer.workerInstance === null) {
            MatrixRenderer.workerInstance = MatrixRenderer.createWorker();
        }
        return MatrixRenderer.workerInstance;
    }
}
