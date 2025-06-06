import { ViewTemplate, html } from '@ni/fast-element';
import type { Meta, StoryFn } from '@storybook/html-vite';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { richTextMentionListboxTag } from '@ni/nimble-components/dist/esm/rich-text/mention-listbox';
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
    const editorNodeList = document.querySelectorAll(richTextMentionListboxTag);
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

export const themeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);
themeMatrix.play = playFunction;

export const hidden: StoryFn = createStory(
    hiddenWrapper(
        html`<${richTextMentionListboxTag} hidden>
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
        </${richTextMentionListboxTag}>`
    )
);
