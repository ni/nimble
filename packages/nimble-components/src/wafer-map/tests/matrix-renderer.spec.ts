import { WaferMap } from '..';
import { HealthStatus, healthStatus } from '../workers/health-status';
import { MatrixRenderer } from '../modules/matrix-renderer';

describe('MatrixRenderer', () => {
    it('worker should be healthy', async () => {
        const wafermap = new WaferMap();
        const renderer = new MatrixRenderer(wafermap);
        const isWorkerHealthy = (await renderer.workerOne.isWorkerHealthy()) as HealthStatus;
        expect(isWorkerHealthy).toBe(healthStatus.healthy);
    });
});
