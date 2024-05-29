import { ViewTemplate, html } from '@microsoft/fast-element';
import type { Meta, StoryFn } from '@storybook/html';
import { listOptionTag } from '../../../../nimble-components/src/list-option';
import { numberFieldTag } from '../../../../nimble-components/src/number-field';
import { selectTag } from '../../../../nimble-components/src/select';
import { cardLitTag } from '../../../../nimble-components/src/card-lit';
import {
    createMatrix,
    sharedMatrixParameters,
    createMatrixThemeStory
} from '../../utilities/matrix';
import { createStory } from '../../utilities/storybook';

import { hiddenWrapper } from '../../utilities/hidden';

const metadata: Meta = {
    title: 'Tests/Card Lit',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (): ViewTemplate => html`
    <${cardLitTag}>
        <span slot="title">Title</span>
        <${numberFieldTag}>Numeric field 1</${numberFieldTag}>
        <${numberFieldTag}>Numeric field 2</${numberFieldTag}>
        <${selectTag}>
            <${listOptionTag} value="1">Option 1</${listOptionTag}>
            <${listOptionTag} value="2">Option 2</${listOptionTag}>
            <${listOptionTag} value="3">Option 3</${listOptionTag}>
        </${selectTag}>
    </${cardLitTag}>
`;

export const cardLitThemeMatrix: StoryFn = createMatrixThemeStory(
    createMatrix(component)
);

export const hiddenCardLit: StoryFn = createStory(
    hiddenWrapper(html`<${cardLitTag} hidden>Hidden Card</${cardLitTag}>`)
);
