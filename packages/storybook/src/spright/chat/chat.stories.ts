import type { Meta, StoryObj } from '@storybook/html';
import { html } from '@microsoft/fast-element';
import { buttonTag } from '../../../../nimble-components/src/button';
import { ButtonAppearance } from '../../../../nimble-components/src/button/types';
import { textFieldTag } from '../../../../nimble-components/src/text-field';
import { TextFieldAppearance } from '../../../../nimble-components/src/text-field/types';
import { themeProviderTag } from '../../../../nimble-components/src/theme-provider';
import { Theme } from '../../../../nimble-components/src/theme-provider/types';
import { toolbarTag } from '../../../../nimble-components/src/toolbar';
import { iconLightbulbTag } from '../../../../nimble-components/src/icons/lightbulb';
import { iconPaperPlaneTag } from '../../../../nimble-components/src/icons/paper-plane';
import { chatConversationTag } from '../../../../spright-components/src/chat/conversation';
import { chatMessageTag } from '../../../../spright-components/src/chat/message';
import { ChatMessageStatus } from '../../../../spright-components/src/chat/types';
import { richTextViewerTag } from '../../../../nimble-components/src/rich-text/viewer';
import { spinnerTag } from '../../../../nimble-components/src/spinner';
import {
    apiCategory,
    createUserSelectedThemeStory,
} from '../../utilities/storybook';

const metadata: Meta<ChatMessageTextArgs> = {
    title: 'Spright/Chat'
};

interface ChatWindow {
}

const markdownExample = `To configure your Python version:

1. Select **Adapters...** from the **Configure** menu.

2. Configure the Python adapter.

3. Choose the desired version from the **Version** dropdown.

You can also specify a Python version for a specific module call in the **Advanced Settings** of the Python adapter.`;

export const chatWindow: StoryObj<ChatWindow> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatConversationTag}>
            <${chatMessageTag} status='outgoing'>
                Hi, can you please help me?
            </${chatMessageTag}>
            <${chatMessageTag} status='incoming'>
                Yeah sure, what do you need help with?
            </${chatMessageTag}>
            <${chatMessageTag} status='outgoing'>
                Can you show me an example of some rendered markdown content? It should include a list and some bold text. Maybe some italics too.
            </${chatMessageTag}>
            <${chatMessageTag} status='incoming'>
                <${richTextViewerTag} :markdown="${_x => markdownExample}"></${richTextViewerTag}>
            </${chatMessageTag}>
            <${chatMessageTag} status='system'>
                <${spinnerTag} appearance='accent'></${spinnerTag}>
            </${chatMessageTag}>
            <${chatMessageTag} status='system'>
                <${buttonTag} appearance='block'>Help with my taxes</${buttonTag}>
                <${buttonTag} appearance='block'>Provide me some life advice</${buttonTag}>
            </${chatMessageTag}>
        </${chatConversationTag}>
            <${themeProviderTag} theme='${Theme.color}'>
                <${toolbarTag} style="width: 100%;">
                    <slot name="start"></slot>
                    <${textFieldTag}
                        placeholder='How can I assist you today?'
                        appearance=${TextFieldAppearance.block}
                        style="width: 100%;"
                    >
                        <${buttonTag}
                            appearance='${ButtonAppearance.ghost}'
                            content-hidden
                            slot='start'
                        >
                            Prompt
                            <${iconLightbulbTag} slot='start'></${iconLightbulbTag}>
                        </${buttonTag}>
                        <${buttonTag}
                            appearance='${ButtonAppearance.ghost}'
                            content-hidden
                            slot='actions'
                        >
                            Submit
                            <${iconPaperPlaneTag} slot='start'></${iconPaperPlaneTag}>
                        </${buttonTag}>
                    </${textFieldTag}>
                    <slot name="end"></slot>
                </${toolbarTag}>
            </${themeProviderTag}>`),
    argTypes: {
        submitChatMessage: {
            table: {
                disable: true
            }
        }
    }
};

interface ChatConversation {
}
export const chatConversation: StoryObj<ChatConversation> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatConversationTag}>
            <${chatMessageTag} status='outgoing'>
                Hi, can you please help me?
            </${chatMessageTag}>
            <${chatMessageTag} status='incoming'>
                Yeah sure, what do you need help with?
            </${chatMessageTag}>
            <${chatMessageTag} status='outgoing'>
                Can you show me an example of some rendered markdown content? It should include a list and some bold text. Maybe some italics too.
            </${chatMessageTag}>
            <${chatMessageTag} status='incoming'>
                <${richTextViewerTag} :markdown="${_x => markdownExample}"></${richTextViewerTag}>
            </${chatMessageTag}>
            <${chatMessageTag} status='system'>
                <${spinnerTag} appearance='accent'></${spinnerTag}>
            </${chatMessageTag}>
            <${chatMessageTag} status='system'>
                <${buttonTag} appearance='block'>Help with my taxes</${buttonTag}>
                <${buttonTag} appearance='block'>Provide me some life advice</${buttonTag}>
            </${chatMessageTag}>
        </${chatConversationTag}>

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
        status: ChatMessageStatus.outgoing
    }
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
        status: ChatMessageStatus.outgoing
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
        markdown: markdownExample,
        status: ChatMessageStatus.outgoing
    }
};

export const chatMessageSpinner: StoryObj<ChatMessageArgs> = {
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <${chatMessageTag} status=${x => x.status}>
            <${spinnerTag} appearance='accent'></${spinnerTag}>
        </${chatMessageTag}>
    `),
    argTypes: {
        status: {
            options: Object.keys(ChatMessageStatus),
            control: { type: 'radio' },
            description: 'The status of the chat message.',
            table: { category: apiCategory.attributes }
        }
    },
    args: {
        status: ChatMessageStatus.system
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
        <${chatMessageTag} status=${x => x.status}>
            <${buttonTag} appearance='block'>${x => x.prompt1}</${buttonTag}>
            <${buttonTag} appearance='block'>${x => x.prompt2}</${buttonTag}>
        </${chatMessageTag}>
    `),
    argTypes: {
        status: {
            options: Object.keys(ChatMessageStatus),
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
        status: ChatMessageStatus.system,
        prompt1: 'Explain how to do my job',
        prompt2: 'Help me with my childhood trauma'
    }
};
