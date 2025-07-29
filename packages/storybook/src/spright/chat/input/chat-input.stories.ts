import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from 'storybook/actions/decorator';
import { html } from '@ni/fast-element';
import { chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import {
    apiCategory,
    createUserSelectedThemeStory,
    placeholderDescription
} from '../../../utilities/storybook';

interface ChatInputArgs {
    placeholder: string;
    sendButtonLabel: string;
    value: string;
    send: undefined;
}

const metadata: Meta<ChatInputArgs> = {
    title: 'Internal/Chat Input',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['send']
        }
    }
};

export const chatInput: StoryObj<ChatInputArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatInputTag}
            placeholder="${x => x.placeholder}"
            send-button-label="${x => x.sendButtonLabel}"
            value="${x => x.value}"    
        >
        </${chatInputTag}>
    `),
    argTypes: {
        placeholder: {
            description: placeholderDescription({
                componentName: 'chat input'
            }),
            control: { type: 'text' },
            table: { category: apiCategory.attributes }
        },
        sendButtonLabel: {
            name: 'send-button-label',
            description:
                'Text to use for a `title` and ARIA attributes on the send button.',
            table: { category: apiCategory.attributes }
        },
        value: {
            description: 'The string within the chat input.',
            control: { type: 'text' },
            table: { category: apiCategory.attributes }
        },
        send: {
            description:
                'Emitted when the user clicks the button or presses Enter with text present. Includes `ChatInputSendEventDetail` which is an object with a `text` field containing the input.',
            table: { category: apiCategory.events }
        }
    },
    args: {
        placeholder: 'Type a message',
        sendButtonLabel: 'Send'
    }
};

export default metadata;
