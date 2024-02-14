import * as Comlink from 'comlink';
import { HealthStatus } from './health-status';

export class RenderWorker {
    private canvas!: OffscreenCanvas;
    private worker!: number;
    private context!: OffscreenCanvasRenderingContext2D;
    private dieMatrix: {
        // the x coordinates of each column of dies
        dieColIndexArray: Int32Array;
        // the lengths of each row of dies
        rowLengthsArray: Int32Array;
        // the y coordinates of each die as a matrix row by row
        dieRowIndexLayer: Int32Array;
        // the value of each die as a matrix row by row
        dieValuesLayer: Int32Array;
        // the highlight state of each die as a matrix row by row
        dieHighlightsLayer: Int8Array;
    } = {
            dieColIndexArray: Int32Array.from([]),
            rowLengthsArray: Int32Array.from([]),
            dieRowIndexLayer: Int32Array.from([]),
            dieValuesLayer: Int32Array.from([]),
            dieHighlightsLayer: Int8Array.from([])
        };
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
        this.dieMatrix = {
            dieColIndexArray: Int32Array.from([]),
            rowLengthsArray: Int32Array.from([]),
            dieRowIndexLayer: Int32Array.from([]),
            dieValuesLayer: Int32Array.from([]),
            dieHighlightsLayer: Int8Array.from([])
        };
    }

    public updateMatrix(
        data: {
            dieColIndexArray: Iterable<number>,
            rowLengthsArray: Iterable<number>,
            dieRowIndexLayer: Iterable<number>,
            dieValuesLayer: Iterable<number>,
        }
    ): void {
        const start = this.performanceTest !== undefined ? self.performance.now() : undefined;
        this.dieMatrix.dieColIndexArray = Int32Array.from(data.dieColIndexArray);
        this.dieMatrix.rowLengthsArray = Int32Array.from(data.rowLengthsArray);
        this.dieMatrix.dieRowIndexLayer = Int32Array.from(data.dieRowIndexLayer);
        this.dieMatrix.dieValuesLayer = Int32Array.from(data.dieValuesLayer);
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