import type { Meta, StoryFn } from '@storybook/html';
import { html, ViewTemplate } from '@microsoft/fast-element';
import { createMatrixThemeStory, createStory } from '../../utilities/tests/storybook';
import { createMatrix, sharedMatrixParameters } from '../../utilities/tests/matrix';
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { richTextViewerTag } from '..';

const metadata: Meta = {
    title: 'Tests/Rich Text Viewer',
    parameters: {
        ...sharedMatrixParameters(),
    }
};

export default metadata;

// prettier-ignore
const component = (): ViewTemplate => html`
    <${richTextViewerTag}></${richTextViewerTag}>
`;

export const richTextViewerThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

export const hiddenRichTextViewer: StoryFn = createStory(
    hiddenWrapper(html`<${richTextViewerTag} hidden></${richTextViewerTag}>`)
);