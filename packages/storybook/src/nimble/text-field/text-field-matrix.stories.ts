import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@ni/fast-element';
import { buttonTag } from '../../../../nimble-components/src/button';
import { iconPencilTag } from '../../../../nimble-components/src/icons/pencil';
import { iconTagTag } from '../../../../nimble-components/src/icons/tag';
import { iconXmarkTag } from '../../../../nimble-components/src/icons/xmark';
import { textFieldTag } from '../../../../nimble-components/src/text-field';
import {
    TextFieldAppearance,
    TextFieldType
} from '../../../../nimble-components/src/text-field/types';
import { createStory, createFixedThemeStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/matrix';
import {
    disabledStates,
    type DisabledState,
    type ReadOnlyState,
    readOnlyStates,
    backgroundStates,
    errorStates,
    type ErrorState,
    type RequiredVisibleState,
    requiredVisibleStates,
    type DisabledReadOnlyState,
    disabledReadOnlyStates
} from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';
import { loremIpsum } from '../../utilities/lorem-ipsum';

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground,
    ...remaining
] = backgroundStates;

if (remaining.length > 0) {
    throw new Error('New backgrounds need to be supported');
}

const actionButtonStates = [
    ['', false],
    ['w/ Buttons', true]
] as const;
type ActionButtonState = (typeof actionButtonStates)[number];

const appearanceStates = [
    ['Underline', TextFieldAppearance.underline],
    ['Outline', TextFieldAppearance.outline],
    ['Block', TextFieldAppearance.block],
    ['Frameless', TextFieldAppearance.frameless]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const fullBleedStates = [
    ['', false],
    ['Full Bleed', true]
] as const;
type FullBleedState = (typeof fullBleedStates)[number];

const leftIconStates = [
    ['', false],
    ['w/ Icon', true]
] as const;
type LeftIconState = (typeof leftIconStates)[number];

const typeStates = [
    ['Text', TextFieldType.text],
    ['Password', TextFieldType.password]
] as const;
type TypeState = (typeof typeStates)[number];

const valueStates = [
    ['No Value', null, 'placeholder'],
    ['Value', 'Hello', 'placeholder']
] as const;
type ValueState = (typeof valueStates)[number];

const metadata: Meta = {
    title: 'Tests/Text Field',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [_disabledReadOnlyName, readOnly, disabled, appearanceReadOnly]: DisabledReadOnlyState,
    [_showActionButtonsName, showActionButtons]: ActionButtonState,
    [showLeftIconName, showLeftIcon]: LeftIconState,
    [errorName, errorVisible, errorText]: ErrorState,
    [typeName, type]: TypeState,
    [appearanceName, appearance]: AppearanceState,
    [fullBleedName, fullBleed]: FullBleedState,
    [valueName, valueValue, placeholderValue]: ValueState
): ViewTemplate => html`
    <${textFieldTag}
        style="width: 350px; margin: 8px;"
        ?full-bleed="${() => fullBleed}"
        ?disabled="${() => disabled}"
        type="${() => type}"
        appearance="${() => appearance}"
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        ?readonly="${() => readOnly}"
        ?error-visible="${() => errorVisible}"
        error-text="${() => errorText}"
        ?appearance-readonly="${() => appearanceReadOnly}"
    >
        ${when(() => showLeftIcon, html`<${iconTagTag} slot="start"></${iconTagTag}>`)}

        ${/* Only include states in label that are not expanded on page */ ''}
        ${() => showLeftIconName}
        ${() => errorName}
        ${() => typeName}
        ${() => appearanceName}
        ${() => fullBleedName}
        ${() => valueName}

        ${when(() => showActionButtons, html`
            <${buttonTag} slot="actions" appearance="outline" content-hidden>
                <${iconPencilTag} slot="start"></${iconPencilTag}>
                Edit
            </${buttonTag}>
            <${buttonTag} slot="actions" appearance="outline" content-hidden>
                <${iconXmarkTag} slot="start"></${iconXmarkTag}>
                Clear
            </${buttonTag}>`)}
    </${textFieldTag}>
`;

// prettier-ignore
const requiredVisibleStatesComponent = (
    [requiredVisibleName, requiredVisible]: RequiredVisibleState,
    [appearanceName, appearance]: AppearanceState,
    [readOnlyName, readonly]: ReadOnlyState,
    [disabledName, disabled]: DisabledState,
    [errorName, errorVisible, errorText]: ErrorState
): ViewTemplate => html`
    <${textFieldTag}
        style="width: 350px; margin: 8px;"
        ?disabled="${() => disabled}"
        appearance="${() => appearance}"
        ?readonly="${() => readonly}"
        ?error-visible="${() => errorVisible}"
        error-text="${() => errorText}"
        ?required-visible="${() => requiredVisible}"
    >
        ${() => readOnlyName}
        ${() => disabledName}
        ${() => errorName}
        ${() => appearanceName}
        ${() => requiredVisibleName}
    </${textFieldTag}>
`;

export const lightThemeEditableEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[0]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeEditableEnabledAppearanceReadOnlyWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[1]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeEditableEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[0]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeEditableEnabledAppearanceReadOnlyWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[1]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeEditableDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[2]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeEditableDisabledAppearanceReadOnlyWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[3]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeEditableDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[2]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeEditableDisabledAppearanceReadOnlyWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[3]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeReadOnlyEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[4]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeReadOnlyEnabledAppearanceReadOnlyWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[5]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeReadOnlyEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[4]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeReadOnlyEnabledAppearanceReadOnlyWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[5]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeReadOnlyDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[6]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeReadOnlyDisabledAppearanceReadOnlyWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[7]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeReadOnlyDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[6]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightThemeReadOnlyDisabledAppearanceReadOnlyWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[7]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const darkThemeEditableEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[0]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeEditableEnabledAppearanceReadOnlyWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[1]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeEditableEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[0]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeEditableEnabledAppearanceReadOnlyWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[1]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeEditableDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[2]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeEditableDisabledAppearanceReadOnlyWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[3]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeEditableDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[2]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeEditableDisabledAppearanceReadOnlyWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[3]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeReadOnlyEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[4]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeReadOnlyEnabledAppearanceReadOnlyWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[5]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeReadOnlyEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[4]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeReadOnlyEnabledAppearanceReadOnlyWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[5]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeReadOnlyDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[6]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeReadOnlyDisabledAppearanceReadOnlyWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[7]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeReadOnlyDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[6]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkThemeReadOnlyDisabledAppearanceReadOnlyWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[7]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const colorThemeEditableEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[0]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeEditableEnabledAppearanceReadOnlyWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[1]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeEditableEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[0]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeEditableEnabledAppearanceReadOnlyWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[1]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeEditableDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[2]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeEditableDisabledAppearanceReadOnlyWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[3]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeEditableDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[2]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeEditableDisabledAppearanceReadOnlyWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[3]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeReadOnlyEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[4]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeReadOnlyEnabledAppearanceReadOnlyWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[5]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeReadOnlyEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[4]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeReadOnlyEnabledAppearanceReadOnlyWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[5]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeReadOnlyDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[6]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeReadOnlyDisabledAppearanceReadOnlyWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[7]],
        [actionButtonStates[0]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeReadOnlyDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[6]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorThemeReadOnlyDisabledAppearanceReadOnlyWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyStates[7]],
        [actionButtonStates[1]],
        leftIconStates,
        errorStates,
        typeStates,
        appearanceStates,
        fullBleedStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const textFieldRequiredVisibleThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(requiredVisibleStatesComponent, [
        requiredVisibleStates,
        appearanceStates,
        readOnlyStates,
        disabledStates,
        errorStates
    ])
);

export const hiddenTextField: StoryFn = createStory(
    hiddenWrapper(
        html`<${textFieldTag} hidden>Hidden text field</${textFieldTag}>`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`
            <${textFieldTag} value="${loremIpsum}">
                Text field
            </${textFieldTag}>
        `
    )
);

export const heightTest: StoryFn = createStory(
    html`
        <div style="display: flex; flex-direction: column">
            <${textFieldTag} style="border: 1px dashed; width: 200px">
                With Label
            </${textFieldTag}>
            <${textFieldTag} style="border: 1px dashed; width: 200px">
            </${textFieldTag}>
        </div>
    `
);
