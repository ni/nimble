import type { ScaleLinear } from 'd3-scale';
import { Computations } from './computations';
import { Prerendering } from './prerendering';
import type { WaferMap } from '../..';
import type { ColorScale, Dimensions, Margin } from '../../types';

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

    public get colorScale(): ColorScale {
        return this.prerendering.colorScale;
    }

    private readonly computations: Computations;
    private readonly prerendering: Prerendering;

    public constructor(private readonly wafermap: WaferMap) {
        this.computations = new Computations(wafermap);
        this.prerendering = new Prerendering(wafermap);
    }

    public updateComputations(): void {
        this.computations.update();
        this.prerendering.update();
    }

    public updatePrerendering(): void {
        this.prerendering.update();
    }
}
