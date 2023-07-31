import { html, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { richTextEditorTag } from '..';
import { buttonTag } from '../../button';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RichTextEditorArgs {
    placeholder: string;
    errorVisible: boolean;
    errorText: string;
    disabled: boolean;
    fitToContent: boolean;
    footerActionButtons: boolean;
    footerHidden: boolean;
}

const richTextEditorDescription = 'The rich text editor component allows users to add/edit text formatted with various styling options including bold, italics, numbered lists, and bulleted lists. The editor generates markdown output and takes markdown as input. The markdown flavor used is [CommonMark](https://spec.commonmark.org/0.30/).\n\n See the [rich text viewer](?path=/docs/incubating-rich-text-viewer--docs) component to render markdown without allowing editing.';
const footerActionButtonDescription = `To place content such as a button at the far-right of the footer section, set \`slot="footer-actions"\`.

Note: The content in the \`footer-actions\` slot will not adjust based on the state of the rich-text-editor (e.g. disabled). It is the responsibility of the
consuming application to make any necessary adjustments. For example, if the buttons should be disabled when the rich-text-editor is disabled, the
consuming application must implement that functionality.
`;

const fitToContentDescription = `Setting \`fit-to-content\` allows the editor to grow vertically to fit the content instead of enabling the
vertical scrollbar when it reaches the certain height

To observe the changes when toggling, add more than five lines in the editor; this will enable the vertical scrollbar to view the hidden content.
If the \`fit-to-content\` option is enabled, the editor will grow vertically to accommodate the content, instead of displaying the vertical scrollbar.`;

const metadata: Meta<RichTextEditorArgs> = {
    title: 'Incubating/Rich Text Editor',
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: richTextEditorDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
    ${incubatingWarning({
        componentName: 'rich text editor',
        statusLink: 'https://github.com/ni/nimble/issues/1288'
    })}
    <${richTextEditorTag}
        placeholder="${x => x.placeholder}"
        ?error-visible="${x => x.errorVisible}"
        error-text="${x => x.errorText}"
        ?disabled="${x => x.disabled}"
        ?footer-hidden="${x => x.footerHidden}"
        ?fit-to-content="${x => x.fitToContent}"
        >
        ${when(x => x.footerActionButtons, html`
            <${buttonTag} appearance="ghost" slot="footer-actions">Cancel</${buttonTag}>
            <${buttonTag} slot="footer-actions">Ok</${buttonTag}>`)}
    </${richTextEditorTag}>
    `),
    argTypes: {
        placeholder: {
            description: 'Placeholder text to show it in the editor when it is empty.'
        },
        errorVisible: {
            description: 'Whether the editor should be styled to indicate that it is in an invalid state'
        },
        errorText: {
            description: 'A message to be displayed when the editor is in the invalid state explaining why the value is invalid'
        },
        footerHidden: {
            description: 'Setting `footer-hidden` hides the footer section which consists of all formatting option buttons and the `footer-actions` slot content'
        },
        fitToContent: {
            description: fitToContentDescription
        },
        footerActionButtons: {
            description: footerActionButtonDescription
        }
    },
    args: {
        placeholder: 'Placeholder',
        errorVisible: false,
        errorText: 'Value is invalid',
        disabled: false,
        footerHidden: false,
        fitToContent: false,
        footerActionButtons: false
    }
};

export default metadata;

export const richTextEditor: StoryObj<RichTextEditorArgs> = {};
