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

const metadata: Meta = {
    title: 'Tests/Rich Text Editor',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

// prettier-ignore
const component = (): ViewTemplate => html`
    <${richTextEditorTag}></${richTextEditorTag}>
`;

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

export const hiddenRichTextEditor: StoryFn = createStory(
    hiddenWrapper(html`<${richTextEditorTag} hidden></${richTextEditorTag}>`)
);
