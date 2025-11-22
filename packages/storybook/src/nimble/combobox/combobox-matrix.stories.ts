import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { standardPadding } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { comboboxTag } from '@ni/nimble-components/dist/esm/combobox';
import { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { createFixedThemeStory, createStory } from '../../utilities/storybook';
import { createMatrix, sharedMatrixParameters } from '../../utilities/matrix';
import {
    errorStates,
    type ErrorState,
    type RequiredVisibleState,
    requiredVisibleStates,
    type OnlyReadOnlyAbsentState,
    type FullBleedState,
    fullBleedStates,
    backgroundStates,
    disabledReadOnlyState
} from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { loremIpsum } from '../../utilities/lorem-ipsum';

const appearanceStates = [
    ['Underline', DropdownAppearance.underline],
    ['Outline', DropdownAppearance.outline],
    ['Block', DropdownAppearance.block],
    ['Frameless', DropdownAppearance.frameless]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const valueStates = [
    ['No Value', undefined, 'placeholder'],
    ['Short Value', 'Hello', 'placeholder'],
    ['Long Value', loremIpsum, 'placeholder']
] as const;
type ValueState = (typeof valueStates)[number];

const metadata: Meta = {
    title: 'Tests/Combobox',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (
    [disabledReadOnlyName, _readOnly, disabled, appearanceReadOnly]: OnlyReadOnlyAbsentState,
    [appearanceName, appearance]: AppearanceState,
    [fullBleedName, fullBleed]: FullBleedState,
    [requiredVisibleName, requiredVisible]: RequiredVisibleState,
    [errorName, errorVisible, errorText]: ErrorState,
    [valueName, value, placeholder]: ValueState
): ViewTemplate => html`
    <${comboboxTag} 
        ?disabled="${() => disabled}"
        ?appearance-readonly="${() => appearanceReadOnly}"
        appearance="${() => appearance}"
        ?full-bleed="${() => fullBleed}"
        ?error-visible="${() => errorVisible}"
        error-text="${() => errorText}"
        value="${() => value}"
        placeholder="${() => placeholder}"
        ?required-visible="${() => requiredVisible}"
        style="width: 250px; margin: var(${standardPadding.cssCustomProperty});"
    >
        ${() => disabledReadOnlyName}
        ${() => appearanceName}
        ${() => fullBleedName}
        ${() => errorName}
        ${() => valueName}
        ${() => requiredVisibleName}
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag} value="2" disabled>Option 2</${listOptionTag}>
        <${listOptionTag} value="3">Option 3</${listOptionTag}>
        <${listOptionTag} value="4" hidden>Option 4</${listOptionTag}>
    </${comboboxTag}>
`;

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground,
    ...remaining
] = backgroundStates;

if (remaining.length > 0) {
    throw new Error('New backgrounds need to be supported');
}

export const lightTheme$DisabledAbsent$AppearanceReadOnlyAbsent: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.none],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightTheme$DisabledAbsent$AppearanceReadOnly: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.appearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightTheme$Disabled$AppearanceReadOnlyAbsent: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabled],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const lightTheme$Disabled$AppearanceReadOnly: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabledAppearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const colorTheme$DisabledAbsent$AppearanceReadOnlyAbsent: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.none],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorTheme$DisabledAbsent$AppearanceReadOnly: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.appearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorTheme$Disabled$AppearanceReadOnlyAbsent: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabled],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorTheme$Disabled$AppearanceReadOnly: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabledAppearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const darkTheme$DisabledAbsent$AppearanceReadOnlyAbsent: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.none],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkTheme$DisabledAbsent$AppearanceReadOnly: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.appearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkTheme$Disabled$AppearanceReadOnlyAbsent: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabled],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const darkTheme$Disabled$AppearanceReadOnly: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [disabledReadOnlyState.disabledAppearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${comboboxTag} hidden style="width: 250px;">
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
        </${comboboxTag}>`
    )
);

export const blankListOption: StoryFn = createStory(
    html`<${comboboxTag} open style="width: 250px;">
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag}></${listOptionTag}>
    </${comboboxTag}>`
);

export const heightTest: StoryFn = createStory(
    html`
        <div style="display: flex; flex-direction: column">
            <${comboboxTag} style="border: 1px dashed; width: 250px">
                With Label
                <${listOptionTag} value="1">Option 1</${listOptionTag}>
            </${comboboxTag}>
            <${comboboxTag} style="border: 1px dashed; width: 250px">
                <${listOptionTag} value="1">Option 1</${listOptionTag}>
            </${comboboxTag}>
        </div>
    `
);
