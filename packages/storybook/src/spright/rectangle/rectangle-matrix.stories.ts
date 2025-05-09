import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@ni/fast-element';
import { rectangleTag } from '../../../../spright-components/src/rectangle';
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
    title: 'Tests Spright/Rectangle',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = ([
    disabledName,
    disabled
]: DisabledState): ViewTemplate => html`
    <${rectangleTag}
        ?disabled=${() => disabled}
        style="margin-right: 8px;">
            ${() => `${disabledName} Rectangle`}</${rectangleTag}>
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
        html`<${rectangleTag} hidden>Hidden Rectangle</${rectangleTag}>`
    )
);
