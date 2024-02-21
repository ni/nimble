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
    validity: undefined;
    checkValidity: undefined;
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

const validityDescription = `Readonly object of boolean values that represents the validity states that the viewer's configuration can be in.
The object's type is \`RichTextValidity\`, and it contains the following boolean properties:
-   \`invalidMentionConfiguration\`: \`true\` when a mention configuration is invalid. Call \`checkValidity()\` on each mention component to see which configuration is invalid, and read the \`validity\` property of that mention for details about why it's invalid.
-   \`duplicateMentionConfiguration\`: \`true\` if more than one of the same type of mention configuration element is provided
`;

const metadata: Meta<RichTextViewerArgs> = {
    title: 'Incubating/Rich Text Viewer',
    parameters: {},
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
        validity: {
            description: validityDescription,
            control: false
        },
        checkValidity: {
            name: 'checkValidity()',
            description:
                'A function that returns `true` if the configuration of the rich text viewer is valid and `false` if the configuration is not valid.',
            control: false
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
        data: exampleDataType.userPattern,
        validity: undefined,
        checkValidity: undefined
    }
};

export default metadata;

export const richTextViewer: StoryObj<RichTextViewerArgs> = {};
