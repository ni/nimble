import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@ni/fast-element';
import { numberFieldTag } from '../../../../nimble-components/src/number-field';
import { NumberFieldAppearance } from '../../../../nimble-components/src/number-field/types';
import { createFixedThemeStory, createStory } from '../../utilities/storybook';
import {
    createMatrixThemeStory,
    sharedMatrixParameters,
    cartesianProduct,
    createMatrixInteractionsFromStates,
    createMatrix
} from '../../utilities/matrix';
import {
    errorStates,
    type ErrorState,
    errorStatesNoError,
    errorStatesErrorWithMessage,
    type RequiredVisibleState,
    requiredVisibleStates,
    type DisabledReadOnlyState,
    disabledReadOnlyStates,
    disabledReadOnlyState,
    backgroundStates
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
    [requiredVisibleName, requiredVisible]: RequiredVisibleState,
    [
        disabledReadOnlyName,
        readonly,
        disabled,
        appearanceReadOnly
    ]: DisabledReadOnlyState,
    [hideStepName, hideStep]: HideStepState,
    [valueName, valueValue, placeholderValue]: ValueState,
    [errorName, errorVisible, errorText]: ErrorState,
    [appearanceName, appearance]: AppearanceState
): ViewTemplate => html`
    <${numberFieldTag}
        style="width: 250px; margin: 8px;"
        value="${() => valueValue}"
        placeholder="${() => placeholderValue}"
        appearance="${() => appearance}"
        ?hide-step="${() => hideStep}"
        ?readonly="${() => readonly}"
        ?disabled="${() => disabled}"
        ?appearance-readonly="${() => appearanceReadOnly}"
        error-text="${() => errorText}"
        ?error-visible="${() => errorVisible}"
        ?required-visible="${() => requiredVisible}"
    >
        ${() => errorName} ${() => appearanceName} ${() => valueName}
        ${() => hideStepName} ${() => disabledReadOnlyName}
        ${() => requiredVisibleName}
    </${numberFieldTag}>
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

export const lightTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        requiredVisibleStates,
        disabledReadOnlyStates,
        hideStepStates,
        valueStates,
        errorStates,
        appearanceStates
    ]),
    lightThemeWhiteBackground
);

export const colorTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        requiredVisibleStates,
        disabledReadOnlyStates,
        hideStepStates,
        valueStates,
        errorStates,
        appearanceStates
    ]),
    colorThemeDarkGreenBackground
);

export const darkTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        requiredVisibleStates,
        disabledReadOnlyStates,
        hideStepStates,
        valueStates,
        errorStates,
        appearanceStates
    ]),
    darkThemeBlackBackground
);

const notRequiredState = requiredVisibleStates[0];

const interactionStatesHover = cartesianProduct([
    [notRequiredState],
    disabledReadOnlyStates,
    [hideStepStateStepVisible],
    [valueStatesHasValue],
    [errorStatesNoError, errorStatesErrorWithMessage],
    appearanceStates
] as const);

const interactionStates = cartesianProduct([
    [notRequiredState],
    disabledReadOnlyState.allDisabledAbsentStates,
    [hideStepStateStepVisible],
    [valueStatesHasValue],
    [errorStatesNoError, errorStatesErrorWithMessage],
    appearanceStates
] as const);

export const interactionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    })
);

export const hidden: StoryFn = createStory(
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
