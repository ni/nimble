import { ScaleLinear, scaleLinear, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import { ColorRGBA64, parseColor } from '@microsoft/fast-colors';
import { WaferMapColorScaleMode } from '../types';
import type {
    Dimensions,
    DieRenderInfo,
    WaferMapColorScale,
    WaferMapDie
} from '../types';
import type { WaferMap } from '..';
import type { DataManager } from './data-manager';

/**
 * Prerendering prepares render-ready dies data to be used by the rendering module
 */
export class Prerendering {
    public get labelsFontSize(): number {
        return this._labelsFontSize;
    }

    public get diesRenderInfo(): DieRenderInfo[] {
        return this._diesRenderInfo;
    }

    public d3ColorScale!:
    | ScaleOrdinal<string, string>
    | ScaleLinear<string, string>;

    private _labelsFontSize!: number;
    private _diesRenderInfo!: DieRenderInfo[];

    private readonly fontSizeFactor = 0.8;
    private readonly nonHighlightedOpacity = 0.3;
    private readonly emptyDieColor = 'rgba(218,223,236,1)';
    private readonly nanDieColor = 'rgba(122,122,122,1)';

    public constructor(
        private readonly wafermap: WaferMap,
        private readonly dataManager: Readonly<DataManager>
    ) {}

    public updateLabelsFontSize(): void {
        this._labelsFontSize = this.calculateLabelsFontSize(
            this.dataManager.dieDimensions,
            this.wafermap.maxCharacters
        );
        this.updateDiesRenderInfo();
    }

    public updateDiesRenderInfo(): void {
        this.d3ColorScale = this.createD3ColorScale(
            this.wafermap.colorScale,
            this.wafermap.colorScaleMode
        );
        this._diesRenderInfo = this.wafermap.dies
            .map(die => this.computeDieRenderInfo(die))
            .filter(info => info !== null) as DieRenderInfo[];
    }

    private computeDieRenderInfo(die: WaferMapDie): DieRenderInfo | null {
        const margin = this.dataManager.margin;

        const scaledX = this.dataManager.horizontalScale(die.x);
        const scaledY = this.dataManager.verticalScale(die.y);

        if (scaledX === undefined || scaledY === undefined) {
            return null;
        }

        return {
            x: scaledX + margin.right,
            y: scaledY + margin.top,
            fillStyle: this.calculateFillStyle(
                die.value,
                this.wafermap.colorScaleMode,
                this.wafermap.highlightedTags,
                die.tags
            ),
            text: this.buildLabel(
                die.value,
                this.wafermap.maxCharacters,
                this.wafermap.dieLabelsHidden,
                this.wafermap.dieLabelsSuffix
            )
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
        dieTags?: string[],
        highlightedTags?: string[]
    ): number {
        if (!highlightedTags || highlightedTags.length === 0) {
            return 1;
        }
        const highlightedSet = new Set(highlightedTags);

        if (dieTags?.some(dieTag => highlightedSet.has(dieTag))) {
            return 1;
        }

        return this.nonHighlightedOpacity;
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
        highlightedTags?: string[],
        dieTags?: string[]
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
            this.calculateOpacity(dieTags, highlightedTags)
        );
        return rgbColor.toStringWebRGBA();
    }
}
