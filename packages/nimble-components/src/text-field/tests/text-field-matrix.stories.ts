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

const leftIconStates = [
    ['', false],
    ['With Left Icon', true]
] as const;
type LeftIconState = typeof leftIconStates[number];

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

const noPadStates = [
    ['', ''],
    ['No Pad', 'no-pad']
] as const;
type NoPadState = typeof noPadStates[number];

// prettier-ignore
const component = (
    [readOnlyName, readonly]: ReadOnlyState,
    [_disabledName, disabled]: DisabledState,
    [showActionButtonsName, showActionButtons]: ActionButtonState,
    [showLeftIconName, showLeftIcon]: LeftIconState,
    [invalidName, invalidClass, errorText]: TextFieldInvalidState,
    [typeName, type]: TypeState,
    [appearanceName, appearance]: AppearanceState,
    [noPadName, noPad]: NoPadState,
    [valueName, valueValue, placeholderValue]: ValueState
): ViewTemplate => html`
    <nimble-text-field
        style="width: 350px; padding: 8px;"
        class="${() => invalidClass} ${() => noPad}"
        ?disabled="${() => disabled}"
        type="${() => type}"
        appearance="${() => appearance}"
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        ?readonly="${() => readonly}"
        error-text="${() => errorText}"
    >
        ${when(() => showLeftIcon, html`<nimble-tag-icon slot="start"></nimble-pencil-icon>`)}

        ${() => invalidName} ${() => typeName}
        ${() => appearanceName} ${() => noPadName} ${() => valueName}
        ${() => readOnlyName} ${() => showLeftIconName} ${() => showActionButtonsName}


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

export const enabledTextFieldThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[0]],
        actionButtonStates,
        leftIconStates,
        textFieldInvalidStates,
        typeStates,
        appearanceStates,
        [noPadStates[0]],
        valueStates
    ])
);

export const enabledReadOnlyTextFieldThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[0]],
        actionButtonStates,
        leftIconStates,
        textFieldInvalidStates,
        typeStates,
        appearanceStates,
        [noPadStates[0]],
        valueStates
    ])
);

export const enabledReadOnlynoPadTextFieldThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[0]],
        actionButtonStates,
        leftIconStates,
        [textFieldInvalidStates[0]],
        [typeStates[0]],
        appearanceStates,
        [noPadStates[1]],
        [valueStates[1]]
    ])
);

export const disabledTextFieldThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        [readOnlyStates[0]],
        [disabledStates[1]],
        actionButtonStates,
        leftIconStates,
        textFieldInvalidStates,
        typeStates,
        appearanceStates,
        [noPadStates[0]],
        valueStates
    ])
);

export const disabledReadOnlyTextFieldThemeMatrix: Story = createMatrixThemeStory(
    createMatrix(component, [
        [readOnlyStates[1]],
        [disabledStates[1]],
        actionButtonStates,
        leftIconStates,
        textFieldInvalidStates,
        typeStates,
        appearanceStates,
        [noPadStates[0]],
        valueStates
    ])
);

export const hiddenTextField: Story = createStory(
    hiddenWrapper(
        html`<nimble-text-field hidden>Hidden text field</nimble-text-field>`
    )
);
