import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { stepTag } from '@ni/nimble-components/dist/esm/step';
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
import { textCustomizationWrapper } from '../../utilities/text-customization';
import { severityStates, type SeverityStates } from '../stepper/types';

const metadata: Meta = {
    title: 'Tests/Step',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [severityName, severity]: SeverityStates,
): ViewTemplate => html`
    <${stepperTag}>
        <${stepTag}
            style="width: 200px;"
            severity-text="Severity Text"
            severity="${() => severity}"
        >
                <div slot="title">${() => severityName}</div>
                <div slot="subtitle">Subtitle</div>
            😀
        </${stepTag}>
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
        html`<${stepTag} hidden
            >Hidden Anchor Button</${stepTag}
        >`
    )
);

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${stepTag}>Anchor Button</${stepTag}>`
    )
);
