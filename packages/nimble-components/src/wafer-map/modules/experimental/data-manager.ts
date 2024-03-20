import type { ScaleLinear } from 'd3-scale';
import { Computations } from './computations';
import { Prerendering } from './prerendering';
import type { WaferMap } from '../..';
import type {
    Dimensions,
    Margin
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

    private readonly computations;
    private readonly prerendering;

    public constructor(private readonly wafermap: WaferMap) {
        this.computations = new Computations(wafermap);
        this.prerendering = new Prerendering(wafermap);
    }

    public updateContainerDimensions(): void {
        this.computations.updateContainerDimensions();
        this.prerendering.update();
    }

    public updateScales(): void {
        this.computations.updateScales();
        this.prerendering.update();
    }

    public updateLabelsFontSize(): void {
        this.prerendering.update();
    }

    public updateDiesRenderInfo(): void {
        this.prerendering.update();
    }
}
