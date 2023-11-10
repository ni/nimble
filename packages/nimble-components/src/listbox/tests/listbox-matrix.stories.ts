import { ViewTemplate, html } from '@microsoft/fast-element';
import type { Meta, StoryFn } from '@storybook/html';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import {
    createMatrixThemeStory,
    createStory
} from '../../utilities/tests/storybook';
import { listboxTag } from '..';
import { listOptionTag } from '../../list-option';
import { hiddenWrapper } from '../../utilities/tests/hidden';

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
    <${listboxTag}>
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag} value="2">Option 2</${listOptionTag}>
        <${listOptionTag} value="3" disabled>Option 3</${listOptionTag}>
        <${listOptionTag} value="4">Option 4</${listOptionTag}>
        <${listOptionTag} value="5" hidden>Option 5</${listOptionTag}>
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
