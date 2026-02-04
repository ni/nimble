import type { Meta, StoryObj } from '@storybook/html-vite';
import { html, ref, when } from '@ni/fast-element';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { menuButtonTag } from '@ni/nimble-components/dist/esm/menu-button';
import { menuTag } from '@ni/nimble-components/dist/esm/menu';
import { menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import { toggleButtonTag } from '@ni/nimble-components/dist/esm/toggle-button';
import {
    ChatConversation,
    chatConversationTag
} from '@ni/spright-components/dist/esm/chat/conversation';
import {
    ChatInput,
    chatInputTag
} from '@ni/spright-components/dist/esm/chat/input';
import type { ChatInputSendEventDetail } from '@ni/spright-components/dist/esm/chat/input/types';
import { chatMessageInboundTag } from '@ni/spright-components/dist/esm/chat/message/inbound';
import { chatMessageOutboundTag } from '@ni/spright-components/dist/esm/chat/message/outbound';
import { chatMessageSystemTag } from '@ni/spright-components/dist/esm/chat/message/system';
import { richTextViewerTag } from '@ni/nimble-components/dist/esm/rich-text/viewer';
import { spinnerTag } from '@ni/nimble-components/dist/esm/spinner';
import { iconCopyTextTag } from '@ni/nimble-components/dist/esm/icons/copy-text';
import { iconThumbUpTag } from '@ni/nimble-components/dist/esm/icons/thumb-up';
import { iconThumbDownTag } from '@ni/nimble-components/dist/esm/icons/thumb-down';
import { iconArrowRotateRightTag } from '@ni/nimble-components/dist/esm/icons/arrow-rotate-right';
import { iconThreeDotsLineTag } from '@ni/nimble-components/dist/esm/icons/three-dots-line';
import { SpinnerAppearance } from '@ni/nimble-components/dist/esm/spinner/types';
import { ChatConversationAppearance } from '@ni/spright-components/dist/esm/chat/conversation/types';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';
import { imgBlobUrl, markdownExample } from './story-helpers';
import { loremIpsum } from '../../../utilities/lorem-ipsum';
import { isChromatic } from '../../../utilities/isChromatic';

interface ChatConversationArgs {
    appearance: keyof typeof ChatConversationAppearance;
    content: string;
    input: boolean;
    conversationRef: ChatConversation;
    sendMessage: (
        event: CustomEvent<ChatInputSendEventDetail>,
        conversationRef: ChatConversation
    ) => void;
}

const metadata: Meta<ChatConversationArgs> = {
    title: 'Spright/Chat Conversation'
};

export const chatConversation: StoryObj<ChatConversationArgs> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <style class='code-hide'>
            ${chatConversationTag} {
                max-height: 600px;
            }
        </style>
        <${chatConversationTag} ${ref('conversationRef')} appearance="${x => x.appearance}">
            <${chatMessageSystemTag}>
                To start, press any key.
            </${chatMessageSystemTag}>
            <${chatMessageOutboundTag}>
                Where is the Any key?
            </${chatMessageOutboundTag}>
            <${chatMessageOutboundTag}>
                <${richTextViewerTag} markdown="${() => markdownExample}"></${richTextViewerTag}>
            </${chatMessageOutboundTag}>
            <${chatMessageSystemTag}>
                <${spinnerTag}
                    style="${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
                    appearance="${() => SpinnerAppearance.accent}"
                ></${spinnerTag}>
            </${chatMessageSystemTag}>
            <${chatMessageInboundTag}>
                <${buttonTag} slot='footer-actions' appearance='ghost' title='Copy' content-hidden>
                    <${iconCopyTextTag} slot='start'></${iconCopyTextTag}>
                    Copy
                </${buttonTag}>
                <${toggleButtonTag} slot='footer-actions' appearance='ghost' title='Like' content-hidden>
                    <${iconThumbUpTag} slot='start'></${iconThumbUpTag}>
                    Like
                </${toggleButtonTag}>
                <${toggleButtonTag} slot='footer-actions' appearance='ghost' title='Dislike' content-hidden>
                    <${iconThumbDownTag} slot='start'></${iconThumbDownTag}>
                    Dislike
                </${toggleButtonTag}>
                <${buttonTag} slot='footer-actions' appearance='ghost' title='Regenerate' content-hidden>
                    <${iconArrowRotateRightTag} slot='start'></${iconArrowRotateRightTag}>
                    Regenerate
                </${buttonTag}>
                <${menuButtonTag} slot='footer-actions' appearance='ghost' title='More Options' content-hidden>
                    <${iconThreeDotsLineTag} slot='start'></${iconThreeDotsLineTag}>
                    More Options
                    <${menuTag} slot="menu">
                        <${menuItemTag}>Embiggen</${menuItemTag}>
                        <${menuItemTag}>Cromulent</${menuItemTag}>
                    </${menuTag}>
                </${menuButtonTag}>
                <img width="100" height="100" :src=${() => imgBlobUrl}>
                <div>${loremIpsum}</div>
                <${buttonTag} slot='end' appearance='block'>
                    Order a tab
                </${buttonTag}>
                <${buttonTag} slot='end' appearance='block'>
                    Check core temperature
                </${buttonTag}>
            </${chatMessageInboundTag}>
            ${when(x => x.input, html<ChatConversationArgs, ChatInput>`
                <${chatInputTag} slot='input' placeholder='Type a message' send-button-label='Send'
                    @send="${(x2, c2) => x2.sendMessage(c2.event as CustomEvent<ChatInputSendEventDetail>, x2.conversationRef)}"
                ></${chatInputTag}>
            `)}
        </${chatConversationTag}>
    `),
    argTypes: {
        appearance: {
            options: Object.keys(ChatConversationAppearance),
            control: { type: 'radio' },
            description: 'The appearance of the chat conversation.',
            table: { category: apiCategory.attributes }
        },
        content: {
            name: 'default',
            description:
                'The messages to display in the chat conversation. The DOM order of the messages controls their screen order within the conversation (earlier DOM order implies older message).',
            table: { category: apiCategory.slots }
        },
        input: {
            description: `A slot to optionally include a \`${chatInputTag}\` which will be displayed below the messages.`,
            table: { category: apiCategory.slots }
        },
        sendMessage: {
            table: { disable: true }
        }
    },
    args: {
        appearance: 'default',
        input: true,
        sendMessage: (event, conversationRef) => {
            const message = document.createElement(chatMessageOutboundTag);
            const span = document.createElement('span');
            span.textContent = event.detail.text;
            // Preserves new lines and trailing spaces that the user entered
            span.style.whiteSpace = 'pre-wrap';
            message.appendChild(span);
            conversationRef.appendChild(message);
            message.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'start'
            });
        }
    }
};

export default metadata;
