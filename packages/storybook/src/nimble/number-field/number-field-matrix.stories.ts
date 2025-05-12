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
    [appearanceName, appearance]: AppearanceState,
    [
        disabledReadOnlyName,
        readonly,
        disabled,
        appearanceReadOnly
    ]: DisabledReadOnlyState,
    [errorName, errorVisible, errorText]: ErrorState,
    [hideStepName, hideStep]: HideStepState,
    [requiredVisibleName, requiredVisible]: RequiredVisibleState,
    [valueName, valueValue, placeholderValue]: ValueState
): ViewTemplate => html`
    <style>
        ${numberFieldTag} {
            width: 250px;
            margin: 0px 8px 16px 8px;
        }
    </style>
    <${numberFieldTag}
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
        appearanceStates,
        disabledReadOnlyStates,
        errorStates,
        hideStepStates,
        requiredVisibleStates,
        valueStates
    ]),
    lightThemeWhiteBackground
);

export const colorTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        appearanceStates,
        disabledReadOnlyStates,
        errorStates,
        hideStepStates,
        requiredVisibleStates,
        valueStates
    ]),
    colorThemeDarkGreenBackground
);

export const darkTheme: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        appearanceStates,
        disabledReadOnlyStates,
        errorStates,
        hideStepStates,
        requiredVisibleStates,
        valueStates
    ]),
    darkThemeBlackBackground
);

const notRequiredState = requiredVisibleStates[0];

const interactionStatesHover = cartesianProduct([
    appearanceStates,
    disabledReadOnlyStates,
    [errorStatesNoError, errorStatesErrorWithMessage],
    [hideStepStateStepVisible],
    [notRequiredState],
    [valueStatesHasValue]
] as const);

const interactionStates = cartesianProduct([
    appearanceStates,
    disabledReadOnlyStates,
    [errorStatesNoError, errorStatesErrorWithMessage],
    [hideStepStateStepVisible],
    [notRequiredState],
    [valueStatesHasValue]
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
