import { WaferMap } from '..';
import { HealthStatus } from '../../../build/generate-workers/source/health-status';
import { MatrixRenderer } from '../modules/matrix-renderer';

describe('MatrixRenderer', () => {
    it('worker should be healthy', () => {
        const wafermap = new WaferMap();
        const renderer = new MatrixRenderer(wafermap);
        expect(renderer.workerOne.isWorkerHealthy()).toBe(HealthStatus.Healty);
    });
});