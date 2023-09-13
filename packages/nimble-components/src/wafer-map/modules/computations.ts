import { range } from 'd3-array';
import { ScaleBand, scaleBand, scaleQuantile, ScaleQuantile } from 'd3-scale';
import type { WaferMap } from '..';
import type { WaferMapDie } from '../types';
import { Dimensions, Margin, WaferMapOriginLocation } from '../types';

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
    public get containerDimensions(): Dimensions {
        return this._containerDimensions;
    }

    public get dieDimensions(): Dimensions {
        return this._dieDimensions;
    }

    public get radius(): number {
        return this._radius;
    }

    public get margin(): Margin {
        return this._margin;
    }

    public get horizontalScale(): ScaleBand<number> {
        return this._horizontalScale;
    }

    public get verticalScale(): ScaleBand<number> {
        return this._verticalScale;
    }

    public get invertedHorizontalScale(): ScaleQuantile<number, number> {
        return this._invertedHorizontalScale;
    }

    public get invertedVerticalScale(): ScaleQuantile<number, number> {
        return this._invertedVerticalScale;
    }

    private _containerDimensions!: Dimensions;
    private _dieDimensions!: Dimensions;
    private _radius!: number;
    private _margin!: Margin;
    private _horizontalScale!: ScaleBand<number>;
    private _verticalScale!: ScaleBand<number>;
    private _invertedHorizontalScale!: ScaleQuantile<number, number>;
    private _invertedVerticalScale!: ScaleQuantile<number, number>;
    private readonly defaultPadding = 0;
    private readonly baseMarginPercentage = 0.04;

    public constructor(private readonly wafermap: WaferMap) {}

    public updateContainerDimensions(): void {
        const canvasDimensions = {
            width: this.wafermap.canvasWidth,
            height: this.wafermap.canvasHeight
        };
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
        this._margin = this.calculateMarginAddition(baseMargin, canvasMargin);
        this._containerDimensions = this.calculateContainerDimensions(
            canvasDimensions,
            this._margin
        );
        const containerDiameter = Math.min(
            this._containerDimensions.width,
            this._containerDimensions.height
        );
        this._radius = containerDiameter / 2;
        this.updateScales();
    }

    public updateScales(): void {
        const containerDiameter = Math.min(
            this._containerDimensions.width,
            this._containerDimensions.height
        );
        const gridDimensions = this.gridDimensionsValidAndDefined()
            ? this.calculateGridDimensionsFromBoundingBox()
            : this.calculateGridDimensionsFromDies(this.wafermap.dies);
        // this scale is used for positioning the dies on the canvas
        const originLocation = this.wafermap.originLocation;
        this._horizontalScale = this.createHorizontalScale(
            originLocation,
            gridDimensions,
            containerDiameter
        );
        this._invertedHorizontalScale = this.createInvertedHorizontalScale(
            originLocation,
            gridDimensions,
            containerDiameter
        );
        // this scale is used for positioning the dies on the canvas
        this._verticalScale = this.createVerticalScale(
            originLocation,
            gridDimensions,
            containerDiameter
        );
        this._invertedVerticalScale = this.createInvertedVerticalScale(
            originLocation,
            gridDimensions,
            containerDiameter
        );
        this._dieDimensions = {
            width: this.horizontalScale.bandwidth(),
            height: this.verticalScale.bandwidth()
        };
    }

    private gridDimensionsValidAndDefined(): boolean {
        return (
            !this.wafermap.validity.invalidGridDimensions
            && typeof this.wafermap.gridMinX === 'number'
            && typeof this.wafermap.gridMinY === 'number'
            && typeof this.wafermap.gridMaxX === 'number'
            && typeof this.wafermap.gridMinX === 'number'
        );
    }

    private calculateGridDimensionsFromBoundingBox(): GridDimensions {
        const gridDimensions = { origin: { x: 0, y: 0 }, rows: 0, cols: 0 };
        if (
            typeof this.wafermap.gridMaxY === 'number'
            && typeof this.wafermap.gridMinY === 'number'
            && typeof this.wafermap.gridMaxX === 'number'
            && typeof this.wafermap.gridMinX === 'number'
        ) {
            gridDimensions.origin.x = this.wafermap.gridMinX;
            gridDimensions.origin.y = this.wafermap.gridMinY;
            gridDimensions.rows = this.wafermap.gridMaxY - this.wafermap.gridMinY + 1;
            gridDimensions.cols = this.wafermap.gridMaxX - this.wafermap.gridMinX + 1;
        }
        return gridDimensions;
    }

    private calculateGridDimensionsFromDies(
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
        originLocation: WaferMapOriginLocation,
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
            originLocation === WaferMapOriginLocation.bottomLeft
            || originLocation === WaferMapOriginLocation.topLeft
        ) {
            return scale.range([0, containerWidth]);
        }
        return scale.range([containerWidth, 0]);
    }

    private createInvertedHorizontalScale(
        originLocation: WaferMapOriginLocation,
        grid: GridDimensions,
        containerWidth: number
    ): ScaleQuantile<number, number> {
        const scale = scaleQuantile().domain([0, containerWidth]);
        if (
            originLocation === WaferMapOriginLocation.bottomLeft
            || originLocation === WaferMapOriginLocation.topLeft
        ) {
            return scale.range(range(grid.origin.x, grid.origin.x + grid.cols));
        }
        return scale.range(
            range(grid.origin.x, grid.origin.x + grid.cols).reverse()
        );
    }

    private createVerticalScale(
        originLocation: WaferMapOriginLocation,
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
            originLocation === WaferMapOriginLocation.bottomLeft
            || originLocation === WaferMapOriginLocation.bottomRight
        ) {
            return scale.range([0, containerHeight]);
        }
        return scale.range([containerHeight, 0]);
    }

    private createInvertedVerticalScale(
        originLocation: WaferMapOriginLocation,
        grid: GridDimensions,
        containerHeight: number
    ): ScaleQuantile<number, number> {
        const scale = scaleQuantile().domain([0, containerHeight]);
        if (
            originLocation === WaferMapOriginLocation.bottomLeft
            || originLocation === WaferMapOriginLocation.bottomRight
        ) {
            return scale.range(range(grid.origin.y, grid.origin.y + grid.rows));
        }
        return scale.range(
            range(grid.origin.y, grid.origin.y + grid.rows).reverse()
        );
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
