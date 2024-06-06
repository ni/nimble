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
    ErrorState
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
        style="width: 350px; padding: 8px;"
        ?full-bleed="${() => fullBleed}"
        ?disabled="${() => disabled}"
        type="${() => type}"
        appearance="${() => appearance}"
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        ?readonly="${() => readonly}"
        ?error-visible="${() => errorVisible}"
        error-text="${() => errorText}"
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

export const lightThemeEditableEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const lightThemeEditableEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const lightThemeEditableDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const lightThemeEditableDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const lightThemeReadOnlyEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const lightThemeReadOnlyEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const lightThemeReadOnlyDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const lightThemeReadOnlyDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const darkThemeEditableEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const darkThemeEditableEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const darkThemeEditableDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const darkThemeEditableDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const darkThemeReadOnlyEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const darkThemeReadOnlyEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const darkThemeReadOnlyDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const darkThemeReadOnlyDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const colorThemeEditableEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const colorThemeEditableEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const colorThemeEditableDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const colorThemeEditableDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const colorThemeReadOnlyEnabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const colorThemeReadOnlyEnabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const colorThemeReadOnlyDisabledWithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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

export const colorThemeReadOnlyDisabledWithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
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
