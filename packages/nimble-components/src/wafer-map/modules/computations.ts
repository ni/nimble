import { scaleBand, ScaleLinear, scaleLinear } from 'd3-scale';
import type { WaferMapDie } from '../types';
import { Dimensions, Margin, WaferMapQuadrant } from '../types';

interface MapDimensions {
    origin: {
        x: number,
        y: number
    };
    rows: number;
    cols: number;
}

/**
 * Computations calculates and stores different measures which are used in the Wafermap
 */
export class Computations {
    public readonly containerDimensions: Dimensions;
    public readonly dieDimensions: Dimensions;
    public readonly radius: number;
    public readonly margin: Margin;

    public readonly horizontalScale: ScaleLinear<number, number>;
    public readonly verticalScale: ScaleLinear<number, number>;

    private readonly baseMargin: Margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    } as const;

    private readonly dieSizeFactor = 1.5;
    private readonly defaultAlign = 0.5;

    public constructor(
        dies: Readonly<Readonly<WaferMapDie>[]>,
        axisLocation: Readonly<WaferMapQuadrant>,
        canvasDimensions: Readonly<Dimensions>
    ) {
        const gridMapDimensions = this.calculateMapDimensions(dies);

        const canvasDiameter = Math.min(canvasDimensions.width, canvasDimensions.height);

        const canvasMargin = {
            top: (canvasDimensions.height - canvasDiameter) / 2,
            right: (canvasDimensions.width - canvasDiameter) / 2,
            bottom: (canvasDimensions.height - canvasDiameter) / 2,
            left: (canvasDimensions.width - canvasDiameter) / 2
        };
        this.margin = this.calculateMarginWithAddition(canvasMargin);

        this.containerDimensions = this.calculateContainerDimensions(
            canvasDimensions,
            this.margin
        );
        const containerDiameter = Math.min(this.containerDimensions.width, this.containerDimensions.height);

        this.horizontalScale = this.createHorizontalScale(
            axisLocation,
            gridMapDimensions,
            containerDiameter
        );
        this.dieDimensions = {
            width: this.calculateGridWidth(
                gridMapDimensions.cols,
                containerDiameter
            ),
            height: 0
        };
        let dieDiameter = Math.min(this.dieDimensions.width, this.dieDimensions.height);

        this.radius = containerDiameter / 2 + dieDiameter * this.dieSizeFactor;
        if (this.radius > canvasDiameter / 2) {
            this.margin = this.calculateMarginWithAddition({
                top: canvasMargin.top + this.radius - canvasDiameter / 2,
                right: canvasMargin.right + this.radius - canvasDiameter / 2,
                bottom: canvasMargin.bottom + this.radius - canvasDiameter / 2,
                left: canvasMargin.left + this.radius - canvasDiameter / 2
            });
            this.containerDimensions = this.calculateContainerDimensions(
                canvasDimensions,
                this.margin
            );
            this.horizontalScale = this.createHorizontalScale(
                axisLocation,
                gridMapDimensions,
                containerDiameter
            );
            this.dieDimensions = {
                width: this.calculateGridWidth(
                    gridMapDimensions.cols,
                    containerDiameter
                ),
                height: 0
            };
            dieDiameter = Math.min(this.dieDimensions.width, this.dieDimensions.height);
            this.radius = containerDiameter / 2 + dieDiameter * this.dieSizeFactor;
        }

        this.verticalScale = this.createVerticalScale(
            axisLocation,
            gridMapDimensions,
            containerDiameter
        );
        this.dieDimensions = {
            width: this.dieDimensions.width,
            height: this.calculateGridHeight(
                gridMapDimensions.rows,
                containerDiameter
            )
        };
    }

    private calculateMapDimensions(
        dies: Readonly<Readonly<WaferMapDie>[]>
    ): MapDimensions {
        if (dies.length === 0 || dies[0] === undefined) {
            return { origin: { x: 0, y: 0 }, rows: 0, cols: 0 };
        }

        const minPoint = { x: dies[0].x, y: dies[0].y };
        const maxPoint = { x: dies[0].x, y: dies[0].y };

        for (const die of dies) {
            if (die.x < minPoint.x) {
                minPoint.x = die.x;
            }
            if (die.y < minPoint.y) {
                minPoint.y = die.y;
            }
            if (die.x > maxPoint.x) {
                maxPoint.x = die.x;
            }
            if (die.y > maxPoint.y) {
                maxPoint.y = die.y;
            }
        }

        return {
            origin: minPoint,
            rows: maxPoint.y - minPoint.y + 1,
            cols: maxPoint.x - minPoint.x + 1
        };
    }

    private calculateContainerDimensions(
        canvasDimensions: Dimensions,
        margin: Margin
    ): Dimensions {
        return {
            width: canvasDimensions.width - margin.left - margin.right,
            height: canvasDimensions.height - margin.top - margin.bottom
        };
    }

    private createHorizontalScale(
        axisLocation: WaferMapQuadrant,
        grid: MapDimensions,
        containerWidth: number
    ): ScaleLinear<number, number> {
        if (
            axisLocation === WaferMapQuadrant.bottomLeft
            || axisLocation === WaferMapQuadrant.topLeft
        ) {
            return scaleLinear()
                .domain([grid.origin.x, grid.origin.x + grid.cols])
                .range([0, containerWidth]);
        }
        return scaleLinear()
            .domain([grid.origin.x - 1, grid.origin.x + grid.cols - 1])
            .range([containerWidth, 0]);
    }

    private createVerticalScale(
        axisLocation: WaferMapQuadrant,
        grid: MapDimensions,
        containerHeight: number
    ): ScaleLinear<number, number> {
        if (
            axisLocation === WaferMapQuadrant.bottomLeft
            || axisLocation === WaferMapQuadrant.bottomRight
        ) {
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
            .align(this.defaultAlign)
            .padding(0)
            .domain(this.horizontalScale.ticks(cols))
            .range([0, containerWidth])
            .bandwidth();
    }

    private calculateGridHeight(rows: number, containerHeight: number): number {
        return scaleBand<number>()
            .align(this.defaultAlign)
            .padding(0)
            .domain(this.verticalScale.ticks(rows))
            .range([0, containerHeight])
            .bandwidth();
    }

    private calculateMarginWithAddition(baseAddition = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }): Margin {
        return {
            top: this.baseMargin.top + baseAddition.top,
            right: this.baseMargin.right + baseAddition.right,
            bottom: this.baseMargin.bottom + baseAddition.bottom,
            left: this.baseMargin.top + baseAddition.left
        };
    }
}
