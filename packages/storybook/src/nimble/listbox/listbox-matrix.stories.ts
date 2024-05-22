import { ViewTemplate, html } from '@microsoft/fast-element';
import type { Meta, StoryFn } from '@storybook/html';
import { listOptionTag } from '../../../../nimble-components/src/list-option';
import { menuMinWidth } from '../../../../nimble-components/src/theme-provider/design-tokens';
import { listboxTag } from '../../../../nimble-components/src/listbox';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';
import { hiddenWrapper } from '../../utilities/hidden';
import { loremIpsum } from '../../utilities/lorem-ipsum';

const metadata: Meta = {
    title: 'Tests/Listbox',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const playFunction = (): void => {
    const editorNodeList = document.querySelectorAll('nimble-listbox');
    editorNodeList.forEach(element => element.selectFirstOption());
};

const component = (): ViewTemplate => html`
    <${listboxTag} style="width: var(${menuMinWidth.cssCustomProperty});">
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag} value="2">Option 2</${listOptionTag}>
        <${listOptionTag} value="3" disabled>Option 3</${listOptionTag}>
        <${listOptionTag} value="4">Option 4</${listOptionTag}>
        <${listOptionTag} value="5" hidden>Option 5</${listOptionTag}>
        <${listOptionTag} value="6">${loremIpsum}</${listOptionTag}>
    </${listboxTag}>
`;

export const listboxThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);
listboxThemeMatrix.play = playFunction;

export const hiddenListbox: StoryFn = createStory(
    hiddenWrapper(
        html`<${listboxTag} hidden>
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
        </${listboxTag}>`
    )
);
