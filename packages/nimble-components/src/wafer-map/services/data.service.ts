import { ScaleLinear, scaleLinear, scaleBand, ScaleOrdinal, scaleOrdinal } from 'd3-scale';
import type { WaferMapColorsScale } from '../data-types/WaferMapColorsScale';
import type { WaferMapDie } from '../data-types/WaferMapDie';
import type { WaferMapMetadata } from '../data-types/WaferMapMetadata';
import type { WaferMapRenderingObject } from '../data-types/WaferMapRenderingObject';
import { Orientation, Quadrant, WaferColorByOptions } from '../types';

interface RenderDie {
    x: number;
    y: number;
    fillStyle: string;
    opacity: number;
    text: string;
}

interface Point {
    x: number;
    y: number;
}

interface Dimensions {
    origin: Point;
    rows: number;
    cols: number;
}

/**
 * Data
 */
export class Data {
    public containerHeight = 0; // prev height
    public containerWidth = 0; // prev width
    public dieHeight = 0; // prev gridHeight
    public dieWidth = 0; // prev gridWidth
    public margin = { top: 20, right: 20, bottom: 20, left: 20 };
    public radius = 0;

    public labelsFontSize = 0;

    public renderDies: RenderDie[];

    public colorScale: ScaleOrdinal<string, string> | ScaleLinear<string, string>;
    public horizontalScale: ScaleLinear<number, number>;
    public verticalScale: ScaleLinear<number, number>;

    private readonly colorBy: WaferColorByOptions;
    private readonly highlightedValues!: string[];

    private readonly canvasHeight;
    private readonly canvasWidth;

    private readonly maxCharacters;
    private readonly fontSizeFactor = 0.8;

    private readonly baseMargin = { top: 20, right: 20, bottom: 20, left: 20 };

    private readonly emptyDieColor = '#DADFEC';
    private readonly nanDieColor = '#7a7a7a';
    private readonly isCategorical: boolean;

    public constructor(
        dies: WaferMapDie[],
        colorBy: WaferColorByOptions,
        colorsScale: WaferMapColorsScale,
        highlightedValues: string[],
        axisLocation: Quadrant,
        isCategorical: boolean,
        maxCharacters: number,
        canvasHeight: number,
        canvasWidth: number
    ) {
        this.colorBy = colorBy;
        this.highlightedValues = highlightedValues;
        this.isCategorical = isCategorical;
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;

        this.maxCharacters = Math.max(2, !this.isCategorical && this.colorBy !== WaferColorByOptions.floatValue
            ? maxCharacters + 1 /* take the percentage in count */
            : maxCharacters);

        this.colorScale = this.createColorScale(colorsScale);
        const gridDimensions = this.calculateDimensions(dies);

        this.containerWidth = this.canvasWidth - this.margin.left - this.margin.right;
        this.containerHeight = this.canvasHeight - this.margin.top - this.margin.bottom;
        this.horizontalScale = this.createHorizontalScale(axisLocation, gridDimensions);
        this.dieWidth = this.calculateGridWidth(gridDimensions.cols);

        this.radius = (this.containerWidth / 2) + this.dieWidth * 1.5;
        if (this.radius > this.canvasWidth / 2) {
            this.margin = this.getMarginWithAddition(this.radius - this.canvasWidth / 2);
            this.containerWidth = this.canvasWidth - this.margin.left - this.margin.right;
            this.containerHeight = this.canvasHeight - this.margin.top - this.margin.bottom;
            this.horizontalScale = this.createHorizontalScale(axisLocation, gridDimensions);
            this.dieWidth = this.calculateGridWidth(gridDimensions.cols);
        }

        this.verticalScale = this.createVerticalScale(axisLocation, gridDimensions);
        this.dieHeight = this.calculateGridHeight(gridDimensions.rows);

        this.labelsFontSize = Math.min(this.dieHeight, this.dieWidth / (this.maxCharacters * 0.5) * this.fontSizeFactor);

        this.renderDies = this.parseRenderDies(dies);
    }

    public getMainCircleLocation(): { x: number, y: number } {
        return { x: (this.containerWidth / 2), y: (this.containerHeight / 2) };
    }

    private calculateDimensions(dies: WaferMapDie[]): Dimensions {
        if (dies === undefined || dies.length === 0 || dies[0] === undefined) return { origin: { x: 0, y: 0 }, rows: 0, cols: 0 };

        const minPoint = { x: dies[0].x, y: dies[0].y };
        const maxPoint = { x: dies[0].x, y: dies[0].y };

        for (const die of dies) {
            if (die.x < minPoint.x) minPoint.x = die.x;
            if (die.y < minPoint.y) minPoint.y = die.y;
            if (die.x > maxPoint.x) maxPoint.x = die.x;
            if (die.y > maxPoint.y) maxPoint.y = die.y;
        }

        return { origin: minPoint, rows: maxPoint.y - minPoint.y + 1, cols: maxPoint.x - minPoint.x + 1 };
    }

    private createColorScale(colorsScale: WaferMapColorsScale): ScaleOrdinal<string, string> | ScaleLinear<string, string> {
        if (this.isCategorical) {
            return scaleOrdinal<string, string>()
                .domain(colorsScale.values)
                .range(colorsScale.colors);
        }
        return scaleLinear<string, string>()
            .domain(colorsScale.values.map(item => parseInt(item, 10)))
            .range(colorsScale.colors);
    }

    private createHorizontalScale(axisLocation: Quadrant, grid: Dimensions): ScaleLinear<number, number> {
        if (axisLocation === Quadrant.bottomLeft || axisLocation === Quadrant.topLeft) {
            return scaleLinear()
                .domain([grid.origin.x, grid.origin.x + grid.cols])
                .range([0, this.containerWidth]);
        }
        return scaleLinear()
            .domain([grid.origin.x - 1, grid.origin.x + grid.cols - 1])
            .range([this.containerWidth, 0]);
    }

    private createVerticalScale(axisLocation: Quadrant, grid: Dimensions): ScaleLinear<number, number> {
        if (axisLocation === Quadrant.bottomLeft || axisLocation === Quadrant.bottomRight) {
            return scaleLinear()
                .domain([grid.origin.y - 1, grid.origin.y + grid.rows - 1])
                .range([this.containerHeight, 0]);
        }
        return scaleLinear()
            .domain([grid.origin.y, grid.origin.y + grid.rows])
            .range([0, this.containerHeight]);
    }

    private calculateGridWidth(cols: number): number {
        return scaleBand<number>()
            .align(0.5)
            .padding(0)
            .domain(this.horizontalScale.ticks(cols))
            .range([0, this.containerWidth])
            .bandwidth();
    }

    private calculateGridHeight(rows: number): number {
        return scaleBand<number>()
            .align(0.5)
            .padding(0)
            .domain(this.verticalScale.ticks(rows))
            .range([0, this.containerHeight])
            .bandwidth();
    }

    private getMarginWithAddition(baseAddition = 0): { top: number, right: number, bottom: number, left: number } {
        return {
            top: this.baseMargin.top + baseAddition,
            right: this.baseMargin.right + baseAddition,
            bottom: this.baseMargin.bottom + baseAddition,
            left: this.baseMargin.top + baseAddition
        };
    }

    private dieHasData(dieData: string | number): boolean {
        return dieData !== null && dieData !== undefined && dieData !== '';
    }

    private buildLabelData(data: string | number): string {
        if (!this.dieHasData(data) || (this.isCategorical && this.colorBy === WaferColorByOptions.binType)) {
            return '';
        }
        const dataLabelsSuffix = !this.isCategorical && this.colorBy !== WaferColorByOptions.floatValue ? '%' : '';
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

    private parseRenderDies(dies: WaferMapDie[]): RenderDie[] {
        const renderDies: RenderDie[] = [];
        for (const die of dies) {
            const defaultColor = isNaN(+die.data) ? this.nanDieColor : this.emptyDieColor;
            renderDies.push({
                x: this.horizontalScale(die.x) + this.margin.right,
                y: this.verticalScale(die.y) + this.margin.top,
                fillStyle: this.dieHasData(die.data) ? this.colorScale(die.data as string & { valueOf(): number }) : defaultColor,
                opacity: this.getOpacityAccordingToSelectedValue(die.data),
                text: this.buildLabelData(die.data)
            });
        }
        return renderDies;
    }
}