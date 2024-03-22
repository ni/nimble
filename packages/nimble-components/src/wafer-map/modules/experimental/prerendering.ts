import { scaleLinear } from 'd3-scale';
import { ticks } from 'd3-array';
import { WaferMapColorScaleMode } from '../../types';
import type { Dimensions, WaferRequiredTypeMap } from '../../types';
import type { WaferMap } from '../..';

/**
 * Prerendering prepares render-ready dies data to be used by the rendering module
 */
export class Prerendering<T extends WaferRequiredTypeMap> {
    public get labelsFontSize(): number {
        return this._labelsFontSize;
    }

    public get colorScale(): {
        colors: string[],
        values: number[]
    } {
        return this._colorScale;
    }

    private _colorScale!: {
        colors: string[],
        values: number[]
    };

    private _labelsFontSize!: number;

    private readonly fontSizeFactor = 0.8;
    private readonly nonHighlightedOpacity = 0.3;
    private readonly emptyDieColor = 'rgba(218,223,236,1)';
    private readonly nanDieColor = 'rgba(122,122,122,1)';

    public constructor(private readonly wafermap: WaferMap<T>) {}

    public update(): void {
        this._labelsFontSize = this.calculateLabelsFontSize(
            this.wafermap.dataManager.dieDimensions,
            this.wafermap.maxCharacters
        );
        this._colorScale = this.calculateColorScale();
    }

    private calculateColorScale(): {
        colors: string[],
        values: number[]
    } {
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
            const valueSamples = ticks(min, max, 100);
            return {
                colors: valueSamples.map(value => d3ColorScale(value)),
                values: valueSamples
            };
        }
        return {
            colors: this.wafermap.colorScale.colors,
            values: this.wafermap.colorScale.values.map(item => +item)
        };
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
