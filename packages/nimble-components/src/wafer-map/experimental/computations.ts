import { scaleLinear, ScaleLinear } from 'd3-scale';
import { ticks } from 'd3-array';
import type { WaferMap } from '..';
import { WaferMapColorScaleMode, WaferMapOriginLocation } from '../types';
import type { ColorScale, Dimensions, Margin } from '../workers/types';

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
    private readonly baseMarginPercentage = 0.04;
    private readonly fontSizeFactor = 0.8;
    private readonly colorScaleResolution = 10;

    public constructor(private readonly wafermap: WaferMap) {}

    public componentResizeUpdate(): void {
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
        this.wafermap.margin = this.calculateMarginAddition(baseMargin, canvasMargin);
        this.wafermap.containerDimensions = this.calculateContainerDimensions(
            canvasDimensions,
            this.wafermap.margin
        );
        this.inputDataUpdate();
    }

    public inputDataUpdate(): void {
        if (this.wafermap.containerDimensions === undefined) {
            this.componentResizeUpdate();
            return;
        }
        const containerDiameter = Math.min(
            this.wafermap.containerDimensions.width,
            this.wafermap.containerDimensions.height
        );
        const gridDimensions = this.gridDimensionsValidAndDefined()
            ? this.calculateGridDimensionsFromBoundingBox()
            : this.calculateGridDimensionsFromDies();
        // this scale is used for positioning the dies on the canvas
        const originLocation = this.wafermap.originLocation;
        this.wafermap.horizontalScale = this.createHorizontalScale(
            originLocation,
            gridDimensions,
            containerDiameter
        );
        // this scale is used for positioning the dies on the canvas
        this.wafermap.verticalScale = this.createVerticalScale(
            originLocation,
            gridDimensions,
            containerDiameter
        );
        this.wafermap.horizontalCoefficient = this.wafermap.horizontalScale(1)
            - this.wafermap.horizontalScale(0);
        this.wafermap.verticalCoefficient = this.wafermap.verticalScale(1)
            - this.wafermap.verticalScale(0);
        this.wafermap.horizontalConstant = this.wafermap.horizontalScale(0);
        this.wafermap.verticalConstant = this.wafermap.verticalScale(0);

        this.wafermap.dieDimensions = {
            width: Math.abs(
                this.wafermap.horizontalScale(0) - this.wafermap.horizontalScale(1)
            ),
            height: Math.abs(this.wafermap.verticalScale(0) - this.wafermap.verticalScale(1))
        };
        this.colorAndTextUpdate();
    }

    public colorAndTextUpdate(): void {
        if (this.wafermap.dieDimensions === undefined) {
            this.inputDataUpdate();
            return;
        }
        this.wafermap.labelsFontSize = this.calculateLabelsFontSize(
            this.wafermap.dieDimensions,
            this.wafermap.maxCharacters
        );
        this.wafermap.workerColorScale = this.calculateColorScale();
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
            .toArray();
        const rowIndex = this.wafermap.diesTable
            .getChild('rowIndex')!
            .toArray();

        const minPoint = { x: colIndex[0]!, y: rowIndex[0]! };
        const maxPoint = { x: colIndex[0]!, y: rowIndex[0]! };

        // will replace iterating with arquero after fixing issues: https://github.com/uwdata/arquero/pull/346
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

    private calculateColorScale(): ColorScale {
        if (this.wafermap.colorScaleMode === WaferMapColorScaleMode.linear) {
            const values = this.wafermap.colorScale.values.map(item => +item);
            const d3ColorScale = scaleLinear<string, string>()
                .domain(values)
                .range(this.wafermap.colorScale.colors);
            let min = values[0]!;
            let max = values[0]!;
            values.forEach(value => {
                if (value < min) {
                    min = value;
                }
                if (value > max) {
                    max = value;
                }
            });
            // the linear color scale will not be infinite but will be limited by the color scale resolution
            const valueSamples = ticks(
                min,
                max,
                values.length * this.colorScaleResolution
            );
            return valueSamples.map(value => {
                return {
                    color: d3ColorScale(value),
                    value
                };
            });
        }
        // ordinal color categories have to be sorted by value
        return this.wafermap.colorScale.colors
            .map((color, index) => {
                return {
                    color,
                    value: +this.wafermap.colorScale.values[index]!
                };
            })
            .sort((a, b) => a.value - b.value);
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
}
