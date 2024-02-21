import type { Meta, StoryFn } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createStory } from '../../../utilities/tests/storybook';
import {
    createMatrixThemeStory,
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import { hiddenWrapper } from '../../../utilities/tests/hidden';
import { richTextEditorTag } from '..';
import { buttonTag } from '../../../button';
import { loremIpsum } from '../../../utilities/tests/lorem-ipsum';
import {
    DisabledState,
    ErrorState,
    disabledStates,
    errorStates
} from '../../../utilities/tests/states';
import { richTextMentionUsersTag } from '../../../rich-text-mention/users';
import { mappingUserTag } from '../../../mapping/user';
import { bodyFont, bodyFontColor } from '../../../theme-provider/design-tokens';
import { toggleButtonTag } from '../../../toggle-button';
import { menuButtonTag } from '../../../menu-button';
import { anchorButtonTag } from '../../../anchor-button';

const metadata: Meta = {
    title: 'Tests/Rich Text Editor',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const richTextMarkdownString = '1. **Bold** *Italics*\n2. Numbered lists\n   1. Option 1\n   \n3. Bulleted lists\n   * Option 1\n   \n4. Absolute link: <https://nimble.ni.dev/>\n 6. @mention:\n    1. User pattern: <user:1>';

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

const slotButtons = [
    buttonTag,
    toggleButtonTag,
    menuButtonTag,
    anchorButtonTag
] as const;
type SlotButtons = (typeof slotButtons)[number];

// prettier-ignore
const component = (
    [disabledName, disabled]: DisabledState,
    [footerHiddenName, footerHidden]: FooterHiddenState,
    [errorStateName, isError, errorText]: ErrorState,
    [placeholderName, placeholderText]: PlaceholderValueStates
): ViewTemplate => html`
    <p 
        style="
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
        margin-bottom: 0px;
        "
    >
        ${() => footerHiddenName} ${() => errorStateName} ${() => placeholderName} ${() => disabledName} 
    </p>
    <${richTextEditorTag}
        style="margin: 5px 0px; width: 500px; height: 200px;"
        ?disabled="${() => disabled}"
        ?footer-hidden="${() => footerHidden}"
        ?error-visible="${() => isError}"
        error-text="${() => errorText}"
        placeholder="${() => placeholderText}"
    >
        <${richTextMentionUsersTag} pattern="^user:(.*)">
            <${mappingUserTag} key="user:1" display-name="John Doe"></${mappingUserTag}>
        </${richTextMentionUsersTag}>
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

// prettier-ignore
const editorSizingTestCase = (
    [widthLabel, widthStyle]: [string, string],
    [heightLabel, heightStyle]: [string, string]
): ViewTemplate => html`
    <p style="font: var(${bodyFont.cssCustomProperty}); margin-bottom: 0px;">${() => widthLabel}; ${() => heightLabel}</p>
    <div style="width: 500px; height: 180px; outline: 1px dotted black;">
        <${richTextEditorTag} style="${() => widthStyle}; ${() => heightStyle};">
            <${richTextMentionUsersTag} pattern="^user:(.*)">
                <${mappingUserTag} key="user:1" display-name="John Doe"></${mappingUserTag}>
            </${richTextMentionUsersTag}>
            <${buttonTag}
                style="width: 72px;"
                slot="footer-actions"
                appearance="ghost"
            >Cancel</${buttonTag}>
            <${buttonTag}
                style="width: 72px;"
                slot="footer-actions"
            >Ok</${buttonTag}>
        </${richTextEditorTag}>
    </div>
`;

// prettier-ignore
const slotButtonsTextCase = (
    slotButton: SlotButtons
): ViewTemplate => html`
    <p style="font: var(${bodyFont.cssCustomProperty}); margin-bottom: 0px;">${() => slotButton}</p>
    <${richTextEditorTag}>
        <${slotButton}
            style="width: 72px;"
            slot="footer-actions"
        >Ok</${slotButton}>
    </${richTextEditorTag}>
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

export const richTextEditorSlotButtons: StoryFn = createStory(html`
    ${createMatrix(slotButtonsTextCase, [slotButtons])}
`);

// prettier-ignore
const mobileWidthComponent = html`
    <${richTextEditorTag} style="padding: 20px; width: 360px; height: 250px;">
        <${richTextMentionUsersTag} pattern="^user:(.*)">
            <${mappingUserTag} key="user:1" display-name="John Doe"></${mappingUserTag}>
        </${richTextMentionUsersTag}>
        <${buttonTag}
            style="width: 72px;"
            slot="footer-actions"
            appearance="ghost"
        >Cancel</${buttonTag}>
        <${buttonTag}
            style="width: 72px;"
            slot="footer-actions"
        >Ok</${buttonTag}>
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

const differentListElementContentInSameLevel = `
1. Point 1
    * Sub point 1
    1. Sub point 2
    * Sub point 3
    1. Sub point 4`;

export const differentListElementInSameLevel: StoryFn = createStory(mobileWidthComponent);
differentListElementInSameLevel.play = (): void => {
    document
        .querySelector('nimble-rich-text-editor')!
        .setMarkdown(differentListElementContentInSameLevel);
};

export const longWordContentInMobileWidth: StoryFn = createStory(mobileWidthComponent);
longWordContentInMobileWidth.play = (): void => {
    document
        .querySelector('nimble-rich-text-editor')!
        .setMarkdown(
            'ThisIsALongWordWithoutSpaceToTestLongWordInSmallWidthThisIsALongWordWithoutSpaceToTestLongWordInSmallWidth'
        );
};

const newLineWithForceLineBreakContent = `
This is a line 1\\
This line enters new line using hardbreak <br> tag


This line enters new line in paragraph tag


1. Point 1
    * Sub point 1\\
      Hard break sub point content
`;

export const newLineWithForceLineBreakInMobileWidth: StoryFn = createStory(mobileWidthComponent);
newLineWithForceLineBreakInMobileWidth.play = (): void => {
    document
        .querySelector('nimble-rich-text-editor')!
        .setMarkdown(newLineWithForceLineBreakContent);
};

export const longLinkInMobileWidth: StoryFn = createStory(mobileWidthComponent);
longLinkInMobileWidth.play = (): void => {
    document
        .querySelector('nimble-rich-text-editor')!
        .setMarkdown(
            '<https://www.google.com/search?q=what+is+nimble&rlz=1C1CHBF_enIN1007IN1007&oq=what+is+nimble&aqs=chrome..69i57j0i512l9.2837j1j7&sourceid=chrome&ie=UTF-8>'
        );
};

export const hiddenRichTextEditor: StoryFn = createStory(
    hiddenWrapper(html`<${richTextEditorTag} hidden></${richTextEditorTag}>`)
);
