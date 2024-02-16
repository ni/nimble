import * as Comlink from 'comlink';
import { HealthStatus } from './health-status';

export class RenderWorker {
    private worker!: number;
    private dieMatrix: Uint8Array = Uint8Array.from([]);
    private performanceTest: string | undefined;
    private healthStatus: HealthStatus = HealthStatus.Unknown;

    constructor() {
    }

    public emptyMatrix(): void {
        this.dieMatrix = Uint8Array.from([]);;
    }

    public updateMatrix(
        data: Iterable<number>
    ): void {
        const start = this.performanceTest !== undefined ? self.performance.now() : undefined;
        this.dieMatrix = Uint8Array.from(data);
        if (this.performanceTest !== undefined) {
            self.performance.measure(`${this.performanceTest} - worker:${this.worker} - renderDies`, { start });
        }
    }

    public areMethodsCallable(): boolean {
        return typeof this.updateMatrix === 'function' && typeof this.emptyMatrix === 'function';
    }

    public isWorkerHealthy(): HealthStatus {
        try {
            const areMethodsCallable = this.areMethodsCallable();
            if (!areMethodsCallable) {
                return this.healthStatus = HealthStatus.Error;
            }
            return this.healthStatus = HealthStatus.Healthy;
        } catch (e) {
            return this.healthStatus = HealthStatus.Error;
        }
    }
}
const worker = new RenderWorker();
Comlink.expose(worker);