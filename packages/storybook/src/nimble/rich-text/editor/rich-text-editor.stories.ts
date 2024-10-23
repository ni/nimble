import { html, ref, when } from '@microsoft/fast-element';
import type { HtmlRenderer, Meta, StoryObj } from '@storybook/html';
import { withActions } from '@storybook/addon-actions/decorator';
import { buttonTag } from '../../../../../nimble-components/src/button';
import { labelProviderRichTextTag } from '../../../../../nimble-components/src/label-provider/rich-text';
import { mappingUserTag } from '../../../../../nimble-components/src/mapping/user';
import { richTextMentionUsersTag } from '../../../../../nimble-components/src/rich-text-mention/users';
import {
    RichTextEditor,
    richTextEditorTag
} from '../../../../../nimble-components/src/rich-text/editor';
import {
    addLabelUseMetadata,
    type LabelUserArgs
} from '../../label-provider/base/label-user-stories-utils';
import { richTextMarkdownString } from '../../../utilities/rich-text-markdown-string';
import {
    apiCategory,
    checkValidityDescription,
    createUserSelectedThemeStory,
    disableStorybookZoomTransform,
    disabledDescription,
    errorTextDescription,
    errorVisibleDescription,
    incubatingWarning,
    placeholderDescription,
    validityDescription
} from '../../../utilities/storybook';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface RichTextEditorArgs extends LabelUserArgs {
    data: ExampleDataType;
    mentionData: MentionDataType;
    footerActionButtons: boolean;
    getMarkdown: undefined;
    getMentionedHrefs: undefined;
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

const setMarkdownDescription = 'A function that sets content in the editor with the provided markdown string.';
const getMarkdownDescription = 'A function that serializes the current data in the editor and returns the markdown string.';
const footerActionButtonDescription = `Place a button or anchor button at the far-right of the footer section to allow the user to invoke a custom action.

Nimble will set the height of the buttons to \`$ni-nimble-control-slim-height\`.

Note: The content in the \`footer-actions\` slot will not adjust based on the state of the rich text editor (e.g. disabled). It is the responsibility of the
client application to make any necessary adjustments. For example, if the buttons should be disabled when the rich text editor is disabled, the
client application must implement that functionality.
`;

const metadata: Meta<RichTextEditorArgs> = {
    title: 'Incubating/Rich Text Editor',
    decorators: [withActions<HtmlRenderer>],
    parameters: {
        actions: {
            handles: ['input', 'mention-update']
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
    ${disableStorybookZoomTransform}
    ${incubatingWarning({
        componentName: 'rich text editor',
        statusLink: 'https://github.com/ni/nimble/issues/1288'
    })}
    <${richTextEditorTag}
        ${ref('editorRef')}
        style="height: 300px;"
        data-unused="${x => x.setMarkdownData(x)}"
        ?disabled="${x => x.disabled}"
        ?footer-hidden="${x => x.footerHidden}"
        ?error-visible="${x => x.errorVisible}"
        error-text="${x => x.errorText}"
        placeholder="${x => x.placeholder}"
    >
        <${richTextMentionUsersTag} pattern="${x => mentionDataSets[x.mentionData].pattern}" button-label="Mention User">
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}1" display-name="John Doe😀"></${mappingUserTag}>
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}2" display-name="Mary Wilson😂"></${mappingUserTag}>
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}3" display-name="Sue Ann🤩"></${mappingUserTag}>
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}4" display-name="Joseph-George"></${mappingUserTag}>
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}5" display-name="David"></${mappingUserTag}>
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}6" display-name="Ranchan"></${mappingUserTag}>
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}7" display-name="Aegar"></${mappingUserTag}>
            <${mappingUserTag} key="${x => mentionDataSets[x.mentionData].href}8" display-name="Mitert"></${mappingUserTag}>
        </${richTextMentionUsersTag}>
        ${when(x => x.footerActionButtons, html`
            <${buttonTag}
                style="min-width: 72px;"
                appearance="ghost"
                slot="footer-actions"
            >Cancel</${buttonTag}>
            <${buttonTag}
                style="min-width: 72px;"
                slot="footer-actions"
            >OK</${buttonTag}>`)}
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
            },
            table: { category: apiCategory.methods }
        },
        mentionData: {
            name: 'default',
            description: `Configure how mentions are detected and displayed by adding a \`${richTextMentionUsersTag}\` as content. See documentation of the \`pattern\` attribute of the mention configuration element and the \`key\` attribute of mapping element(s).`,
            options: Object.values(mentionDataType),
            control: {
                type: 'radio',
                labels: {
                    [mentionDataType.userPattern]: 'User Pattern - user:(.*)',
                    [mentionDataType.httpsPattern]:
                        'HTTPS Pattern - https://user/(.*)'
                }
            },
            table: { category: apiCategory.slots }
        },
        footerActionButtons: {
            name: 'footer-actions',
            description: footerActionButtonDescription,
            table: { category: apiCategory.slots }
        },
        getMarkdown: {
            name: 'getMarkdown()',
            description: getMarkdownDescription,
            control: false,
            table: { category: apiCategory.methods }
        },
        getMentionedHrefs: {
            name: 'getMentionedHrefs()',
            description:
                'Returns an array of strings listing the hrefs of current mentions in the rich text components.',
            control: false,
            table: { category: apiCategory.methods }
        },
        editorRef: {
            table: { disable: true }
        },
        setMarkdownData: {
            table: { disable: true }
        },
        disabled: {
            description: disabledDescription({
                componentName: 'rich text editor'
            }),
            table: { category: apiCategory.attributes }
        },
        errorVisible: {
            description: errorVisibleDescription,
            table: { category: apiCategory.attributes }
        },
        errorText: {
            description: errorTextDescription,
            table: { category: apiCategory.attributes }
        },
        placeholder: {
            description: placeholderDescription({
                componentName: 'rich text editor'
            }),
            table: { category: apiCategory.attributes }
        },
        footerHidden: {
            description:
                'Hides the footer section which consists of all formatting option buttons and the `footer-actions` slot content.',
            table: { category: apiCategory.attributes }
        },
        empty: {
            name: 'empty',
            description:
                'Read-only boolean value. Returns true if editor is either empty or contains only whitespace.',
            control: false,
            table: { category: apiCategory.nonAttributeProperties }
        },
        input: {
            name: 'input',
            description:
                'Event emitted when there is a change in the content of the editor.',
            control: false,
            table: { category: apiCategory.events }
        },
        validity: {
            description: validityDescription({
                colloquialName: 'editor',
                validityObjectType: 'RichTextValidity',
                validityFlags: [
                    {
                        flagName: 'invalidMentionConfiguration',
                        description:
                            "`true` when a mention configuration is invalid. Call `checkValidity()` on each mention component to see which configuration is invalid, and read the `validity` property of that mention for details about why it's invalid."
                    },
                    {
                        flagName: 'duplicateMentionConfiguration',
                        description:
                            '`true` if more than one of the same type of mention configuration element is provided'
                    }
                ]
            }),
            control: false,
            table: { category: apiCategory.nonAttributeProperties }
        },
        checkValidity: {
            name: 'checkValidity()',
            description: checkValidityDescription({
                componentName: 'rich text editor'
            }),
            control: false,
            table: { category: apiCategory.methods }
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
                await customElements.whenDefined(richTextEditorTag);
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
