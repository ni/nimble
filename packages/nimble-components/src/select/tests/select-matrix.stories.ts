import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { keyArrowDown } from '@microsoft/fast-web-utilities';
import { createStory } from '../../utilities/tests/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    ErrorState,
    errorStates
} from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { DropdownAppearance } from '../../patterns/dropdown/types';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import {
    controlLabelFont,
    controlLabelFontColor,
    menuMinWidth,
    standardPadding
} from '../../theme-provider/design-tokens';
import { Select, selectTag } from '..';
import { listOptionTag } from '../../list-option';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

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
): ViewTemplate => html`
    <div style="
        display: inline-flex;
        flex-direction: column;
        margin: var(${standardPadding.cssCustomProperty});
        font: var(${controlLabelFont.cssCustomProperty});
        color: var(${controlLabelFontColor.cssCustomProperty});"
    >
        <label>${() => errorName} ${() => disabledName} ${() => appearanceName} ${() => valueName}</label>
        <${selectTag}
            ?error-visible="${() => errorVisible}"
            error-text="${() => errorText}"
            ?disabled="${() => disabled}"
            appearance="${() => appearance}"
            style="width: var(${menuMinWidth.cssCustomProperty});"
        >
            <${listOptionTag} value="1">${valueValue}</${listOptionTag}>
            <${listOptionTag} value="2" disabled>Option 2</${listOptionTag}>
            <${listOptionTag} value="3">Option 3</${listOptionTag}>
            <${listOptionTag} value="4" hidden>Option 4</${listOptionTag}>
        </${selectTag}>
    </div>
`;

export const selectThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        appearanceStates,
        errorStates,
        valueStates
    ])
);

export const hiddenSelect: StoryFn = createStory(
    hiddenWrapper(
        html`<${selectTag} hidden>
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
        </${selectTag}>`
    )
);

export const blankListOption: StoryFn = createStory(
    html`<${selectTag} open>
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag}></${listOptionTag}>
    </${selectTag}>`
);

const playFunction = async (): Promise<void> => {
    await Promise.all(
        Array.from(document.querySelectorAll<Select>('nimble-select')).map(
            async select => {
                const arrowDownEvent = new KeyboardEvent('keydown', {
                    key: keyArrowDown
                });
                select.dispatchEvent(arrowDownEvent);
                await waitForUpdatesAsync();
            }
        )
    );
};

export const navigateToDifferentOption: StoryFn = createStory(
    html`<${selectTag} open>
        <${listOptionTag} value="1" selected>Option 1</${listOptionTag}>
        <${listOptionTag}>Option 2</${listOptionTag}>
    </${selectTag}>`
);

navigateToDifferentOption.play = playFunction;

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`
            <${selectTag}>
                Inner text
                <${listOptionTag}> Nimble select item </${listOptionTag}>
            </${selectTag}>
        `
    )
);
