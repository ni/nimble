import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, repeat, ViewTemplate, when } from '@ni/fast-element';
import { stepTag } from '@ni/nimble-components/dist/esm/step';
import { stepperTag } from '@ni/nimble-components/dist/esm/stepper';
import { iconCogTag } from '@ni/nimble-components/dist/esm/icons/cog';
import { bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    createMatrix,
    sharedMatrixParameters,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../utilities/matrix';
import { createFixedThemeStory, createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import {
    selectedStates, type SelectedState,
    severityStates, type SeverityStates,
    stepContentStates, stepContentStateShort, stepContentStateStepIndicator, type StepContentStates,
    stepLayoutStates, type StepLayoutStates,
    stepManipulationStates, type StepManipulationState
} from '../stepper/types';
import { backgroundStates } from '../../utilities/states';

const metadata: Meta = {
    title: 'Tests/Step',
    parameters: {
        ...sharedMatrixParameters()
    }
};

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground,
    ...remaining
] = backgroundStates;

if (remaining.length > 0) {
    throw new Error('New backgrounds need to be supported');
}

export default metadata;

const component = (
    [manipulationName, readonly, disabled]: StepManipulationState,
    [layoutName, isLast, orientation]: StepLayoutStates,
    [selectedName, selected]: SelectedState,
    [severityName, severity]: SeverityStates,
    [contentName, titleContent, subtitleContent, severityTextContent, stepIndicatorVisible]: StepContentStates,
): ViewTemplate => html`
    <div style="display: inline-flex; flex-direction: column; width: min-content;">
        <div style="padding-right: 16px;">${manipulationName} ${selectedName} Severity(${severityName}) Layout(${layoutName}) Content(${contentName})</div>
        <${stepperTag} style="padding-bottom: 16px; width: 200px; height: 80px;" orientation="${() => orientation}">
            ${repeat(() => [isLast, !isLast], html`
                <${stepTag}
                    ?disabled=${() => disabled} ?readonly=${() => readonly} ?selected=${() => selected} severity-text="${() => severityTextContent}" severity="${() => severity}"
                    style="${currentIsLast => (currentIsLast ? 'display:none;' : '')}">
                    ${when(() => titleContent !== undefined, html`<span slot="title">${() => titleContent}</span>`)}
                    ${when(() => subtitleContent !== undefined, html`<span slot="subtitle">${() => subtitleContent}</span>`)}
                    ${when(() => stepIndicatorVisible, html`<${iconCogTag} slot="step-indicator">${() => subtitleContent}</${iconCogTag}>`)}
                </${stepTag}>
            `)}
        </${stepperTag}>
    </div>
`;

const matrixTemplate = html`
    <div style="
        display: grid;
        grid-template-columns: ${'1fr '.repeat(stepContentStates.length)};
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        width: 1200px;
    ">
    ${createMatrix(component, [
        stepManipulationStates,
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])}
    </div>
`;

export const matrix$LightTheme: StoryFn = createFixedThemeStory(matrixTemplate, lightThemeWhiteBackground);
export const matrix$DarkTheme: StoryFn = createFixedThemeStory(matrixTemplate, darkThemeBlackBackground);
export const matrix$ColorTheme: StoryFn = createFixedThemeStory(matrixTemplate, colorThemeDarkGreenBackground);

const interactionStatesHover = cartesianProduct([
    stepManipulationStates,
    stepLayoutStates,
    selectedStates,
    severityStates,
    [stepContentStateShort, stepContentStateStepIndicator],
] as const);

const interactionStates = cartesianProduct([
    stepManipulationStates,
    stepLayoutStates,
    selectedStates,
    severityStates,
    [stepContentStateShort, stepContentStateStepIndicator],
] as const);

const interactionsTemplate = createMatrixInteractionsFromStates(component, {
    hover: interactionStatesHover,
    hoverActive: interactionStates,
    active: interactionStates,
    focus: interactionStates
});

export const interactions$LightTheme: StoryFn = createFixedThemeStory(interactionsTemplate, lightThemeWhiteBackground);
export const interactions$DarkTheme: StoryFn = createFixedThemeStory(interactionsTemplate, darkThemeBlackBackground);
export const interactions$ColorTheme: StoryFn = createFixedThemeStory(interactionsTemplate, colorThemeDarkGreenBackground);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${stepTag} hidden
            >Hidden Anchor Button</${stepTag}
        >`
    )
);
