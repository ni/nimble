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
    title: 'Tests/Number Field',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/eaa9ee19-4411-4648-b19d-41f61f9a01cf/specs/'
        },
        ...sharedMatrixParameters()
    }
};

export default metadata;
const valueStates = [
    ['Placeholder', null, 'placeholder'],
    ['Value', '1234', null]
];
type ValueState = typeof valueStates[number];

const component = (
    [disabledName, disabled]: DisabledState,
    [valueName, valueValue, placeholderValue]: ValueState
): ViewTemplate => html`
    <nimble-number-field
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        ?disabled="${() => disabled}"
    >
        ${() => valueName} ${() => disabledName}
    </nimble-number-field>
`;

export const numberFieldThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [disabledStates, valueStates])
);

export const hiddenNumberField: Story = createStory(
    hiddenWrapper(
        html`<nimble-number-field hidden
            >Hidden number field</nimble-number-field
        >`
    )
);
