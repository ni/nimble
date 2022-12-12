import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { ColorRGBA64, parseColor } from '@microsoft/fast-colors';
import { WaferMapColorScaleMode } from '../types';
import type {
    Dimensions,
    Margin,
    DieRenderInfo,
    WaferMapDie,
    WaferMapColorScale
} from '../types';

/**
 * Prerendering prepares render-ready dies data to be used by the rendering module
 */
export class Prerendering {
    public readonly labelsFontSize: number;

    public readonly diesRenderInfo: DieRenderInfo[];

    public readonly d3ColorScale:
    | ScaleOrdinal<string, string>
    | ScaleLinear<string, string>;

    private readonly fontSizeFactor = 0.8;
    private readonly nonHighlightedOpacity = 0.3;
    private readonly emptyDieColor = 'rgba(218,223,236,1)';
    private readonly nanDieColor = 'rgba(122,122,122,1)';

    public constructor(
        dies: Readonly<Readonly<WaferMapDie>[]>,
        colorScale: Readonly<WaferMapColorScale>,
        highlightedValues: Readonly<string[]>,
        horizontalScale: ScaleLinear<number, number>,
        verticalScale: ScaleLinear<number, number>,
        colorScaleMode: Readonly<WaferMapColorScaleMode>,
        dieLabelsHidden: Readonly<boolean>,
        dieLabelsSuffix: Readonly<string>,
        maxCharacters: Readonly<number>,
        dieDimensions: Readonly<Dimensions>,
        margin: Readonly<Margin>
    ) {
        this.d3ColorScale = this.createD3ColorScale(colorScale, colorScaleMode);

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
                    colorScaleMode,
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

    private createD3ColorScale(
        colorScale: WaferMapColorScale,
        colorScaleMode: WaferMapColorScaleMode
    ): ScaleOrdinal<string, string> | ScaleLinear<string, string> {
        if (this.isColorScaleLinear(colorScaleMode)) {
            return scaleLinear<string, string>()
                .domain(colorScale.values.map(item => +item))
                .range(colorScale.colors);
        }
        return scaleOrdinal<string, string>()
            .domain(colorScale.values)
            .range(colorScale.colors);
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
        colorScaleMode: WaferMapColorScaleMode
    ): this is { d3ColorScale: ScaleLinear<string, string> } {
        return colorScaleMode === WaferMapColorScaleMode.linear;
    }

    private isColorScaleOrdinal(
        colorScaleMode: WaferMapColorScaleMode
    ): this is { d3ColorScale: ScaleOrdinal<string, string> } {
        return colorScaleMode === WaferMapColorScaleMode.ordinal;
    }

    private calculateFillStyle(
        value: string,
        colorScaleMode: WaferMapColorScaleMode,
        highlightedValues: Readonly<string[]>
    ): string {
        let colorValue: string = this.emptyDieColor;
        if (this.dieHasData(value)) {
            if (isNaN(+value)) {
                colorValue = this.nanDieColor;
            } else if (this.isColorScaleLinear(colorScaleMode)) {
                colorValue = this.d3ColorScale(+value);
            } else if (this.isColorScaleOrdinal(colorScaleMode)) {
                colorValue = this.d3ColorScale(value);
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
