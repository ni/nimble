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

const markdownExample = 'I see **Esc**, **Crtl**, and **Pg Up**. There doesn\'t seem to be any **Any** key.';

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
            <${chatMessageTag} message-type='system'>
                <${buttonTag} appearance='block'>Order a tab</${buttonTag}>
                <${buttonTag} appearance='block'>Check core temperature</${buttonTag}>
            </${chatMessageTag}>
        </${chatConversationTag}>

    `)
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
            description: 'The text to display in the chat message.',
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

interface ChatMessagePrompts extends ChatMessageArgs {
    prompt1: string;
    prompt2: string;
}
export const chatMessagePrompts: StoryObj<ChatMessagePrompts> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} message-type=${x => x.messageType}>
            <${buttonTag} appearance='block'>${x => x.prompt1}</${buttonTag}>
            <${buttonTag} appearance='block'>${x => x.prompt2}</${buttonTag}>
        </${chatMessageTag}>
    `),
    argTypes: {
        messageType: {
            options: Object.keys(ChatMessageType),
            control: { type: 'radio' },
            description: 'The status of the chat message.',
            table: { category: apiCategory.attributes }
        },
        prompt1: {
            description: 'The first prompt text',
            table: { category: apiCategory.slots }
        },
        prompt2: {
            description: 'The second prompt text',
            table: { category: apiCategory.slots }
        }
    },
    args: {
        messageType: ChatMessageType.system,
        prompt1: 'Eat my shorts',
        prompt2: 'Do the Bartman'
    }
};
