import type { Meta, Story } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    disabledStates,
    DisabledState,
    createMatrix,
    themeWrapper
} from '../../utilities/tests/matrix';
import { createRenderer } from '../../utilities/tests/storybook';
import '../index';

const metadata: Meta = {
    title: 'Tests/Checkbox',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/3698340b-8162-4e5d-bf7a-20194612b3a7/specs'
        },
        controls: { hideNoControlsWarning: true }
    }
};

export default metadata;

type CheckedState = [string, boolean];
const checkedStates: CheckedState[] = [
    ['Checked', true],
    ['Unchecked', false]
];

const component = (
    [disabledName, disabled]: DisabledState,
    [checkedName, checked]: CheckedState
): ViewTemplate => html`<nimble-checkbox
    ?checked="${() => checked}"
    ?disabled="${() => disabled}"
>
    ${checkedName} ${disabledName}
</nimble-checkbox>`;

export const checkboxThemeMatrix: Story = createRenderer(
    themeWrapper(
        createMatrix(component, [disabledStates, checkedStates])
    )
);

export const hiddenCheckbox = createRenderer(
    html`<nimble-checkbox hidden>Hidden Checkbox</nimble-checkbox>`
);
