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
    disabledReadOnlyState
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

export const lightTheme$Editable$Enabled$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.none],
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

export const lightTheme$Editable$Enabled$AppearanceReadOnly$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.appearanceReadOnly],
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

export const lightTheme$Editable$Enabled$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.none],
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

export const lightTheme$Editable$Enabled$AppearanceReadOnly$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.appearanceReadOnly],
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

export const lightTheme$Editable$Disabled$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabled],
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

export const lightTheme$Editable$Disabled$AppearanceReadOnly$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabledAppearanceReadOnly],
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

export const lightTheme$Editable$Disabled$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabled],
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

export const lightTheme$Editable$Disabled$AppearanceReadOnly$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabledAppearanceReadOnly],
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

export const lightTheme$ReadOnly$Enabled$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnly],
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

export const lightTheme$ReadOnly$Enabled$AppearanceReadOnly$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyAppearanceReadOnly],
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

export const lightTheme$ReadOnly$Enabled$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnly],
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

export const lightTheme$ReadOnly$Enabled$AppearanceReadOnly$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyAppearanceReadOnly],
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

export const lightTheme$ReadOnly$Disabled$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyDisabled],
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

export const lightTheme$ReadOnly$Disabled$AppearanceReadOnly$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyDisabledAppearanceReadOnly],
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

export const lightTheme$ReadOnly$Disabled$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyDisabled],
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

export const lightTheme$ReadOnly$Disabled$AppearanceReadOnly$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyDisabledAppearanceReadOnly],
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

export const darkTheme$Editable$Enabled$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.none],
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

export const darkTheme$Editable$Enabled$AppearanceReadOnly$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.appearanceReadOnly],
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

export const darkTheme$Editable$Enabled$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.none],
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

export const darkTheme$Editable$Enabled$AppearanceReadOnly$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.appearanceReadOnly],
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

export const darkTheme$Editable$Disabled$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabled],
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

export const darkTheme$Editable$Disabled$AppearanceReadOnly$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabledAppearanceReadOnly],
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

export const darkTheme$Editable$Disabled$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabled],
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

export const darkTheme$Editable$Disabled$AppearanceReadOnly$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabledAppearanceReadOnly],
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

export const darkTheme$ReadOnly$Enabled$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnly],
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

export const darkTheme$ReadOnly$Enabled$AppearanceReadOnly$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyAppearanceReadOnly],
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

export const darkTheme$ReadOnly$Enabled$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnly],
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

export const darkTheme$ReadOnly$Enabled$AppearanceReadOnly$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyAppearanceReadOnly],
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

export const darkTheme$ReadOnly$Disabled$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyDisabled],
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

export const darkTheme$ReadOnly$Disabled$AppearanceReadOnly$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyDisabledAppearanceReadOnly],
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

export const darkTheme$ReadOnly$Disabled$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyDisabled],
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

export const darkTheme$ReadOnly$Disabled$AppearanceReadOnly$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyDisabledAppearanceReadOnly],
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

export const colorTheme$Editable$Enabled$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.none],
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

export const colorTheme$Editable$Enabled$AppearanceReadOnly$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.appearanceReadOnly],
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

export const colorTheme$Editable$Enabled$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.none],
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

export const colorTheme$Editable$Enabled$AppearanceReadOnly$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.appearanceReadOnly],
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

export const colorTheme$Editable$Disabled$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabled],
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

export const colorTheme$Editable$Disabled$AppearanceReadOnly$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabledAppearanceReadOnly],
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

export const colorTheme$Editable$Disabled$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabled],
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

export const colorTheme$Editable$Disabled$AppearanceReadOnly$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabledAppearanceReadOnly],
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

export const colorTheme$ReadOnly$Enabled$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnly],
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

export const colorTheme$ReadOnly$Enabled$AppearanceReadOnly$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyAppearanceReadOnly],
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

export const colorTheme$ReadOnly$Enabled$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnly],
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

export const colorTheme$ReadOnly$Enabled$AppearanceReadOnly$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyAppearanceReadOnly],
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

export const colorTheme$ReadOnly$Disabled$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyDisabled],
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

export const colorTheme$ReadOnly$Disabled$AppearanceReadOnly$WithoutButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyDisabledAppearanceReadOnly],
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

export const colorTheme$ReadOnly$Disabled$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyDisabled],
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

export const colorTheme$ReadOnly$Disabled$AppearanceReadOnly$WithButtons: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.readOnlyDisabledAppearanceReadOnly],
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

export const requiredVisibleThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(requiredVisibleStatesComponent, [
        requiredVisibleStates,
        appearanceStates,
        readOnlyStates,
        disabledStates,
        errorStates
    ])
);

export const hidden: StoryFn = createStory(
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
