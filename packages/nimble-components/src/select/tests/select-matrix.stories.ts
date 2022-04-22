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
import { disabledStates, DisabledState } from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';

const metadata: Meta = {
    title: 'Tests/Select',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/6ec70d21-9a59-40cd-a8f4-45cfeed9e01e/specs'
        }
    }
};

export default metadata;

// prettier-ignore
const component = ([_, disabled]: DisabledState): ViewTemplate => html`
    <nimble-select ?disabled="${() => disabled}">
        <nimble-list-option value="1">Option 1</nimble-list-option>
        <nimble-list-option value="2" disabled>Option 2</nimble-list-option>
        <nimble-list-option value="3">Option 3</nimble-list-option>
        <nimble-list-option value="4" hidden>Option 4</nimble-list-option>
    </nimble-select>
`;

export const selectThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [disabledStates])
);

export const hiddenSelect: Story = createStory(
    hiddenWrapper(
        html`<nimble-select hidden>
            <nimble-list-option value="1">Option 1</nimble-list-option>
        </nimble-select>`
    )
);
