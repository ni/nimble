import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import type { WaferMapColorsScale } from '../data-types/WaferMapColorsScale';
import type { WaferMapDie } from '../data-types/WaferMapDie';
import type { Dimensions, Margin, RenderDie } from '../types';

/**
* Prerendering module
*/
export class Prerendering {
    public labelsFontSize: number;

    public renderDies: RenderDie[];

    private readonly colorScale: ScaleOrdinal<string, string> | ScaleLinear<string, string>;

    private readonly highlightedValues!: number[];

    private readonly fontSizeFactor = 0.8;
    private readonly emptyDieColor = '#DADFEC';
    private readonly nanDieColor = '#7a7a7a';

    public constructor(
        dies: WaferMapDie[],
        colorsScale: WaferMapColorsScale,
        highlightedValues: number[],
        horizontalScale: ScaleLinear<number, number>,
        verticalScale: ScaleLinear<number, number>,
        isContinuous: boolean,
        showDieLabels: boolean,
        dieLabelsSuffix: string,
        maxCharacters: number,
        dieDimensions: Dimensions,
        margin: Margin,
    ) {
        this.highlightedValues = highlightedValues;

        this.colorScale = this.createColorScale(colorsScale, isContinuous);

        this.labelsFontSize = Math.min(dieDimensions.height,
            dieDimensions.width / (this.calculateMaxCharacters(dieLabelsSuffix, maxCharacters) * 0.5) * this.fontSizeFactor);

        this.renderDies = [];
        for (const die of dies) {
            this.renderDies.push({
                x: horizontalScale(die.x) + margin.right,
                y: verticalScale(die.y) + margin.top,
                fillStyle: this.calculateFillStyle(die, isContinuous),
                opacity: this.calculateOpacityAccordingToSelectedValue(die.value),
                text: this.buildLabelData(die.value, showDieLabels, dieLabelsSuffix)
            });
        }
    }

    private calculateMaxCharacters(valueLabelsSuffix: string, maxCharacters: number): number {
        return Math.max(2, maxCharacters + valueLabelsSuffix.length);
    }

    private createColorScale(colorsScale: WaferMapColorsScale, isContinuous: boolean): ScaleOrdinal<string, string> | ScaleLinear<string, string> {
        if (isContinuous) {
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

    private buildLabelData(value: number, showDieLabels: boolean, dieLabelsSuffix: string): string {
        if (showDieLabels || !this.dieHasData(value)) {
            return '';
        }
        return `${value}${dieLabelsSuffix}`;
    }

    private dieValueAndSelectedAreEqual(dieValue: number, selectedValue: string | number): boolean {
        return dieValue === selectedValue;
    }

    private calculateOpacityAccordingToSelectedValue(selectedValue: string | number): number {
        return this.highlightedValues
         && this.highlightedValues.length > 0
         && !this.highlightedValues.some(dieValue => this.dieValueAndSelectedAreEqual(dieValue, selectedValue)) ? 0.3 : 0;
    }

    private calculateFillStyle(die: WaferMapDie, isContinuous: boolean): string {
        if (isNaN(+die.value)) {
            return this.nanDieColor;
        }
        if (!this.dieHasData(die.value)) {
            return this.emptyDieColor;
        }
        return !isContinuous ? (this.colorScale as ScaleOrdinal<string, string>)(die.value.toString())
            : (this.colorScale as ScaleLinear<string, string>)(die.value);
    }
}