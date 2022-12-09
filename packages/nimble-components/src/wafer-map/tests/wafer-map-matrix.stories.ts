import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { WaferMapOrientation, WaferMapQuadrant } from '../types';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    createStory
} from '../../utilities/tests/storybook';
import '../../all-components';

const metadata: Meta = {
    title: 'Tests/WaferMap',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs'
        }
    }
};

export default metadata;

const orientationStates = [
    [WaferMapOrientation.top],
    [WaferMapOrientation.bottom],
    [WaferMapOrientation.left],
    [WaferMapOrientation.right]
] as const;
type OrientationState = typeof orientationStates[number];

const dieOrientation = [
    [WaferMapQuadrant.topLeft],
    [WaferMapQuadrant.bottomLeft],
    [WaferMapQuadrant.topRight],
    [WaferMapQuadrant.bottomRight]
] as const;
type DieOrientation = typeof dieOrientation[number];

const colorsScales = [
    [{
        colors: ['red', 'orange', 'green'],
        values: [1, 50, 100]
    }],
    [{
        colors: ['red', 'purple', 'blue'],
        values: [1, 50, 100]
    }]
] as const;
type ColorScales = typeof colorsScales[number];

const defaultColor = {
    colors: ['red', 'blue', 'green'],
    values: [1, 50, 100]
};

const dieLabelHidden = [
    [true],
    [false]
] as const;
type DieLabelHidden = typeof dieLabelHidden[number];

const waferMapDie = [
    { x: 0, y: 0, value: '100' },
    { x: 0, y: 1, value: '50' },
    { x: 0, y: 2, value: '12' },
    { x: 0, y: 3, value: '99' },
    { x: 1, y: 0, value: '78' },
    { x: 1, y: 1, value: '88' },
    { x: 1, y: 2, value: '68' },
    { x: 1, y: 3, value: '99' },
    { x: 2, y: 0, value: '99' },
    { x: 2, y: 1, value: '80' },
    { x: 2, y: 2, value: '99' },
    { x: 2, y: 3, value: '100' },
    { x: 3, y: 0, value: '40' },
    { x: 3, y: 1, value: '10' },
    { x: 3, y: 2, value: '15' },
    { x: 3, y: 3, value: '30' }
];

const componentWaferWithDies = (
    [orientation]: OrientationState,
): ViewTemplate => html`<nimble-wafer-map
orientation="${() => orientation}"
:dies="${() => waferMapDie}"
:colorScale="${() => defaultColor}"
>
</nimble-wafer-map>`;

const componentWaferWithHiddenDieLabel = (
    [color]: ColorScales,
    [dieLabelHidde]: DieLabelHidden
): ViewTemplate => html`<nimble-wafer-map
?die-labels-hidden=${() => dieLabelHidde}
:dies="${() => waferMapDie}"
:colorScale="${() => color}"
>
</nimble-wafer-map>`;

const componentWaferWithDieOrientation = (
    [orientation]: DieOrientation
): ViewTemplate => html`<nimble-wafer-map
quadrant="${() => orientation}"
:dies="${() => waferMapDie}"
:colorScale="${() => defaultColor}"
>
</nimble-wafer-map>`;

export const waferMapDiesAndOrientationTest: Story = createStory(
    createMatrix(componentWaferWithDies, [orientationStates])
);

export const waferMapDieLabelAndColorScaleTest: Story = createStory(
    createMatrix(componentWaferWithHiddenDieLabel, [colorsScales, dieLabelHidden])
);

export const waferMapDieOrientationTest: Story = createStory(
    createMatrix(componentWaferWithDieOrientation, [dieOrientation])
);