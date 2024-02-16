import { WaferMap } from '..';
import { HealthStatus } from '../../../build/generate-workers/source/health-status';
import { MatrixRenderer } from '../modules/matrix-renderer';

describe('MatrixRenderer', () => {
    it('worker should be healthy', () => {
        const wafermap = new WaferMap();
        const renderer = new MatrixRenderer(wafermap);
        const healthStatus = renderer.workerOne.isWorkerHealthy();
        expect(healthStatus).toBe(HealthStatus.Healthy);
    });
});