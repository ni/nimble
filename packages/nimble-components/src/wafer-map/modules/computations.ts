import { range } from 'd3-array';
import { ScaleBand, scaleBand, scaleQuantile, ScaleQuantile } from 'd3-scale';
import type { WaferMap } from '..';
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
    public readonly containerDimensions: Dimensions;
    public readonly dieDimensions: Dimensions;
    public readonly radius: number;
    public readonly margin: Margin;

    public readonly horizontalScale: ScaleBand<number>;
    public readonly verticalScale: ScaleBand<number>;

    public readonly invertedHorizontalScale: ScaleQuantile<number, number>;
    public readonly invertedVerticalScale: ScaleQuantile<number, number>;

    private readonly defaultPadding = 0;
    private readonly baseMarginPercentage = 0.04;

    public constructor(wafermap: WaferMap) {
        const canvasDimensions = {
            width: wafermap.clientWidth,
            height: wafermap.clientHeight
        };
        const gridDimensions = this.calculateGridDimensions(wafermap.dies);
        const canvasDiameter = Math.min(
            canvasDimensions.width,
            canvasDimensions.height
        );
        const canvasMargin = {
            top: (canvasDimensions.height - canvasDiameter) / 2,
            right: (canvasDimensions.width - canvasDiameter) / 2,
            bottom: (canvasDimensions.height - canvasDiameter) / 2,
            left: (canvasDimensions.width - canvasDiameter) / 2
        };
        const baseMargin = {
            top: canvasDiameter * this.baseMarginPercentage,
            right: canvasDiameter * this.baseMarginPercentage,
            bottom: canvasDiameter * this.baseMarginPercentage,
            left: canvasDiameter * this.baseMarginPercentage
        };
        this.margin = this.calculateMarginAddition(baseMargin, canvasMargin);
        this.containerDimensions = this.calculateContainerDimensions(
            canvasDimensions,
            this.margin
        );
        const containerDiameter = Math.min(
            this.containerDimensions.width,
            this.containerDimensions.height
        );
        // this scale is used for positioning the dies on the canvas
        this.horizontalScale = this.createHorizontalScale(
            wafermap.quadrant,
            gridDimensions,
            containerDiameter
        );
        this.invertedHorizontalScale = this.createInvertedHorizontalScale(
            wafermap.quadrant,
            gridDimensions,
            containerDiameter
        );
        // this scale is used for positioning the dies on the canvas
        this.verticalScale = this.createVerticalScale(
            wafermap.quadrant,
            gridDimensions,
            containerDiameter
        );
        this.invertedVerticalScale = this.createInvertedVerticalScale(
            wafermap.quadrant,
            gridDimensions,
            containerDiameter
        );
        this.dieDimensions = {
            width: this.horizontalScale.bandwidth(),
            height: this.verticalScale.bandwidth()
        };
        this.radius = containerDiameter / 2;
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
    ): ScaleBand<number> {
        const scale = scaleBand<number>()
            .domain(range(grid.origin.x, grid.origin.x + grid.cols))
            .paddingInner(0)
            .paddingOuter(0)
            .align(0)
            .round(false);
        if (
            axisLocation === WaferMapQuadrant.bottomLeft
            || axisLocation === WaferMapQuadrant.topLeft
        ) {
            return scale.range([0, containerWidth]);
        }
        return scale.range([containerWidth, 0]);
    }

    private createInvertedHorizontalScale(
        axisLocation: WaferMapQuadrant,
        grid: GridDimensions,
        containerWidth: number
    ): ScaleQuantile<number, number> {
        const scale = scaleQuantile().domain([0, containerWidth]);
        if (
            axisLocation === WaferMapQuadrant.bottomLeft
            || axisLocation === WaferMapQuadrant.topLeft
        ) {
            return scale.range(range(grid.origin.x, grid.origin.x + grid.cols));
        }
        return scale.range(
            range(grid.origin.x, grid.origin.x + grid.cols).reverse()
        );
    }

    private createVerticalScale(
        axisLocation: WaferMapQuadrant,
        grid: GridDimensions,
        containerHeight: number
    ): ScaleBand<number> {
        const scale = scaleBand<number>()
            .domain(range(grid.origin.y, grid.origin.y + grid.rows))
            .paddingInner(this.defaultPadding)
            .paddingOuter(0)
            .align(0)
            .round(false);
        if (
            axisLocation === WaferMapQuadrant.bottomLeft
            || axisLocation === WaferMapQuadrant.bottomRight
        ) {
            return scale.range([containerHeight, 0]);
        }
        return scale.range([0, containerHeight]);
    }

    private createInvertedVerticalScale(
        axisLocation: WaferMapQuadrant,
        grid: GridDimensions,
        containerHeight: number
    ): ScaleQuantile<number, number> {
        const scale = scaleQuantile().domain([0, containerHeight]);
        if (
            axisLocation === WaferMapQuadrant.bottomLeft
            || axisLocation === WaferMapQuadrant.bottomRight
        ) {
            return scale.range(
                range(grid.origin.y, grid.origin.y + grid.rows).reverse()
            );
        }
        return scale.range(range(grid.origin.y, grid.origin.y + grid.rows));
    }

    private calculateMarginAddition(
        baseMargin: Margin,
        addedMargin: Margin
    ): Margin {
        return {
            top: baseMargin.top + addedMargin.top,
            right: baseMargin.right + addedMargin.right,
            bottom: baseMargin.bottom + addedMargin.bottom,
            left: baseMargin.left + addedMargin.left
        };
    }
}
