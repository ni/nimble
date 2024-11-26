import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { chatMessageTag } from '../../../../spright-components/src/chat-message';
import { richTextViewerTag } from '../../../../nimble-components/src/rich-text/viewer';
import {
    apiCategory,
    createUserSelectedThemeStory,
} from '../../utilities/storybook';

const metadata: Meta<ChatMessageTextArgs> = {
    title: 'Spright/Chat'
};

export default metadata;

interface ChatMessageTextArgs {
    text: string;
}

export const chatMessageText: StoryObj<ChatMessageTextArgs> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag}>
            ${x => x.text}
        </${chatMessageTag}>
    `),
    argTypes: {
        text: {
            description: 'The text to display in the chat message.',
            table: { category: apiCategory.slots }
        },
    },
    args: {
        text: 'How do I choose which version of Python to execute my script?',
    }
};

interface ChatMessageRichTextArgs {
    markdown: string;
}
export const chatMessageRichText: StoryObj<ChatMessageRichTextArgs> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag}>
            <${richTextViewerTag} :markdown="${x => x.markdown}"></${richTextViewerTag}>
        </${chatMessageTag}>
    `),
    argTypes: {
        markdown: {
            description: 'Markdown text for the rich text viewer',
            table: { category: apiCategory.slots }
        },
    },
    args: {
        markdown:
    `To configure your Python version:

    1. Select **Adapters...** from the **Configure** menu.
    
    2. Configure the Python adapter.
    
    3. Choose the desired version from the **Version** dropdown.
    
    You can also specify a Python version for a specific module call in the **Advanced Settings** of the Python adapter.`,
    }
};
