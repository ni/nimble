import type { StoryFn, Meta } from '@storybook/html';
import { html, ViewTemplate } from '@ni/fast-element';
import { chatMessageTag } from '../../../../../spright-components/src/chat/message';
import { ChatMessageType } from '../../../../../spright-components/src/chat/message/types';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory,
    cartesianProduct,
    createMatrixInteractionsFromStates
} from '../../../utilities/matrix';
import { createStory } from '../../../utilities/storybook';
import { hiddenWrapper } from '../../../utilities/hidden';
import { chatConversationTag } from '../../../../../spright-components/src/chat/conversation';
import { textCustomizationWrapper } from '../../../utilities/text-customization';
import {
    bodyFont,
    bodyFontColor
} from '../../../../../nimble-components/src/theme-provider/design-tokens';
import { buttonTag } from '../../../../../nimble-components/src/button';
import { iconCopyTextTag } from '../../../../../nimble-components/src/icons/copy-text';

const messageTypeStates = [
    ['outbound', ChatMessageType.outbound],
    ['inbound', ChatMessageType.inbound],
    ['system', ChatMessageType.system]
] as const;
type MessageTypeStates = (typeof messageTypeStates)[number];
const outboundState = messageTypeStates[0];
const inboudState = messageTypeStates[1];
const systemState = messageTypeStates[2];

const metadata: Meta = {
    title: 'Tests Spright/Chat Conversation',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const viewportStates = [
    ['chat popup', '300px', '300px'],
    ['mobile vertical', '300px', '600px'],
    ['mobile horizontal', '600px', '300px'],
    ['desktop', '600px', '600px']
] as const;
type ViewportStates = (typeof viewportStates)[number];

const contentWidthStates = [
    ['thin', '100px'],
    ['wide', '600px']
] as const;
type ContentWidthStates = (typeof contentWidthStates)[number];

const contentHeightStates = [
    ['short', '100px'],
    ['tall', '600px']
] as const;
type ContentHeightStates = (typeof contentHeightStates)[number];

const component = ([
    _messageTypeLabel,
    messageType
]: MessageTypeStates): ViewTemplate => html`
    <span>${() => `Message Type: ${_messageTypeLabel}`} </span>
    <${chatConversationTag}>
        <${chatMessageTag} message-type="${() => messageType}">
            <${buttonTag} slot='footer-actions' appearance='ghost' ContentHidden='true'>
                <${iconCopyTextTag} slot='start' />
                Copy
            </${buttonTag}>
            <${buttonTag} slot='end'>
                Follow-up Prompt
            </${buttonTag}>
            This is the message content.
        </${chatMessageTag}>
    </${chatConversationTag}>
`;

const componentSizing = (
    [_messageTypeLabel, messageType]: MessageTypeStates,
    [viewportLabel, viewportWidth, viewportHeight]: ViewportStates,
    [contentWidthLabel, contentWidth]: ContentWidthStates,
    [contentHeightLabel, contentHeight]: ContentHeightStates
): ViewTemplate => html`
    <p 
        style="
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        margin-bottom: 0px;
        "
    >
        viewport:${() => viewportLabel}, content:${() => contentWidthLabel},${() => contentHeightLabel} 
    </p>
    <div style="
        width: ${viewportWidth};
        height: ${viewportHeight};
        border: 1px dashed red;
    ">
        <${chatConversationTag} style="
            width: 100%;
            height: 100%;
        ">
            <${chatMessageTag} message-type="${() => messageType}">
            <div style="
                width: ${contentWidth};
                height: ${contentHeight};
                background: blue;
                display: inline-block;
            "
            ></div>
            </${chatMessageTag}>
        </${chatConversationTag}>
    </div>
`;

const interactiveMessageTypes = cartesianProduct([messageTypeStates] as const);

export const outboundSizing: StoryFn = createStory(html`
    ${createMatrix(componentSizing, [
        [outboundState],
        viewportStates,
        contentWidthStates,
        contentHeightStates
    ])}
`);

export const inboundSizing: StoryFn = createStory(html`
    ${createMatrix(componentSizing, [
        [inboudState],
        viewportStates,
        contentWidthStates,
        contentHeightStates
    ])}
`);

export const systemSizing: StoryFn = createStory(html`
    ${createMatrix(componentSizing, [
        [systemState],
        viewportStates,
        contentWidthStates,
        contentHeightStates
    ])}
`);

export const messageInteractionsThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrixInteractionsFromStates(component, {
        hover: interactiveMessageTypes,
        hoverActive: [],
        active: interactiveMessageTypes,
        focus: []
    })
);

export const conversationHidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatConversationTag} hidden>Hidden Chat Conversation</${chatConversationTag}>`
    )
);

export const messageHidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatMessageTag} hidden>Hidden Chat Message</${chatMessageTag}>`
    )
);

export const messageTextCustomized: StoryFn = createMatrixThemeStory(
    textCustomizationWrapper(
        html`<${chatMessageTag}>Message</${chatMessageTag}>`
    )
);
