import type { Story, Meta } from '@storybook/html';
import { withXD } from 'storybook-addon-xd-designs';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
import { createRenderer } from '../../utilities/tests/storybook';
import { TextFieldAppearance } from '../types';
import {
    createMatrix,
    themeWrapper,
    disabledStates,
    DisabledState,
    ReadOnlyState,
    readOnlyStates
} from '../../utilities/tests/matrix';
import '..';
import { hiddenWrapper } from '../../utilities/tests/hidden';

const metadata: Meta = {
    title: 'Tests/Text Field',
    decorators: [withXD],
    parameters: {
        design: {
            artboardUrl:
                'https://xd.adobe.com/view/33ffad4a-eb2c-4241-b8c5-ebfff1faf6f6-66ac/screen/842889a5-67ba-4350-91c1-55eee48f4fa2/specs/'
        },
        controls: { hideNoControlsWarning: true },
        a11y: { disabled: true }
    }
};

export default metadata;

const valueStates = [
    ['Placeholder', null, 'placeholder'],
    ['Value', 'Hello', null]
];
type ValueState = typeof valueStates[number];

const typeStates = [
    ['Text', 'text'],
    ['Password', 'password']
];
type TypeState = typeof typeStates[number];

const actionButtonStates = [
    ['', false],
    ['With Buttons', true]
];
type ActionButtonState = typeof actionButtonStates[number];

/* array of state name, invalidClass, errorText */
const textFieldInvalidStates = [
    ['', '', 'This is not valid.'],
    ['', '', ''],
    ['Invalid Error String', 'invalid', 'This is not valid.'],
    ['Invalid', 'invalid', '']
];
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
        style="width: 250px; padding: 15px;"
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

export const enabledTextFieldThemeMatrix: Story = createRenderer(
    themeWrapper(
        createMatrix(component, [
            readOnlyStates,
            [disabledStates[0]!],
            actionButtonStates,
            textFieldInvalidStates,
            typeStates,
            appearanceStates,
            valueStates
        ])
    )
);

export const disabledTextFieldThemeMatrix: Story = createRenderer(
    themeWrapper(
        createMatrix(component, [
            readOnlyStates,
            [disabledStates[1]!],
            actionButtonStates,
            textFieldInvalidStates,
            typeStates,
            appearanceStates,
            valueStates
        ])
    )
);

export const hiddenTextField: Story = createRenderer(
    hiddenWrapper(
        html`<nimble-text-field hidden>Hidden text field</nimble-text-field>`
    )
);
