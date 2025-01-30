import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { chatMessageTag } from '../../../../spright-components/src/chat/message';
import { ChatMessageType } from '../../../../spright-components/src/chat/types';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';

const chatMessageTypes = [
    ['outbound', ChatMessageType.outbound],
    ['inbound', ChatMessageType.inbound],
    ['system', ChatMessageType.system]
] as const;
type ChatMessageTypeState = (typeof chatMessageTypes)[number];

const metadata: Meta = {
    title: 'Tests Spright/Chat Message',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (
    [chatMessageTypeName, messageType]: ChatMessageTypeState,
): ViewTemplate => html`
    <${chatMessageTag}
        message-type=${() => messageType}
        style="margin-right: 8px;">
            ${() => `${chatMessageTypeName} Chat Message`}</${chatMessageTag}>
`;

export const chatMessageThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [chatMessageTypes])
);

export const hiddenChatMessage: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatMessageTag} hidden>Hidden Chat Message</${chatMessageTag}>`
    )
);
