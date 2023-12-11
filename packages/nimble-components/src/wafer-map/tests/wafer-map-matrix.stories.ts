import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { WaferMapOrientation, WaferMapOriginLocation } from '../types';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { waferMapTag } from '..';

const metadata: Meta = {
    title: 'Tests/Wafer Map',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

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

const colorsScales = [
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
type ColorScales = (typeof colorsScales)[number];

const defaultColor = {
    colors: ['red', 'blue', 'green'],
    values: [1, 50, 100]
};

const dieLabelHidden = [[true], [false]] as const;
type DieLabelHidden = (typeof dieLabelHidden)[number];

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
];

const waferMapSizes = [70, 200, 300, 400];

const highlightedTags = [['a'], ['b', 'a'], [], ['']];
type HighlightedTags = string[];

const gridDimensions = [
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
type GridDimensions = (typeof gridDimensions)[number];

const simpleWaferWithDies = (): ViewTemplate => html`<${waferMapTag}
    :dies="${() => waferMapDie}"
    :colorScale="${() => defaultColor}"
>
</${waferMapTag}>`;

const componentWaferWithOrientation = ([
    orientation
]: OrientationState): ViewTemplate => html`<${waferMapTag}
    orientation="${() => orientation}"
    :dies="${() => waferMapDie}"
    :colorScale="${() => defaultColor}"
>
</${waferMapTag}>`;

const componentWaferWithHiddenDieLabel = (
    [color]: ColorScales,
    [dieLabelHidde]: DieLabelHidden
): ViewTemplate => html`<${waferMapTag}
    ?die-labels-hidden=${() => dieLabelHidde}
    :dies="${() => waferMapDie}"
    :colorScale="${() => color}"
>
</${waferMapTag}>`;

const componentWaferWithOriginLocation = ([
    originLocation
]: OriginLocationStates): ViewTemplate => html`<${waferMapTag}
    :originLocation="${() => originLocation}"
    :dies="${() => waferMapDie}"
    :colorScale="${() => defaultColor}"
>
</${waferMapTag}>`;

const componentWaferResize = (
    size: number
): ViewTemplate => html`<${waferMapTag}
    style="width: ${size}px; height: ${size}px"
    :dies="${() => waferMapDie}"
    :colorScale="${() => defaultColor}"
>
</${waferMapTag}> `;

const componentWaferWithGridDimensions = ([
    dimensions
]: GridDimensions): ViewTemplate => html`<${waferMapTag}
    :dies="${() => waferMapDie}"
    :colorScale="${() => defaultColor}"
    :gridMaxX=${() => dimensions.gridMaxX}
    :gridMaxY=${() => dimensions.gridMaxY}
    :gridMinX=${() => dimensions.gridMinX}
    :gridMinY=${() => dimensions.gridMinY}
>
</${waferMapTag}>`;

const componentWaferWithHighlightedTags = (
    tags: HighlightedTags
): ViewTemplate => html`<${waferMapTag}
    :dies="${() => waferMapDie}"
    :colorScale="${() => defaultColor}"
    :highlightedTags="${() => tags}"
>
</${waferMapTag}>`;

export const waferMapThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(simpleWaferWithDies)
);

export const waferMapDiesAndOrientationTest: StoryFn = createStory(
    createMatrix(componentWaferWithOrientation, [orientationStates])
);

export const waferMapDieLabelAndColorScaleTest: StoryFn = createStory(
    createMatrix(componentWaferWithHiddenDieLabel, [
        colorsScales,
        dieLabelHidden
    ])
);

export const waferMapOriginLocationTest: StoryFn = createStory(
    createMatrix(componentWaferWithOriginLocation, [originLocationStates])
);

export const waferMapResizeTest: StoryFn = createStory(
    createMatrix(componentWaferResize, [waferMapSizes])
);

export const waferMapGridDimensionsTest: StoryFn = createStory(
    createMatrix(componentWaferWithGridDimensions, [gridDimensions])
);

export const waferMapHighlightedTest: StoryFn = createStory(
    createMatrix(componentWaferWithHighlightedTags, [highlightedTags])
);
