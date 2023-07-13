import type { Meta, StoryFn } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { richTextViewerTag } from '..';
import { richTextMarkdownString } from '../../utilities/tests/rich-text-markdown-string';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';

const metadata: Meta = {
    title: 'Tests/Rich Text Viewer',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (): ViewTemplate => html`
    <${richTextViewerTag} :markdown="${_ => richTextMarkdownString}"></${richTextViewerTag}>
`;

const viewerSizingTestCase = (
    [widthLabel, widthStyle]: [string, string],
    [heightLabel, heightStyle]: [string, string]
): ViewTemplate => html`
    <div style="width: 500px; display: flex; justify-content: space-between">
        <p style="font: 14px/18px Source Sans Pro; margin-bottom: 0px;">${widthLabel}; ${heightLabel}</p>
        <p style="font: 14px/18px Source Sans Pro; margin-bottom: 0px;">width: 500px, height: 150px</p>        
    </div>
    <div style="width: 500px; height: 150px; outline: 1px dotted black">
        <${richTextViewerTag}
            style="${widthStyle}; ${heightStyle}"
            :markdown="${_ => richTextMarkdownString}"
        >
        </${richTextViewerTag}>
    </div>
`;

const viewerDifferentContentTestCase = (
    [label, markdownContent]: [string, string],
    [heightLabel, parentHeightStyle]: [string, string]
): ViewTemplate => html`
    <div style="width: 300px; display: flex; justify-content: space-between">
        <p style="font: 14px/18px Source Sans Pro; margin-bottom: 0px;">${label}</p>
        <p style="font: 14px/18px Source Sans Pro; margin-bottom: 0px;">width: 300px, height: ${heightLabel}</p>        
    </div>
    <div style="width: 300px; outline: 1px dotted black; ${parentHeightStyle}">
        <${richTextViewerTag}
            :markdown="${_ => markdownContent}"
        >
        </${richTextViewerTag}>
    </div>
`;

const componentFitToContent = ([widthLabel, widthStyle]: [
    string,
    string
]): ViewTemplate => html`
    <p style="font: 14px/18px Source Sans Pro; margin-bottom: 0px;">${widthLabel}</p>
    <${richTextViewerTag} style="${widthStyle}; outline: 1px dotted black" 
        :markdown="${_ => `${loremIpsum}\n\n **${loremIpsum}**\n\n ${loremIpsum}`}">
    </${richTextViewerTag}>
`;

export const richTextViewerThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

export const richTextViewerSizing: StoryFn = createStory(html`
    ${createMatrix(viewerSizingTestCase, [
        [
            ['no width', ''],
            ['width 300px', 'width: 300px'],
            ['width 100%', 'width: 100%']
        ],
        [
            ['no height', ''],
            ['height 75px', 'height: 75px'],
            ['height 100%', 'height: 100%']
        ]
    ])}
`);

export const differentContentsInMobileWidth: StoryFn = createStory(html`
    ${createMatrix(viewerDifferentContentTestCase, [
        [
            ['No content', ''],
            ['Plain text', loremIpsum],
            [
                'Multiple sup points',
                '1. Sub point 1\n   1. Sub point 2\n       1. Sub point 3\n          1. Sub point 4\n             1. Sub point 5\n                 1. Sub point 6\n                    1. Sub point 7\n'
            ],
            [
                'Long link',
                '<https://www.google.com/search?q=what+is+nimble&rlz=1C1CHBF_enIN1007IN1007&oq=what+is+nimble&aqs=chrome..69i57j0i512l9.2837j1j7&sourceid=chrome&ie=UTF-8>'
            ],
            [
                'Long word',
                'ThisIsALongWordWithoutSpaceToTestLongWordInSmallWidth'
            ]
        ],
        [
            ['nil', ''],
            ['100px', 'height: 100px']
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

export const hiddenRichTextViewer: StoryFn = createStory(
    hiddenWrapper(html`<${richTextViewerTag} hidden></${richTextViewerTag}>`)
);
