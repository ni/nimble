import type { ScaleLinear } from 'd3-scale';
import { Computations } from './computations';
import { Prerendering } from '../prerendering';
import type { WaferMap } from '../..';
import type {
    Dimensions,
    Margin,
    DieRenderInfo,
    WaferMapDie,
    PointCoordinates
} from '../../types';

/**
 * Data Manager uses Computations and Prerendering modules in order and exposes the results
 */
export class DataManager {
    public get containerDimensions(): Dimensions {
        return this.computations.containerDimensions;
    }

    public get dieDimensions(): Dimensions {
        return this.computations.dieDimensions;
    }

    public get margin(): Margin {
        return this.computations.margin;
    }

    public get horizontalScale(): ScaleLinear<number, number> {
        return this.computations.horizontalScale;
    }

    public get verticalScale(): ScaleLinear<number, number> {
        return this.computations.verticalScale;
    }

    public get labelsFontSize(): number {
        return this.prerendering.labelsFontSize;
    }

    public get diesRenderInfo(): DieRenderInfo[] {
        return this.prerendering.diesRenderInfo;
    }

    public get data(): Map<string, WaferMapDie> {
        return this.dataMap;
    }

    private readonly computations: Computations;
    private readonly prerendering: Prerendering;
    private dataMap!: Map<string, WaferMapDie>;

    public constructor(private readonly wafermap: WaferMap) {
        this.computations = new Computations(wafermap);
        this.prerendering = new Prerendering(wafermap);
    }

    public updateContainerDimensions(): void {
        this.computations.updateContainerDimensions();
        this.updateDataMap();
        this.updateLabelsFontSize();
    }

    public updateScales(): void {
        this.computations.updateScales();
        this.updateDataMap();
        this.updateLabelsFontSize();
    }

    public updateLabelsFontSize(): void {
        this.prerendering.updateLabelsFontSize();
    }

    public updateDiesRenderInfo(): void {
        this.prerendering.updateDiesRenderInfo();
    }

    public getWaferMapDie(point: PointCoordinates): WaferMapDie | undefined {
        return this.dataMap.get(`${point.x}_${point.y}`);
    }

    private updateDataMap(): void {
        this.dataMap = new Map(
            this.wafermap.dies.map(die => [`${die.x}_${die.y}`, die])
        );
    }
}
