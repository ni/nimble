import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate, when } from '@ni/fast-element';
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
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import { selectedStates, severityStates, stepContentStateDefault, stepContentStates, type SelectedState, type SeverityStates, type StepContentStates } from '../stepper/types';
import { disabledStates, type DisabledState } from '../../utilities/states';

const metadata: Meta = {
    title: 'Tests/Anchor Step',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [disabledName, disabled]: DisabledState,
    [selectedName, selected]: SelectedState,
    [severityName, severity]: SeverityStates,
    [contentName, titleContent, subtitleContent, severityTextContent]: StepContentStates,
): ViewTemplate => html`
    <div>
        <div>${disabledName} ${selectedName} Severity(${severityName}) Content(${contentName})</div>
        <${stepperTag} style="padding-bottom: 16px;">
            <${anchorStepTag}
                href="#"
                target="_self"
                ?disabled=${() => disabled}
                ?selected=${() => selected}
                severity-text="${() => severityTextContent}"
                severity="${() => severity}"
            >
                ${when(() => titleContent !== undefined, html`<span slot="title">${() => titleContent}</span>`)}
                ${when(() => subtitleContent !== undefined, html`<span slot="subtitle">${() => subtitleContent}</span>`)}
                1
            </${anchorStepTag}>
        </${stepperTag}>
    </div>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(html`
    <div style="
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
    ">
    ${createMatrix(component, [
        disabledStates,
        selectedStates,
        severityStates,
        stepContentStates,
    ])}
    </div>
`);

const interactionStatesHover = cartesianProduct([
    disabledStates,
    selectedStates,
    severityStates,
    [stepContentStateDefault],
] as const);

const interactionStates = cartesianProduct([
    disabledStates,
    selectedStates,
    severityStates,
    [stepContentStateDefault],
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
