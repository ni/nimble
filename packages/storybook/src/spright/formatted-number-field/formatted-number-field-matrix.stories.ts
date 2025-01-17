import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { formattedNumberFieldTag } from '../../../../spright-components/src/formatted-number-field';
import { FormattedNumberFieldAppearance } from '../../../../spright-components/src/formatted-number-field/types';
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
    type DisabledState,
    errorStates,
    type ErrorState,
    disabledStateIsEnabled,
    errorStatesNoError,
    errorStatesErrorWithMessage,
    type ReadOnlyState,
    readOnlyStates,
    type RequiredVisibleState,
    requiredVisibleStates
} from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';

const appearanceStates = [
    ['Underline', FormattedNumberFieldAppearance.underline],
    ['Outline', FormattedNumberFieldAppearance.outline],
    ['Block', FormattedNumberFieldAppearance.block]
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
    title: 'Tests Spright/Formatted Number Field',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [requiredVisibleName, requiredVisible]: RequiredVisibleState,
    [readOnlyName, readonly]: ReadOnlyState,
    [disabledName, disabled]: DisabledState,
    [hideStepName, hideStep]: HideStepState,
    [valueName, valueValue, placeholderValue]: ValueState,
    [errorName, errorVisible, errorText]: ErrorState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <${formattedNumberFieldTag}
        style="width: 250px; margin: 8px;"
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        appearance="${() => appearance}"
        ?hide-step="${() => hideStep}"
        ?readonly="${() => readonly}"
        ?disabled="${() => disabled}"
        error-text="${() => errorText}"
        ?error-visible="${() => errorVisible}"
        ?required-visible="${() => requiredVisible}"
    >
        ${() => errorName} ${() => appearanceName} ${() => valueName}
        ${() => hideStepName} ${() => disabledName} ${() => readOnlyName}
        ${() => requiredVisibleName}
    </${formattedNumberFieldTag}>
`;

export const formattedNumberFieldThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        requiredVisibleStates,
        readOnlyStates,
        disabledStates,
        hideStepStates,
        valueStates,
        errorStates,
        appearanceStates
    ])
);

const notRequiredState = requiredVisibleStates[0];

const interactionStatesHover = cartesianProduct([
    [notRequiredState],
    readOnlyStates,
    disabledStates,
    [hideStepStateStepVisible],
    [valueStatesHasValue],
    [errorStatesNoError, errorStatesErrorWithMessage],
    appearanceStates
] as const);

const interactionStates = cartesianProduct([
    [notRequiredState],
    readOnlyStates,
    [disabledStateIsEnabled],
    [hideStepStateStepVisible],
    [valueStatesHasValue],
    [errorStatesNoError, errorStatesErrorWithMessage],
    appearanceStates
] as const);

export const formattedNumberFieldInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    })
);

export const hiddenFormattedNumberField: StoryFn = createStory(
    hiddenWrapper(
        html`
            <${formattedNumberFieldTag} hidden>
                Hidden number field
            </${formattedNumberFieldTag}>
        `
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${formattedNumberFieldTag} value="42">Number field</${formattedNumberFieldTag}>`
    )
);

export const heightTest: StoryFn = createStory(
    html`
        <div style="display: flex; flex-direction: column">
            <${formattedNumberFieldTag} style="border: 1px dashed; width: 200px">
                With Label
            </${formattedNumberFieldTag}>
            <${formattedNumberFieldTag} style="border: 1px dashed; width: 200px">
            </${formattedNumberFieldTag}>
        </div>
    `
);
