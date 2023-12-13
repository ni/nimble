import { ViewTemplate, html } from '@microsoft/fast-element';
import type { Meta, StoryFn } from '@storybook/html';
import { richTextMentionListboxTag } from '..';
import { listOptionTag } from '../../../list-option';
import { hiddenWrapper } from '../../../utilities/tests/hidden';
import { loremIpsum } from '../../../utilities/tests/lorem-ipsum';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../../utilities/tests/matrix';
import {
    createMatrixThemeStory,
    createStory
} from '../../../utilities/tests/storybook';

const metadata: Meta = {
    title: 'Tests/Rich Text Mention Listbox',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const playFunction = (): void => {
    const editorNodeList = document.querySelectorAll(
        'nimble-rich-text-mention-listbox'
    );
    const anchorList = document.querySelectorAll('.anchor');
    editorNodeList.forEach((element, index) => {
        element.show({
            anchorNode: anchorList[index] as HTMLElement,
            filter: ''
        });
    });
};

const component = (): ViewTemplate => html`
    <span class='anchor'></span>
    <${richTextMentionListboxTag} style="height: 200px">
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag} value="2" disabled>Option 2</${listOptionTag}>
        <${listOptionTag} value="3">Option 3</${listOptionTag}>
        <${listOptionTag} value="6">${loremIpsum}</${listOptionTag}>
        <${listOptionTag} value="4">Option 4</${listOptionTag}>
        <${listOptionTag} value="5">Option 5</${listOptionTag}>
    </${richTextMentionListboxTag}>

`;

export const richTextMentionListboxThemeMatrix: StoryFn = createMatrixThemeStory(createMatrix(component));
richTextMentionListboxThemeMatrix.play = playFunction;

export const hiddenRichTextMentionListbox: StoryFn = createStory(
    hiddenWrapper(
        html`<${richTextMentionListboxTag} hidden>
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
        </${richTextMentionListboxTag}>`
    )
);
