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
import { hiddenWrapper } from '../../utilities/tests/hidden';
import { listOptionTag } from '../../list-option';
import { numberFieldTag } from '../../number-field';
import { selectTag } from '../../select';
import { cardTag } from '..';

const metadata: Meta = {
    title: 'Tests/Card',
    parameters: {
        ...sharedMatrixParameters()
    }
};

export default metadata;

const component = (): ViewTemplate => html`
    <${cardTag}>
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
