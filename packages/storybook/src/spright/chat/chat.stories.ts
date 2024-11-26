import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { chatMessageTag } from '../../../../spright-components/src/chat/message';
import { ChatMessageStatus } from '../../../../spright-components/src/chat/types';
import { richTextViewerTag } from '../../../../nimble-components/src/rich-text/viewer';
import {
    apiCategory,
    createUserSelectedThemeStory,
} from '../../utilities/storybook';

const metadata: Meta<ChatMessageTextArgs> = {
    title: 'Spright/Chat'
};

interface ChatMessageArgs {
    status: ChatMessageStatus;
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
        <${chatMessageTag} status=${x => x.status}>
            ${x => x.text}
        </${chatMessageTag}>
    `),
    argTypes: {
        text: {
            description: 'The text to display in the chat message.',
            table: { category: apiCategory.slots }
        },
        status: {
            options: Object.keys(ChatMessageStatus),
            control: { type: 'radio' },
            description: 'The status of the chat message.',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        text: 'How do I choose which version of Python to execute my script?',
        status: ChatMessageStatus.incoming
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
        <${chatMessageTag} status=${x => x.status}>
            <${richTextViewerTag} :markdown="${x => x.markdown}"></${richTextViewerTag}>
        </${chatMessageTag}>
    `),
    argTypes: {
        markdown: {
            description: 'Markdown text for the rich text viewer',
            table: { category: apiCategory.slots }
        },
        status: {
            options: Object.keys(ChatMessageStatus),
            control: { type: 'radio' },
            description: 'The status of the chat message.',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        markdown:
    `To configure your Python version:

    1. Select **Adapters...** from the **Configure** menu.
    
    2. Configure the Python adapter.
    
    3. Choose the desired version from the **Version** dropdown.
    
    You can also specify a Python version for a specific module call in the **Advanced Settings** of the Python adapter.`,
        status: ChatMessageStatus.incoming
    }
};
