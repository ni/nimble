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
import { textCustomizationWrapper } from '../../utilities/text-customization';

const metadata: Meta = {
    title: 'Tests/Anchor Step',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (): ViewTemplate => html`
    <${stepperTag}>
        <${anchorStepTag}
            href="#"
        >
                <div slot="title">Title</div>
                <div slot="subtitle">Subtitle</div>
            😀
        </${anchorStepTag}>
    </${stepperTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
    ])
);

const interactionStatesHover = cartesianProduct([
] as const);

const interactionStates = cartesianProduct([
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

export const textCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${anchorStepTag}>Anchor Button</${anchorStepTag}>`
    )
);
