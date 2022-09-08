import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { Orientation } from '@microsoft/fast-web-utilities';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { disabledStates, DisabledState } from '../../utilities/tests/states';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';

const metadata: Meta = {
    title: 'Tests/Radio Group',
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
    ['Horizontal', Orientation.horizontal],
    ['Vertical', Orientation.vertical]
] as const;
type OrientationState = typeof orientationStates[number];

const component = (
    [disabledName, disabled]: DisabledState,
    [orientationName, orientation]: OrientationState
): ViewTemplate => html`<nimble-radio-group
    orientation="${() => orientation}"
    ?disabled="${() => disabled}"
    value="1"
>
    <label slot="label">${orientationName} ${disabledName}</span>
    <nimble-radio-button value="1">Option 1</nimble-radio-button>
    <nimble-radio-button value="2">Option 2</nimble-radio-button>
</nimble-radio-group>`;

export const radioGroupThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [disabledStates, orientationStates])
);

export const hiddenRadioGroup: Story = createStory(
    hiddenWrapper(
        html`<nimble-radio-group hidden>Hidden Radio Group</nimble-radio-group>`
    )
);

export const hiddenRadioButton: Story = createStory(
    hiddenWrapper(
        html`<nimble-radio-button hidden>
            Hidden Radio Button
        </nimble-radio-button>`
    )
);
