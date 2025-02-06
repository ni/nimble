import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { buttonTag } from '../../../../nimble-components/src/button';
import { chatConversationTag } from '../../../../spright-components/src/chat/conversation';
import { chatMessageTag } from '../../../../spright-components/src/chat/message';
import { ChatMessageType } from '../../../../spright-components/src/chat/types';
import { richTextViewerTag } from '../../../../nimble-components/src/rich-text/viewer';
import { spinnerTag } from '../../../../nimble-components/src/spinner';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../utilities/storybook';

const metadata: Meta<ChatMessageTextArgs> = {
    title: 'Spright/Chat'
};

const markdownExample = "I see **Esc**, **Crtl**, and **Pg Up**. There doesn't seem to be any **Any** key.";

// Vectors and icons by <a href="https://www.svgrepo.com" target="_blank">SVG Repo</a>
const svgImage = `
<svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
width="100px" height="100px" viewBox="0 0 225 256" xml:space="preserve">
<path d="M91.6,18.2c12.5,0,22.6,10.1,22.6,22.6s-10.1,22.6-22.6,22.6S69,53.3,69,40.8S79.1,18.2,91.6,18.2z M211.6,119.2l-25.9-67.9
l-0.1,0L199.1,5l-10.4-3l-26.7,91.5l10.4,3l8.2-28.3l17.1,44.1h-25.3v6.9h-25.9c0-0.1,0-0.2,0-0.3c0-6.7-4.9-12.5-11.6-12.5l-41.6,0
c0,0-11.7-32.4-15.9-39.4c-3.3-5.4-8.4-8.8-15.1-8.8c-10.3,0-18.1,8.5-23.7,20.8c-9.3,20.4-13.3,45.5-11,68.6
c1.1,9.4,3.4,17.3,8.9,21.8H18V96.6H2.3V254H18v-68.9h74.6l-10.4,51.6c-1.6,7.8,3.5,15.4,11.3,17c1,0.2,1.9,0.3,2.9,0.3
c6.7,0,12.7-4.7,14.1-11.6l8.8-43.7l11.2,30.1c2.2,5.8,7.7,9.4,13.5,9.4c1.7,0,3.4-0.3,5-0.9c7.5-2.8,11.2-11.1,8.5-18.5l-24.4-65.5
c-2.1-5.6-7.5-9.4-13.5-9.4H81v-9.1h126V254h15.7V119.2H211.6z"/>
</svg>`;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ChatConversation {}
export const chatConversation: StoryObj<ChatConversation> = {
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
                <${richTextViewerTag} :markdown="${_x => markdownExample}"></${richTextViewerTag}>
            </${chatMessageTag}>
            <${chatMessageTag} message-type='system'>
                <${spinnerTag} appearance='accent'></${spinnerTag}>
            </${chatMessageTag}>
            <${chatMessageTag} message-type='inbound'>
                <img src='data:image/svg+xml;utf8,${encodeURIComponent(svgImage)}'/>
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

interface ChatMessageArgs {
    messageType: ChatMessageType;
}

export default metadata;

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
            <img src='data:image/svg+xml;utf8,${encodeURIComponent(svgImage)}'/>
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
