import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { WaferMapColorsScaleMode } from '../types';
import type { Dimensions, Margin, RenderDie, WaferMapDie, WaferMapColorsScale } from '../types';

/**
* Prerendering prepares render ready dies data  to be used by the rendering module
*/
export class Prerendering {
    public readonly labelsFontSize: number;

    public readonly renderDies: RenderDie[];

    private readonly colorScale: ScaleOrdinal<string, string> | ScaleLinear<string, string>;

    private readonly fontSizeFactor = 0.8;
    private readonly nonHighlightedOpacity = 0.3;
    private readonly emptyDieColor = '#DADFEC';
    private readonly nanDieColor = '#7a7a7a';

    public constructor(
        dies: WaferMapDie[],
        colorsScale: WaferMapColorsScale,
        highlightedValues: number[],
        horizontalScale: ScaleLinear<number, number>,
        verticalScale: ScaleLinear<number, number>,
        colorsScaleMode: WaferMapColorsScaleMode,
        dieLabelsHidden: boolean,
        dieLabelsSuffix: string,
        maxCharacters: number,
        dieDimensions: Dimensions,
        margin: Margin,
    ) {
        this.colorScale = this.createColorScale(colorsScale, colorsScaleMode);

        this.labelsFontSize = this.calculateLabelsFontSize(dieDimensions, dieLabelsSuffix, maxCharacters);

        this.renderDies = [];
        for (const die of dies) {
            this.renderDies.push({
                x: horizontalScale(die.x) + margin.right,
                y: verticalScale(die.y) + margin.top,
                fillStyle: this.calculateFillStyle(die, colorsScaleMode),
                opacity: this.calculateOpacity(die.value, highlightedValues),
                text: this.buildLabelData(die.value, maxCharacters, dieLabelsHidden, dieLabelsSuffix)
            });
        }
    }

    private calculateLabelsFontSize(dieDimensions: Dimensions, dieLabelsSuffix: string, maxCharacters: number): number {
        return Math.min(dieDimensions.height,
            dieDimensions.width / (Math.max(2, maxCharacters + dieLabelsSuffix.length) * 0.5) * this.fontSizeFactor);
    }

    private createColorScale(colorsScale: WaferMapColorsScale, colorsScaleMode: WaferMapColorsScaleMode): ScaleOrdinal<string, string> | ScaleLinear<string, string> {
        if (colorsScaleMode === WaferMapColorsScaleMode.linear) {
            return scaleLinear<string, string>()
                .domain(colorsScale.values)
                .range(colorsScale.colors);
        }
        return scaleOrdinal<string, string>()
            .domain(colorsScale.values.map(item => item.toString()))
            .range(colorsScale.colors);
    }

    private dieHasData(dieData: string | number): boolean {
        return dieData !== null && dieData !== undefined && dieData !== '';
    }

    private buildLabelData(value: number, maxCharacters: number, dieLabelsHidden: boolean, dieLabelsSuffix: string): string {
        if (dieLabelsHidden || !this.dieHasData(value)) {
            return '';
        }
        return `${value.toString().substring(0, maxCharacters)}${dieLabelsSuffix}`;
    }

    private calculateOpacity(selectedValue: number, highlightedValues: number[]): number {
        return !highlightedValues.some(dieValue => dieValue === selectedValue) ? this.nonHighlightedOpacity : 0;
    }

    private calculateFillStyle(die: WaferMapDie, colorsScaleMode: WaferMapColorsScaleMode): string {
        if (isNaN(die.value)) {
            return this.nanDieColor;
        }
        if (!this.dieHasData(die.value)) {
            return this.emptyDieColor;
        }
        if (colorsScaleMode === WaferMapColorsScaleMode.linear) {
            return (this.colorScale as ScaleLinear<string, string>)(die.value);
        }
        return (this.colorScale as ScaleOrdinal<string, string>)(die.value.toString());
    }
}