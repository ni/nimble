import type { ScaleLinear } from 'd3-scale';
import type { WaferMapColorsScale } from '../data-types/WaferMapColorsScale';
import type { WaferMapDie } from '../data-types/WaferMapDie';
import { Computations } from './computations.module';
import { Prerendering } from './prerendering.module';
import type { Dimensions, Margin, Quadrant, RenderDie } from '../types';

/**
 * Data Module
 */
export class Data {
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
        return { x: (this.computations.containerDimensions.width / 2), y: (this.computations.containerDimensions.height / 2) };
    }

    private readonly computations: Computations;
    private readonly prerendering: Prerendering;

    public constructor(
        dies: WaferMapDie[],
        colorsScale: WaferMapColorsScale,
        highlightedValues: number[],
        axisLocation: Quadrant,
        isContinuous: boolean,
        showDieLabels: boolean,
        dieLabelsSuffix: string,
        maxCharacters: number,
        canvasDimensions: Dimensions,
    ) {
        this.computations = new Computations(dies, axisLocation, canvasDimensions);

        this.prerendering = new Prerendering(
            dies,
            colorsScale,
            highlightedValues,
            this.computations.horizontalScale,
            this.computations.verticalScale,
            isContinuous,
            showDieLabels,
            dieLabelsSuffix,
            maxCharacters,
            this.computations.dieDimensions,
            this.computations.margin
        );
    }
}