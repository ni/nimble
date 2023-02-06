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
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';

const metadata: Meta = {
    title: 'Tests/Checkbox',
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

const indeterminateStates = [
    ['Indeterminate', true],
    ['', false]
] as const;
type IndeterminateState = typeof indeterminateStates[number];

const component = (
    [disabledName, disabled]: DisabledState,
    [checkedName, checked]: CheckedState,
    [indeterminateName, indeterminate]: IndeterminateState
): ViewTemplate => html`<nimble-checkbox
    ?checked="${() => checked}"
    ?disabled="${() => disabled}"
    :indeterminate="${() => indeterminate}"
>
    ${checkedName} ${indeterminateName} ${disabledName}
</nimble-checkbox>`;

export const checkboxThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        checkedStates,
        indeterminateStates
    ])
);

export const hiddenCheckbox: Story = createStory(
    hiddenWrapper(
        html`<nimble-checkbox hidden>Hidden Checkbox</nimble-checkbox>`
    )
);

export const textCustomized: Story = createMatrixThemeStory(
    textCustomizationWrapper(html`<nimble-checkbox>Checkbox</nimble-checkbox>`)
);
