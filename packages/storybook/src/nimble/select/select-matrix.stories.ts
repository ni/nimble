import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { keyArrowDown } from '@ni/fast-web-utilities';
import { standardPadding } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { listOptionGroupTag } from '@ni/nimble-components/dist/esm/list-option-group';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { createFixedThemeStory, createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/matrix';
import {
    type ErrorState,
    errorStates,
    requiredVisibleStates,
    type RequiredVisibleState,
    backgroundStates,
    type ManipulationReadOnlyAbsentState,
    type FullBleedState,
    fullBleedStates,
    manipulationState
} from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';
import { loremIpsum } from '../../utilities/lorem-ipsum';

const appearanceStates = [
    ['Underline', DropdownAppearance.underline],
    ['Outline', DropdownAppearance.outline],
    ['Block', DropdownAppearance.block],
    ['Frameless', DropdownAppearance.frameless]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const valueStates = [
    ['Short Value', 1],
    ['Long Value', 2],
    ['Placeholder', undefined]
] as const;
type ValueState = (typeof valueStates)[number];

const clearableStates = [
    ['', false],
    ['Clearable', true]
] as const;
type ClearableState = (typeof clearableStates)[number];

const metadata: Meta = {
    title: 'Tests/Select',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [manipulationName, _readOnly, disabled, appearanceReadOnly]: ManipulationReadOnlyAbsentState,
    [appearanceName, appearance]: AppearanceState,
    [fullBleedName, fullBleed]: FullBleedState,
    [requiredVisibleName, requiredVisible]: RequiredVisibleState,
    [errorName, errorVisible, errorText]: ErrorState,
    [valueName, selectedValue]: ValueState,
    [_clearableName, clearable]: ClearableState
): ViewTemplate => html`
    <${selectTag}
        ?error-visible="${() => errorVisible}"
        error-text="${() => errorText}"
        ?disabled="${() => disabled}"
        ?appearance-readonly="${() => appearanceReadOnly}"
        ?clearable="${() => clearable}"
        appearance="${() => appearance}"
        ?full-bleed="${() => fullBleed}"
        ?required-visible="${() => requiredVisible}"
        current-value="${() => selectedValue}"
        style="width: 250px; margin: var(${standardPadding.cssCustomProperty});"
    >
        ${() => errorName} ${() => manipulationName}
        ${() => appearanceName} ${() => fullBleedName}
        ${() => valueName} ${() => requiredVisibleName}

        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag} value="2">${loremIpsum}</${listOptionTag}>
        <${listOptionTag} value="3" disabled>Option 3</${listOptionTag}>
        <${listOptionTag} value="4" hidden>Option 4</${listOptionTag}>
        <${listOptionTag} value="5" disabled hidden>Placeholder</${listOptionTag}>
    </${selectTag}>
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

const notClearableState = clearableStates[0];
const clearableState = clearableStates[1];

export const lightTheme$DisabledAbsent$AppearanceReadOnlyAbsent$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.none],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    lightThemeWhiteBackground
);

export const lightTheme$DisabledAbsent$AppearanceReadOnly$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.appearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    lightThemeWhiteBackground
);

export const lightTheme$Disabled$AppearanceReadOnlyAbsent$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.disabled],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    lightThemeWhiteBackground
);

export const lightTheme$Disabled$AppearanceReadOnly$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.disabledAppearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    lightThemeWhiteBackground
);

export const lightTheme$DisabledAbsent$AppearanceReadOnlyAbsent$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.none],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    lightThemeWhiteBackground
);

export const lightTheme$DisabledAbsent$AppearanceReadOnly$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.appearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    lightThemeWhiteBackground
);

export const lightTheme$Disabled$AppearanceReadOnlyAbsent$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.disabled],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    lightThemeWhiteBackground
);

export const lightTheme$Disabled$AppearanceReadOnly$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.disabledAppearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    lightThemeWhiteBackground
);

export const colorTheme$DisabledAbsent$AppearanceReadOnlyAbsent$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.none],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    colorThemeDarkGreenBackground
);

export const colorTheme$DisabledAbsent$AppearanceReadOnly$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.appearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    colorThemeDarkGreenBackground
);

export const colorTheme$Disabled$AppearanceReadOnlyAbsent$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.disabled],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    colorThemeDarkGreenBackground
);

export const colorTheme$Disabled$AppearanceReadOnly$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.disabledAppearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    colorThemeDarkGreenBackground
);

export const colorTheme$DisabledAbsent$AppearanceReadOnlyAbsent$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.none],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    colorThemeDarkGreenBackground
);

export const colorTheme$DisabledAbsent$AppearanceReadOnly$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.appearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    colorThemeDarkGreenBackground
);

export const colorTheme$Disabled$AppearanceReadOnlyAbsent$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.disabled],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    colorThemeDarkGreenBackground
);

export const colorTheme$Disabled$AppearanceReadOnly$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.disabledAppearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    colorThemeDarkGreenBackground
);

export const darkTheme$DisabledAbsent$AppearanceReadOnlyAbsent$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.none],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    darkThemeBlackBackground
);

export const darkTheme$DisabledAbsent$AppearanceReadOnly$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.appearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    darkThemeBlackBackground
);

export const darkTheme$Disabled$AppearanceReadOnlyAbsent$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.disabled],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    darkThemeBlackBackground
);

export const darkTheme$Disabled$AppearanceReadOnly$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.disabledAppearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    darkThemeBlackBackground
);

export const darkTheme$DisabledAbsent$AppearanceReadOnlyAbsent$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.none],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    darkThemeBlackBackground
);

export const darkTheme$DisabledAbsent$AppearanceReadOnly$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.appearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    darkThemeBlackBackground
);

export const darkTheme$Disabled$AppearanceReadOnlyAbsent$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.disabled],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    darkThemeBlackBackground
);

export const darkTheme$Disabled$AppearanceReadOnly$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        [manipulationState.disabledAppearanceReadOnly],
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    darkThemeBlackBackground
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${selectTag} hidden style="width: 250px;">
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
        </${selectTag}>`
    )
);

export const blankListOption: StoryFn = createStory(
    html`<${selectTag} open style="width: 250px;">
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag}></${listOptionTag}>
    </${selectTag}>`
);

const playFunction = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll(selectTag)).map(async select => {
            const arrowDownEvent = new KeyboardEvent('keydown', {
                key: keyArrowDown
            });
            select.dispatchEvent(arrowDownEvent);
            await waitForUpdatesAsync();
        })
    );
};

export const navigateToDifferentOption: StoryFn = createStory(
    html`
    <div style="height: 130px; width: 250px;">
        <${selectTag} open style="width: 250px;">
            <${listOptionTag} value="1" selected>Option 1</${listOptionTag}>
            <${listOptionTag}>Option 2</${listOptionTag}>
        </${selectTag}>
    </div>`
);

navigateToDifferentOption.play = playFunction;

export const navigateToDifferentOptionWithGroups: StoryFn = createStory(
    html`
    <div style="height: 130px; width: 250px;">
        <${selectTag} open style="width: 250px;">
            <${listOptionGroupTag} label="Group 1">
                <${listOptionTag} value="1" selected>Option 1</${listOptionTag}>
                <${listOptionTag}>Option 2</${listOptionTag}>
            </${listOptionGroupTag}>
        </${selectTag}>
    </div>`
);

navigateToDifferentOptionWithGroups.play = playFunction;

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`
            <${selectTag} style="width: 250px;">
                Inner text
                <${listOptionTag}> Nimble select item </${listOptionTag}>
            </${selectTag}>
        `
    )
);

export const heightTest: StoryFn = createStory(
    html`
        <div style="display: flex; flex-direction: column">
            <${selectTag} style="border: 1px dashed; width: 250px">
                With Label
                <${listOptionTag} value="1">Option 1</${listOptionTag}>
            </${selectTag}>
            <${selectTag} style="border: 1px dashed; width: 250px">
                <${listOptionTag} value="1">Option 1</${listOptionTag}>
            </${selectTag}>
        </div>
    `
);
