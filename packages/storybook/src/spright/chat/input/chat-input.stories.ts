import type { HtmlRenderer, StoryObj, Meta } from '@storybook/html-vite';
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
    maxlength: number | undefined;
    value: string;
    errorText: string;
    errorVisible: boolean;
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
            maxlength="${x => x.maxlength}"
            value="${x => x.value}"
            error-text="${x => x.errorText}"
            ?error-visible="${x => x.errorVisible}"
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
        maxlength: {
            name: 'maxlength',
            description:
                'The maximum number of characters allowed. Input will be silently truncated to this limit. Defaults to no limit (-1).',
            control: { type: 'number' },
            table: { category: apiCategory.attributes }
        },
        value: {
            description: 'The string within the chat input.',
            control: { type: 'text' },
            table: { category: apiCategory.attributes }
        },
        errorText: {
            name: 'error-text',
            description: 'Error text to display below the input.',
            control: { type: 'text' },
            table: { category: apiCategory.attributes }
        },
        errorVisible: {
            name: 'error-visible',
            description: 'Whether the error message is visible.',
            control: { type: 'boolean' },
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
        sendButtonLabel: 'Send',
        maxlength: -1,
        errorText: 'Error description',
        errorVisible: false
    }
};

export default metadata;
