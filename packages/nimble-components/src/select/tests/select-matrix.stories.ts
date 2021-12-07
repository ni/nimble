import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import {
    createMatrix,
    themeWrapper,
    disabledStates,
    DisabledState
} from '../../utilities/tests/matrix';
import '../index';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Select',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e/specs'
        },
        controls: { hideNoControlsWarning: true }
    }
};

export default metadata;

// prettier-ignore
const component = ([_, disabled]: DisabledState): ViewTemplate => html`
    <nimble-select ?disabled="${() => disabled}">
        <nimble-listbox-option value="1">Option 1</nimble-listbox-option>
        <nimble-listbox-option value="2" disabled>Option 2</nimble-listbox-option>
        <nimble-listbox-option value="3">Option 3</nimble-listbox-option>
        <nimble-listbox-option value="4" hidden>Option 4</nimble-listbox-option>
    </nimble-select>
`;

export const selectThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component, [disabledStates]))
);

export const hiddenSelect: Story = createRenderer(
    hiddenWrapper(
        html`<nimble-select hidden>
            <nimble-listbox-option value="1">Option 1</nimble-listbox-option>
        </nimble-select>`
    )
);
