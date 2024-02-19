import { WaferMap } from '..';
import { HealthStatus } from '../../../build/generate-workers/dist/esm/health-status';
import { MatrixRenderer } from '../modules/matrix-renderer';

describe('MatrixRenderer', () => {
    it('worker should be healthy', async () => {
        const wafermap = new WaferMap();
        const renderer = new MatrixRenderer(wafermap);
        const isWorkerHealthy = await renderer.workerOne.isWorkerHealthy();
        expect(isWorkerHealthy).toBe(HealthStatus.Healthy);
    });
});