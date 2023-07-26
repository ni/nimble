import { html, ref } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { RichTextEditor, richTextEditorTag } from '..';
import { buttonTag } from '../../button';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RichTextEditorArgs {
    placeholder: string;
    hideFooter: undefined;
    errorVisible: boolean;
    disabled: boolean;
    footerHidden: boolean;
    maxlength: number;
    richTextEditorRef: RichTextEditor;
}

const richTextEditorDescription = 'The rich text editor component allows users to add/edit text formatted with various styling options including bold, italics, numbered lists, and bulleted lists. The editor generates markdown output and takes markdown as input. The markdown flavor used is [CommonMark](https://spec.commonmark.org/0.30/).\n\n See the [rich text viewer](?path=/docs/incubating-rich-text-viewer--docs) component to render markdown without allowing editing.';

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
    <${richTextEditorTag} ${ref('richTextEditorRef')} 
        placeholder="${x => x.placeholder}"
        ?error-visible="${x => x.errorVisible}"
        ?disabled="${x => x.disabled}"
        ?footer-hidden="${x => x.footerHidden}"
        maxlength="${x => x.maxlength}"
        >
        <${buttonTag} 
            @click=${x => {
        x.footerHidden = true;
    }} 
            appearance="ghost"
            slot="footer"
            >
            Cancel
        </${buttonTag}>
        <${buttonTag} slot="footer">Ok</${buttonTag}>
    </${richTextEditorTag}>
    `),
    args: {
        placeholder: 'Add comment here',
        errorVisible: false,
        disabled: false,
        footerHidden: false,
        maxlength: 10000
    }
};

export default metadata;

export const richTextEditor: StoryObj<RichTextEditorArgs> = {};
