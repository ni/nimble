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

export const richTextEditorThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

export const hiddenRichTextEditor: StoryFn = createStory(
    hiddenWrapper(html`<${richTextEditorTag} hidden></${richTextEditorTag}>`)
);
