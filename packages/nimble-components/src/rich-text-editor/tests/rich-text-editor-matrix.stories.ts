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
import {
    DisabledState,
    ErrorState,
    disabledStates,
    errorStates
} from '../../utilities/tests/states';

const metadata: Meta = {
    title: 'Tests/Rich Text Editor',
    parameters: {
        ...sharedMatrixParameters()
    }
};

const richTextMarkdownString = '1. **Bold*Italics***';

export default metadata;

const footerHiddenStates = [
    ['Footer Visible', false],
    ['Footer Hidden', true]
] as const;
type FooterHiddenState = (typeof footerHiddenStates)[number];

const placeholderValueStates = [
    ['', null],
    ['Placeholder', 'Placeholder text']
] as const;
type PlaceholderValueStates = (typeof placeholderValueStates)[number];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [footerHiddenName, footerHidden]: FooterHiddenState,
    [errorStateName, isError, errorText]: ErrorState,
    [placeholderName, placeholderText]: PlaceholderValueStates
): ViewTemplate => html`
    <p 
        style="
        font: var(${cssPropertyFromTokenName(tokenNames.bodyFont)});
        color: var(${cssPropertyFromTokenName(tokenNames.bodyFontColor)});
        margin-bottom: 0px;
        "
    >
        ${() => footerHiddenName} ${() => errorStateName} ${() => placeholderName} ${() => disabledName} 
    </p>
    <${richTextEditorTag}
        style="margin: 5px 0px; width: 500px;"
        ?disabled="${() => disabled}"
        ?footer-hidden="${() => footerHidden}"
        ?error-visible="${() => isError}"
        error-text="${() => errorText}"
        placeholder="${() => placeholderText}"
    >
    </${richTextEditorTag}>
`;

const playFunction = (): void => {
    const editorNodeList = document.querySelectorAll('nimble-rich-text-editor');
    editorNodeList.forEach(element => element.setMarkdown(richTextMarkdownString));
};

const longTextPlayFunction = (): void => {
    const editorNodeList = document.querySelectorAll('nimble-rich-text-editor');
    editorNodeList.forEach(element => element.setMarkdown(
        `${loremIpsum}\n\n **${loremIpsum}**\n\n ${loremIpsum}`
    ));
};

const editorSizingTestCase = (
    [widthLabel, widthStyle]: [string, string],
    [heightLabel, heightStyle]: [string, string]
): ViewTemplate => html`
    <p style="font: var(${cssPropertyFromTokenName(
        tokenNames.bodyFont
    )}); margin-bottom: 0px;">${() => widthLabel}; ${() => heightLabel}</p>
    <div style="width: 500px; height: 180px; outline: 1px dotted black;">
        <${richTextEditorTag} style="${() => widthStyle}; ${() => heightStyle};">
            <${buttonTag} slot="footer-actions" appearance="ghost">Cancel</${buttonTag}>
            <${buttonTag} slot="footer-actions" appearance="outline">Ok</${buttonTag}>
        </${richTextEditorTag}>
    </div>
`;

export const richTextEditorThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        footerHiddenStates,
        errorStates,
        [placeholderValueStates[0]]
    ])
);
richTextEditorThemeMatrix.play = playFunction;

export const errorStateThemeMatrixWithLengthyContent: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        [disabledStates[0]],
        [footerHiddenStates[0]],
        errorStates,
        [placeholderValueStates[0]]
    ])
);
errorStateThemeMatrixWithLengthyContent.play = longTextPlayFunction;

export const placeholderStateThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component, [
        disabledStates,
        [footerHiddenStates[0]],
        [errorStates[0]],
        placeholderValueStates
    ])
);

export const richTextEditorSizing: StoryFn = createStory(html`
    ${createMatrix(editorSizingTestCase, [
        [
            ['No width', ''],
            ['Width 450px', 'width: 450px'],
            ['Width 100%', 'width: 100%']
        ],
        [
            ['No height', ''],
            ['Height 100px', 'height: 100px'],
            ['Height 100%', 'height: 100%']
        ]
    ])}
`);

const mobileWidthComponent = html`
    <${richTextEditorTag} style="padding: 20px; width: 300px; height: 250px;">
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
