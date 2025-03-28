import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../../utilities/storybook';

import { buttonTag } from '../../../../../nimble-components/src/button';
import { chatMessageTag } from '../../../../../spright-components/src/chat/message';
import { ChatMessageType } from '../../../../../spright-components/src/chat/message/types';
import { richTextViewerTag } from '../../../../../nimble-components/src/rich-text/viewer';
import { spinnerTag } from '../../../../../nimble-components/src/spinner';
import { imgBlobUrl, markdownExample } from '../conversation/story-helpers';
import { SpinnerAppearance } from '../../../../../nimble-components/src/spinner/types';
import { ButtonAppearance } from '../../../../../nimble-components/src/menu-button/types';
import { isChromatic } from '../../../utilities/isChromatic';

interface ChatMessageArgs {
    messageType: keyof typeof ChatMessageType;
}

const metadata: Meta<ChatMessageArgs> = {
    title: 'Internal/Chat Message',
    argTypes: {
        messageType: {
            name: 'message-type',
            options: Object.keys(ChatMessageType),
            control: { type: 'radio' },
            description: 'The type of the chat message.',
            table: { category: apiCategory.attributes }
        }
    },
    parameters: {
        actions: {}
    }
};

export default metadata;

interface ChatMessageTextArgs extends ChatMessageArgs {
    text: string;
}

export const chatMessageText: StoryObj<ChatMessageTextArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            ${x => x.text}
        </${chatMessageTag}>
    `),
    argTypes: {
        text: {
            name: 'default',
            description: 'The content to display in the chat message.',
            table: { category: apiCategory.slots }
        }
    },
    args: {
        text: 'Aurora Borealis? At this time of year? At this time of day? In this part of the country? Localized entirely within your kitchen?',
        messageType: 'outbound'
    }
};

interface ChatMessageRichTextArgs extends ChatMessageArgs {
    markdown: string;
}
export const chatMessageRichText: StoryObj<ChatMessageRichTextArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            <${richTextViewerTag} markdown="${x => x.markdown}"></${richTextViewerTag}>
        </${chatMessageTag}>
    `),
    argTypes: {
        markdown: {
            description: 'Markdown text for the rich text viewer',
            table: { category: apiCategory.slots }
        }
    },
    args: {
        markdown: markdownExample,
        messageType: 'outbound'
    }
};

export const chatMessageSpinner: StoryObj<ChatMessageArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            <${spinnerTag}
                style="${isChromatic() ? '--ni-private-spinner-animation-play-state:paused' : ''}"
                appearance="${() => SpinnerAppearance.accent}"
            ></${spinnerTag}>
        </${chatMessageTag}>
    `),
    args: {
        messageType: 'system'
    }
};

export const chatMessageImage: StoryObj<ChatMessageArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            <img width="100" height="100" :src="${() => imgBlobUrl}">
        </${chatMessageTag}>
    `),
    args: {
        messageType: 'inbound'
    }
};

export const chatMessagePrompts: StoryObj<ChatMessageArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type="${x => ChatMessageType[x.messageType]}">
            <${buttonTag} appearance="${() => ButtonAppearance.block}">Eat my shorts</${buttonTag}>
            <${buttonTag} appearance="${() => ButtonAppearance.block}">Do the Bartman</${buttonTag}>
        </${chatMessageTag}>
    `),
    args: {
        messageType: 'system'
    }
};
