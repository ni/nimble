import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { pascalCase } from '@microsoft/fast-web-utilities';
import { createStory } from '../../utilities/tests/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../utilities/tests/matrix';
import {
    disabledStates,
    DisabledState,
    errorStates,
    ErrorState,
    disabledStateIsEnabled,
    errorStatesNoError,
    errorStatesErrorWithMessage
} from '../../utilities/tests/states';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { NumberFieldAppearance } from '../types';
import { textCustomizationWrapper } from '../../utilities/tests/text-customization';
import { numberFieldTag } from '..';

const metadata: Meta = {
    title: 'Tests/Number Field',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;
const valueStates = [
    ['Placeholder', null, 'placeholder'],
    ['Value', '1234', null]
] as const;
type ValueState = (typeof valueStates)[number];
const valueStatesHasValue = valueStates[1];

const appearanceStates = Object.entries(NumberFieldAppearance).map(
    ([key, value]) => [pascalCase(key), value]
);
type AppearanceState = (typeof appearanceStates)[number];

const hideStepStates = [
    ['', false],
    ['Hide Step', true]
] as const;
type HideStepState = (typeof hideStepStates)[number];
const hideStepStateStepVisible = hideStepStates[0];

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
