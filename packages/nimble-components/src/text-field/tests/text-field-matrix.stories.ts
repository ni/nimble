import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { TextFieldAppearance } from '../types';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    ReadOnlyState,
    readOnlyStates
} from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import '../../all-components';

const metadata: Meta = {
    title: 'Tests/Text Field',
    decorators: [withXD],
    parameters: {
        ...sharedMatrixParameters(),
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/842889a5-67ba-4350-91c1-55eee48f4fa2/specs/'
        }
    }
};

export default metadata;

const valueStates = [
    ['Placeholder', null, 'placeholder'],
    ['Value', 'Hello', null]
] as const;
type ValueState = typeof valueStates[number];

const typeStates = [
    ['Text', 'text'],
    ['Password', 'password']
] as const;
type TypeState = typeof typeStates[number];

const actionButtonStates = [
    ['', false],
    ['With Buttons', true]
] as const;
type ActionButtonState = typeof actionButtonStates[number];

/* array of state name, invalidClass, errorText */
const textFieldInvalidStates = [
    ['', '', 'This is not valid.'],
    ['', '', ''],
    ['Invalid Error String', 'invalid', 'This is not valid.'],
    ['Invalid', 'invalid', '']
] as const;
type TextFieldInvalidState = typeof textFieldInvalidStates[number];

const appearanceStates = Object.entries(TextFieldAppearance);
type AppearanceState = typeof appearanceStates[number];

// prettier-ignore
const component = (
    [readOnlyName, readonly]: ReadOnlyState,
    [_disabledName, disabled]: DisabledState,
    [showActionButtonsName, showActionButtons]: ActionButtonState,
    [invalidName, invalidClass, errorText]: TextFieldInvalidState,
    [typeName, type]: TypeState,
    [appearanceName, appearance]: AppearanceState,
    [valueName, valueValue, placeholderValue]: ValueState
): ViewTemplate => html`
    <nimble-text-field
        style="width: 350px; padding: 8px;"
        class="${() => invalidClass}"
        ?disabled="${() => disabled}"
        type="${() => type}"
        appearance="${() => appearance}"
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        ?readonly="${() => readonly}"        
        error-text="${() => errorText}"
    >
        ${() => invalidName} ${() => typeName}
        ${() => appearanceName} ${() => valueName} ${() => readOnlyName}
        ${() => showActionButtonsName}
        

        ${when(() => showActionButtons, html`
            <nimble-button slot="actions" appearance="outline" content-hidden>
                <nimble-pencil-icon slot="start"></nimble-pencil-icon>
                Edit
            </nimble-button>
            <nimble-button slot="actions" appearance="outline" content-hidden>
                <nimble-xmark-icon slot="start"></nimble-xmark-icon>
                Clear
            </nimble-button>`)}
    </nimble-text-field>
`;

export const enabledWithoutButtonsTextFieldThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        readOnlyStates,
        [disabledStates[0]],
        [actionButtonStates[0]],
        textFieldInvalidStates,
        typeStates,
        appearanceStates,
        valueStates
    ])
);

export const enabledWithButtonsTextFieldThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        readOnlyStates,
        [disabledStates[0]],
        [actionButtonStates[1]],
        textFieldInvalidStates,
        typeStates,
        appearanceStates,
        valueStates
    ])
);

export const disabledWithoutButtonsTextFieldThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        readOnlyStates,
        [disabledStates[1]],
        [actionButtonStates[0]],
        textFieldInvalidStates,
        typeStates,
        appearanceStates,
        valueStates
    ])
);

export const disabledWithButtonsTextFieldThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        readOnlyStates,
        [disabledStates[1]],
        [actionButtonStates[1]],
        textFieldInvalidStates,
        typeStates,
        appearanceStates,
        valueStates
    ])
);

export const hiddenTextField: Story = createStory(
    hiddenWrapper(
        html`<nimble-text-field hidden>Hidden text field</nimble-text-field>`
    )
);
