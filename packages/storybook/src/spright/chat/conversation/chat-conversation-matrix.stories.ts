import type { StoryFn, Meta } from '@storybook/html-vite';
import { html, repeat, ViewTemplate } from '@ni/fast-element';
import { chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import { chatMessageTag } from '@ni/spright-components/dist/esm/chat/message';
import { chatMessageInboundTag } from '@ni/spright-components/dist/esm/chat/message/inbound';
import { chatMessageOutboundTag } from '@ni/spright-components/dist/esm/chat/message/outbound';
import { chatMessageSystemTag } from '@ni/spright-components/dist/esm/chat/message/system';
import { ChatMessageType } from '@ni/spright-components/dist/esm/chat/message/types';
import { chatConversationTag } from '@ni/spright-components/dist/esm/chat/conversation';
import {
    bodyFont,
    bodyFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconThumbUpTag } from '@ni/nimble-components/dist/esm/icons/thumb-up';
import { ChatConversationAppearance } from '@ni/spright-components/dist/esm/chat/conversation/types';
import { toolbarTag } from '@ni/nimble-components/dist/esm/toolbar';
import { iconPencilToRectangleTag } from '@ni/nimble-components/dist/esm/icons/pencil-to-rectangle';
import { iconMessagesSparkleTag } from '@ni/nimble-components/dist/esm/icons/messages-sparkle';
import { hiddenWrapper } from '../../../utilities/hidden';
import { createStory } from '../../../utilities/storybook';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../../utilities/matrix';

const messageTypeStates = [
    ['outbound', ChatMessageType.outbound],
    ['inbound', ChatMessageType.inbound],
    ['system', ChatMessageType.system]
] as const;
type MessageTypeStates = (typeof messageTypeStates)[number];
const outboundTypeState = messageTypeStates[0];
const inboundTypeState = messageTypeStates[1];
const systemTypeState = messageTypeStates[2];

const messageComponentStates = [
    ['outbound', chatMessageOutboundTag],
    ['inbound', chatMessageInboundTag],
    ['system', chatMessageSystemTag]
] as const;
type MessageComponentStates = (typeof messageComponentStates)[number];
const outboundComponentState = messageComponentStates[0];
const inboundComponentState = messageComponentStates[1];
const systemComponentState = messageComponentStates[2];

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

const appearanceStates = [
    ['default', ChatConversationAppearance.default],
    ['overlay', ChatConversationAppearance.overlay]
] as const;
type AppearanceStates = (typeof appearanceStates)[number];

const messageTypeSizing = (
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

export const outboundSizing: StoryFn = createStory(html`
    ${createMatrix(messageTypeSizing, [
        [outboundTypeState],
        viewportStates,
        contentWidthStates,
        contentHeightStates
    ])}
`);

export const inboundSizing: StoryFn = createStory(html`
    ${createMatrix(messageTypeSizing, [
        [inboundTypeState],
        viewportStates,
        contentWidthStates,
        contentHeightStates
    ])}
`);

export const systemSizing: StoryFn = createStory(html`
    ${createMatrix(messageTypeSizing, [
        [systemTypeState],
        viewportStates,
        contentWidthStates,
        contentHeightStates
    ])}
`);

const messageComponentSizing = (
    [_messageTypeLabel, messageComponentType]: MessageComponentStates,
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
            <${messageComponentType}>
                <div style="
                    width: ${contentWidth};
                    height: ${contentHeight};
                    background: blue;
                    display: inline-block;
                "
                ></div>
            </${messageComponentType}>
        </${chatConversationTag}>
    </div>
`;

export const outboundMessageSizing: StoryFn = createStory(html`
    ${createMatrix(messageComponentSizing, [
        [outboundComponentState],
        viewportStates,
        contentWidthStates,
        contentHeightStates
    ])}
`);

export const inboundMessageSizing: StoryFn = createStory(html`
    ${createMatrix(messageComponentSizing, [
        [inboundComponentState],
        viewportStates,
        contentWidthStates,
        contentHeightStates
    ])}
`);

export const systemMessageSizing: StoryFn = createStory(html`
    ${createMatrix(messageComponentSizing, [
        [systemComponentState],
        viewportStates,
        contentWidthStates,
        contentHeightStates
    ])}
`);

const buttons = (count: number): string[] => [...Array(count).keys()].map(x => `Button ${x}`);

const footerActionsStates = [
    ['none', []],
    ['wider than message', buttons(4)],
    ['wider than conversation', buttons(20)]
] as const;
type FooterActionsStates = (typeof footerActionsStates)[number];

const endButtonStates = [
    ['none', []],
    ['wider than message', buttons(2)],
    ['wider than conversation', buttons(10)]
] as const;
type EndButtonStates = (typeof endButtonStates)[number];

const slottedButtonsMessageTypes = (
    [_messageTypeLabel, messageType]: MessageTypeStates,
    [footerActionsLabel, footerActions]: FooterActionsStates,
    [endButtonsLabel, endButtons]: EndButtonStates
): ViewTemplate => html`
    <p 
        style="
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        margin-bottom: 0px;
        "
    >
        message-type:${() => messageType}, footer-actions:${() => footerActionsLabel}, end:${() => endButtonsLabel}
    </p>
    <div style="width: 600px;">
        <${chatConversationTag} style="
            width: 100%;
            height: 100%;
        ">
            <${chatMessageTag} message-type="${() => messageType}">
                <div style="
                    width: 100px;
                    border: 1px blue solid;
                    display: inline-block;
                "
                >Placeholder text</div>
                ${repeat(() => footerActions, html<string>`
                    <${buttonTag} content-hidden slot="footer-actions" appearance="ghost">
                        <${iconThumbUpTag} slot="start"></${iconThumbUpTag}>
                        ${x => x}
                    </${buttonTag}>
                `)}
                ${repeat(() => endButtons, html<string>`
                    <${buttonTag} slot="end" appearance="block">
                        ${x => x}
                    </${buttonTag}>
                `)}
            </${chatMessageTag}>
        </${chatConversationTag}>
    </div>
`;

export const slottedButtonsSizing: StoryFn = createMatrixThemeStory(html`
    ${createMatrix(slottedButtonsMessageTypes, [
        messageTypeStates,
        footerActionsStates,
        endButtonStates
    ])}
`);

const slottedButtonsInboundMessageComponent = (
    [footerActionsLabel, footerActions]: FooterActionsStates,
    [endButtonsLabel, endButtons]: EndButtonStates
): ViewTemplate => html`
    <p 
        style="
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        margin-bottom: 0px;
        "
    >
        footer-actions:${() => footerActionsLabel}, end:${() => endButtonsLabel}
    </p>
    <div style="width: 600px;">
        <${chatConversationTag} style="
            width: 100%;
            height: 100%;
        ">
            <${chatMessageInboundTag}>
                <div style="
                    width: 100px;
                    border: 1px blue solid;
                    display: inline-block;
                "
                >Placeholder text</div>
                ${repeat(() => footerActions, html<string>`
                    <${buttonTag} content-hidden slot="footer-actions" appearance="ghost">
                        <${iconThumbUpTag} slot="start"></${iconThumbUpTag}>
                        ${x => x}
                    </${buttonTag}>
                `)}
                ${repeat(() => endButtons, html<string>`
                    <${buttonTag} slot="end" appearance="block">
                        ${x => x}
                    </${buttonTag}>
                `)}
            </${chatMessageInboundTag}>
        </${chatConversationTag}>
    </div>
`;

export const slottedButtonsInboundMessageSizing: StoryFn = createMatrixThemeStory(html`
    ${createMatrix(slottedButtonsInboundMessageComponent, [
        footerActionsStates,
        endButtonStates
    ])}
`);

const heightStates = [
    ['shorter', '200px'],
    ['taller', '300px']
] as const;
type HeightStates = (typeof heightStates)[number];

const conversationWithInput = (
    [heightLabel, height]: HeightStates,
): ViewTemplate => html`
    <div style="width: 300px; padding: 8px;">
        <${chatConversationTag} style="
            width: 100%;
            height: ${height};
        ">
            <${chatMessageInboundTag}>
                <span>Conversation is ${heightLabel} than the height of the messages.</span>
            </${chatMessageInboundTag}>
            <${chatMessageOutboundTag} message-type="outbound">
                <span>Conversation is ${heightLabel} than the height of the messages.</span>
            </${chatMessageOutboundTag}>
            <${chatInputTag} slot='input'></${chatInputTag}>
        </${chatConversationTag}>
    </div>
`;

export const conversationWithInputSizing: StoryFn = createMatrixThemeStory(html`
    ${createMatrix(conversationWithInput, [heightStates])}
`);

const conversationWithToolbar = (
    [heightLabel, height]: HeightStates,
): ViewTemplate => html`
    <div style="width: 300px; padding: 8px;">
        <${chatConversationTag} style="
            width: 100%;
            height: ${height};
        ">
            <${toolbarTag} slot='toolbar' class='toolbar'>
                <${iconMessagesSparkleTag} slot="start"></${iconMessagesSparkleTag}>
                <${buttonTag} appearance="ghost" slot="end" title="Create new chat" content-hidden>
                    Create new chat
                    <${iconPencilToRectangleTag} slot="start"></${iconPencilToRectangleTag}>
                </${buttonTag}>
            </${toolbarTag}>
            <${chatMessageInboundTag}>
                <span>Conversation is ${heightLabel} than the height of the messages.</span>
            </${chatMessageInboundTag}>
            <${chatMessageOutboundTag} message-type="outbound">
                <span>Conversation is ${heightLabel} than the height of the messages.</span>
            </${chatMessageOutboundTag}>
        </${chatConversationTag}>
    </div>
`;

export const conversationWithToolbarSizing: StoryFn = createMatrixThemeStory(html`
    ${createMatrix(conversationWithToolbar, [heightStates])}
`);

const conversationWithAppearance = ([
    appearanceLabel,
    appearance
]: AppearanceStates): ViewTemplate => html`
    <p         
        style="
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        margin-bottom: 0px;
        "
    >
        appearance: ${() => appearanceLabel}
    </p>
    <${chatConversationTag} appearance="${() => appearance}">
        <${chatMessageInboundTag}>
            <span>Hello.</span>
        </${chatMessageInboundTag}>
        <${chatMessageOutboundTag}>
            <span>Greetings!</span>
        </${chatMessageOutboundTag}>
        <${chatInputTag} slot='input'></${chatInputTag}>
    </${chatConversationTag}>
`;

export const conversationAppearance: StoryFn = createMatrixThemeStory(html`
    ${createMatrix(conversationWithAppearance, [appearanceStates])}
`);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatConversationTag} hidden>Hidden Chat Conversation</${chatConversationTag}>`
    )
);
