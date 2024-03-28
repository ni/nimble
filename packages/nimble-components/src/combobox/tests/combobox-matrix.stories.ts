import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createStory } from '../../utilities/tests/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    errorStates,
    ErrorState
} from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { DropdownAppearance } from '../../patterns/dropdown/types';
import {
    controlLabelFont,
    controlLabelFontColor,
    menuMinWidth,
    standardPadding
} from '../../theme-provider/design-tokens';
import { comboboxTag } from '..';
import { listOptionTag } from '../../list-option';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';

const appearanceStates = [
    ['Underline', DropdownAppearance.underline],
    ['Outline', DropdownAppearance.outline],
    ['Block', DropdownAppearance.block]
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
    [disabledName, disabled]: DisabledState,
    [appearanceName, appearance]: AppearanceState,
    [errorName, errorVisible, errorText]: ErrorState,
    [valueName, value, placeholder]: ValueState
): ViewTemplate => html`
    <div style="
        display: inline-flex;
        flex-direction: column;
        margin: var(${standardPadding.cssCustomProperty});
        font: var(${controlLabelFont.cssCustomProperty});
        color: var(${controlLabelFontColor.cssCustomProperty});"
    >
        <label>
            ${() => disabledName}
            ${() => appearanceName}
            ${() => errorName}
            ${() => valueName}
        </label>
        <${comboboxTag} 
            ?disabled="${() => disabled}"
            appearance="${() => appearance}"
            ?error-visible="${() => errorVisible}"
            error-text="${() => errorText}"
            value="${() => value}"
            placeholder="${() => placeholder}"
            style="width: var(${menuMinWidth.cssCustomProperty});"
        >
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
            <${listOptionTag} value="2" disabled>Option 2</${listOptionTag}>
            <${listOptionTag} value="3">Option 3</${listOptionTag}>
            <${listOptionTag} value="4" hidden>Option 4</${listOptionTag}>
        </${comboboxTag}>
    </div>
`;

export const comboboxThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        appearanceStates,
        errorStates,
        valueStates
    ])
);

export const hiddenCombobox: StoryFn = createStory(
    hiddenWrapper(
        html`<${comboboxTag} hidden>
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
        </${comboboxTag}>`
    )
);

export const blankListOption: StoryFn = createStory(
    html`<${comboboxTag} open>
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag}></${listOptionTag}>
    </${comboboxTag}>`
);
