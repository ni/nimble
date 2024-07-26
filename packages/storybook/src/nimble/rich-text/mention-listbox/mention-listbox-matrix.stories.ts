import { ViewTemplate, html } from '@microsoft/fast-element';
import type { Meta, StoryFn } from '@storybook/html';
import { listOptionTag } from '../../../../../nimble-components/src/list-option';
import { richTextMentionListboxTag } from '../../../../../nimble-components/src/rich-text/mention-listbox';
import { hiddenWrapper } from '../../../utilities/hidden';
import { loremIpsum } from '../../../utilities/lorem-ipsum';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../../utilities/matrix';
import { createStory } from '../../../utilities/storybook';

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
        const filter = anchorList[index]?.classList.contains('no-match')
            ? 'zzz'
            : '';
        element.show({
            anchorNode: anchorList[index] as HTMLElement,
            filter
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
    <span class='anchor no-match'></span>
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
