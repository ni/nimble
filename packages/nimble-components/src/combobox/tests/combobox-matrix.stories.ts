import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import '../../all-components';
import { disabledStates, DisabledState, errorStates, ErrorState } from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Combobox',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e/specs'
        },
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
    }
};

export default metadata;

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [errorName, errorVisible, errorText]: ErrorState,
): ViewTemplate => html`
    <div style="display: inline-flex; flex-direction: column; margin: 5px; font: var(--ni-nimble-control-label-font); color: var(--ni-nimble-control-label-font-color)">
    <label>${() => disabledName} ${() => errorName}</label>
    <nimble-combobox 
        ?disabled="${() => disabled}"
        ?error-visible="${() => errorVisible}"
        error-text="${() => errorText}"
    >
        <nimble-list-option value="1">Option 1</nimble-list-option>
        <nimble-list-option value="2" disabled>Option 2</nimble-list-option>
        <nimble-list-option value="3">Option 3</nimble-list-option>
        <nimble-list-option value="4" hidden>Option 4</nimble-list-option>
    </nimble-combobox>
`;

export const comboboxThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [disabledStates, errorStates])
);

export const hiddenCombobox: Story = createStory(
    hiddenWrapper(
        html`<nimble-combobox hidden>
            <nimble-list-option value="1">Option 1</nimble-list-option>
        </nimble-combobox>`
    )
);

export const blankListOption: Story = createStory(
    html`<nimble-combobox open>
        <nimble-list-option value="1">Option 1</nimble-list-option>
        <nimble-list-option></nimble-list-option>
    </nimble-combobox>`
);
