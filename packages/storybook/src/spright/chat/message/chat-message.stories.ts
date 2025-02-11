import { html } from '@microsoft/fast-element';
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

const metadata: Meta = {
    title: 'Internal/Chat Message'
};

export default metadata;

interface ChatMessageArgs {
    messageType: ChatMessageType;
}

interface ChatMessageTextArgs extends ChatMessageArgs {
    text: string;
}

export const chatMessageText: StoryObj<ChatMessageTextArgs> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type=${x => x.messageType}>
            ${x => x.text}
        </${chatMessageTag}>
    `),
    argTypes: {
        text: {
            name: 'default',
            description: 'The content to display in the chat message.',
            table: { category: apiCategory.slots }
        },
        messageType: {
            name: 'message-type',
            options: Object.keys(ChatMessageType),
            control: { type: 'radio' },
            description: 'The type of the chat message.',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        text: 'Aurora Borealis? At this time of year? At this time of day? In this part of the country? Localized entirely within your kitchen?',
        messageType: ChatMessageType.outbound
    }
};

interface ChatMessageRichTextArgs extends ChatMessageArgs {
    markdown: string;
}
export const chatMessageRichText: StoryObj<ChatMessageRichTextArgs> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type=${x => x.messageType}>
            <${richTextViewerTag} :markdown="${x => x.markdown}"></${richTextViewerTag}>
        </${chatMessageTag}>
    `),
    argTypes: {
        markdown: {
            description: 'Markdown text for the rich text viewer',
            table: { category: apiCategory.slots }
        },
        messageType: {
            options: Object.keys(ChatMessageType),
            control: { type: 'radio' },
            description: 'The status of the chat message.',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        markdown: markdownExample,
        messageType: ChatMessageType.outbound
    }
};

export const chatMessageSpinner: StoryObj<ChatMessageArgs> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type=${x => x.messageType}>
            <${spinnerTag} appearance='accent'></${spinnerTag}>
        </${chatMessageTag}>
    `),
    argTypes: {
        messageType: {
            options: Object.keys(ChatMessageType),
            control: { type: 'radio' },
            description: 'The status of the chat message.',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        messageType: ChatMessageType.system
    }
};

export const chatMessageImage: StoryObj<ChatMessageArgs> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type=${x => x.messageType}>
            <img width="100" height="100" :src=${() => imgBlobUrl}>
        </${chatMessageTag}>
    `),
    argTypes: {
        messageType: {
            options: Object.keys(ChatMessageType),
            control: { type: 'radio' },
            description: 'The status of the chat message.',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        messageType: ChatMessageType.inbound
    }
};

export const chatMessagePrompts: StoryObj<ChatMessageArgs> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type=${x => x.messageType}>
            <${buttonTag} appearance='block'>Eat my shorts</${buttonTag}>
            <${buttonTag} appearance='block'>Do the Bartman</${buttonTag}>
        </${chatMessageTag}>
    `),
    argTypes: {
        messageType: {
            options: Object.keys(ChatMessageType),
            control: { type: 'radio' },
            description: 'The status of the chat message.',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        messageType: ChatMessageType.system
    }
};
