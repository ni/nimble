import { html } from '@microsoft/fast-element';
import type { Meta, StoryObj } from '@storybook/html';
import {
    createUserSelectedThemeStory,
    incubatingWarning
} from '../../../utilities/tests/storybook';
import { richTextViewerTag } from '..';
import { richTextMarkdownString } from '../../../utilities/tests/rich-text-markdown-string';
import { mappingUserTag } from '../../../mapping/user';
import { richTextMentionUsersTag } from '../../../rich-text-mention/users';

interface RichTextViewerArgs {
    markdown: string;
    data: ExampleDataType;
    getMentionedHrefs: undefined;
}

type ExampleDataType = (typeof exampleDataType)[keyof typeof exampleDataType];

const exampleDataType = {
    userPattern: 'UserPattern',
    httpsPattern: 'HttpsPattern'
} as const;

const dataSets = {
    [exampleDataType.userPattern]: { pattern: '^user:(.*)', href: 'user:' },
    [exampleDataType.httpsPattern]: {
        pattern: '^https://user/(.*)',
        href: 'https://user/'
    }
} as const;

const richTextViewerDescription = 'The rich text viewer component allows users to view text formatted with various styling options including bold, italics, numbered lists, and bulleted lists. The rich text to render is provided as a markdown string.\n\n See the [rich text editor](?path=/docs/incubating-rich-text-editor--docs) component to enable users to modify the markdown contents.';

const metadata: Meta<RichTextViewerArgs> = {
    title: 'Incubating/Rich Text Viewer',
    parameters: {
        docs: {
            description: {
                component: richTextViewerDescription
            }
        }
    },
    // prettier-ignore
    render: createUserSelectedThemeStory(html`
    ${incubatingWarning({
        componentName: 'rich text viewer',
        statusLink: 'https://github.com/ni/nimble/issues/1288'
    })}
    <${richTextViewerTag}
        :markdown="${x => x.markdown}"
    >
        <${richTextMentionUsersTag} pattern="${x => dataSets[x.data].pattern}">
            <${mappingUserTag} key="${x => dataSets[x.data].href}1" display-name="John Doe"></${mappingUserTag}>
            <${mappingUserTag} key="${x => dataSets[x.data].href}2" display-name="Mary Wilson"></${mappingUserTag}>
            <${mappingUserTag} key="${x => dataSets[x.data].href}3" display-name="Sue Ann"></${mappingUserTag}>
            <${mappingUserTag} key="${x => dataSets[x.data].href}4" display-name="Joseph George"></${mappingUserTag}>
            <${mappingUserTag} key="${x => dataSets[x.data].href}5" display-name="David"></${mappingUserTag}>
        </${richTextMentionUsersTag}>
    </${richTextViewerTag}>
    `),
    argTypes: {
        markdown: {
            description:
                'Input markdown string for the supported text formatting options in a [CommonMark](https://commonmark.org/) flavor.'
        },
        data: {
            name: '@mention configuration',
            description:
                'Configure how mentions are detected and displayed. See documentation of the `pattern` attribute of the mention configuration element and the `key` attribute of mapping element(s).',
            options: Object.values(exampleDataType),
            control: {
                type: 'radio',
                labels: {
                    [exampleDataType.userPattern]: 'User Pattern - user:(.*)',
                    [exampleDataType.httpsPattern]:
                        'HTTPS Pattern - https://user/(.*)'
                }
            }
        },
        getMentionedHrefs: {
            name: 'getMentionedHrefs()',
            description:
                'Returns an array of strings listing the hrefs of current mentions in the rich text components.',
            control: false
        }
    },
    args: {
        markdown: richTextMarkdownString,
        data: exampleDataType.userPattern
    }
};

export default metadata;

export const richTextViewer: StoryObj<RichTextViewerArgs> = {};
