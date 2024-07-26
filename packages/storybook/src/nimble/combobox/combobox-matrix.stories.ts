import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    controlLabelFont,
    controlLabelFontColor,
    standardPadding
} from '../../../../nimble-components/src/theme-provider/design-tokens';
import { listOptionTag } from '../../../../nimble-components/src/list-option';
import { comboboxTag } from '../../../../nimble-components/src/combobox';
import { DropdownAppearance } from '../../../../nimble-components/src/patterns/dropdown/types';
import { createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/matrix';
import {
    disabledStates,
    DisabledState,
    errorStates,
    ErrorState
} from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { loremIpsum } from '../../utilities/lorem-ipsum';

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
            style="width: 250px;"
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
