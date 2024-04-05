import { scaleLinear } from 'd3-scale';
import { ticks } from 'd3-array';
import { WaferMapColorScaleMode } from '../../types';
import type { ColorScale, Dimensions } from '../../types';
import type { WaferMap } from '../..';

/**
 * Prerendering prepares render-ready dies data to be used by the rendering module
 */
export class Prerendering {
    public get labelsFontSize(): number {
        return this._labelsFontSize;
    }

    public get colorScale(): ColorScale {
        return this._colorScale;
    }

    private _colorScale!: ColorScale;

    private _labelsFontSize!: number;

    private readonly fontSizeFactor = 0.8;
    private readonly colorScaleResolution = 10;

    public constructor(private readonly wafermap: WaferMap) {}

    public update(): void {
        this._labelsFontSize = this.calculateLabelsFontSize(
            this.wafermap.experimentalDataManager.dieDimensions,
            this.wafermap.maxCharacters
        );
        this._colorScale = this.calculateColorScale();
    }

    private calculateColorScale(): ColorScale {
        if (this.wafermap.colorScaleMode === WaferMapColorScaleMode.linear) {
            const values = this.wafermap.colorScale.values.map(item => +item);
            const d3ColorScale = scaleLinear<string, string>()
                .domain(values)
                .range(this.wafermap.colorScale.colors);
            let min = values[0]!;
            let max = values[0]!;
            values.forEach(value => {
                if (value < min) {
                    min = value;
                }
                if (value > max) {
                    max = value;
                }
            });
            // the linear color scale will not be infinite but will be limited by the color scale resolution
            const valueSamples = ticks(
                min,
                max,
                values.length * this.colorScaleResolution
            );
            return valueSamples.map(value => {
                return {
                    color: d3ColorScale(value),
                    value
                };
            });
        }
        // ordinal color categories have to be sorted by value
        return this.wafermap.colorScale.colors
            .map((color, index) => {
                return {
                    color,
                    value: +this.wafermap.colorScale.values[index]!
                };
            })
            .sort((a, b) => a.value - b.value);
    }

    private calculateLabelsFontSize(
        dieDimensions: Dimensions,
        maxCharacters: number
    ): number {
        return Math.min(
            dieDimensions.height,
            (dieDimensions.width / (Math.max(2, maxCharacters) * 0.5))
                * this.fontSizeFactor
        );
    }
}
