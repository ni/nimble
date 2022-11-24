import type { ScaleLinear } from 'd3-scale';
import { Computations } from './computations';
import { Prerendering } from './prerendering';
import type {
    Dimensions,
    Margin,
    WaferMapQuadrant,
    RenderDie,
    WaferMapColorsScale,
    WaferMapDie,
    WaferMapColorsScaleMode
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

    public get renderDies(): RenderDie[] {
        return this.prerendering.renderDies;
    }

    public get mainCircleLocation(): { x: number, y: number } {
        return {
            x: this.computations.containerDimensions.width / 2,
            y: this.computations.containerDimensions.height / 2
        };
    }

    private readonly computations: Computations;
    private readonly prerendering: Prerendering;

    public constructor(
        dies: Readonly<Readonly<WaferMapDie>[]>,
        axisLocation: Readonly<WaferMapQuadrant>,
        canvasDimensions: Readonly<Dimensions>,
        colorsScale: Readonly<WaferMapColorsScale>,
        highlightedValues: Readonly<string[]>,
        colorsScaleMode: Readonly<WaferMapColorsScaleMode>,
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
            colorsScale,
            highlightedValues,
            this.computations.horizontalScale,
            this.computations.verticalScale,
            colorsScaleMode,
            dieLabelsHidden,
            dieLabelsSuffix,
            maxCharacters,
            this.computations.dieDimensions,
            this.computations.margin
        );
    }
}
