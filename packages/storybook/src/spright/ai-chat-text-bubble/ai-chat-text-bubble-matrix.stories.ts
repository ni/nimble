import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { aiChatTextBubbleTag } from '../../../../spright-components/src/ai-chat-text-bubble';
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
    title: 'Tests Spright/AI Chat Text Bubble',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = ([
    disabledName,
    disabled
]: DisabledState): ViewTemplate => html`
    <${aiChatTextBubbleTag}
        ?disabled=${() => disabled}
        style="margin-right: 8px;">
            ${() => `${disabledName} AI Chat Text Bubble`}</${aiChatTextBubbleTag}>
`;

export const aiChatTextBubbleThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [disabledStates])
);

const interactionStatesHover = cartesianProduct([disabledStates] as const);

const interactionStates = cartesianProduct([[disabledStateIsEnabled]] as const);

export const aiChatTextBubbleInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactionStatesHover,
        hoverActive: interactionStates,
        active: interactionStates,
        focus: interactionStates
    })
);

export const hiddenAIChatTextBubble: StoryFn = createStory(
    hiddenWrapper(
        html`<${aiChatTextBubbleTag} hidden>Hidden AI Chat Text Bubble</${aiChatTextBubbleTag}>`
    )
);
