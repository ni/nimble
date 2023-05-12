import type { ScaleBand, ScaleQuantile } from 'd3-scale';
import { Computations } from './computations';
import { Prerendering } from './prerendering';
import type { WaferMap } from '..';
import type {
    Dimensions,
    Margin,
    DieRenderInfo,
    WaferMapDie,
    PointCoordinates
} from '../types';

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

    public get radius(): number {
        return this.computations.radius;
    }

    public get margin(): Margin {
        return this.computations.margin;
    }

    public get horizontalScale(): ScaleBand<number> {
        return this.computations.horizontalScale;
    }

    public get invertedHorizontalScale(): ScaleQuantile<number, number> {
        return this.computations.invertedHorizontalScale;
    }

    public get verticalScale(): ScaleBand<number> {
        return this.computations.verticalScale;
    }

    public get invertedVerticalScale(): ScaleQuantile<number, number> {
        return this.computations.invertedVerticalScale;
    }

    public get labelsFontSize(): number {
        return this.prerendering.labelsFontSize;
    }

    public get diesRenderInfo(): DieRenderInfo[] {
        return this.prerendering.diesRenderInfo;
    }

    private readonly computations: Computations;
    private readonly prerendering: Prerendering;
    private dataMap: Map<string, WaferMapDie>;

    public constructor(wafermap: Readonly<WaferMap>) {
        this.computations = new Computations(wafermap);

        this.prerendering = new Prerendering(wafermap, this);

        this.dataMap = new Map(
            wafermap.dies.map(die => [`${die.x}_${die.y}`, die])
        );
    }

    public updateContainerDimensions(wafermap: Readonly<WaferMap>): void {
        this.computations.updateContainerDimensions(wafermap);
        this.updateLabelsFontSize(wafermap);
    }

    public updateScales(wafermap: Readonly<WaferMap>): void {
        this.computations.updateScales(wafermap);
        this.dataMap = new Map(
            wafermap.dies.map(die => [`${die.x}_${die.y}`, die])
        );
        this.updateLabelsFontSize(wafermap);
    }

    public updateLabelsFontSize(wafermap: Readonly<WaferMap>): void {
        this.prerendering.updateLabelsFontSize(wafermap, this);
    }

    public updateDiesRenderInfo(wafermap: Readonly<WaferMap>): void {
        this.prerendering.updateDiesRenderInfo(wafermap, this);
    }

    public getWaferMapDie(point: PointCoordinates): WaferMapDie | undefined {
        return this.dataMap.get(`${point.x}_${point.y}`);
    }
}
