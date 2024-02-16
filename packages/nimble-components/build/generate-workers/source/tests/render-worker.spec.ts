import { HealthStatus } from '../health-status';
import { RenderWorker } from '../render-worker';

describe('RenderWorker', () => {
    it('worker should be healthy', () => {
        const renderer = new RenderWorker();
        expect(renderer.isWorkerHealthy()).toBe(HealthStatus.Healthy);
    });
});
