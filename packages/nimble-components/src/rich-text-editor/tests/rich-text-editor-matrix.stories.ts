import type { Meta, StoryFn } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import {
    createFixedThemeStory,
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { richTextEditorTag } from '..';
import {
    cssPropertyFromTokenName,
    tokenNames
} from '../../theme-provider/design-token-names';
import { buttonTag } from '../../button';
import { backgroundStates } from '../../utilities/tests/states';
import { loremIpsum } from '../../utilities/tests/lorem-ipsum';

const metadata: Meta = {
    title: 'Tests/Rich Text Editor',
    parameters: {
        ...sharedMatrixParameters()
    }
};

const richTextMarkdownString = '1. **Bold*Italics***';

export default metadata;

// prettier-ignore
const component = (): ViewTemplate => html`
    <${richTextEditorTag}></${richTextEditorTag}>
`;

const [
    lightThemeWhiteBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground,
    ...remaining
] = backgroundStates;

if (remaining.length > 0) {
    throw new Error('New backgrounds need to be supported');
}

const playFunction = (): void => {
    document.querySelector('nimble-rich-text-editor')!.setMarkdown(richTextMarkdownString);
};

const editorSizingTestCase = (
    [widthLabel, widthStyle]: [string, string],
    [heightLabel, heightStyle]: [string, string]
): ViewTemplate => html`
    <p style="font: var(${cssPropertyFromTokenName(
        tokenNames.bodyFont
    )}); margin-bottom: 0px;">${widthLabel}; ${heightLabel}</p>
    <div style="width: 500px; height: 150px; outline: 1px dotted black;">
        <${richTextEditorTag} style="${widthStyle}; ${heightStyle};">
            <${buttonTag} slot="footer-actions" appearance="ghost">Cancel</${buttonTag}>
            <${buttonTag} slot="footer-actions" appearance="outline">Ok</${buttonTag}>
        </${richTextEditorTag}>
    </div>
`;

export const richTextEditorThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

export const richTextEditorSizing: StoryFn = createStory(html`
    ${createMatrix(editorSizingTestCase, [
        [
            ['No width', ''],
            ['Width 360px', 'width: 360px'],
            ['Width 100%', 'width: 100%']
        ],
        [
            ['No height', ''],
            ['Height 80px', 'height: 80px'],
            ['Height 100%', 'height: 100%']
        ]
    ])}
`);

const styledComponent = (): ViewTemplate => html`
<div style="padding: 20px">
    <${richTextEditorTag}>
        <${buttonTag} slot="footer-actions" appearance="ghost">Cancel</${buttonTag}>
        <${buttonTag} slot="footer-actions" appearance="outline">Ok</${buttonTag}>
    </${richTextEditorTag}>
</div>
`;

const mobileWidthComponent = (): ViewTemplate => html`
<div style="padding: 20px; width: 300px;">
    <${richTextEditorTag}>
        <${buttonTag} slot="footer-actions" appearance="ghost">Cancel</${buttonTag}>
        <${buttonTag} slot="footer-actions" appearance="outline">Ok</${buttonTag}>
    </${richTextEditorTag}>
</div>
`;

export const editorWhenMarkdownValueSetInLightThemeWhiteBackground: StoryFn = createFixedThemeStory(createMatrix(styledComponent), lightThemeWhiteBackground);

editorWhenMarkdownValueSetInLightThemeWhiteBackground.play = playFunction;

export const editorWhenMarkdownValueSetInColorThemeDarkGreenBackground: StoryFn = createFixedThemeStory(createMatrix(styledComponent), colorThemeDarkGreenBackground);

editorWhenMarkdownValueSetInColorThemeDarkGreenBackground.play = playFunction;

export const editorWhenMarkdownValueSetInDarkThemeBlackBackground: StoryFn = createFixedThemeStory(createMatrix(styledComponent), darkThemeBlackBackground);

editorWhenMarkdownValueSetInDarkThemeBlackBackground.play = playFunction;

export const plainTextContentInMobileWidth: StoryFn = createFixedThemeStory(createMatrix(mobileWidthComponent), lightThemeWhiteBackground);

plainTextContentInMobileWidth.play = (): void => {
    document.querySelector('nimble-rich-text-editor')!.setMarkdown(loremIpsum);
};

export const multipleSubPointsContentInMobileWidth: StoryFn = createFixedThemeStory(createMatrix(mobileWidthComponent), lightThemeWhiteBackground);

multipleSubPointsContentInMobileWidth.play = (): void => {
    document.querySelector('nimble-rich-text-editor')!.setMarkdown('1. Sub point 1\n   1. Sub point 2\n       1. Sub point 3\n          1. Sub point 4\n             1. Sub point 5\n                 1. Sub point 6\n                    1. Sub point 7\n');
};

export const longWordContentInMobileWidth: StoryFn = createFixedThemeStory(createMatrix(mobileWidthComponent), lightThemeWhiteBackground);

longWordContentInMobileWidth.play = (): void => {
    document.querySelector('nimble-rich-text-editor')!.setMarkdown('ThisIsALongWordWithoutSpaceToTestLongWordInSmallWidth');
};
export const hiddenRichTextEditor: StoryFn = createStory(
    hiddenWrapper(html`<${richTextEditorTag} hidden></${richTextEditorTag}>`)
);
