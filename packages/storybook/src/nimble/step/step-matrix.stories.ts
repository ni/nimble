import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, repeat, ViewTemplate, when } from '@ni/fast-element';
import { stepTag } from '@ni/nimble-components/dist/esm/step';
import { stepperTag } from '@ni/nimble-components/dist/esm/stepper';
import { iconCogTag } from '@ni/nimble-components/dist/esm/icons/cog';
import { bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixInteractions
} from '../../utilities/matrix';
import { createFixedThemeStory, createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import {
    selectedStates, type SelectedState,
    severityStates, type SeverityStates,
    stepContentStates, stepContentStateShort, stepContentStateStepIndicator, type StepContentStates,
    stepLayoutStates, type StepLayoutStates,
    stepManipulationState, type StepManipulationState,
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

const matrixTemplate = (template: ViewTemplate): ViewTemplate => html`
    <div style="
        display: grid;
        grid-template-columns: ${'1fr '.repeat(stepContentStates.length)};
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        width: 1200px;
    ">
    ${template}
    </div>
`;

export const matrix$LightTheme$ReadOnlyAbsent$DisabledAbsent: StoryFn = createFixedThemeStory(
    matrixTemplate(createMatrix(component, [
        [stepManipulationState.none],
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])),
    lightThemeWhiteBackground
);

export const matrix$LightTheme$ReadOnlyAbsent$Disabled: StoryFn = createFixedThemeStory(
    matrixTemplate(createMatrix(component, [
        [stepManipulationState.disabled],
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])),
    lightThemeWhiteBackground
);

export const matrix$LightTheme$ReadOnly$DisabledAbsent: StoryFn = createFixedThemeStory(
    matrixTemplate(createMatrix(component, [
        [stepManipulationState.readOnly],
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])),
    lightThemeWhiteBackground
);

export const matrix$LightTheme$ReadOnly$Disabled: StoryFn = createFixedThemeStory(
    matrixTemplate(createMatrix(component, [
        [stepManipulationState.readOnlyDisabled],
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])),
    lightThemeWhiteBackground
);

export const matrix$DarkTheme$ReadOnlyAbsent$DisabledAbsent: StoryFn = createFixedThemeStory(
    matrixTemplate(createMatrix(component, [
        [stepManipulationState.none],
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])),
    darkThemeBlackBackground
);

export const matrix$DarkTheme$ReadOnlyAbsent$Disabled: StoryFn = createFixedThemeStory(
    matrixTemplate(createMatrix(component, [
        [stepManipulationState.disabled],
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])),
    darkThemeBlackBackground
);

export const matrix$DarkTheme$ReadOnly$DisabledAbsent: StoryFn = createFixedThemeStory(
    matrixTemplate(createMatrix(component, [
        [stepManipulationState.readOnly],
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])),
    darkThemeBlackBackground
);

export const matrix$DarkTheme$ReadOnly$Disabled: StoryFn = createFixedThemeStory(
    matrixTemplate(createMatrix(component, [
        [stepManipulationState.readOnlyDisabled],
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])),
    darkThemeBlackBackground
);

export const matrix$ColorTheme$ReadOnlyAbsent$DisabledAbsent: StoryFn = createFixedThemeStory(
    matrixTemplate(createMatrix(component, [
        [stepManipulationState.none],
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])),
    colorThemeDarkGreenBackground
);

export const matrix$ColorTheme$ReadOnlyAbsent$Disabled: StoryFn = createFixedThemeStory(
    matrixTemplate(createMatrix(component, [
        [stepManipulationState.disabled],
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])),
    colorThemeDarkGreenBackground
);

export const matrix$ColorTheme$ReadOnly$DisabledAbsent: StoryFn = createFixedThemeStory(
    matrixTemplate(createMatrix(component, [
        [stepManipulationState.readOnly],
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])),
    colorThemeDarkGreenBackground
);

export const matrix$ColorTheme$ReadOnly$Disabled: StoryFn = createFixedThemeStory(
    matrixTemplate(createMatrix(component, [
        [stepManipulationState.readOnlyDisabled],
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])),
    colorThemeDarkGreenBackground
);

export const interactions$LightTheme$ReadOnlyAbsent$DisabledAbsent: StoryFn = createFixedThemeStory(
    createMatrixInteractions(component, [
        [stepManipulationState.none],
        stepLayoutStates,
        selectedStates,
        severityStates,
        [stepContentStateShort, stepContentStateStepIndicator],
    ]),
    lightThemeWhiteBackground
);

export const interactions$LightTheme$ReadOnlyAbsent$Disabled: StoryFn = createFixedThemeStory(
    createMatrixInteractions(component, [
        [stepManipulationState.disabled],
        stepLayoutStates,
        selectedStates,
        severityStates,
        [stepContentStateShort, stepContentStateStepIndicator],
    ]),
    lightThemeWhiteBackground
);

export const interactions$LightTheme$ReadOnly$DisabledAbsent: StoryFn = createFixedThemeStory(
    createMatrixInteractions(component, [
        [stepManipulationState.readOnly],
        stepLayoutStates,
        selectedStates,
        severityStates,
        [stepContentStateShort, stepContentStateStepIndicator],
    ]),
    lightThemeWhiteBackground
);

export const interactions$LightTheme$ReadOnly$Disabled: StoryFn = createFixedThemeStory(
    createMatrixInteractions(component, [
        [stepManipulationState.readOnlyDisabled],
        stepLayoutStates,
        selectedStates,
        severityStates,
        [stepContentStateShort, stepContentStateStepIndicator],
    ]),
    lightThemeWhiteBackground
);

export const interactions$DarkTheme$ReadOnlyAbsent$DisabledAbsent: StoryFn = createFixedThemeStory(
    createMatrixInteractions(component, [
        [stepManipulationState.none],
        stepLayoutStates,
        selectedStates,
        severityStates,
        [stepContentStateShort, stepContentStateStepIndicator],
    ]),
    darkThemeBlackBackground
);

export const interactions$DarkTheme$ReadOnlyAbsent$Disabled: StoryFn = createFixedThemeStory(
    createMatrixInteractions(component, [
        [stepManipulationState.disabled],
        stepLayoutStates,
        selectedStates,
        severityStates,
        [stepContentStateShort, stepContentStateStepIndicator],
    ]),
    darkThemeBlackBackground
);

export const interactions$DarkTheme$ReadOnly$DisabledAbsent: StoryFn = createFixedThemeStory(
    createMatrixInteractions(component, [
        [stepManipulationState.readOnly],
        stepLayoutStates,
        selectedStates,
        severityStates,
        [stepContentStateShort, stepContentStateStepIndicator],
    ]),
    darkThemeBlackBackground
);

export const interactions$DarkTheme$ReadOnly$Disabled: StoryFn = createFixedThemeStory(
    createMatrixInteractions(component, [
        [stepManipulationState.readOnlyDisabled],
        stepLayoutStates,
        selectedStates,
        severityStates,
        [stepContentStateShort, stepContentStateStepIndicator],
    ]),
    darkThemeBlackBackground
);

export const interactions$ColorTheme$ReadOnlyAbsent$DisabledAbsent: StoryFn = createFixedThemeStory(
    createMatrixInteractions(component, [
        [stepManipulationState.none],
        stepLayoutStates,
        selectedStates,
        severityStates,
        [stepContentStateShort, stepContentStateStepIndicator],
    ]),
    colorThemeDarkGreenBackground
);

export const interactions$ColorTheme$ReadOnlyAbsent$Disabled: StoryFn = createFixedThemeStory(
    createMatrixInteractions(component, [
        [stepManipulationState.disabled],
        stepLayoutStates,
        selectedStates,
        severityStates,
        [stepContentStateShort, stepContentStateStepIndicator],
    ]),
    colorThemeDarkGreenBackground
);

export const interactions$ColorTheme$ReadOnly$DisabledAbsent: StoryFn = createFixedThemeStory(
    createMatrixInteractions(component, [
        [stepManipulationState.readOnly],
        stepLayoutStates,
        selectedStates,
        severityStates,
        [stepContentStateShort, stepContentStateStepIndicator],
    ]),
    colorThemeDarkGreenBackground
);

export const interactions$ColorTheme$ReadOnly$Disabled: StoryFn = createFixedThemeStory(
    createMatrixInteractions(component, [
        [stepManipulationState.readOnlyDisabled],
        stepLayoutStates,
        selectedStates,
        severityStates,
        [stepContentStateShort, stepContentStateStepIndicator],
    ]),
    colorThemeDarkGreenBackground
);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${stepTag} hidden
            >Hidden Anchor Button</${stepTag}
        >`
    )
);
