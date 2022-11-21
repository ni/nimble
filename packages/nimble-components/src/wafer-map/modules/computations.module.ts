import { scaleBand, ScaleLinear, scaleLinear } from 'd3-scale';
import type { WaferMapDie } from '../data-types/WaferMapDie';
import { Dimensions, Margin, Quadrant } from '../types';

interface MapDimensions {
    origin: {
        x: number,
        y: number
    };
    rows: number;
    cols: number;
}

/**
 * Computations module
 */
export class Computations {
    public containerDimensions: Dimensions;
    public dieDimensions: Dimensions = { width: 0, height: 0 };
    public radius: number;
    public margin: Margin = { top: 20, right: 20, bottom: 20, left: 20 };

    public horizontalScale: ScaleLinear<number, number>;
    public verticalScale: ScaleLinear<number, number>;

    private readonly baseMargin: Margin = { top: 20, right: 20, bottom: 20, left: 20 };

    public constructor(
        dies: WaferMapDie[],
        axisLocation: Quadrant,
        canvasDimensions: Dimensions,
    ) {
        const gridMapDimensions = this.calculateMapDimensions(dies);

        this.containerDimensions = this.getContainerDimensions(canvasDimensions, this.margin);
        this.horizontalScale = this.createHorizontalScale(axisLocation, gridMapDimensions, this.containerDimensions.width);
        this.dieDimensions.width = this.calculateGridWidth(gridMapDimensions.cols, this.containerDimensions.width);

        this.radius = (this.containerDimensions.width / 2) + this.dieDimensions.width * 1.5;
        if (this.radius > canvasDimensions.width / 2) {
            this.margin = this.getMarginWithAddition(this.radius - canvasDimensions.width / 2);
            this.containerDimensions = this.getContainerDimensions(canvasDimensions, this.margin);
            this.horizontalScale = this.createHorizontalScale(axisLocation, gridMapDimensions, this.containerDimensions.width);
            this.dieDimensions.width = this.calculateGridWidth(gridMapDimensions.cols, this.containerDimensions.width);
            this.radius = (this.containerDimensions.width / 2) + this.dieDimensions.width * 1.5;
        }

        this.verticalScale = this.createVerticalScale(axisLocation, gridMapDimensions, this.containerDimensions.height);
        this.dieDimensions.height = this.calculateGridHeight(gridMapDimensions.rows, this.containerDimensions.height);
    }

    private calculateMapDimensions(dies: WaferMapDie[]): MapDimensions {
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

    private getContainerDimensions(canvasDimensions: Dimensions, margin: Margin): Dimensions {
        return {
            width: canvasDimensions.width - margin.left - margin.right,
            height: canvasDimensions.height - margin.top - margin.bottom
        };
    }

    private createHorizontalScale(axisLocation: Quadrant, grid: MapDimensions, containerWidth: number): ScaleLinear<number, number> {
        if (axisLocation === Quadrant.bottomLeft || axisLocation === Quadrant.topLeft) {
            return scaleLinear()
                .domain([grid.origin.x, grid.origin.x + grid.cols])
                .range([0, containerWidth]);
        }
        return scaleLinear()
            .domain([grid.origin.x - 1, grid.origin.x + grid.cols - 1])
            .range([containerWidth, 0]);
    }

    private createVerticalScale(axisLocation: Quadrant, grid: MapDimensions, containerHeight: number): ScaleLinear<number, number> {
        if (axisLocation === Quadrant.bottomLeft || axisLocation === Quadrant.bottomRight) {
            return scaleLinear()
                .domain([grid.origin.y - 1, grid.origin.y + grid.rows - 1])
                .range([containerHeight, 0]);
        }
        return scaleLinear()
            .domain([grid.origin.y, grid.origin.y + grid.rows])
            .range([0, containerHeight]);
    }

    private calculateGridWidth(cols: number, containerWidth: number): number {
        return scaleBand<number>()
            .align(0.5)
            .padding(0)
            .domain(this.horizontalScale.ticks(cols))
            .range([0, containerWidth])
            .bandwidth();
    }

    private calculateGridHeight(rows: number, containerHeight: number): number {
        return scaleBand<number>()
            .align(0.5)
            .padding(0)
            .domain(this.verticalScale.ticks(rows))
            .range([0, containerHeight])
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
}