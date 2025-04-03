import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@ni/fast-element';
import { buttonTag } from '../../../../../nimble-components/src/button';
import { menuButtonTag } from '../../../../../nimble-components/src/menu-button';
import { menuTag } from '../../../../../nimble-components/src/menu';
import { menuItemTag } from '../../../../../nimble-components/src/menu-item';
import { toggleButtonTag } from '../../../../../nimble-components/src/toggle-button';
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
import { SpinnerAppearance } from '../../../../../nimble-components/src/spinner/types';
import { loremIpsum } from '../../../utilities/lorem-ipsum';
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
            <${chatMessageTag} message-type="${() => ChatMessageType.system}">
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
