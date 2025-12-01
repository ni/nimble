import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { numberFieldTag } from '@ni/nimble-components/dist/esm/number-field';
import { NumberFieldAppearance } from '@ni/nimble-components/dist/esm/number-field/types';
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
    type ManipulationState,
    manipulationStates,
    backgroundStates,
    fullBleedStates,
    type FullBleedState,
    manipulationDisabledAbsentStates
} from '../../utilities/states';
import { hiddenWrapper } from '../../utilities/hidden';
import { textCustomizationWrapper } from '../../utilities/text-customization';

const appearanceStates = [
    ['Underline', NumberFieldAppearance.underline],
    ['Outline', NumberFieldAppearance.outline],
    ['Block', NumberFieldAppearance.block],
    ['Frameless', NumberFieldAppearance.frameless]
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
    [
        manipulationName,
        readonly,
        disabled,
        appearanceReadOnly
    ]: ManipulationState,
    [appearanceName, appearance]: AppearanceState,
    [fullBleedName, fullBleed]: FullBleedState,
    [requiredVisibleName, requiredVisible]: RequiredVisibleState,
    [hideStepName, hideStep]: HideStepState,
    [valueName, valueValue, placeholderValue]: ValueState,
    [errorName, errorVisible, errorText]: ErrorState
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
        ?full-bleed="${() => fullBleed}"
    >
        ${() => errorName} ${() => appearanceName} ${() => fullBleedName}
        ${() => valueName} ${() => hideStepName}
        ${() => manipulationName} ${() => requiredVisibleName}
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

const stepsVisibleState = hideStepStates[0];
const stepsHiddenState = hideStepStates[1];

export const lightTheme$StepsHidden: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        manipulationStates,
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        [stepsHiddenState],
        valueStates,
        errorStates
    ]),
    lightThemeWhiteBackground
);

export const lightTheme$StepsVisible: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        manipulationStates,
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        [stepsVisibleState],
        valueStates,
        errorStates
    ]),
    lightThemeWhiteBackground
);

export const colorTheme$StepsHidden: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        manipulationStates,
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        [stepsHiddenState],
        valueStates,
        errorStates
    ]),
    colorThemeDarkGreenBackground
);

export const colorTheme$StepsVisible: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        manipulationStates,
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        [stepsVisibleState],
        valueStates,
        errorStates
    ]),
    colorThemeDarkGreenBackground
);

export const darkTheme$StepsHidden: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        manipulationStates,
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        [stepsHiddenState],
        valueStates,
        errorStates
    ]),
    darkThemeBlackBackground
);

export const darkTheme$StepsVisible: StoryFn = createFixedThemeStory(
    createMatrix(component, [
        manipulationStates,
        appearanceStates,
        fullBleedStates,
        requiredVisibleStates,
        [stepsVisibleState],
        valueStates,
        errorStates
    ]),
    darkThemeBlackBackground
);

const notRequiredState = requiredVisibleStates[0];

const interactionStatesHover = cartesianProduct([
    manipulationStates,
    appearanceStates,
    fullBleedStates,
    [notRequiredState],
    [hideStepStateStepVisible],
    [valueStatesHasValue],
    [errorStatesNoError, errorStatesErrorWithMessage]
] as const);

const interactionStates = cartesianProduct([
    manipulationDisabledAbsentStates,
    appearanceStates,
    fullBleedStates,
    [notRequiredState],
    [hideStepStateStepVisible],
    [valueStatesHasValue],
    [errorStatesNoError, errorStatesErrorWithMessage]
] as const);

export const lightTheme$interactionsThemeMatrix: StoryFn = createFixedThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    }),
    lightThemeWhiteBackground
);

export const colorTheme$interactionsThemeMatrix: StoryFn = createFixedThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    }),
    colorThemeDarkGreenBackground
);

export const darkTheme$interactionsThemeMatrix: StoryFn = createFixedThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    }),
    darkThemeBlackBackground
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
