import * as Comlink from 'comlink';
import type { WaferMap } from '..';
import { workerCode } from '../workers/render-worker';
import type { RenderWorker } from '../../../build/generate-workers/dist/esm/render-worker';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class MatrixRenderer {
    public readonly workerOne: Comlink.Remote<RenderWorker>;

    public constructor(private readonly wafermap: WaferMap) {
        const blob = new Blob([workerCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        this.workerOne = Comlink.wrap<RenderWorker>(new Worker(url));
    }
}