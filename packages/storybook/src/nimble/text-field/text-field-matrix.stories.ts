import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate, when } from '@microsoft/fast-element';
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
    DisabledState,
    ReadOnlyState,
    readOnlyStates,
    backgroundStates,
    errorStates,
    ErrorState,
    RequiredVisibleState,
    requiredVisibleStates
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
    [requiredVisibleName, requiredVisible]: RequiredVisibleState,
    [_readOnlyName, readonly]: ReadOnlyState,
    [_disabledName, disabled]: DisabledState,
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
        ?readonly="${() => readonly}"
        ?error-visible="${() => errorVisible}"
        error-text="${() => errorText}"
        ?required-visible="${() => requiredVisible}"
    >
        ${when(() => showLeftIcon, html`<${iconTagTag} slot="start"></${iconTagTag}>`)}

        ${/* Only include states in label that are not expanded on page */ ''}
        ${() => showLeftIconName}
        ${() => errorName}
        ${() => typeName}
        ${() => appearanceName}
        ${() => fullBleedName}
        ${() => valueName}
        ${() => requiredVisibleName}

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

export const lightThemeNotRequiredEditableEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[0]],
        [disabledStates[0]],
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

export const lightThemeNotRequiredEditableEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[0]],
        [disabledStates[0]],
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

export const lightThemeNotRequiredEditableDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[0]],
        [disabledStates[1]],
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

export const lightThemeNotRequiredEditableDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[0]],
        [disabledStates[1]],
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

export const lightThemeNotRequiredReadOnlyEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[1]],
        [disabledStates[0]],
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

export const lightThemeNotRequiredReadOnlyEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[1]],
        [disabledStates[0]],
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

export const lightThemeNotRequiredReadOnlyDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[1]],
        [disabledStates[1]],
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

export const lightThemeNotRequiredReadOnlyDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[1]],
        [disabledStates[1]],
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

export const darkThemeNotRequiredEditableEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[0]],
        [disabledStates[0]],
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

export const darkThemeNotRequiredEditableEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[0]],
        [disabledStates[0]],
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

export const darkThemeNotRequiredEditableDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[0]],
        [disabledStates[1]],
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

export const darkThemeNotRequiredEditableDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[0]],
        [disabledStates[1]],
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

export const darkThemeNotRequiredReadOnlyEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[1]],
        [disabledStates[0]],
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

export const darkThemeNotRequiredReadOnlyEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[1]],
        [disabledStates[0]],
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

export const darkThemeNotRequiredReadOnlyDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[1]],
        [disabledStates[1]],
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

export const darkThemeNotRequiredReadOnlyDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[1]],
        [disabledStates[1]],
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

export const colorThemeNotRequiredEditableEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[0]],
        [disabledStates[0]],
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

export const colorThemeNotRequiredEditableEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[0]],
        [disabledStates[0]],
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

export const colorThemeNotRequiredEditableDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[0]],
        [disabledStates[1]],
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

export const colorThemeNotRequiredEditableDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[0]],
        [disabledStates[1]],
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

export const colorThemeNotRequiredReadOnlyEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[1]],
        [disabledStates[0]],
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

export const colorThemeNotRequiredReadOnlyEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[1]],
        [disabledStates[0]],
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

export const colorThemeNotRequiredReadOnlyDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[1]],
        [disabledStates[1]],
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

export const colorThemeNotRequiredReadOnlyDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[0]],
        [readOnlyStates[1]],
        [disabledStates[1]],
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

export const lightThemeRequiredEditableEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[0]],
        [disabledStates[0]],
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

export const lightThemeRequiredEditableEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[0]],
        [disabledStates[0]],
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

export const lightThemeRequiredEditableDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[0]],
        [disabledStates[1]],
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

export const lightThemeRequiredEditableDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[0]],
        [disabledStates[1]],
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

export const lightThemeRequiredReadOnlyEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[1]],
        [disabledStates[0]],
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

export const lightThemeRequiredReadOnlyEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[1]],
        [disabledStates[0]],
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

export const lightThemeRequiredReadOnlyDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[1]],
        [disabledStates[1]],
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

export const lightThemeRequiredReadOnlyDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[1]],
        [disabledStates[1]],
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

export const darkThemeRequiredEditableEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[0]],
        [disabledStates[0]],
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

export const darkThemeRequiredEditableEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[0]],
        [disabledStates[0]],
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

export const darkThemeRequiredEditableDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[0]],
        [disabledStates[1]],
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

export const darkThemeRequiredEditableDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[0]],
        [disabledStates[1]],
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

export const darkThemeRequiredReadOnlyEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[1]],
        [disabledStates[0]],
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

export const darkThemeRequiredReadOnlyEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[1]],
        [disabledStates[0]],
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

export const darkThemeRequiredReadOnlyDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[1]],
        [disabledStates[1]],
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

export const darkThemeRequiredReadOnlyDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[1]],
        [disabledStates[1]],
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

export const colorThemeRequiredEditableEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[0]],
        [disabledStates[0]],
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

export const colorThemeRequiredEditableEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[0]],
        [disabledStates[0]],
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

export const colorThemeRequiredEditableDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[0]],
        [disabledStates[1]],
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

export const colorThemeRequiredEditableDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[0]],
        [disabledStates[1]],
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

export const colorThemeRequiredReadOnlyEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[1]],
        [disabledStates[0]],
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

export const colorThemeRequiredReadOnlyEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[1]],
        [disabledStates[0]],
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

export const colorThemeRequiredReadOnlyDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[1]],
        [disabledStates[1]],
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

export const colorThemeRequiredReadOnlyDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [requiredVisibleStates[1]],
        [readOnlyStates[1]],
        [disabledStates[1]],
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
