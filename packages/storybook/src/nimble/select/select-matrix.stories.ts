import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@ni/fast-element';
import { keyArrowDown } from '@ni/fast-web-utilities';
import { mediumPadding } from '../../../../nimble-components/src/theme-provider/design-tokens';
import { listOptionTag } from '../../../../nimble-components/src/list-option';
import { listOptionGroupTag } from '../../../../nimble-components/src/list-option-group';
import { selectTag } from '../../../../nimble-components/src/select';
import { DropdownAppearance } from '../../../../nimble-components/src/patterns/dropdown/types';
import { waitForUpdatesAsync } from '../../../../nimble-components/src/testing/async-helpers';
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
    type OnlyReadOnlyAbsentState,
    onlyReadOnlyAbsentStates,
    type FullBleedState,
    fullBleedStates
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

// prettier-ignore
const component = (
    [disabledReadOnlyName, _readOnly, disabled, appearanceReadOnly]: OnlyReadOnlyAbsentState,
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
        style="width: 250px; margin: var(${mediumPadding.cssCustomProperty});"
    >
        ${() => errorName} ${() => disabledReadOnlyName}
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

export const lightTheme$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        onlyReadOnlyAbsentStates,
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    lightThemeWhiteBackground
);

export const lightTheme$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        onlyReadOnlyAbsentStates,
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    lightThemeWhiteBackground
);

export const colorTheme$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        onlyReadOnlyAbsentStates,
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    colorThemeDarkGreenBackground
);

export const colorTheme$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        onlyReadOnlyAbsentStates,
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [clearableState]
    ]),
    colorThemeDarkGreenBackground
);

export const darkTheme$NotClearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        onlyReadOnlyAbsentStates,
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        errorStates,
        valueStates,
        [notClearableState]
    ]),
    darkThemeBlackBackground
);

export const darkTheme$Clearable: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        onlyReadOnlyAbsentStates,
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
    html`<${selectTag} open style="width: 250px;">
        <${listOptionTag} value="1" selected>Option 1</${listOptionTag}>
        <${listOptionTag}>Option 2</${listOptionTag}>
    </${selectTag}>`
);

navigateToDifferentOption.play = playFunction;

export const navigateToDifferentOptionWithGroups: StoryFn = createStory(
    html`
    <div style="height: 250px;">
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
