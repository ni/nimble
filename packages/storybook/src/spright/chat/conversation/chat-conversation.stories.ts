import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@ni/fast-element';
import { buttonTag } from '../../../../../nimble-components/src/button';
import { chatConversationTag } from '../../../../../spright-components/src/chat/conversation';
import { ChatMessageType } from '../../../../../spright-components/src/chat/message/types';
import { chatMessageTag } from '../../../../../spright-components/src/chat/message';
import { richTextViewerTag } from '../../../../../nimble-components/src/rich-text/viewer';
import { spinnerTag } from '../../../../../nimble-components/src/spinner';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';
import { imgBlobUrl, markdownExample } from './story-helpers';
import { ButtonAppearance } from '../../../../../nimble-components/src/menu-button/types';
import { SpinnerAppearance } from '../../../../../nimble-components/src/spinner/types';
import { isChromatic } from '../../../utilities/isChromatic';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ChatConversationArgs {}

const metadata: Meta<ChatConversationArgs> = {
    title: 'Spright/Chat Conversation'
};

export const chatConversation: StoryObj<ChatConversationArgs> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatConversationTag}>
            <${chatMessageTag} message-type="${() => ChatMessageType.inbound}">
                To start, press any key.
            </${chatMessageTag}>
            <${chatMessageTag} message-type="${() => ChatMessageType.outbound}">
                Where is the Any key?
            </${chatMessageTag}>
            <${chatMessageTag} message-type="${() => ChatMessageType.outbound}">
                <${richTextViewerTag} markdown="${() => markdownExample}"></${richTextViewerTag}>
            </${chatMessageTag}>
            <${chatMessageTag} message-type="${() => ChatMessageType.system}">
                <${spinnerTag}
                    style="${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
                    appearance="${() => SpinnerAppearance.accent}"
                ></${spinnerTag}>
            </${chatMessageTag}>
            <${chatMessageTag} message-type="${() => ChatMessageType.inbound}">
                <img width="100" height="100" :src=${() => imgBlobUrl}>
            </${chatMessageTag}>
            <${chatMessageTag} message-type="${() => ChatMessageType.system}">
                <${buttonTag} appearance="${() => ButtonAppearance.block}">
                    Order a tab
                </${buttonTag}>
                <${buttonTag} appearance="${() => ButtonAppearance.block}">
                    Check core temperature
                </${buttonTag}>
            </${chatMessageTag}>
        </${chatConversationTag}>
    `),
    argTypes: {
        content: {
            name: 'default',
            description:
                'The messages to display in the chat conversation. The DOM order of the messages controls their screen order within the conversation (earlier DOM order implies older message)',
            table: { category: apiCategory.slots }
        }
    }
};

export default metadata;
