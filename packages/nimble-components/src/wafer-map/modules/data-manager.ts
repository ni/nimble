import type { ScaleLinear } from 'd3-scale';
import { Computations } from './computations';
import { Prerendering } from './prerendering';
import type {
    Dimensions,
    Margin,
    WaferMapQuadrant,
    DieRenderInfo,
    WaferMapColorScale,
    WaferMapDie,
    WaferMapColorScaleMode
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

    public get mainCircleLocation(): { x: number, y: number } {
        return {
            x: this.computations.containerDimensions.width / 2,
            y: this.computations.containerDimensions.height / 2
        };
    }

    private readonly computations: Computations;
    private readonly prerendering: Prerendering;
    private readonly dataMap: Map<string, WaferMapDie>;

    public constructor(
        dies: Readonly<Readonly<WaferMapDie>[]>,
        axisLocation: Readonly<WaferMapQuadrant>,
        canvasDimensions: Readonly<Dimensions>,
        colorScale: Readonly<WaferMapColorScale>,
        highlightedValues: Readonly<string[]>,
        colorScaleMode: Readonly<WaferMapColorScaleMode>,
        dieLabelsHidden: Readonly<boolean>,
        dieLabelsSuffix: Readonly<string>,
        maxCharacters: Readonly<number>
    ) {
        this.computations = new Computations(
            dies,
            axisLocation,
            canvasDimensions
        );

        this.prerendering = new Prerendering(
            dies,
            colorScale,
            highlightedValues,
            this.computations.horizontalScale,
            this.computations.verticalScale,
            colorScaleMode,
            dieLabelsHidden,
            dieLabelsSuffix,
            maxCharacters,
            this.computations.dieDimensions,
            this.computations.margin
        );

        this.dataMap = new Map(dies.map(die => [`${die.x}_${die.y}`, die]));
    }

    public getWaferMapDie(x: number, y: number): WaferMapDie | undefined {
        return this.dataMap.get(`${x}_${y}`);
    }
}
