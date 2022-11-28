import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { WaferMapColorsScaleMode } from '../types';
import type {
    Dimensions,
    Margin,
    RenderDie,
    WaferMapDie,
    WaferMapColorsScale
} from '../types';

/**
 * Prerendering prepares render ready dies data  to be used by the rendering module
 */
export class Prerendering {
    public readonly labelsFontSize: number;

    public readonly renderDies: RenderDie[];

    private readonly colorScale:
    | ScaleOrdinal<string, string>
    | ScaleLinear<string, string>;

    private readonly fontSizeFactor = 0.8;
    private readonly nonHighlightedOpacity = 0.3;
    private readonly emptyDieColor = '#DADFEC';
    private readonly nanDieColor = '#7a7a7a';

    public constructor(
        dies: Readonly<Readonly<WaferMapDie>[]>,
        colorsScale: Readonly<WaferMapColorsScale>,
        highlightedValues: Readonly<string[]>,
        horizontalScale: ScaleLinear<number, number>,
        verticalScale: ScaleLinear<number, number>,
        colorsScaleMode: Readonly<WaferMapColorsScaleMode>,
        dieLabelsHidden: Readonly<boolean>,
        dieLabelsSuffix: Readonly<string>,
        maxCharacters: Readonly<number>,
        dieDimensions: Readonly<Dimensions>,
        margin: Readonly<Margin>
    ) {
        this.colorScale = this.createColorScale(colorsScale, colorsScaleMode);

        this.labelsFontSize = this.calculateLabelsFontSize(
            dieDimensions,
            maxCharacters
        );

        this.renderDies = [];
        for (const die of dies) {
            this.renderDies.push({
                x: horizontalScale(die.x) + margin.right,
                y: verticalScale(die.y) + margin.top,
                fillStyle: this.calculateFillStyle(die, colorsScaleMode),
                opacity: this.calculateOpacity(die.value, highlightedValues),
                text: this.buildLabel(
                    die.value,
                    maxCharacters,
                    dieLabelsHidden,
                    dieLabelsSuffix
                )
            });
        }
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

    private createColorScale(
        colorsScale: WaferMapColorsScale,
        colorsScaleMode: WaferMapColorsScaleMode
    ): ScaleOrdinal<string, string> | ScaleLinear<string, string> {
        if (colorsScaleMode === WaferMapColorsScaleMode.linear) {
            return scaleLinear<string, string>()
                .domain(colorsScale.values.map(item => +item))
                .range(colorsScale.colors);
        }
        return scaleOrdinal<string, string>()
            .domain(colorsScale.values)
            .range(colorsScale.colors);
    }

    private dieHasData(dieData: string): boolean {
        return dieData !== null && dieData !== undefined && dieData !== '';
    }

    private buildLabel(
        value: string,
        maxCharacters: number,
        dieLabelsHidden: boolean,
        dieLabelsSuffix: string
    ): string {
        if (dieLabelsHidden || !this.dieHasData(value)) {
            return '';
        }
        const label = `${value}${dieLabelsSuffix}`;
        if (label.length > maxCharacters) {
            return `${label.substring(0, maxCharacters)}…`;
        }
        return label;
    }

    private calculateOpacity(
        selectedValue: string,
        highlightedValues: Readonly<string[]>
    ): number {
        return highlightedValues.length > 0
            && !highlightedValues.some(dieValue => dieValue === selectedValue)
            ? this.nonHighlightedOpacity
            : 0;
    }

    private calculateFillStyle(
        die: WaferMapDie,
        colorsScaleMode: WaferMapColorsScaleMode
    ): string {
        if (!this.dieHasData(die.value)) {
            return this.emptyDieColor;
        }
        if (isNaN(+die.value)) {
            return this.nanDieColor;
        }
        if (colorsScaleMode === WaferMapColorsScaleMode.linear) {
            return (this.colorScale as ScaleLinear<string, string>)(+die.value);
        }
        return (this.colorScale as ScaleOrdinal<string, string>)(die.value);
    }
}
