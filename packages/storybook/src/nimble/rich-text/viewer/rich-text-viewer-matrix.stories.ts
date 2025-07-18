import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, ViewTemplate } from '@ni/fast-element';
import {
    cssPropertyFromTokenName,
    tokenNames
} from '@ni/nimble-components/dist/esm/theme-provider/design-token-names';
import { mappingUserTag } from '@ni/nimble-components/dist/esm/mapping/user';
import { richTextMentionUsersTag } from '@ni/nimble-components/dist/esm/rich-text-mention/users';
import { richTextViewerTag } from '@ni/nimble-components/dist/esm/rich-text/viewer';
import { createStory } from '../../../utilities/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/matrix';
import { hiddenWrapper } from '../../../utilities/hidden';
import { richTextMarkdownString } from '../../../utilities/rich-text-markdown-string';
import { loremIpsum } from '../../../utilities/lorem-ipsum';

const metadata: Meta = {
    title: 'Tests/Rich Text Viewer',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (): ViewTemplate => html`
    <${richTextViewerTag} markdown="${_ => richTextMarkdownString}">
        <${richTextMentionUsersTag} pattern="^user:(.*)">
            <${mappingUserTag} key="user:1" display-name="John Doe"></${mappingUserTag}>
        </${richTextMentionUsersTag}>
    </${richTextViewerTag}>
`;

const viewerSizingTestCase = (
    [widthLabel, widthStyle]: [string, string],
    [heightLabel, heightStyle]: [string, string]
): ViewTemplate => html`
    <p style="font: var(${cssPropertyFromTokenName(
        tokenNames.bodyFont
    )}); margin-bottom: 0px;">${widthLabel}; ${heightLabel}</p>
    <div style="width: 500px; height: 150px; outline: 1px dotted black">
        <${richTextViewerTag}
            style="${widthStyle}; ${heightStyle}; outline: 1px dashed red;"
            markdown="${_ => richTextMarkdownString}"
        >
            <${richTextMentionUsersTag} pattern="^user:(.*)">
                <${mappingUserTag} key="user:1" display-name="John Doe"></${mappingUserTag}>
            </${richTextMentionUsersTag}>
        </${richTextViewerTag}>
    </div>
`;

const viewerDifferentContentTestCase = (
    [label, markdownContent]: [string, string],
    [heightLabel, parentHeightStyle]: [string, string]
): ViewTemplate => html`
    <p style="font: var(${cssPropertyFromTokenName(
        tokenNames.bodyFont
    )}); margin-bottom: 0px;">${label}; ${heightLabel}</p>
    <div style="width: 300px; outline: 1px dotted black; ${parentHeightStyle}">
        <${richTextViewerTag}
            markdown="${_ => markdownContent}"
        >
        </${richTextViewerTag}>
    </div>
`;

const componentFitToContent = ([widthLabel, widthStyle]: [
    string,
    string
]): ViewTemplate => html`
    <p style="font: var(${cssPropertyFromTokenName(
        tokenNames.bodyFont
    )}); margin-bottom: 0px;">${widthLabel}</p>
    <${richTextViewerTag} style="${widthStyle}; outline: 1px dotted black" 
        markdown="${_ => `${loremIpsum}\n\n **${loremIpsum}**\n\n ${loremIpsum}`}">
    </${richTextViewerTag}>
`;

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

export const sizing: StoryFn = createStory(html`
    ${createMatrix(viewerSizingTestCase, [
        [
            ['No width', ''],
            ['Width 300px', 'width: 300px'],
            ['Width 100%', 'width: 100%']
        ],
        [
            ['No height', ''],
            ['Height 75px', 'height: 75px'],
            ['Height 100%', 'height: 100%']
        ]
    ])}
`);

export const differentContents$MobileWidth: StoryFn = createStory(html`
    ${createMatrix(viewerDifferentContentTestCase, [
        [
            ['No content', ''],
            ['Plain text', loremIpsum],
            [
                'Multiple sub points',
                '1. Sub point 1\n   1. Sub point 2\n       1. Sub point 3\n          1. Sub point 4\n             1. Sub point 5\n                 1. Sub point 6\n                    1. Sub point 7\n'
            ],
            [
                'Long link',
                '<https://www.google.com/search?q=what+is+nimble&rlz=1C1CHBF_enIN1007IN1007&oq=what+is+nimble&aqs=chrome..69i57j0i512l9.2837j1j7&sourceid=chrome&ie=UTF-8>'
            ],
            [
                'Long word',
                'ThisIsALongWordWithoutSpaceToTestLongWordInSmallWidth'
            ],
            [
                'Single line',
                'This is to test how single line is rendered in viewer'
            ]
        ],
        [
            ['No height', ''],
            ['Height 100px', 'height: 100px']
        ]
    ])}
`);

export const fitToContentTest: StoryFn = createStory(html`
    ${createMatrix(componentFitToContent, [
        [
            ['no width', ''],
            ['width 300px', 'width: 300px']
        ]
    ])}
`);

export const hidden: StoryFn = createStory(
    hiddenWrapper(html`<${richTextViewerTag} hidden></${richTextViewerTag}>`)
);
