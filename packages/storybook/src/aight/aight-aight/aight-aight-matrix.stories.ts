import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { aightAightTag } from '@ni/aight-components/dist/esm/aight-aight';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import {
    disabledStates,
    type DisabledState,
    disabledStateIsEnabled
} from '../../utilities/states';

const metadata: Meta = {
    title: 'Tests Aight/Aight-Aight',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = ([
    disabledName,
    disabled
]: DisabledState): ViewTemplate => html`
    <${aightAightTag}
        ?disabled=${() => disabled}
        style="margin-right: 8px;">
            ${() => `${disabledName} Aight-Aight`}</${aightAightTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [disabledStates])
);

const interactionStatesHover = cartesianProduct([disabledStates] as const);

const interactionStates = cartesianProduct([[disabledStateIsEnabled]] as const);

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
        html`<${aightAightTag} hidden>Hidden Rectangle</${aightAightTag}>`
    )
);
