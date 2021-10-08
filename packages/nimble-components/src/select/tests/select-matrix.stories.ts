import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createRenderer } from '../../tests/utilities/storybook-test-helpers';
import {
    createMatrix,
    themeWrapper,
    disabledStates,
    DisabledState
} from '../../tests/utilities/theme-test-helpers';
import '../index';

const metadata: Meta = {
    title: 'Tests/Select',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e/specs'
        }
    }
};

export default metadata;

// prettier-ignore
const component = ([_, disabled]: DisabledState): ViewTemplate => html`
    <nimble-select ?disabled="${() => disabled}">
        <nimble-listbox-option value="1">Option 1</nimble-listbox-option>
        <nimble-listbox-option value="2" disabled>Option 2</nimble-listbox-option>
        <nimble-listbox-option value="3">Option 3</nimble-listbox-option>
    </nimble-select>
`;

export const selectThemeMatrix: Story = createRenderer(
    themeWrapper(createMatrix(component, [disabledStates]))
);
