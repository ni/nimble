import { ScaleBand, scaleBand } from 'd3-scale';
import {
    Dimensions,
    Margin,
    WaferMapColorScale,
    WaferMapColorScaleMode,
    WaferMapDie,
    WaferMapOriginLocation,
    WaferMapValidity
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
): Pick<
    DataManager,
    'horizontalScale' | 'verticalScale' | 'dieDimensions' | 'margin'
    > {
    return {
        horizontalScale,
        verticalScale,
        dieDimensions,
        margin
    };
}

export function getWaferMapMockPrerendering(
    dies: WaferMapDie[] = getWaferMapDies(),
    colorScale: WaferMapColorScale = { colors: [], values: [] },
    highlightedTags: string[] = [],
    colorScaleMode: WaferMapColorScaleMode = WaferMapColorScaleMode.linear,
    dieLabelsHidden = true,
    dieLabelsSuffix = '',
    maxCharacters = 4
): Pick<
    WaferMap,
    | 'dies'
    | 'colorScale'
    | 'highlightedTags'
    | 'colorScaleMode'
    | 'dieLabelsHidden'
    | 'dieLabelsSuffix'
    | 'maxCharacters'
    > {
    return {
        dies,
        colorScale,
        highlightedTags,
        colorScaleMode,
        dieLabelsHidden,
        dieLabelsSuffix,
        maxCharacters
    };
}

export function getWaferMapMockComputations(
    dies: WaferMapDie[] = getWaferMapDies(),
    originLocation: WaferMapOriginLocation,
    canvasWidth: number,
    canvasHeight: number,
    validity: WaferMapValidity = { invalidGridDimensions: false }
): Pick<
    WaferMap,
    'dies' | 'originLocation' | 'canvasWidth' | 'canvasHeight' | 'validity'
    > {
    return {
        dies,
        originLocation,
        canvasWidth,
        canvasHeight,
        validity
    };
}

export function getWaferMapMockValidator(
    gridMinX: number | undefined,
    gridMaxX: number | undefined,
    gridMinY: number | undefined,
    gridMaxY: number | undefined
): Pick<WaferMap, 'gridMinX' | 'gridMaxX' | 'gridMinY' | 'gridMaxY'> {
    return {
        gridMinX,
        gridMaxX,
        gridMinY,
        gridMaxY
    };
}
