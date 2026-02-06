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
    stopButtonLabel: string;
    maxlength: number | undefined;
    value: string;
    processing: boolean;
    send: undefined;
    stop: undefined;
}

const metadata: Meta<ChatInputArgs> = {
    title: 'Internal/Chat Input',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['send', 'stop']
        }
    }
};

export const chatInput: StoryObj<ChatInputArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatInputTag}
            placeholder="${x => x.placeholder}"
            send-button-label="${x => x.sendButtonLabel}"
            stop-button-label="${x => x.stopButtonLabel}"
            processing="${x => x.processing}"
            maxlength="${x => x.maxlength}"
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
        stopButtonLabel: {
            name: 'stop-button-label',
            description:
                'Text to use for a `title` and ARIA attributes on the stop button.',
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
        processing: {
            description: 'The string within the chat input.',
            control: { type: 'boolean' },
            table: { category: apiCategory.attributes }
        },
        send: {
            description:
                'Emitted when the user clicks the button or presses Enter with text present. Includes `ChatInputSendEventDetail` which is an object with a `text` field containing the input.',
            table: { category: apiCategory.events }
        },
        stop: {
            description:
                'Emitted when the user clicks the button. Includes `ChatInputStopEventDetail`.',
            table: { category: apiCategory.events }
        }
    },
    args: {
        placeholder: 'Type a message',
        sendButtonLabel: 'Send',
        stopButtonLabel: 'Stop',
        processing: false,,
        maxlength: -1,
    }
};

export default metadata;
