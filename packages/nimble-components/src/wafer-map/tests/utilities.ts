import { ScaleBand, ScaleQuantile, scaleBand, scaleQuantile } from 'd3-scale';
import { type Table, tableFromArrays } from 'apache-arrow';
import type { ZoomTransform } from 'd3-zoom';
import {
    Dimensions,
    HoverDie,
    Margin,
    WaferMapColorScale,
    WaferMapColorScaleMode,
    WaferMapDie,
    WaferMapOriginLocation,
    WaferMapValidity,
    WaferRequiredFields
} from '../types';
import type { DataManager } from '../modules/data-manager';
import type { WaferMap } from '..';

export function getWaferMapDies(): WaferMapDie[] {
    return [
        { value: '1', x: 2, y: 3, tags: ['3'] },
        { value: '2', x: 2, y: 4, tags: ['4'] },
        { value: '3', x: 3, y: 2, tags: ['5'] },
        { value: '4', x: 3, y: 3, tags: ['10'] },
        { value: '5', x: 3, y: 4 },
        { value: '6', x: 3, y: 5, tags: ['15'] },
        { value: '7', x: 4, y: 1 },
        { value: '8', x: 4, y: 2 },
        { value: '9', x: 4, y: 3 },
        { value: '10', x: 4, y: 4 },
        { value: '11', x: 4, y: 5 },
        { value: '12', x: 4, y: 6 },
        { value: '13', x: 5, y: 2 },
        { value: '14', x: 5, y: 3 },
        { value: '15', x: 5, y: 4 },
        { value: '16', x: 5, y: 5 },
        { value: '17', x: 6, y: 3 },
        { value: '18', x: 6, y: 4 }
    ];
}
export function getWaferMapDiesTable(): Table<WaferRequiredFields> {
    return tableFromArrays({
        colIndex: new Int32Array([
            2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6
        ]),
        rowIndex: new Int32Array([
            3, 4, 2, 3, 4, 5, 1, 2, 3, 4, 5, 6, 2, 3, 4, 5, 3, 4
        ]),
        value: new Float64Array([
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
        ])
    });
}

export function getWaferMapDiesAsFloats(): WaferMapDie[] {
    return getWaferMapDies().map(die => {
        die.value += '0.1111';
        return die;
    });
}

export function getWaferMapDiesAsNaN(): WaferMapDie[] {
    return getWaferMapDies().map(die => {
        die.value = 'NaN';
        return die;
    });
}

export function getColorScale(): WaferMapColorScale {
    return { colors: ['red', 'blue', 'green'], values: ['1', '2', '3'] };
}

export function getHighlightedTags(): string[] {
    return ['5', '10', '15'];
}

export function getScaleBand(
    domain: number[] = [],
    range: number[] = []
): ScaleBand<number> {
    return scaleBand<number>().domain(domain).range(range);
}

export function getScaleQuantile(
    domain: number[] = [],
    range: number[] = []
): ScaleQuantile<number, number> {
    return scaleQuantile().domain(domain).range(range);
}
export const defaultHorizontalScale = scaleBand<number>()
    .domain([2, 3, 4, 5, 6])
    .range([2, 7]);

export const defaultVerticalScale = scaleBand<number>()
    .domain([1, 2, 3, 4, 5, 6])
    .range([1, 7]);

export function getDataManagerMock(
    dieDimensions: Dimensions,
    margin: Margin,
    horizontalScale: ScaleBand<number> = getScaleBand([], []),
    verticalScale: ScaleBand<number> = getScaleBand([], [])
): DataManager {
    const dataManagerMock: Pick<
    DataManager,
    'horizontalScale' | 'verticalScale' | 'dieDimensions' | 'margin'
    > = {
        horizontalScale,
        verticalScale,
        dieDimensions,
        margin
    };
    return dataManagerMock as DataManager;
}

export function getDataManagerMockForHover(
    margin: Margin,
    invertedHorizontalScale: ScaleQuantile<number, number> = getScaleQuantile(
        [],
        []
    ),
    invertedVerticalScale: ScaleQuantile<number, number> = getScaleQuantile(
        [],
        []
    )
): DataManager {
    const dataManagerMock: Pick<
    DataManager,
    'invertedHorizontalScale' | 'invertedVerticalScale' | 'margin'
    > = {
        invertedHorizontalScale,
        invertedVerticalScale,
        margin
    };
    return dataManagerMock as DataManager;
}

export function getWaferMapMockPrerendering(
    dies: WaferMapDie[] = getWaferMapDies(),
    colorScale: WaferMapColorScale = { colors: [], values: [] },
    highlightedTags: string[] = [],
    colorScaleMode: WaferMapColorScaleMode = WaferMapColorScaleMode.linear,
    dieLabelsHidden = true,
    dieLabelsSuffix = '',
    maxCharacters = 4,
    dataManager = {} as DataManager
): WaferMap {
    const waferMapMock: Pick<
    WaferMap,
    | 'dies'
    | 'colorScale'
    | 'highlightedTags'
    | 'colorScaleMode'
    | 'dieLabelsHidden'
    | 'dieLabelsSuffix'
    | 'maxCharacters'
    | 'dataManager'
    > = {
        dies,
        colorScale,
        highlightedTags,
        colorScaleMode,
        dieLabelsHidden,
        dieLabelsSuffix,
        maxCharacters,
        dataManager
    };
    return waferMapMock as WaferMap;
}

export function getWaferMapMockHover(
    diesTable: Table,
    transform: ZoomTransform,
    originLocation: WaferMapOriginLocation,
    hoverDie: HoverDie | undefined,
    dataManager: DataManager,
    isExperimentalRenderer: boolean
): WaferMap {
    const waferMapMock: Pick<
    WaferMap,
    | 'diesTable'
    | 'transform'
    | 'originLocation'
    | 'hoverDie'
    | 'dataManager'
    | 'isExperimentalRenderer'
    > = {
        diesTable,
        transform,
        originLocation,
        hoverDie,
        dataManager,
        isExperimentalRenderer: () => isExperimentalRenderer
    };
    return waferMapMock as WaferMap;
}
export function getWaferMapMockComputations(
    dies: WaferMapDie[] = getWaferMapDies(),
    originLocation: WaferMapOriginLocation,
    canvasWidth: number,
    canvasHeight: number,
    validity: WaferMapValidity = {
        invalidGridDimensions: false,
        invalidDiesTableSchema: false
    }
): WaferMap {
    const waferMapMock: Pick<
    WaferMap,
    'dies' | 'originLocation' | 'canvasWidth' | 'canvasHeight' | 'validity'
    > = {
        dies,
        originLocation,
        canvasWidth,
        canvasHeight,
        validity
    };
    return waferMapMock as WaferMap;
}
export function getWaferMapMockComputationsExperimental(
    diesTable: Table = getWaferMapDiesTable(),
    originLocation: WaferMapOriginLocation,
    canvasWidth: number,
    canvasHeight: number,
    validity: WaferMapValidity = {
        invalidGridDimensions: false,
        invalidDiesTableSchema: false
    }
): WaferMap {
    const waferMapMock: Pick<
    WaferMap,
    | 'diesTable'
    | 'originLocation'
    | 'canvasWidth'
    | 'canvasHeight'
    | 'validity'
    > = {
        diesTable,
        originLocation,
        canvasWidth,
        canvasHeight,
        validity
    };
    return waferMapMock as WaferMap;
}

export function getWaferMapMockValidator(
    gridMinX: number | undefined,
    gridMaxX: number | undefined,
    gridMinY: number | undefined,
    gridMaxY: number | undefined,
    diesTable: Table | undefined = undefined
): WaferMap {
    const waferMapMock: Pick<
    WaferMap,
    'gridMinX' | 'gridMaxX' | 'gridMinY' | 'gridMaxY' | 'diesTable'
    > = {
        gridMinX,
        gridMaxX,
        gridMinY,
        gridMaxY,
        diesTable
    };
    return waferMapMock as WaferMap;
}
