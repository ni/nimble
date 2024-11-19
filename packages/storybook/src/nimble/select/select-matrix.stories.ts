import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { keyArrowDown } from '@microsoft/fast-web-utilities';
import { standardPadding } from '../../../../nimble-components/src/theme-provider/design-tokens';
import { listOptionTag } from '../../../../nimble-components/src/list-option';
import { listOptionGroupTag } from '../../../../nimble-components/src/list-option-group';
import { selectTag } from '../../../../nimble-components/src/select';
import { DropdownAppearance } from '../../../../nimble-components/src/patterns/dropdown/types';
import { waitForUpdatesAsync } from '../../../../nimble-components/src/testing/async-helpers';
import { createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/matrix';
import {
    disabledStates,
    DisabledState,
    ErrorState,
    errorStates
} from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';
import { loremIpsum } from '../../utilities/lorem-ipsum';

const appearanceStates = [
    ['Underline', DropdownAppearance.underline],
    ['Outline', DropdownAppearance.outline],
    ['Block', DropdownAppearance.block]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const valueStates = [
    ['Short Value', 'Option 1'],
    ['Long Value', loremIpsum]
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
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [errorName, errorVisible, errorText]: ErrorState,
    [valueName, valueValue]: ValueState,
    [clearableName, clearable]: ClearableState
): ViewTemplate => html`
    <${selectTag}
        ?error-visible="${() => errorVisible}"
        error-text="${() => errorText}"
        ?disabled="${() => disabled}"
        ?clearable="${() => clearable}"
        appearance="${() => appearance}"
        style="width: 250px; margin: var(${standardPadding.cssCustomProperty});"
    >
        ${() => errorName} ${() => disabledName} ${() => appearanceName} ${() => valueName} ${() => clearableName}
        <${listOptionTag} value="1">${valueValue}</${listOptionTag}>
        <${listOptionTag} value="2" disabled>Option 2</${listOptionTag}>
        <${listOptionTag} value="3">Option 3</${listOptionTag}>
        <${listOptionTag} value="4" hidden>Option 4</${listOptionTag}>
    </${selectTag}>
`;

export const selectThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        appearanceStates,
        errorStates,
        valueStates,
        clearableStates
    ])
);

export const hiddenSelect: StoryFn = createStory(
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
