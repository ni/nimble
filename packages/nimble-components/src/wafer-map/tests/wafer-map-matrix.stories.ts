import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { WaferMapOrientation, WaferMapQuadrant } from '../types';
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
    title: 'Tests/WaferMap',

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

const dieOrientation = [
    [WaferMapQuadrant.topLeft],
    [WaferMapQuadrant.bottomLeft],
    [WaferMapQuadrant.topRight],
    [WaferMapQuadrant.bottomRight]
] as const;
type DieOrientation = (typeof dieOrientation)[number];

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
    { x: 0, y: 2, value: '99' },
    { x: 1, y: 2, value: '78' },
    { x: 1, y: 1, value: '88' },
    { x: 1, y: 3, value: '68' },
    { x: 2, y: 2, value: '99' },
    { x: 2, y: 1, value: '99' },
    { x: 2, y: 0, value: '80' },
    { x: 2, y: 3, value: '99' },
    { x: 2, y: 4, value: '100' },
    { x: 3, y: 2, value: '40' },
    { x: 3, y: 1, value: '10' },
    { x: 3, y: 3, value: '15' },
    { x: 4, y: 2, value: '30' }
];

const waferMapSizes = [70, 200, 300, 400];

const simpleWaferWithDies = (): ViewTemplate => html`<${waferMapTag}
    :dies="${() => waferMapDie}"
    :colorScale="${() => defaultColor}"
>
</${waferMapTag}>`;

const componentWaferWithDies = ([
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

const componentWaferWithDieOrientation = ([
    orientation
]: DieOrientation): ViewTemplate => html`<${waferMapTag}
    quadrant="${() => orientation}"
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

export const waferMapThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(simpleWaferWithDies)
);

export const waferMapDiesAndOrientationTest: StoryFn = createStory(
    createMatrix(componentWaferWithDies, [orientationStates])
);

export const waferMapDieLabelAndColorScaleTest: StoryFn = createStory(
    createMatrix(componentWaferWithHiddenDieLabel, [
        colorsScales,
        dieLabelHidden
    ])
);

export const waferMapDieOrientationTest: StoryFn = createStory(
    createMatrix(componentWaferWithDieOrientation, [dieOrientation])
);

export const waferMapResizeTest: Story = createStory(
    createMatrix(componentWaferResize, [waferMapSizes])
);
