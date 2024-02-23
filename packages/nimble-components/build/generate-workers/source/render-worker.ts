import * as Comlink from 'comlink';
import { HealthStatus, healthStatus } from './health-status';

export class RenderWorker {
    private worker!: number;
    private dieMatrix: Uint8Array = Uint8Array.from([]);
    private healthStatus: HealthStatus = healthStatus.unknown;

    constructor() {
    }

    public emptyMatrix(): void {
        this.dieMatrix = Uint8Array.from([]);;
    }

    public updateMatrix(
        data: Iterable<number>
    ): void {
        this.dieMatrix = Uint8Array.from(data);
    }

    public areMethodsCallable(): boolean {
        return typeof this.updateMatrix === 'function' && typeof this.emptyMatrix === 'function';
    }

    public isWorkerHealthy(): HealthStatus {
        try {
            const areMethodsCallable = this.areMethodsCallable();
            if (!areMethodsCallable) {
                return this.healthStatus = healthStatus.error;
            }
            return this.healthStatus = healthStatus.healthy;
        } catch (e) {
            return this.healthStatus = healthStatus.error;
        }
    }
}
const worker = new RenderWorker();
Comlink.expose(worker);