import { ViewTemplate, html } from '@microsoft/fast-element';
import type { Meta, StoryFn } from '@storybook/html';
import {
    createMatrix,
    sharedMatrixParameters
} from '../../utilities/tests/matrix';
import { createMatrixThemeStory } from '../../utilities/tests/storybook';
import { listboxTag } from '..';
import { listOptionTag } from '../../list-option';

const metadata: Meta = {
    title: 'Tests/Listbox',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (): ViewTemplate => html`
    <${listboxTag}>
        <${listOptionTag} value="1">Option 1</${listOptionTag}>
        <${listOptionTag} value="2">Option 2</${listOptionTag}>
        <${listOptionTag} value="3">Option 3</${listOptionTag}>
        <${listOptionTag} value="4">Option 4</${listOptionTag}>
        <${listOptionTag} value="5">Option 5</${listOptionTag}>
    </${listboxTag}>
`;

export const listboxThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);