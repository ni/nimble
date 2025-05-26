import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { html } from '@ni/fast-element';
import {
    apiCategory,
    createUserSelectedThemeStory,
    placeholderDescription,
} from '../../../utilities/storybook';
import { chatInputTag } from '../../../../../spright-components/src/chat/input';

interface ChatInputArgs {
    placeholder: string;
    sendButtonLabel: string;
    send: undefined;
}

const metadata: Meta<ChatInputArgs> = {
    title: 'Internal/Chat Input',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['send']
        }
    },
};

// TODO: send-button-label
export const chatInput: StoryObj<ChatInputArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatInputTag} placeholder="${x => x.placeholder}"></${chatInputTag}>
    `),
    argTypes: {
        placeholder: {
            description: placeholderDescription({ componentName: 'chat input' }),
            control: { type: 'text' },
            table: { category: apiCategory.attributes }
        },
        sendButtonLabel: {
            name: 'send-button-label',
            description: 'Text to use for a `title` and ARIA attributes on the send button.',
            table: { category: apiCategory.attributes }
        },
        send: {
            description: 'Emitted when the user clicks the button or presses Enter with text present. Includes `ChatInputSendEventDetail` which is an object with a `text` field containing the input',
            table: { category: apiCategory.events }
        },
    },
    args: {
        placeholder: 'Ask Nigel',
        sendButtonLabel: 'Send',
    }
};

export default metadata;
