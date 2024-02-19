import { healthStatus } from '../health-status';
import { RenderWorker } from '../render-worker';

describe('RenderWorker', () => {
    it('worker should be healthy', () => {
        const renderer = new RenderWorker();
        expect(renderer.isWorkerHealthy()).toEqual(healthStatus.healthy);
    });
});
