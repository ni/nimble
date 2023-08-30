import { html, ref, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../utilities/tests/storybook';
import { RichTextEditor, richTextEditorTag } from '..';
import { buttonTag } from '../../button';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RichTextEditorArgs {
    data: ExampleDataType;
    footerActionButtons: boolean;
    getMarkdown: undefined;
    editorRef: RichTextEditor;
    setMarkdownData: (args: RichTextEditorArgs) => void;
    disabled: boolean;
    footerHidden: boolean;
    fitToContent: boolean;
    errorVisible: boolean;
    errorText: string;
    input: unknown;
    empty: unknown;
    placeholder: string;
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
const fitToContentDescription = `Setting \`fit-to-content\` allows the editor to grow vertically to fit the content instead of displaying a
vertical scrollbar when content exceeds the visible height.

When \`fit-to-content\` is set the component will only grow to its \`max-height\`. A vertical scrollbar will be enabled when the content it
exceeds the specified maximum height.`;

const metadata: Meta<RichTextEditorArgs> = {
    title: 'Incubating/Rich Text Editor',
    tags: ['autodocs'],
    decorators: [withActions],
    parameters: {
        docs: {
            description: {
                component: richTextEditorDescription
            }
        },
        actions: {
            handles: ['input']
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
        ?disabled="${x => x.disabled}"
        ?footer-hidden="${x => x.footerHidden}"
        ?fit-to-content="${x => x.fitToContent}"
        ?error-visible="${x => x.errorVisible}"
        error-text="${x => x.errorText}"
        placeholder="${x => x.placeholder}"
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
        },
        errorVisible: {
            description:
                'Whether the editor should be styled to indicate that it is in an invalid state.'
        },
        errorText: {
            description:
                'A message to be displayed when the editor is in the invalid state explaining why the value is invalid.'
        },
        placeholder: {
            description: 'Placeholder text to show when editor is empty.'
        },
        footerHidden: {
            description:
                'Setting `footer-hidden` hides the footer section which consists of all formatting option buttons and the `footer-actions` slot content.'
        },
        fitToContent: {
            description: fitToContentDescription
        },
        empty: {
            name: 'empty',
            description:
                'Read-only boolean value. Returns true if editor is either empty or contains only whitespace.',
            control: false
        },
        input: {
            name: 'input',
            description:
                'This event is fired when there is a change in the content of the editor.',
            control: false
        }
    },
    args: {
        data: exampleDataType.plainString,
        footerActionButtons: false,
        disabled: false,
        footerHidden: false,
        fitToContent: false,
        errorVisible: false,
        errorText: 'Value is invalid',
        placeholder: 'Placeholder',
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

export default metadata;

export const richTextEditor: StoryObj<RichTextEditorArgs> = {};
