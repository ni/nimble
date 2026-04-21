import type { HtmlRenderer, StoryObj, Meta } from '@storybook/html-vite';
import { withActions } from 'storybook/actions/decorator';
import { html, when } from '@ni/fast-element';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconAddTag } from '@ni/nimble-components/dist/esm/icons/add';
import { chipTag } from '@ni/nimble-components/dist/esm/chip';
import {
    apiCategory,
    createUserSelectedThemeStory,
    placeholderDescription,
    errorTextDescription
} from '../../../utilities/storybook';

interface ChatInputArgs {
    placeholder: string;
    sendButtonLabel: string;
    stopButtonLabel: string;
    maxlength: number | undefined;
    value: string;
    processing: boolean;
    sendDisabled: boolean;
    errorText: string;
    errorVisible: boolean;
    footerActions: boolean;
    attachments: boolean;
    send: undefined;
    stop: undefined;
}

const footerActionsDescription = `Place 0 or more controls to the left of the send/stop button.

The buttons should have the \`ghost\` appearance and \`content-hidden\`.

Select controls should have the \`underline\` appearance.

Spright will set the height of the controls to \`$ni-nimble-control-slim-height\`.
`;

const attachmentsDescription = 'An area to slot content adjacent to the text input area. Intended to be used for adding chips that represent attached files.';

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
            ?send-disabled="${x => x.sendDisabled}"
            maxlength="${x => x.maxlength}"
            value="${x => x.value}"
            error-text="${x => x.errorText}"
            ?error-visible="${x => x.errorVisible}"
        >
            ${when(x => x.attachments, html`
                <${chipTag} slot="attachments" removable>Placeholder.txt</${chipTag}>
                <${chipTag} slot="attachments" removable>Image.png</${chipTag}>
            `)}
            ${when(x => x.footerActions, html`
                <${buttonTag} slot="footer-actions" appearance="ghost" title="Attach" content-hidden>
                    <${iconAddTag} slot="start"></${iconAddTag}>
                    Attach
                </${buttonTag}>
                <${selectTag} appearance="underline" slot="footer-actions" title="Worker of the Week">
                    <${listOptionTag} value="option1">Inanimate Carbon Rod</${listOptionTag}>
                    <${listOptionTag} value="option2">Homer Simpson</${listOptionTag}>
                </${selectTag}>
            `)}
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
            description: 'Shows the stop button instead of the send button when set to true.',
            control: { type: 'boolean' },
            table: { category: apiCategory.attributes }
        },
        sendDisabled: {
            name: 'send-disabled',
            description: 'Whether the send button is explicitly disabled. In addition the component will automatically disable the send button when the input is empty; that state is not reflected in this attribute.',
            control: { type: 'boolean' },
            table: { category: apiCategory.attributes }
        },
        errorText: {
            name: 'error-text',
            description: errorTextDescription,
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
                'Emitted when the user clicks the \'Send\' button or presses Enter with text present. Includes `ChatInputSendEventDetail` which is an object with a `text` field containing the input.',
            table: { category: apiCategory.events }
        },
        stop: {
            description:
                'Emitted when the user clicks the \'Stop\' button.',
            table: { category: apiCategory.events }
        },
        footerActions: {
            name: 'footer-actions',
            description: footerActionsDescription,
            control: { type: 'boolean' },
            table: { category: apiCategory.slots }
        },
        attachments: {
            name: 'attachments',
            description: attachmentsDescription,
            control: { type: 'boolean' },
            table: { category: apiCategory.slots }
        }
    },
    args: {
        placeholder: 'Type a message',
        sendButtonLabel: 'Send',
        stopButtonLabel: 'Stop',
        processing: false,
        sendDisabled: false,
        maxlength: -1,
        errorText: 'Error description',
        errorVisible: false,
        footerActions: false,
        attachments: false
    }
};

export default metadata;
