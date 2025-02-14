import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { buttonTag } from '../../../../../nimble-components/src/button';
import { chatConversationTag } from '../../../../../spright-components/src/chat/conversation';
import { ChatMessageType } from '../../../../../spright-components/src/chat/message/types';
import { chatMessageTag } from '../../../../../spright-components/src/chat/message';
import { richTextViewerTag } from '../../../../../nimble-components/src/rich-text/viewer';
import { spinnerTag } from '../../../../../nimble-components/src/spinner';
import { iconCopyTextTag } from '../../../../../nimble-components/src/icons/copy-text';
import { iconThumbUpTag } from '../../../../../nimble-components/src/icons/thumb-up';
import { iconThumbDownTag } from '../../../../../nimble-components/src/icons/thumb-down';
import { iconArrowRotateRightTag } from '../../../../../nimble-components/src/icons/arrow-rotate-right';
import { iconThreeDotsLineTag } from '../../../../../nimble-components/src/icons/three-dots-line';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';
import { imgBlobUrl, markdownExample } from './story-helpers';
import { ButtonAppearance } from '../../../../../nimble-components/src/menu-button/types';
import { SpinnerAppearance } from '../../../../../nimble-components/src/spinner/types';

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
                <${buttonTag} slot='top-left' appearance='ghost' ContentHidden='true'>
                    <${iconCopyTextTag} slot='start' />
                    Copy
                </${buttonTag}>
                <${buttonTag} slot='bottom-left' appearance='ghost' ContentHidden='true'>
                    <${iconThumbUpTag} slot='start' />
                    Like
                </${buttonTag}>
                <${buttonTag} slot='bottom-left' appearance='ghost'>
                    <${iconThumbDownTag} slot='start' ContentHidden='true'/>
                    Dislike
                </${buttonTag}>
                <${buttonTag} slot='bottom-right' appearance='ghost'>
                    <${iconThreeDotsLineTag} slot='start' ContentHidden='true'/>
                    Refresh
                </${buttonTag}>
                <${buttonTag} slot='top-right' appearance='ghost' ContentHidden='true'>
                    <${iconArrowRotateRightTag} slot='start' ContentHidden='true'/>
                    Refresh
                </${buttonTag}>
                <${richTextViewerTag} :markdown="${() => markdownExample}"></${richTextViewerTag}>
            </${chatMessageTag}>
            <${chatMessageTag} message-type="${() => ChatMessageType.system}">
                <${spinnerTag} appearance="${() => SpinnerAppearance.accent}"></${spinnerTag}>
            </${chatMessageTag}>
            <${chatMessageTag} message-type="${() => ChatMessageType.inbound}">
                <${buttonTag} slot='bottom-left' appearance='ghost' ContentHidden='true'>
                    <${iconCopyTextTag} slot='start' />
                    Copy
                </${buttonTag}>
                <${buttonTag} slot='bottom-left' appearance='ghost' ContentHidden='true'>
                    <${iconThumbUpTag} slot='start' />
                    Like
                </${buttonTag}>
                <${buttonTag} slot='bottom-left' appearance='ghost'>
                    <${iconThumbDownTag} slot='start' ContentHidden='true'/>
                    Dislike
                </${buttonTag}>
                <${buttonTag} slot='bottom-left' appearance='ghost' ContentHidden='true'>
                    <${iconArrowRotateRightTag} slot='start' ContentHidden='true'/>
                    Refresh
                </${buttonTag}>
                <${buttonTag} slot='bottom-left' appearance='ghost'>
                    <${iconThreeDotsLineTag} slot='start' ContentHidden='true'/>
                    Refresh
                </${buttonTag}>
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
