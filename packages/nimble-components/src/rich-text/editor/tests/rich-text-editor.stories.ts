import { html, ref, when } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../../utilities/tests/storybook';
import { RichTextEditor, richTextEditorTag } from '..';
import { buttonTag } from '../../../button';
import {
    addLabelUseMetadata,
    type LabelUserArgs
} from '../../../label-provider/base/tests/label-user-stories-utils';
import { labelProviderRichTextTag } from '../../../label-provider/rich-text';
import { richTextMarkdownString } from '../../../utilities/tests/rich-text-markdown-string';
import { mappingUserTag } from '../../../mapping/user';
import { richTextMentionUsersTag } from '../../../rich-text-mention/users';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RichTextEditorArgs extends LabelUserArgs {
    data: ExampleDataType;
    mentionData: MentionDataType;
    footerActionButtons: boolean;
    getMarkdown: undefined;
    editorRef: RichTextEditor;
    setMarkdownData: (args: RichTextEditorArgs) => void;
    disabled: boolean;
    footerHidden: boolean;
    errorVisible: boolean;
    errorText: string;
    input: unknown;
    empty: unknown;
    placeholder: string;
    validity: undefined;
    checkValidity: undefined;
}

type ExampleDataType = (typeof exampleDataType)[keyof typeof exampleDataType];

const exampleDataType = {
    plainString: 'PlainString',
    markdownString: 'MarkdownString'
} as const;

const plainString = 'Plain text' as const;

const dataSets = {
    [exampleDataType.plainString]: plainString,
    [exampleDataType.markdownString]: richTextMarkdownString
} as const;

type MentionDataType = (typeof mentionDataType)[keyof typeof mentionDataType];

const mentionDataType = {
    userPattern: 'UserPattern',
    httpsPattern: 'HttpsPattern'
} as const;

const mentionDataSets = {
    [mentionDataType.userPattern]: { pattern: '^user:(.*)', href: 'user:' },
    [mentionDataType.httpsPattern]: {
        pattern: '^https://user/(.*)',
        href: 'https://user/'
    }
} as const;

const richTextEditorDescription = 'The rich text editor component allows users to add/edit text formatted with various styling options including bold, italics, numbered lists, and bulleted lists. The editor generates markdown output and takes markdown as input. The markdown flavor used is [CommonMark](https://spec.commonmark.org/0.30/).\n\n See the [rich text viewer](?path=/docs/incubating-rich-text-viewer--docs) component to render markdown without allowing editing.';
const setMarkdownDescription = 'A function that sets content in the editor with the provided markdown string.';
const getMarkdownDescription = 'A function that serializes the current data in the editor and returns the markdown string.';
const footerActionButtonDescription = `To place content such as a button at the far-right of the footer section, set \`slot="footer-actions"\`.

Note: The content in the \`footer-actions\` slot will not adjust based on the state of the rich-text-editor (e.g. disabled). It is the responsibility of the
client application to make any necessary adjustments. For example, if the buttons should be disabled when the rich-text-editor is disabled, the
client application must implement that functionality.
`;

const validityDescription = `Readonly object of boolean values that represents the validity states that the editor's configuration  can be in.
The object's type is \`RichTextValidity\`, and it contains the following boolean properties:

-   \`invalidMentionConfiguration\`: \`true\` when a mention configuration is invalid. Call \`checkValidity()\` on each mention component to see which configuration is invalid, and read the \`validity\` property of that mention for details about why it's invalid.
-   \`duplicateMentionConfiguration\`: \`true\` if more than one of the same type of mention configuration element is provided
`;

const metadata: Meta<RichTextEditorArgs> = {
    title: 'Incubating/Rich Text Editor',
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
        style="height: 160px;"
        data-unused="${x => x.setMarkdownData(x)}"
        ?disabled="${x => x.disabled}"
        ?footer-hidden="${x => x.footerHidden}"
        ?error-visible="${x => x.errorVisible}"
        error-text="${x => x.errorText}"
        placeholder="${x => x.placeholder}"
    >
        <${richTextMentionUsersTag} pattern="${x => mentionDataSets[x.mentionData].pattern}">
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}1" display-name="John Doe"></${mappingUserTag}>
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}2" display-name="Mary Wilson"></${mappingUserTag}>
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}3" display-name="Sue Ann"></${mappingUserTag}>
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}4" display-name="Joseph George"></${mappingUserTag}>
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}5" display-name="David"></${mappingUserTag}>
        </${richTextMentionUsersTag}>
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
        mentionData: {
            name: '@mention configuration',
            description:
                'Configure how mentions are detected and displayed. See documentation of the `pattern` attribute of the mention configuration element and the `key` attribute of mapping element(s).',
            options: Object.values(mentionDataType),
            control: {
                type: 'radio',
                labels: {
                    [mentionDataType.userPattern]: 'User Pattern - user:(.*)',
                    [mentionDataType.httpsPattern]:
                        'HTTPS Pattern - https://user/(.*)'
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
        },
        validity: {
            description: validityDescription,
            control: false
        },
        checkValidity: {
            name: 'checkValidity()',
            description:
                'A function that returns `true` if the configuration of the rich text editor is valid and `false` if the configuration is not valid.',
            control: false
        }
    },
    args: {
        data: exampleDataType.markdownString,
        mentionData: mentionDataType.userPattern,
        footerActionButtons: false,
        disabled: false,
        footerHidden: false,
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
        },
        validity: undefined,
        checkValidity: undefined
    }
};

addLabelUseMetadata(metadata, labelProviderRichTextTag);

export default metadata;

export const richTextEditor: StoryObj<RichTextEditorArgs> = {};
