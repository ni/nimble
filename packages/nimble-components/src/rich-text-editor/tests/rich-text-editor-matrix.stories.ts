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
import { richTextEditorTag } from '..';
import {
    cssPropertyFromTokenName,
    tokenNames
} from '../../theme-provider/design-token-names';
import { buttonTag } from '../../button';
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

const playFunction = (): void => {
    const editorNodeList = document.querySelectorAll('nimble-rich-text-editor');
    editorNodeList.forEach(element => element.setMarkdown(richTextMarkdownString));
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

richTextEditorThemeMatrix.play = playFunction;

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

const mobileWidthComponent = html`
    <${richTextEditorTag} style="padding: 20px; width: 300px;">
        <${buttonTag} slot="footer-actions" appearance="ghost">Cancel</${buttonTag}>
        <${buttonTag} slot="footer-actions" appearance="outline">Ok</${buttonTag}>
    </${richTextEditorTag}>
`;

export const plainTextContentInMobileWidth: StoryFn = createStory(mobileWidthComponent);

plainTextContentInMobileWidth.play = (): void => {
    document.querySelector('nimble-rich-text-editor')!.setMarkdown(loremIpsum);
};

const multipleSubPointsContent = `
1. Sub point 1
   1. Sub point 2
      1. Sub point 3
         1. Sub point 4
            1. Sub point 5
               1. Sub point 6
                  1. Sub point 7
                     1. Sub point 8
                        1. Sub point 9`;

export const multipleSubPointsContentInMobileWidth: StoryFn = createStory(mobileWidthComponent);

multipleSubPointsContentInMobileWidth.play = (): void => {
    document
        .querySelector('nimble-rich-text-editor')!
        .setMarkdown(multipleSubPointsContent);
};

export const longWordContentInMobileWidth: StoryFn = createStory(mobileWidthComponent);

longWordContentInMobileWidth.play = (): void => {
    document
        .querySelector('nimble-rich-text-editor')!
        .setMarkdown(
            'ThisIsALongWordWithoutSpaceToTestLongWordInSmallWidthThisIsALongWordWithoutSpaceToTestLongWordInSmallWidth'
        );
};
export const hiddenRichTextEditor: StoryFn = createStory(
    hiddenWrapper(html`<${richTextEditorTag} hidden></${richTextEditorTag}>`)
);
