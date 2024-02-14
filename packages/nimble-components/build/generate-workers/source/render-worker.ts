import * as Comlink from 'comlink';
import { HealthStatus } from './health-status';

export class RenderWorker {
    private canvas!: OffscreenCanvas;
    private worker!: number;
    private context!: OffscreenCanvasRenderingContext2D;
    private dieMatrix: Uint8Array = Uint8Array.from([]);
    private verticalScale: { a: number, b: number } = { a: 0, b: 1 };
    private horizontalScale: { a: number, b: number } = { a: 0, b: 1 };
    private margin: { top: number, right: number } = { top: 0, right: 0 };
    private dieDimensions: { width: number, height: number } = { width: 1, height: 1 };
    private colorCategories: { color: string, startValue: number, endValue?: number }[] = [];
    private yLimits: { min: number, max: number } = { min: 0, max: 0 };
    private xLimits: { min: number, max: number } = { min: 0, max: 0 };
    private transform: { k: number, x: number, y: number } = { k: 1, x: 0, y: 0 };
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
            return this.healthStatus = HealthStatus.Healty;
        } catch (e) {
            return this.healthStatus = HealthStatus.Error;
        }
    }
}
Comlink.expose(RenderWorker);