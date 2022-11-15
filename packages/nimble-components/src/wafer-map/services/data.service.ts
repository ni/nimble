import { ScaleLinear, scaleLinear, scaleBand, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import type { WaferMapColorsScale } from '../data-types/WaferMapColorsScale';
import type { WaferMapMetadata } from '../data-types/WaferMapMetadata';
import type { WaferMapRenderingObject } from '../data-types/WaferMapRenderingObject';
import { Quadrant, WaferColorByOptions } from '../types';

type MetaDie = {
    'x': number,
    'y': number,
    'fillStyle': string,
    'width': number,
    'height': number,
    'opacity': number,
    'text': string
};

/**
 * Data
 */
export class Data {
    private readonly waferData: WaferMapRenderingObject;
    private readonly colorBy: WaferColorByOptions;
    private readonly colorsScale: WaferMapColorsScale;
    private readonly highlightedValues!: string[];

    private readonly dice: MetaDie[] = [];

    private width = 0;
    private height = 0;
    private readonly canvasWidth = 0;
    private readonly canvasHeight = 0;
    private gridWidth = 0;
    private gridHeight = 0;

    private colorScale!: ScaleOrdinal<string, string> | ScaleLinear<string, string>;
    private xScale!: ScaleLinear<number, number>;
    private yScale!: ScaleLinear<number, number>;

    private radius = 0;
    private labelsFontSize = 0;
    private readonly maxCharacters = 0;
    private readonly fontSizeFactor = 0;
    private readonly baseMargin = { top: 20, right: 20, bottom: 20, left: 20 };
    private margin = { top: 20, right: 20, bottom: 20, left: 20 };
    private dataLabelsSuffix = '';

    private readonly emptyDieColor = '#DADFEC';
    private readonly nanDieColor = '#7a7a7a';

    public constructor(
        waferData: WaferMapRenderingObject,
        colorBy: WaferColorByOptions,
        colorsScale: WaferMapColorsScale,
        highlightedValues: string[]
    ) {
        this.waferData = waferData;
        this.colorBy = colorBy;
        this.colorsScale = colorsScale;
        this.highlightedValues = highlightedValues;
        this.dataBind();
    }

    private dieHasData(dieData: string | number): boolean {
        return dieData !== null && dieData !== undefined && dieData !== '';
    }

    private buildLabelData(data: string | number): string {
        if (!this.dieHasData(data) || (/* this.isCategorical && */ this.colorBy === WaferColorByOptions.binType)) {
            return '';
        }

        return `${data}${this.dataLabelsSuffix}`;
    }

    private dieValueAndSelectedAreEqual(dieValue: string | number, selectedValue: string | number): boolean {
        return dieValue.toString() === selectedValue.toString();
    }

    private getOpacityAccordingToSelectedValued(selectedValue: string | number): number {
        return this.highlightedValues
         && this.highlightedValues.length > 0
         && !this.highlightedValues.some(dieValue => this.dieValueAndSelectedAreEqual(dieValue, selectedValue)) ? 0.3 : 0;
    }

    private createColorScale(): void {
        if (this.waferData /* instanceof WafermapCategoricalRenderingObject */) {
            this.colorScale = scaleOrdinal<string, string>()
                .domain(this.colorsScale.values)
                .range(this.colorsScale.colors);
            this.dataLabelsSuffix = '';
        } else {
            this.colorScale = scaleLinear<string, string>()
                .domain(this.colorsScale.values.map(item => parseInt(item, 10)))
                .range(this.colorsScale.colors);

            if (this.colorBy !== WaferColorByOptions.floatValue) {
                this.dataLabelsSuffix = '%';
            }
        }
    }

    private createXScale(metadata: WaferMapMetadata): ScaleLinear<number, number> {
        if (metadata.axisLocation === Quadrant.bottomLeft || metadata.axisLocation === Quadrant.topLeft) {
            return scaleLinear()
                .domain([metadata.origin.x, metadata.origin.x + metadata.cols])
                .range([0, this.width]);
        }
        return scaleLinear()
            .domain([metadata.origin.x - 1, metadata.origin.x + metadata.cols - 1])
            .range([this.width, 0]);
    }

    private createYScale(metadata: WaferMapMetadata): ScaleLinear<number, number> {
        if (metadata.axisLocation === Quadrant.bottomLeft || metadata.axisLocation === Quadrant.bottomRight) {
            return scaleLinear()
                .domain([metadata.origin.y - 1, metadata.origin.y + metadata.rows - 1])
                .range([this.height, 0]);
        }
        return scaleLinear()
            .domain([metadata.origin.y, metadata.origin.y + metadata.rows])
            .range([0, this.height]);
    }

    private calculateGridWidth(metadata: WaferMapMetadata): number {
        return scaleBand<number>()
            .align(0.5)
            .padding(0)
            .domain(this.xScale.ticks(metadata.cols))
            .range([0, this.width])
            .bandwidth();
    }

    private calculateGridHeight(metadata: WaferMapMetadata): number {
        return scaleBand<number>()
            .align(0.5)
            .padding(0)
            .domain(this.yScale.ticks(metadata.rows))
            .range([0, this.height])
            .bandwidth();
    }

    private setMargins(baseAddition = 0): void {
        this.margin = {
            top: this.baseMargin.top + baseAddition,
            right: this.baseMargin.right + baseAddition,
            bottom: this.baseMargin.bottom + baseAddition,
            left: this.baseMargin.top + baseAddition
        };
    }

    private adjustSize(diff: number): void {
        this.setMargins(diff);
        this.width = this.canvasWidth - this.margin.left - this.margin.right;
        this.height = this.canvasHeight - this.margin.top - this.margin.bottom;
        this.buildScales(this.waferData.metadata);
    }

    private buildScales(metadata: WaferMapMetadata): void {
        this.xScale = this.createXScale(metadata);
        this.gridWidth = this.calculateGridWidth(metadata);

        this.radius = (this.width / 2) + this.gridWidth * 1.5;
        if (this.radius > this.canvasWidth / 2) {
            this.adjustSize(this.radius - this.canvasWidth / 2); // should be recursive????
        }

        this.yScale = this.createYScale(metadata);
        this.gridHeight = this.calculateGridHeight(metadata);

        this.labelsFontSize = Math.min(this.gridHeight, this.gridWidth / (this.maxCharacters * 0.5) * this.fontSizeFactor);
    }

    private dataBind(): void {
        this.createColorScale();
        this.buildScales(this.waferData.metadata);

        for (const die of this.waferData.dice) {
            const defaultColor = isNaN(+die.data) ? this.nanDieColor : this.emptyDieColor;
            this.dice.push({
                x: this.xScale(die.x) + this.margin.right,
                y: this.yScale(die.y) + this.margin.top,
                fillStyle: this.dieHasData(die.data) ? this.colorScale(die.data as string & { valueOf(): number }) : defaultColor,
                width: this.gridWidth,
                height: this.gridHeight,
                opacity: this.getOpacityAccordingToSelectedValued(die.data),
                text: this.buildLabelData(die.data)
            });
        }
    }
}