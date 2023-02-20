import type { ScaleLinear } from 'd3-scale';
import { Computations } from './computations';
import { Prerendering } from './prerendering';
import type { WaferMap } from '..';
import type { Dimensions, Margin, DieRenderInfo } from '../types';

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

    private readonly computations: Computations;
    private readonly prerendering: Prerendering;

    public constructor(wafermap: WaferMap) {
        this.computations = new Computations(wafermap);

        this.prerendering = new Prerendering(
            wafermap,
            this.horizontalScale,
            this.verticalScale,
            this.dieDimensions,
            this.margin
        );
    }
}
