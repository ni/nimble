import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { mappingUserTag } from '@ni/nimble-components/dist/esm/mapping/user';
import { richTextMentionUsersTag } from '@ni/nimble-components/dist/esm/rich-text-mention/users';
import { richTextViewerTag } from '@ni/nimble-components/dist/esm/rich-text/viewer';
import { richTextMarkdownString } from '../../../utilities/rich-text-markdown-string';
import {
    apiCategory,
    checkValidityDescription,
    createUserSelectedThemeStory,
    incubatingWarning,
    validityDescription
} from '../../../utilities/storybook';

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
        markdown="${x => x.markdown}"
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
                'Input markdown string for the supported text formatting options in a [CommonMark](https://commonmark.org/) flavor.',
            table: { category: apiCategory.attributes }
        },
        data: {
            name: 'default',
            description: `Configure how mentions are detected and displayed by adding a \`${richTextMentionUsersTag}\` as content. See documentation of the \`pattern\` attribute of the mention configuration element and the \`key\` attribute of mapping element(s).`,
            options: Object.values(exampleDataType),
            control: {
                type: 'radio',
                labels: {
                    [exampleDataType.userPattern]: 'User Pattern - user:(.*)',
                    [exampleDataType.httpsPattern]:
                        'HTTPS Pattern - https://user/(.*)'
                }
            },
            table: { category: apiCategory.slots }
        },
        validity: {
            description: validityDescription({
                colloquialName: 'viewer',
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
                componentName: 'rich text viewer'
            }),
            control: false,
            table: { category: apiCategory.methods }
        },
        getMentionedHrefs: {
            name: 'getMentionedHrefs()',
            description:
                'Returns an array of strings listing the hrefs of current mentions in the rich text components.',
            control: false,
            table: { category: apiCategory.methods }
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
