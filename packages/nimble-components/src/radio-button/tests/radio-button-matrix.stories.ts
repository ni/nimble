import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
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
    title: 'Tests/Radio Button',
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

const checkedStates = [
    ['Checked', true],
    ['Unchecked', false]
] as const;
type CheckedState = typeof checkedStates[number];

const component = (
    [disabledName, disabled]: DisabledState,
    [checkedName, checked]: CheckedState
): ViewTemplate => html`<nimble-radio-button
    checked="${() => checked}"
    ?disabled="${() => disabled}"
>
    ${checkedName} ${disabledName}
</nimble-radio-button>`;

export const radioButtonThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [disabledStates, checkedStates])
);

export const hiddenRadioButton: Story = createStory(
    hiddenWrapper(
        html`<nimble-radio-button hidden
            >Hidden Radio Button</nimble-radio-button
        >`
    )
);
