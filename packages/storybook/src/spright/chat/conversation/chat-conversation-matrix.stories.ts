import type { StoryFn, Meta } from '@storybook/html';
import { html, repeat, ViewTemplate } from '@ni/fast-element';
import { chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import { chatMessageTag } from '@ni/spright-components/dist/esm/chat/message';
import { ChatMessageType } from '@ni/spright-components/dist/esm/chat/message/types';
import { chatConversationTag } from '@ni/spright-components/dist/esm/chat/conversation';
import {
    bodyFont,
    bodyFontColor
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconThumbUpTag } from '@ni/nimble-components/dist/esm/icons/thumb-up';
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
const outboundState = messageTypeStates[0];
const inboundState = messageTypeStates[1];
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
        [inboundState],
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

// prettier-ignore
const slottedButtons = (
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
    ${createMatrix(slottedButtons, [
        messageTypeStates,
        footerActionsStates,
        endButtonStates
    ])}
`);

const heightStates = [
    ['shorter', '100px'],
    ['taller', '300px']
] as const;
type HeightStates = (typeof heightStates)[number];

// prettier-ignore
const conversationWithInput = (
    [heightLabel, height]: HeightStates,
): ViewTemplate => html`
    <div style="width: 300px; padding: 8px;">
        <${chatConversationTag} style="
            width: 100%;
            height: ${height};
        ">
            <${chatMessageTag} message-type="inbound">
                <span>Conversation is ${heightLabel} than the height of the messages.</span>
            </${chatMessageTag}>
            <${chatMessageTag} message-type="outbound">
                <span>Conversation is ${heightLabel} than the height of the messages.</span>
            </${chatMessageTag}>
        </${chatConversationTag}>
        <${chatInputTag}></${chatInputTag}>
    </div>
`;

export const conversationWithInputSizing: StoryFn = createMatrixThemeStory(html`
    ${createMatrix(conversationWithInput, [heightStates])}
`);

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${chatConversationTag} hidden>Hidden Chat Conversation</${chatConversationTag}>`
    )
);
