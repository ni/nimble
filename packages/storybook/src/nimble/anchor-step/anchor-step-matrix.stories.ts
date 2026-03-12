import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, repeat, ViewTemplate, when } from '@ni/fast-element';
import { anchorStepTag } from '@ni/nimble-components/dist/esm/anchor-step';
import { stepperTag } from '@ni/nimble-components/dist/esm/stepper';
import { bodyFont, bodyFontColor } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../utilities/matrix';
import { createFixedThemeStory, createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import { selectedStates, severityStates, stepContentStateShort, stepContentStates, stepLayoutStates, type SelectedState, type SeverityStates, type StepContentStates, type StepLayoutStates } from '../stepper/types';
import { backgroundStates, disabledStates, type DisabledState } from '../../utilities/states';

const metadata: Meta = {
    title: 'Tests/Anchor Step',
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
    [disabledName, disabled]: DisabledState,
    [layoutName, isLast, orientation]: StepLayoutStates,
    [selectedName, selected]: SelectedState,
    [severityName, severity]: SeverityStates,
    [contentName, titleContent, subtitleContent, severityTextContent]: StepContentStates,
): ViewTemplate => html`
    <div style="display: inline-flex; flex-direction: column;">
        <div style="padding-right: 16px;">${disabledName} ${selectedName} Severity(${severityName}) Layout(${layoutName}) Content(${contentName})</div>
        <${stepperTag} style="padding-bottom: 16px; width: 200px; height: 80px;" orientation="${() => orientation}">
            ${repeat(() => [isLast, !isLast], html`
                <${anchorStepTag} href="#" target="_self"
                    ?disabled=${() => disabled} ?selected=${() => selected} severity-text="${() => severityTextContent}" severity="${() => severity}"
                    style="${currentIsLast => (currentIsLast ? 'display:none;' : '')}">
                    ${when(() => titleContent !== undefined, html`<span slot="title">${() => titleContent}</span>`)}
                    ${when(() => subtitleContent !== undefined, html`<span slot="subtitle">${() => subtitleContent}</span>`)}
                </${anchorStepTag}>
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
        width: 1800px;
    ">
    ${createMatrix(component, [
        disabledStates,
        stepLayoutStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])}
    </div>
`;

export const lightTheme: StoryFn = createFixedThemeStory(matrixTemplate, lightThemeWhiteBackground);
export const darkTheme: StoryFn = createFixedThemeStory(matrixTemplate, darkThemeBlackBackground);
export const colorTheme: StoryFn = createFixedThemeStory(matrixTemplate, colorThemeDarkGreenBackground);

const interactionStatesHover = cartesianProduct([
    disabledStates,
    stepLayoutStates,
    selectedStates,
    severityStates,
    [stepContentStateShort],
] as const);

const interactionStates = cartesianProduct([
    disabledStates,
    stepLayoutStates,
    selectedStates,
    severityStates,
    [stepContentStateShort],
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
        html`<${anchorStepTag} hidden
            >Hidden Anchor Button</${anchorStepTag}
        >`
    )
);
