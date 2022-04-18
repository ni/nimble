import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    disabledStates,
    DisabledState,
    createMatrix,
    themeWrapper,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { createRenderer } from '../../utilities/tests/storybook';
import '..';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Checkbox',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs'
        },
        ...sharedMatrixParameters()
    }
};

export default metadata;

type CheckedState = [string, boolean];
const checkedStates: CheckedState[] = [
    ['Checked', true],
    ['Unchecked', false]
];

type IndeterminateState = [string, boolean];
const indeterminateStates: IndeterminateState[] = [
    ['Indeterminate', true],
    ['', false]
];

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

export const checkboxThemeMatrix: Story = createRenderer(
    themeWrapper(
        createMatrix(component, [
            disabledStates,
            checkedStates,
            indeterminateStates
        ])
    )
);

export const hiddenCheckbox: Story = createRenderer(
    hiddenWrapper(
        html`<nimble-checkbox hidden>Hidden Checkbox</nimble-checkbox>`
    )
);
