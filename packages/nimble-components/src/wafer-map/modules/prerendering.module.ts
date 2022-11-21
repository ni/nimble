import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import type { WaferMapColorsScale } from '../data-types/WaferMapColorsScale';
import type { WaferMapDie } from '../data-types/WaferMapDie';
import { Dimensions, Margin, RenderDie, WaferColorByOptions } from '../types';

/**
* Prerendering module
*/
export class Prerendering {
    public labelsFontSize: number;

    public renderDies: RenderDie[];

    private readonly colorScale: ScaleOrdinal<string, string> | ScaleLinear<string, string>;

    private readonly colorBy: WaferColorByOptions;
    private readonly highlightedValues!: string[];

    private readonly fontSizeFactor = 0.8;
    private readonly emptyDieColor = '#DADFEC';
    private readonly nanDieColor = '#7a7a7a';

    public constructor(
        dies: WaferMapDie[],
        colorBy: WaferColorByOptions,
        colorsScale: WaferMapColorsScale,
        highlightedValues: string[],
        horizontalScale: ScaleLinear<number, number>,
        verticalScale: ScaleLinear<number, number>,
        isCategorical: boolean,
        maxCharacters: number,
        dieDimensions: Dimensions,
        margin: Margin,
    ) {
        this.colorBy = colorBy;
        this.highlightedValues = highlightedValues;

        this.colorScale = this.createColorScale(colorsScale, isCategorical);

        this.labelsFontSize = Math.min(dieDimensions.height,
            dieDimensions.width / (this.calculateMaxCharacters(colorBy, isCategorical, maxCharacters) * 0.5) * this.fontSizeFactor);

        this.renderDies = [];
        for (const die of dies) {
            this.renderDies.push({
                x: horizontalScale(die.x) + margin.right,
                y: verticalScale(die.y) + margin.top,
                fillStyle: this.getFillStyle(die, isCategorical),
                opacity: this.getOpacityAccordingToSelectedValue(die.data),
                text: this.buildLabelData(die.data, colorBy, isCategorical)
            });
        }
    }

    private calculateMaxCharacters(colorBy: WaferColorByOptions, isCategorical: boolean, maxCharacters: number): number {
        return Math.max(2, !isCategorical && colorBy !== WaferColorByOptions.floatValue
            ? maxCharacters + 1 /* take the percentage in count */
            : maxCharacters);
    }

    private createColorScale(colorsScale: WaferMapColorsScale, isCategorical: boolean): ScaleOrdinal<string, string> | ScaleLinear<string, string> {
        if (isCategorical) {
            return scaleOrdinal<string, string>()
                .domain(colorsScale.values)
                .range(colorsScale.colors);
        }
        return scaleLinear<string, string>()
            .domain(colorsScale.values.map(item => parseInt(item, 10)))
            .range(colorsScale.colors);
    }

    private dieHasData(dieData: string | number): boolean {
        return dieData !== null && dieData !== undefined && dieData !== '';
    }

    private buildLabelData(data: string | number, colorBy: WaferColorByOptions, isCategorical: boolean): string {
        if (!this.dieHasData(data) || (isCategorical && colorBy === WaferColorByOptions.binType)) {
            return '';
        }
        const dataLabelsSuffix = !isCategorical && colorBy !== WaferColorByOptions.floatValue ? '%' : '';
        return `${data}${dataLabelsSuffix}`;
    }

    private dieValueAndSelectedAreEqual(dieValue: string | number, selectedValue: string | number): boolean {
        return dieValue.toString() === selectedValue.toString();
    }

    private getOpacityAccordingToSelectedValue(selectedValue: string | number): number {
        return this.highlightedValues
         && this.highlightedValues.length > 0
         && !this.highlightedValues.some(dieValue => this.dieValueAndSelectedAreEqual(dieValue, selectedValue)) ? 0.3 : 0;
    }

    private getFillStyle(die: WaferMapDie, isCategorical: boolean): string {
        if (isNaN(+die.data)) {
            return this.nanDieColor;
        }
        if (!this.dieHasData(die.data)) {
            return this.emptyDieColor;
        }
        return isCategorical ? (this.colorScale as ScaleOrdinal<string, string>)(die.data.toString())
            : (this.colorScale as ScaleLinear<string, string>)(+die.data);
    }
}