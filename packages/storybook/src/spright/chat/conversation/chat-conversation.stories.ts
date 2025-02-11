import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { buttonTag } from '../../../../../nimble-components/src/button';
import { chatConversationTag } from '../../../../../spright-components/src/chat/conversation';
import { chatMessageTag } from '../../../../../spright-components/src/chat/message';
import { richTextViewerTag } from '../../../../../nimble-components/src/rich-text/viewer';
import { spinnerTag } from '../../../../../nimble-components/src/spinner';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';
import { imgBlobUrl, markdownExample } from './story-helpers';

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
            <${chatMessageTag} message-type='inbound'>
                To start, press any key.
            </${chatMessageTag}>
            <${chatMessageTag} message-type='outbound'>
                Where is the Any key?
            </${chatMessageTag}>
            <${chatMessageTag} message-type='outbound'>
                <${richTextViewerTag} :markdown="${() => markdownExample}"></${richTextViewerTag}>
            </${chatMessageTag}>
            <${chatMessageTag} message-type='system'>
                <${spinnerTag} appearance='accent'></${spinnerTag}>
            </${chatMessageTag}>
            <${chatMessageTag} message-type='inbound'>
                <img width="100" height="100" :src=${() => imgBlobUrl}>
            </${chatMessageTag}>
            <${chatMessageTag} message-type='system'>
                <${buttonTag} appearance='block'>Order a tab</${buttonTag}>
                <${buttonTag} appearance='block'>Check core temperature</${buttonTag}>
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
