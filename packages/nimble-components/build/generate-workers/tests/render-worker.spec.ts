import { HealthStatus } from '../source/health-status';
import { RenderWorker } from '../source/render-worker';

describe('RenderWorker', () => {
    it('worker should be healthy', () => {
        const renderer = new RenderWorker();
        expect(renderer.isWorkerHealthy()).toBe(HealthStatus.Healty);
    });
});
