import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
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
import { NumberFieldAppearance } from '../types';

const metadata: Meta = {
    title: 'Tests/Number Field',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/eaa9ee19-4411-4648-b19d-41f61f9a01cf/specs/'
        }
    }
};

export default metadata;
const valueStates = [
    ['Placeholder', null, 'placeholder'],
    ['Value', '1234', null]
] as const;
type ValueState = typeof valueStates[number];

/* array of state name, invalidClass, errorText */
const numberFieldInvalidStates = [
    ['', '', 'This is not valid.'],
    ['Invalid', 'invalid', ''],
    ['Invalid w/ Error', 'invalid', 'This is not valid.']
] as const;
type NumberFieldInvalidState = typeof numberFieldInvalidStates[number];

const appearanceStates = Object.entries(NumberFieldAppearance).map(
    ([key, value]) => [pascalCase(key), value]
);
type AppearanceState = typeof appearanceStates[number];

const component = (
    [disabledName, disabled]: DisabledState,
    [valueName, valueValue, placeholderValue]: ValueState,
    [invalidName, invalidClass, errorText]: NumberFieldInvalidState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <nimble-number-field
        style="width: 250px; padding: 8px;"
        class="${() => invalidClass}"
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        appearance="${() => appearance}"
        ?disabled="${() => disabled}"
        error-text="${() => errorText}"
    >
        ${() => invalidName} ${() => appearanceName} ${() => valueName}
        ${() => disabledName}
    </nimble-number-field>
`;

export const numberFieldThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        valueStates,
        numberFieldInvalidStates,
        appearanceStates
    ])
);

export const hiddenNumberField: Story = createStory(
    hiddenWrapper(
        html`<nimble-number-field hidden
            >Hidden number field</nimble-number-field
        >`
    )
);
