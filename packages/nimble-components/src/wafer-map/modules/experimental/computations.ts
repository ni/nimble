import { scaleLinear, ScaleLinear } from 'd3-scale';
import type { WaferMap } from '../..';
import { Dimensions, Margin, WaferMapOriginLocation } from '../../types';

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

    public get margin(): Margin {
        return this._margin;
    }

    public get horizontalScale(): ScaleLinear<number, number> {
        return this._horizontalScale;
    }

    public get verticalScale(): ScaleLinear<number, number> {
        return this._verticalScale;
    }

    private _containerDimensions!: Dimensions;
    private _dieDimensions!: Dimensions;
    private _margin!: Margin;
    private _horizontalScale!: ScaleLinear<number, number>;
    private _verticalScale!: ScaleLinear<number, number>;
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
        this.updateScales();
    }

    public updateScales(): void {
        const containerDiameter = Math.min(
            this._containerDimensions.width,
            this._containerDimensions.height
        );
        const gridDimensions = this.gridDimensionsValidAndDefined()
            ? this.calculateGridDimensionsFromBoundingBox()
            : this.calculateGridDimensionsFromDies();
        // this scale is used for positioning the dies on the canvas
        const originLocation = this.wafermap.originLocation;
        this._horizontalScale = this.createHorizontalScale(
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
        this._dieDimensions = {
            width: Math.abs(this.horizontalScale(0) - this.horizontalScale(1)),
            height: Math.abs(this.verticalScale(0) - this.verticalScale(1))
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

    private calculateGridDimensionsFromDies(): GridDimensions {
        if (this.wafermap.diesTable === undefined) {
            return { origin: { x: 0, y: 0 }, rows: 0, cols: 0 };
        }

        const colIndex = this.wafermap.diesTable
            .getChild('colIndex')!
            .toArray() as Int32Array;
        const rowIndex = this.wafermap.diesTable
            .getChild('rowIndex')!
            .toArray() as Int32Array;

        const minPoint = { x: colIndex[0]!, y: rowIndex[0]! };
        const maxPoint = { x: colIndex[0]!, y: rowIndex[0]! };

        // will replace iterating with arquero derive after fixing errors
        for (let i = 0; i < colIndex.length; i++) {
            if (colIndex[i]! < minPoint.x) {
                minPoint.x = colIndex[i]!;
            }
            if (colIndex[i]! > maxPoint.x) {
                maxPoint.x = colIndex[i]!;
            }
            if (rowIndex[i]! < minPoint.y) {
                minPoint.y = rowIndex[i]!;
            }
            if (rowIndex[i]! > maxPoint.y) {
                maxPoint.y = rowIndex[i]!;
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
    ): ScaleLinear<number, number> {
        const scale = scaleLinear<number, number>();
        if (
            originLocation === WaferMapOriginLocation.bottomLeft
            || originLocation === WaferMapOriginLocation.topLeft
        ) {
            return scale
                .domain([grid.origin.x, grid.origin.x + grid.cols])
                .range([0, containerWidth]);
        }
        return scale
            .domain([grid.origin.x - 1, grid.origin.x + grid.cols - 1])
            .range([containerWidth, 0]);
    }

    private createVerticalScale(
        originLocation: WaferMapOriginLocation,
        grid: GridDimensions,
        containerHeight: number
    ): ScaleLinear<number, number> {
        const scale = scaleLinear<number, number>();
        // html canvas has top-left origin https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#the_grid
        // we need to flip the vertical scale
        if (
            originLocation === WaferMapOriginLocation.bottomLeft
            || originLocation === WaferMapOriginLocation.bottomRight
        ) {
            return scale
                .domain([grid.origin.y - 1, grid.origin.y + grid.rows - 1])
                .range([containerHeight, 0]);
        }
        return scale
            .domain([grid.origin.y, grid.origin.y + grid.rows])
            .range([0, containerHeight]);
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
