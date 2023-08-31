import { html, ref, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { RichTextEditor, richTextEditorTag } from '..';
import { buttonTag } from '../../button';
import {
    addLabelUseMetadata,
    type LabelUserArgs
} from '../../label-provider/base/tests/label-user-stories-utils';
import { labelProviderRichTextTag } from '../../label-provider/rich-text';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RichTextEditorArgs extends LabelUserArgs {
    data: ExampleDataType;
    footerActionButtons: boolean;
    getMarkdown: undefined;
    editorRef: RichTextEditor;
    setMarkdownData: (args: RichTextEditorArgs) => void;
}

type ExampleDataType = (typeof exampleDataType)[keyof typeof exampleDataType];

const exampleDataType = {
    plainString: 'PlainString',
    markdownString: 'MarkdownString'
} as const;

const plainString = 'Plain text' as const;

const markdownString = `
Supported rich text formatting options:
1. **Bold**
2. *Italics*
3. Numbered lists
   1. Option 1
   2. Option 2
4. Bulleted lists
   * Option 1
   * Option 2` as const;

const dataSets = {
    [exampleDataType.plainString]: plainString,
    [exampleDataType.markdownString]: markdownString
} as const;

const richTextEditorDescription = 'The rich text editor component allows users to add/edit text formatted with various styling options including bold, italics, numbered lists, and bulleted lists. The editor generates markdown output and takes markdown as input. The markdown flavor used is [CommonMark](https://spec.commonmark.org/0.30/).\n\n See the [rich text viewer](?path=/docs/incubating-rich-text-viewer--docs) component to render markdown without allowing editing.';
const setMarkdownDescription = 'A function that sets content in the editor with the provided markdown string.';
const getMarkdownDescription = 'A function that serializes the current data in the editor and returns the markdown string.';
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
    <${richTextEditorTag}
        ${ref('editorRef')}
        data-unused="${x => x.setMarkdownData(x)}"
    >
        ${when(x => x.footerActionButtons, html`
            <${buttonTag} appearance="ghost" slot="footer-actions">Cancel</${buttonTag}>
            <${buttonTag} slot="footer-actions">OK</${buttonTag}>`)}
    </${richTextEditorTag}>
    `),
    argTypes: {
        data: {
            name: 'setMarkdown(value)',
            description: setMarkdownDescription,
            options: Object.values(exampleDataType),
            control: {
                type: 'radio',
                labels: {
                    [exampleDataType.plainString]: 'Plain string',
                    [exampleDataType.markdownString]:
                        'Combination of all supported markdown string'
                }
            }
        },
        footerActionButtons: {
            description: footerActionButtonDescription
        },
        getMarkdown: {
            name: 'getMarkdown()',
            description: getMarkdownDescription,
            control: false
        },
        editorRef: {
            table: { disable: true }
        },
        setMarkdownData: {
            table: { disable: true }
        }
    },
    args: {
        data: exampleDataType.plainString,
        footerActionButtons: false,
        editorRef: undefined,
        setMarkdownData: x => {
            void (async () => {
                // Safari workaround: the nimble-rich-text-editor element instance is made at this point
                // but doesn't seem to be upgraded to a custom element yet
                await customElements.whenDefined('nimble-rich-text-editor');
                x.editorRef.setMarkdown(dataSets[x.data]);
            })();
        }
    }
};

addLabelUseMetadata(metadata, labelProviderRichTextTag);

export default metadata;

export const richTextEditor: StoryObj<RichTextEditorArgs> = {};
