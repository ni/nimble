import { scaleBand, ScaleLinear, scaleLinear } from 'd3-scale';
import type { WaferMapDie } from '../types';
import { Dimensions, Margin, WaferMapQuadrant } from '../types';

interface GridDimensions {
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
    public containerDimensions!: Dimensions;
    public dieDimensions!: Dimensions;
    public radius: number;
    public margin: Margin;

    public horizontalScale!: ScaleLinear<number, number>;
    public verticalScale!: ScaleLinear<number, number>;

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
        // debugger;
        const gridDimensions = this.calculateGridDimensions(dies);

        const canvasDiameter = Math.min(canvasDimensions.width, canvasDimensions.height);

        const canvasMargin = {
            top: (canvasDimensions.height - canvasDiameter) / 2,
            right: (canvasDimensions.width - canvasDiameter) / 2,
            bottom: (canvasDimensions.height - canvasDiameter) / 2,
            left: (canvasDimensions.width - canvasDiameter) / 2
        };
        this.radius = 0;
        this.margin = this.calculateMarginAddition(this.baseMargin, canvasMargin);

        this.computeDisplayDimensions(axisLocation, gridDimensions, canvasDimensions);

        while (this.radius > canvasDiameter / 2) {
            this.margin = this.calculateMarginAddition(this.margin, {
                top: this.radius - canvasDiameter / 2,
                right: this.radius - canvasDiameter / 2,
                bottom: this.radius - canvasDiameter / 2,
                left: this.radius - canvasDiameter / 2
            });
            this.computeDisplayDimensions(axisLocation, gridDimensions, canvasDimensions);
        }
    }

    private computeDisplayDimensions(
        axisLocation: Readonly<WaferMapQuadrant>,
        gridDimensions: GridDimensions,
        canvasDimensions: Readonly<Dimensions>
    ): void {
        this.containerDimensions = this.calculateContainerDimensions(
            canvasDimensions,
            this.margin
        );
        const containerDiameter = Math.min(this.containerDimensions.width, this.containerDimensions.height);

        this.horizontalScale = this.createHorizontalScale(
            axisLocation,
            gridDimensions,
            containerDiameter
        );

        this.verticalScale = this.createVerticalScale(
            axisLocation,
            gridDimensions,
            containerDiameter
        );
        this.dieDimensions = {
            width: this.calculateGridWidth(
                gridDimensions.cols,
                containerDiameter
            ),
            height: this.calculateGridHeight(
                gridDimensions.rows,
                containerDiameter
            )
        };
        const dieDiameter = Math.min(this.dieDimensions.width, this.dieDimensions.height);
        this.radius = containerDiameter / 2 + dieDiameter * this.dieSizeFactor;
    }

    private calculateGridDimensions(
        dies: Readonly<Readonly<WaferMapDie>[]>
    ): GridDimensions {
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
        grid: GridDimensions,
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
        grid: GridDimensions,
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

    private calculateMarginAddition(baseMargin: Margin, addedMargin: Margin): Margin {
        return {
            top: baseMargin.top + addedMargin.top,
            right: baseMargin.right + addedMargin.right,
            bottom: baseMargin.bottom + addedMargin.bottom,
            left: baseMargin.left + addedMargin.left
        };
    }
}
