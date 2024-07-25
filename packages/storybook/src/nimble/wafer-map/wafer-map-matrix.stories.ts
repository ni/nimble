import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { tableFromArrays } from 'apache-arrow';
import { waferMapTag } from '@ni/nimble-components/dist/esm/wafer-map';
import {
    WaferMapOrientation,
    WaferMapOriginLocation
} from '@ni/nimble-components/dist/esm/wafer-map/types';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';

const colorScale = {
    colors: ['red', 'blue', 'green'],
    values: [1, 50, 100]
} as const;

const waferMapDie = [
    { x: 0, y: 2, value: '99', tags: ['a'] },
    { x: 1, y: 2, value: '78', tags: ['a', 'b'] },
    { x: 1, y: 1, value: '88', tags: ['a'] },
    { x: 1, y: 3, value: '68' },
    { x: 2, y: 2, value: '99' },
    { x: 2, y: 1, value: '99' },
    { x: 2, y: 0, value: '80', tags: ['b'] },
    { x: 2, y: 3, value: '99', tags: ['b', 'a'] },
    { x: 2, y: 4, value: '100', tags: ['b'] },
    { x: 3, y: 2, value: '40' },
    { x: 3, y: 1, value: '10' },
    { x: 3, y: 3, value: '15' },
    { x: 4, y: 2, value: '30' }
] as const;

const waferMapDiesTable = tableFromArrays({
    colIndex: Int32Array.from([0, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4]),
    rowIndex: Int32Array.from([2, 2, 1, 3, 2, 1, 0, 3, 4, 2, 1, 3, 2]),
    value: Float64Array.from([
        99, 78, 88, 68, 99, 99, 80, 99, 100, 40, 10, 15, 30
    ])
});

const colorsScaleStates = [
    [
        {
            colors: ['red', 'orange', 'green'],
            values: [1, 50, 100]
        }
    ],
    [
        {
            colors: ['red', 'purple', 'blue'],
            values: [1, 50, 100]
        }
    ]
] as const;
type ColorScaleState = (typeof colorsScaleStates)[number];

const dieLabelHiddenStates = [[true], [false]] as const;
type DieLabelHiddenState = (typeof dieLabelHiddenStates)[number];

const gridDimensionStates = [
    [
        {
            gridMinX: undefined,
            gridMaxX: undefined,
            gridMinY: undefined,
            gridMaxY: undefined
        }
    ],
    [
        {
            gridMinX: 0,
            gridMaxX: 0,
            gridMinY: 0,
            gridMaxY: 0
        }
    ],
    [
        {
            gridMinX: 0,
            gridMaxX: 4,
            gridMinY: 0,
            gridMaxY: 0
        }
    ],
    [
        {
            gridMinX: 0,
            gridMaxX: 0,
            gridMinY: 0,
            gridMaxY: 4
        }
    ],
    [
        {
            gridMinX: 0,
            gridMaxX: 4,
            gridMinY: 0,
            gridMaxY: 4
        }
    ]
] as const;
type GridDimensionState = (typeof gridDimensionStates)[number];

const highlightedTagStates = [['a'], ['b', 'a'], [], ['']] as const;
type HighlightedTagState = (typeof highlightedTagStates)[number];

const orientationStates = [
    [WaferMapOrientation.top],
    [WaferMapOrientation.bottom],
    [WaferMapOrientation.left],
    [WaferMapOrientation.right]
] as const;
type OrientationState = (typeof orientationStates)[number];

const originLocationStates = [
    [WaferMapOriginLocation.topLeft],
    [WaferMapOriginLocation.bottomLeft],
    [WaferMapOriginLocation.topRight],
    [WaferMapOriginLocation.bottomRight]
] as const;
type OriginLocationStates = (typeof originLocationStates)[number];

const sizeStates = [70, 200, 300, 400] as const;
type SizeState = (typeof sizeStates)[number];

const metadata: Meta = {
    title: 'Tests/Wafer Map',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const simpleWaferWithDies = (): ViewTemplate => html`<${waferMapTag}
    :dies="${() => waferMapDie}"
    :colorScale="${() => colorScale}"
>
</${waferMapTag}>`;

const simpleExperimentalWaferWithDies = (): ViewTemplate => html`<${waferMapTag}
    :diesTable="${() => waferMapDiesTable}"
    :colorScale="${() => colorScale}"
>
</${waferMapTag}>`;

const componentWaferWithOrientation = ([
    orientation
]: OrientationState): ViewTemplate => html`<${waferMapTag}
    orientation="${() => orientation}"
    :dies="${() => waferMapDie}"
    :colorScale="${() => colorScale}"
>
</${waferMapTag}>`;

const componentExperimentalWaferWithOrientation = ([
    orientation
]: OrientationState): ViewTemplate => html`<${waferMapTag}
    orientation="${() => orientation}"
    :diesTable="${() => waferMapDiesTable}"
    :colorScale="${() => colorScale}"
>
</${waferMapTag}>`;

const componentWaferWithHiddenDieLabel = (
    [color]: ColorScaleState,
    [dieLabelHidden]: DieLabelHiddenState
): ViewTemplate => html`<${waferMapTag}
    ?die-labels-hidden=${() => dieLabelHidden}
    :dies="${() => waferMapDie}"
    :colorScale="${() => color}"
>
</${waferMapTag}>`;

const componentExperimentalWaferWithHiddenDieLabel = (
    [color]: ColorScaleState,
    [dieLabelHidden]: DieLabelHiddenState
): ViewTemplate => html`<${waferMapTag}
    ?die-labels-hidden=${() => dieLabelHidden}
    :diesTable="${() => waferMapDiesTable}"
    :colorScale="${() => color}"
>
</${waferMapTag}>`;

const componentWaferWithOriginLocation = ([
    originLocation
]: OriginLocationStates): ViewTemplate => html`<${waferMapTag}
    :originLocation="${() => originLocation}"
    :dies="${() => waferMapDie}"
    :colorScale="${() => colorScale}"
>
</${waferMapTag}>`;

const componentExperimentalWaferWithOriginLocation = ([
    originLocation
]: OriginLocationStates): ViewTemplate => html`<${waferMapTag}
    :originLocation="${() => originLocation}"
    :diesTable="${() => waferMapDiesTable}"
    :colorScale="${() => colorScale}"
>
</${waferMapTag}>`;

const componentWaferResize = (
    size: SizeState
): ViewTemplate => html`<${waferMapTag}
    style="width: ${size}px; height: ${size}px"
    :dies="${() => waferMapDie}"
    :colorScale="${() => colorScale}"
>
</${waferMapTag}> `;

const componentExperimentalWaferResize = (
    size: SizeState
): ViewTemplate => html`<${waferMapTag}
    style="width: ${size}px; height: ${size}px"
    :diesTable="${() => waferMapDiesTable}"
    :colorScale="${() => colorScale}"
>
</${waferMapTag}> `;

const componentWaferWithGridDimensions = ([
    dimensions
]: GridDimensionState): ViewTemplate => html`<${waferMapTag}
    :dies="${() => waferMapDie}"
    :colorScale="${() => colorScale}"
    :gridMaxX=${() => dimensions.gridMaxX}
    :gridMaxY=${() => dimensions.gridMaxY}
    :gridMinX=${() => dimensions.gridMinX}
    :gridMinY=${() => dimensions.gridMinY}
>
</${waferMapTag}>`;

const componentExperimentalWaferWithGridDimensions = ([
    dimensions
]: GridDimensionState): ViewTemplate => html`<${waferMapTag}
    :diesTable="${() => waferMapDiesTable}"
    :colorScale="${() => colorScale}"
    :gridMaxX=${() => dimensions.gridMaxX}
    :gridMaxY=${() => dimensions.gridMaxY}
    :gridMinX=${() => dimensions.gridMinX}
    :gridMinY=${() => dimensions.gridMinY}
>
</${waferMapTag}>`;

const componentWaferWithHighlightedTags = (
    tags: HighlightedTagState
): ViewTemplate => html`<${waferMapTag}
    :dies="${() => waferMapDie}"
    :colorScale="${() => colorScale}"
    :highlightedTags="${() => tags}"
>
</${waferMapTag}>`;

export const waferMapThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(simpleWaferWithDies)
);

export const experimentalWaferMapThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(simpleExperimentalWaferWithDies)
);

export const waferMapDiesAndOrientationTest: StoryFn = createStory(
    createMatrix(componentWaferWithOrientation, [orientationStates])
);

export const experimentalWaferMapDiesAndOrientationTest: StoryFn = createStory(
    createMatrix(componentExperimentalWaferWithOrientation, [orientationStates])
);

export const waferMapDieLabelAndColorScaleTest: StoryFn = createStory(
    createMatrix(componentWaferWithHiddenDieLabel, [
        colorsScaleStates,
        dieLabelHiddenStates
    ])
);

export const experimentalWaferMapDieLabelAndColorScaleTest: StoryFn = createStory(
    createMatrix(componentExperimentalWaferWithHiddenDieLabel, [
        colorsScaleStates,
        dieLabelHiddenStates
    ])
);

export const waferMapOriginLocationTest: StoryFn = createStory(
    createMatrix(componentWaferWithOriginLocation, [originLocationStates])
);

export const experimentalWaferMapOriginLocationTest: StoryFn = createStory(
    createMatrix(componentExperimentalWaferWithOriginLocation, [
        originLocationStates
    ])
);

export const waferMapResizeTest: StoryFn = createStory(
    createMatrix(componentWaferResize, [sizeStates])
);

export const experimentalWaferMapResizeTest: StoryFn = createStory(
    createMatrix(componentExperimentalWaferResize, [sizeStates])
);

export const waferMapGridDimensionsTest: StoryFn = createStory(
    createMatrix(componentWaferWithGridDimensions, [gridDimensionStates])
);

export const experimentalWaferMapGridDimensionsTest: StoryFn = createStory(
    createMatrix(componentExperimentalWaferWithGridDimensions, [
        gridDimensionStates
    ])
);

export const waferMapHighlightedTest: StoryFn = createStory(
    createMatrix(componentWaferWithHighlightedTags, [highlightedTagStates])
);
