import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    controlLabelFont,
    controlLabelFontColor,
    menuMinWidth,
    standardPadding
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { DropdownAppearance } from '@ni/nimble-components/dist/esm/patterns/dropdown/types';
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
