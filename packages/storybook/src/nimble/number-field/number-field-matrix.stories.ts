import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { numberFieldTag } from '@ni/nimble-components/dist/esm/number-field';
import { NumberFieldAppearance } from '@ni/nimble-components/dist/esm/number-field/types';
import { createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../utilities/matrix';
import {
    disabledStates,
    DisabledState,
    errorStates,
    ErrorState,
    disabledStateIsEnabled,
    errorStatesNoError,
    errorStatesErrorWithMessage
} from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';

const appearanceStates = [
    ['Underline', NumberFieldAppearance.underline],
    ['Outline', NumberFieldAppearance.outline],
    ['Block', NumberFieldAppearance.block]
] as const;
type AppearanceState = (typeof appearanceStates)[number];

const hideStepStates = [
    ['', false],
    ['Hide Step', true]
] as const;
type HideStepState = (typeof hideStepStates)[number];
const hideStepStateStepVisible = hideStepStates[0];

const valueStates = [
    ['Placeholder', null, 'placeholder'],
    ['Value', '1234', null]
] as const;
type ValueState = (typeof valueStates)[number];
const valueStatesHasValue = valueStates[1];

const metadata: Meta = {
    title: 'Tests/Number Field',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [disabledName, disabled]: DisabledState,
    [hideStepName, hideStep]: HideStepState,
    [valueName, valueValue, placeholderValue]: ValueState,
    [errorName, errorVisible, errorText]: ErrorState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <${numberFieldTag}
        style="width: 250px; padding: 8px;"
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        appearance="${() => appearance}"
        ?hide-step="${() => hideStep}"
        ?disabled="${() => disabled}"
        error-text="${() => errorText}"
        ?error-visible="${() => errorVisible}"
    >
        ${() => errorName} ${() => appearanceName} ${() => valueName}
        ${() => hideStepName} ${() => disabledName}
    </${numberFieldTag}>
`;

export const numberFieldThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        hideStepStates,
        valueStates,
        errorStates,
        appearanceStates
    ])
);

const interactionStatesHover = cartesianProduct([
    disabledStates,
    [hideStepStateStepVisible],
    [valueStatesHasValue],
    [errorStatesNoError, errorStatesErrorWithMessage],
    appearanceStates
] as const);

const interactionStates = cartesianProduct([
    [disabledStateIsEnabled],
    [hideStepStateStepVisible],
    [valueStatesHasValue],
    [errorStatesNoError, errorStatesErrorWithMessage],
    appearanceStates
] as const);

export const numberFieldInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    })
);

export const hiddenNumberField: StoryFn = createStory(
    hiddenWrapper(
        html`
            <${numberFieldTag} hidden>
                Hidden number field
            </${numberFieldTag}>
        `
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${numberFieldTag} value="42">Number field</${numberFieldTag}>`
    )
);

export const heightTest: StoryFn = createStory(
    html`
        <div style="display: flex; flex-direction: column">
            <${numberFieldTag} style="border: 1px dashed; width: 200px">
                With Label
            </${numberFieldTag}>
            <${numberFieldTag} style="border: 1px dashed; width: 200px">
            </${numberFieldTag}>
        </div>
    `
);
