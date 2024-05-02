import { ViewTemplate, html } from '@microsoft/fast-element';
import type { Meta, StoryFn } from '@storybook/html';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { numberFieldTag } from '@ni/nimble-components/dist/esm/number-field';
import { selectTag } from '@ni/nimble-components/dist/esm/select';
import { cardTag } from '@ni/nimble-components/dist/esm/card';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';

import { hiddenWrapper } from '../../utilities/hidden';

const metadata: Meta = {
    title: 'Tests/Card',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (): ViewTemplate => html`
    <${cardTag}>
        <span slot="title">Title</span>
        <${numberFieldTag}>Numeric field 1</${numberFieldTag}>
        <${numberFieldTag}>Numeric field 2</${numberFieldTag}>
        <${selectTag}>
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
            <${listOptionTag} value="2">Option 2</${listOptionTag}>
            <${listOptionTag} value="3">Option 3</${listOptionTag}>
        </${selectTag}>
    </${cardTag}>
`;

export const cardThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

export const hiddenCard: StoryFn = createStory(
    hiddenWrapper(html`<${cardTag} hidden>Hidden Card</${cardTag}>`)
);
