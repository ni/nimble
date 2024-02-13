import { WaferMap } from '..';
import { MatrixRenderer } from '../modules/matrixRenderer';

describe('MatrixRenderer', () => {
    it('worker should be healthy', () => {
        const waferMap = new WaferMap();
        const renderer = new MatrixRenderer(waferMap);
        expect(renderer.isWorkerHealthy()).toBe(true);
    });
});
