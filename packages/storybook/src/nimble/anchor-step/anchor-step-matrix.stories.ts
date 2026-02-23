import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { anchorStepTag } from '@ni/nimble-components/dist/esm/anchor-step';
import { stepperTag } from '@ni/nimble-components/dist/esm/stepper';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import { severityStates, type SeverityStates } from '../stepper/types';

const metadata: Meta = {
    title: 'Tests/Anchor Step',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [severityName, severity]: SeverityStates,
): ViewTemplate => html`
    <${stepperTag}>
        <${anchorStepTag}
            href="#"
            style="width: 200px;"
            severity-text="Severity Text"
            severity="${() => severity}"
        >
                <div slot="title">${() => severityName}</div>
                <div slot="subtitle">Subtitle</div>
            1
        </${anchorStepTag}>
    </${stepperTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        severityStates
    ])
);

const interactionStatesHover = cartesianProduct([
    severityStates
] as const);

const interactionStates = cartesianProduct([
    severityStates
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
