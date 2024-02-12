import * as Comlink from 'comlink';
import type { WaferMap } from '..';
import { workerCode } from '../workers/renderWorker';

/**
 * Responsible for drawing the dies inside the wafer map, adding dieText and scaling the canvas
 */
export class MatrixRenderer {
    private readonly workerOne: Comlink.Remote<Worker>;
    private readonly workerTwo: Comlink.Remote<Worker>;

    public constructor(private readonly wafermap: WaferMap) {
        const blob = new Blob([workerCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        this.workerOne = Comlink.wrap(new Worker(url));
        this.workerTwo = Comlink.wrap(new Worker(url));
    }
}