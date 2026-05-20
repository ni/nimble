import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import { exButtonTag } from '@ni/ok-components/dist/esm/ex/button';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../../utilities/matrix';
import { createStory } from '../../../utilities/storybook';
import { hiddenWrapper } from '../../../utilities/hidden';
import {
    disabledStates,
    type DisabledState,
    disabledStateIsEnabled
} from '../../../utilities/states';

const metadata: Meta = {
    title: 'Tests Ok/Ex Button',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = ([
    disabledName,
    disabled
]: DisabledState): ViewTemplate => html`
    <${exButtonTag}
        ?disabled=${() => disabled}
        style="margin-right: 8px;">
            ${() => `${disabledName} Button`}</${exButtonTag}>
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
    hiddenWrapper(html`<${exButtonTag} hidden>Hidden Rectangle</${exButtonTag}>`)
);
