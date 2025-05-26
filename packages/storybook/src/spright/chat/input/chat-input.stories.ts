import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { html } from '@ni/fast-element';
import {
    apiCategory,
    createUserSelectedThemeStory,
} from '../../../utilities/storybook';
import { chatInputTag } from '../../../../../spright-components/src/chat/input';
import { withActions } from '@storybook/addon-actions/decorator';

interface ChatInputArgs {
    placeholder: string;
    sendButtonLabel: string;
    send: unknown;
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

export const chatInput: StoryObj<ChatInputArgs> = {
    render: createUserSelectedThemeStory(html`
        <${chatInputTag}></${chatInputTag}>
    `),
    argTypes: {
        placeholder: {
            description: 'Text to display in the text area when no text has been entered.',
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
    }
};

export default metadata;
