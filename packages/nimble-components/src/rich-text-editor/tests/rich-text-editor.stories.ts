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
    footerActionButtons: boolean;
    getMarkdown: undefined;
    setMarkdown: undefined;
}

const richTextEditorDescription = 'The rich text editor component allows users to add/edit text formatted with various styling options including bold, italics, numbered lists, and bulleted lists. The editor generates markdown output and takes markdown as input. The markdown flavor used is [CommonMark](https://spec.commonmark.org/0.30/).\n\n See the [rich text viewer](?path=/docs/incubating-rich-text-viewer--docs) component to render markdown without allowing editing.';
const setMarkdownDescription = 'A function that sets content in the editor with the provided markdown string';
const getMarkdownDescription = 'A function that serializes the current data in the editor and returns the markdown string';
const footerActionButtonDescription = `To place content such as a button at the far-right of the footer section, set \`slot="footer-actions"\`.

Note: The content in the \`footer-actions\` slot will not adjust based on the state of the rich-text-editor (e.g. disabled). It is the responsibility of the
client application to make any necessary adjustments. For example, if the buttons should be disabled when the rich-text-editor is disabled, the
client application must implement that functionality.
`;

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
    <${richTextEditorTag}>
        ${when(x => x.footerActionButtons, html`
            <${buttonTag} appearance="ghost" slot="footer-actions">Cancel</${buttonTag}>
            <${buttonTag} slot="footer-actions">OK</${buttonTag}>`)}
    </${richTextEditorTag}>
    `),
    argTypes: {
        footerActionButtons: {
            description: footerActionButtonDescription
        },
        setMarkdown: {
            name: 'setMarkdown()',
            description: setMarkdownDescription,
            control: false
        },
        getMarkdown: {
            name: 'getMarkdown()',
            description: getMarkdownDescription,
            control: false
        }
    },
    args: {
        footerActionButtons: false
    }
};

export default metadata;

export const richTextEditor: StoryObj<RichTextEditorArgs> = {};
