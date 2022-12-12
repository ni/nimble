import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { ColorRGBA64, parseColor } from '@microsoft/fast-colors';
import { WaferMapColorsScaleMode } from '../types';
import type {
    Dimensions,
    Margin,
    DieRenderInfo,
    WaferMapDie,
    WaferMapColorsScale
} from '../types';

/**
 * Prerendering prepares render-ready dies data to be used by the rendering module
 */
export class Prerendering {
    public readonly labelsFontSize: number;

    public readonly diesRenderInfo: DieRenderInfo[];

    public readonly colorScale:
    | ScaleOrdinal<string, string>
    | ScaleLinear<string, string>;

    private readonly fontSizeFactor = 0.8;
    private readonly nonHighlightedOpacity = 0.3;
    private readonly emptyDieColor = 'rgba(218,223,236,1)';
    private readonly nanDieColor = 'rgba(122,122,122,1)';

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

        this.diesRenderInfo = [];
        for (const die of dies) {
            this.diesRenderInfo.push({
                x: horizontalScale(die.x) + margin.right,
                y: verticalScale(die.y) + margin.top,
                fillStyle: this.calculateFillStyle(
                    die.value,
                    colorsScaleMode,
                    highlightedValues
                ),
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
        if (this.isColorScaleLinear(colorsScaleMode)) {
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
            : 1;
    }

    private isColorScaleLinear(
        colorsScaleMode: WaferMapColorsScaleMode
    ): this is { colorScale: ScaleLinear<string, string> } {
        return colorsScaleMode === WaferMapColorsScaleMode.linear;
    }

    private isColorScaleOrdinal(
        colorsScaleMode: WaferMapColorsScaleMode
    ): this is { colorScale: ScaleOrdinal<string, string> } {
        return colorsScaleMode === WaferMapColorsScaleMode.ordinal;
    }

    private calculateFillStyle(
        value: string,
        colorsScaleMode: WaferMapColorsScaleMode,
        highlightedValues: Readonly<string[]>
    ): string {
        let colorValue: string = this.emptyDieColor;
        if (this.dieHasData(value)) {
            if (isNaN(+value)) {
                colorValue = this.nanDieColor;
            } else if (this.isColorScaleLinear(colorsScaleMode)) {
                colorValue = this.colorScale(+value);
            } else if (this.isColorScaleOrdinal(colorsScaleMode)) {
                colorValue = this.colorScale(value);
            }
        }
        if (colorValue === undefined) {
            return this.emptyDieColor;
        }
        let rgbColor: ColorRGBA64 | null = parseColor(colorValue);
        if (rgbColor === null) {
            return this.emptyDieColor;
        }
        rgbColor = new ColorRGBA64(
            rgbColor.r,
            rgbColor.g,
            rgbColor.b,
            this.calculateOpacity(value, highlightedValues)
        );
        return rgbColor.toStringWebRGBA();
    }
}
